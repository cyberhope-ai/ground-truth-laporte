/*
  Seed script v4 — the May 18, 2026 final annexation vote.
  The most consequential single session in the record: unanimous council
  vote to annex ~1,200 acres and rezone for the second Microsoft campus.
  Content sourced from WSBT, ABC57, and Ink Free News reporting.
  Run once: node --experimental-strip-types server/seed-meetings-v4.mjs
*/
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { meetings, meetingCommitments } from "../drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const SEED = [
  {
    slug: "laporte-council-2026-05-18",
    body: "La Porte Common Council",
    title: "Final vote — annexation & rezoning approved unanimously, second campus cleared",
    heldOn: "2026-05-18",
    summary:
      "The decisive session. The council voted unanimously to annex nine parcels (~1,200 acres) in Pleasant Township and rezone them for light industrial use, clearing the way for 11 additional Microsoft data center buildings. The Framework Infrastructure Development Agreement was unanimously approved. Microsoft pledged to cover infrastructure costs for water, sewer, and roadway improvements, and committed to closed-loop cooling. Union leaders supported; residents raised concerns about electricity costs, environmental accountability, and the pace of expansion.",
    decisions: [
      "Annexation ordinance approved — unanimous vote, nine parcels, ~1,200 acres in Pleasant Township",
      "Rezoning to light industrial use approved — unanimous",
      "Framework Infrastructure Development Agreement approved — unanimous",
      "Second campus cleared for 11 additional data center buildings",
    ],
    moneyDiscussed: [
      "Microsoft pledged to cover infrastructure costs for water, sewer, and roadway improvements",
      "Tens of millions annually in property-tax revenue projected under the 20-year agreement",
      "Several million per year for the school corporation from the initial agreement",
      "Expansion revenue not disclosed",
    ],
    unanswered: [
      "Timeline and costs for the second campus — not disclosed",
      "How the city will hold Microsoft accountable to community development commitments",
      "Whether NIPSCO electricity rates will rise for residents — one resident predicted 'three to five times' current rates in three years",
    ],
    videoUrl: null,
    minutesUrl: null,
    transcript: null,
    commitments: [
      { speaker: "Tom Dermody", speakerRole: "Mayor, City of La Porte", text: "I think it's just something that our community is rallying around. Tech, yeah, meaning that we are very open to progress and changing the future lives of our residents.", metricLabel: null, targetValue: null, anchor: null, trackerRef: null },
      { speaker: "Bert Cook", speakerRole: "Executive Director, LEAP", text: "We've met with numerous neighbors and people that are interested in this. Some of those conversations have been very productive. We've worked through issues that they might see. Microsoft has been gracious in adjusting their plan to maybe minimize impacts in certain areas.", metricLabel: "Community outreach & plan adjustment", targetValue: null, anchor: null, trackerRef: null },
      { speaker: "Bert Cook", speakerRole: "Executive Director, LEAP", text: "I think one of the reasons we chose Microsoft is because they're so respectful of our water resources. So many people, when they've heard that, I think they've changed their opinion on the project as a whole.", metricLabel: "Water resource respect", targetValue: null, anchor: null, trackerRef: "water-positive" },
      { speaker: "David Fagan", speakerRole: "Financial Secretary, IUOE Local 150", text: "Them being willing to locate here, I think says a lot about this area. We're seeing a long-term view of what we can do today to make La Porte better in the future.", metricLabel: null, targetValue: null, anchor: null, trackerRef: null },
      { speaker: "David Fagan", speakerRole: "Financial Secretary, IUOE Local 150", text: "There have been data centers nearby where that wasn't the case and they brought in contractors from all other parts of the country. We don't see that happening here.", metricLabel: "Local hiring commitment", targetValue: null, anchor: null, trackerRef: "jobs-construction" },
      { speaker: null, speakerRole: "Microsoft (via Ink Free News report)", text: "Microsoft officials pledged to cover infrastructure costs tied to water, sewer and roadway improvements and said future cooling systems would use closed-loop technology designed to minimize water consumption.", metricLabel: "Infrastructure cost coverage", targetValue: "Water, sewer, roadway", anchor: null, trackerRef: null },
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
