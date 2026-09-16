"""
visual-check.py — Real-browser visual QA for this site, via Playwright.

Screenshots every built page at desktop/tablet/mobile and checks for
horizontal overflow. Kept in the repo for reuse by future sessions —
see DECISIONS.md D24 for why this exists and the environment quirk
that makes it work.

Environment note (Claude sandbox): `npx playwright install chromium`
(the Node/npm route) fails cleanly here — its browser-binary download
isn't reachable. The Python route works instead, because both the
`playwright` package and the Chromium binary are pre-baked into this
sandbox image at a non-default path:

    pip install playwright --break-system-packages   # "already satisfied"
    python3 -m playwright install chromium            # succeeds silently

(`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` is already set in the
environment — that's where the binary actually lives.) If a future
session finds the Node route failing, try this one before concluding
no browser is available at all.

Usage:
    python3 visual-check.py
Screenshots land in ./screenshots/ (created if missing), named
<page>-<breakpoint>.png. Requires the site to already be built
(run build-tools/stitch.py first if pages-src/ has changed).
"""

from playwright.sync_api import sync_playwright
import os

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "screenshots")
os.makedirs(OUT, exist_ok=True)

pages = [
    ("index.html", "home"),
    ("builds.html", "builds"),
    ("build.html?id=may26-01", "build-detail"),
    ("services.html", "services"),
    ("about.html", "about"),
    ("contact.html", "contact"),
    ("custom-build.html", "custom-build"),
    ("gallery.html", "gallery"),
    ("faq.html", "faq"),
    ("part-boxes.html", "part-boxes"),
]

breakpoints = [
    ("desktop", 1440, 900),
    ("tablet", 768, 1024),
    ("mobile", 390, 844),
]

overflow_issues = []

with sync_playwright() as p:
    browser = p.chromium.launch()
    for bp_name, w, h in breakpoints:
        ctx = browser.new_context(viewport={"width": w, "height": h})
        page = ctx.new_page()
        for file, slug in pages:
            url = f"file://{BASE}/{file}"
            page.goto(url, wait_until="networkidle")
            page.wait_for_timeout(200)
            scroll_w = page.evaluate("document.documentElement.scrollWidth")
            client_w = page.evaluate("document.documentElement.clientWidth")
            if scroll_w > client_w + 2:
                overflow_issues.append(f"{slug} @ {bp_name}: scrollWidth={scroll_w} > clientWidth={client_w}")
            out_path = f"{OUT}/{slug}-{bp_name}.png"
            page.screenshot(path=out_path, full_page=True)
            print(f"captured {out_path} (scrollW={scroll_w}, clientW={client_w})")
        ctx.close()
    browser.close()

print("\n--- Horizontal overflow check ---")
if overflow_issues:
    for issue in overflow_issues:
        print("OVERFLOW:", issue)
else:
    print("No horizontal overflow detected on any page/breakpoint.")
