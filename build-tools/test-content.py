#!/usr/bin/env python3
"""
build-tools/test-content.py — tests for the admin/publishing scripts
(content.py and photos.py). Works on a throwaway copy of the repo, so it
never changes your files.

    python3 build-tools/test-content.py

Needs Pillow. HEIC checks run only if pillow-heif is installed.
Exit code 0 = all passed.
"""

import copy
import hashlib
import io
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

try:
    from PIL import Image, ImageCms
except ImportError:
    print("Pillow is required for these tests (pip install pillow).")
    sys.exit(1)

REPO = Path(__file__).resolve().parent.parent
results = []


def check(name, condition, detail=""):
    results.append((name, bool(condition), detail))
    print("{} {}{}".format("PASS" if condition else "FAIL", name, ("  -> " + detail) if (detail and not condition) else ""))


def make_sandbox():
    tmp = Path(tempfile.mkdtemp(prefix="nbpcs-test-"))
    (tmp / "build-tools").mkdir()
    for f in ("content.py", "photos.py", "stitch.py"):
        shutil.copy(REPO / "build-tools" / f, tmp / "build-tools" / f)
    shutil.copytree(REPO / "content", tmp / "content")
    shutil.copytree(REPO / "images", tmp / "images")
    (tmp / "js" / "data").mkdir(parents=True)
    for f in ("events.js", "partBoxes.js"):
        shutil.copy(REPO / "js" / "data" / f, tmp / "js" / "data" / f)
    return tmp


def run(tmp, script, *args):
    p = subprocess.run([sys.executable, str(tmp / "build-tools" / script)] + list(args),
                       capture_output=True, text=True, cwd=tmp)
    return p.returncode, p.stdout + p.stderr


def base_listing():
    return json.loads((REPO / "content" / "builds" / "oct26-01.json").read_text(encoding="utf-8"))


def put(tmp, name, data, raw=None):
    (tmp / "content" / "builds" / name).write_text(raw if raw is not None else json.dumps(data, indent=2), encoding="utf-8")


def built_list(tmp):
    src = (tmp / "js" / "data" / "builds.js").read_text(encoding="utf-8")
    body = src.split("const builds = ", 1)[1].rstrip().rstrip(";")
    return json.loads(body)


def new_listing(**over):
    d = copy.deepcopy(base_listing())
    d.update({"id": "nov26-01", "title": "Test PC", "status": "available", "price": 700, "listedDate": "2026-11-01"})
    d.update(over)
    return d


# ------------------------------------------------------------------ listings

