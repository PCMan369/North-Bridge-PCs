#!/usr/bin/env python3
"""
build-tools/content.py — checks the PC listings and writes the two data files
the website reads: js/data/builds.js and js/data/gallery.js.

WHERE THE LISTINGS LIVE
  content/builds/<id>.json      one file per PC (this is what the admin forms edit)
  content/photo-alts.json       optional photo descriptions, [{src, alt}, ...]
  content/gallery-extras.json   optional extra gallery photos {current: [], completed: []}

js/data/builds.js and js/data/gallery.js are GENERATED from those files. Never
edit them by hand; the next run overwrites them.

USAGE
    python3 build-tools/content.py            check, then write both data files
    python3 build-tools/content.py --check    check only, write nothing

It needs only Python 3. On any problem it prints a plain-language list, writes
nothing, and exits with 1 (so the publishing Action stops and the live site
keeps its last good version).
"""

import datetime
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BUILDS_DIR = ROOT / "content" / "builds"
ALTS_FILE = ROOT / "content" / "photo-alts.json"
EXTRAS_FILE = ROOT / "content" / "gallery-extras.json"
OUT_BUILDS = ROOT / "js" / "data" / "builds.js"
OUT_GALLERY = ROOT / "js" / "data" / "gallery.js"
EVENTS_FILE = ROOT / "js" / "data" / "events.js"
PART_BOXES_FILE = ROOT / "js" / "data" / "partBoxes.js"
STITCH_FILE = ROOT / "build-tools" / "stitch.py"

ID_RE = re.compile(r"^[a-z]{3}[0-9]{2}-[0-9]{2}$")
STATUSES = ("draft", "available", "sold", "hidden")
PUBLIC_STATUSES = ("available", "sold")
COMPONENT_KEYS = ("cpu", "gpu", "motherboard", "ram", "storage", "psu",
                  "case", "cooler", "os", "networking")
SOLD_SUFFIX = " \u2014 previously sold"

errors = []    # (where, message): stop publishing
warnings = []  # (where, message): worth knowing, not blocking


def problem(where, message):
    errors.append((where, message))


def warn(where, message):
    warnings.append((where, message))


# ---------------------------------------------------------------- helpers

def blank(value):
    return value is None or (isinstance(value, str) and not value.strip())


def text(value):
    return value.strip() if isinstance(value, str) else ""


def norm_path(value):
    """'/images/a.jpg', './images/a.jpg' and 'images/a.jpg' all become 'images/a.jpg'."""
    p = text(value)
    while p.startswith("./"):
        p = p[2:]
    return p.lstrip("/")


def parse_number(value):
    """Return a float, or None if value is blank. Raises ValueError if it isn't a number."""
    if blank(value):
        return None
    if isinstance(value, bool):
        raise ValueError("not a number")
    if isinstance(value, (int, float)):
        return float(value)
    cleaned = str(value).replace("$", "").replace(",", "").strip()
    return float(cleaned)


def fmt_price(number):
    if number == int(number):
        return "${:,.0f}".format(number)
    return "${:,.2f}".format(number)


def read_json(path, where):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        problem(where, "This file isn't valid JSON (line {}, column {}): {}. "
                       "If you edited it by hand, check for a missing comma or quote.".format(e.lineno, e.colno, e.msg))
    except OSError as e:
        problem(where, "Could not read this file: {}".format(e))
    return None


def strip_js_comments(src):
    src = re.sub(r"/\*.*?\*/", "", src, flags=re.S)
    return re.sub(r"(^|[^:\"'])//[^\n]*", r"\1", src)


def known_event_ids():
    if not EVENTS_FILE.exists():
        return set()
    return set(re.findall(r"\bid:\s*[\"']([^\"']+)[\"']", strip_js_comments(EVENTS_FILE.read_text(encoding="utf-8"))))


def image_exists(rel):
    return bool(rel) and (ROOT / rel).is_file()


# ---------------------------------------------------------------- listings

def load_alts():
    """{normalized src: description}"""
    alts = {}
    if not ALTS_FILE.exists():
        return alts
    data = read_json(ALTS_FILE, "content/photo-alts.json")
    if data is None:
        return alts
    if not isinstance(data, list):
        problem("content/photo-alts.json", "Expected a list of photos, each with a 'src' and an 'alt'.")
        return alts
    for i, item in enumerate(data, 1):
        if not isinstance(item, dict) or blank(item.get("src")):
            continue
        if not blank(item.get("alt")):
            alts[norm_path(item["src"])] = text(item["alt"])
    return alts


