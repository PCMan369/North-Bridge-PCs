#!/usr/bin/env python3
"""
build-tools/photos.py — cleans every photo in images/ so phone uploads are safe
and light to publish.

For each photo that needs it, this:
  - applies the camera's rotation (so the picture isn't sideways),
  - removes ALL hidden data (GPS location, camera details, colour profile),
    converting colours to sRGB first so they don't shift,
  - shrinks it so the longest side is at most 2000 pixels,
  - saves it as a JPEG (PNG/WebP/HEIC are converted and renamed to .jpg, and
    the listing files are updated to the new name).

A photo that is already clean (JPEG, no hidden data, 2000 px or smaller,
under 1.5 MB) is left completely untouched, so running this repeatedly
changes nothing.

IMPORTANT LIMIT: this cleans the copy that goes on the website and in the
repository from now on. It cannot erase a copy that was already saved in the
repository's history, so the best protection is to switch off location
tagging in the phone camera (see ADMIN_SETUP.md).

Needs Pillow (pip install pillow pillow-heif). pillow-heif is only needed
for HEIC files.

USAGE
    python3 build-tools/photos.py            clean photos in place
    python3 build-tools/photos.py --check    only report what would change
"""

import io
import json
import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageCms, ImageOps
except ImportError:
    print("Pillow is not installed (pip install pillow). Skipping photo cleanup.")
    sys.exit(0 if "--check" in sys.argv else 1)

try:
    import pillow_heif
    pillow_heif.register_heif_opener()
    HEIF_OK = True
except ImportError:
    HEIF_OK = False

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "images"
CONTENT_FILES = [ROOT / "content" / "photo-alts.json", ROOT / "content" / "gallery-extras.json", ROOT / "content" / "part-boxes.json"]
PHOTO_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"}
MAX_EDGE = 2000
QUALITY = 85
MAX_BYTES = 1_500_000
METADATA_KEYS = ("exif", "icc_profile", "xmp", "XML:com.adobe.xmp", "photoshop", "comment")


def why_it_needs_work(path, img):
    """Return a list of reasons (empty = already clean)."""
    reasons = []
    if img.format != "JPEG":
        reasons.append("convert {} to JPEG".format(img.format or "unknown format"))
    if len(img.getexif()) or any(k in img.info for k in METADATA_KEYS):
        reasons.append("remove hidden data (location, camera, colour profile)")
    if max(img.size) > MAX_EDGE:
        reasons.append("shrink from {}x{}".format(*img.size))
    if path.stat().st_size > MAX_BYTES:
        reasons.append("reduce file size ({:.1f} MB)".format(path.stat().st_size / 1e6))
    return reasons


def clean_image(img):
    img.load()
    icc = img.info.get("icc_profile")
    img = ImageOps.exif_transpose(img)          # apply camera rotation, then forget the tag
    if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
        rgba = img.convert("RGBA")
        flat = Image.new("RGB", rgba.size, (255, 255, 255))
        flat.paste(rgba, mask=rgba.split()[3])
        img = flat
    elif icc:
        try:
            src = ImageCms.ImageCmsProfile(io.BytesIO(icc))
            dst = ImageCms.createProfile("sRGB")
            img = ImageCms.profileToProfile(img.convert("RGB"), src, dst, outputMode="RGB")
        except Exception:
            img = img.convert("RGB")
    if img.mode != "RGB":
        img = img.convert("RGB")
    if max(img.size) > MAX_EDGE:
        img.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
    return img


def unique_target(src):
    target = src.with_suffix(".jpg")
    n = 2
    while target.exists() and target != src:
        target = src.with_name("{}-{}.jpg".format(src.stem, n))
        n += 1
    return target


def rewrite_refs(mapping):
    """Replace old photo names with new ones in the content files (builds, alts, extras)."""
    files = sorted((ROOT / "content" / "builds").glob("*.json")) + CONTENT_FILES

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
        if not f.exists():
            continue
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
        except ValueError:
            continue        # content.py reports unreadable files
        new = walk(data)
        if new != data:
            f.write_text(json.dumps(new, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main(argv):
    check_only = "--check" in argv
    if not IMAGES.is_dir():
        print("No images folder found; nothing to do.")
        return 0

    problems, done, renames = [], [], {}
    for path in sorted(IMAGES.iterdir()):
        if path.suffix.lower() not in PHOTO_EXTS or not path.is_file():
            continue
        try:
            img = Image.open(path)
            img.load()
        except Exception as e:
            kind = "HEIC photos need the pillow-heif add-on" if path.suffix.lower() in (".heic", ".heif") and not HEIF_OK else str(e)
            problems.append("{}: could not be opened ({}).".format(path.name, kind))
            continue

        reasons = why_it_needs_work(path, img)
        if not reasons:
            continue
        if check_only:
            done.append("{}: would {}".format(path.name, "; ".join(reasons)))
            continue

        try:
            cleaned = clean_image(img)
            target = path if img.format == "JPEG" else unique_target(path)
            tmp = target.with_name(target.name + ".tmp")
            cleaned.save(tmp, "JPEG", quality=QUALITY, optimize=True, progressive=True, icc_profile=None)
            os.replace(tmp, target)
            # Prove it: reopen and make sure nothing hidden survived.
            check = Image.open(target)
            if len(check.getexif()) or any(k in check.info for k in ("exif", "icc_profile", "xmp")):
                raise RuntimeError("hidden data was still present after cleaning")
            if target != path:
                path.unlink()
                renames["images/" + path.name] = "images/" + target.name
            done.append("{}: {}".format(path.name, "; ".join(reasons)))
        except Exception as e:
            problems.append("{}: could not be cleaned ({}).".format(path.name, e))

    if renames:
        rewrite_refs(renames)

    for line in done:
        print(("Would clean " if check_only else "Cleaned ") + line)
    if not done and not problems:
        print("All {} photos are already clean.".format(sum(1 for p in IMAGES.iterdir() if p.suffix.lower() in PHOTO_EXTS)))
    if problems:
        print("")
        print("PHOTO PROBLEMS. Nothing was published; the live site keeps its last good version.")
        for line in problems:
            print("  - " + line)
            if os.environ.get("GITHUB_ACTIONS"):
                print("::error::" + line)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