def test_listings():
    tmp = make_sandbox()
    code, out = run(tmp, "content.py")
    check("baseline listings pass", code == 0, out)
    committed = (REPO / "js" / "data" / "builds.js").read_text(encoding="utf-8")
    check("generated builds.js matches the committed file",
          (tmp / "js" / "data" / "builds.js").read_text(encoding="utf-8") == committed)
    committed_g = (REPO / "js" / "data" / "gallery.js").read_text(encoding="utf-8")
    check("generated gallery.js matches the committed file",
          (tmp / "js" / "data" / "gallery.js").read_text(encoding="utf-8") == committed_g)
    shutil.rmtree(tmp)

    def expect_fail(label, listing=None, fragment="", name="nov26-01.json", raw=None):
        t = make_sandbox()
        put(t, name, listing, raw)
        before = (t / "js" / "data" / "builds.js").exists()
        code, out = run(t, "content.py")
        check(label, code == 1 and fragment.lower() in out.lower(), out[-300:])
        check(label + " (nothing written)", not (t / "js" / "data" / "builds.js").exists() or not before)
        shutil.rmtree(t)

    expect_fail("available listing without a price is blocked", new_listing(price=""), "needs a price")
    expect_fail("non-numeric price is blocked", new_listing(price="six hundred"), "must be a number")
    expect_fail("negative price is blocked", new_listing(price=-5), "negative")
    expect_fail("available listing without photos is blocked", new_listing(images=[]), "at least one photo")
    expect_fail("missing photo file is blocked", new_listing(images=["/images/does-not-exist.jpg"]), "isn't in the images folder")
    expect_fail("bad ID format is blocked", new_listing(id="Nov 26"), "right format", name="Nov 26.json")
    expect_fail("file name must match ID", new_listing(id="nov26-02"), "must match")
    dup = new_listing(id="oct26-01")
    expect_fail("duplicate ID is blocked", dup, "already uses this id")
    expect_fail("broken JSON is blocked", None, "isn't valid json", raw='{"id": "nov26-01", "title": }')
    bad_perf = new_listing(performance={"isEstimate": True, "items": [{"game": "Fortnite", "fps": "", "settings": "1080p"}]})
    expect_fail("incomplete performance row is blocked", bad_perf, "performance row 1")
    expect_fail("unknown status is blocked", new_listing(status="live"), "status should be")
    expect_fail("sold listing with missing photo is blocked", new_listing(status="sold", images=["/images/nope.jpg"]), "isn't in the images folder")

    # drafts / hidden are allowed to be incomplete and never reach the site
    t = make_sandbox()
    put(t, "nov26-01.json", {"id": "nov26-01", "title": "", "status": "draft", "price": ""})
    put(t, "nov26-02.json", new_listing(id="nov26-02", status="hidden", images=["/images/gone.jpg"]))
    code, out = run(t, "content.py")
    ids = [b["id"] for b in built_list(t)]
    check("incomplete draft and hidden listings are accepted", code == 0, out)
    check("draft and hidden listings are left out of builds.js", "nov26-01" not in ids and "nov26-02" not in ids)
    check("a hidden listing with a missing photo only warns", "gone.jpg" in out and code == 0)
    gal = (t / "js" / "data" / "gallery.js").read_text(encoding="utf-8")
    check("draft/hidden photos are not in the gallery", "gone.jpg" not in gal)
    shutil.rmtree(t)

    # price formatting, ordering, special characters, sold alt text
    t = make_sandbox()
    put(t, "nov26-01.json", new_listing(price=1299.5, title='27" "Monitor" & <b>Bundle</b>'))
    shutil.copy(t / "images" / "box-01.jpg", t / "images" / "no-description.jpg")   # a photo with no saved description
    put(t, "dec26-01.json", new_listing(id="dec26-01", status="sold", price=1200, listedDate="2026-12-02", title="Newest Sold",
                                        images=["/images/no-description.jpg"]))
    code, out = run(t, "content.py")
    b = {x["id"]: x for x in built_list(t)}
    order = [x["id"] for x in built_list(t)]
    check("price shown with cents when needed", b["nov26-01"]["price"] == "$1,299.50", b["nov26-01"]["price"])
    check("whole-dollar price has no cents and uses commas", b["dec26-01"]["price"] == "$1,200")
    check("listings are ordered newest first", order[:2] == ["dec26-01", "nov26-01"], str(order))
    check("quotes and symbols survive into the data file", b["nov26-01"]["title"] == '27" "Monitor" & <b>Bundle</b>')
    gal = (t / "js" / "data" / "gallery.js").read_text(encoding="utf-8")
    check("sold listing photos get a 'previously sold' description", "Newest Sold, photo 1 \\u2014 previously sold" in gal or "Newest Sold, photo 1 \u2014 previously sold" in gal)
    shutil.rmtree(t)

    # deleting a photo used by another file is caught
    t = make_sandbox()
    (t / "images" / "box-01.jpg").unlink()
    code, out = run(t, "content.py")
    check("a deleted part-box photo is caught", code == 1 and "box-01.jpg" in out, out[-200:])
    shutil.rmtree(t)


# ------------------------------------------------------------------ photos

