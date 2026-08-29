# Research Notes — La Porte Data Center Community Resource Site

## Brand (from cyberhopeai.com + handoff doc)
- Dark-only design. Tokens: bg #0a0d14, panel #141b26, line #222c3a, gold #d1a84b, verified green #31d296, text #e9eaee, muted #6f7d8d, warn #d9ab45, bad #e8776b
- Type: Space Grotesk 700 (display), IBM Plex Sans (body), IBM Plex Mono (labels/data/eyebrows)
- Voice: short, declarative — "Evidence. Not Excuses."
- Signature element: THE THERMOMETER — horizontal gauges that fill as commitments are independently confirmed. Empty gauges are the feature.
- Every number gets a receipt affordance (document + page, or video + timestamp)

## Site name decision
- "INformed LaPorte" was REJECTED in handoff. Directions: Ground Truth, Receipts, Hyperscale Record, Baseline/Meridian/The Gauge.
- User's brief: "community action resource powered by PrecognitionOS", La Porte IN focused, Microsoft data center.
- Choose a name that works: "LaPorte Truth" / "The LaPorte Record" / "Ground Truth LaPorte". Handoff favors "Ground Truth" direction (tech-credible, non-partisan, travels nationally). I'll use "Ground Truth LaPorte" with "Powered by PrecognitionOS" — matches handoff recommendation #1.

## Verified facts (from repo seed SQL + commitment seed + news)
### Project spine
- Microsoft LaPorte Data Center Campus, Boyd Boulevard / Radius Industrial Park, 489 acres phase 1 + Pleasant Township annexation (~1,000-1,300 acres total, 17 buildings)
- Announced 2024-06-04 by Gov. Holcomb. $1B investment, 245,000 sq ft initial building
- Groundbreaking 2026-06-17/18. Phase 1: 6 buildings + 1 substation. First building complete spring 2029, 3 of 6 by end 2029
- IEDC 35-year sales-tax credit (extendable to 45), performance-based
- Electric utility: NIPSCO. Water: City of La Porte municipal
- County ordinance 2026-05-06 unanimous: setbacks, noise, water limits, industrial zoning only (2nd in Indiana after Lake County)
- Land purchase ~119.5 acres @ $145,000/acre ≈ $17.3M

### The six seeded commitments (from laporte_seed.sql — ITIA Summit 8/27/2026, speaker Cloteal LaBroi, Microsoft Director of Infrastructure & Government Affairs, 97% speaker-attributed panel)
1. Pay full energy + infrastructure costs so residents' bills not affected (0:14:13) — no date
2. Minimize water, "replenish more water than we actually use" (0:14:23) — target 100%+ — no date
3. No tax abatement — revenue to hospitals/schools/public safety (0:14:29) — corroborated by 3/3/2026 rescission
4. Local workers and labor incl. student workers (0:14:43) — no metric
5. Invest in local nonprofits, AI infrastructure education (0:14:53) — no amount
6. 15% of Microsoft property-tax revenue to La Porte schools, 20 years (Mayor Dermody 0:17:47, city agreement 3/3/2026) — dated, term to 2048

### Additional candidate commitments (COMMITMENTS_SEED.md)
- Jobs: up to 200 permanent by end-2032 (LEAP/IEDC, council minutes 6/3/24); revised 600+ (Microsoft, 6/17/26) — tripled with no published methodology
- Construction jobs: 300-400 (4/21/26) vs 2,000+/day peak (6/17/26) — figures conflict
- $1M to LPCSC for AI proficiency (council minutes 5/18/26)
- ~$4M ecological/stormwater restoration; $300K Travis Ditch; $200K professional services (council minutes 5/18/26)
- Ivy Tech Datacenter Academy MOU signed 6/17/26, launch 2027-28 school year
- Boyd Blvd stormwater project $5,349,750 (city RDC minutes 4/29/26) — documented
- $2.60/sq ft payment for city services (first building)
- Microsoft gave up 40-year personal-property exemption worth up to $100M PILOT terms; now pays full property tax

### Contested/unresolved (publish as open questions)
- Megawatts: NOT CONFIRMED. "538 MW" only on aggregator sites, no cited source. No Microsoft-named IURC cause.
- CONFLATION TRAP: IURC Cause 46362 (2,400 MW GenCo at Schahfer/Mitchell) is AMAZON — not Microsoft. Zero mentions of LaPorte/Microsoft in the order. Cause 46322 also Amazon. THE key correction.
- Water: NOT CONFIRMED. ~1,000 gal/day/building (Warner, ≈3-4M gal/yr) vs widely-shared 1.8 BILLION gal/yr (Indiana Citizen 7/7/26, generic industry extrapolation). Three orders of magnitude apart.
- Closed-loop cooling: Microsoft policy Dec 2024 covers datacenters designed from Aug 2024+, doesn't name LaPorte. Secondary reporting says closed-loop at LaPorte; no primary confirmation.
- Ratepayer impact: La Porte County intervened in IURC Cause 46183 (GenCo, approved 9/24/2025); county attorney Shaw Friedman warned of "harm to ratepayers." Reconsideration 11/19/2025 stripped GenCo eminent-domain authority.
- Acreage: 1,200 vs ~1,000 vs 1,280.8 vs ~1,300 — flag, don't collapse.

