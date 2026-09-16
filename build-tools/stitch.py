#!/usr/bin/env python3
"""
build-tools/stitch.py — assembles shared header/footer partials into
final static HTML pages, and generates SEO metadata + sitemap.xml +
robots.txt from a single site URL.

Run this any time you've changed:
  - js/partials/header.html or js/partials/footer.html (shared chrome)
  - anything in pages-src/ (page-specific content)
  - js/data/config.js's SITE.url (e.g. once you have a real domain)

USAGE:
    python3 build-tools/stitch.py

WHAT IT DOES
  1. Reads js/partials/header.html and js/partials/footer.html.
  2. Reads SITE.url from js/data/config.js — the single source of truth
     for every canonical/Open Graph/sitemap URL generated below.
  3. For each file in pages-src/*.html:
       - finds <!--HEADER:page-id--> and replaces it with the header,
         marking the nav link matching page-id as active
       - replaces <!--FOOTER--> with the footer
       - replaces <!--SEO--> with canonical link, Open Graph tags,
         Twitter Card tags, and (homepage only) LocalBusiness
         structured data — title/description are read from each page's
         own <title>/<meta name="description">, not duplicated by hand
       - writes the result to the project root, same filename
  4. Writes sitemap.xml and robots.txt covering every page just built,
     except 404.html (deliberately excluded — see below).
  5. Prints a summary, including the SITE_URL that was used.

This script itself never gets deployed — only its OUTPUT (the .html/
.xml/.txt files it writes to the project root) gets committed and
pushed to GitHub Pages. Re-run it after any partial, pages-src, or
SITE.url change, before committing.

CHANGING DOMAINS LATER: update SITE.url in js/data/config.js once, then
re-run this script. Every canonical tag, Open Graph URL, structured-data
URL, sitemap entry, and robots.txt line updates together — nothing else
to hunt down.
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
SEO_MARKER = "<!--SEO-->"
ANALYTICS_MARKER = "<!--ANALYTICS-->"

TITLE_RE = re.compile(r"<title>(.*?)</title>", re.DOTALL)
DESCRIPTION_RE = re.compile(r'<meta name="description" content="([^"]*)"')
SITE_URL_RE = re.compile(r'url:\s*"([^"]+)"')
CONTACT_EMAIL_RE = re.compile(r'email:\s*"([^"]+)"')

# The one real photo guaranteed to exist, used as the fallback social-
# share image on every page. Update if a dedicated logo/og-image is
# ever added — see js/data/config.js if a per-page image is wanted later.
DEFAULT_OG_IMAGE = "images/may26-01-main.jpg"


def get_site_url() -> str:
    """Reads SITE.url straight out of js/data/config.js — the ONE place
    this value lives. Change the domain there, re-run this script, and
    every canonical/OG/sitemap URL across all pages updates together."""
    config_path = ROOT / "js" / "data" / "config.js"
    config_text = config_path.read_text(encoding="utf-8")
    match = SITE_URL_RE.search(config_text)
    if not match:
        raise ValueError(f"Could not find SITE.url in {config_path}")
    return match.group(1).rstrip("/")


def get_contact_email() -> str:
    """Reads CONTACT.email straight out of js/data/config.js — same
    single-source-of-truth principle as get_site_url(). Used to bake a
    real, working form `action` and `_next` redirect directly into the
    static HTML at build time, so contact forms work with zero
    JavaScript — not just once JS happens to load and run successfully."""
    config_path = ROOT / "js" / "data" / "config.js"
    config_text = config_path.read_text(encoding="utf-8")
    match = CONTACT_EMAIL_RE.search(config_text)
    if not match:
        raise ValueError(f"Could not find CONTACT.email in {config_path}")
    return match.group(1)


def _escape_attr(text: str) -> str:
    """Minimal escaping for dropping page title/description text into
    an HTML attribute value."""
    return text.replace("&", "&amp;").replace('"', "&quot;")


def build_seo_block(site_url: str, page_filename: str, title: str, description: str) -> str:
    page_url = f"{site_url}/{page_filename}"
    image_url = f"{site_url}/{DEFAULT_OG_IMAGE}"
    title_attr = _escape_attr(title)
    desc_attr = _escape_attr(description)

    lines = [
        f'<link rel="canonical" href="{page_url}">',
        '<meta property="og:type" content="website">',
        '<meta property="og:site_name" content="North Bridge PCs">',
        f'<meta property="og:title" content="{title_attr}">',
        f'<meta property="og:description" content="{desc_attr}">',
        f'<meta property="og:url" content="{page_url}">',
        f'<meta property="og:image" content="{image_url}">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{title_attr}">',
        f'<meta name="twitter:description" content="{desc_attr}">',
        f'<meta name="twitter:image" content="{image_url}">',
    ]

    # Structured data describes the business itself, not per-page
    # content — included once, on the homepage only, per standard
    # practice (not repeated on all 10 pages).
    if page_filename == "index.html":
        lines.append(
            '<script type="application/ld+json">\n'
            "{\n"
            '  "@context": "https://schema.org",\n'
            '  "@type": "ComputerStore",\n'
            '  "name": "North Bridge PCs",\n'
            '  "description": "Gaming PC sales, custom builds, repair, upgrades, cleaning, and support in Southern Oregon.",\n'
            f'  "url": "{site_url}/",\n'
            '  "address": {\n'
            '    "@type": "PostalAddress",\n'
            '    "addressLocality": "Grants Pass",\n'
            '    "addressRegion": "OR",\n'
            '    "addressCountry": "US"\n'
            "  },\n"
            '  "areaServed": ["Grants Pass, OR", "Medford, OR", "Ashland, OR"]\n'
            "}\n"
            "</script>"
        )

    return "\n".join(lines)


def build_sitemap(site_url: str, page_filenames: list) -> str:
    urls = "\n".join(
        f"  <url>\n    <loc>{site_url}/{name}</loc>\n  </url>"
        for name in page_filenames
    )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{urls}\n"
        "</urlset>\n"
    )


def build_robots_txt(site_url: str) -> str:
    return f"User-agent: *\nAllow: /\n\nSitemap: {site_url}/sitemap.xml\n"


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
    analytics_path = PARTIALS_DIR / "analytics.html"

    if not header_path.exists() or not footer_path.exists():
        print(f"ERROR: expected header.html and footer.html in {PARTIALS_DIR}")
        return 1

    header_template = header_path.read_text(encoding="utf-8")
    footer_template = footer_path.read_text(encoding="utf-8")
    analytics_template = analytics_path.read_text(encoding="utf-8") if analytics_path.exists() else ""

    try:
        site_url = get_site_url()
        contact_email = get_contact_email()
    except ValueError as e:
        print(f"ERROR: {e}")
        return 1

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

        if SEO_MARKER in content:
            title_match = TITLE_RE.search(content)
            desc_match = DESCRIPTION_RE.search(content)
            title = title_match.group(1) if title_match else "North Bridge PCs"
            description = desc_match.group(1) if desc_match else ""
            seo_html = build_seo_block(site_url, src_file.name, title, description)
            content = content.replace(SEO_MARKER, seo_html)
        else:
            print(f"NOTE: {src_file.name} has no <!--SEO--> marker — skipping canonical/OG/structured data for this page.")

        analytics_count = content.count(ANALYTICS_MARKER)
        if analytics_count == 1:
            content = content.replace(ANALYTICS_MARKER, analytics_template)
        elif analytics_count > 1:
            print(f"ERROR: {src_file.name} has {analytics_count} <!--ANALYTICS--> markers — should have exactly 1. Fix the duplicate(s) before this page is trustworthy.")
            skipped.append((src_file.name, f"{analytics_count} <!--ANALYTICS--> markers found"))
            continue
        else:
            print(f"NOTE: {src_file.name} has no <!--ANALYTICS--> marker — this page will not have Google Analytics on it.")

        # General-purpose value tokens, usable anywhere in a page — e.g.
        # baking a real form `action`/`_next` directly into static HTML
        # so it works with zero JavaScript, not just once JS loads.
        content = content.replace("{{SITE_URL}}", site_url)
        content = content.replace("{{CONTACT_EMAIL}}", contact_email)

        leftover = re.findall(r"\{\{[A-Z_]+\}\}", content)
        if leftover:
            print(f"WARNING: {src_file.name} has unresolved token(s) {set(leftover)} — check for a typo.")

        out_path = ROOT / src_file.name
        out_path.write_text(content, encoding="utf-8")
        built.append(src_file.name)

    # Sitemap + robots.txt cover every page just built, using the same
    # single site_url source as everything else above. 404.html is
    # deliberately excluded from the sitemap — it's not real content to
    # be indexed, just the error page GitHub Pages serves for unmatched
    # URLs. It still gets the full header/footer/build treatment above
    # like every other page; it's just left out of this one list.
    sitemap_pages = [name for name in built if name != "404.html"]
    if sitemap_pages:
        (ROOT / "sitemap.xml").write_text(build_sitemap(site_url, sitemap_pages), encoding="utf-8")
        (ROOT / "robots.txt").write_text(build_robots_txt(site_url), encoding="utf-8")

    print(f"Built {len(built)} page(s): {', '.join(built) if built else '(none)'}")
    if skipped:
        print(f"Skipped {len(skipped)} file(s):")
        for name, reason in skipped:
            print(f"  - {name}: {reason}")
    if built:
        print("Wrote sitemap.xml and robots.txt")

    print(f"\nSITE_URL in use: {site_url}")
    print("(from js/data/config.js SITE.url — update it there and re-run this script when the real domain is ready)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
