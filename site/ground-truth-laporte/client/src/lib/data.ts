/*
  GROUND TRUTH LAPORTE — canonical data layer.
  Every record here traces to the sealed sources in the PCOS engine
  (engine/seed/laporte_seed.sql + research/laporte-microsoft/COMMITMENTS_SEED.md).
  Figures are carried verbatim with their receipt anchors — never summarized.
  Status vocabulary mirrors the engine's commitment_status enum.
*/

export type CommitmentStatus =
  | "verified" // independently documented / agreement in place
  | "climbing" // independent measurement shows movement
  | "open" // promise on record, nothing measurable yet
  | "unmeasurable"; // no independent measurement exists (a first-class state)

export interface Receipt {
  kind: "video" | "document" | "webpage" | "filing";
  label: string; // e.g. "VID 0:14:13" or "DOC 5/18/26 minutes"
  source: string; // human-readable provenance
  detail: string; // what the receipt contains
  url?: string;
  seal?: string; // truncated sha256 / custody note
}

export interface Commitment {
  id: string;
  name: string;
  promisor: string;
  category: "power" | "water" | "taxes" | "jobs" | "community" | "infrastructure";
  status: CommitmentStatus;
  statusLabel: string;
  fillPct: number; // thermometer fill 0-100
  target?: string;
  deadline?: string;
  deadlineStated: boolean;
  summary: string; // why this line reads as it does
  quote?: string; // the verbatim words on record
  receipts: Receipt[];
}

