#!/usr/bin/env python3
"""Transcribe captured video/audio evidence to timestamped text.

Timestamps are mandatory: a claim must cite media + time the way a document
claim cites document + page.
"""
import sys, os, json, hashlib, datetime
from faster_whisper import WhisperModel

BASE = os.path.dirname(os.path.abspath(__file__))
VID = os.path.join(BASE, "evidence", "video")
OUT = os.path.join(BASE, "evidence", "video-text")
os.makedirs(OUT, exist_ok=True)

def sha256(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for c in iter(lambda: f.read(1 << 20), b""):
            h.update(c)
    return h.hexdigest()

def hms(s):
    return str(datetime.timedelta(seconds=int(s)))

def main():
    files = sys.argv[1:] or [f for f in sorted(os.listdir(VID)) if f.endswith((".mp3", ".m4a", ".wav"))]
    model = WhisperModel("base.en", device="cpu", compute_type="int8")
    index = []
    for name in files:
        path = os.path.join(VID, name)
        stem = os.path.splitext(name)[0]
        out = os.path.join(OUT, stem + ".txt")
        print(f"[transcribe] {name}", flush=True)
        segs, info = model.transcribe(path, vad_filter=True, beam_size=5)
        lines, n = [], 0
        for s in segs:
            lines.append(f"[{hms(s.start)}] {s.text.strip()}")
            n += 1
        with open(out, "w") as f:
            f.write(f"# {stem}\n# duration {info.duration:.0f}s · {n} segments\n")
            f.write(f"# source sha256 {sha256(path)}\n\n")
            f.write("\n".join(lines))
        index.append({"file": name, "text": os.path.basename(out), "segments": n,
                      "duration_s": round(info.duration, 1), "sha256": sha256(path)})
        print(f"  -> {n} segments, {info.duration:.0f}s", flush=True)
    with open(os.path.join(OUT, "_index.json"), "w") as f:
        json.dump(index, f, indent=1)
    print("DONE")

if __name__ == "__main__":
    main()
