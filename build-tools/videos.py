#!/usr/bin/env python3
"""
build-tools/videos.py — prepares the short video clips uploaded for listings.

For every clip in videos/ that needs it, this:
  - converts it to a web-safe MP4 (H.264) that plays on every phone and browser
    (iPhone .mov / HEVC clips are converted and renamed to .mp4, and the listing
    files are updated to the new name),
  - shrinks it so the longest side is at most 1280 pixels (720p-class), which
    keeps a 10-second clip to roughly 2-4 MB on the live site,
  - removes ALL hidden data (GPS location, device and date tags) and, by default,
    the SOUND (phone clips often capture voices and surroundings),
  - makes a cover frame, videos/<name>-poster.jpg, shown before the clip is played.

A clip that is already clean (MP4/H.264, 1280 px or smaller, no sound, with its
cover frame) is left completely untouched, so running this repeatedly changes
nothing. A clip longer than MAX_SECONDS is reported as a problem and not published.

IMPORTANT LIMIT: this cleans the copy on the website. The original upload stays in
the repository's history (public) forever, which is why clips should be short and
recorded at 720p (see ADMIN_SETUP.md).

Needs ffmpeg: `pip install imageio-ffmpeg` (a self-contained copy) or a system ffmpeg.
With no clips in videos/, it does nothing and needs nothing.

USAGE
    python3 build-tools/videos.py            convert clips in place
    python3 build-tools/videos.py --check    only report what would change
"""

import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VIDEOS = ROOT / "videos"
BUILDS = ROOT / "content" / "builds"
CLIP_EXTS = {".mp4", ".mov", ".m4v"}
MAX_SECONDS = 15          # longer clips are refused (the owner's plan is 10 s or less)
MAX_EDGE = 1280           # longest side in pixels after conversion
CRF = "26"                # quality: lower = bigger and sharper
FPS_MAX = "30"
KEEP_AUDIO = False        # False: sound is removed (privacy, smaller files)
FILTER = ("scale='min({e},iw)':'min({e},ih)':force_original_aspect_ratio=decrease:force_divisible_by=2"
          .format(e=MAX_EDGE))


def ffmpeg_exe():
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return shutil.which("ffmpeg")


def probe(exe, path):
    """Read duration, codec and size from ffmpeg's description of the file. None if unreadable."""
    p = subprocess.run([exe, "-hide_banner", "-i", str(path)], capture_output=True, text=True)
    err = p.stderr
    dur = re.search(r"Duration: (\d+):(\d+):(\d+(?:\.\d+)?)", err)
    vid = re.search(r"Video: ([A-Za-z0-9_]+)[^\n]*?[ ,](\d{2,5})x(\d{2,5})", err)
    if not dur or not vid:
        return None
    return {
        "seconds": int(dur.group(1)) * 3600 + int(dur.group(2)) * 60 + float(dur.group(3)),
        "codec": vid.group(1).lower(),
        "edge": max(int(vid.group(2)), int(vid.group(3))),
        "audio": "Audio:" in err,
    }


def reasons_to_convert(path, info):
    reasons = []
    if path.suffix != ".mp4":
        reasons.append("rename to .mp4")
    if info["codec"] != "h264":
        reasons.append("convert {} to H.264".format(info["codec"]))
    if info["edge"] > MAX_EDGE:
        reasons.append("shrink from {}px".format(info["edge"]))
    if info["audio"] and not KEEP_AUDIO:
        reasons.append("remove the sound")
    return reasons


def poster_path(mp4):
    return mp4.with_name(mp4.stem + "-poster.jpg")


def run(cmd):
    p = subprocess.run(cmd, capture_output=True, text=True)
    if p.returncode != 0:
        raise RuntimeError((p.stderr or "ffmpeg failed").strip().splitlines()[-1])


def convert(exe, src, dst):
    cmd = [exe, "-y", "-hide_banner", "-loglevel", "error", "-i", str(src),
           "-map_metadata", "-1", "-map_chapters", "-1",
           "-vf", FILTER, "-c:v", "libx264", "-preset", "medium", "-crf", CRF,
           "-pix_fmt", "yuv420p", "-fpsmax", FPS_MAX, "-movflags", "+faststart"]
    cmd += ["-c:a", "aac", "-b:a", "96k"] if KEEP_AUDIO else ["-an"]
    run(cmd + ["-f", "mp4", str(dst)])


