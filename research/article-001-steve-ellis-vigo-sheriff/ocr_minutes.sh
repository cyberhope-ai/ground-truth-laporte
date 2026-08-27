#!/usr/bin/env bash
# OCR the Vigo County Council minutes (scanned PDFs -> page-level text).
# Page-level output is deliberate: a claim must cite document + page.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
PDF_DIR="$BASE/evidence/vigo-council-minutes"
TXT_DIR="$BASE/evidence/vigo-council-text"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
mkdir -p "$TXT_DIR"

for f in "$PDF_DIR"/*.pdf; do
  base="$(basename "$f" .pdf)"
  out="$TXT_DIR/$base.txt"
  [ -s "$out" ] && [ "$(wc -c < "$out")" -gt 500 ] && { echo "skip (done): $base"; continue; }
  : > "$out"
  pdftoppm -r 300 -gray -png "$f" "$WORK/pg" 2>/dev/null
  for img in "$WORK"/pg-*.png; do
    [ -e "$img" ] || continue
    pnum="$(basename "$img" .png | sed 's/^pg-0*//')"
    printf '\n===== [%s] PAGE %s =====\n' "$base" "$pnum" >> "$out"
    tesseract "$img" - --oem 1 --psm 6 2>/dev/null >> "$out"
  done
  rm -f "$WORK"/pg-*.png
  echo "OCR done: $base ($(wc -c < "$out") chars)"
done
echo "ALL OCR COMPLETE"
