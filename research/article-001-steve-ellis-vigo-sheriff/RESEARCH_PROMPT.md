# DEEP RESEARCH PROMPT — Article 001
## Message-Congruence Analysis: Steve Ellis — Vigo County Council President & Republican nominee for Vigo County Sheriff

> Paste this entire prompt into the research agent. It is self-contained.
> **The question is not "is he good or bad." The question is: does he say the same thing
> in every room?** Concerned citizens want to know whether a candidate's public messaging
> is CONGRUENT across every channel — and whether what he says in public matches how he
> votes and speaks in the county's own records.
> Product: a verified congruence dossier + claims ledger that becomes (a) a community-news
> article and (b) the prototype dataset for the PCOS fact-check engine.

---

## WHY THIS IS THE FIRST PROJECT

A sitting county fiscal officer running for the county's top law-enforcement job is the
ideal first test of the engine: he has **two public records at once** — what he SAYS on
Facebook/YouTube/radio/news, and what he DOES in recorded council votes and minutes.
Congruence between those two is measurable. That measurement is the product.

## VERIFIED STARTING FACTS (established 2026-08-26 — do not re-litigate; extend)

| Fact | Status | Source |
|---|---|---|
| **Steve Ellis is 2026 PRESIDENT of the Vigo County Council** (elected At-Large) | VERIFIED | Vigo County council roster |
| Republican **nominee** for Vigo County Sheriff; won primary **57.25%** (May 2026); faces Democrat **Derek Fell** in the Nov 2026 general | VERIFIED | Tribune-Star, MyWabashValley |
| Ballotpedia candidate page exists (2026 cycle) | VERIFIED | ballotpedia.org |
| Owns **Top Guns**, opened **2017** — retail/wholesale firearms, 3 indoor ranges, training; 5050 S 7th St, Terre Haute IN 47802 | VERIFIED | topguns.us + Tribune-Star |
| Claims **~17 years** as special/reserve deputy + **B.S. criminology, Indiana State University** | ⚠ CLAIMED (his own statements) — VERIFY independently | news coverage |
| Operates/associated with FB page **"Holding Vigo County Accountable"** (id=100072057188004) | ⚠ CLAIMED (tip + steve@topguns.us contact) — VERIFY | tip |
| Page contact (812) 299-3354 vs store 812-299-4867 | OPEN discrepancy | direct fetch |
| **25 Vigo County Council meeting minutes PDFs (June 2025 – June 2026) already downloaded, sha256-indexed, and OCR'd** in `evidence/vigo-council-minutes/` + `evidence/vigo-council-text/` | DONE | see `_evidence_index.json` |

## THE CORE METHOD — THE CONGRUENCE MATRIX

Build a matrix: **rows = issue positions**, **columns = channels**. Fill every cell with
what he said there, when, and verbatim. Then score congruence per issue.

**Channels to sweep (each is a column):**
1. **Facebook** — "Holding Vigo County Accountable" + any personal/campaign page/profile
2. **YouTube** — incl. `DkgCs5X8Nck` "Steve Ellis talks about running for Vigo County Sheriff"
3. **Radio** — WIBQ The Talk Station (1230/1440/97.9) interviews and any archives
4. **TV/news** — WTHI-TV 10, WTWO/WAWV, MyWabashValley, Tribune-Star (tribstar.com), Yahoo syndications
5. **Print/candidate materials** — Ballotpedia profile & any candidate survey answers, campaign site, mailers, endorsements
6. **Speeches/forums** — candidate forums, debates, party events, Chamber events
7. **PRIMARY GOVERNMENT RECORD — Vigo County Council minutes** (already captured): every
   appearance, motion, second, vote, and quoted statement
8. **Community venues** — churches, school board/schools, Chamber of Commerce, civic clubs
   (Rotary/Kiwanis/Lions), veterans' organizations, fraternal orders, neighborhood groups

**Issue rows (extend as the record dictates):**
county budget & tax levies · jail (conditions, overcrowding, funding, the jail lawsuit/
consent issues if any) · sheriff's office budget, staffing & pay · public safety/crime ·
county spending and transparency · public-records/open-meetings compliance · drugs/opioids ·
school safety/SROs · economic development & incentives · relations with Terre Haute city
government · his own business/firearms interests · personnel and hiring · anything he
himself makes a signature issue