export const COMMITMENTS: Commitment[] = [
  {
    id: "schools-15pct",
    name: "15% of property-tax revenue to La Porte schools",
    promisor: "Microsoft + City of La Porte",
    category: "taxes",
    status: "verified",
    statusLabel: "Agreement in place",
    fillPct: 30,
    target: "15% for 20 years",
    deadline: "2028 first revenue · term to 2048",
    deadlineStated: true,
    summary:
      "The city's March 3, 2026 agreement directs a 15% share of the project's property-tax revenue to the La Porte Community School Corporation for 20 years. Revenue is expected to begin in 2028 — so this line stays low until money actually moves. No dollar value has ever been attached to this deal in any public record.",
    quote: "Now we gave 15% direct to our school system.",
    receipts: [
      {
        kind: "video",
        label: "VID 0:17:47",
        source: "Mayor Tom Dermody, ITIA Summit panel, Fishers IN — 2026-08-27",
        detail:
          "Speaker confirmed via two independent anchors on the 47-minute panel recording (97% of the panel speaker-attributed). Statement of completed fact about the executed agreement.",
        seal: "sha256 c75c7e26…9e44 · sealed 2026-08-27",
      },
      {
        kind: "webpage",
        label: "CITY 3/3/2026",
        source: "City of La Porte official release — tax agreement with historic school funding",
        detail:
          "City announcement of the updated tax agreement including the 15% school allocation. Congruent with the mayor's on-stage statement.",
        url: "https://www.cityoflaporte.com/news/microsoft-dermody-eupdate-tax-agreement-to-include-historic-funding-for-la-porte-schools",
      },
    ],
  },
  {
    id: "no-abatement",
    name: "No tax abatement — full property taxes paid",
    promisor: "Microsoft",
    category: "taxes",
    status: "verified",
    statusLabel: "Corroborated by record",
    fillPct: 45,
    target: "$0 abatement",
    deadlineStated: false,
    summary:
      "Microsoft committed on stage to taking no tax abatement, and on March 3, 2026 the 2024 taxpayer agreement — a 40-year personal-property exemption worth up to $100M in PILOT terms plus up to $2.5M/yr in savings-sharing — was rescinded. Microsoft now pays full property tax. The state-level IEDC 35-year sales-tax credit survived the renegotiation and remains in the record as what the public gives up.",
    quote:
      "We don't want to take a tax abatement. So that tax revenue is actually going back to [LaPorte]. So they can use that revenue for their hospitals or schools. Public safety, anything that they feel is important to the community.",
    receipts: [
      {
        kind: "video",
        label: "VID 0:14:29",
        source: "Cloteal LaBroi, Microsoft Director of Infrastructure & Government Affairs, ITIA Summit — 2026-08-27",
        detail:
          "Direct enumerated commitment, no hedging. Speaker confirmed by two independent anchors; speaks in Microsoft first person at 0:25:22.",
        seal: "sha256 c75c7e26…9e44 · sealed 2026-08-27",
      },
      {
        kind: "webpage",
        label: "CITY 3/3/2026",
        source: "City of La Porte — rescission of the 2024 taxpayer agreement",
        detail:
          "The rescission is the corroborating act: the prior deal's exemptions were given up in writing.",
        url: "https://www.cityoflaporte.com/news/microsoft-dermody-eupdate-tax-agreement-to-include-historic-funding-for-la-porte-schools",
      },
    ],
  },
  {
    id: "water-positive",
    name: "Water replenished vs. consumed (water positive)",
    promisor: "Microsoft",
    category: "water",
    status: "unmeasurable",
    statusLabel: "No independent measurement exists",
    fillPct: 0,
    target: "≥100% of consumption",
    deadlineStated: false,
    summary:
      "The strongest kind of promise: falsifiable, and it cuts against the dominant local fear. But no baseline consumption figure has ever been published for this site — public estimates currently differ by a factor of hundreds. Until a real figure exists, this line stays at zero and says so. Who could change that: Microsoft and the City of La Porte water utility, in writing.",
    quote:
      "We're going to minimize our water usage and we're going to replenish more water than we actually use.",
    receipts: [
      {
        kind: "video",
        label: "VID 0:14:23",
        source: "Cloteal LaBroi, Microsoft, ITIA Summit — 2026-08-27",
        detail: "Direct enumerated commitment recorded on the sealed panel audio.",
        seal: "sha256 c75c7e26…9e44 · sealed 2026-08-27",
      },
    ],
  },
  {
    id: "residential-bills",
    name: "Residential electricity bills not increased by data-center load",
    promisor: "Microsoft",
    category: "power",
    status: "unmeasurable",
    statusLabel: "No independent measurement exists",
    fillPct: 0,
    deadlineStated: false,
    summary:
      "The most common question in Indiana. Stated as a national policy commitment announced January 2026, with no LaPorte-specific date or metric. It will be answered from NIPSCO/IURC regulatory filings — not from either side's characterization of them. No Microsoft-named IURC cause exists today.",
    quote:
      "We are going to pay for our energy and our infrastructure. So that would not come on the residents. Residents would not have high electricity bills because of our base and consumption usage.",
    receipts: [
      {
        kind: "video",
        label: "VID 0:14:13",
        source: "Cloteal LaBroi, Microsoft, ITIA Summit — 2026-08-27",
        detail: "Direct enumerated commitment; answers the moderator's site-selection question.",
        seal: "sha256 c75c7e26…9e44 · sealed 2026-08-27",
      },
      {
        kind: "webpage",
        label: "MSFT 1/13/2026",
        source: "Brad Smith, Microsoft Vice Chair & President — Community-First AI Infrastructure",
        detail: "The national policy statement this commitment ties to.",
        url: "https://blogs.microsoft.com/on-the-issues/2026/01/13/community-first-ai-infrastructure/",
      },
    ],
  },
  {
    id: "local-hire",
    name: "Local workers and labor",
    promisor: "Microsoft",
    category: "jobs",
    status: "unmeasurable",
    statusLabel: "Awaiting a defined measure",
    fillPct: 0,
    deadlineStated: false,
    summary:
      "A commitment to hire locally becomes checkable once 'local' has a definition and a number attached. Asking for that definition is the first right-of-reply question — not an accusation. Construction jobs and permanent jobs are counted separately here, always.",
    quote:
      "We are looking at student workers in the labor in [LaPorte]. And we wanted to make sure that we use workers and labor from the community.",
    receipts: [
      {
        kind: "video",
        label: "VID 0:14:43",
        source: "Cloteal LaBroi, Microsoft, ITIA Summit — 2026-08-27",
        detail: "Direct enumerated commitment on the sealed panel audio.",
        seal: "sha256 c75c7e26…9e44 · sealed 2026-08-27",
      },
    ],
  },
  {
    id: "nonprofit-investment",
    name: "Investment in local nonprofits & AI education",
    promisor: "Microsoft",
    category: "community",
    status: "unmeasurable",
    statusLabel: "Awaiting named amounts",
    fillPct: 0,
    deadlineStated: false,
    summary:
      "No amount or named recipients were stated. Related commitments already in the council record — $1,000,000 to the school corporation for AI proficiency, ~$4M ecological and stormwater restoration, $300,000 Travis Ditch improvements — are tracked individually below.",
    quote:
      "We wanted to just educate folks on AI infrastructure. We wanted to invest in those nonprofits in the communities and organizations that the community actually cared about.",
    receipts: [
      {
        kind: "video",
        label: "VID 0:14:53",
        source: "Cloteal LaBroi, Microsoft, ITIA Summit — 2026-08-27",
        detail: "Direct enumerated commitment on the sealed panel audio.",
        seal: "sha256 c75c7e26…9e44 · sealed 2026-08-27",
      },
    ],
  },
  {
    id: "jobs-permanent",
    name: "Permanent jobs — phase 1",
    promisor: "Microsoft / LEAP / IEDC",
    category: "jobs",
    status: "open",
    statusLabel: "On record — figures conflict",
    fillPct: 8,
    target: "200 (2024) → 600+ (2026)",
    deadline: "end-2032 (original)",
    deadlineStated: true,
    summary:
      "The 2024 announcement committed up to 200 permanent positions by end-2032. At the June 2026 groundbreaking the figure became 600+ — tripled, with no published methodology. A fair, non-hostile question for Microsoft. We count permanent and construction jobs separately, against state employment data rather than announcements.",
    receipts: [
      {
        kind: "webpage",
        label: "CITY 6/4/2024",
        source: "Gov. Holcomb announcement — City of La Porte official release",
        detail: "Original commitment: up to 200 new jobs by end of 2032.",
        url: "https://cityoflaporte.com/news/gov-holcomb-announces-plans-for-new-1b-microsoft-data-center-in-northwest-indiana",
      },
      {
        kind: "webpage",
        label: "MSFT 6/18/2026",
        source: "Microsoft Local — La Porte groundbreaking",
        detail: "Revised figure: more than 600 permanent Microsoft jobs in phase 1.",
        url: "https://local.microsoft.com/blog/microsoft-breaks-ground-on-la-porte-datacenter-project/",
      },
    ],
  },
  {
    id: "investment-1b",
    name: "Capital investment",
    promisor: "Microsoft",
    category: "infrastructure",
    status: "climbing",
    statusLabel: "Under construction",
    fillPct: 35,
    target: ">$1B",
    deadlineStated: false,
    summary:
      "Announced at $1 billion in June 2024; groundbreaking held June 17, 2026. Phase 1 is six buildings plus a substation on 489 acres at Radius Industrial Park, with the first building planned for spring 2029. Verified against the assessor and IEDC agreement as construction proceeds.",
    receipts: [
      {
        kind: "webpage",
        label: "CITY 6/4/2024",
        source: "Gov. Holcomb announcement — City of La Porte",
        detail: "$1B investment, 245,000 sq ft facility on 489 acres at Radius Industrial Park.",
        url: "https://cityoflaporte.com/news/gov-holcomb-announces-plans-for-new-1b-microsoft-data-center-in-northwest-indiana",
      },
      {
        kind: "webpage",
        label: "WSBT 6/17/2026",
        source: "Groundbreaking coverage",
        detail: "Phase one: six buildings over the next couple of years; first building spring 2029.",
        url: "https://wsbt.com/news/local/microsoft-breaks-ground-on-new-data-center-laporte-construction-ai-city-community-partners-schools-water-usage-indiana",
      },
    ],
  },
  {
    id: "datacenter-academy",
    name: "Ivy Tech Datacenter Academy — first in Indiana",
    promisor: "Microsoft + Ivy Tech",
    category: "jobs",
    status: "climbing",
    statusLabel: "MOU signed",
    fillPct: 25,
    target: "Program launch 2027-28 school year",
    deadline: "2027-28",
    deadlineStated: true,
    summary:
      "A memorandum of understanding signed June 17, 2026 launches Indiana's first Microsoft Datacenter Academy with Ivy Tech Community College — curriculum alignment, workforce training, internships, and career pathways. A training commitment that already exists, with a stated window.",
    receipts: [
      {
        kind: "webpage",
        label: "IVY 6/17/2026",
        source: "Ivy Tech Community College newsroom — MOU announcement",
        detail: "Signed at Valparaiso; statewide workforce pipeline scope.",
        url: "https://www.ivytech.edu/about-ivy-tech/newsroom/news/all-locations/2026/microsoft-mou/",
      },
    ],
  },
  {
    id: "schools-ai-1m",
    name: "$1,000,000 to La Porte schools for AI proficiency",
    promisor: "Microsoft",
    category: "community",
    status: "open",
    statusLabel: "In the council record",
    fillPct: 15,
    target: "$1,000,000",
    deadlineStated: false,
    summary:
      "Recorded in the La Porte Common Council minutes of May 18, 2026. No disbursement schedule stated — the record will show when money moves.",
    receipts: [
      {
        kind: "document",
        label: "DOC 5/18/2026",
        source: "La Porte Common Council minutes",
        detail: "In the official record; seal pending on the primary document.",
      },
    ],
  },
  {
    id: "stormwater-4m",
    name: "Ecological & stormwater restoration",
    promisor: "Microsoft",
    category: "infrastructure",
    status: "open",
    statusLabel: "In the council record",
    fillPct: 15,
    target: "~$4,000,000",
    deadlineStated: false,
    summary:
      "Approximately $4M for ecological and stormwater restoration, plus $300,000 for Travis Ditch improvements and $200,000 in professional services — all in the May 18, 2026 council record. Microsoft has also said the campus will enhance the surrounding ecosystem for flood protection and habitat.",
    receipts: [
      {
        kind: "document",
        label: "DOC 5/18/2026",
        source: "La Porte Common Council minutes",
        detail: "In the official record; seal pending on the primary document.",
      },
    ],
  },
  {
    id: "boyd-stormwater",
    name: "Boyd Blvd stormwater project (city-let)",
    promisor: "City RDC",
    category: "infrastructure",
    status: "verified",
    statusLabel: "Documented",
    fillPct: 60,
    target: "$5,349,750",
    deadlineStated: false,
    summary:
      "A city-let infrastructure project (HRP Construction) documented in the Redevelopment Commission minutes of April 29, 2026 — the kind of public-side spending that belongs in the same ledger as the company's promises.",
    receipts: [
      {
        kind: "document",
        label: "DOC 4/29/2026",
        source: "La Porte Redevelopment Commission minutes",
        detail: "Award amount in the official record.",
      },
    ],
  },
];

