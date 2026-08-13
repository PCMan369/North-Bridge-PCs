# PROJECT_STATUS.md — North Bridge PCs Website Rebuild

> **This is the primary handoff document.** If you're a new Claude conversation
> picking this up, read this file first, then ARCHITECTURE.md and DECISIONS.md.
> Do not trust conversation history — trust these files and the actual code.

---

## What this project is

A ground-up rebuild of the North Bridge PCs website. The old site
(`pcman369/North-Bridge-PCs`, live at the current GitHub Pages URL) is
**reference material only** — this is not an in-place edit of it, and it
stays live/untouched until this replacement is ready to swap in.

Static HTML/CSS/vanilla JS. No framework. Hosted on GitHub Pages (current
site's constraint carries over — no server-side backend, no database).

## Current phase

**Phase 3 — Business Content** (in progress)

Per the phase plan: services, available PCs, complete PC build
cards/details, sold PCs, About Me, trust/testimonial system, empty-state
handling, waitlist/request architecture. Phase 2 (Core Site) is complete.

## Completed so far

- [x] Phase 0 Discovery — inspected the old repo directly (cloned via git,
      not just the rendered pages). Full inventory in ARCHITECTURE.md.
- [x] Three foundational decisions locked (see DECISIONS.md): Services gets
      a dedicated page/nav item; the old one-off "Back to School" event is
      NOT carried over as-is, replaced with a general-purpose event/promo
      system; site follows system light/dark preference.
- [x] Phase 1 (Foundation) — complete. Project structure, docs, config/data
      layer, design tokens, base CSS/accessibility foundations.
- [x] The 3 proposed-but-unconfirmed Phase 1 defaults (D2 Services page
      structure, D3 per-event countdown toggle, D5 brand color carryover)
      were not corrected across two follow-up turns — proceeding on them
      as accepted. Still reversible; flag anytime.
- [x] `css/style.css` adapted from the old site's stylesheet: removed the
      now-redundant reset/`:root` block, and converted 7 hardcoded hex
      colors to token references so it actually works in light mode too.
- [x] `js/partials/header.html` / `footer.html` — shared chrome, used by
      every page via the build script.
- [x] `build-tools/stitch.py` — assembles partials into final static HTML.
      Verified working (builds index.html correctly, active-nav token
      resolves per page, no leftover markers in output).
- [x] `js/render/chrome.js` — mobile nav toggle, scroll progress, back-to-
      top, footer year, toggle-driven footer phone/social links. Replaces
      the inline script that was copy-pasted on all 8 old pages.
- [x] `js/render/eventBanner.js` — renders the sitewide sale banner only
      when an event is active; otherwise renders nothing (no empty bar).
- [x] `js/render/buildCard.js` — build card renderer for the new
      componentized schema, with graceful handling of missing fields and
      event pricing. Includes `renderEmptyBuildsState()` for the
      no-PCs-available case.
- [x] `js/render/faqAccordion.js` — extracted from inline script, scoped
      per `.faq-list` so it works unmodified on both the homepage preview
      and the full FAQ page (Phase 3).
- [x] `pages-src/index.html` — homepage source. Reuses the old homepage's
      already-published copy (hero, "why us" cards, custom-build pitch,
      testing process, FAQ answers, contact CTA) verbatim where it's
      authentic business content, rewired to the new data-driven
      architecture. Gallery preview degrades gracefully until
      `js/data/gallery.js` exists (Phase 3).
- [x] **Tested, not just written**: ran the actual stitched `index.html`
      and its real script files (config/events/builds data + all four
      render scripts) in a real DOM (jsdom) against injected test data
      covering an available build with event pricing, a sold build, and
      an active test event. Verified: correct build filtering (sold
      excluded from featured section), all optional fields render
      correctly, event pricing displays correctly, event banner renders
      with countdown, FAQ accordion opens on click, mobile nav toggles
      correctly with proper aria-expanded state, footer year is correct.
      Also caught and fixed a real bug this way: the skip-link had no
      `#main` target — added `<main id="main">` around the homepage
      content.
- [x] HTML tag-balance validated (html/head/body/main/header/footer/
      section/div all balanced) and all new JS files pass `node --check`.

## Completed so far (continued)

- [x] **Real inventory migrated**: the old site's 3 sold PCs are now real
      entries in `js/data/builds.js`, using the new componentized schema
      (title parsed into separate `cpu`/`gpu` fields, `fps` parsed into
      structured `performance.items`). Their actual product photos (13MB,
      11 real files) were copied into `images/` — not placeholders. One
      filename with spaces was renamed for web-safety
      (`Website Main Pic.jpeg` → `may26-01-main.jpg`).
- [x] `builds.html` — full inventory page. Available section shows real
      cards or the notify-box waitlist (data-driven, not hardcoded); sold
      section shows/hides based on whether any sold builds exist.
- [x] `js/render/notifyBox.js` — the waitlist system extracted from the
      old site, same proven behavior, now reading the contact email from
      `config.js` instead of having it hardcoded in this file.
- [x] `build.html` + `js/render/buildDetail.js` — the full "complete build
      card" system: sticky photo **and video** gallery (old site was
      photos-only) with arrows/counter/thumbnails/keyboard nav, a spec
      sheet that lists every populated component category (not just
      RAM/Storage like the old site), a condition/testing-notes section
      that only appears when populated, event-aware pricing, and a
      status-aware CTA (inquiry form when available, sold notice when
      not). The inquiry form's FormSubmit destination now reads
      `CONTACT.email` from config.js instead of being hardcoded in the
      page, and its post-submit redirect is built from
      `window.location` instead of a hardcoded domain.
