/*
  Grounded chat agent — the members-only on-site assistant.

  Every answer is grounded in the sitewide search corpus (server/search.ts):
  we retrieve the most relevant records for the member's question, hand them to
  the model as the ONLY allowed source, and ask it to answer plainly with the
  receipt. It never invents figures — if the record doesn't cover it, it says so.

  LLM = our own Azure OpenAI (gpt-5-mini) via the OpenAI v1-compatible surface,
  with reasoning_effort=minimal for fast, cheap, deterministic answers. Config
  comes from env (AZURE_OPENAI_ENDPOINT / _KEY / _DEPLOYMENT); no Manus Forge.
*/
import { retrieve, type RetrievedDoc } from "./search";

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type ChatSource = { title: string; section: string; url: string };
export type ChatReply = { answer: string; sources: ChatSource[]; grounded: boolean };

const SYSTEM_PROMPT = `You are the Ground Truth LaPorte assistant — a helpful, plain-spoken guide to the community record of the Microsoft data center project in La Porte, Indiana. You are speaking with a signed-in member on the website.

Rules:
- Answer ONLY from the RECORD provided below. It is drawn from the same sealed public record the member sees on the site.
- If the record does not answer the question, say so plainly — "That isn't in the public record yet" — and name who would have to publish it (a city utility, the IURC, Microsoft, the county, etc.). Never guess, never use outside knowledge, never invent a figure.
- When you state a fact, cite its receipt in plain terms (the meeting and date, the speaker, the document, or the recording timestamp) when the record gives one.
- Keep promised figures separate from measured ones, and construction jobs separate from permanent jobs.
- When a number is disputed or unconfirmed, give the range and say it's unconfirmed — do not collapse it to one figure.
- Stay strictly neutral and factual. This is a record, not a campaign.
- Be concise and conversational. Short paragraphs. You're in a chat box, not writing an essay.`;

function buildContext(docs: RetrievedDoc[]): string {
  if (docs.length === 0) return "(no matching records found)";
  // Cap each doc so a few long transcripts can't blow the context budget.
  return docs
    .map((d, i) => {
      const body = d.text.length > 1400 ? d.text.slice(0, 1400) + " …" : d.text;
      return `[${i + 1}] (${d.section}) ${d.title}\n${body}`;
    })
    .join("\n\n");
}

function azureConfig() {
  const endpoint = (process.env.AZURE_OPENAI_ENDPOINT || "").replace(/\/$/, "");
  const key = process.env.AZURE_OPENAI_KEY || process.env.AZURE_OPENAI_API_KEY || "";
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-5-mini";
  if (!endpoint || !key) throw new Error("AZURE_OPENAI_ENDPOINT / AZURE_OPENAI_KEY not configured");
  return { endpoint, key, deployment };
}

/** Answer a member's question grounded in the sealed record. */
export async function groundedChat(messages: ChatMessage[]): Promise<ChatReply> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const query = (lastUser?.content || "").trim();
  if (query.length < 2) return { answer: "What would you like to know about the record?", sources: [], grounded: false };

  // Retrieve on the last user turn (plus the prior user turn for follow-ups).
  const priorUser = [...messages].reverse().filter((m) => m.role === "user")[1];
  const retrievalQuery = priorUser ? `${priorUser.content}\n${query}` : query;
  const docs = await retrieve(retrievalQuery, 10);
  const context = buildContext(docs);

  const { endpoint, key, deployment } = azureConfig();

  // Keep the last few turns for conversational context; ground on THIS turn's records.
  const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
  const chatMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(0, -1),
    {
      role: "user",
      content: `RECORD (the only source you may use):\n\n${context}\n\n---\nMember's question: ${query}`,
    },
  ];

  const resp = await fetch(`${endpoint}/openai/v1/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: deployment,
      messages: chatMessages,
      max_completion_tokens: 800,
      reasoning_effort: "minimal",
    }),
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`chat LLM failed: ${resp.status} ${resp.statusText} – ${t.slice(0, 300)}`);
  }
  const data: any = await resp.json();
  const answer: string = data?.choices?.[0]?.message?.content?.trim() || "Sorry — I couldn't find that in the record. Try rephrasing, or ask about power, water, taxes, jobs, or a specific meeting.";

  // Surface the sources the answer was grounded in (dedup by url+title).
  const seen = new Set<string>();
  const sources: ChatSource[] = [];
  for (const d of docs) {
    const k = d.url + "|" + d.title;
    if (seen.has(k)) continue;
    seen.add(k);
    sources.push({ title: d.title, section: d.section, url: d.url });
    if (sources.length >= 5) break;
  }

  return { answer, sources, grounded: docs.length > 0 };
}
