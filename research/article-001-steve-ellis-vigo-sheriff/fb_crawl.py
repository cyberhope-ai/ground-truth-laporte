#!/usr/bin/env python3
"""Discover public Facebook video IDs for a page by walking sibling links.

Each public /videos/<id>/ page embeds other video IDs from the same page.
Starting from one known-public video, iteratively harvest until no new IDs
appear. Login-walled content stays invisible — this only reaches what the
page has made public.
"""
import re, json, subprocess, sys, os, time

PAGE = "100072057188004"
SEED = "922589810831037"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "evidence", "video", "_fb_video_ids.json")
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36"

def harvest(vid):
    url = f"https://www.facebook.com/{PAGE}/videos/{vid}/"
    try:
        html = subprocess.run(["curl", "-sL", "--max-time", "40", "-A", UA, url],
                              capture_output=True, text=True, timeout=60).stdout
    except Exception:
        return set()
    return set(re.findall(r'/videos/(\d{10,})', html))

def main():
    seen, queue, found = set(), [SEED], set([SEED])
    while queue:
        vid = queue.pop(0)
        if vid in seen:
            continue
        seen.add(vid)
        new = harvest(vid) - found
        if new:
            print(f"  {vid} -> {len(new)} new", flush=True)
            found |= new
            queue.extend(new)
        time.sleep(0.5)
        if len(found) > 300:
            break
    json.dump(sorted(found), open(OUT, "w"), indent=1)
    print(f"TOTAL public video IDs discovered: {len(found)}")

if __name__ == "__main__":
    main()
