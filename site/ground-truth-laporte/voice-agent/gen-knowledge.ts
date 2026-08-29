/*
  gen-knowledge.ts — build the ElevenLabs knowledge-base document for the
  Ground Truth LaPorte phone information line.

  It imports the SAME canonical data layer the website and the sitewide search
  engine use (client/src/lib/data.ts), so the phone agent answers from exactly
  the record residents see on the site — every figure with its receipt.

  Run:  npx tsx voice-agent/gen-knowledge.ts > voice-agent/knowledge/laporte-record.md
*/
import {
  COMMITMENTS, OPEN_QUESTIONS, RECORD_GAPS, EXPLAINERS,
  CAREER_PATHS, TRAINING, PROJECT_SPINE, METHOD_PRINCIPLES,
  PIPELINE_STAGES, TIMELINE, CORRECTION, STATUS_META,
} from "../client/src/lib/data";

const out: string[] = [];
const w = (s = "") => out.push(s);

w("# Ground Truth LaPorte — Knowledge Base for the Phone Information Line");
w();
w("This is the authoritative reference for the Ground Truth LaPorte phone agent. Every fact below is drawn from the sealed public record maintained at the Ground Truth LaPorte website. Answer callers using ONLY the information in this document. Each figure carries its receipt (the document, page, recording, or timestamp it came from) — cite it when a caller asks how we know.");
w();

w("## What Ground Truth LaPorte is");
w();
w("Ground Truth LaPorte is a community information project of CyberHopeAI, built on PrecognitionOS. It tracks the promises, filings, and public record around the Microsoft data center project in La Porte, Indiana — so residents can see what was promised, what is verified, and what is still unknown, each with its source. It is independent of Microsoft, the City of La Porte, La Porte County, and the State of Indiana. Every source of funding is named on the site. Corrections are published in the open, alongside what they replaced. The motto: \"Evidence, not excuses.\"");
w();

/* ── The verified skeleton ── */
w("## The verified project spine (the facts that are independently documented)");
w();
for (const f of PROJECT_SPINE) {
  w(`- **${f.label}:** ${f.value}  _(receipt: ${f.receipt})_`);
}
w();

/* ── Commitments ── */
w("## The commitments on record — status and evidence");
w();
w("Each commitment below is tracked with a status. The status vocabulary:");
for (const [k, m] of Object.entries(STATUS_META)) {
  w(`- **${m.label}** — ${m.desc}.`);
}
w();
for (const c of COMMITMENTS) {
  w(`### ${c.name}`);
  w(`- Promised by: ${c.promisor}`);
  w(`- Category: ${c.category}`);
  w(`- Status: ${c.statusLabel} (${STATUS_META[c.status].label})`);
  if (c.target) w(`- Target: ${c.target}`);
  if (c.deadline) w(`- Deadline: ${c.deadline}${c.deadlineStated ? "" : " (no firm date was stated)"}`);
  w(`- What the record shows: ${c.summary}`);
  if (c.quote) w(`- On the record, verbatim: "${c.quote}"`);
  if (c.receipts?.length) {
    w(`- Receipts:`);
    for (const r of c.receipts) {
      w(`  - [${r.label}] ${r.source} — ${r.detail}`);
    }
  }
  w();
}

/* ── Open questions ── */
w("## Open questions — what is NOT yet confirmed");
w();
w("These are the things residents most want to know that the public record does not yet answer. If a caller asks one of these, say plainly that it is not confirmed, explain why, and name who could answer it.");
w();
for (const q of OPEN_QUESTIONS) {
  w(`### ${q.question}`);
  w(`- Current state: ${q.state}`);
  w(`- Detail: ${q.body}`);
  w(`- Who could answer: ${q.whoCouldAnswer}`);
  w();
}

/* ── Record gaps ── */
w("## Public-record gaps — documents that govern this project but are not published");
w();
for (const g of RECORD_GAPS) w(`- ${g}`);
w();

/* ── Explainers ── */
w("## Resident explainers — the questions people actually ask");
w();
for (const e of EXPLAINERS) {
  w(`### ${e.title} (${e.category})`);
  w(e.lead);
  w();
  for (const s of e.sections) {
    w(`**${s.heading}.** ${s.body}`);
    w();
  }
  w(`_Receipts: ${e.receiptNote}_`);
  w();
}

/* ── Careers & training ── */
w("## Careers created by the project");
w();
for (const cp of CAREER_PATHS) {
  w(`### ${cp.title} — ${cp.kind}`);
  if (cp.payNote) w(`- Pay note: ${cp.payNote}`);
  w(`- ${cp.description}`);
  w(`- Skills: ${cp.skills.join(", ")}`);
  w();
}

w("## Training providers — how to prepare for these jobs");
w();
for (const t of TRAINING) {
  w(`### ${t.name} — ${t.kind}`);
  w(`- Location: ${t.location}`);
  w(`- Programs: ${t.programs.join("; ")}`);
  if (t.note) w(`- Note: ${t.note}`);
  if (t.url) w(`- More: ${t.url}`);
  w();
}

/* ── Timeline ── */
w("## Timeline of the project");
w();
for (const ev of TIMELINE) {
  w(`- **${ev.date} — ${ev.title}:** ${ev.body}${ev.receipt ? `  _(receipt: ${ev.receipt})_` : ""}`);
}
w();

/* ── Correction ── */
w("## Published correction (an example of how we correct the record)");
w();
w(`**${CORRECTION.title}**`);
w();
w(CORRECTION.body);
w();
w(`Receipts: ${CORRECTION.receipts.join("; ")}`);
w();

/* ── Method ── */
w("## How the record is made (our method, in plain language)");
w();
for (const p of METHOD_PRINCIPLES) {
  w(`- **${p.title}** ${p.body}`);
}
w();
w("### The engine pipeline");
w();
for (const s of PIPELINE_STAGES) {
  w(`${s.n}. **${s.name}** — ${s.desc}`);
}
w();

/* ── Contact / actions the agent can offer ── */
w("## What callers can do (offer these when relevant)");
w();
w("- **Read the full record online** at the Ground Truth LaPorte website — every figure links to its source.");
w("- **Submit evidence or a document.** Residents can submit evidence (photos, documents, links) through the site's Submit Evidence page. Everything is quarantined and fingerprinted before review; nothing is published without verification.");
w("- **Ask a question for the record.** If the answer isn't yet in the public record, the question itself is logged as an open question with a note on who could answer it.");
w("- **Explore careers and training** for the jobs the project creates — Ivy Tech's Microsoft Datacenter Academy, Hope Training Academy, SkillDNA, and WorkOne Northwest Indiana.");
w("- **Corrections and right of reply.** Anyone named in a finding is offered a real chance to respond before it is published; their response runs alongside the finding.");
w();
w("## Rules for answering callers");
w();
w("- Answer only from this record. If it isn't here, say: \"That isn't in the public record yet\" — then name who would have to publish it. Never guess or fill gaps with outside knowledge.");
w("- Cite the receipt when asked how we know something (meeting, date, speaker, document, or timestamp).");
w("- Keep construction jobs and permanent jobs separate; keep promised figures separate from measured ones.");
w("- Stay neutral and factual. This is a record, not a campaign — good news (kept promises, false rumors corrected) is reported the same as bad.");
w("- When a figure is disputed or unconfirmed, say so and give the range rather than collapsing it to one number.");
w("- Be warm, plain-spoken, and brief. You are speaking to La Porte residents on the phone.");
w();

process.stdout.write(out.join("\n"));
