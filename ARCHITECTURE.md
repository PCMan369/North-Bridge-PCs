# ARCHITECTURE.md — North Bridge PCs Website Rebuild

## Stack

Static HTML/CSS/vanilla JS. No framework, no client-side build step required
to *run* the site. GitHub Pages hosting — no backend, no database, no
server-side form processing (forms go through FormSubmit, same as before).

A **local build script** (`build-tools/stitch.py`) is used to assemble
shared header/footer/nav partials into final static HTML files before
committing — see "Why a build script" below. This runs on your machine
before you push, not in the browser. The output is still plain static HTML.

## Directory layout

```
/
├── index.html, builds.html, build.html, services.html,
│   custom-build.html, gallery.html, faq.html, contact.html, 404.html
├── css/
│   ├── tokens.css      — design tokens (colors, spacing, radii, shadows)
│   ├── base.css         — reset, accessibility & responsive foundations
│   ├── style.css        — component styles (Phase 2+)
│   ├── gallery.css      — gallery grid + lightbox (gallery.html, build.html)
│   ├── build-detail.css — build.html-specific styling
│   ├── services.css     — services.html-specific styling
│   ├── part-boxes.css   — part-boxes.html-specific styling
│   └── theme.css        — the "Forge" visual redesign (dark/amber), loaded
│                          sitewide as the last stylesheet on all 11 pages.
│                          Was `homepage-forge.css` and homepage-only through
│                          Redesign Batch 1; renamed and unscoped from
│                          `body.theme-forge` in Batch 2 (see D23/D24) once
│                          it went sitewide.
├── js/
│   ├── data/             — YOUR CONTENT LIVES HERE. Edit these, not HTML.
│   │   ├── config.js      — feature toggles + site identity + contact routing
│   │   ├── builds.js       — PC inventory
│   │   ├── services.js     — service list
│   │   ├── events.js       — sales/promo system
│   │   └── testimonials.js — testimonials
│   ├── render/            — logic that turns data into HTML (Phase 2+)
│   └── partials/          — shared header/footer/analytics used by stitch.py
├── build-tools/
│   └── stitch.py          — assembles partials into final HTML
├── images/
├── PROJECT_STATUS.md, ARCHITECTURE.md, DECISIONS.md, TODO.md, CHANGELOG.md
├── robots.txt, sitemap.xml
```

## Why this structure (vs. the old site)

The old site worked, but had two maintainability problems worth fixing:

1. **Header/footer/nav were copy-pasted into all 8 HTML files.** A nav
   change meant editing 8 files by hand and risking them drifting out of
   sync (they'd already started to slightly — the mobile-nav markup wasn't
   always byte-identical to desktop nav across pages).
2. **Data and rendering logic lived in the same file** (`builds.js` mixed
   the PC array with the HTML-generating functions). Fine at 3 PCs, harder
   to reason about as it grows.

This rebuild separates those concerns:

- **`js/data/*`** is the only place you should need to touch for routine
  updates — new PC, price change, toggling a feature on, adding a
  testimonial.
- **`js/render/*`** contains the functions that turn that data into HTML.
  You shouldn't need to touch this for content updates, only for design
  changes.
- **`js/partials/*` + `stitch.py`** solves the header/footer duplication
  without adding a client-side framework or a runtime fetch() for the nav
  (which would flash an unstyled page and hurt SEO crawlability).

### Why a build script instead of just living with the duplication

Alternatives considered:

- **Keep copy-pasting the nav into every file** (status quo): simplest,
  but the exact problem being fixed.
- **Client-side JS include** (`fetch('header.html')` on page load): no
  build step needed, but causes a visible flash of missing nav on slow
  connections, and search engines / social-media link previews that don't
  execute JS would see a page with no navigation.
- **A local static-site generator** (Eleventy, Hugo, etc.): solves this
  properly but is a real dependency with its own learning curve and
  config — more than this project needs.
- **A small custom Python script that stitches partials at commit time**
  (chosen): zero runtime cost, output is identical to hand-written static
  HTML, no new dependency beyond Python (which is already part of your
  workflow), and it's simple enough to read top-to-bottom in a couple of
  minutes if you ever need to change it.

You'll run `python3 build-tools/stitch.py` before committing, the same way
you'd run a linter — it injects `js/partials/header.html`,
`js/partials/footer.html`, and `js/partials/analytics.html` into each page
template via marker comments (`<!--HEADER:id-->`, `<!--FOOTER-->`,
`<!--ANALYTICS-->`), plus a separate `<!--SEO-->` marker it builds
canonical/OG/structured-data tags for directly. See DECISIONS.md for the
history of each addition.

## Feature toggle philosophy