/* ── Open questions: contested figures, published honestly as unresolved ── */

export interface OpenQuestion {
  id: string;
  question: string;
  state: string; // short status
  body: string;
  whoCouldAnswer: string;
}

export const OPEN_QUESTIONS: OpenQuestion[] = [
  {
    id: "megawatts",
    question: "How many megawatts will the LaPorte site draw?",
    state: "Not confirmed",
    body: "The '538 MW' figure attributed to Microsoft LaPorte appears only on aggregator sites with no cited source. No Microsoft-named IURC cause exists. Meanwhile the most-circulated Indiana figure — 2,400 MW — comes from IURC Cause 46362, which is Amazon Data Services' generation arrangement at Schahfer/Mitchell. The full order text contains zero mentions of LaPorte or Microsoft. Reading '2,400 MW' as Microsoft's LaPorte load would be badly misinformed.",
    whoCouldAnswer: "NIPSCO filings, the interconnection queue, or Microsoft directly.",
  },
  {
    id: "water",
    question: "How much water will the data center use?",
    state: "Not confirmed — estimates span three orders of magnitude",
    body: "The city water superintendent reportedly cited roughly 1,000 gallons per day per building (≈3–4M gal/yr). A widely shared 1.8 billion gal/yr figure is a generic industry extrapolation from square footage — not a LaPorte study. These are three orders of magnitude apart, and only one of them describes this site.",
    whoCouldAnswer: "The City of La Porte water utility and Microsoft, in writing, as gallons/day at full build.",
  },
  {
    id: "cooling",
    question: "Does zero-water closed-loop cooling apply here?",
    state: "Secondary reporting only",
    body: "Microsoft's December 2024 closed-loop policy covers datacenters designed from August 2024 onward but does not name LaPorte. Secondary reporting describes closed-loop cooling at LaPorte; Microsoft's June 2026 groundbreaking release says the campus 'will be designed with the latest energy efficient and closed-loop liquid cooling technologies.' No primary site-specific confirmation exists.",
    whoCouldAnswer: "Microsoft, asked directly — this is a right-of-reply question.",
  },
  {
    id: "ratepayer",
    question: "Who pays for the new power infrastructure?",
    state: "In regulatory proceedings",
    body: "La Porte County intervened in IURC Cause 46183 (the GenCo structure, approved September 24, 2025); the county attorney warned it 'will cause harm to ratepayers.' A November 19, 2025 reconsideration order stripped GenCo's eminent-domain authority. Indiana's HB 1245 (2026) separately requires the IURC to study the effect of data-center electricity demand.",
    whoCouldAnswer: "The IURC record itself — we read filings, not characterizations of filings.",
  },
  {
    id: "acreage",
    question: "How big is the total campus?",
    state: "Sources disagree",
    body: "Credible outlets report 1,200, ~1,000, 1,280.8, and ~1,300 acres. The likely explanation is proposal-stage versus final-annexed figures. We flag the disagreement rather than collapse it into a single number nobody sourced.",
    whoCouldAnswer: "The recorded annexation documents and plat filings.",
  },
  {
    id: "construction-jobs",
    question: "How many construction workers — 300–400, or 2,000+?",
    state: "Figures conflict",
    body: "Reporting on April 21, 2026 cited 300–400 construction workers; groundbreaking coverage on June 17 cited 2,000+ per day at peak. These are likely 'at any given time' versus 'peak day' figures — but we ask rather than assume.",
    whoCouldAnswer: "Microsoft's construction contractors' certified payroll or a direct statement.",
  },
];

