#!/usr/bin/env python3
"""
build-tools/content.py — checks the PC listings and writes the two data files
the website reads: js/data/builds.js and js/data/gallery.js.

WHERE THE LISTINGS LIVE
  content/builds/<id>.json      one file per PC (this is what the admin forms edit)
  content/photo-alts.json       optional photo descriptions, [{src, alt}, ...]
  content/gallery-extras.json   optional extra gallery photos {current: [], completed: []}
  content/part-boxes.json       the part boxes {boxes: [...]}, in page order
  content/events.json           sale / promo banners {events: [...]}
  content/faq.json              the FAQ {items: [...]}, in page order
  content/frozen-text.json      FAQ items whose wording is frozen (see load_faq)

js/data/builds.js, gallery.js, partBoxes.js, events.js and faq.js are GENERATED from
those files. Never edit them by hand; the next run overwrites them.

USAGE
    python3 build-tools/content.py            check, then write both data files
    python3 build-tools/content.py --check    check only, write nothing

It needs only Python 3. On any problem it prints a plain-language list, writes
nothing, and exits with 1 (so the publishing Action stops and the live site
keeps its last good version).
"""

import datetime
import hashlib
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
EVENTS_SRC = ROOT / "content" / "events.json"
FAQ_SRC = ROOT / "content" / "faq.json"
FROZEN_FILE = ROOT / "content" / "frozen-text.json"
OUT_EVENTS = ROOT / "js" / "data" / "events.js"
OUT_FAQ = ROOT / "js" / "data" / "faq.js"
PART_BOXES_SRC = ROOT / "content" / "part-boxes.json"
OUT_PART_BOXES = ROOT / "js" / "data" / "partBoxes.js"
STITCH_FILE = ROOT / "build-tools" / "stitch.py"

ID_RE = re.compile(r"^[a-z]{3}[0-9]{2}-[0-9]{2}$")
STATUSES = ("draft", "available", "sold", "hidden")
PUBLIC_STATUSES = ("available", "sold")
COMPONENT_KEYS = ("cpu", "gpu", "motherboard", "ram", "storage", "psu",
                  "case", "cooler", "os", "networking")
SOLD_SUFFIX = " \u2014 previously sold"
MAX_VIDEO_BYTES = 15 * 1024 * 1024     # a converted 10-15 s clip is a few MB; bigger means the conversion did not run

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
    """Ids of the sale events in content/events.json (used to check a listing's eventId)."""
    if not EVENTS_SRC.exists():
        return set()
    try:
        data = json.loads(EVENTS_SRC.read_text(encoding="utf-8"))
    except ValueError:
        return set()
    items = data.get("events") if isinstance(data, dict) else None
    return {text(e.get("id")) for e in (items or []) if isinstance(e, dict) and text(e.get("id"))}


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
        warn(where, "{}: the sale event \"{}\" isn't in the Sale banners list, so no sale price will show.".format(label, event_id))
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
        src = norm_path(vsrc)
        poster = norm_path(v.get("poster")) if isinstance(v, dict) and not blank(v.get("poster")) else ""
        report = problem if public else warn
        if not src.lower().endswith(".mp4"):
            report(where, "{}: the video {} hasn't been converted to MP4 yet (the publisher does this automatically; "
                          "by hand run python3 build-tools/videos.py).".format(label, src))
        elif not poster:
            poster = src[:-4] + "-poster.jpg"
        if not image_exists(src):
            report(where, "{}: the video {} isn't in the videos folder.".format(label, src))
        else:
            if (ROOT / src).stat().st_size > MAX_VIDEO_BYTES:
                report(where, "{}: the video {} is {:.0f} MB, too big for the website. It should be a few MB after "
                              "conversion; run python3 build-tools/videos.py.".format(label, src, (ROOT / src).stat().st_size / 1048576))
            if poster and not image_exists(poster):
                report(where, "{}: the video {} has no cover frame ({}); run python3 build-tools/videos.py.".format(label, src, poster))
        videos.append({"src": src, "poster": poster} if poster else src)

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