def check_listing(path, raw, seen_ids, event_ids):
    """Validate one listing. Returns the normalised dict (also for non-public ones) or None."""
    where = "content/builds/" + path.name
    if not isinstance(raw, dict):
        problem(where, "The file should contain one listing (a JSON object).")
        return None

    lid = text(raw.get("id"))
    title = text(raw.get("title"))
    label = "Listing {}".format(lid or path.stem)

    if not ID_RE.match(lid):
        problem(where, "{}: the ID isn't in the right format. Use the month, the year and a number, "
                       "like nov26-01.".format(label))
    elif path.stem != lid:
        problem(where, "{}: the file is named {} but its ID is {}. They must match.".format(label, path.name, lid))
    if lid:
        if lid.lower() in seen_ids:
            problem(where, "{}: another listing already uses this ID ({}). IDs must be unique, "
                           "and never reused, because the ID is the listing's web address.".format(label, seen_ids[lid.lower()]))
        else:
            seen_ids[lid.lower()] = path.name

    status = text(raw.get("status")).lower()
    if status not in STATUSES:
        problem(where, "{}: the status should be Draft, Available, Sold or Hidden.".format(label))
        status = "draft"
    public = status in PUBLIC_STATUSES

    # price
    price_num = None
    try:
        price_num = parse_number(raw.get("price"))
    except ValueError:
        problem(where, "{}: the price must be a number, like 650 (no $ sign or words).".format(label))
    if price_num is not None and price_num < 0:
        problem(where, "{}: the price can't be negative.".format(label))
        price_num = None
    if public and price_num is None and blank(raw.get("price")):
        problem(where, "{}: it needs a price before it can be {}.".format(label, status.title()))

    event_price = None
    try:
        event_price = parse_number(raw.get("eventPrice"))
    except ValueError:
        problem(where, "{}: the sale price must be a number, like 599.".format(label))
    event_id = text(raw.get("eventId"))
    if event_price is not None and not event_id:
        warn(where, "{}: it has a sale price but no sale event, so the sale price won't show.".format(label))
    if event_id and event_id not in event_ids:
        warn(where, "{}: the sale event \"{}\" isn't in js/data/events.js, so no sale price will show.".format(label, event_id))
    if event_id and event_price is None:
        warn(where, "{}: it names a sale event but has no sale price, so no sale price will show.".format(label))

    if public and not title:
        problem(where, "{}: it needs a title before it can be {}.".format(label, status.title()))

    # parts
    comps_in = raw.get("components") or {}
    components = {}
    if not isinstance(comps_in, dict):
        problem(where, "{}: the parts section isn't in the expected shape.".format(label))
        comps_in = {}
    for key in COMPONENT_KEYS:
        val = comps_in.get(key)
        if isinstance(val, dict):          # tolerate the old {model: "..."} shape
            val = val.get("model")
        if not blank(val):
            components[key] = {"model": text(val)}
    acc = comps_in.get("accessories") or []
    if isinstance(acc, list):
        acc = [text(a) for a in acc if not blank(a)]
        if acc:
            components["accessories"] = acc
    else:
        problem(where, "{}: accessories should be a list.".format(label))
    if status == "available" and not ("cpu" in components or "gpu" in components):
        warn(where, "{}: no CPU or graphics card is filled in; the listing will look empty.".format(label))

    # performance
    performance = None
    perf = raw.get("performance")
    if isinstance(perf, dict):
        items = []
        for n, item in enumerate(perf.get("items") or [], 1):
            if not isinstance(item, dict):
                continue
            game, fps, settings = text(item.get("game")), text(item.get("fps")), text(item.get("settings"))
            if not (game or fps or settings):
                continue
            if not (game and fps and settings):
                problem(where, "{}: performance row {} needs a game, an fps figure and a setting "
                               "(for example Fortnite, ~120fps, 1080p High).".format(label, n))
                continue
            items.append({"game": game, "fps": fps, "settings": settings})
        if items:
            performance = {"isEstimate": perf.get("isEstimate") is not False, "items": items}
    elif perf not in (None, ""):
        problem(where, "{}: the performance section isn't in the expected shape.".format(label))

    # photos
    images_in = raw.get("images")
    if images_in is None and isinstance(raw.get("media"), dict):   # tolerate the old shape
        images_in = raw["media"].get("images")
    images, seen_img = [], set()
    for img in images_in or []:
        src = norm_path(img.get("src") if isinstance(img, dict) else img)
        if not src:
            continue
        if src in seen_img:
            warn(where, "{}: the photo {} is listed twice; showing it once.".format(label, src))
            continue
        seen_img.add(src)
        images.append(src)
        if not image_exists(src):
            msg = "{}: the photo {} isn't in the images folder.".format(label, src)
            (problem if public else warn)(where, msg)
    if status == "available" and not images:
        problem(where, "{}: it needs at least one photo before it can be Available.".format(label))

    videos = []
    for v in raw.get("videos") or []:
        vsrc = v.get("src") if isinstance(v, dict) else v
        if blank(vsrc):
            continue
        if isinstance(v, dict):
            v = dict(v)
            v["src"] = norm_path(v["src"])
            if not blank(v.get("poster")):
                v["poster"] = norm_path(v["poster"])
        else:
            v = norm_path(v)
        videos.append(v)
        if public and not image_exists(norm_path(vsrc)):
            problem(where, "{}: the video {} isn't in the images folder.".format(label, norm_path(vsrc)))

    # date
    listed = text(raw.get("listedDate"))[:10]
    try:
        datetime.date.fromisoformat(listed)
    except ValueError:
        if public:
            problem(where, "{}: the listed date should look like 2026-10-24.".format(label))
        listed = "1970-01-01"

    return {
        "file": path.name,
        "id": lid,
        "title": title,
        "status": status,
        "price_num": price_num,
        "event_id": event_id or None,
        "event_price_num": event_price,
        "summary": text(raw.get("summary")),
        "components": components,
        "performance": performance,
        "images": images,
        "videos": videos,
        "condition": text(raw.get("condition")),
        "testingNotes": text(raw.get("testingNotes")),
        "notes": text(raw.get("notes")),
        "listedDate": listed,
    }