/* ── Public-record gaps: what governs this project that you cannot read ── */

export const RECORD_GAPS: string[] = [
  "The adopted county Data Center Ordinance text — only the April 16, 2026 draft is online, and the adopted version carries no published ordinance number",
  "The annexation fiscal plan required by IC 36-4-3-13",
  "The executed Framework Infrastructure Development Agreement",
  "The city–county RDC revenue-sharing terms",
  "The Educational and Training Program agreement containing the 15% / 20-year school split",
];

/* ── Explainers: the questions residents actually ask ── */

export interface Explainer {
  slug: string;
  category: string;
  title: string;
  lead: string;
  sections: { heading: string; body: string }[];
  receiptNote: string;
}

export const EXPLAINERS: Explainer[] = [
  {
    slug: "electricity",
    category: "Electricity",
    title: "Will the data center raise my electric bill?",
    lead: "The single most-asked question in Indiana. The honest answer: the promise is on record, the measurement does not exist yet, and the paper trail that will settle it runs through the IURC — not through anyone's press release.",
    sections: [
      {
        heading: "What was promised",
        body: "Microsoft's Director of Infrastructure & Government Affairs stated on August 27, 2026: 'we are going to pay for our energy and our infrastructure. So that would not come on the residents.' This ties to the national Community-First policy Brad Smith announced in January 2026. It is a real, checkable commitment — and it carries no LaPorte-specific date or metric.",
      },
      {
        heading: "How electricity costs actually work here",
        body: "La Porte is served by NIPSCO. When a very large customer connects, the utility builds generation, transmission, and substations — and who pays for what is decided in rate cases and special contracts before the Indiana Utility Regulatory Commission (IURC). Residential prices across the U.S. rose about 7.1% in 2025, which is why this question matters everywhere, not just here.",
      },
      {
        heading: "What the record already shows",
        body: "La Porte County intervened in IURC Cause 46183 over the GenCo structure; the county attorney warned of harm to ratepayers, and a November 2025 order stripped GenCo's eminent-domain authority. Indiana's HB 1245 (2026) requires the IURC to study data-center demand effects. NIPSCO says its data-center deals are structured so large customers cover their own infrastructure — that claim is exactly what filings can verify.",
      },
      {
        heading: "What we don't know",
        body: "No Microsoft-named IURC cause exists today, so there is no public filing that prices the LaPorte site's load. When one appears, it will be sealed into this record and the thermometer above will move.",
      },
    ],
    receiptNote: "VID 0:14:13 · ITIA Summit 8/27/2026 · IURC Causes 46183 / 46362 · HB 1245 (2026)",
  },
  {
    slug: "water",
    category: "Water",
    title: "Where does the water come from, and how much is it?",
    lead: "Public estimates for this site currently differ by a factor of hundreds. That gap is itself the story — and it is closable, because the city water utility and Microsoft can both answer in writing.",
    sections: [
      {
        heading: "What was promised",
        body: "'We're going to minimize our water usage and we're going to replenish more water than we actually use.' A water-positive commitment is the strongest kind of promise: falsifiable, measurable, and aimed directly at the dominant local fear.",
      },
      {
        heading: "How data-center cooling works",
        body: "Servers generate heat; cooling removes it. Traditional evaporative cooling consumes water continuously. Closed-loop systems circulate water through sealed piping and reject heat to outside air, cutting freshwater use by up to roughly 70% compared with open evaporative methods. Microsoft's December 2024 policy commits new designs to closed-loop 'zero water' cooling, and its groundbreaking release says LaPorte will use closed-loop liquid cooling — but no site-specific primary document confirms it yet.",
      },
      {
        heading: "Why the numbers conflict",
        body: "The city water superintendent reportedly described roughly 1,000 gallons per day per building — a few million gallons a year. A widely shared 1.8-billion-gallon figure is a generic industry extrapolation from square footage, not a LaPorte study. Three orders of magnitude apart; only one describes this site.",
      },
      {
        heading: "What we don't know",
        body: "The actual permitted withdrawal, the cooling design basis, and the replenishment mechanism. Until those exist in a public record, the water thermometer stays at zero — by design, not by oversight.",
      },
    ],
    receiptNote: "VID 0:14:23 · ITIA Summit 8/27/2026 · Microsoft Cloud blog 12/9/2024 · MSFT Local 6/18/2026",
  },
  {
    slug: "taxes",
    category: "Taxes",
    title: "What did the city and county actually agree to?",
    lead: "The before-and-after is the story here, and it favors the company: a 2024 deal with major exemptions was rescinded in March 2026 and replaced with full property taxes plus a historic school allocation.",
    sections: [
      {
        heading: "The deal that was replaced",
        body: "The 2024 taxpayer agreement included a 40-year personal-property tax exemption and savings-sharing worth up to $2.5M per year — framed by the city as up to $100M over 40 years. On March 3, 2026, that agreement was rescinded.",
      },
      {
        heading: "The deal now in place",
        body: "Microsoft pays full property taxes — 'charge us what we owe,' Brad Smith said at the groundbreaking — and 15% of the project's property-tax revenue goes to the La Porte Community School Corporation for 20 years, expected to begin in 2028. Microsoft also pays $2.60 per square foot of the first building toward city services.",
      },
      {
        heading: "What the state gives up",
        body: "The IEDC committed a 35-year data-center sales-tax credit per $1 billion of eligible investment, extendable to 45 years. That state-level incentive survived the 2026 renegotiation — the local deal changed; this did not. It belongs in the ledger beside the promises.",
      },
      {
        heading: "What we don't know",
        body: "No dollar value has ever been attached to the 15% school commitment in any public record — the 'tens of millions annually' framing appears only in newspaper characterizations. The executed agreements themselves are not published. Those are the first public-records requests.",
      },
    ],
    receiptNote: "CITY 3/3/2026 · VID 0:14:29 & 0:17:47 · IEDC announcement 6/4/2024",
  },
  {
    slug: "jobs",
    category: "Jobs",
    title: "What jobs are real, and when?",
    lead: "Construction jobs and permanent jobs are different things and are routinely blurred together. This record counts them separately, against state employment data rather than announcements.",
    sections: [
      {
        heading: "The permanent-jobs record",
        body: "The June 2024 announcement committed up to 200 permanent positions by end-2032. At the June 2026 groundbreaking, Microsoft said phase 1 would create more than 600 permanent jobs — tripled, with no published methodology. Both figures stay in the record; the question 'what changed?' is fair and non-hostile.",
      },
      {
        heading: "The construction-jobs conflict",
        body: "April 2026 reporting cited 300–400 construction workers; June groundbreaking coverage cited 2,000+ per day at peak. These are likely 'at any given time' versus 'peak day' — but we ask rather than assume.",
      },
      {
        heading: "What the roles actually are",
        body: "Microsoft's own posting categories: critical environment engineers and technicians, IT technicians and managers, inventory and asset technicians, security personnel, and site managers. These are skilled-trades and technology roles — and Indiana's first Microsoft Datacenter Academy at Ivy Tech exists to train for them.",
      },
      {
        heading: "What we don't know",
        body: "What 'local hire' means — no definition or percentage has been stated. Asking for that definition is our first right-of-reply question, and the answer turns a slogan into a checkable line on the thermometer.",
      },
    ],
    receiptNote: "CITY 6/4/2024 · MSFT Local 6/18/2026 · IVY 6/17/2026 · VID 0:14:43",
  },
  {
    slug: "if-they-leave",
    category: "Risk",
    title: "What happens if the company leaves?",
    lead: "The question nobody answers, and the one that drives the most fear. The honest record: what is owned, what is owed, and what protections the adopted ordinance does and does not contain.",
    sections: [
      {
        heading: "What would remain",
        body: "The land, the buildings, the substation, and the road and stormwater improvements are physical and stay regardless of who operates them. The 15% school allocation is tied to property-tax revenue from the site — which any owner or operator would owe.",
      },
      {
        heading: "What the ordinance does",
        body: "La Porte County's May 6, 2026 data-center ordinance — passed unanimously, the second in Indiana after Lake County — sets setbacks, noise limits, water limits, and restricts data centers to industrial zoning. Decommissioning and reclamation terms are the provisions to watch; we are pulling the adopted text.",
      },
      {
        heading: "What we don't know",
        body: "Whether any decommissioning bond or reclamation security exists for this site. That is a documentable fact, and it is on the public-records request list.",
      },
    ],
    receiptNote: "County ordinance 5/6/2026 · WNDU / Herald-Dispatch coverage · record gaps list",
  },
];