def warn_unused_clips(listings):
    """A clip in videos/ that no listing uses still takes up site space; say so (never delete)."""
    folder = ROOT / "videos"
    if not folder.is_dir():
        return
    used = set()
    for item in listings:
        for v in item["videos"]:
            used.add(norm_path(v["src"] if isinstance(v, dict) else v))
    for clip in sorted(folder.glob("*.mp4")):
        if "videos/" + clip.name not in used:
            warn("videos/" + clip.name, "No listing uses this clip, so it only takes up space on the website. "
                                      "You can leave it, or ask Claude to remove it.")


def check_other_references():
    og = re.search(r'DEFAULT_OG_IMAGE\s*=\s*"([^"]+)"', STITCH_FILE.read_text(encoding="utf-8")) if STITCH_FILE.exists() else None
    if og and not image_exists(og.group(1)):
        problem("build-tools/stitch.py",
                "The photo every page uses for link previews ({}) is missing from the images folder.".format(og.group(1)))


# ---------------------------------------------------------------- sale events

EVENT_ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")


def parse_day(value):
    try:
        return datetime.date.fromisoformat(text(value)[:10])
    except ValueError:
        return None


def load_events():
    """Validate content/events.json. Dates in the form are whole days; the site wants
    'starts' = first moment of the first day and 'ends' = first moment AFTER the last day."""
    out = []
    where = "content/events.json"
    if not EVENTS_SRC.exists():
        problem(where, "The sale-banners file is missing.")
        return out
    data = read_json(EVENTS_SRC, where)
    if data is None:
        return out
    items = data.get("events") if isinstance(data, dict) else None
    if not isinstance(items, list):
        problem(where, "Expected an object with an 'events' list.")
        return out
    seen = set()
    today = datetime.date.today()
    for n, raw in enumerate(items, 1):
        if not isinstance(raw, dict):
            problem(where, "Sale {}: not in the expected shape.".format(n))
            continue
        eid, name, banner = text(raw.get("id")), text(raw.get("name")), text(raw.get("banner"))
        if not (eid or name or banner):
            continue                                    # an empty row is ignored
        label = "Sale \"{}\"".format(name or eid or n)
        if not EVENT_ID_RE.match(eid):
            problem(where, "{}: the code must be lowercase letters, numbers and dashes, like holiday-2026.".format(label))
        elif eid in seen:
            problem(where, "{}: another sale already uses the code {}.".format(label, eid))
        seen.add(eid)
        if not name:
            problem(where, "{}: it needs a name (shown first in the banner).".format(label))
        if not banner:
            problem(where, "{}: it needs the banner message.".format(label))
        first, last = parse_day(raw.get("starts")), parse_day(raw.get("ends"))
        if first is None:
            problem(where, "{}: it needs a first day (like 2026-12-01).".format(label))
        if last is None:
            problem(where, "{}: it needs a last day (like 2026-12-26).".format(label))
        if first and last and last < first:
            problem(where, "{}: the last day is before the first day.".format(label))
        active = raw.get("active") is True
        if active and last and last < today:
            warn(where, "{}: it is switched on but its last day has passed, so no banner shows.".format(label))
        if first and last:
            out.append({"id": eid, "name": name, "active": active, "first": first, "last": last,
                        "banner": banner, "showCountdown": raw.get("showCountdown") is True})
    running = sorted((e for e in out if e["active"]), key=lambda e: e["first"])
    for a, b in zip(running, running[1:]):
        if b["first"] <= a["last"]:
            warn(where, "Sales \"{}\" and \"{}\" overlap; only the first one in the list will show.".format(a["name"], b["name"]))
    return out


EVENTS_HEADER = """/*
  ================================================================
  js/data/events.js — GENERATED FILE. DO NOT EDIT BY HAND.
  ================================================================
  Written by build-tools/content.py from content/events.json (edited
  through the admin form "Sale banners"). Any change made here is
  overwritten the next time the site is built.

  Each sale has a first and last day (the last day is included). Only
  one sale shows at a time; if two overlap, the first in the list wins.
  A sale's price on a PC comes from that listing's "Sale event" and
  "Sale price" fields. The functions below the line are fixed.
  ================================================================
*/

"""

EVENTS_FUNCTIONS = '// ================================================================\n// DO NOT EDIT BELOW THIS LINE\n// ================================================================\n\nfunction getActiveEvent() {\n  const now = new Date();\n  return events.find(function (e) {\n    return e.active && now >= e.starts && now < e.ends;\n  }) || null;\n}\n\nfunction eventDaysLeft(event) {\n  const ms = event.ends - new Date();\n  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));\n}\n'