def jpeg_with_gps(path, size=(3000, 2000), orientation=6, icc=False):
    img = Image.new("RGB", size, (200, 80, 40))
    exif = Image.Exif()
    exif[0x0112] = orientation
    exif[0x010F] = "TestCam"
    gps = exif.get_ifd(0x8825)
    gps[1], gps[2], gps[3], gps[4] = "N", (42.0, 26.0, 0.0), "W", (123.0, 19.0, 0.0)
    kwargs = {"exif": exif, "quality": 90}
    if icc:
        kwargs["icc_profile"] = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB")).tobytes()
    img.save(path, "JPEG", **kwargs)


def has_hidden_data(path):
    im = Image.open(path)
    return bool(len(im.getexif())) or any(k in im.info for k in ("exif", "icc_profile", "xmp"))


def test_photos():
    t = make_sandbox()
    before_hash = hashlib.sha256((t / "images" / "box-01.jpg").read_bytes()).hexdigest()

    jpeg_with_gps(t / "images" / "phone-photo.jpg")
    jpeg_with_gps(t / "images" / "with-icc.jpg", size=(800, 600), orientation=1, icc=True)
    check("test photo really contains GPS before cleaning",
          bool(Image.open(t / "images" / "phone-photo.jpg").getexif().get_ifd(0x8825)))
    Image.new("RGBA", (600, 400), (10, 120, 200, 128)).save(t / "images" / "screenshot.png")
    listing = new_listing(images=["/images/screenshot.png", "/images/phone-photo.jpg"])
    put(t, "nov26-01.json", listing)

    code, out = run(t, "photos.py", "--check")
    check("--check reports work but changes nothing", code == 0 and "Would clean phone-photo.jpg" in out and (t / "images" / "screenshot.png").exists(), out)

    code, out = run(t, "photos.py")
    check("photo cleaning succeeds", code == 0, out)
    cleaned = Image.open(t / "images" / "phone-photo.jpg")
    check("location and camera data removed", not has_hidden_data(t / "images" / "phone-photo.jpg"))
    check("rotation applied before stripping (3000x2000 + rotate 6 -> portrait, <=2000px)",
          cleaned.size[1] > cleaned.size[0] and max(cleaned.size) <= 2000, str(cleaned.size))
    check("colour profile removed", not has_hidden_data(t / "images" / "with-icc.jpg"))
    check("PNG converted to .jpg and the old file removed",
          (t / "images" / "screenshot.jpg").exists() and not (t / "images" / "screenshot.png").exists())
    updated = json.loads((t / "content" / "builds" / "nov26-01.json").read_text(encoding="utf-8"))
    check("listing updated to the new photo name", updated["images"][0] == "/images/screenshot.jpg", str(updated["images"]))
    code, out = run(t, "content.py", "--check")
    check("listing still passes the check after conversion", code == 0, out)
    check("already-clean photos are left byte-for-byte untouched",
          hashlib.sha256((t / "images" / "box-01.jpg").read_bytes()).hexdigest() == before_hash)
    code, out = run(t, "photos.py")
    check("second run changes nothing", code == 0 and "already clean" in out, out)

    try:
        import pillow_heif
        pillow_heif.register_heif_opener()
        img = Image.new("RGB", (1200, 900), (30, 160, 90))
        exif = Image.Exif()
        exif[0x010F] = "TestPhone"
        img.save(t / "images" / "iphone.heic", exif=exif)
        code, out = run(t, "photos.py")
        check("HEIC photo converted to a clean JPEG",
              code == 0 and (t / "images" / "iphone.jpg").exists() and not (t / "images" / "iphone.heic").exists()
              and not has_hidden_data(t / "images" / "iphone.jpg"), out)
    except ImportError:
        print("SKIP HEIC test (pillow-heif not installed)")
    shutil.rmtree(t)


if __name__ == "__main__":
    test_listings()
    test_photos()
    failed = [r for r in results if not r[1]]
    print("\n{} checks, {} failed".format(len(results), len(failed)))
    sys.exit(1 if failed else 0)