/* ── Careers & training ── */

export interface CareerPath {
  title: string;
  kind: string;
  payNote?: string;
  description: string;
  skills: string[];
}

export const CAREER_PATHS: CareerPath[] = [
  {
    title: "Critical Environment Technician",
    kind: "Operations · on-site",
    description:
      "Monitor and maintain the critical building systems that keep a data center alive: electrical distribution, cooling, HVAC, and water systems. Microsoft's own datacenter career track.",
    skills: ["Electrical systems", "HVAC & cooling", "Monitoring & telemetry", "Safety procedures"],
  },
  {
    title: "Data Center IT Technician",
    kind: "Technology · on-site",
    description:
      "Install, maintain, and troubleshoot servers, storage, and network hardware. The most direct entry point into the industry — Ivy Tech's Data Technology certificate is built for exactly this role.",
    skills: ["Server hardware", "Networking", "Linux basics", "Ticketing & documentation"],
  },
  {
    title: "Network / Fiber Technician",
    kind: "Technology · field",
    description:
      "Build and maintain the fiber and network infrastructure connecting the campus to the world. Demand extends well beyond one employer.",
    skills: ["Fiber splicing", "Network cabling", "Testing & certification", "Reading blueprints"],
  },
  {
    title: "Electrician / Low-Voltage Technician",
    kind: "Skilled trades · construction & operations",
    payNote: "La Porte-area postings: $22–35/hr for low-voltage and structured-cabling roles",
    description:
      "Data centers are among the most electrically intensive buildings ever built. Licensed electricians and low-voltage techs are needed in construction and permanently afterward.",
    skills: ["Electrical code", "Structured cabling", "Blueprint reading", "OSHA safety"],
  },
  {
    title: "Cybersecurity Analyst",
    kind: "Technology · remote-capable",
    description:
      "Physical and digital security converge at data centers. Security personnel are a named hiring category for this site, and cybersecurity skills compound across every employer in the region.",
    skills: ["Security operations", "Access control", "Incident response", "Compliance frameworks"],
  },
  {
    title: "Supply Chain & Inventory Technician",
    kind: "Logistics · on-site",
    description:
      "A data center is a continuous flow of servers, parts, and equipment. Inventory and asset technicians and managers are a named Microsoft hiring category for La Porte.",
    skills: ["Inventory systems", "Logistics coordination", "Asset lifecycle", "Vendor management"],
  },
];