def events_js(events):
    if not events:
        body = "const events = [\n\n  // No event is currently active.\n\n];\n"
    else:
        rows = []
        for e in events:
            end_exclusive = e["last"] + datetime.timedelta(days=1)
            rows.append("  {\n    id: %s,\n    name: %s,\n    active: %s,\n    starts: new Date(%s),\n    ends:   new Date(%s),\n    banner: %s,\n    showCountdown: %s\n  }" % (
                json.dumps(e["id"]), json.dumps(e["name"], ensure_ascii=False), "true" if e["active"] else "false",
                json.dumps(e["first"].isoformat() + "T00:00:00"), json.dumps(end_exclusive.isoformat() + "T00:00:00"),
                json.dumps(e["banner"], ensure_ascii=False), "true" if e["showCountdown"] else "false"))
        body = "const events = [\n\n" + ",\n\n".join(rows) + "\n\n];\n"
    return EVENTS_HEADER + body + "\n" + EVENTS_FUNCTIONS


# ---------------------------------------------------------------- FAQ

def slug(value):
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")[:60] or "question"


def faq_digest(question, answer, extra):
    return hashlib.sha256((question.strip() + "\n" + answer.strip() + "\n" + (extra or "").strip()).encode("utf-8")).hexdigest()


def load_faq():
    """Validate content/faq.json and enforce frozen wording from content/frozen-text.json."""
    out = []
    where = "content/faq.json"
    if not FAQ_SRC.exists():
        problem(where, "The FAQ file is missing.")
        return out
    data = read_json(FAQ_SRC, where)
    items = data.get("items") if isinstance(data, dict) else None
    if not isinstance(items, list):
        if data is not None:
            problem(where, "Expected an object with an 'items' list.")
        return out
    seen = set()
    for n, raw in enumerate(items, 1):
        if not isinstance(raw, dict):
            problem(where, "Question {}: not in the expected shape.".format(n))
            continue
        question, answer, extra = text(raw.get("question")), text(raw.get("answer")), text(raw.get("answerExtra"))
        if not (question or answer or extra):
            continue                                    # an empty row is ignored
        label = "FAQ \"{}\"".format(question or n)
        if not question:
            problem(where, "Question {}: it needs the question text.".format(n))
        if not answer:
            problem(where, "{}: it needs an answer.".format(label))
        fid = text(raw.get("id")) or slug(question)
        if not EVENT_ID_RE.match(fid):
            problem(where, "{}: the id must be lowercase letters, numbers and dashes.".format(label))
        base, k = fid, 2
        while fid in seen:
            fid = "{}-{}".format(base, k)
            k += 1
        seen.add(fid)
        out.append({"id": fid, "question": question, "answer": answer, "answerExtra": extra,
                    "featured": raw.get("featured") is True})
    if sum(1 for i in out if i["featured"]) > 4:
        warn(where, "More than 4 questions are marked for the homepage; that preview is meant to be short.")

    if FROZEN_FILE.exists():
        frozen = read_json(FROZEN_FILE, "content/frozen-text.json")
        entries = frozen.get("frozen") if isinstance(frozen, dict) else None
        for entry in entries or []:
            fid, want = text(entry.get("id")), text(entry.get("sha256"))
            item = next((i for i in out if i["id"] == fid), None)
            if item is None:
                problem(where, "The FAQ question with id \"{}\" has frozen wording (waiting on the legal check) and it is missing. "
                               "Put it back, or ask Claude to lift the freeze.".format(fid))
            elif faq_digest(item["question"], item["answer"], item["answerExtra"]) != want:
                problem(where, "The FAQ question \"{}\" has frozen wording (waiting on the legal check), and it was changed. "
                               "Put the original wording back, or ask Claude to lift the freeze.".format(item["question"]))
    return out


FAQ_HEADER = """/*
  ================================================================
  js/data/faq.js — GENERATED FILE. DO NOT EDIT BY HAND.
  ================================================================
  Written by build-tools/content.py from content/faq.json (edited
  through the admin form "FAQ"). Any change made here is overwritten
  the next time the site is built.

  Order = order on the page. Questions marked featured also appear in
  the homepage preview (keep that to about 3). Wording of the questions
  listed in content/frozen-text.json is protected until the legal check.
  ================================================================
*/

"""


