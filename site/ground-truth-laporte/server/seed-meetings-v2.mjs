/*
  Seed script v2 — additional ITIA Summit sessions.
  Three more recordings from the sealed corpus: the apprenticeship panel,
  the K-12/AI education panel, and the lawmakers' remarks. Each carries
  its sha256 seal from the custody record. Transcripts are the machine
  text — speaker-unresolved lines are marked as such.
  Run once: node --experimental-strip-types server/seed-meetings-v2.mjs
*/
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { meetings, meetingCommitments } from "../drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const SEED = [
  {
    slug: "itia-summit-2026-08-27-apprenticeship",
    body: "ITIA Summit — public industry conference",
    title: "Apprenticeships & Work-Based Learning (panel)",
    heldOn: "2026-08-27",
    summary:
      "A 13.4-minute panel on Indiana's employer-led apprenticeship model — the CEMETS iLab Indiana approach where high-school juniors and seniors split weeks between school and paid work, emerging with certificates, associate's degrees, and a profession. Directly relevant to the data-center workforce pipeline: the same model is how critical-environment technicians and IT technicians are trained.",
    decisions: [
      "No votes — public panel discussion",
      "Indiana's apprenticeship model described as employer-led, not government-run",
    ],
    moneyDiscussed: [
      "50 sophomore/junior apprentices working with 25 employers across Indiana",
      "4 in advanced manufacturing, 25 in banking, 16 in healthcare, ~6 in IT",
    ],
    unanswered: [
      "Whether the Microsoft LaPorte site will participate in the apprenticeship program",
    ],
    videoUrl: null,
    minutesUrl: null,
    transcript:
      "# apprentMyRec_0827_1154\n# 805.6s · sha256 a031d5d0ebfda6aa6c872c5256c07f0939fe37de30de12e8b4980cb80b863597\n# PUBLIC — ticketed industry conference, on-record panel\n# ⚠ NOT DIARIZED — speaker-unresolved. Do not attribute.\n\n[0:03:59] SPEAKER [UNRESOLVED]: At one point in time we had 20 or something different in high school. It's now basically balanced as a career. And it's the educational play, employment, and enlistment.\n\n[0:04:12] SPEAKER [UNRESOLVED]: And it's certificates that you can get to go along with high school accreditation. Juniors and seniors now, in the junior year they go to school two days a week, work three days a week. Senior year they go to school one day a week, work four days a week.\n\n[0:04:25] SPEAKER [UNRESOLVED]: They go to high school, they stay in on a third year. They work full time but they'll actually wrap up an associate's degree. Potentially they could do that in the first two years. They have to hustle.\n\n[0:04:46] SPEAKER [UNRESOLVED]: So here all the way through the student is getting a certificate like banking. And it's the same for every bank in the state of Indiana. They're not taking a program that's designed around first international. They can walk into any bank, technically in the United States, not just Indiana. They'll know what the skills are. They'll know the background. They have a true trade and a profession.\n\n[0:05:13] SPEAKER [UNRESOLVED]: He'd been a chef for 15 years. Just deciding not only attention, whatever he wasn't going to do that anymore. Jump back in to the apprenticeship program. That's six months of retooling. He's now a manager at UBS bank. So it is a lifelong opportunity.\n\n[0:05:40] SPEAKER [UNRESOLVED]: Here in this system we'll go with you for life. You start as a 15 year old and for the rest of your career. You can get in and out of the system. Most of it, when they go out for higher education to play, that's paid for also.\n\n[0:06:37] SPEAKER [UNRESOLVED]: So we went from three years ago crazy idea to this fall. We just started up. We have 50 sophomore in juniors working with 25 employers across the state of Indiana, four in advanced manufacturing, 25 in banking, 16 in healthcare. I think Dennis says half a dozen or so in the IT function. So it is up and running.\n\n[0:07:00] SPEAKER [UNRESOLVED]: We have 10 other states coming in here mid September to send out and talk with us and ask me how in the hell they could get this done. Colorado has been trying to do it for 12 years.\n\n[0:07:19] SPEAKER [UNRESOLVED]: And I think our team has success. It's being assisted by the legislation, but it's not being run by the government. It's not being run by the education system. It's being run by the employer.",
    commitments: [
      { speaker: null, speakerRole: "Panel record [UNRESOLVED]", text: "We have 50 sophomore/junior apprentices working with 25 employers across the state of Indiana — four in advanced manufacturing, 25 in banking, 16 in healthcare, and about half a dozen in the IT function.", metricLabel: "Active apprentices statewide", targetValue: "50 students / 25 employers", anchor: "0:06:37", trackerRef: null },
      { speaker: null, speakerRole: "Panel record [UNRESOLVED]", text: "Juniors go to school two days a week, work three days a week. Senior year they go to school one day a week, work four days a week. They can wrap up an associate's degree.", metricLabel: "Apprenticeship structure", targetValue: null, anchor: "0:04:12", trackerRef: null },
    ],
  },
  {
    slug: "itia-summit-2026-08-27-ai-education",
    body: "ITIA Summit — public industry conference",
    title: "Innovation in K-12 & Update on IN AI (panel)",
    heldOn: "2026-08-27",
    summary:
      "An 8.1-minute panel on Indiana's AI-readiness strategy — the statewide platform to activate AI adoption across sectors, the AI use-case library, the project portal, and training resources. Directly relevant to the workforce-development commitments made for the LaPorte site: the same infrastructure is how residents would retrain for data-center careers.",
    decisions: [
      "No votes — public panel discussion",
      "Indiana's AI-readiness platform described: use cases, project portal, training help, peer network",
    ],
    moneyDiscussed: [],
    unanswered: [
      "How LaPorte residents specifically access the AI training resources described",
    ],
    videoUrl: null,
    minutesUrl: null,
    transcript:
      "# ai=MyRec_0827_1212\n# 484.7s · sha256 97867505ae999e8dd1f5b6f6ef00cf7843233b3fd3f01e525b72219bc0a36303\n# PUBLIC — ticketed industry conference, on-record panel\n# ⚠ NOT DIARIZED — speaker-unresolved. Do not attribute.\n\n[0:00:27] SPEAKER [UNRESOLVED]: We do that through a lot of engagement work, particularly in our industry engagement work. As you can imagine, AI has been in front of our conversation quite hopefully for the last few years.\n\n[0:00:49] SPEAKER [UNRESOLVED]: And increasingly the desire from businesses and organizations to move from just simply talking about it to actually putting the technology to work.\n\n[0:01:13] SPEAKER [UNRESOLVED]: In many ways, this kind of continues allowing me in a tradition that for those who've been around and not long enough, I know this legislators here in the room in 1999 in general, assembly created a 21-father not has been a gender-fly ITAA priority for a number of years.\n\n[0:02:14] SPEAKER [UNRESOLVED]: At the same time, we consistently hear from Indiana companies, you all heard it again this morning, the shortage of skilled labor that are limiting their ability to grow and compete effectively. These are productivity plays.\n\n[0:02:37] SPEAKER [UNRESOLVED]: And the matter, because Indiana's demographic projection tells us that population growth alone isn't going to deliver the economic growth we want. For those of you who are data-heaps, that number is actually about 380, 3,000 projected population, and that population grows for the next 35 years, according to IDRC.\n\n[0:02:54] SPEAKER [UNRESOLVED]: That's why Indiana under Governor Brown's leadership is making human-centered, AI-enabled productivity growth a core economic development strategy, and why we're one of the first days in the country to do so. Our ambition is simple. To make Indiana the most AI-ready economy in the country.\n\n[0:03:20] SPEAKER [UNRESOLVED]: And we're doing that by building a statewide platform to activate AI adoption across different sectors, every community in our state, and companies will all sizes, particularly small medium-sized businesses, from one corner of a state.\n\n[0:03:41] SPEAKER [UNRESOLVED]: Here are the four responses to four mostly frequently cited problem statement we hear from the community. I don't know how to guess where to start. We develop AI use cases, Indiana-based AI use cases, not McKenzie use cases, and we have project ideas that you can all work on.\n\n[0:04:01] SPEAKER [UNRESOLVED]: I don't know, I don't have a resource to execute, how do I make the project work, we developed a project portal, can engage you with commercial and on education partners.\n\n[0:04:11] SPEAKER [UNRESOLVED]: And I need to try my employees, my employees are reusing that, for some of that this morning, how do I get my employees up to speed, we have training help against surfacing the resources that are existing in the commercial and education sector in our state world.\n\n[0:04:25] SPEAKER [UNRESOLVED]: Last but not least, I run into problems, specific problems, and I talk to somebody who are faced with the same challenges.",
    commitments: [
      { speaker: null, speakerRole: "Panel record [UNRESOLVED]", text: "Indiana is making human-centered, AI-enabled productivity growth a core economic development strategy. Our ambition is to make Indiana the most AI-ready economy in the country.", metricLabel: "State AI-readiness strategy", targetValue: null, anchor: "0:02:54", trackerRef: null },
      { speaker: null, speakerRole: "Panel record [UNRESOLVED]", text: "We're building a statewide platform to activate AI adoption across different sectors, every community, and companies of all sizes — particularly small and medium-sized businesses.", metricLabel: "Statewide AI adoption platform", targetValue: null, anchor: "0:03:20", trackerRef: null },
    ],
  },
  {
    slug: "itia-summit-2026-08-27-lawmakers",
    body: "ITIA Summit — public industry conference",
    title: "Remarks from Lawmakers & Legislative Champion Award",
    heldOn: "2026-08-27",
    summary:
      "A 5.9-minute remarks session. The speaker — identified by converging circumstantial evidence as Sen. Greg Goode (District 38), though not confirmed by self-introduction — referenced Secretary Goodrich's 'computing centers' phrase, pledged support for AI/STEM education and apprenticeships, and described Indiana's position at the forefront of life sciences, microelectronics, and the quantum corridor. Attribution status: PROBABLE, not confirmed — barred from the ledger until diarization plus human confirmation.",
    decisions: [
      "No votes — legislative remarks",
      "Legislative Champion Award presented",
    ],
    moneyDiscussed: [],
    unanswered: [
      "Speaker attribution is PROBABLE (Sen. Greg Goode) but not confirmed — the recording is barred from the ledger until diarization plus human confirmation",
    ],
    videoUrl: null,
    minutesUrl: null,
    transcript:
      "# MyRec_0827_1251\n# 353.7s · sha256 3518e89270402f352bf6ec695d91a7efa8f1d5a7fe78801247962f5b506368b9\n# PUBLIC — ticketed industry conference, on-record remarks\n# ⚠ Speaker attribution: PROBABLE Sen. Greg Goode — NOT CONFIRMED. Barred from ledger.\n\n[0:00:34] SPEAKER_00 [PROBABLE — Sen. Greg Goode]: Unless I'm meeting with the appropriations chair, Ryan Mishler, I'm going to take that call. You are very, very well served with Jennifer and Sabra and the old great team.\n\n[0:00:47] SPEAKER_00 [PROBABLE]: And I also have to give a special shout out to, I love you all, but the most important person in this room is a person who's a constituent of mine. Instead of District 38, she's on the board of this great organization at Shelley Klingerman.\n\n[0:01:27] SPEAKER_00 [PROBABLE]: So some of you may embrace this statement. Some of you may be offended by it, but I'm going to say it anyway. I am from the government and I'm here to help.\n\n[0:02:11] SPEAKER_00 [PROBABLE]: You certainly don't need a scare tactics around data centers, although Secretary Goodrich, I'm going to continue to use the phrase that you have charged me to computing centers. And I'm sure it's how I'm not going to scare the technology. I want to embrace it.\n\n[0:02:23] SPEAKER_00 [PROBABLE]: I want to create a culture for young people all the way to those who are the driving force of the silver tsunami. That that's what's going to be the answer for the cure of cancer. To uplift a personnel apology to create new transportation systems, to make our livestock resilient, to biological threats, to keep the power on, to help advance the American civilization.\n\n[0:03:10] SPEAKER_00 [PROBABLE]: I will go anywhere and everywhere to say that just as the free world needs the United States of America, the United States of America needs to stay at Indiana. Because we are at the forefront of life sciences, human, animal, and plant health.\n\n[0:03:30] SPEAKER_00 [PROBABLE]: We are at the forefront as they are doing a groundbreaking ceremony in Tippecanoe County. With the multi-billion dollar investment of S. K. Heineck's today. That's where United States Senator Todd Young is. We're at the forefront of microelectronics and chip manufacturing. We're at the forefront of the great quantum corridor in Northern Indiana.\n\n[0:05:15] SPEAKER_00 [PROBABLE]: And to make sure that our who's your children are the leaders in AI, STEM education, apprenticeships, work-based learning and absolutely to continue to bolster our ecosystem through tools such as our certified technology partners.\n\n[0:05:34] SPEAKER_00 [PROBABLE]: These are the things that you all are the forefront. You all are leading. And you have my pledge to continue to do everything I can to help tee up those opportunities to get behind them and then to get out of your way.",
    commitments: [
      { speaker: "Sen. Greg Goode [PROBABLE — not confirmed]", speakerRole: "Indiana Senate, District 38", text: "You have my pledge to continue to do everything I can to help tee up those opportunities to get behind them and then to get out of your way.", metricLabel: "Legislative support for tech ecosystem", targetValue: null, anchor: "0:05:34", trackerRef: null },
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
