/*
  Sitewide search engine — one corpus over EVERYTHING on the site: the static
  canonical content (commitments, corrections, timeline, spine, explainers,
  careers, open questions, record gaps) plus the live DB content (meetings,
  extracted meeting-commitments, verified evidence-vault submissions).

  This is a server-side engine on purpose: the web /search UI queries it via
  tRPC, and the embedded AI agent + the LaPorte phone information line will reuse
  the exact same `search()` for retrieval-grounded answers over the whole record.
*/
import * as data from "../client/src/lib/data";
import { listMeetings, listMeetingCommitments, listVerifiedSubmissions } from "./db";

export type SearchResult = {
  id: string;
  kind: string;
  title: string;
  section: string;
  url: string;
  snippet: string;
  score: number;
};

type Doc = { id: string; kind: string; title: string; section: string; url: string; text: string };

/** Recursively flatten every string/number in a content object into one blob. */
function flat(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) return v.map(flat).join(" ");
  if (typeof v === "object") return Object.values(v as Record<string, unknown>).map(flat).join(" ");
  return "";
}

function titleOf(o: any, fallback: string): string {
  return (o && (o.name || o.title || o.question || o.label || o.wrongFigure || o.event)) || fallback;
}

let _corpus: Doc[] | null = null;
let _builtAt = 0;
const TTL_MS = 120_000;

async function build(): Promise<Doc[]> {
  const docs: Doc[] = [];
  const pushAll = (arr: any[] | undefined, kind: string, section: string, url: string) => {
    (arr || []).forEach((o, i) =>
      docs.push({ id: `${kind}:${o?.id ?? i}`, kind, section, url, title: titleOf(o, section), text: flat(o) }),
    );
  };

  // ── Static canonical content (imported straight from data.ts) ──
  pushAll((data as any).COMMITMENTS, "commitment", "Commitment tracker", "/tracker");
  pushAll((data as any).OPEN_QUESTIONS, "question", "Open questions", "/tracker");
  pushAll((data as any).EXPLAINERS, "explainer", "Learn", "/learn");
  pushAll((data as any).TIMELINE, "timeline", "Project timeline", "/tracker");
  pushAll((data as any).PROJECT_SPINE, "fact", "The verified spine", "/tracker");
  pushAll((data as any).CAREER_PATHS, "career", "Careers & training", "/careers");
  pushAll((data as any).TRAINING, "training", "Careers & training", "/careers");
  ((data as any).RECORD_GAPS as string[] | undefined)?.forEach((g, i) =>
    docs.push({ id: `gap:${i}`, kind: "gap", section: "Record gaps", url: "/tracker", title: "Record gap", text: g }),
  );
  if ((data as any).CORRECTION)
    docs.push({
      id: "correction:0", kind: "correction", section: "Corrections", url: "/corrections",
      title: titleOf((data as any).CORRECTION, "Correction"), text: flat((data as any).CORRECTION),
    });

  // ── Live DB content ──
  try {
    const meetings = await listMeetings();
    for (const m of meetings as any[]) {
      docs.push({
        id: `meeting:${m.id}`, kind: "meeting", section: "Meetings & decisions", url: "/meetings",
        title: m.title, text: flat({ t: m.title, body: m.body, s: m.summary, tr: m.transcript, d: m.decisions, u: m.unanswered, mo: m.moneyDiscussed }),
      });
      const mcs = await listMeetingCommitments(m.id);
      for (const mc of mcs as any[]) {
        docs.push({
          id: `mc:${mc.id}`, kind: "meeting-commitment", section: "Meeting commitment", url: "/meetings",
          title: `${mc.speaker || "Speaker"} — ${(mc.text || "").slice(0, 54)}`, text: flat(mc),
        });
      }
    }
    const vault = await listVerifiedSubmissions();
    for (const s of vault as any[]) {
      docs.push({
        id: `vault:${s.id}`, kind: "vault", section: "Evidence vault", url: "/vault",
        title: s.title, text: flat({ t: s.title, st: s.statement, n: s.authenticityNotes }),
      });
    }
  } catch (e) {
    console.error("[search] DB corpus build failed (static content still searchable):", e);
  }
  return docs;
}

async function getCorpus(): Promise<Doc[]> {
  const now = Date.now();
  if (!_corpus || now - _builtAt > TTL_MS) {
    _corpus = await build();
    _builtAt = now;
  }
  return _corpus;
}

/** Full-text search across the whole site. Returns ranked results with snippets. */
export async function search(query: string, limit = 40): Promise<SearchResult[]> {
  const q = (query || "").trim().toLowerCase();
  if (q.length < 2) return [];
  const terms = q.split(/\s+/).filter((t) => t.length > 1);
  const docs = await getCorpus();
  const out: SearchResult[] = [];

  for (const d of docs) {
    const title = d.title.toLowerCase();
    const hay = (d.title + " \n " + d.text).toLowerCase();
    let score = 0;
    if (hay.includes(q)) score += 35; // exact phrase anywhere
    if (title.includes(q)) score += 45; // exact phrase in the title
    for (const t of terms) {
      if (title.includes(t)) score += 10;
      const count = hay.split(t).length - 1;
      if (count > 0) score += Math.min(count, 6) * 2;
    }
    if (score <= 0) continue;

    const full = d.text.replace(/\s+/g, " ").trim();
    let idx = full.toLowerCase().indexOf(terms[0] || q);
    if (idx < 0) idx = full.toLowerCase().indexOf(q);
    let snippet: string;
    if (idx >= 0) {
      const s = Math.max(0, idx - 70);
      snippet = (s > 0 ? "…" : "") + full.slice(s, s + 210).trim() + (full.length > s + 210 ? "…" : "");
    } else {
      snippet = full.slice(0, 190) + (full.length > 190 ? "…" : "");
    }
    out.push({ id: d.id, kind: d.kind, title: d.title, section: d.section, url: d.url, snippet, score });
  }

  out.sort((a, b) => b.score - a.score);
  return out.slice(0, limit);
}

/** Total number of indexed documents — surfaced on the search page. */
export async function corpusSize(): Promise<number> {
  return (await getCorpus()).length;
}
