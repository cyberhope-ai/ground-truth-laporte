# Meeting & conference recordings — intake

Drop audio/video here. Then, from the repo root:

    .venv-audio/bin/python engine/pipeline/diarize_transcribe.py \
        research/laporte-microsoft/evidence/recordings/<file> \
        --outdir research/laporte-microsoft/evidence/recordings

Produces `<stem>.diarized.txt` (readable) and `<stem>.segments.json` (machine-readable,
with sha256 and an empty `speaker_map` to fill in).

## Rules

1. **Provenance first.** Record, per file, *where it was captured and whether the setting was
   public*. Public meetings and public conferences are usable evidence. A side conversation or
   any setting with a reasonable expectation of privacy is **not publishable**, regardless of
   content. Establish this BEFORE ingestion.
2. **Speaker tags are not identities.** `SPEAKER_00` is a voice, not a person. Fill
   `speaker_map` by hand — from the agenda, the chair's introductions, or a known voice — and
   record the *basis*. Unmapped speakers stay `unresolved` and `stages.gate()` bars them from
   any verdict.
3. **Never attribute from context.** "It's the mayor's meeting" is not evidence that a given
   voice is the mayor. This is the exact failure that nearly attributed an interviewee's vote
   to a channel owner in the Vigo pilot.
4. **Numbers get re-listened.** Any figure destined for the ledger is verified against the
   audio at its timestamp — never lifted from machine text.
5. **Cite media as `video + timestamp`**, the way documents cite `document + page`.

## Status

Diarization: **pyannote.audio 4.0.7** installed in `.venv-audio`, CUDA available.
⚠ The model is gated on HuggingFace — set `HF_TOKEN` and accept the model terms once
(free account) before first run.