# ---------------------------------------------------------------- part boxes

def load_part_boxes():
    """Validate content/part-boxes.json. Returns the list in the shape partBoxCard.js expects."""
    boxes_out = []
    if not PART_BOXES_SRC.exists():
        problem("content/part-boxes.json", "The part-boxes file is missing.")
        return boxes_out
    data = read_json(PART_BOXES_SRC, "content/part-boxes.json")
    if data is None:
        return boxes_out
    items = data.get("boxes") if isinstance(data, dict) else None
    if not isinstance(items, list):
        problem("content/part-boxes.json", "Expected an object with a 'boxes' list.")
        return boxes_out
    where = "content/part-boxes.json"
    for n, raw in enumerate(items, 1):
        if not isinstance(raw, dict):
            problem(where, "Box {}: not in the expected shape.".format(n))
            continue
        brand, model = text(raw.get("brand")), text(raw.get("model"))
        label = ("{} {}".format(brand, model)).strip() or "Box {}".format(n)
        if not model:
            if not (brand or not blank(raw.get("quantity")) or not blank(raw.get("price"))):
                continue                      # a completely empty row is ignored
            problem(where, "{}: every box needs a model name.".format(label))
        qty = None
        try:
            q = parse_number(raw.get("quantity"))
            if q is None:
                raise ValueError
            if q != int(q) or q < 0:
                raise ValueError
            qty = int(q)
        except ValueError:
            problem(where, "{}: the quantity must be a whole number, 0 or more (0 hides the box).".format(label))
        price_num = None
        try:
            price_num = parse_number(raw.get("price"))
            if price_num is None or price_num < 0:
                raise ValueError
        except ValueError:
            problem(where, "{}: the price must be a number, like 5 (no $ sign).".format(label))
            price_num = None
        image = norm_path(raw.get("image"))
        if image and not image_exists(image):
            msg = "{}: the photo {} isn't in the images folder.".format(label, image)
            (problem if (qty or 0) > 0 else warn)(where, msg)
        boxes_out.append({
            "id": "box-{:02d}".format(len(boxes_out) + 1),
            "brand": brand,
            "model": model,
            "category": text(raw.get("category")),
            "quantity": qty if qty is not None else 0,
            "price": fmt_price(price_num) if price_num is not None else "",
            "condition": text(raw.get("condition")),
            "media": {"images": [image] if image else [], "videos": []},
            "notes": text(raw.get("notes")),
        })
    return boxes_out


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

PART_BOXES_HEADER = """/*
  ================================================================
  js/data/partBoxes.js — GENERATED FILE. DO NOT EDIT BY HAND.
  ================================================================
  Written by build-tools/content.py from content/part-boxes.json
  (edited through the admin forms). Any change made here is
  overwritten the next time the site is built.

  Boxes appear on part-boxes.html in the order of the list in
  content/part-boxes.json. A quantity of 0 hides a box from the page
  without deleting it. The ids (box-01, box-02, ...) are handed out by
  position and are only used inside the page; orders by email list the
  box names and quantities, not the ids.
  ================================================================
*/

const partBoxes = """

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
    warn_unused_clips(listings)
    part_boxes = load_part_boxes()
    events = load_events()
    faq = load_faq()

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

    print("Checked {} listing file(s): {} available, {} sold, {} not on the site (drafts/hidden); {} part box type(s), {} in stock; {} sale(s); {} FAQ question(s).".format(
        len(listings), avail, sold, other, len(part_boxes), sum(1 for b in part_boxes if b["quantity"] > 0), len(events), len(faq)))
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
    if write_if_changed(OUT_EVENTS, events_js(events)):
        changed.append("js/data/events.js")
    if write_if_changed(OUT_FAQ, FAQ_HEADER + js_array("faqItems", faq)):
        changed.append("js/data/faq.js")
    if write_if_changed(OUT_PART_BOXES, PART_BOXES_HEADER + json.dumps(part_boxes, indent=2, ensure_ascii=False) + ";\n"):
        changed.append("js/data/partBoxes.js")
    print("Wrote: {}".format(", ".join(changed) if changed else "nothing new (data files already up to date)"))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