export interface TrainingProvider {
  name: string;
  kind: string;
  location: string;
  programs: string[];
  note?: string;
  url?: string;
}

export const TRAINING: TrainingProvider[] = [
  {
    name: "Ivy Tech Community College — Microsoft Datacenter Academy",
    kind: "Community college · certificate",
    location: "Valparaiso (statewide scope) · campuses in La Porte, Michigan City, South Bend",
    programs: [
      "Data Center Technician Certificate (Data Technology)",
      "Data Center Engineering Operations Certificate (electrical, mechanical, HVAC)",
      "Supply Chain Management Certificate",
      "Cloud Technologies degrees & certificates",
    ],
    note: "Indiana's first Microsoft Datacenter Academy — MOU signed June 17, 2026; program launch targeted for the 2027-28 school year.",
    url: "https://www.ivytech.edu/about-ivy-tech/newsroom/news/all-locations/2026/microsoft-mou/",
  },
  {
    name: "Hope Training Academy",
    kind: "Online · self-paced · paid courses",
    location: "Online — available anywhere in Indiana",
    programs: [
      "Introduction to Networking & Intermediate Networking",
      "Introduction to Cybersecurity & Explore a Career in Cybersecurity",
      "Understanding the Cloud & Wireless Networking",
      "VMware vSphere — Data Center Virtualization (voucher included)",
      "SC-500 Cloud & AI Security Engineer Associate (voucher included)",
      "SSCP Systems Security Certified Practitioner",
      "Computer Networking Suite",
      "Introduction to PC Security",
    ],
    note: "CyberHopeAI's training arm, operated through the Video Game Palooza 501(c)(3) public charity — 100% of course proceeds fund free tech training and living-wage careers. 86 online IT courses available, from $142 entry-level to $2,415 professional certification tracks. A La Porte resident discount code is being established — check back or contact us. Courses feed verified competency evidence directly into a SkillDNA profile — learning becomes demonstrable capability.",
    url: "https://shop.videogamepalooza.org/collections/courses-information-technology",
  },
  {
    name: "SkillDNA — see where you fit",
    kind: "Skills profile · free",
    location: "Online",
    programs: [
      "Build a verified skills profile",
      "Compare against real data-center roles",
      "Identify your specific skill gaps",
      "Get matched to training that closes them",
    ],
    note: "A $1 billion technology investment is being built miles from La Porte. SkillDNA shows whether your skills match the jobs it creates — and what to learn next.",
  },
  {
    name: "WorkOne Northwest Indiana",
    kind: "State workforce · free",
    location: "La Porte County American Job Center",
    programs: [
      "WIOA training grants & apprenticeships",
      "Career counseling & resume support",
      "Employer hiring events",
      "Veteran & dislocated-worker programs",
    ],
  },
];