**For every cell record:** verbatim quote (short) · date · channel · URL · archived URL ·
capture timestamp · context (who was the audience?).

## CONGRUENCE VERDICT SCALE (use exactly these)

- **CONGRUENT** — same substantive position across channels; wording differs, meaning doesn't.
- **EMPHASIS SHIFT** — same position, materially different emphasis by audience (normal
  political behavior; report it neutrally, do not treat as a flip).
- **INCOMPLETE** — position stated in one channel, silent in others (note the gap; silence
  is not a contradiction).
- **INCONGRUENT** — materially different positions in different rooms; show both verbatim.
- **CONTRADICTED BY RECORD** — public statement conflicts with his own recorded council
  vote or an official document. **This is the highest-value finding — require the vote
  citation (document + page + date) before asserting it.**
- **EVOLVED** — position changed over time and he has acknowledged/explained the change
  (an evolution honestly labeled is NOT a flip — say so).

⚠ **The fairness rule that protects the whole project:** a politician emphasizing different
priorities to different audiences is ordinary and not dishonest. Only *substantive
contradiction* counts. And a changed mind, openly explained, is a virtue — the engine
must be able to tell the difference between flip-flopping and learning.

## RESEARCH TRACKS

### Track 1 — Council record (PRIMARY; already captured, now mine it)
Work from `evidence/vigo-council-text/*.txt` (OCR'd, page-marked):
- Extract **every** mention of Ellis: motions made/seconded, votes cast (aye/nay/abstain),
  statements quoted, committee assignments, his election as President (1/6/26
  organizational meeting).
- Build a **vote ledger**: date · agenda item · dollar amount · his vote · what he said.
- Flag every vote that touches: sheriff's office, jail, public safety, salaries/hiring,
  county budget/levy, and anything intersecting firearms or his business.
- Note OCR uncertainty: mark any quote where OCR confidence is questionable and
  **verify against the source PDF page image before publication**. Never publish an OCR
  artifact as a quote.
- Cross-check against the county's **meeting audio/video** if published, and against
  Tribune-Star's contemporaneous meeting coverage.

### Track 2 — Broad Vigo County community sweep
Search each of these for him speaking, or others speaking about him:
- **Schools** — Vigo County School Corporation board minutes/agendas, school-safety
  discussions, SRO funding (council funds these — congruence goldmine)
- **Churches** — candidate appearances, forums hosted by congregations
- **Chamber of Commerce** — Terre Haute Chamber events, candidate forums, business surveys
- **Other county bodies** — Commissioners, Sheriff's Merit Board, jail/justice committees,
  Redevelopment Commission, drainage/health boards where council intersects
- **City of Terre Haute** — council/mayor interactions
- **Civic/veteran/fraternal organizations**, gun clubs, Second Amendment groups
- **Local media archives + letters to the editor**, both by him and about him
- **Court records** (mycase.in.gov, PACER) — only what dockets show, with cause numbers

### Track 3 — Candidacy & finance
- Official filing (declaration/CAN-2), primary result certification, general-election
  ballot status; party; incumbent status of the seat (Indiana sheriffs: 2-consecutive-term
  limit — establish whether it's an open seat and who the incumbent is).
- **Campaign finance** (Indiana campaign finance portal, CFA-1/CFA-4): committee,
  treasurer, receipts, donors, expenditures, self/business loans. Note any spending on
  the Facebook page or media buys; note donors with county business (report neutrally).
- **The dual-role question, framed as process, not accusation:** he votes on the sheriff's
  office budget while seeking to lead it. Document (a) whether he has recused on
  sheriff-related votes, (b) what Indiana conflict-of-interest law (IC 35-44.1-1-4
  conflict of interest; IC 36-2-3 council duties) actually requires, and (c) his own
  explanation. Ask; print his answer.

### Track 4 — The Facebook page attribution
- Establish **whether Ellis operates the page**: Page Transparency (creation date, name
  history, admin country, page-vs-profile), his own statements, the steve@topguns.us
  contact, disclaimers, campaign-finance disclosure of page spending.
- Catalog every reachable post: date, target, claim, engagement. Archive each BEFORE
  contact is made — pages get scrubbed once coverage is known.
- **Then compare the page's positions to his council votes.** A page demanding fiscal
  restraint run by a council president who voted for the spending is the single most
  newsworthy congruence test available. Verify both sides rigorously before asserting.

### Track 5 — Claims ledger (factual accuracy layer)
Independent of congruence: take the **15–25 most significant factual claims** he makes
(about the county budget, jail, crime rates, staffing, his own record/qualifications) and
verify each against primary records: county budget documents, **Indiana Gateway** (DLGF
budgets, SBOA audit reports), council minutes, sheriff's office data, Indiana State Police/
FBI UCR-NIBRS crime data, jail inspection reports, APRA records requests where needed.
Verdicts: **VERIFIED · CORROBORATED · UNSUPPORTED · DISPUTED · FALSE · OPINION**.
Verify his biography claims too (17 years reserve/special deputy — ILEA or agency
confirmation; ISU criminology degree — registrar/NSC confirmation).

### Track 6 — Fairness / right of reply
- List everyone criticized by name (page or statements) with contact paths for comment.
- Draft the **right-of-reply letter to Ellis**: every finding we intend to publish —
  page attribution, congruence findings, the dual-role question, biography verification —
  with a real deadline. **His response is part of the article, not an afterthought.**
- Same courtesy to **Derek Fell** (opponent) if any finding involves him; and note that
  scrutiny applied to Ellis in this pilot should be applied to Fell in a companion piece —
  the engine's credibility depends on symmetry.

## RULES (non-negotiable)

1. **Primary record > official statement > on-record interview > established media >
   social media.** A post proves a claim was MADE, never that it is TRUE.
2. **Two-identifier match** before attaching any record to him ("Steve Ellis" is common).
3. **Archive at capture time** — URL, archive.today/Wayback copy, screenshot, sha256,
   timestamp. A finding without a preserved source does not exist.
4. **No OCR quotes without image verification.** Machine text is a search index, not a
   quotation source.
5. **Neutral on guns and on party.** His trade is a fact, treated exactly as a pharmacy or
   towing company would be. No partisan framing in either direction.
6. **Emphasis ≠ contradiction. Evolution ≠ flip-flop.** Say which one you found.
7. Public figures, public conduct only: no minors, no uninvolved family, no home
   addresses, no doxxing, nothing about private life that isn't squarely relevant to
   fitness for the office.
8. **Where he checks out, say so as loudly as where he doesn't.** A congruence report that
   only finds fault is opposition research wearing a lab coat, and readers can smell it.

## OUTPUT FORMAT

1. **Executive summary** — who he is, what was examined (channels + date range + document
   count), headline congruence findings both ways
2. **Subject profile** — verified biography, every line sourced; note unverified claims
3. **The council record** — vote ledger + statements, with document/page citations
4. **THE CONGRUENCE MATRIX** — issues × channels, each cell with verbatim + date + source
5. **Congruence findings** — one entry per issue: verdict from the scale, the evidence on
   both sides, and a plain-English "what this means for a voter"
6. **CLAIMS LEDGER** — # · claim (verbatim) · where/when · category · verdict · evidence
   chain · confidence
7. **The Facebook page** — attribution evidence, post catalog, page-vs-vote comparison
8. **Dual-role / conflict questions** — statute-grounded, with his response
9. **Right-of-reply record** — who was asked what, when, and what they said (or declined)
10. **Open questions** — unresolved items and exactly what record would resolve them
11. **Evidence archive index** — every source: URL · archive URL · capture time · sha256
12. **Suggested article frames** — 2–3 honest angles the verified record supports
13. **ENGINE NOTES** — what worked, what was hard, what should be automated (this becomes
    the spec for the PCOS fact-check engine: schema, verdict scales, custody format,
    OCR pipeline, channel-sweep checklist)

---
*PCOS Verified Community News · Article 001 research charter (v2 — congruence method) ·*
*drafted 2026-08-26. Methodology prototype for the PCOS fact-check engine; the schema here*
*is intended to generalize to business, finance, and world-events verification.*
