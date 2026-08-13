#!/usr/bin/env python3
"""
build-tools/stitch.py — assembles shared header/footer partials into
final static HTML pages.

Run this any time you've changed:
  - js/partials/header.html or js/partials/footer.html (shared chrome)
  - anything in pages-src/ (page-specific content)

USAGE:
    python3 build-tools/stitch.py

WHAT IT DOES
  1. Reads js/partials/header.html and js/partials/footer.html.
  2. For each file in pages-src/*.html:
       - finds <!--HEADER:page-id--> and replaces it with the header,
         marking the nav link matching page-id as active
       - replaces <!--FOOTER--> with the footer
       - writes the result to the project root, same filename
  3. Prints a summary of what was built (or what was skipped, and why).

This script itself never gets deployed — only its OUTPUT (the .html
files it writes to the project root) gets committed and pushed to
GitHub Pages. Re-run it after any partial or pages-src change, before
committing.
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PARTIALS_DIR = ROOT / "js" / "partials"
SOURCE_DIR = ROOT / "pages-src"

ACTIVE_TOKEN_RE = re.compile(r"\{\{active:([a-z0-9-]+)\}\}")
ACTIVE_GROUP_RE = re.compile(r"\{\{activegroup:([a-z0-9,-]+)\}\}")
HEADER_MARKER_RE = re.compile(r"<!--HEADER:([a-z0-9-]+)-->")
FOOTER_MARKER = "<!--FOOTER-->"


def build_header(header_template: str, active_page_id: str) -> str:
    """Replace every {{active:ID}} token — 'active' if it matches the
    current page, otherwise an empty string. Also resolves
    {{activegroup:id1,id2,id3}} tokens — 'active' if the current page is
    any of the listed ids, for highlighting a dropdown's parent trigger
    when you're on one of its child pages."""
    result = ACTIVE_TOKEN_RE.sub(
        lambda m: "active" if m.group(1) == active_page_id else "",
        header_template,
    )
    result = ACTIVE_GROUP_RE.sub(
        lambda m: "active" if active_page_id in m.group(1).split(",") else "",
        result,
    )
    return result


def main() -> int:
    if not PARTIALS_DIR.exists():
        print(f"ERROR: partials folder not found at {PARTIALS_DIR}")
        return 1

    header_path = PARTIALS_DIR / "header.html"
    footer_path = PARTIALS_DIR / "footer.html"

    if not header_path.exists() or not footer_path.exists():
        print(f"ERROR: expected header.html and footer.html in {PARTIALS_DIR}")
        return 1

    header_template = header_path.read_text(encoding="utf-8")
    footer_template = footer_path.read_text(encoding="utf-8")

    if not SOURCE_DIR.exists():
        print(f"No pages-src/ folder found at {SOURCE_DIR} — nothing to build.")
        return 0

    built, skipped = [], []

    for src_file in sorted(SOURCE_DIR.glob("*.html")):
        content = src_file.read_text(encoding="utf-8")

        match = HEADER_MARKER_RE.search(content)
        if not match:
            skipped.append((src_file.name, "no <!--HEADER:page-id--> marker found"))
            continue

        if FOOTER_MARKER not in content:
            skipped.append((src_file.name, "no <!--FOOTER--> marker found"))
            continue

        page_id = match.group(1)
        header_html = build_header(header_template, page_id)

        content = content.replace(match.group(0), header_html)
        content = content.replace(FOOTER_MARKER, footer_template)

        out_path = ROOT / src_file.name
        out_path.write_text(content, encoding="utf-8")
        built.append(src_file.name)

    print(f"Built {len(built)} page(s): {', '.join(built) if built else '(none)'}")
    if skipped:
        print(f"Skipped {len(skipped)} file(s):")
        for name, reason in skipped:
            print(f"  - {name}: {reason}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
