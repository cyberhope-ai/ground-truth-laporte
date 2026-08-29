/*
  Seed script v3 — the remaining La Porte municipal sessions.
  April 13 council hearing (annexation introduction), April 28 Plan
  Commission (ordinance 8-1 vote), and April 20 council session
  (second data center revealed, vote deferred to May 18).
  Content sourced from WSBT, South Bend Tribune, and the county
  ordinance draft. No sealed recordings exist for these sessions —
  transcripts are null; the record is the published reporting.
  Run once: node --experimental-strip-types server/seed-meetings-v3.mjs
*/
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { meetings, meetingCommitments } from "../drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const SEED = [
  {
    slug: "laporte-council-2026-04-13",
    body: "La Porte Common Council",
    title: "Public hearing — Pleasant Township annexation introduced",
    heldOn: "2026-04-13",
    summary:
      "A packed chamber — a 'sea of orange' spilled outside — as the council introduced the ordinance to annex ~1,280 acres in Pleasant Township for the Microsoft expansion. Microsoft officials presented on the partnership. Mayor Dermody confirmed the annexation is tied to the data center and announced a city-county partnership. Union workers supported; residents and a county commissioner raised transparency concerns.",
    decisions: [
      "Annexation ordinance introduced (~1,280.845 acres, nine parcels, Pleasant Township)",
      "Vote deferred — public hearing scheduled for April 21 at the Civic Auditorium",
    ],
    moneyDiscussed: [
      "Tens of millions annually in property-tax revenue projected under the 20-year agreement (Councilman Tim Franke)",
      "Several million dollars per year projected for the school corporation from the initial agreement",
    ],
    unanswered: [
      "How much additional revenue the expansion would generate — not disclosed",
      "County Commissioner Joe Haney: 'without the city sharing that information with us, we're kind of in the dark'",
    ],
    videoUrl: null,
    minutesUrl: null,
    transcript: null,
    commitments: [
      { speaker: "Tom Dermody", speakerRole: "Mayor, City of La Porte", text: "We will have a leader that will take our school system forward like LaPorte has never seen. I am so excited to announce we now have a partnership with the county council that we are going to move forward together.", metricLabel: "City-county partnership on annexation", targetValue: null, anchor: null, trackerRef: null },
      { speaker: "Rick Kalinski", speakerRole: "NIPSCO Director of Public Affairs", text: "There is no cost shifting. No hidden burdens on current customers. The businesses that drive the energy demand pay for it.", metricLabel: "No cost shifting to residential ratepayers", targetValue: null, anchor: null, trackerRef: "residential-bills" },
      { speaker: "Mike Stockwell", speakerRole: "Microsoft — Land Development & Permitting", text: "Six data center buildings are planned for the first site, while 11 more data center facilities would go on the other parcel if everything goes as planned.", metricLabel: "Total buildings across both parcels", targetValue: "17", anchor: null, trackerRef: null },
    ],
  },
  {
    slug: "laporte-council-2026-04-20",
    body: "La Porte Common Council",
    title: "Second data center revealed — 1,200 acres, vote deferred to May 18",
    heldOn: "2026-04-20",
    summary:
      "Microsoft revealed plans for a second, larger data center on 1,200 acres of farmland beside the first site. The council heard a heavily attended public session and deferred the annexation vote to May 18. NIPSCO's Rick Kalinski stated Microsoft would bear the entire energy cost. Microsoft's Mike Stockwell described closed-loop water cooling with trucked-in water. Bert Cook (LEAP) estimated 200 permanent positions for the first building, up to 50 more per additional building.",
    decisions: [
      "Annexation vote deferred to May 18, 2026",
      "Public open house announced for April 21 at the Civic Auditorium",
    ],
    moneyDiscussed: [
      "Tens of millions annually in property-tax revenue (Franke, on the first agreement)",
      "Several million per year for schools from the initial agreement",
      "Expansion revenue not disclosed",
    ],
    unanswered: [
      "How much additional money the expansion would generate",
      "Whether the county shares in expansion revenue (agreement 'being finalized')",
    ],
    videoUrl: null,
    minutesUrl: null,
    transcript: null,
    commitments: [
      { speaker: "Rick Kalinski", speakerRole: "NIPSCO Director of Public Affairs", text: "The cost of meeting the large demand for energy to operate the data centers will not be passed on to existing customers. Microsoft will bear the entire expense.", metricLabel: "Energy cost borne by Microsoft", targetValue: "100%", anchor: null, trackerRef: "residential-bills" },
      { speaker: "Mike Stockwell", speakerRole: "Microsoft — Land Development & Permitting", text: "The data centers will recycle water brought in on trucks through a closed loop system to cool the servers. The only municipal water consumed will be for things like restrooms and making coffee.", metricLabel: "Closed-loop water cooling", targetValue: "Municipal water for restrooms only", anchor: null, trackerRef: "water-positive" },
      { speaker: "Bert Cook", speakerRole: "Executive Director, LaPorte Economic Advancement Partnership", text: "200 good-paying, high-tech positions will come to the first data center, with expansion meaning up to 50 more employees per building.", metricLabel: "Permanent jobs — first building", targetValue: "200", anchor: null, trackerRef: "jobs-permanent" },
      { speaker: "Bert Cook", speakerRole: "Executive Director, LEAP", text: "Noise levels from diesel-powered generators running about 15 hours a year will be minimal — compared to a household refrigerator at the property lines.", metricLabel: "Generator noise at property line", targetValue: "~15 hr/yr", anchor: null, trackerRef: null },
    ],
  },
  {
    slug: "laporte-plan-commission-2026-04-28",
    body: "La Porte County Plan Commission",
    title: "Data Center Ordinance — public hearing, 8-1 favorable recommendation",
    heldOn: "2026-04-28",
    summary:
      "The Plan Commission held a public hearing on the county's data-center ordinance — setbacks, noise limits, water limits, industrial-zoning-only siting — and voted 8-1 to send it to the Commissioners with a favorable recommendation. Jimmy Pressel voted nay. Residents voiced frustration that the ordinance moved forward without amendments; Building Commissioner Michael Polan said the draft had been amended several times and was strong enough to advance.",
    decisions: [
      "Data Center Ordinance advanced to County Commissioners — 8-1 favorable recommendation",
      "Jimmy Pressel voted nay",
      "Ordinance would allow data centers by Special Exception in M1 and M2 zones only",
    ],
    moneyDiscussed: [],
    unanswered: [
      "The adopted ordinance text is not published online — only the 4/16/2026 draft is available",
      "Residents asked for language clarification; the ordinance moved forward without changes",
    ],
    videoUrl: null,
    minutesUrl: "https://laporteco.in.gov/wp-content/uploads/2026/04/Data-Center-Ordinance-Draft-1.pdf",
    transcript: null,
    commitments: [
      { speaker: "Michael Polan", speakerRole: "La Porte County Building Commissioner", text: "We've been working on a data center ordinance for quite a while. This is a draft that has been amended several times, and we think it's strong enough now that hopefully we can get it passed and send it to the board of commissioners.", metricLabel: "Ordinance readiness", targetValue: null, anchor: null, trackerRef: null },
      { speaker: "Joe Haney", speakerRole: "La Porte County Commissioner", text: "With the right guardrails, the right restrictions, it's possible to do a data center right.", metricLabel: "Ordinance intent", targetValue: null, anchor: null, trackerRef: null },
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
