# PCOS Veritas Engine

Verification engine producing **custody-sealed, source-traceable verdicts** — for politics,
business, finance, and world events.

Full build specification: `../docs/PCOS_VERITAS_BUILD_SPEC.html`

## What's here now

| Path | State | What it is |
|---|---|---|
| `schema/001_core.sql` | **runnable** | Postgres schema. Subjects + role tenure, custody, renditions, utterances with both gates, claims/evidence/verdicts, congruence index (pgvector), meetings/votes, right-of-reply, publish trigger. |
| `pipeline/stages.py` | **runnable** | Typed contracts for all 12 stages. `gate()` is implemented and tested against the pilot's real failures. |

## The thesis

The published frameworks (ClaimBuster, SAFE, FActScore, OpenFactCheck, FactReasoner,
Perplexica) answer *"is this statement true?"* and forget everything afterward. **Adopt them.**
They are not the moat.

PCOS answers two questions nobody else does:
- **"Is this person saying the same thing in every room?"** — congruence across channels/time
- **"Can you still prove it a year from now?"** — custody-sealed evidence

## The two gates

Every downstream type requires `VerdictEligible`, which only `gate()` can construct:

```python
def gate(u: Utterance) -> VerdictEligible:
    if u.speaker_conf is not SpeakerConfidence.CONFIRMED:
        raise GateError(...)   # unlabeled-speaker trap
    if u.mode is not SpeechMode.ASSERTION:
        raise GateError(...)   # character-voice / satire trap
    return VerdictEligible(utterance=u)
```

Both gates exist because both failures happened in the Vigo pilot on real material:

- **`"I voted against a 0.75 tax"`** — on the subject's own channel, in first person. Spoken by
  his *interviewee*. The subject held no office on that date.
- **`"our county is in great financial health"`** — the subject's own voice, in a two-character
  skit, ridiculing a position he does not hold. Extracting it inverts his actual stance.
  **Diarization does not catch this one** — one speaker, genuinely him.

Regression test:

```
BLOCKED -> speaker unresolved at 0:11:44: cannot attribute to a named person
BLOCKED -> mode=satire at 0:11:44: only plain assertions receive verdicts
PASSES  -> clean assertion
```

## Non-negotiable rules (enforced structurally where possible)

1. **Seal before analysis.** Nothing enters the pipeline unsealed; archive snapshots are taken
   at capture time because pages get edited once coverage is known.
2. **Machine text is a search index, never a quotation source** (`rendition.is_machine_text`).
   Quotes are verified against the page image or audio first.
3. **Numbers never pass through an LLM summarizer** (`evidence.extracted_by`). A summarizer
   produced three different budget figures and three bed counts from *one* article.
4. **Role-by-date before attribution** (`office_holder()`). Two-identifier match minimum.
5. **A null from an out-of-scope source is `NOT_COVERED`, never "none"**
   (`artifact.jurisdiction_scope`). A federal DB showed 0 crashes for an intrastate-only
   carrier that had a fatality.
6. **The adversary pass runs before any verdict.** It hunts the strongest case *against* our own
   finding and marks `stance='mitigates'`. Without it the engine manufactures scandals.
7. **Right of reply is a pipeline stage, not a courtesy** — `publication_reply_gate` blocks
   publication of any finding lacking a logged reply attempt.
8. **Probabilistic model, deterministic execution.** `inputs_hash` + pinned `model_ref` must
   replay to the identical verdict.
9. **Corrections are new rows** (`supersedes_id`). The chain is append-only; nothing in evidence
   custody is destroyable from a web endpoint.

## Build order

- **P0** custody + render + roll-call vote parser → replays the Vigo pilot with zero manual steps
- **P1** resolution + gates + claims ledger → *acceptance: all four pilot failures blocked*
- **P2** retrieve + reason + adversary → deterministic replay verified
- **P3** congruence + editorial console + publish gate
- **P4** realtime tier (recall only — never new judgment at speed)
- **P5** verticals: each is a source adapter + topic taxonomy, not a new engine

## Licensing cautions

- **ClaimBuster claim-spotter is GPL-3.0** → reimplement the published method; do not import.
- **Llama 3 is not open source** (user threshold + naming terms) → default **Qwen** (Apache-2.0)
  + **Claude**. Verify each weight's licence at adoption.
- Verify every module at its source repository before adoption. The source research contains an
  internal contradiction about DeepMind's SAFE and several unverified version claims — plausible
  and sourced are different things.
