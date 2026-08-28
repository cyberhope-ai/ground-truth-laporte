# DEEP RESEARCH PROMPT — Article 001


---

## MISSION
I am wanting to develop a realtime and offline flexible business, current events, social and "political fact checking" software and want to start by researching the most powerful/popular open source models (github) that may have flexible licensing so can you help me search on the most popular and powerful political fact checking and research fact engines that have been developed for this application

1. Vane: probably the best open-source search-engine chassis

This used to be called Perplexica and has now become Vane. It has 36.5k GitHub stars and an MIT license. It can run on your own hardware, supports Ollama and cloud models, bundles SearXNG, searches web/discussions/academic sources, supports uploaded documents and domain-specific searches, and generates cited responses.

Vane GitHub repository

I would study Vane heavily for your retrieval and user-facing research layer.

But Vane itself isn't a fact checker. Think of it as the shovel, excavator and radar system rather than the judge.

2. Stanford STORM: extremely interesting for political neutrality

Stanford's STORM has 31.1k stars and an MIT license. Its specialty is researching a subject from multiple perspectives, generating questions, retrieving information and synthesizing a source-backed report.

Stanford STORM GitHub repository

This is especially compelling for political fact checking because one of the hardest problems isn't simply:

"Is statement X true?"

It's:

"What assumptions are buried in statement X, what evidence supports it, what evidence contradicts it, what competing interpretations exist, and what would cause reasonable analysts to reach different conclusions?"

That multi-perspective research mechanism could become extremely valuable.

I would borrow heavily from STORM's approach, but use it to generate competing verification hypotheses, not Wikipedia-style reports.

3. GPT Researcher: perhaps the strongest overall research-agent foundation

This one deserves serious attention.

GPT Researcher has 29.2k stars and is Apache 2.0 licensed. It explicitly describes itself as an open deep-research agent for web and local research. Its architecture creates research questions, runs crawler/research agents, source-tracks the material, filters it, and aggregates the results. It supports local documents, MCP sources and custom OpenAI-compatible model endpoints.

GPT Researcher GitHub repository

It even discusses the problems of selective sources, misinformation and researcher bias in its design rationale.

For your application, I'd consider GPT Researcher a prime candidate for the deep investigation agent.

For example:

Politician says:

"Illegal immigration increased 400% during the previous administration."

Your fast pipeline could flag it instantly, while GPT Researcher launches parallel research:

What period is being compared?
        ↓
What metric defines "illegal immigration"?
        ↓
Border encounters?
Apprehensions?
Estimated unauthorized population?
Gotaways?
Deportations?
        ↓
Retrieve DHS / CBP / Census sources
        ↓
Retrieve historical values
        ↓
Calculate percentage change
        ↓
Find context
        ↓
Find supporting evidence
        ↓
Find contradicting evidence

That's far better than asking a general LLM, "Is this true?"

4. Google DeepMind SAFE may contain one of the most important ideas

Google DeepMind's Search-Augmented Factuality Evaluator, or SAFE, is part of its long-form-factuality repo. The software is Apache 2.0.

The concept is excellent for what you're imagining:

Statement
      ↓
DECOMPOSE
      ↓
Atomic Fact #1
Atomic Fact #2
Atomic Fact #3
Atomic Fact #4
      ↓
SEARCH each fact independently
      ↓
Evidence
      ↓
Verification

Instead of scoring an entire political paragraph as "true" or "false," it breaks it into independently testable propositions.

That is HUGE.

Consider:

"Under President X, inflation reached its highest level in 40 years because government spending increased by $5 trillion."

That's not one claim.

It's several:

A: Inflation reached X%.
B: X% was the highest rate in 40 years.
C: It occurred while President X was in office.
D: Federal spending increased $5 trillion.
E: That spending was attributable to President X.
F: The spending caused the inflation.

A through D may be straightforward facts.

E requires attribution.

F is a causal inference, not merely fact retrieval.

A credible system needs to recognize that distinction.

5. FActScore is another technology I'd absolutely prototype

FActScore has an MIT license and breaks long-form text into atomic facts for individual verification.

FActScore GitHub repository

SAFE + FActScore together suggest a very strong architecture:

SPEECH
 ↓
CLAIM
 ↓
ATOMIC CLAIMS
 ↓
CHECK-WORTHINESS
 ↓
RESEARCH
 ↓
EVIDENCE
 ↓
ENTAILMENT / CONTRADICTION
 ↓