One config module (`js/data/config.js`) holds every feature's on/off state
plus whatever data that feature needs (a phone number, a social URL). Pages
check `config.features.X.show` before rendering anything related to X.
Turning a feature on is: flip the boolean, fill in the value, done — no
HTML hunting.

## PC data model

The old model stored `title: "Ryzen 5 3600 / RTX 2070 Super"` as one string
and only broke out `ram` and `storage` separately. The new model gives each
component its own field (`cpu`, `gpu`, `motherboard`, `ram`, `storage`,
`psu`, `case`, `cooler`, `os`, `networking`, `accessories`), each optional —
missing fields are simply omitted from display rather than showing an empty
row. This matches the "complete build card" system described in the
project brief: a normal buyer still sees a clean summary, but every field
is available for someone who wants the full spec sheet.

Media is a `{ images: [], videos: [] }` object per build (and, later, per
component) rather than a flat `photos` array, so a listing can have any
combination of photos/video without special-casing.

## Event/promo system

Replaces the old single hardcoded `EVENT` object with an array of events,
each with its own date range, banner copy, and a `showCountdown` flag.
Rationale: the project brief flags countdown timers as a manipulative
pattern to avoid, but the old site's Back to School sale was a real,
non-fake deadline — the tension isn't really "countdown vs. no countdown,"
it's "does this specific promotion warrant urgency framing." Making it a
per-event choice lets a clearance sale skip the countdown while a genuine
23-hour flash deal could use one, without hardcoding a site-wide stance
either way. (Flagged for confirmation — see PROJECT_STATUS.md.)

## Theming

CSS custom properties in `css/tokens.css`, split into a base set and a
`@media (prefers-color-scheme: light)` override block (dark is the
default/fallback, matching the old site's only theme, with light values
derived from it). No JS-based theme switcher yet — pure CSS, so it works
even with JS disabled. A manual toggle can be layered on later without
restructuring the tokens, per the project brief's future-proofing
requirement.

## Visual redesign ("Forge") — complete, then audited (see DECISIONS.md D22–D24, D27)

The owner redesigned the site's visual language (dark/amber "Forge"
direction) in two batches, on top of the architecture above. Both are
done and shipped; this section is history/rationale now, not an
in-progress note.

**Pattern**: rather than editing `tokens.css`/`base.css`/`style.css`
in place, the new look is layered on via `css/theme.css`, which
redefines the site's existing CSS custom properties (`--bg`,
`--accent`, etc.) plus new typography tokens (`--font-heading`,
`--font-mono`). Because every existing component already reads its
colors from these custom properties rather than hardcoded values,
redefining the *values* re-themes the whole shared header/footer/
button/form system automatically, with no changes needed to the base
stylesheets. A few shared rules that hardcoded the old blue directly
(raw `rgba(59,130,246,...)` instead of a token, or `color: white`
assumed safe against the old accent) needed explicit overrides — see
D23 for the Batch 1 list and D24 for the additional ones only
reachable from the other 9 pages.

**Batch 1** (homepage only): scoped to `body.theme-forge`
(`css/homepage-forge.css` at the time) so it couldn't affect any
other page while only one page was redesigned.

**Batch 2** (the other 9 customer-facing pages, all in one pass):
`homepage-forge.css` → `css/theme.css`, unscoped from
`body.theme-forge` to plain global rules — that class no longer
exists anywhere, and all 11 pages (10 then, 404.html since) load
`theme.css` as their last stylesheet. `js/render/trustSection.js`
(previously the old icon-card trust section + numbered-circle
testing steps, still used by `build.html` after Batch 1) was
rewritten into one shared `renderTrustEvidence()` function so
`build.html` and the homepage render the same evidence pattern from
the same real copy. Full list of what changed page-by-page is in
PROJECT_STATUS.md's "Redesign implementation plan" and DECISIONS.md
D24.

**Since then**: a full-site QA/visual audit (D27) found and fixed 7
issues on top of the finished redesign — most notably the header
"Contact" button's white-on-amber text badly failing contrast
sitewide (2.04:1, fixed to 9.13:1) — plus several heading-hierarchy,
ARIA-validity, and sold-card-contrast fixes. See D27 for the full
list. The owner has not yet reviewed the redesign + audit fixes on
their own machine/phone — see PROJECT_STATUS.md's "Not started yet."

## What's deliberately NOT built yet

- No payment integration code, not even a disabled stub — the brief asks
  for an integration *boundary*, not a scaffold. That boundary is simply
  "contact/inquiry flow ends in a message, not a payment page" — nothing
  else to build until Stripe is actually being wired in.
- No customer accounts / auth of any kind.
- No blog templates — `config.js` has the toggle, nothing else, per the
  brief's "don't build a CMS for a feature that may never be used."
