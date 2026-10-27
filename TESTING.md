# TESTING.md — how to run the checks

Moved out of START_HERE.md in B-032 (content unchanged apart from layout). Read before running or reporting a test.

- `smoke-test.js` (DOM checks in jsdom): run `npm install jsdom --no-save` first (jsdom is not in the repo). It needs the
  npm registry, which depends on the chat's sandbox network settings (Lane A's account reached it; Lane B's did not,
  registry returned 403). If it cannot run, log "not run (reason)", never a pass.
- `visual-check.py` (Chromium, horizontal overflow + script errors): needs no network; Chromium is pre-installed at
  `/opt/pw-browsers` (Python and Node bindings both launch it). `python3 visual-check.py` loads the 10 pages (9 real +
  404) at 15 widths (320, 360, 375, 390, 393, 412, 428, 430, 480, 600, 700, 768, 820, 1024, 1440px) = 150 loads, writes
  nothing, prints the offending elements, and exits 1 on any overflow or script error (A-037). `--screenshots` adds PNGs at
  1440, 768 and 390px, `--screenshots-all` at every width; both write `screenshots/`, so run them on a scratch copy and
  keep that folder out of the ZIP. Fallback fonts (external requests are blocked); a missing local file counts as an error.
- Fonts: theme.css loads Google Fonts, unreachable in Lane A's sandbox, so screenshots use fallback fonts. For
  font-accurate mockups, install `@fontsource-variable/manrope`, `@fontsource-variable/bricolage-grotesque` and
  `@fontsource/space-mono` from npm in a scratch folder and inject `@font-face` rules (scratch copy only).
- Browsers: only Chromium is installed here. The owner tests on real devices: iPhone 8 (iOS 16.7, Safari), an iPad and a
  MacBook; Android is untested (no device). CSS in use that
  older engines may ignore (written to degrade gracefully, unverified outside Chromium): `text-wrap: balance`/`pretty`,
  `color-mix()`, `aspect-ratio`, animating `grid-template-rows`.
- Touch emulation: CSS that depends on `(pointer: coarse)` (form fields are 16px on touch screens, A-041) only applies in
  Playwright with `browser.new_context(has_touch=True, is_mobile=True)`; a plain context does not match it. iOS Safari's
  zoom-on-focus itself cannot be reproduced here, so check the field `font-size` (16px) instead of the zoom.
- Impeccable design scanner: `npx impeccable detect .` run in a scratch copy of the built site with `pages-src/` and
  `docs-archive/` deleted (otherwise it reads unresolved stylesheets and reports false findings). Needs the npm registry.
  Empty output and exit code 0 mean no findings. Last result: clean (A-043).
- Old docs claiming the Node/npx Playwright route "doesn't work" are outdated: only the `npx playwright install
  chromium` download step failed, and it is not needed.
- Admin/publishing tests (B-084): `python3 build-tools/test-content.py` (listing checks, generated data, photo cleaning; needs Pillow;
  HEIC checks need `pillow-heif`) and `node build-tools/test-render.js` (escaping, draft/hidden pages; needs `npm install jsdom
  --no-save`). Both work on throwaway copies or in memory and write nothing. In B-084 the npm registry was reachable in Lane B's
  sandbox. The GitHub Action itself and Pages CMS cannot be run here: log them as "not run".