VERDICT

And this leads to another very useful model.

What I think we should actually build

Here's where this gets really interesting. 🧬

I'd architect your system as a Political Evidence Engine, not merely a "fact checker."

                 LIVE INPUT
                     │
       ┌─────────────┼─────────────┐
       ↓             ↓             ↓
     VIDEO          AUDIO         TEXT
       │             │             │
       └──────── SPEECH/TEXT ──────┘
                     │
                     ▼
            CLAIM SPOTTER
                     │
              Check-worthy?
                     │
                     ▼
           CLAIM DECOMPOSER
                     │
        ┌────────────┼─────────────┐
        ↓            ↓             ↓
     Atomic #1    Atomic #2     Atomic #3
        │            │             │
        └────────────┼─────────────┘
                     ▼
              CLAIM CLASSIFIER
                     │
     ┌───────────────┼────────────────┐
     ↓               ↓                ↓
 Historical      Numerical        Causal
     ↓               ↓                ↓
 Legal/Policy     Quote          Prediction
                     │
                     ▼
             RESEARCH PLANNER
                     │
          ┌──────────┴───────────┐
          ↓                      ↓
      REALTIME WEB          OFFLINE CORPUS
          │                      │
    SearXNG/Vane            Vector + BM25
    GPT Researcher          Knowledge graph
    STORM agents            Local documents
          │                      │
          └──────────┬───────────┘
                     ▼
               SOURCE ENGINE
                     │
             Primary sources
             Government data
             Legislation
             Court decisions
             Official statistics
             Academic research
             Journalism
             Existing fact checks
                     │
                     ▼
              EVIDENCE GRAPH
                     │
       ┌─────────────┼─────────────┐
       ↓             ↓             ↓
   MiniCheck      AlignScore       NLI
       │             │             │
       └─────────────┼─────────────┘
                     ▼
             FACT REASONER
                     │
            probabilistic verdict
                     │
                     ▼
              EVIDENCE RECEIPT

And that final Evidence Receipt is where I think the product can become special.

Instead of:

❌ FALSE

it might display:

Claim

"Unemployment doubled under President X."

Assessment

MISLEADING / CONTEXT MISSING

Evidence

Official BLS unemployment rate:

Date	Rate
Jan 2024	3.7%
Jan 2026	4.2%

Change: +13.5%, not +100%.

Confidence

97%

Sources

Bureau of Labor Statistics
Federal Reserve FRED

Evidence freshness

Checked 8 seconds ago

Audit ID

FC-2026-0826-A8734

That last piece could make this much more than another LLM application.

It becomes reproducible computational fact checking.

One other design decision I strongly recommend

I would not encode political ideology into the engine.

Instead, create a transparent source/evidence policy:

Tier 1: primary authoritative records
Tier 2: original datasets/research
Tier 3: high-quality independent secondary reporting
Tier 4: partisan/advocacy sources
Tier 5: social/user-generated claims

And don't simply decide Tier 4 is "false." Use it as evidence requiring corroboration.

More importantly, measure source independence. Twenty websites repeating the same AP story aren't twenty independent pieces of evidence.

That could be a sophisticated differentiator.

My initial technology shortlist

If I were beginning the prototype today, I'd investigate these deeply first:

Vane → open/private search infrastructure.
GPT Researcher → autonomous evidence research.
STORM → multi-perspective investigation.
SAFE + FActScore → atomic-claim decomposition.
MiniCheck + AlignScore → fast local evidence verification.
IBM FactReasoner → probabilistic truth/uncertainty engine.
ClaimBuster research → real-time check-worthy claim detection.
Meedan → human-review workflow patterns.

That's a pretty formidable ingredient shelf. ⚙️

And I think there is a significant opportunity to create something none of those projects individually provides:

real-time claim detection + deep multi-source investigation + offline evidence + probabilistic reasoning + auditable citations + political-source neut

We want Produce a complete, evidence-archived dossier on this real data we want to test it on and thus find all the 

1. **The Facebook page** "Holding Vigo County Accountable" (profile.php?id=100072057188004),
   a government-accountability page focused on Vigo County / Terre Haute, Indiana.
2. **Steve Ellis**, the person reported to operate the page, owner of the Top Guns
   firearms store, and a declared or reported candidate for **Vigo County Sheriff**.
3. **The specific factual claims the page makes about Vigo County government** — each one
   extracted, categorized, and checked against primary records.

