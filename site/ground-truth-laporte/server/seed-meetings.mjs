/*
  Seed script — Meetings & Decisions.
  Real La Porte sessions from the sealed record (council minutes, ITIA panel,
  county ordinance votes). Run once: node server/seed-meetings.mjs
  Idempotent: seedMeeting skips slugs that already exist.
*/
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { meetings, meetingCommitments } from "../drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const SEED = [
  {
    slug: "itia-summit-2026-08-27",
    body: "ITIA Summit — public industry conference",
    title: "Data Center Development that Works for Hoosier Communities (panel)",
    heldOn: "2026-08-27",
    summary:
      "A 47-minute on-record panel at the 2026 ITIA Summit in Fishers, Indiana, before technology-industry attendees, legislators, and press. Microsoft's Director of Infrastructure & Government Affairs enumerated five commitments tied to the January 2026 Community-First announcement; Mayor Tom Dermody confirmed the 15% school allocation. The recording is sealed (sha256 c75c7e26…9e44) and 97% speaker-attributed.",
    decisions: [
      "No votes taken — this was a public panel, not a legislative session",
      "Microsoft's five community commitments entered the public record",
    ],
    moneyDiscussed: [
      "Full property-tax payment (no abatement) — revenue to schools, hospitals, public safety",
      "15% of project property-tax revenue to La Porte schools, 20 years",
    ],
    unanswered: [
      "No dates attached to any of the five commitments",
      "No definition of 'local' for the local-hire commitment",
      "No dollar figure for nonprofit investment",
    ],
    videoUrl: null,
    minutesUrl: null,
    transcript:
      "0:14:09 — Moderator: What can communities expect from Microsoft as this project moves forward?\n\n0:14:13 — Cloteal LaBroi (Microsoft, Director of Infrastructure & Government Affairs): Number one, we are going to pay for our energy and our infrastructure. So that would not come on the residents. Residents would not have high electricity bills because of our base and consumption usage.\n\n0:14:23 — LaBroi: Number two, we're going to minimize our water usage and we're going to replenish more water than we actually use.\n\n0:14:29 — LaBroi: Number three, we don't want to take a tax abatement. So that tax revenue is actually going back to [LaPorte]. So they can use that revenue for their hospitals or schools. Public safety, anything that they feel is important to the community.\n\n0:14:43 — LaBroi: Number four, we are looking at student workers in the labor in [LaPorte]. And we wanted to make sure that we use workers and labor from the community.\n\n0:14:53 — LaBroi: And number five, we wanted to just educate folks on AI infrastructure. We wanted to invest in those nonprofits in the communities and organizations that the community actually cared about.\n\n0:15:12 — LaBroi: So those are five commitments to the community… and we [will] stick to that.\n\n0:17:47 — Mayor Tom Dermody (City of La Porte): Now we gave 15% direct to our school system.\n\n[Speaker attribution: LaBroi confirmed via two independent anchors — answers moderator's Microsoft site-selection question at 0:33:28; speaks in Microsoft first person at 0:25:22. Dermody confirmed via moderator direct address at 0:29:24 and city-executive context at 0:43:50.]",
    commitments: [
      { speaker: "Cloteal LaBroi", speakerRole: "Microsoft — Director of Infrastructure & Government Affairs", text: "We are going to pay for our energy and our infrastructure. So that would not come on the residents.", metricLabel: "Residential bills not increased by DC load", targetValue: null, anchor: "0:14:13", trackerRef: "residential-bills" },
      { speaker: "Cloteal LaBroi", speakerRole: "Microsoft — Director of Infrastructure & Government Affairs", text: "We're going to minimize our water usage and we're going to replenish more water than we actually use.", metricLabel: "Water replenished vs consumed", targetValue: "100%+", anchor: "0:14:23", trackerRef: "water-positive" },
      { speaker: "Cloteal LaBroi", speakerRole: "Microsoft — Director of Infrastructure & Government Affairs", text: "We don't want to take a tax abatement. So that tax revenue is actually going back to [LaPorte].", metricLabel: "Tax abatement sought", targetValue: "$0", anchor: "0:14:29", trackerRef: "no-abatement" },
      { speaker: "Cloteal LaBroi", speakerRole: "Microsoft — Director of Infrastructure & Government Affairs", text: "We are looking at student workers in the labor in [LaPorte]. And we wanted to make sure that we use workers and labor from the community.", metricLabel: "Local workers and labor", targetValue: null, anchor: "0:14:43", trackerRef: "local-hire" },
      { speaker: "Cloteal LaBroi", speakerRole: "Microsoft — Director of Infrastructure & Government Affairs", text: "We wanted to just educate folks on AI infrastructure. We wanted to invest in those nonprofits in the communities and organizations that the community actually cared about.", metricLabel: "Investment in local nonprofits", targetValue: null, anchor: "0:14:53", trackerRef: "nonprofit-investment" },
      { speaker: "Tom Dermody", speakerRole: "Mayor, City of La Porte", text: "Now we gave 15% direct to our school system.", metricLabel: "Share of property-tax revenue to schools", targetValue: "15% / 20 yr", anchor: "0:17:47", trackerRef: "schools-15pct" },
    ],
  },
  {
    slug: "laporte-council-2026-05-18",
    body: "La Porte Common Council",
    title: "Regular session — Microsoft annexation final vote & community commitments",
    heldOn: "2026-05-18",
    summary:
      "The Common Council's regular May session, at which the Pleasant Township annexation reached its scheduled final vote and Microsoft's community commitments were entered into the council record: $1,000,000 to the school corporation for AI proficiency, approximately $4M in ecological and stormwater restoration, $300,000 for Travis Ditch improvements, and $200,000 in professional services.",
    decisions: [
      "Final vote on the Pleasant Township annexation (~1,000 acres)",
      "Microsoft community commitments entered into the council record",
    ],
    moneyDiscussed: [
      "$1,000,000 — La Porte Community School Corporation, AI proficiency",
      "~$4,000,000 — ecological & stormwater restoration",
      "$300,000 — Travis Ditch improvements",
      "$200,000 — professional services",
      "~$17.3M land purchase (~119.5 acres @ $145,000/acre) referenced in proceedings",
    ],
    unanswered: [
      "No disbursement schedule stated for the $1M school commitment",
      "No timeline attached to the restoration commitments",
    ],
    videoUrl: null,
    minutesUrl: "https://www.cityoflaporte.com/uploads/minutes/m_1937_Council-May.18-2026-Minutes.docx",
    transcript: null,
    commitments: [
      { speaker: null, speakerRole: "Council record", text: "$1,000,000 to the La Porte Community School Corporation for AI proficiency.", metricLabel: "Schools — AI proficiency", targetValue: "$1,000,000", anchor: null, trackerRef: "schools-ai-1m" },
      { speaker: null, speakerRole: "Council record", text: "Approximately $4,000,000 for ecological and stormwater restoration.", metricLabel: "Ecological / stormwater restoration", targetValue: "~$4,000,000", anchor: null, trackerRef: "stormwater-4m" },
      { speaker: null, speakerRole: "Council record", text: "$300,000 for Travis Ditch improvements.", metricLabel: "Travis Ditch improvements", targetValue: "$300,000", anchor: null, trackerRef: "stormwater-4m" },
      { speaker: null, speakerRole: "Council record", text: "$200,000 in professional services.", metricLabel: "Professional services", targetValue: "$200,000", anchor: null, trackerRef: "stormwater-4m" },
    ],
  },
  {
    slug: "county-commissioners-2026-05-06",
    body: "La Porte County Commissioners",
    title: "Data Center Ordinance — adopted unanimously",
    heldOn: "2026-05-06",
    summary:
      "The Commissioners unanimously adopted the county's data-center ordinance — setbacks, noise limits, water limits, and industrial-zoning-only siting — making La Porte the second county in Indiana after Lake County with such an ordinance. County attorney Guy DiMartino read corrections into the record from the Plan Commission's April 28 meeting (8-1 roll call, Jimmy Pressel voting nay).",
    decisions: [
      "Data Center Ordinance adopted — unanimous vote",
      "Setbacks, noise limits, water limits, industrial zoning only",
      "Corrections from the 4/28 Plan Commission record read into the minutes",
    ],
    moneyDiscussed: [],
    unanswered: [
      "The adopted ordinance text is not published online — only the 4/16/2026 draft is available, and the adopted version carries no published ordinance number",
    ],
    videoUrl: null,
    minutesUrl: null,
    transcript: null,
    commitments: [],
  },
  {
    slug: "laporte-rdc-2026-04-29",
    body: "La Porte Redevelopment Commission",
    title: "Boyd Boulevard stormwater project award",
    heldOn: "2026-04-29",
    summary:
      "The Redevelopment Commission awarded the Boyd Boulevard stormwater project — public-side infrastructure spending tied to the data-center corridor — to HRP Construction at $5,349,750. This is the kind of public investment that belongs in the same ledger as the company's promises.",
    decisions: [
      "Boyd Blvd stormwater project awarded to HRP Construction",
    ],
    moneyDiscussed: [
      "$5,349,750 — Boyd Blvd stormwater project (city-let)",
    ],
    unanswered: [],
    videoUrl: null,
    minutesUrl: null,
    transcript: null,
    commitments: [
      { speaker: null, speakerRole: "RDC record", text: "Boyd Boulevard stormwater project awarded to HRP Construction.", metricLabel: "Boyd Blvd stormwater project", targetValue: "$5,349,750", anchor: null, trackerRef: "boyd-stormwater" },
    ],
  },
  {
    slug: "laporte-council-2026-03-03",
    body: "City of La Porte — administration",
    title: "Tax agreement rescinded & replaced — historic school funding",
    heldOn: "2026-03-03",
    summary:
      "The city and Microsoft announced the rescission of the 2024 taxpayer agreement — which had included a 40-year personal-property exemption worth up to $100M in PILOT terms — and its replacement: full property taxes paid, with 15% of project property-tax revenue directed to the La Porte Community School Corporation for 20 years. The before/after is the story, and it favors Microsoft.",
    decisions: [
      "2024 taxpayer agreement rescinded (40-year exemption, up to $2.5M/yr savings-sharing)",
      "Full property-tax payment in effect",
      "15% of project property-tax revenue to schools for 20 years",
    ],
    moneyDiscussed: [
      "Up to $100M in PILOT terms — exemption given up",
      "15% / 20-year school allocation — no dollar value has ever been attached in any public record",
    ],
    unanswered: [
      "The executed agreement text is not published",
      "No dollar value attached to the 15% school commitment",
    ],
    videoUrl: null,
    minutesUrl: "https://www.cityoflaporte.com/news/microsoft-dermody-eupdate-tax-agreement-to-include-historic-funding-for-la-porte-schools",
    transcript: null,
    commitments: [
      { speaker: null, speakerRole: "City agreement", text: "15% of Microsoft property-tax revenue directed to the La Porte Community School Corporation for 20 years.", metricLabel: "Share of property-tax revenue to schools", targetValue: "15% / 20 yr", anchor: null, trackerRef: "schools-15pct" },
      { speaker: null, speakerRole: "City agreement", text: "2024 taxpayer agreement rescinded; Microsoft pays full property taxes.", metricLabel: "Tax abatement sought", targetValue: "$0", anchor: null, trackerRef: "no-abatement" },
    ],
  },
];

async function run() {
  let seeded = 0;
  for (const m of SEED) {
    const { commitments, ...meeting } = m;
    const existing = await db.select().from(meetings).where(eq(meetings.slug, meeting.slug)).limit(1);
    if (existing.length > 0) {
      console.log(`skip (exists): ${meeting.slug}`);
      continue;
    }
    const result = await db.insert(meetings).values(meeting);
    const meetingId = result[0].insertId;
    if (commitments.length > 0) {
      await db.insert(meetingCommitments).values(commitments.map((c) => ({ ...c, meetingId })));
    }
    console.log(`seeded: ${meeting.slug} (id ${meetingId}, ${commitments.length} commitments)`);
    seeded++;
  }
  console.log(`done — ${seeded} meetings seeded`);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