/* ── Project spine: the verified skeleton ── */

export interface SpineFact {
  label: string;
  value: string;
  receipt: string;
}

export const PROJECT_SPINE: SpineFact[] = [
  { label: "Operator", value: "Microsoft Corporation — named directly in city records; no LLC shell or codename", receipt: "Plan Commission petition #26-01" },
  { label: "Announced", value: "June 4, 2024 — Gov. Holcomb · $1B · 245,000 sq ft on 489 acres", receipt: "CITY 6/4/2024" },
  { label: "Site", value: "Boyd Boulevard / Radius Industrial Park + Pleasant Township annexation", receipt: "Council record" },
  { label: "Groundbreaking", value: "June 17, 2026 — phase 1: six buildings + one substation", receipt: "WSBT 6/17/2026" },
  { label: "First building", value: "Planned spring 2029 · three of six by winter 2029", receipt: "WSBT 6/17/2026" },
  { label: "Total campus", value: "~1,300 acres · 17 buildings (outlets disagree — flagged, not collapsed)", receipt: "WNDU 5/19/2026" },
  { label: "Electric utility", value: "NIPSCO", receipt: "Multiple filings" },
  { label: "Water utility", value: "City of La Porte municipal", receipt: "Water Supt. via public session" },
  { label: "County ordinance", value: "May 6, 2026 — unanimous · setbacks, noise, water limits, industrial zoning only · 2nd in Indiana", receipt: "WNDU / Herald-Dispatch" },
  { label: "State incentive", value: "IEDC 35-year sales-tax credit per $1B invested, extendable to 45", receipt: "IEDC 6/4/2024" },
];

/* ── The method: how the engine works (public description) ── */

export const METHOD_PRINCIPLES = [
  {
    title: "Every number has a receipt.",
    body: "Click any figure and you get the document and page — or the recording and timestamp — it came from. If we can't show the source, we don't print the number.",
  },
  {
    title: "Sources are sealed before analysis.",
    body: "Every document and recording is fingerprinted (SHA-256) and sealed the moment we obtain it. If a page is later edited or deleted, we can still prove what it said.",
  },
  {
    title: "Figures never pass through an AI summarizer.",
    body: "We have watched a summarizer produce three different budget figures from a single article. Numbers are extracted mechanically from the sealed source — AI is not permitted to touch them.",
  },
  {
    title: "Nobody is quoted unless we know who spoke.",
    body: "In a room of officials, company representatives and residents, software can trivially put one person's words in another's mouth. Every speaker is separated and confirmed first. When we can't confirm, we don't attribute.",
  },
  {
    title: "We look for the case against our own finding.",
    body: "Before anything is recorded, the system searches for the strongest evidence that we are wrong. Findings that don't survive that pass don't run.",
  },
  {
    title: "We ask before we publish.",
    body: "Anyone named is offered a real chance to respond, with a deadline, and their answer runs alongside the finding. This is enforced in the software: a finding with no logged response attempt cannot be published.",
  },
  {
    title: "We check the good news too.",
    body: "A kept commitment is a headline here. A widely shared claim against the project that turns out to be false gets corrected here. A tracker that only reports failures is a campaign, not a record.",
  },
];

/* ── Engine pipeline stages (public-facing description of PCOS) ── */

export const PIPELINE_STAGES = [
  { n: "01", name: "Intake & custody", desc: "Documents, recordings, and filings enter with full provenance — source URL, capture time, SHA-256 fingerprint." },
  { n: "02", name: "Seal", desc: "The original artifact is hash-sealed before any analysis touches it. The chain of custody starts here." },
  { n: "03", name: "Extract", desc: "OCR for scanned minutes, transcription for audio, speaker diarization for multi-voice recordings." },
  { n: "04", name: "Resolve", desc: "Entity resolution attaches every statement to a real person, organization, and role — by date." },
  { n: "05", name: "Speaker gate", desc: "No utterance is attributed until the speaker is confirmed by independent anchors." },
  { n: "06", name: "Mode gate", desc: "Assertions are separated from quotations, hypotheticals, and performed voices." },
  { n: "07", name: "Claim extraction", desc: "Atomic claims are isolated — one checkable statement per record, with its anchor." },
  { n: "08", name: "Commitment detection", desc: "Is it an observation, a projection, or a measurable pledge? Only pledges enter the ledger." },
  { n: "09", name: "Adversary pass", desc: "A separate model searches for the strongest evidence against the finding." },
  { n: "10", name: "Verification record", desc: "Versioned, never overwritten. 82% confidence today can become 98% in six months — as a new version." },
  { n: "11", name: "Right of reply", desc: "The named party is asked, with a deadline. The attempt is logged in the database." },
  { n: "12", name: "Publish gate", desc: "A database trigger blocks publication of any finding with no logged reply attempt." },
];

