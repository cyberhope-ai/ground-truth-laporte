# ITIA Summit Panel — "Data Center Development that Works for Hoosier Communities"
**2026-08-27 · Fishers, Indiana · public ticketed conference, on-record panel**
Recording: `itia__0827_1047.mp3` · 46m51s · 531 segments · **sha256** `c75c7e26…90bd9e44`
Attributed transcript: `evidence/recordings/transcripts/itia__0827_1047.attributed.txt`

**Speaker attribution: 97% of segments speaker-confirmed** (514/531). Each mapping rests on two
independent anchors, recorded in `itia__0827_1047.segments.json`:

| Tag | Person | Basis |
|---|---|---|
| S04 | **Megan Glover**, moderator (Chief Digital Officer, Usalco) | introduced as moderator 0:00:33; assumes the role 0:00:54 and directs every question |
| S05 | **Brad Tietz**, Data Center Coalition | **self-identifies** 0:03:08; moderator names him immediately prior |
| S01 | **Mayor Tom Dermody**, City of La Porte | answers direct address "So, Mayor…" 0:29:24; speaks as city executive throughout; cites city population ~22,000 |
| S02 | **Cloteal LaBroi**, Microsoft (Dir. Infrastructure & Gov't Affairs) | answers the Microsoft site-selection question 0:33:28; speaks in Microsoft's first person |
| S00, S03 | **unresolved** | emcee + crosstalk. **Not attributed.** |

⚠ **ASR garbles proper nouns badly** — "LaPorte" appears as "the port" and "the court";
"Dermody" as "Dermi"/"Dirmity"; "Data Center Coalition" as "Dance Center Coalition". **Machine
text is the search index. Every quote below must be verified against the audio at its timestamp
before publication.**

---

## FINDING 1 — Microsoft enumerated FIVE COMMITMENTS on the record

At **0:14:09–0:15:12**, Microsoft's Director of Infrastructure & Government Affairs states them
directly, explicitly tying them to the January announcement (Brad Smith's 2026-01-13 post):

> "Firstly, [we] make five commitments. **We announced those in January.**"

| # | Commitment (verbatim, pending audio verification) | Measurable? | Ledger mapping |
|---|---|---|---|
| 1 | "we are going to **pay for our energy and our infrastructure**… that would not come on the residents. **Residents would not have high electricity bills** because of our base and consumption usage" | yes — via IURC filings + NIPSCO rate cases | `power_mw` / rate-impact |
| 2 | "we're going to **minimize our water usage** and we're going to **replenish more water than we actually use**" | **yes — this is a water-positive claim, and it is falsifiable** | `water_gpd` |
| 3 | "**we don't want to take a tax abatement**. So that tax revenue is actually going back to [LaPorte]… hospitals or schools… public safety" | yes — county assessor + city records | `tax_abatement_usd` |
| 4 | "we are looking at **student workers**… we wanted to make sure that we **use workers and labor from the community**" | partially — needs a defined local-hire metric | `local_hire_pct` |
| 5 | "**educate folks on AI infrastructure**… **invest in those nonprofits** in the communities" | partially — needs named recipients/amounts | `community_benefit` |

> "So those are five commitments to the community… **And we [will] stick to that.**"

**Why this matters for the thermometer.** These are the operator's own words, at a public event,
in front of the state's technology industry — not a press release. Commitments **1, 2 and 3 are
genuinely measurable**, and #2 ("replenish more water than we use") is the strongest kind of
promise a project can make because it can be checked and it cuts against the dominant local
fear. **If Microsoft keeps these, our site says so with receipts — which is exactly the verified
good news that no one is currently producing.**

**Gaps to close before these become ledger rows:** none carries a **date**. Under our schema
`deadline_stated = false` for all five, and that is itself publishable — *not* as an accusation,
but as the obvious first question to ask Microsoft: *by when, and measured how?*

---

## FINDING 2 — The mayor's account is CONGRUENT with LaPorte's own council record

The 15% school share he describes on stage matches the city's March 2026 agreement exactly:

> **0:17:47** — "Now we gave **15% direct to our school system**."

Council/RDC records: 15% of Microsoft property-tax revenue to La Porte Community School Corp
for 20 years, approved 2026-03-03. **CONGRUENT.** He also frames the tax posture the same way
Microsoft does — no abatement, full revenue to the community.

He additionally states (0:17:27) that because of local opposition *"I would have felt
uncomfortable forcing them to take tax money from a data center"* — context that explains the
deal's structure rather than contradicting it.

---

## FINDING 3 — Two specific, checkable public-finance claims

| Claim | Verbatim | How to check |
|---|---|---|
| The Microsoft deal **averted a local school tax referendum** | 0:20:17 — "the [school corporation] was scheduled to go for a **$6 million referendum**, which would have obviously added increased tax to our local residents" | DLGF controlled-project referendum filings; LPCSC board minutes. **High public interest — this is a direct "what did this save me?" answer** |
| Statewide referendum wave | 0:20:02 — "**32 to 38 school corporations** are going to a referendum for **$500 million**, including… Michigan City right next to us" | DLGF referendum list (2026 cycle) |

Both are precise, dated, falsifiable, and go straight to the questions residents actually ask.
Note the mayor's own hedge — "I think I saw 32 to 38" — which is honest imprecision and should
be quoted **with** the hedge, not tightened.

---

## FINDING 4 — Construction workforce, and a figure to reconcile

> **0:23:13** — "I don't know what data centers you're working on for 20 to 30 people."
> **0:23:19** — "we have construction jobs right now that Microsoft is going to need."
> **0:23:25** — "We have **2,000 local contractors** that is on the axis [max?] of our capacity."

This sits beside the already-seeded conflict: **300–400** construction workers (April 2026 open
house) vs **2,000+/day peak** (June groundbreaking). The mayor's "2,000 local contractors" is a
third framing — *available local capacity*, not workers on site. **Three numbers, three different
meanings.** Ask; do not merge them.

---

## FINDING 5 — Both sides describe the same playbook: retail education

Microsoft (0:11:35–0:12:16) credits the mayor's direct outreach — small groups, coffee shops —
as what made the project possible. The mayor describes it as deliberate method:

> **0:15:59** — "we met with **10 to 15 people at a time**… when you get to the 15 to 25,
> everybody wants to… stand out by yelling personal things."

And a union framing: **"we made this 100% union investment"** (0:16:22), with "**150 union
representatives** standing outside the front door of city hall" (0:16:38).

**This is the answer to the question Secretary Goodrich raised the same day** — that officials
"need to better communicate the benefits of growth." The mayor's stated method is *small-room,
face-to-face, before the vote*. Whether that generalizes is a fair open question; that it is
what he says worked is now on the record.

---

## What goes into the engine

1. **Five Microsoft commitments → `commitment` rows**, all `deadline_stated = false`, promisor
   = Microsoft, sourced to *video + timestamp* with the sha256 in custody.
2. **The mayor's 15% statement → a CONGRUENT congruence finding** (said vs. did), the first
   positive verdict in the LaPorte set.
3. **The $6M averted referendum and the 32–38/$500M statewide figures → claims ledger**, both
   `OPEN`, both resolvable against DLGF.
4. **Right of reply**: Microsoft and the mayor get asked about the missing dates on all five
   commitments, and about the three construction-workforce figures, **before anything publishes.**

## Provenance note for the published site
This recording was captured by an attendee at a **public, ticketed industry conference** where
panelists spoke on the record to an audience of several hundred. That provenance is recorded in
`_custody.json` and should be stated plainly wherever these quotes appear.
