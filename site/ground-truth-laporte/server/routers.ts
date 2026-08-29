import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createHash } from "crypto";
import {
  createSubmission, listSubmissionsByUser, listAllSubmissions, updateSubmissionStatus,
  listVerifiedSubmissions,
  listMeetings, getMeetingBySlug, listMeetingCommitments, seedMeeting,
  listAllUsers, setUserRole, userStats,
} from "./db";
import { search, corpusSize } from "./search";
import { groundedChat } from "./chat";
import { storagePut } from "./storage";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "./_core/llm";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
  return next({ ctx });
});

const submissionInput = z.object({
  kind: z.enum(["evidence", "question"]),
  title: z.string().min(3).max(500),
  statement: z.string().max(5000).optional(),
  sourceUrl: z.string().max(2000).optional(),
  fileName: z.string().max(500).optional(),
  mimeType: z.string().max(120).optional(),
  /** base64-encoded file bytes, capped ~8MB */
  fileData: z.string().max(12_000_000).optional(),
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Sitewide search — one corpus over all static + DB content. Public read.
  // The AI agent + phone line reuse the same server-side search() for retrieval.
  search: router({
    query: publicProcedure
      .input(z.object({ q: z.string().max(200) }))
      .query(({ input }) => search(input.q, 40)),
    size: publicProcedure.query(() => corpusSize()),
  }),

  // On-site chat agent — registered-members-only. Grounded in the sitewide
  // search corpus (RAG) and answered by our own Azure OpenAI. protectedProcedure
  // gates it to signed-in members; anonymous visitors get FORBIDDEN.
  chat: router({
    send: protectedProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string().max(4000),
        })).min(1).max(20),
      }))
      .mutation(({ input }) => groundedChat(input.messages)),
  }),

  // Admin backend — citizen management (admin-gated). Submission moderation lives
  // under the `submissions` router (listAll / setStatus), also admin-gated.
  admin: router({
    stats: adminProcedure.query(() => userStats()),
    users: adminProcedure.query(() => listAllUsers()),
    setRole: adminProcedure
      .input(z.object({ id: z.number().int(), role: z.enum(["user", "admin"]) }))
      .mutation(({ input }) => setUserRole(input.id, input.role)),
  }),

  /* ── Evidence submissions — authenticated, quarantined by default ── */
  submissions: router({
    create: protectedProcedure
      .input(submissionInput)
      .mutation(async ({ ctx, input }) => {
        let fileKey: string | undefined;
        let fileUrl: string | undefined;
        let fileSize: number | undefined;
        let sha256: string | undefined;

        if (input.fileData && input.fileName) {
          const buffer = Buffer.from(input.fileData, "base64");
          if (buffer.length > 8 * 1024 * 1024) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "File exceeds 8MB limit" });
          }
          sha256 = createHash("sha256").update(buffer).digest("hex");
          const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
          const stored = await storagePut(
            `evidence/${ctx.user.id}/${Date.now()}-${safeName}`,
            buffer,
            input.mimeType || "application/octet-stream"
          );
          fileKey = stored.key;
          fileUrl = stored.url;
          fileSize = buffer.length;
        }

        const id = await createSubmission({
          userId: ctx.user.id,
          kind: input.kind,
          title: input.title,
          statement: input.statement,
          sourceUrl: input.sourceUrl,
          fileKey,
          fileUrl,
          fileName: input.fileName,
          mimeType: input.mimeType,
          fileSize,
          sha256,
          status: "quarantined",
        });
        return { id, sha256 };
      }),

    mine: protectedProcedure.query(({ ctx }) => listSubmissionsByUser(ctx.user.id)),

    listAll: adminProcedure.query(() => listAllSubmissions()),

    /** Public: track a submission by ID. Returns only status — no internal notes. */
    track: publicProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(async ({ input }) => {
        const db = await import("./db");
        const all = await db.listAllSubmissions();
        const sub = all.find((s) => s.id === input.id);
        if (!sub) return null;
        return {
          id: sub.id,
          kind: sub.kind,
          title: sub.title,
          status: sub.status,
          createdAt: sub.createdAt,
          releasedAt: sub.releasedAt,
        };
      }),

    /** Public: only verified submissions, stripped of quarantine-internal fields. */
    vault: publicProcedure.query(async () => {
      const rows = await listVerifiedSubmissions();
      return rows.map((s) => ({
        id: s.id,
        kind: s.kind,
        title: s.title,
        statement: s.statement,
        sourceUrl: s.sourceUrl,
        fileUrl: s.fileUrl,
        fileName: s.fileName,
        mimeType: s.mimeType,
        sha256: s.sha256,
        authenticityNotes: s.authenticityNotes,
        releasedAt: s.releasedAt,
        createdAt: s.createdAt,
      }));
    }),

    setStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["quarantined", "under_review", "verified", "rejected"]),
        notes: z.string().max(2000).optional(),
      }))
      .mutation(({ input }) => updateSubmissionStatus(input.id, input.status, input.notes)),
  }),

  /* ── Meetings & Decisions — public read, admin seed ── */
  meetings: router({
    list: publicProcedure.query(() => listMeetings()),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const meeting = await getMeetingBySlug(input.slug);
        if (!meeting) return null;
        const commitments = await listMeetingCommitments(meeting.id);
        return { ...meeting, extractedCommitments: commitments };
      }),
    summarize: publicProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ input }) => {
        const meeting = await getMeetingBySlug(input.slug);
        if (!meeting) throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" });
        if (!meeting.transcript) throw new TRPCError({ code: "BAD_REQUEST", message: "No transcript available for this session" });

        const commitments = await listMeetingCommitments(meeting.id);
        const commitmentText = commitments.length > 0
          ? commitments.map((c) => `- ${c.text}${c.speaker ? ` (${c.speaker})` : ""}${c.anchor ? ` [${c.anchor}]` : ""}`).join("\n")
          : "None extracted.";

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are the Ground Truth LaPorte summarizer. You produce concise, factual summaries of public meeting transcripts for a community evidence platform. Rules:
- Write in plain language a resident would understand.
- Structure: **What happened** (2-3 sentences), **Key commitments** (bullet list), **Money discussed** (bullet list or "None"), **Unanswered questions** (bullet list or "None").
- Never editorialize. Never add information not in the transcript.
- If a speaker is marked [UNRESOLVED] or [PROBABLE], say so.
- Keep the total summary under 300 words.`,
            },
            {
              role: "user",
              content: `Summarize this public meeting transcript.\n\nMeeting: ${meeting.title}\nBody: ${meeting.body}\nDate: ${meeting.heldOn}\n\nExtracted commitments already on record:\n${commitmentText}\n\nTranscript:\n${meeting.transcript.slice(0, 12000)}`,
            },
          ],
        });

        const content = response.choices?.[0]?.message?.content;
        return { summary: typeof content === "string" ? content : "Summary unavailable." };
      }),
    seed: adminProcedure
      .input(z.object({
        slug: z.string(),
        body: z.string(),
        title: z.string(),
        heldOn: z.string(),
        summary: z.string().optional(),
        decisions: z.array(z.string()).optional(),
        moneyDiscussed: z.array(z.string()).optional(),
        unanswered: z.array(z.string()).optional(),
        videoUrl: z.string().optional(),
        transcript: z.string().optional(),
        minutesUrl: z.string().optional(),
        commitments: z.array(z.object({
          speaker: z.string().optional(),
          speakerRole: z.string().optional(),
          text: z.string(),
          metricLabel: z.string().optional(),
          targetValue: z.string().optional(),
          anchor: z.string().optional(),
          trackerRef: z.string().optional(),
        })).default([]),
      }))
      .mutation(async ({ input }) => {
        const { commitments, ...meeting } = input;
        const id = await seedMeeting(meeting, commitments);
        return { id };
      }),
  }),

  /* ── Ask the Record — LLM grounded in the sealed corpus ── */
  ask: router({
    query: publicProcedure
      .input(z.object({ question: z.string().min(5).max(1000) }))
      .mutation(async ({ input }) => {
        // Assemble the corpus: all meetings with transcripts + commitments
        const allMeetings = await listMeetings();
        const corpusParts: string[] = [];

        for (const m of allMeetings) {
          const commitments = await listMeetingCommitments(m.id);
          const parts = [
            `## ${m.title} (${m.body}, ${m.heldOn})`,
            m.summary || "",
          ];
          if (commitments.length > 0) {
            parts.push("Commitments extracted:");
            commitments.forEach((c) => {
              parts.push(`- "${c.text}"${c.speaker ? ` — ${c.speaker}${c.speakerRole ? ` (${c.speakerRole})` : ""}` : ""}${c.anchor ? ` [${c.anchor}]` : ""}${c.targetValue ? ` target: ${c.targetValue}` : ""}`);
            });
          }
          if (m.decisions && (m.decisions as string[]).length > 0) {
            parts.push("Decisions:", ...(m.decisions as string[]).map((d) => `- ${d}`));
          }
          if (m.moneyDiscussed && (m.moneyDiscussed as string[]).length > 0) {
            parts.push("Money discussed:", ...(m.moneyDiscussed as string[]).map((d) => `- ${d}`));
          }
          if (m.unanswered && (m.unanswered as string[]).length > 0) {
            parts.push("Unanswered questions:", ...(m.unanswered as string[]).map((d) => `- ${d}`));
          }
          if (m.transcript) {
            parts.push("Transcript (excerpt):", m.transcript.slice(0, 4000));
          }
          corpusParts.push(parts.join("\n"));
        }

        const corpus = corpusParts.join("\n\n---\n\n");

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are the Ground Truth LaPorte answer engine. You answer questions about the Microsoft data center project in La Porte, Indiana, using ONLY the sealed corpus below. Rules:
- Answer in plain language a resident would understand.
- Cite the source for every claim: meeting name, date, speaker, and timestamp anchor when available.
- If the corpus doesn't contain the answer, say exactly that: "The sealed record doesn't cover that yet." Then name who would have to publish the information.
- Never editorialize. Never add information not in the corpus.
- If a speaker is marked [UNRESOLVED] or [PROBABLE], note that attribution is not confirmed.
- Keep answers under 250 words.

SEALED CORPUS:
${corpus.slice(0, 16000)}`,
            },
            { role: "user", content: input.question },
          ],
        });

        const content = response.choices?.[0]?.message?.content;
        return {
          answer: typeof content === "string" ? content : "Unable to generate an answer.",
          corpusSize: allMeetings.length,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
