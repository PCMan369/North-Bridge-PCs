"""
visual-check.py — Real-browser QA for this site, via Playwright.

Loads every built page at 15 widths from 320 to 1440px and reports two things:
horizontal overflow (page wider than the viewport) and script errors. Optional
screenshots. Kept in the repo for reuse by future sessions; see DECISIONS.md D24
for why this exists and the environment quirk that makes it work.

Widths (A-037): 320, 360, 375, 390, 393, 412, 428, 430, 480, 600, 700, 768, 820,
1024, 1440. They cover small Androids, every iPhone width from SE to Pro Max (428
and 430 were invisible to the old 3-width check), 600-820 tablets and 1024/1440
desktop. Pages: the 9 real pages plus 404.html.

Usage (run on a scratch copy of the project if you pass a screenshot flag):
    python3 visual-check.py                      checks only, no files written
    python3 visual-check.py --screenshots        also PNGs at 1440, 768 and 390px
    python3 visual-check.py --screenshots-all    also PNGs at every width (150 files)
Screenshots land in ./screenshots/ as <page>-<width>.png; never put that folder in
the ZIP. Exit code 0 = clean, 1 = overflow or script errors found, so the script
can gate a chunk. Requires the site to be built (run build-tools/stitch.py first
if pages-src/ changed).

Environment note (Claude sandbox): Chromium is pre-installed at /opt/pw-browsers
(`PLAYWRIGHT_BROWSERS_PATH` is already set), so no browser download is needed. Both
the Python and Node Playwright bindings launch it (checked in LOG.md B-005). If
`playwright` is missing, `pip install playwright --break-system-packages` and
`python3 -m playwright install chromium` (finds the pre-installed browser).

What it does not do: it is Chromium only (Safari and Firefox are not available
here), it checks overflow and script errors, not how the page looks, and it blocks
all non-file requests, so Google Fonts never load and text renders in fallback
fonts (widths of text, and so wrapping, differ slightly from the live site).
"""

import os
import sys

from playwright.sync_api import sync_playwright

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "screenshots")

PAGES = [
    ("index.html", "home"),
    ("builds.html", "builds"),
    ("build.html?id=may26-01", "build-detail"),
    ("about.html", "about"),
    ("contact.html", "contact"),
    ("custom-build.html", "custom-build"),
    ("gallery.html", "gallery"),
    ("faq.html", "faq"),
    ("part-boxes.html", "part-boxes"),
    ("404.html", "404"),
]

WIDTHS = [320, 360, 375, 390, 393, 412, 428, 430, 480, 600, 700, 768, 820, 1024, 1440]
CLASSIC_WIDTHS = [1440, 768, 390]  # the widths --screenshots keeps, as before A-037
HEIGHT = 900

# Console messages about the blocked external requests (fonts) are not site errors.
# A failed load of a local file:// URL (a missing image, say) is still reported.
def is_blocked_noise(msg):
    return msg.location.get("url", "").startswith("http")

# Names the elements that stick out past the right edge, to point at the culprit.
OFFENDERS_JS = """() => {
  const vw = document.documentElement.clientWidth, out = [];
  for (const el of document.body.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.right > vw + 2 && out.length < 3) {
      const cls = (el.className && el.className.toString().trim().split(/\\s+/)[0]) || '';
      out.push(el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (cls ? '.' + cls : '')
               + ' right=' + Math.round(r.right));
    }
  }
  return out;
}"""


def main():
    shots = "--screenshots-all" in sys.argv or "--screenshots" in sys.argv
    shot_widths = WIDTHS if "--screenshots-all" in sys.argv else CLASSIC_WIDTHS
    if shots:
        os.makedirs(OUT, exist_ok=True)

    overflow, errors = [], []
    checked = 0

    with sync_playwright() as p:
        browser = p.chromium.launch()
        for w in WIDTHS:
            ctx = browser.new_context(viewport={"width": w, "height": HEIGHT})
            # Only the local files load; anything else (Google Fonts) is blocked fast.
            ctx.route("**/*", lambda route: route.continue_()
                      if route.request.url.startswith("file://") else route.abort())
            for file, slug in PAGES:
                page = ctx.new_page()
                msgs = []
                page.on("pageerror", lambda e, m=msgs: m.append(f"script error: {e}"))
                page.on("console", lambda c, m=msgs: m.append(f"console error: {c.text} ({c.location.get('url', '')})")
                        if c.type == "error" and not is_blocked_noise(c) else None)
                page.goto(f"file://{BASE}/{file}", wait_until="load")
                page.wait_for_timeout(250)
                scroll_w = page.evaluate("document.documentElement.scrollWidth")
                client_w = page.evaluate("document.documentElement.clientWidth")
                checked += 1
                if scroll_w > client_w + 2:
                    who = ", ".join(page.evaluate(OFFENDERS_JS))
                    overflow.append(f"{slug} @ {w}px: scrollWidth={scroll_w} > clientWidth={client_w} ({who})")
                for m in msgs:
                    errors.append(f"{slug} @ {w}px: {m}")
                if shots and w in shot_widths:
                    path = f"{OUT}/{slug}-{w}.png"
                    page.screenshot(path=path, full_page=True)
                    print(f"captured {path}")
                page.close()
            ctx.close()
        browser.close()

    print(f"\nChecked {len(PAGES)} pages x {len(WIDTHS)} widths = {checked} loads "
          f"({WIDTHS[0]}-{WIDTHS[-1]}px, Chromium only, fallback fonts).")
    print("\n--- Horizontal overflow ---")
    print("\n".join("OVERFLOW: " + o for o in overflow) if overflow else "None.")
    print("\n--- Script errors ---")
    print("\n".join("ERROR: " + e for e in errors) if errors else "None.")
    sys.exit(1 if (overflow or errors) else 0)


if __name__ == "__main__":
    main()