- [x] `js/render/trustSection.js` — the "Why North Bridge PCs" cards and
      "Testing & Setup Process" steps were duplicated verbatim between
      the old homepage and the old build detail page. Now defined once,
      used by both `index.html` and `build.html`.
- [x] `css/build-detail.css` — build.html's styling (was an inline
      `<style>` block on the old page) extracted to its own file, loaded
      only where it's needed. Fixed the one hardcoded color found there
      too (`#0a1526` → `var(--placeholder-solid)`).
- [x] **Tested end-to-end again**: real DOM tests against the actual
      migrated inventory (not synthetic data) covering builds.html's
      available/sold split, build.html's gallery navigation (thumbnail
      click + keyboard arrows), the sold-notice vs. inquiry-form switch,
      the not-found state, the post-submit thank-you state, and — using
      synthetic data to reach the paths the real inventory doesn't
      exercise — every optional field (all 10 component categories,
      accessories, condition, testing notes, video, event pricing).
      All passed. Confirmed the homepage's trust-section refactor didn't
      break anything.

## Not started yet

- Nav restructuring + Part Boxes system (see DECISIONS.md D6) — next up.
- Rest of Phase 3: Services page content, About Me, testimonials content,
  `js/data/gallery.js` port (homepage gallery preview still shows the
  graceful "coming soon" fallback).
- Phase 4 (Contact): inquiry-type-specific forms (contact.html itself
  doesn't exist yet).
- Phase 5 (SEO/Local): structured data, Open Graph, canonical URLs,
  sitemap, robots.txt.
- Phase 6–8: media/polish (the migrated photos are real but unoptimized —
  ~1.1MB average, worth compressing before launch), testing, docs/handoff.

## Known open questions (not yet blocking, but will be before their phase)

- Repair/upgrade/cleaning/support: actual public-facing descriptions,
  pricing, and policy wording still needed from the owner (Phase 3 blocker).
- About Me content and real testimonials (if any) still needed from the
  owner (Phase 3 blocker).
- Business email handling: still the personal Gmail, now sourced from one
  place (`config.js`) instead of scattered, but the underlying exposure
  in client-side source is inherent to the no-backend FormSubmit approach
  regardless. Still needs an explicit owner call on whether that's fine
  long-term.

## Immediate next step

Nav restructuring is done (see CHANGELOG.md). Per the owner's D6 request,
the remaining piece is the Part Boxes resale system:
`js/data/partBoxes.js` + a card/order-picker renderer + `part-boxes.html`
(multi-item order-request page, no payment processing — matches how
everything else here works). The nav already links to it; that link
currently 404s until this is built.

## Files that matter

- `js/data/*.js` — all content/config, no HTML editing needed for routine
  updates once Phase 2+ is done.
- `css/tokens.css` — single source of truth for color/spacing/radius values.
- `js/partials/*.html` + `build-tools/stitch.py` — shared header/footer.
  Run `python3 build-tools/stitch.py` after editing either one, or after
  adding a new file to `pages-src/`.
- `ARCHITECTURE.md` — full technical rationale.
- `DECISIONS.md` — business/architecture decision log.
