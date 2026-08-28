#!/usr/bin/env python3
"""Meeting-recording intake: diarize -> transcribe -> speaker-attributed transcript.

Run with the isolated audio venv:
    ../../.venv-audio/bin/python diarize_transcribe.py <audio...> [--speakers N]

WHY DIARIZATION IS MANDATORY HERE
A council chamber holds a mayor, councillors, company representatives, staff and
public commenters. Plain transcription produces first-person text with no speaker
attached — and in the Vigo pilot that nearly attributed an interviewee's vote to
the channel's owner. Every utterance leaves this script tagged SPEAKER_nn, and
nothing may be attributed to a *named* person until a human maps those tags to
identities. Unmapped speakers stay `unresolved` and are barred from verdicts by
`stages.gate()`.

Output per file:
  <stem>.diarized.txt   human-readable, [t] SPEAKER_nn: text
  <stem>.segments.json  machine-readable + sha256 + speaker map stub

MODEL ACCESS: pyannote speaker-diarization-3.1 is gated on HuggingFace. Set
HF_TOKEN and accept the model terms once, or point --model at a local checkpoint.
"""
from __future__ import annotations

import argparse, datetime, hashlib, json, os, sys

DEFAULT_MODEL = "pyannote/speaker-diarization-3.1"


def sha256(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def hms(seconds: float) -> str:
    return str(datetime.timedelta(seconds=int(seconds)))


def diarize(path: str, model: str, token: str | None,
            num_speakers: int | None, min_spk: int | None, max_spk: int | None):
    from pyannote.audio import Pipeline
    import torch

    pipe = Pipeline.from_pretrained(model, use_auth_token=token)
    if torch.cuda.is_available():
        pipe.to(torch.device("cuda"))
    kw = {}
    if num_speakers:
        kw["num_speakers"] = num_speakers
    else:
        if min_spk: kw["min_speakers"] = min_spk
        if max_spk: kw["max_speakers"] = max_spk
    ann = pipe(path, **kw)
    return [(t.start, t.end, label) for t, _, label in ann.itertracks(yield_label=True)]


def transcribe(path: str, model_size: str = "base.en"):
    from faster_whisper import WhisperModel
    m = WhisperModel(model_size, device="cpu", compute_type="int8")
    segs, info = m.transcribe(path, vad_filter=True, beam_size=5)
    return [(s.start, s.end, s.text.strip()) for s in segs], info.duration


def speaker_at(turns, start: float, end: float) -> str:
    """Assign the speaker whose turn overlaps this span the most."""
    best, best_overlap = "SPEAKER_UNKNOWN", 0.0
    for t0, t1, label in turns:
        ov = min(end, t1) - max(start, t0)
        if ov > best_overlap:
            best, best_overlap = label, ov
    return best


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("audio", nargs="+")
    ap.add_argument("--speakers", type=int, help="exact speaker count if known")
    ap.add_argument("--min-speakers", type=int)
    ap.add_argument("--max-speakers", type=int)
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--whisper", default="base.en")
    ap.add_argument("--outdir", default=".")
    args = ap.parse_args()

    token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_TOKEN")
    os.makedirs(args.outdir, exist_ok=True)

    for path in args.audio:
        stem = os.path.splitext(os.path.basename(path))[0]
        print(f"[{stem}] hashing…", flush=True)
        digest = sha256(path)

        print(f"[{stem}] diarizing…", flush=True)
        try:
            turns = diarize(path, args.model, token,
                            args.speakers, args.min_speakers, args.max_speakers)
        except Exception as exc:                       # noqa: BLE001
            print(f"[{stem}] DIARIZATION FAILED: {exc}", file=sys.stderr)
            print(f"[{stem}] refusing to emit an un-diarized transcript for a "
                  f"multi-speaker recording — that is the exact failure this "
                  f"stage exists to prevent.", file=sys.stderr)
            continue

        speakers = sorted({s for _, _, s in turns})
        print(f"[{stem}] {len(turns)} turns, {len(speakers)} distinct speakers", flush=True)

        print(f"[{stem}] transcribing…", flush=True)
        segs, duration = transcribe(path, args.whisper)

        rows, lines = [], []
        for start, end, text in segs:
            spk = speaker_at(turns, start, end)
            rows.append({"t_start": round(start, 2), "t_end": round(end, 2),
                         "speaker_tag": spk, "text": text,
                         "speaker_id": None, "speaker_conf": "unresolved"})
            lines.append(f"[{hms(start)}] {spk}: {text}")

        txt = os.path.join(args.outdir, f"{stem}.diarized.txt")
        with open(txt, "w", encoding="utf-8") as f:
            f.write(f"# {stem}\n# duration {duration:.0f}s | {len(rows)} segments | "
                    f"{len(speakers)} speakers\n# source sha256 {digest}\n"
                    f"# SPEAKER TAGS ARE NOT IDENTITIES. Map them to people before "
                    f"attributing anything.\n\n")
            f.write("\n".join(lines))

        js = os.path.join(args.outdir, f"{stem}.segments.json")
        json.dump({
            "source_file": os.path.basename(path),
            "sha256": digest,
            "duration_s": round(duration, 1),
            "diarization_model": args.model,
            "asr_model": args.whisper,
            "speaker_map": {s: {"subject_id": None, "display_name": None,
                                "basis": None} for s in speakers},
            "segments": rows,
        }, open(js, "w", encoding="utf-8"), indent=1)

        print(f"[{stem}] -> {txt}\n[{stem}] -> {js}", flush=True)
        print(f"[{stem}] NEXT: fill speaker_map (who is SPEAKER_00?) before any "
              f"claim extraction.\n", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
