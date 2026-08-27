# Video evidence — capture index

Audio + metadata for every video statement captured. Media binaries stay local
(gitignored); `_index.json` + transcripts in `../video-text/` carry sha256, duration and
source URL so custody is provable without shipping binaries.

## Facebook — "Holding Vigo County Accountable" (11 videos, ~42 min, ~290K cumulative views)
Discovered by harvesting sibling video IDs from the rendered DOM of one public video page
(the page's video/reels TABS are login-walled; individual public video permalinks are not).

| ID | Len | Title |
|---|---|---|
| `1700901684504491` | 7.0m | 👇THIS |
| `1322256463288467` | 6.6m | I met with some school board members. |
| `922589810831037` | 4.9m | Drama at the County Council meeting??? 🤯 |
| `1231996169990900` | 4.0m | EDIT: I meant to also suggest moving 6th grade back to elementary as i |
| `1052990794134794` | 3.8m | 🔴Teachers are upset & Scare Tactics??? |
| `1040473558903112` | 3.7m | Data centers? Person X??? Steve Ellis exposes a few things you need to |
| `1354014320201045` | 3.3m | ❓Here are a few of the questions that you guys messaged in. Thanks! |
| `2090730531823652` | 2.8m | A local commissioner suggested I do this, so I took his advice! 🤷‍♂️ |
| `2157983381780451` | 2.1m | I recently spoke to a group of educators. |
| `1600394931654599` | 2.0m | Fast response to school recommendations. |
| `1060276726620881` | 1.7m | Do we have our childrens' best interest at heart? ❤️ |

## YouTube — same operation (2 videos, Oct 2018, 62 min)

| ID | Date | Len | Note |
|---|---|---|---|
| `PtrlMbzXtdU` | 2018-10-15 | 52m | Interview w/ councilman Brendan Kearns — jail siting, jail plan, TAX TALK, tax effect. Kearns = one of 2 NO votes on the 2018 jail tax. **QUARANTINED pending diarization.** |
| `0lwp8Evi2Io` | 2018-10-18 | 10m | Interview w/ prosecutor Terry Modesitt. **QUARANTINED pending diarization.** |

## Rules
- Media claims cite **video + timestamp**, exactly as document claims cite **document + page**.
- **No first-person statement from an un-diarized transcript may be attributed to a named person.**
  Multi-speaker recordings (both YouTube interviews) are quarantined until voices are separated.
- Transcription runs **locally** (faster-whisper). Evidence is never uploaded to third-party
  transcription services — that would break custody and leak the investigation.

## Still not captured
The page's **Reels tab and full post history** remain login-walled. Reels in particular are
invisible to this method. Needs a logged-in human session or a licensed scraping API,
archiving BEFORE any contact is made.
