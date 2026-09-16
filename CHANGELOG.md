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

## Phase 3 — Part Boxes system
- `js/data/partBoxes.js` — schema + docs, empty array (no real inventory
  yet, same as builds.js started).
- `js/render/partBoxCard.js` — box card with a quantity picker
  (+/- buttons and a clamped number input, `max` = actual stock).
- `js/render/partBoxOrder.js` — tracks selected quantities across all
  cards, keeps a live "Your Request" summary (itemized lines + running
  total) in sync, reveals the name/email form only once something's
  selected, and submits the whole request as one itemized FormSubmit
  inquiry. No cart, no checkout, no payment processing — matches how
  every other form on this site works.
- `part-boxes.html` — wires it together; empty-state when there's no
  stock (hides the order summary too, rather than showing an empty panel
  next to an empty-state message).
- Tested in a real DOM: empty-inventory state, a zero-quantity box
  correctly excluded from the grid, +/- button clamping at both 0 and the
  per-box max, the same clamping via direct number-input typing, running
  summary math across multiple items, form reveal/hide as selections
  change, empty-field validation on submit, and a full successful
  submission verifying the itemized payload and dynamic destination email
  sent to FormSubmit. Re-checked tag balance and JS syntax across all 4
  pages afterward.

## Phase 3 — Remaining core pages
- `contact.html` — rebuilt as a single unified form (see DECISIONS.md
  D7 for why the old two-variant/`?system=` approach was simplified
  away). FormSubmit destination and post-submit redirect both sourced
  dynamically from `config.js`/`window.location`, not hardcoded.
- `custom-build.html` — ported directly from the old site's real,
  already-published content (6-step process, 3 example budget tiers,
  "not sure what you need" section) into the new architecture. No new
  copy invented.
- `faq.html` + `js/data/faq.js` + `js/render/faqList.js` — all 6 real
  Q&A pairs now live in one data file. The homepage's 3-item preview
  and the full FAQ page both render from the same source via a
  `featured` flag, eliminating what would otherwise have been 3
  duplicated Q&A pairs between the two pages.