def load_listings():
    listings = []
    seen_ids = {}
    event_ids = known_event_ids()
    if not BUILDS_DIR.is_dir():
        problem("content/builds", "The listings folder is missing.")
        return listings
    for path in sorted(BUILDS_DIR.glob("*.json")):
        raw = read_json(path, "content/builds/" + path.name)
        if raw is None:
            continue
        item = check_listing(path, raw, seen_ids, event_ids)
        if item:
            listings.append(item)
    return listings


def to_site_entry(item):
    """The exact shape the page scripts expect (see js/render/*.js)."""
    entry = {
        "id": item["id"],
        "title": item["title"],
        "status": item["status"],
        "price": fmt_price(item["price_num"]) if item["price_num"] is not None else "",
        "eventId": item["event_id"],
        "eventPrice": fmt_price(item["event_price_num"]) if item["event_price_num"] is not None else None,
        "summary": item["summary"],
        "components": item["components"],
    }
    if item["performance"]:
        entry["performance"] = item["performance"]
    entry["media"] = {"images": item["images"], "videos": item["videos"]}
    entry["condition"] = item["condition"]
    entry["testingNotes"] = item["testingNotes"]
    entry["listedDate"] = item["listedDate"]
    entry["notes"] = item["notes"]
    return entry


# ---------------------------------------------------------------- gallery

def load_extras():
    out = {"current": [], "completed": []}
    if not EXTRAS_FILE.exists():
        return out
    data = read_json(EXTRAS_FILE, "content/gallery-extras.json")
    if not isinstance(data, dict):
        if data is not None:
            problem("content/gallery-extras.json", "Expected an object with 'current' and 'completed' lists.")
        return out
    for section in ("current", "completed"):
        for item in data.get(section) or []:
            if not isinstance(item, dict) or blank(item.get("src")):
                continue
            src = norm_path(item["src"])
            alt = text(item.get("alt"))
            if not image_exists(src):
                problem("content/gallery-extras.json", "The extra gallery photo {} isn't in the images folder.".format(src))
            if not alt:
                warn("content/gallery-extras.json", "The extra gallery photo {} has no description.".format(src))
            out[section].append({"src": src, "alt": alt or "North Bridge PCs photo"})
    return out


def gallery_entries(public_items, alts):
    current, completed = [], []
    for item in public_items:
        for n, src in enumerate(item["images"], 1):
            base = alts.get(src) or "{}, photo {}".format(item["title"], n)
            if item["status"] == "available":
                current.append({"src": src, "alt": base})
            else:
                alt = base if base.endswith("previously sold") else base + SOLD_SUFFIX
                completed.append({"src": src, "alt": alt})
    return current, completed