### Public-record gaps (publish as finding)
- Adopted county Data Center Ordinance text not online (only 4/16/2026 draft)
- Annexation fiscal plan (IC 36-4-3-13) not published
- Executed Framework Infrastructure Development Agreement not published
- City-county RDC revenue-sharing terms not published
- Educational and Training Program agreement (15%/20-yr school split) not published
- No dollar value ever attached to the 15%/20-year school deal in any public record

## News scan (Aug 2026)
- WSBT 6/17/26: groundbreaking, Brad Smith "first day... of being part of Indiana"; Dermody "game-changer"; Smith: "charge us what we owe. We will pay every penny"; phase one six buildings; first building spring 2029
- Microsoft Local blog 6/18/26: Ivy Tech Datacenter Academy (first in Indiana); 600+ permanent Microsoft jobs phase 1; closed-loop liquid cooling; ecosystem enhancement for flood protection
- WNDU 4/21/26: info session, hundreds at Civic Auditorium; Microsoft commitments: closed-loop water, jobs, electric bills; Jonathan Noble (MS gov affairs) cautious on rates: "not our intent for our development to have any impact"; noise "very, very quietly"; resident Lary Campbell: "never given an opportunity to talk about it before it was already a done deal"; Commissioner Joe Haney: formalizing promises in document
- City of La Porte (Holcomb announcement): $1B, up to 200 jobs by end-2032, 245,000 sq ft on 489 acres at Radius Industrial Park; positions: critical environment engineers, IT technicians/managers, inventory/asset techs, security, site managers; IEDC 35-yr sales tax credit per $1B eligible investment; NIPSCO incentives; 4th major IN data center announcement 2024 ($14.8B total, 1,500 jobs across Fort Wayne, Jeffersonville, La Porte, New Carlisle)
- Indiana context: ~1/3 of counties have ordinances/moratoriums/bans (11 ordinances, 17+ moratoriums, 2 bans — Marshall, Cass); Indianapolis paused through 2027; Commerce Secretary Chuck Goodrich 8/27/26: message "not landing"
- HB 1245 (2026): requires IURC study of data center electricity demand effects
- Consumer Reports 3/20/26: residential electricity prices jumped 7.1% in 2025 nationally
- NIPSCO/Amazon: 3 GW, ~$7B on 2.6 GW gas + 400 MW storage; 15-year special contract from Jan 2027; NIPSCO says Google deal lowers residential bills up to $11

## Careers/training resources
- Ivy Tech Datacenter Academy (MOU 6/17/26, Valparaiso; launch 2027-28 school year) — first in Indiana
- Ivy Tech Data Center credentials: Supply Chain Management Certificate, Data Center Technician Certificate (Data Technology cert), Data Center Engineering Operations Certificate (electronic, mechanical, HVAC)
- Ivy Tech campuses near La Porte: La Porte, Michigan City, Valparaiso, South Bend
- Microsoft datacenter careers: Critical Environment Technician, IT technician, inventory/asset, security, site manager
- Indeed: 157 data center jobs in La Porte area; low voltage tech/electrician $22-35/hr
- Hope Training Academy (CyberHopeAI's online training) — AI basics, cybersecurity, responsible AI
- SkillDNA — skills profile/matching platform
- WGU, Indiana universities, employer programs, apprenticeships

## Site architecture (from txt doc + handoff)
Five surfaces: Learn / Explore(map) / Accountability / Skills & Careers / Ask
V1 scope per handoff: Project page · thermometer · receipt view on every figure · How we work · Why we built this · Who we are + funding disclosure · evidence submission · citizen-question explainers (water, electricity, zoning, jobs, "what if the company leaves")
User additionally wants: education/training/careers section (explicit user request), news/facts, PCOS engine + database described
Deferred: forums, scores, leaderboards, opinion, statewide map, career matching, Ask interface (thin Ask makes system look unreliable) — but user asked for "our engine, database" so include an Ask PCOS demo/preview framed carefully, or a "technology" page describing the engine. I'll include an "Ask" preview that answers from a curated FAQ evidence base (clearly labeled as evidence-grounded), plus a Technology page describing PCOS.

## Non-negotiables
1. No finding publishes without logged right-of-reply attempt
2. Every number links to its receipt
3. "No independent measurement exists" is a first-class state
4. Sponsor firewall stated publicly; funding page names all funders
5. Symmetry — company-favorable and community-favorable findings both visible

## People
- Rick Barretto — Founder, CyberHopeAI
- Charles "Charlie" Hiltunen — public policy advisor, Indiana attorney, 40+ yrs government affairs, Counsel to the Majority, Indiana House
