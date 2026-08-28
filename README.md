# Data Center Truth Platform
**Verified community records for hyperscale data center projects — powered by PrecognitionOS.**

> **START HERE:** [`docs/PCOS_DATACENTER_TRUTH_HANDOFF.html`](docs/PCOS_DATACENTER_TRUTH_HANDOFF.html)
> — the complete analysis and build handoff. Everything below is a summary of it.

## The thesis
Companies and agencies don't lack the ability to publish good news about themselves. They lack
**a venue where skeptics will accept it.** Rigor isn't a constraint on this business — rigor
*is* the product. **Verified good news is the scarce commodity, and nobody is producing it.**

Three facts define the opportunity:
- Indiana's Commerce Secretary said publicly (8/27/2026) that the message about growth "is not landing."
- ~1/3 of Indiana counties have passed ordinances, moratoriums, or outright bans.
- The information genuinely is broken — the most-circulated Indiana megawatt figure (2,400 MW)
  belongs to **Amazon**, not Microsoft, and water estimates for the LaPorte site span **three
  orders of magnitude**.

## Status
| | |
|---|---|
| **Engine** | ✅ Running — 22 tables on Postgres/pgvector, `engine/run_local.sh` |
| **Evidence** | ✅ 109 min of conference audio sealed; 47-min panel **97% speaker-attributed** |
| **Pipelines** | ✅ OCR, transcription, GPU speaker diarization |
| **Findings** | ✅ 6 commitments loaded from sealed sources — **none published** |
| **Public site** | ⏳ To be scoped and built (name TBD; `INformed LaPorte` rejected) |

## What the evidence shows
Microsoft's Director of Infrastructure & Government Affairs enumerated **five commitments** on
the record at the ITIA Summit (8/27/2026) — pay full energy and infrastructure costs so
residents' bills aren't affected; minimize water and *"replenish more water than we actually
use"*; take no tax abatement; use local workers; invest in local nonprofits. Three are cleanly
measurable. **None carries a date** — the first right-of-reply question, not an accusation.

Mayor Dermody's on-stage *"we gave 15% direct to our school system"* is **congruent** with the
city's own 3/3/2026 agreement.

## The moat — six failure modes found in the field
Name proximity · participant confusion · unlabeled speakers · character voice · deceptive
metadata · and a **false fabrication flag** (we wrongly accused an AI of inventing a vote and
two names that were all real). Each produced or nearly produced a confident falsehood about a
real person. All are now blocked structurally, not by convention.

Plus a confirmed one: a summarizer produced **three different budget figures from one article**.
Figures are therefore extracted mechanically from sealed sources and never pass through an LLM.

## Non-negotiables
1. **No finding publishes without a logged right-of-reply attempt** — enforced by a database trigger.
2. **Every number links to its receipt** (document + page, or video + timestamp).
3. **"No independent measurement exists" is a first-class state**, not an empty value.
4. **Sponsor firewall** — advertisers have no influence over any figure; funding is published.
5. **Symmetry** — company-favorable and community-favorable findings both visible at launch.

## Layout
```
engine/
  schema/     22 tables, 3 migrations
  pipeline/   stages.py (12 typed stages + the gate) · diarize_transcribe.py
  seed/       laporte_seed.sql — the live commitments
  run_local.sh
site/laporte/ preview — COPY AND STRUCTURE REFERENCE ONLY, not visual design
research/
  laporte-microsoft/        commitment seed, panel findings, sealed recordings + transcripts
  article-001-steve-ellis…/ the Vigo County pilot that produced every safeguard
docs/         the handoff analysis
```

## For the site build team
Read the handoff first. Two things to know going in:
- **Build dark-only.** CyberHopeAI is dark-committed; the preview was built theme-responsive
  and rendered white on light-preference browsers. Tokens are sampled in the handoff.
- **The thermometer is the signature element**, and **empty gauges are the feature** — three of
  five LaPorte lines legitimately read "no independent measurement exists," which is the
  strongest credibility signal on the page.