# ---------------------------------------------------------------- other files that name photos

def check_other_references():
    og = re.search(r'DEFAULT_OG_IMAGE\s*=\s*"([^"]+)"', STITCH_FILE.read_text(encoding="utf-8")) if STITCH_FILE.exists() else None
    if og and not image_exists(og.group(1)):
        problem("build-tools/stitch.py",
                "The photo every page uses for link previews ({}) is missing from the images folder.".format(og.group(1)))
    if PART_BOXES_FILE.exists():
        src = strip_js_comments(PART_BOXES_FILE.read_text(encoding="utf-8"))
        for ref in sorted(set(re.findall(r"[\"'](images/[^\"']+)[\"']", src))):
            if not image_exists(ref):
                problem("js/data/partBoxes.js", "The part-box photo {} isn't in the images folder.".format(ref))


# ---------------------------------------------------------------- output

BUILDS_HEADER = """/*
  ================================================================
  js/data/builds.js — GENERATED FILE. DO NOT EDIT BY HAND.
  ================================================================
  Written by build-tools/content.py from the listing files in
  content/builds/*.json (edited through the admin forms). Any change
  made here is overwritten the next time the site is built.

  To change a listing: edit its file in content/builds/ (or use the
  admin forms), then run  python3 build-tools/content.py
  Only listings whose status is "available" or "sold" appear here;
  drafts and hidden listings are left out on purpose, so they are not
  reachable on the public site.
  ================================================================
*/

const builds = """

GALLERY_HEADER = """/*
  ================================================================
  js/data/gallery.js — GENERATED FILE. DO NOT EDIT BY HAND.
  ================================================================
  Written by build-tools/content.py. Photos come from the listings
  in content/builds/*.json (available listings under currentBuilds,
  sold ones under completedBuilds), in listing order, then any extras
  from content/gallery-extras.json. Photo descriptions come from
  content/photo-alts.json.

  Controls the Gallery page (gallery.html) only. The homepage preview
  strip reads js/data/builds.js directly.
  ================================================================
*/

"""


def js_array(name, items):
    return "const {} = {};\n".format(name, json.dumps(items, indent=2, ensure_ascii=False))


def write_if_changed(path, content):
    old = path.read_text(encoding="utf-8") if path.exists() else None
    if old != content:
        path.write_text(content, encoding="utf-8")
        return True
    return False


def main(argv):
    check_only = "--check" in argv

    listings = load_listings()
    alts = load_alts()
    extras = load_extras()
    check_other_references()

    public_items = [i for i in listings if i["status"] in PUBLIC_STATUSES]
    public_items.sort(key=lambda i: (i["listedDate"], i["id"]), reverse=True)

    avail = sum(1 for i in public_items if i["status"] == "available")
    sold = len(public_items) - avail
    other = len(listings) - len(public_items)

    for where, message in warnings:
        print("Note  [{}] {}".format(where, message))
        if os.environ.get("GITHUB_ACTIONS"):
            print("::warning file={}::{}".format(where, message))

    if errors:
        print("")
        print("PROBLEMS FOUND. Nothing was published; the live site keeps its last good version.")
        for where, message in errors:
            print("  - [{}] {}".format(where, message))
            if os.environ.get("GITHUB_ACTIONS"):
                print("::error file={}::{}".format(where, message))
        print("Fix the items above in the admin (or the files named) and save again.")
        return 1

    print("Checked {} listing file(s): {} available, {} sold, {} not on the site (drafts/hidden).".format(
        len(listings), avail, sold, other))
    if check_only:
        print("Check only: no files written.")
        return 0

    site_entries = [to_site_entry(i) for i in public_items]
    cur, comp = gallery_entries(public_items, alts)
    cur += extras["current"]
    comp += extras["completed"]

    changed = []
    if write_if_changed(OUT_BUILDS, BUILDS_HEADER + json.dumps(site_entries, indent=2, ensure_ascii=False) + ";\n"):
        changed.append("js/data/builds.js")
    gallery_src = GALLERY_HEADER + js_array("currentBuilds", cur) + "\n" + js_array("completedBuilds", comp)
    if write_if_changed(OUT_GALLERY, gallery_src):
        changed.append("js/data/gallery.js")
    print("Wrote: {}".format(", ".join(changed) if changed else "nothing new (data files already up to date)"))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
