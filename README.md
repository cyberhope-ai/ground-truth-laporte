# pcos-verified-community-news
Verified Community News powered by PrecognitionOS

## What this is
A community news platform modeled on the hyperlocal community-news format
(reference: [Current Publishing / youarecurrent.com](https://www.youarecurrent.com/) —
local, positive, verifiable reporting for a defined community) — with one structural
difference: **every factual claim we publish carries a sealed, PCOS-verified evidence
chain.** The reader can follow any sentence back to the primary record it rests on.

## The engine underneath
The longer-term product is a PCOS-native **fact-checking engine** — applicable to
politics, business, finance, and world events:

- **Claims ledger** — every checkable claim extracted, categorized, and assigned a
  verdict on a fixed scale: VERIFIED · CORROBORATED · UNSUPPORTED · DISPUTED · FALSE ·
  OPINION.
- **Source hierarchy** — primary record > official statement > on-record interview >
  established media > social media (a post proves a claim was *made*, never that it is
  *true*).
- **Evidence custody** — every cited source is archived at capture time (URL, archived
  copy, screenshot, sha256, timestamp) and sealed through PCOS custody, so the evidence
  behind an article survives edits, deletions, and disputes.
- **Fairness as process** — right-of-reply is a required pipeline stage, not a courtesy.

## Structure
- `research/` — one directory per article: research charter/prompt, dossier, evidence
  archive index.
  - `article-001-steve-ellis-vigo-sheriff/` — first research project: the
    "Holding Vigo County Accountable" Facebook page and its operator's campaign for
    Vigo County Sheriff. See `RESEARCH_PROMPT.md` (this doc doubles as the prototype
    of the fact-check methodology).

## Roadmap
1. Article 001 research → dossier → first published article
2. Extract the methodology from Article 001 into a reusable pipeline spec
3. Site build (hyperlocal news front end + per-article evidence-chain view)
4. Generalize the engine: business / finance / world-events verticals
