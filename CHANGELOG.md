# CHANGELOG.md — North Bridge PCs Website Rebuild

## Phase 0 — Discovery
- Cloned and inspected the old site's actual repo source (not just the
  rendered pages) — full inventory recorded in ARCHITECTURE.md.
- Identified gaps vs. the project brief: no Services/About page, no
  structured data or Open Graph tags, dark-only theme, business email
  exposed in client-side source, header/footer/trust content duplicated
  across all 8 pages, flat (non-componentized) PC data model.
- Owner decisions: dedicated Services page, drop the old one-off event in
  favor of a general-purpose event system, system-preference light/dark.

## Phase 1 — Foundation (in progress)
- Project directory structure created.
- `PROJECT_STATUS.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `TODO.md`,
  `CHANGELOG.md` created.
- `js/data/config.js` — feature toggles, site identity, contact routing.
- `js/data/builds.js` — new componentized PC schema, one example entry.
- `js/data/services.js` — service list scaffold (names only).
- `js/data/events.js` — new multi-event promo system, nothing active.
- `js/data/testimonials.js` — empty, toggle-off-safe scaffold.
- `css/tokens.css` — light/dark design tokens via `prefers-color-scheme`,
  carrying forward the old site's blue accent and dark palette.
- `css/base.css` — reset, accessibility foundations, responsive breakpoint
  scale (carried over: 1100/900/640/420px).

## Phase 2 — Core Site (in progress)
- `css/style.css` adapted from the old site's stylesheet: removed the
  now-redundant reset/`:root` block, converted 7 hardcoded hex colors to
  token references (`--accent-2`, `--placeholder-*`) so it works correctly
  in light mode.
- `js/partials/header.html` / `footer.html` — shared page chrome.
- `build-tools/stitch.py` — assembles partials into final static HTML.
- `js/render/chrome.js` — mobile nav, scroll progress, back-to-top, footer
  year, toggle-driven footer contact links. Replaces inline scripts
  duplicated across all 8 old pages.
- `js/render/eventBanner.js`, `js/render/buildCard.js`,
  `js/render/faqAccordion.js` — reusable render components.
- `pages-src/index.html` — homepage, built via stitch.py into `index.html`.
  Reuses the old homepage's already-published copy (hero, trust cards,
  custom-build pitch, testing process, FAQ answers, contact CTA), rewired
  to the new data-driven architecture.
- Verified the full render pipeline in a real DOM against test data
  (available build w/ event pricing, sold build, active event): correct
  filtering, correct optional-field handling, working FAQ accordion and
  mobile nav. Found and fixed one real bug this way — skip-link had no
  `#main` target.

## Phase 3 — Business Content (continued)
- Real inventory migrated: the old site's 3 sold PCs, new componentized
  schema, real product photos (not placeholders) copied into `images/`.
- `builds.html` — full inventory page (available grid or notify-box
  waitlist; sold section).
- `js/render/notifyBox.js` — waitlist system, extracted from the old
  site's working implementation, now reads the contact email from
  config.js.
- `build.html` + `js/render/buildDetail.js` — the complete build-card/
  detail system: full componentized spec sheet, photo+video gallery,
  condition/testing notes, event-aware pricing, status-aware CTA. Inquiry
  form now sources its destination email and redirect URL dynamically
  instead of hardcoding them.
- `js/render/trustSection.js` — de-duplicated the trust cards and process
  steps that were copy-pasted between the old homepage and old build page.
- `css/build-detail.css` — extracted from an inline `<style>` block,
  fixed one hardcoded color for light-mode support.
- Tested end-to-end against the real migrated data plus synthetic data
  covering every optional field path (all 10 component categories,
  accessories, condition, testing notes, video, event pricing) — all
  passed.
- Logged D6 (Part Boxes resale system + nav restructuring) per owner
  request — implemented in the next entry below.

## Phase 3 — Nav restructuring
- Flat nav replaced with a "For Sale" dropdown (desktop) / accordion
  (mobile) over Gaming PCs, Custom Builds, Part Boxes. `stitch.py` gained
  a `{{activegroup:...}}` token so the parent trigger highlights
  correctly when on any child page. Services deliberately stayed a flat
  link — see DECISIONS.md D6 for why.
- Tested the full interaction sequence in a real DOM: dropdown open/
  toggle-close/outside-click-close/Escape-close-with-focus-return, mobile
  accordion expand/collapse without closing the whole drawer, and
  confirmed tapping a real sublink still closes the drawer. Re-ran
  existing regression checks (hamburger, footer year, FAQ accordion,
  featured-builds, sold-builds, build-detail rendering) across all three
  pages to confirm the shared chrome.js/style.css changes didn't break
  anything already shipped.
- Part Boxes system itself not yet built — nav links to `part-boxes.html`
  exist and will 404 until that page is built (next planned work).