/* ── Timeline ── */

export interface TimelineEvent {
  date: string;
  title: string;
  body: string;
  receipt?: string;
}

export const TIMELINE: TimelineEvent[] = [
  {
    date: "Jun 3–4, 2024",
    title: "Microsoft named in city records; $1B announced",
    body: "Plan Commission petition names 'Microsoft Corporation, Attn. Americas Land Acquisition' directly — no LLC shell. Governor Holcomb announces $1B, 245,000 sq ft, up to 200 jobs by end-2032.",
    receipt: "CITY 6/4/2024",
  },
  {
    date: "Sep–Nov 2025",
    title: "County intervenes in IURC GenCo case",
    body: "La Porte County intervenes in Cause 46183; the county attorney warns of ratepayer harm. The November reconsideration order strips GenCo's eminent-domain authority.",
    receipt: "IURC 46183",
  },
  {
    date: "Jan 13, 2026",
    title: "Microsoft's Community-First policy",
    body: "Brad Smith announces the national framework the five LaPorte commitments tie to: full energy costs, water positivity, no abatements, local labor, community investment.",
    receipt: "MSFT 1/13/2026",
  },
  {
    date: "Mar 3, 2026",
    title: "2024 tax deal rescinded; schools get 15%",
    body: "The 40-year exemption worth up to $100M is given up. Microsoft pays full property tax; 15% of project property-tax revenue goes to La Porte schools for 20 years.",
    receipt: "CITY 3/3/2026",
  },
  {
    date: "Apr 2026",
    title: "Annexation advances; residents pack info session",
    body: "Council moves to annex ~1,000 acres of Pleasant Township farmland. Hundreds attend Microsoft's Civic Auditorium session; promises on water, bills, and noise are made verbally.",
    receipt: "WNDU 4/21/2026",
  },
  {
    date: "May 6, 2026",
    title: "County passes data-center ordinance",
    body: "Unanimous: setbacks, noise limits, water limits, industrial zoning only. The second such ordinance in Indiana, after Lake County.",
    receipt: "WNDU / Herald-Dispatch",
  },
  {
    date: "May 18, 2026",
    title: "Council record: $1M schools AI, $4M restoration",
    body: "Minutes record Microsoft's $1,000,000 AI-proficiency commitment to the school corporation, ~$4M ecological/stormwater restoration, $300K Travis Ditch, $200K professional services.",
    receipt: "DOC 5/18/2026",
  },
  {
    date: "Jun 17–18, 2026",
    title: "Groundbreaking; Ivy Tech Datacenter Academy",
    body: "Shovels hit the dirt off Boyd Boulevard. Microsoft signs Indiana's first Datacenter Academy MOU with Ivy Tech. Permanent-jobs figure becomes 600+.",
    receipt: "WSBT / MSFT / IVY",
  },
  {
    date: "Aug 27, 2026",
    title: "The five commitments, on the record",
    body: "At the ITIA Summit, Microsoft's infrastructure director enumerates five commitments on stage — energy costs, water positivity, no abatement, local labor, nonprofit investment. None carries a date.",
    receipt: "VID 0:14:09–0:15:12",
  },
];

/* ── Correction (launch content) ── */

export const CORRECTION = {
  title: "The 2,400 MW figure circulating in Indiana is not Microsoft's.",
  body: "The most-shared megawatt number in the state comes from IURC Cause 46362 — a generation arrangement for Amazon Data Services at the Schahfer/Mitchell plants. The full order text contains zero mentions of LaPorte or Microsoft. The '538 MW' figure attributed to Microsoft LaPorte appears only on aggregator sites with no cited source. No Microsoft-named IURC cause exists. Whatever the LaPorte site's real load is, it is not yet in any public record — and publishing the Amazon figure as Microsoft's would misinform exactly the conversation this site exists to clarify.",
  receipts: ["IURC Cause 46362 (full order text)", "IURC Cause 46322 (Amazon special contract)", "Aggregator survey: datacenter.fyi, cleanview.co, siliconreport — no cited sources"],
};

export const STATUS_META: Record<
  CommitmentStatus,
  { label: string; color: string; bg: string; desc: string }
> = {
  verified: {
    label: "Verified",
    color: "var(--gt-verify)",
    bg: "rgba(49,210,150,.1)",
    desc: "Independently documented in a primary record",
  },
  climbing: {
    label: "Climbing",
    color: "var(--gt-warn)",
    bg: "rgba(217,171,69,.1)",
    desc: "Independent measurement shows movement toward the target",
  },
  open: {
    label: "Open",
    color: "var(--gt-gold)",
    bg: "rgba(209,168,75,.1)",
    desc: "Promise on record; nothing measurable yet",
  },
  unmeasurable: {
    label: "No independent measurement",
    color: "var(--gt-null)",
    bg: "rgba(90,104,117,.12)",
    desc: "No independent measurement exists — a first-class state, not a gap",
  },
};