This is NOT an opinion piece and NOT opposition research. It is symmetrical verification:
claims the page makes get checked; claims made about the page's operator get checked with
the same rigor. Where the record supports him, say so plainly. Where it contradicts him,
say so plainly. Where the record is silent, say that too.

## STARTING FACTS (with provenance — re-verify everything marked ⚠)

| Fact | Status | Source |
|---|---|---|
| FB page "Holding Vigo County Accountable \| Terre Haute IN", id=100072057188004 | VERIFIED (title only; content login-walled) | direct fetch 2026-08-26 |
| Page contact: (812) 299-3354 / steve@topguns.us | ⚠ CLAIMED | provided by tipster; appears on page per tip |
| Top Guns — firearms dealer, 5050 S 7th St, Terre Haute IN 47802; FFL transfers, indoor range, gunsmithing, training; store phone **812-299-4867**, media@topguns.us | VERIFIED | topguns.us fetched 2026-08-26 |
| ⚠ Phone discrepancy: page lists 299-3354, store lists 299-4867 | OPEN | resolve — personal vs business line? |
| YouTube video titled "Steve Ellis talks about running for Vigo County Sheriff" (DkgCs5X8Nck) | VERIFIED (title) | youtube.com 2026-08-26 — watch/transcribe in full |
| "Steve Ellis is running for Sheriff" | ⚠ CLAIMED | private tip (single source) — must be confirmed via official candidate filings |
| Ellis operates the FB page | ⚠ CLAIMED | tip + email address pattern — confirm via page transparency info, his own statements, or direct outreach |

## RESEARCH TRACKS

### Track 1 — The page itself (evidence first, analysis second)
- Access the page (public view; log-in wall noted). Catalog **every post** you can reach:
  date, text, images/video, who/what it targets (Sheriff's office? County Council?
  Commissioners? Courts? specific officials by name?), engagement counts.
- **Archive as you go**: archive.today / Wayback Machine snapshot of every post URL you
  cite, plus screenshots. Record capture timestamp and URL for each. (These become PCOS
  custody items — the article's evidence chain depends on captures made BEFORE
  publication, since pages get edited or deleted after coverage.)
- Check the page's **Page Transparency** box: creation date, name-change history,
  admin country, whether it is classified as a Page or a personal profile.
- Identify recurring **themes** (spending, jail, hiring, elections administration,
  public-records compliance…) and the page's tone (documented critique vs. insinuation).

### Track 2 — Steve Ellis: identity, business, background
- **Disambiguate the person first.** "Steve Ellis" is a common name; establish which
  Steve Ellis this is (Terre Haute/Vigo County resident, Top Guns principal) before
  attaching ANY other record to him. Every record below must match on at least two
  identifiers (name + address/business/DOB-range as available).
- Indiana Secretary of State **INBiz** business search: Top Guns entity (exact legal name,
  formation date, registered agent, principals, status, any related entities).
- **ATF FFL eZ Check / FFL listings**: confirm the federal firearms license, licensee
  name, license type, original license date.
- Professional history: any **law-enforcement, military, or corrections background**
  (relevant to a sheriff candidacy and often central to campaign claims) — verify via
  ILEA certification records if claimed, service records if claimed, employer confirmations.
- Public footprint: prior news coverage (Terre Haute **Tribune-Star**, WTHI-TV 10,
  WTWO/WAWV, MyWabashValley), prior runs for office, board/commission seats, civic roles.
- Court records: **mycase.in.gov** (Indiana) and PACER (federal) for civil/criminal
  matters involving him or the business — report only what the docket actually shows,
  with cause numbers; note disposition; do NOT characterize beyond the record.

### Track 3 — The candidacy (official paper or it isn't confirmed)
- Determine the **exact election**: Vigo County Sheriff appears on Indiana's midterm
  county cycle — establish which cycle Ellis is filed for (2026 general? a 2027 caucus?
  2028?), his **party**, and the incumbent's status (term limits: Indiana sheriffs are
  limited to two consecutive terms — check whether the seat is open).
- **Vigo County Election Board / Indiana Election Division candidate filings** (CAN-2 or
  equivalent declaration): the ONLY thing that upgrades "running for sheriff" from
  CLAIMED to VERIFIED. Get the filing date and office sought.