def make_poster(exe, mp4, seconds):
    t = "{:.2f}".format(min(1.0, seconds / 2.0))
    run([exe, "-y", "-hide_banner", "-loglevel", "error", "-ss", t, "-i", str(mp4),
         "-frames:v", "1", "-map_metadata", "-1", "-vf", FILTER, "-q:v", "4", str(poster_path(mp4))])
    if not poster_path(mp4).is_file() or poster_path(mp4).stat().st_size == 0:
        raise RuntimeError("the cover frame could not be made")


def rewrite_refs(mapping):
    files = sorted(BUILDS.glob("*.json")) if BUILDS.is_dir() else []

    def walk(node):
        if isinstance(node, str):
            for old, new in mapping.items():
                if node in (old, "/" + old, "./" + old):
                    return node.replace(old, new)
            return node
        if isinstance(node, list):
            return [walk(x) for x in node]
        if isinstance(node, dict):
            return {k: walk(v) for k, v in node.items()}
        return node

    for f in files:
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
        except ValueError:
            continue
        new = walk(data)
        if new != data:
            f.write_text(json.dumps(new, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def tidy_posters():
    """Remove cover frames whose clip is gone."""
    if VIDEOS.is_dir():
        for poster in VIDEOS.glob("*-poster.jpg"):
            if not poster.with_name(poster.name[: -len("-poster.jpg")] + ".mp4").exists():
                poster.unlink()


def main(argv):
    check_only = "--check" in argv
    clips = sorted(p for p in VIDEOS.iterdir() if p.is_file() and p.suffix.lower() in CLIP_EXTS) if VIDEOS.is_dir() else []
    if not clips:
        if not check_only:
            tidy_posters()
        print("No video clips; nothing to do.")
        return 0

    exe = ffmpeg_exe()
    if not exe:
        print("Video tools are missing (pip install imageio-ffmpeg), so the {} clip(s) in videos/ can't be checked.".format(len(clips)))
        return 0 if check_only else 1

    problems, done, renames = [], [], {}
    for clip in clips:
        info = probe(exe, clip)
        if info is None:
            problems.append("{}: could not be read as a video.".format(clip.name))
            continue
        if info["seconds"] > MAX_SECONDS:
            problems.append("{}: is {:.0f} seconds long; clips can be at most {} seconds. Trim it, remove it from the listing, and upload the short version.".format(
                clip.name, info["seconds"], MAX_SECONDS))
            continue

        reasons = reasons_to_convert(clip, info)
        final = clip
        if clip.suffix != ".mp4":
            final = clip.with_suffix(".mp4")
            n = 2
            while final.exists():
                final = clip.with_name("{}-{}.mp4".format(clip.stem, n))
                n += 1
        needs_poster = bool(reasons) or not poster_path(final).is_file()
        if not reasons and not needs_poster:
            continue
        if check_only:
            done.append("{}: would {}".format(clip.name, "; ".join(reasons + (["make the cover frame"] if not reasons else []))))
            continue
        try:
            if reasons:
                tmp = final.with_name(final.name + ".tmp")
                convert(exe, clip, tmp)
                os.replace(tmp, final)
                if final != clip:
                    clip.unlink()
                    renames["videos/" + clip.name] = "videos/" + final.name
            seconds = (probe(exe, final) or info)["seconds"]
            make_poster(exe, final, seconds)
            done.append("{}: {}".format(clip.name, "; ".join(reasons) if reasons else "made the cover frame"))
        except Exception as e:
            problems.append("{}: could not be converted ({}).".format(clip.name, e))

    if renames:
        rewrite_refs(renames)

    if not check_only:
        tidy_posters()

    for line in done:
        print(("Would convert " if check_only else "Converted ") + line)
    if not done and not problems:
        print("All {} video clip(s) are already clean.".format(len(clips)))
    if problems:
        print("")
        print("VIDEO PROBLEMS. Nothing was published; the live site keeps its last good version.")
        for line in problems:
            print("  - " + line)
            if os.environ.get("GITHUB_ACTIONS"):
                print("::error::" + line)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
