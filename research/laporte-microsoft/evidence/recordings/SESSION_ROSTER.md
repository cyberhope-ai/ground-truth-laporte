# 2026 ITIA Summit — session roster & recording map
**Event:** 2026 ITIA Summit, presented by First Internet Bank · **Fishers, Indiana ·
2026-08-27** · agenda photographed on site (`itia_agenda_2026-08-27.jpg`, sha256 in
`_custody.json`).
**Recordings:** 5 files, **109 minutes**, captured by an attendee. **Setting: PUBLIC** —
ticketed industry conference with on-record panels. Provenance confirmed.

> **This roster is the candidate-speaker list, not an attribution.** It narrows who *could*
> be speaking in each session. A voice is only attached to a name once diarization separates
> the speakers AND a human confirms the mapping (self-introduction, the moderator naming
> them, or a known voice). Until then every line stays `unresolved` and is barred from the
> claims ledger by `stages.gate()`.

## Agenda → likely recording

| Agenda slot | Session | Speakers | Likely file |
|---|---|---|---|
| 9:10 | Welcome | **Jennifer Hallowell** (Exec. Dir., ITIA) · **David Becker** (Chair & CEO, First Internet Bank; Chair, ITIA Board) | not captured |
| 9:15 | Hoosier Higher Ed preparing graduates | mod. **John Fernandez** (CEO, Amplify Bloomington) · **Alison Bell** (RVP, WGU) · **Mike Bottorff** (VP School of IT, **Ivy Tech**) · **Dr. Stephanie Fernhaber** (Assoc. Dean, Butler Founders College) · **Dr. Andy Miller** (EVP, Indiana Wesleyan National & Global) | possibly `apprent…1154` |
| **10:00** | **★ Data Center Development that Works for Hoosier Communities** | mod. **Megan Glover** (Chief Digital Officer, Usalco) · **La Porte Mayor Tom Dermody** · **Cloteal LaBroi** (Director of Infrastructure & Government Affairs, **Microsoft**) · **Brad Tietz** (Dir. Midwest State Gov't Affairs, **Data Center Coalition**) | **`itia__0827_1047`** (46.8 min) |
| 10:50 | Spotlight on Venture Capital | mod. **Mike Trotzke** (Partner, Paragraph Ventures) · **Toph Day** (CEO, Elevate Ventures) · **Ray Fraser** (Sr. Consultant, Graham Allen Partners) · **Travis Stegemoller** (GC, gener8tor) | **`vc-MyRec_0827_1139`** (34.7 min) |
| 11:35 | Innovation in K-12 & update on IN AI | **David Becker** (Co-Chair, CEMETS iLab Indiana) · **Dennis Trinkle** (Pres. & CEO, TechIndiana) · **Don Wettrick** (Founder, STARTedUP Foundation) · **Ting Gootee** (EVP Digital Adoption, CICP) | `ai=MyRec_0827_1212` (8.1 min) |
| 12:00 | Lunch with Lawmakers | — | — |
| 12:20 | ITIA Update | ITIA | — |
| 12:30 | Remarks from Lawmakers & Legislative Champion Award | **Sen. Greg Goode** · **Rep. Danny Lopez** · **Rep. Carey Hamilton** | — |
| **12:45** | **★ Fireside Chat with Indiana Secretary of Commerce Chuck Goodrich** | mod. **Jennifer Hallowell** | **`MyRec_0827_1251`** (5.9 min) |
| 1:15 | Closing | — | — |

⚠ File↔session mapping above is **inferred from filenames, timestamps and duration**. It must
be **confirmed from the audio content itself** before any quote is attributed. Do not treat the
table as established.

### ✅ First confirmation — and my inference was already wrong

`MyRec_0827_1251` is **not** the 12:45 Goodrich fireside chat. The content identifies it as the
**12:30 "Remarks from Lawmakers"** slot, and the speaker is **a legislator, not the Secretary**:

- *"Instead of District 38, she's on the board of this great organization"* → **Indiana Senate
  District 38** = **Sen. Greg Goode**, who is on the agenda for that slot.
- The speaker refers to Goodrich in the **third person**: *"Secretary Goodrich, I'm going to
  continue to use the phrase that you have charged me to — computing centers."*
- Other internal markers: thanks "Jennifer" (Hallowell) and ITIA staff; references appropriations
  chair **Ryan Mishler**; mentions **Rose-Hulman** "in my district" (Terre Haute = District 38).

**Attribution status: PROBABLE — Sen. Greg Goode. Not confirmed.** Converging circumstantial
evidence is not a self-introduction. It stays `probable` until diarization plus a human
confirmation, and it is barred from the ledger until then.

**Why this matters more than the correction itself:** a filename, a timestamp and an agenda all
pointed at the wrong person, and only the audio caught it. Had we published "Secretary Goodrich
said…" we would have put a state official's name on another man's words. **This is the fifth
distinct attribution failure mode the project has now encountered in the field — and the first
one where the misleading signal was our own metadata.**

## Why the 10:00 panel is the highest-value recording we have

It puts **the LaPorte mayor and Microsoft's Director of Infrastructure & Government Affairs on
the same stage**, on the record, on exactly the subject of our first site. Anything either says
about jobs, taxes, water, power or community benefits is directly testable against the
commitments already seeded from LaPorte's own council minutes.

The 12:45 fireside is the **Chuck Goodrich** conversation reported by IBJ the next day — the
one where he said officials "need to better communicate the benefits of growth," and referred
to data centers as "computing centers." Having the primary audio means we can check the
reporting against the recording, in both directions.

## Named individuals → `subject` + `role_tenure` seed

Jennifer Hallowell (ITIA) · David Becker (First Internet Bank; ITIA Board; CEMETS iLab) ·
John Fernandez (Amplify Bloomington) · Alison Bell (WGU) · Mike Bottorff (Ivy Tech) ·
Stephanie Fernhaber (Butler) · Andy Miller (Indiana Wesleyan) · Megan Glover (Usalco) ·
**Tom Dermody (Mayor, City of La Porte)** · **Cloteal LaBroi (Microsoft)** ·
**Brad Tietz (Data Center Coalition)** · Mike Trotzke (Paragraph Ventures) · Toph Day
(Elevate Ventures) · Ray Fraser (Graham Allen Partners) · Travis Stegemoller (gener8tor) ·
Dennis Trinkle (TechIndiana) · Don Wettrick (STARTedUP) · Ting Gootee (CICP) ·
Sen. Greg Goode · Rep. Danny Lopez · Rep. Carey Hamilton ·
**Chuck Goodrich (Indiana Secretary of Commerce)**

*Note for the disclosure ledger: **Ivy Tech** appears here as a summit participant and also
holds a signed **Datacenter Academy MOU with Microsoft** (6/17/2026) — and is a prospective
advertiser on the site. Record the relationship now; disclose it if Ivy Tech ever appears in a
finding.*

## Processing status

- ✅ Copied, hashed (sha256), provenance recorded → `_custody.json`
- ✅ Converted to mono 16 kHz for transcription
- ✅ Transcribed → `transcripts/` — **speaker-unresolved, marked in every file header**
- ⏳ **Diarization pending** — `pyannote.audio` 4.0.7 is installed with CUDA, but the model is
  gated on HuggingFace. Needs a free account, one-time acceptance of the model terms, and
  `HF_TOKEN` in the environment. **Until then nothing here may be attributed to a named person.**