- **Campaign finance**: Indiana campaign finance portal — committee registration (CFA-1),
  finance reports (CFA-4): treasurer, receipts, top donors, expenditures, loans from
  self/business. Note whether the FB page is disclosed/paid for by the committee
  (a page run as "accountability journalism" by an undeclared candidate vs. a declared
  campaign organ is itself a finding — either way, report it neutrally).
- The **YouTube interview**: watch/transcribe fully. Extract every checkable claim he
  makes about himself (background, qualifications) and about the county (budgets, crime
  stats, jail, staffing). Note channel, date, interviewer relationship.
- Map the **conflict-of-interest questions a voter would ask** — a firearms dealer
  seeking the county's top law-enforcement office (e.g., how Indiana handgun-permit
  processing, sheriff's-sale firearms, or department purchasing could intersect with his
  business). Frame these strictly as QUESTIONS grounded in statute/process, with his
  response recorded — not as accusations.

### Track 4 — Claims ledger (the heart of the fact-check)
- Select the **10–20 most significant checkable claims** from the page + interview.
- For each claim, verify against PRIMARY records: county budget documents, County
  Council/Commissioners minutes and audio, Indiana State Board of Accounts audit
  reports (Gateway), jail-inspection reports, DLGF data, court dockets, sheriff's
  office statements, APRA public-records responses.
- Verdict scale (use exactly these):
  **VERIFIED** (primary record confirms) · **CORROBORATED** (2+ independent quality
  sources, no primary record) · **UNSUPPORTED** (no evidence found after real search) ·
  **DISPUTED** (credible evidence both ways — show both) · **FALSE** (primary record
  contradicts) · **OPINION** (not a factual claim — excluded from verdicts).
- Every verdict carries its **evidence chain**: source name, document title/date, URL,
  archived-copy URL, and the exact quote or figure relied on.

### Track 5 — The other side (fairness is part of verification)
- Identify every person/office the page criticizes by name. For the article we will seek
  **on-record responses** from each (list them with best contact paths: sheriff's office
  PIO, county attorney, council president…).
- Draft the **right-of-reply letter to Ellis himself**: the claims about him we intend to
  publish, offered for his response before publication — including the page-operator
  attribution, the candidacy timeline, and any COI questions.

## RULES (non-negotiable)

1. **Primary source > official statement > on-record interview > established media >
   social media.** A Facebook post is evidence that a CLAIM WAS MADE — never evidence
   that the claim is true.
2. **Two-identifier match** before attributing any record to Ellis (common name).
3. **Date-stamp everything**; when a source is behind a login/paywall, say so and record
   what was visible.
4. Ellis (as candidate) and the officials he criticizes are **public figures** — but we
   write as if we must prove every line: no characterization beyond the record, opinion
   labeled as opinion, minors and uninvolved family members excluded entirely, no home
   addresses, no doxxing.
5. Gun politics: **neutral**. His trade is a fact; treat it exactly as we would a
   candidate who owns a pharmacy or a towing company.
6. Preserve everything: this dossier's evidence archive (URLs, archives, screenshots,
   sha256 of saved files, capture timestamps) is what PCOS will seal. **A finding
   without a preserved source does not exist.**

## OUTPUT FORMAT

Return a single dossier document with these sections:

1. **Executive summary** (1 page: who, what page, what candidacy, headline findings)
2. **Subject profile — Steve Ellis** (verified biography; every line sourced)
3. **Business profile — Top Guns** (entity, FFL, footprint)
4. **The page** (history, themes, reach, transparency-box findings, post catalog)
5. **The candidacy** (filing status, cycle, party, incumbent/open-seat, finance)
6. **CLAIMS LEDGER** — table: # · claim (verbatim) · where/when made · category ·
   verdict · evidence chain · confidence note
7. **Conflict-of-interest questions** (process-grounded, neutral, with any responses)
8. **Right-of-reply list** (who must be offered comment, on what, contact path)
9. **Open questions** (what we could not resolve and what record would resolve it)
10. **Evidence archive index** (every source: URL · archive URL · capture time · sha256
    where a file was saved)
11. **Suggested article frames** (2–3 honest angles the verified record actually
    supports — e.g., "a gun dealer's accountability page becomes a sheriff campaign:
    what checks out and what doesn't")

---
*PCOS Verified Community News · Article 001 research charter · drafted 2026-08-26.*
*Methodology note: this prompt is the prototype for the PCOS fact-check engine —*
*claims-ledger schema, verdict scale, and evidence-custody rules here are intended to*
*generalize to business, finance, and world-events verification.*