- **Found and fixed a real sequencing bug** while wiring the homepage's
  now-dynamic FAQ preview: `faqAccordion.js` was attaching click
  handlers immediately on script load, before the FAQ items existed in
  the DOM (they're injected by a later inline script). Converted it to
  run on `DOMContentLoaded` instead, which fixes it regardless of
  script tag order and works correctly on both pages.
- Tested all of the above in a real DOM: homepage FAQ preview shows
  exactly the 3 featured items and its accordion actually opens
  (confirming the sequencing fix), the full FAQ page renders all 6 and
  enforces single-item-open behavior, the contact form's action/redirect
  resolve correctly from config.js, the thank-you state triggers
  correctly on `?sent=true`, and custom-build.html's tier cards/process
  steps render correctly. Re-ran the full regression sweep (hamburger,
  footer year, no console errors) across all 7 pages now in the project.

## Phase 3 — Gallery (final core page)
- `js/data/gallery.js` — real photo data ported from the old site (same
  11 files already migrated into builds.js). `currentBuilds` empty on
  purpose (no in-progress systems right now).
- `js/render/galleryGrid.js` — grid renderer plus a new click-to-enlarge
  lightbox (the old site's gallery was grid-only) with prev/next,
  wrap-around at the ends, Escape-to-close, and overlay-click-to-close.
  One shared lightbox instance serves both grids on the page.
- `css/gallery.css` — lightbox styling only; the grid/item styles
  already lived in the shared style.css since the homepage preview
  already used them.
- `gallery.html` — wires both sections together.
- Closed the loop on the homepage's gallery preview: it was written back
  in Phase 2 to gracefully fall back to "coming soon" until gallery.js
  existed. Just loading the new script was enough — no logic changes
  needed, confirming that fallback was built correctly the first time.
- Tested in a real DOM: current-builds empty state, all 11 completed
  photos rendered, lightbox open/close/next/prev/keyboard-arrows/
  wrap-around/overlay-click, per-item correctness (clicking photo 6
  shows photo 6, not photo 1), and confirmed the homepage preview now
  shows 3 real photos instead of the coming-soon fallback. Full
  regression sweep re-run across all 8 pages now in the project.

All pages that don't require new owner-provided copy are now built.
Remaining work is gated on the owner: Services page content, About Me,
testimonials.

## Phase 3 — Services + About (content complete)
- Owner provided real facts for all 4 pending services and About Me.
  Converted into customer-facing copy without adding any price,
  turnaround time, or guarantee beyond what was given.
- `services.js` schema extended (`included`/`pricingNote`/
  `turnaroundNote`/`notCovered`) — a one-line description wasn't enough
  to honestly represent things like "not every repair is worth doing"
  or "no guaranteed performance increase from an upgrade."
- `js/render/serviceCard.js` — two renderers: hub cards (link out to
  Sales/Custom Builds) and detail cards (full content, each section
  optional).
- `services.html` — hub cards, 4 detail cards, and a shared policy
  blurb (no surprise charges, confirm before expanding scope, honest
  estimate over a promised turnaround, summer timeline note).
- `about.html` — real content from owner-provided facts. Contains a
  `[Your Name]` placeholder — no name was given anywhere, flagged
  rather than guessed.
- "About" added to the nav — flat link, between Services and Gallery,
  desktop + mobile + footer.
- Testimonials confirmed to stay disabled (owner: none exist yet) — no
  code changes needed, Phase 1's empty-array-plus-toggle already
  handles this correctly.
- Tested in a real DOM: hub/detail card counts, each detail card's
  optional note sections rendering only when populated, and — this one
  mattered — a page-wide text scan confirming no fabricated dollar
  amounts or "same-day"/"24-hour" style turnaround language exists
  anywhere on the page. Full regression sweep re-run across all 10 pages
  now in the project.

Every page in the site's IA now exists with real content. Nothing left
is content-gated — remaining work (Phase 5 SEO, the `[Your Name]`
placeholder) is either technical or a single small owner input.

## Phase 3 — Owner review fixes
- Name filled in (Jacob Skrove), replacing the `[Your Name]` placeholder.
- Corrected an error from the original business input: turnaround isn't
  slower in summer "because of school" — it's the reverse, summer is
  faster with less going on, school year can run slower. Fixed in
  `about.html` and `services.html`.
- Added a dedicated service-request form to `services.html`, replacing
  a generic link to `contact.html` that didn't fit repair/upgrade/
  cleaning/support inquiries (that form's fields — budget, games,
  Wi-Fi, monitor, RGB — are built for PC purchases). New form: name,
  email, a service dropdown populated live from `services.js` (can't
  drift out of sync with the real service list), optional system
  description, what's going on. Each service detail card got a
  "Request This Service" button that pre-selects it and scrolls down.
- Tested in a real DOM: dropdown options match the data, each card's
  button pre-selects correctly and triggers the scroll, dynamic form
  action/redirect resolve correctly, thank-you state works. Full
  regression sweep re-run across all 10 pages.

Nothing outstanding blocks anything else. Natural next step is Phase 5
(SEO/local discovery).

## Phase 5 — SEO / Local Discovery
- `stitch.py` extended: generates canonical tags, Open Graph tags,
  Twitter Card tags, and homepage JSON-LD (`ComputerStore` structured
  data with address/service-area, no invented fields) for every page.
  All driven from `SITE.url` in `config.js` — the one place this value
  lives. OG title/description are read from each page's own existing
  `<title>`/`<meta name="description">` rather than duplicated.
- `sitemap.xml` and `robots.txt` now auto-generated on every build.
- Owner asked whether building this against the placeholder GitHub
  Pages URL (real domain still months out) could break anything.
  Answer: no functional risk, but it does need updating later — so this
  was built so that's a one-line change. **Verified, not just claimed**:
  temporarily swapped `SITE.url` to a fake real domain, rebuilt,
  confirmed every canonical/OG/JSON-LD/sitemap/robots.txt reference
  updated correctly with zero trace of the old URL anywhere, then
  reverted to the placeholder.
- Confirmed generated JSON-LD is valid JSON, appears only on the
  homepage (not redundantly on all 10 pages), canonical tags exist on
  every page, and a full regression sweep across all 10 pages confirmed
  the new `<head>` content didn't break anything already working.

Phase 5 complete. Remaining: update the domain when it arrives (one
config change + a new Search Console property), and Phase 6–8 polish.

## Accessibility — contrast fixes
- **Fix 1**: white text on solid `--accent` (#3b82f6) backgrounds only
  reached 3.68:1 (needs 4.5:1). Audited every usage first — found 9
  locations sharing this exact pairing (`.btn-primary`, `.nav-cta`,
  `.step-num`, `.pl-num`, `.faq-icon` open state, `.back-to-top`,
  `.skip-link`, `.qty-btn:hover`, `#event-banner`), not just the one
  named component. Fix: these now rest at the already-existing
  `--accent-h` (#2563eb → 5.17:1 with white text) and hover at a new
  `--accent-h2` (#1d4ed8 → 6.70:1). `--accent`/`--accent-h` values
  themselves untouched — only which components use them for
  backgrounds changed.
- **Fix 2**: dark theme `--dim` was 2.79:1 against its worst-case
  surface (`--card-h`) — worse than the 3.75:1 originally reported
  (checked against `--bg` only). New value `#8c9bb1`: 6.32:1 vs `--bg`,
  5.18:1 vs `--card`, 4.70:1 vs `--card-h`. Light theme's `--dim`
  untouched (was already compliant against `--bg`/`--card`).
- Verified every ratio mathematically (WCAG relative-luminance formula,
  not estimated) both before and after. Confirmed unrelated variables
  (`--accent` as text, `--muted`, light-theme `--dim`) are byte-for-byte
  unchanged. Full functional regression sweep across all 10 pages (zero
  JS errors) plus HTML tag-balance and CSS brace-balance checks on
  every file touched.
- **Found, explicitly not fixed** (outside this fix's scope, flagged in
  DECISIONS.md D11 and PROJECT_STATUS.md instead): `--accent` as text
  color on `--card` (3.98:1), `a:hover` text color (3.45:1, value
  unchanged by this fix so unaffected either way), light theme `--dim`
  vs `--card-h` (4.34:1, newly discovered while auditing surfaces for
  fix 2).

Phase 6 has not been started, per explicit instruction to keep this fix
isolated.

## Accessibility — light-mode header bug + 3 remaining contrast issues
- **Header bug** (owner-reported): `.site-header` had a hardcoded
  `rgba(15,23,42,0.96)` background — dark theme's `--bg` spelled out in
  decimal, no light-theme override. The original color audit only
  searched `#hex` patterns and missed this `rgba()` one. Fixed with a
  new `--header-bg` token (dark unchanged, light = light theme's own
  `--bg` at the same alpha).
- Same blind spot found on 5 hover-feedback backgrounds
  (`rgba(255,255,255,0.06)`/`0.05`) — nearly invisible against a light
  surface. New `--hover-tint` token (dark: unchanged; light: dark tint
  instead of white).
- **`--accent` as text on `--card`**: was 3.98:1 (dark). Turned out
  worse on full investigation — dark theme also failed vs `--card-h`
  (3.61:1), and light theme failed on *every* surface (3.36–3.68:1).
  New `--accent-text` token: dark `#6aa5fb` (5.30–7.13:1 across all
  surfaces), light `#1a44c4` (7.19–7.87:1). `--accent` unchanged —
  still used for backgrounds/borders/decorative elements.
- **`a:hover` text color**: was 3.45:1. Now uses `--accent-text` (same
  as resting state) + `text-decoration: underline` for hover feedback,
  rather than a third blue shade for one transition.
- **Light theme `--dim` vs `--card-h`**: was 4.34:1. New value
  `#5c6b82` reaches 4.94:1 there (5.17–5.41:1 elsewhere).
- **Caught a real bug mid-fix**: the first pass replaced
  `color: var(--accent);` via plain string substitution, which also
  matched inside `border-color:`/`background-color:` rules (both end in
  `-color:`, a superstring of the search text) — silently converting 6
  border/decorative-background rules that were never supposed to
  change. Caught by grepping for the corrupted pattern specifically
  before considering the fix done; all 6 reverted to plain `--accent`.
- Verified every ratio mathematically, both new fixes and confirming
  previously-fixed values (button contrast, dark-theme `--dim`) are
  unchanged. Full functional regression sweep across all 10 pages (zero
  JS errors), HTML tag-balance and CSS brace-balance checks on every
  file touched.

All known contrast issues and the light-mode header bug are resolved.
Phase 6 still not started.

## Phase 6 — Image optimization
- All 11 real product photos optimized: EXIF orientation baked into
  pixels first, resized to a 1800px max dimension (the lightbox never
  displays larger than ~1100px), re-encoded at JPEG quality 82,
  metadata stripped. 12.47MB → 4.50MB (63.9% reduction). Checked
  visually for quality after, not just by file size — orientation and
  clarity both confirmed correct on inspection.
- No filenames changed, only file contents, so every existing image
  reference across all pages/data files kept working with zero updates
  needed — confirmed by loading every page that references images and
  checking for JS errors.
- **Found a real privacy issue along the way**: one photo had precise
  GPS coordinates embedded in its EXIF data, accurate enough to
  pinpoint the location it was taken — about to go into a public
  GitHub repo. Removed with the rest of the metadata; confirmed gone
  by direct before/after EXIF inspection (not assumed from the general
  strip operation).

Phase 6's image-optimization item is done. Remaining Phase 6 scope is
general visual polish; Phase 7 (testing) and 8 (handoff) not started.

## Phase 7 — Testing
- Link/asset reference audit across all 10 pages — found `favicon.ico`
  was referenced everywhere but never existed. Created one (accent-blue
  "N" monogram). First attempt only embedded 16×16 due to a Pillow ICO
  API gotcha; caught by checking embedded sizes programmatically, fixed
  properly (16/32/48/64px all present).
- Feature-toggle matrix: phone, facebook, testimonials, events — every
  state tested, no bugs.
- Form failure-path testing (real gap — only success had been tested):
  `notifyBox.js` and `partBoxOrder.js` both correctly error and
  re-enable on network/server failure.
- Video-only PC listing (no images) — tested, correct.
- Alt text audit — clean.
- Heading hierarchy audit — found and fixed 2 real skips:
  `contact.html` (h1→h3, 4 headings promoted to h2) and
  `custom-build.html` (h2→h4, 6 headings promoted to h3). Renamed the
  matching CSS selectors too, so styling didn't silently break.
- ARIA consistency audit (aria-controls, aria-expanded, aria-haspopup/
  labelledby) — clean across all 10 pages.
- SEO re-verification post-image-optimization — OG image and sitemap
  both still correct.
- Full regression sweep (zero JS errors) re-run after every fix.

**Honest scope limit**: this is functional/structural/mathematical
testing throughout — no real browser exists in this environment, so
none of it is visual QA. Nothing has been eyeballed on an actual
mobile/tablet/desktop viewport, and there's been no cross-browser
verification.

## Live-site critique fixes (owner reviewed the deployed beta directly)
- **#1 — Contact form works with zero JavaScript now.** `stitch.py`
  gained a general-purpose build-time token system (`{{SITE_URL}}`,
  `{{CONTACT_EMAIL}}`) that bakes the real FormSubmit destination and
  redirect straight into the static HTML `action`/`_next` attributes.
  Previously both were set only at runtime via JS — if JS failed, the
  form silently did nothing on submit. Verified by parsing the raw
  built HTML with zero JS executed and confirming the values are
  already correct there, not just assumed. Same fix on `services.html`.
- Found and fixed a real bug in the process: both forms had a literal
  `\u2014` text sequence in their static `_subject` field (a JS-style
  escape with no meaning in plain HTML) — replaced with `&mdash;`.
- Removed the now-redundant runtime JS; kept only the thank-you-state
  swap, which degrades gracefully (FormSubmit's own redirect still
  works without it, just without the nicer confirmation message).
- Full regression sweep across all 10 pages — clean.

Remaining from this critique round: #2 (pre-render JS-driven content
into static HTML), #3 (blocked on a real hero photo from the owner),
and the homepage gallery-preview logic change.

## Phase 8 onward — post-launch audit, accessibility/reliability batches, visual redesign (see DECISIONS.md / PROJECT_STATUS.md for full detail)

This changelog fell behind the project's actual pace after Phase 7 —
DECISIONS.md and PROJECT_STATUS.md are the up-to-date, authoritative
record from this point forward; this entry is a pointer, not a full
backfill. Since Phase 7:

- A full owner-requested audit of the finished site (visual, UX,
  accessibility, SEO, performance, architecture, content accuracy,
  cleanliness) — see the audit findings folded into DECISIONS.md
  D16 onward.
- Four verified implementation batches: waitlist/SITE_URL reliability
  fixes (D16–D18), keyboard-accessible galleries + `aria-live` form
  status (D19), lightbox focus management (D20), touch target sizing
  (D21).
- Homepage gallery-preview rebuilt to source directly from `builds.js`
  instead of a separate, already-drifted photo list, with sold-PC
  fallback and video-clip support added to the shared lightbox (D22).
- A design-review phase: three disposable visual-direction prototypes
  built in `design-prototypes/` (not part of the production site) —
  owner chose Prototype 3 ("Forge": dark, amber accent, Bricolage
  Grotesque/Manrope/Space Mono type system) as the redesign direction.
- Redesign Batch 1 (homepage only) implemented and shipped — new
  evidence-based trust section replacing icon cards and numbered
  circles, restructured custom-builds section, asymmetric gallery
  grid, all built from existing real content (D23).
- Redesign Batch 2 (every other customer-facing page) implemented,
  self-tested, and screenshot-checked in a real Chromium instance
  across desktop/tablet/mobile (zero overflow, no regressions found)
  — same evidence pattern and divided-list pattern extended sitewide,
  `homepage-forge.css` renamed to `theme.css` and unscoped globally,
  dead CSS from the removed patterns cleaned up (D24). The owner
  hasn't reviewed it on their own machine/phone yet — see
  PROJECT_STATUS.md's "Redesign implementation plan" for the full
  as-shipped detail.
- Owner review of Batch 2 caught one real bug: `services.html`'s
  "Request a Service" form-card had `max-width:640px` with no
  centering margin, so it sat flush against the left edge of the
  (much wider) container instead of centering under its heading like
  every other constrained-width block on the site. Fixed by adding
  `margin:0 auto` to match the same pattern already used correctly on
  `about.html` and `custom-build.html`. Confirmed via a fresh
  screenshot and re-run of `smoke-test.js`.
- Owner then flagged a second, related-looking but actually different
  centering issue: `part-boxes.html`'s "No Part Boxes Available Right
  Now" empty state. Root cause wasn't a missing margin this time —
  `.part-boxes-layout` is a fixed 2-column grid (content + 300px
  "Your Request" sidebar), and hiding the sidebar via JS when there's
  no inventory didn't collapse that column track, so the content area
  stayed short of the full container width, shifted left. Fixed by
  also collapsing `.part-boxes-layout` to a single column in that
  same JS branch, and gave the shared `.empty-state` class (also used
  by `build.html`'s "System Not Found" state) a `max-width:560px;
  margin:0 auto` — matching the already-established
  `.empty-state-forge` pattern from the homepage — so it reads as an
  intentional centered card instead of a full-width stretch. Both
  empty states improved as a result; re-verified with fresh
  screenshots and a full-site overflow re-check (all 10 pages, still
  zero overflow).
- Built `404.html` (D25) — simple, follows the site design exactly
  (shared header/footer, `theme.css`, the same `.empty-state` card
  pattern used elsewhere), no nav item shows active, has a `noindex`
  tag, and is excluded from `sitemap.xml`. 11 pages now.
- Owner confirmed the last 3 open items in DECISIONS.md: D2 (Services
  page structure), D3 (per-event countdown toggle), and D5 (brand
  colors carried forward from the old site — though D5 is also now
  moot in practice since the Forge redesign already replaced that
  palette). Nothing in `TODO.md`'s "Required" list needs owner
  confirmation anymore — what's left there is blocked on external
  things (a real domain, a hero photo) rather than a decision.
- Owner asked for the compass emoji on `404.html` to be removed —
  emoji rendering varies by OS, and a page meant to feel simple and
  on-brand shouldn't look different on different visitors' devices.
  Replaced with a plain `404` numeral in the site's own mono font at
  accent color (new `.error-code` class in `theme.css`). Other pages'
  `.empty-state` emoji icons are untouched — this was scoped to just
  the page owner flagged.
- Owner then asked for the same treatment sitewide (D26). All 17
  remaining emoji occurrences (monitor, camera, clapperboard, package,
  play-triangle, checkmark — 9 files) replaced: the checkmark became
  the same plain `✓` character already used in tier-card feature
  lists (already proven consistent, not a new pattern), everything
  else became small inline SVG line icons that inherit their
  container's existing size and color, no new CSS needed. Three of
  these sit inside `onerror="..."` attributes, which needed
  `&quot;`-encoded SVG attribute quotes to avoid the browser reading
  the SVG's own quotes as closing the outer attribute early — verified
  with a real-Chromium test that actually triggers those failure
  paths against nonexistent images, not just a syntax check.
- Full-site QA/visual audit (D27) — 10 page types, desktop+mobile,
  axe-core + link crawl + manual review, screenshots-only ZIP
  delivered. Then 7 fixes from that audit (6 requested + 1 found
  during verification): header "Contact" button contrast (2.04:1 →
  9.13:1, was failing sitewide), 5 heading-hierarchy skips retargeted
  to correct levels with visual size preserved, 2 in-text links given
  underlines, invalid `role="status"` removed from 2 forms (kept the
  same aria-live announcement behavior), build.html's "not found"
  state given a real h1, and `.badge-sold`/`.spec-label` contrast in
  sold build cards fixed — the latter two needed real rendered-pixel
  verification to get right, since `.build-card.is-sold`'s existing
  `opacity:0.72` compounds with any text color choice in a way the
  audit's isolated calculation didn't catch. Full detail in D27.
- Owner confirmed the redesign + D27 fixes look fine on their own
  machine — closes that open item.
- `SITE.url` updated to the destination repo the owner will deploy
  to, `https://pcman369.github.io/North-Bridge-PCs` (D28). Not live
  yet — still no custom domain. `stitch.py` re-run: sitemap.xml,
  robots.txt, canonical/OG/Twitter tags, homepage JSON-LD, and every
  form's baked-in `_url` redirect all confirmed updated.
- Phone, email, and Facebook toggled on with placeholder values for
  the owner's visual testing (D28). Added a new `features.email`
  toggle + a `mailto:` footer link in `chrome.js` — no prior config
  existed for visibly displaying an email anywhere on the site.
  Verified via a direct jsdom check of the built homepage: footer
  renders all three links correctly, zero console errors.
  **Placeholders only — need real values (or `show: false`) before
  actual launch.**
- Business email decided (personal Gmail, owner using inbox rules) —
  D29. Phone/Facebook reverted to off with values cleared; the footer
  email display switched from its placeholder to the real address.
- V1 finishing pass, Part 1 (D30): sitewide availability notice added
  to the shared footer partial — "Availability changes regularly — if
  you don't see what you're looking for, or aren't sure what's
  currently available, just send a message." No new CSS, reuses
  `.footer-copy`'s existing styling. Verified with real-Chromium
  screenshots (desktop + mobile) across 7 pages — zero overflow,
  footer reads cleanly at both sizes.
- V1 finishing pass, Part 2 (D31): full forms evaluation across all 5
  customer-facing forms. Contact form gained a required "what's this
  about" field (it was quietly serving both general questions and
  custom-build inquiries with no way to tell them apart). Services
  form gained an "Other / not sure" dropdown option. Build-detail
  inquiry form's fields preserved untouched as asked, but its invalid
  `role="status"` (same bug D27 fixed elsewhere, deliberately skipped
  here at the time) is now fixed too. Part-boxes order form converted
  from JS-only `fetch()` to a real `<form action>` POST — the one
  form still on the old pattern (flagged back in D19) — which let the
  old custom fetch/error-handling JS be deleted rather than patched.
  Waitlist form: evaluated, no issue found, untouched. Verified with
  rebuild + full smoke test + targeted jsdom checks of each changed
  form + real-Chromium screenshots at desktop/mobile.
- V1 finishing pass, Part 3 (D32): services page content/structure
  rework. Each of the 4 service detail cards had 3 near-identical
  "note" blocks (Pricing/Turnaround/Worth Knowing) mostly restating
  the same generic promise the page's general policy paragraph
  already made once below the cards. Trimmed to one "Worth knowing"
  caveat per card; the 2 genuinely distinct details (Upgrades' parts/
  install cost split, Support's "not unlimited support") moved into
  `included`/`notCovered` rather than being lost. Gave the previously
  headerless policy paragraph a proper section header, reusing the
  same pattern already used twice above it on the page, and tightened
  a duplicated sentence inside it. No visual/CSS changes — content
  and structure only. This completes the V1 finishing pass (Parts
  1–3, D30–D32).
- Contact page rebuilt as a situation router (D33), superseding D31's
  "What's This About?" dropdown entirely. 6 options as cards (reusing
  `.service-hub-card` verbatim — zero new CSS): Service/Repair and
  Part Box link straight to their existing dedicated forms
  (services.html, part-boxes.html) instead of duplicating them;
  Buying a Gaming PC, Custom PC, and a shared General Question/
  Other-Not-Sure panel became 3 real, independent `<form>`s, each
  with only its relevant fields and its own FormSubmit subject line.
  Buying panel carries the owner's exact requested explanation text
  (checks current availability, may suggest a custom build instead,
  no availability promises). The shared General/Other panel gets its
  heading, intro line, and two hidden fields relabeled by JS
  depending on which button was clicked, so the inbox still shows
  the distinction from one form. Build-detail inquiry form on
  individual listings untouched. `smoke-test.js` updated (old
  `#contact-form` assertion no longer applies) and passing. Verified
  the true no-JS fallback works — loaded with scripts disabled and
  confirmed all 3 forms are genuinely visible/submittable, not just
  hidden. Found and fixed a dead-padding gap (hiding panels left
  their wrapping section's own padding behind) during the same pass.
  Real-Chromium screenshots at desktop/mobile of the picker and every
  form state.
- Migrated 2 remaining builds from the old live site (D34): a Ryzen 5
  5500/RX 5700 XT desktop and an HP EliteBook 840 G10 laptop, both
  found sitting in a leftover legacy `js/builds.js` (old pre-rebuild
  schema, not the current `js/data/builds.js`) with real photos never
  brought into this project. Added as `aug26-01`/`aug26-02` with their
  11 real photos copied over. Laptop's old performance-section
  disclaimer moved to `notes` per the owner's request, which surfaced
  a real pre-existing bug: `notes` was documented in the schema but
  had zero rendering code anywhere on the site. Fixed by extending
  `buildDetail.js`'s condition/testing card (renamed "Condition &
  Testing" → "Good to Know") to also render it. Verified: rebuild +
  full smoke test pass; confirmed via screenshots that both new
  listings render correctly (5700XT with its performance box,
  EliteBook cleanly without one), the disclaimer now actually
  displays, and builds with no notes/condition/testingNotes still
  correctly show no card at all.
- Scroll progress bar replaced with a page-load progress bar (D35).
  `#scroll-progress` → `#load-progress` throughout. Fills on arrival
  at any page (click, typed URL, back/forward — same fill/fade/reset
  either way), and starts filling immediately on click of a link
  actually navigating to another page on this site, so the wait
  between pages feels bridged rather than dead air — the standard
  illusion every top-loading-bar site uses, since nothing can
  literally persist through a real cross-document navigation. Click
  detection excludes target="_blank", modified clicks, download
  links, mailto:/tel: links, same-page anchors, and external links.
  Same exact visual as before (3px, accent gradient, fixed top) — no
  new CSS design. Back-to-top's own scroll-linked visibility
  untouched. Verified with real-Chromium timing checks (jsdom has no
  real paint loop and gave misleading results during development) and
  individual clicks confirming every exclusion case.
- First real part box inventory added (D36): 3 CPU boxes (Ryzen 5
  5500 x3, Ryzen 5 3600 x2, Ryzen 7 5700X3D x1) and 2 PSU boxes (MSI
  MAG A550BN x4, MAG A650BE x1), with real condition notes and
  category-based pricing ($5 CPU / $3 PSU) given directly by the
  owner. No photos yet by choice — confirmed the existing placeholder-
  icon fallback handles this cleanly. End-to-end order flow
  re-verified with the real data (quantity selection, summary, total,
  hidden form fields all cross-checked). One likely typo in a PSU
  model name ("MG A650BE" → "MAG A650BE") corrected and flagged for
  owner confirmation. This was the last of the three items from the
  owner's post-V1 "all that's left" list (D34/D35/D36).
- Evaluated the "Impeccable" design-critique tool (D37) — owner asked
  about it directly. It's an AI-coding-agent skill built for Claude
  Code's hook system (doesn't apply to this environment) plus a
  separate standalone detector CLI that does — ran the real CLI
  against the actual built site rather than just reading about it (95
  in-scope findings after excluding archived design-prototypes/ and
  pages-src/ source-template duplicates). Verified findings before
  acting: one "broken-image" flag was a false positive (lightbox
  template intentionally starts empty, populated by JS before ever
  shown — confirmed by reading the code). Found and fixed 5 leftover
  hardcoded old-blue box-shadow values in style.css — harmless in
  practice (theme.css already overrides all 5 to the correct amber,
  confirmed via real-Chromium getComputedStyle checks before and
  after) but misleading to read; corrected to match what actually
  renders. Bumped one text-size inconsistency (part-boxes.html's "not
  a payment" disclaimer, 0.72rem → 0.8rem to match the equivalent
  notice on every other form). Spot-checked and confirmed the same
  hardcoded-blue pattern exists in 21 more non-shadow declarations
  sitewide, equally harmless — flagged as an optional future cleanup,
  not fixed mechanically in this pass. Several other real findings
  (a homepage hero pattern, the sitewide card shadow style, em-dash
  density in existing copy) deliberately left as the owner's call
  rather than acted on unilaterally, since they're design/content
  judgment calls, not bugs.
- Fixed all remaining hardcoded-blue instances (D38) — owner asked
  directly after D37's evaluation. Turned out to be 30 total, not 21:
  D37 had only checked style.css; this pass checked every CSS file
  and found 6 more in build-detail.css (5) and part-boxes.css (1).
  Fixed each individually by exact line number (many lines were
  byte-identical to each other, making find-and-replace risky —
  verified each line's existing content matched expectations before
  changing it, all 30 matched cleanly), matching whatever amber value
  theme.css already forces that selector to, including the cases
  where theme.css had deliberately retuned the opacity during the
  original redesign rather than just swapping the color. Found 2
  genuinely unused CSS rules along the way (.highlight-box,
  .step-list-num — confirmed via full-project grep, referenced by
  no current page or script) and fixed their color too rather than
  leaving stray blue in dead code, flagging them as deletion
  candidates for later rather than removing them unprompted.
  Verified: rebuild + full smoke test pass; comprehensive grep
  confirms zero rgba(59,130,246,...)/#3b82f6 literals remain anywhere
  except tokens.css's own base --accent (intentionally blue-by-
  default for theme.css to override); real-Chromium getComputedStyle
  checks across a representative sample of every fixed selector —
  static, :hover, .featured, .open states — all confirm the exact
  amber values expected, zero visual change from before.
- Resolved the remaining Impeccable "owner's call" items (D39), and
  marked aug26-01 (Ryzen 5 5500/RX 5700 XT) sold. Removed the
  homepage's hero eyebrow chip ("Southern Oregon" pill, redundant
  with the H1 right below it, a named "AI SaaS hero" tell) and fully
  cleaned up the dead CSS behind it across style.css and theme.css.
  Found the exact 6 selectors sitewide combining a thin border with a
  soft box-shadow and removed the shadow from 5 of them
  (.hero-image-wrap, .card, .build-card, .tier-card, .form-card) —
  kept it on .nav-dropdown-menu (a floating overlay, shadow does real
  work there) and kept hover-triggered shadow increases (a motivated
  interaction response, not a static default). Rewrote every real
  em-dash in about.html/contact.html/index.html by hand — meta
  descriptions, titles, alt text, body copy, 5 contact-form dropdown
  option values, and 2 JS-generated gallery alt strings — preserving
  exact meaning throughout, varying punctuation naturally instead of
  swapping every dash for the same character. Re-ran the actual
  Impeccable CLI afterward rather than assuming: hero-eyebrow-chip and
  em-dash-overuse both fully resolved; border+shadow finding dropped
  from 15 to 11, confirmed the remaining 11 (one per page) is the
  intentionally-kept nav dropdown. Left the tool's still-flagged
  "dark-glow" finding alone — it's now catching the intentional amber
  glow on buttons/back-to-top/focus rings, part of the already-
  approved Forge identity from D22-24, a bigger design call than
  anything D37 had flagged as open. Verified: rebuild + full smoke
  test pass; real-Chromium screenshots of all 3 rewritten pages at
  desktop and mobile, zero overflow, copy reads naturally.
- Google Analytics added sitewide (D40) — owner provided the gtag.js
  snippet, exactly once per page. Rather than paste it into all 11
  pages-src files by hand, added it the same way header/footer/SEO
  are handled: one new js/partials/analytics.html, one new
  <!--ANALYTICS--> marker in stitch.py, placed as the first line
  inside <head> on all 11 pages (Google's own recommended placement).
  The build now treats 2+ markers on one page as an error (skips that
  page and logs it) rather than silently duplicating the snippet, and
  warns if a future page is missing the marker entirely. Verified in
  the actual built output, not just the build log: the script tag
  appears exactly once per page across all 11; the tracking ID
  appearing twice within that one snippet (script src + gtag config
  call) is correct per Google's own snippet, not a duplicate. Needed
  a real fix to smoke-test.js afterward: jsdom's offline sandbox
  can't reach the external script (expected, harmless in a real
  browser), so the existing known-noise filter was scoped to exclude
  that specific case (external https:// script loads only) — verified
  directly that a local script-path typo would still fail the test as
  it should.
