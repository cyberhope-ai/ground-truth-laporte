# Ground Truth LaPorte — Community Data Center Resource

A verified public record of the Microsoft data center project in La Porte, Indiana. Every commitment tracked, every figure traceable to the document or recording it came from. Free, independent, and open to anyone: supporter, skeptic, reporter, or the company itself.

**Live site:** [laportetrth-kqhkb69n.manus.space](https://laportetrth-kqhkb69n.manus.space)

**Powered by:** [PrecognitionOS](https://github.com/cyberhope-ai/pcos-verified-community-news) · [CyberHopeAI](https://cyberhopeai.com)

---

## What this is

A full-stack community fact-checking platform built on the PCOS engine. It tracks every public commitment made about the Microsoft data center in La Porte, Indiana — from the June 2024 announcement through the May 2026 annexation vote to the June 2026 groundbreaking — and holds each one against the sealed evidence record.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | The Record — hero, correction, thermometer preview, project spine, timeline, map |
| `/tracker` | Commitment Thermometer — 12 tracked commitments with receipts and provenance |
| `/learn` | Explainers — electricity, water, taxes, jobs, decommissioning |
| `/careers` | Career paths, training providers, Hope Training Academy, SkillDNA |
| `/ask` | Evidence-grounded Q&A — curated answers + free-form LLM query |
| `/meetings` | Meetings & Decisions — 11 sessions, 33 extracted commitments, video evidence |
| `/corrections` | Public log of every corrected figure with receipts |
| `/vault` | Evidence Vault — verified community submissions with SHA-256 seals |
| `/how-we-work` | Methodology, pipeline, funding firewall, team |
| `/submit` | Evidence submission — authenticated, quarantine-by-default, S3 upload |

## Stack

- **Frontend:** React 19, Tailwind CSS 4, wouter, tRPC client
- **Backend:** Express 4, tRPC 11, Drizzle ORM (MySQL/TiDB)
- **Auth:** Manus OAuth (contributor accounts)
- **Storage:** S3 (evidence file uploads)
- **LLM:** Built-in Forge API (meeting summaries, free-form Ask)
- **Maps:** Google Maps (interactive project map with toggleable layers)
- **Testing:** Vitest (7 tests)

## Database

Four tables: `users`, `submissions`, `meetings`, `meeting_commitments`. Schema in `drizzle/schema.ts`. Seed scripts in `server/seed-meetings*.mjs`.

## Key design decisions

- **Dark-only theme** — the handoff mandates it; the brand tokens are sampled from cyberhopeai.com
- **Quarantine-by-default** — nothing submitted becomes public without authenticity review
- **Receipts on everything** — every figure carries its source anchor; no bare numbers
- **Honest gaps** — "what we don't know" is a first-class section on every explainer
- **Corrections published in the open** — the same way we publish findings

## Development

```bash
pnpm install
pnpm dev        # starts on :3000
pnpm test       # vitest
pnpm check      # tsc --noEmit
```

## License

Community resource. Content is public domain; code is MIT.
