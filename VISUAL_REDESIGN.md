# VISUAL_REDESIGN.md — North Bridge PCs Visual Reconsideration

A full reconsideration of the site's visual system (color, typography,
component treatment), run as a collaborative, one-decision-at-a-time
process rather than an independent redesign. This is a separate effort
from the original ground-up rebuild — see PROJECT_STATUS.md,
DECISIONS.md, ARCHITECTURE.md, and CHANGELOG.md for that history. Those
files describe the site as it was already shipped; this file describes
an in-progress reconsideration of parts of it, decision by decision.
Nothing in here should be treated as final until it's both approved and
implemented — check each entry's own status.

## How this process works

- One visual decision at a time: 2-3 genuinely different options, each
  shown as a real rendered mockup (actual fonts/colors/measurements,
  not just described), tradeoffs explained, one recommended with
  reasoning — then stop for the owner's choice before implementing.
- The owner may mix options across decisions rather than adopting one
  whole package — e.g. Option A for layout, Option C for color.
- Small details that clearly follow from decisions already approved get
  a recommendation + confirmation ask, not a full 3-option menu.
- Desktop first (finished at A-030: every page walked). Mobile and tablet came
  next, based on the desktop decisions but not a direct copy of them, and are
  finished (A-042); its records are archived (see "Closed mobile and tablet
  pass records (archived)" below).
- Real content is used throughout — real builds, real photos, real
  copy — not lorem ipsum or placeholder data.
- Every approved decision gets implemented immediately (in the real
  project files, verified with smoke-test.js and a real screenshot)
  before moving to the next one — this file is a record of what's
  actually been done, not a proposal backlog.
- Options may be shown as screenshots or, if that works better, as
  published artifacts (owner said so, 2026-10-06). Either way they must
  be rendered from the real page CSS with real content and fonts.
- Building option artifacts: what worked and what bit (A-006 to A-030).
  Capture the REAL rendered markup from the page in a browser rather than
  hand-writing it, and inline the real CSS (drop the Google Fonts `@import` and
  use a `<link>` to it; a published page may load fonts from
  fonts.googleapis.com and scripts from a short list of hosts only). Put photos
  in as `data:` URIs, set once from a single script array rather than per tag
  (16 MB file limit; downscale to about 600px). Make forms inert (no `action`,
  no hidden fields, `onsubmit="return false"`). Never write a literal `<tag>` in
  description text: it becomes real markup (once it nested every option inside
  the header bar). Show every context a shared component appears in (gallery
  page AND homepage preview, FAQ page AND homepage preview), because an artifact
  cannot show everything: a grid parent (the notify card came out 361px wide
  instead of full width), real font loading, or hover and focus (force those
  with a class). In the sandbox, route fonts.googleapis.com to a local
  `@font-face` stylesheet (see START_HERE Tests) and wait for `document.fonts.ready`
  before measuring; late-loading web fonts once changed a `<select>`'s height.
  Always re-measure the REAL page after implementing: the artifact is not the
  product. Put measured numbers in the option descriptions, and say plainly when
  a first-draft claim turned out wrong. Publish with the recommended option
  tagged; a live artifact with a little JavaScript is fine.

## Reference directions explored — NOT fixed themes

These came up earlier in the process as exploratory comparisons. None
of them are approved as a complete package — the owner was explicit
that every visual property is being decided individually, and these
names may still come up as shorthand for a particular look, but no
page should be redesigned wholesale to match one of them.

- Rejected outright as literal accent-color swaps: **Copper**
  (`#D47A3F` / `#A95128`), **Terracotta** (`#D65F45` / `#A94131`) — do
  not suggest either again.
- 3 cohesive header+hero directions explored: **Machined Brass** (muted
  warm brass/bronze), **Signal Teal** (cool patina teal), **Quiet
  Signal** (near-monochrome, one sparing spot accent). Quiet Signal was
  called the strongest conceptual foundation (restraint as the
  organizing idea), which is why later exploration leaned on it, but it
  was never approved as a literal package either.
- 3 accent variations explored within the Quiet Signal concept:
  **Oxide**, **Verdigris**, **Cask**. The exact hex values recalled
  from that earlier session (`#8C4A3A` rust-red, `#3E6B5C` patina
  green, `#6B3E52` wine/aubergine) were checked for contrast in this
  session — all three fall below 3:1 against the card background, too
  dark to work as the left-edge accent border decisions 7/8 rely on,
  and all three would need white button text instead of amber's dark
  text (see decision 14 for the full readout). Owner opted to try
  adjusted values picked from the same descriptions instead: **Oxide**
  `#ad4a2a` (white button text; edge contrast passes but thin, 3.23:1),
  **Verdigris** `#4c9a82` (dark button text, same pattern as amber;
  passes cleanly everywhere), **Cask** `#8b3f5e` (white button text;
  edge contrast still fails at 2.53:1 — would need a lighter
  edge-specific tint if chosen). These adjusted values are the active
  candidates for decision 14.
- Signal Teal, Verdigris, and Cask were then rendered across a build
  card and a full build-detail page as reference comparisons. Accent
  color itself is still an open, unmade decision — see the "still to
  decide" list below.

## Scope notes

- **services.html was removed (LOG.md B-003).** Nothing to redesign there.
  The contact page's situation picker has 5 options (ruled rows since
  A-009; see "Contact page" below).
- **build-detail page is complete** (all 15 decisions made) and **home
  page is complete** (all 9 decisions made) — see below for both.
  **custom-build page is complete** (see below) apart from deferred
  items (tier-card rule alignment at tablet widths; the final CTA box's
  kicker label waits for the copy pass) and the two sitewide scan
  findings (`gpt-thin-border-wide-shadow`, `layout-transition`).
  **contact page is complete** (see below): situation picker, form
  panel width/placement, shared form fields and the success states are
  done; only the hero copy waits for the copy pass. **part-boxes.html is
  complete** (portrait photo cards, quantity picker and order confirmation
  done, see below; the order summary panel was already ruled rows with the
  approved field styles and needed nothing; copy items are in
  COPY_REVIEW.md). **about.html is complete** (the story section is
  done, see below). **gallery.html is complete** (photo tile shape, sub-heading
  alignment, homepage preview and the empty "Current Builds" section are
  done, see below; its mobile items were handled in the mobile pass, now
  archived). **faq.html is complete** (the accordion, see below).
  **Every page has now been walked at desktop width (A-030).** The mobile and
  tablet redesign is finished (A-042; see "Closed mobile and tablet pass records"); what remains
  is Lane B's copy pass.
- **Build system, found while starting the hero decision — read this
  before editing any page's HTML content:** this site has a source/
  output split. `pages-src/<page>.html` is the real source (with
  placeholder markers like `<!--SEO-->`, `<!--ANALYTICS-->` and a
  shared header/footer not yet inlined); `build-tools/stitch.py`
  assembles those into the actual `<page>.html` files at the repo
  root, which is what ships. Confirmed by diffing `index.html` against
  `pages-src/index.html`: identical body content, different only in
  the stitched `<head>`/header/footer. **Content edits belong in
  `pages-src/`, then run `python3 build-tools/stitch.py` to regenerate
  the root file — editing the root HTML directly works until the next
  stitch run silently discards it.** This wasn't relevant for the
  build-detail page's decisions (all CSS-only, no markup changed), but
  the hero decision below and most of the rest of the home page list
  involve real markup changes, so this matters from here on.

## Sitewide decisions (not scoped to one page)

### 9. Button treatment — DONE (applies everywhere, not just build-detail)
Flagged before implementing: unlike the badge, buttons render
identically on every page (hero, nav, forms, footer), so this was
decided as a sitewide change rather than page-scoped — owner didn't
object, proceeded on that basis.

Two changes, applied to every solid-fill accent control
(`.btn-primary`, `.back-to-top`, `.nav-cta` including its `.active`
state):
1. Flat neutral shadow (`var(--shadow)` / `var(--shadow-lg)`) instead
   of a colored glow — same depth language the cards already use.
2. Hover (and `.nav-cta.active`, which used the same mechanism despite
   not being a hover) now brightens the existing fill
   (`filter: brightness(1.12)`) instead of swapping to a second,
   darker fill color.

**Why change 2 matters beyond style:** the old swap-to-a-second-color
hover is exactly what caused the text-contrast failures found while
testing Copper and Terracotta earlier in this process — dark text can
pass WCAG on one shade of an accent and fail on a darker shade of the
same accent, depending on the specific hue (see those two rejected
tests). Brightening the same color instead of introducing a second one
sidesteps that structurally, for whatever accent color eventually gets
picked.

**Implemented:**
- `css/style.css` — `.btn-primary`, `.btn-primary:hover`,
  `.back-to-top`, `.back-to-top:hover`, `.nav-cta:hover`,
  `.nav-cta.active`.
- `css/theme.css` — removed the now-redundant box-shadow override
  block (style.css uses neutral tokens now, so there's nothing
  theme-specific left to override); simplified the dark-text contrast
  comment since there's no longer a second, separately-verified darker
  background state to swap to.

**Found along the way, not something being looked for:** hovering
`.nav-cta` showed a text underline that had nothing to do with this
decision — a global `a:hover { text-decoration: underline; }` rule
(`css/style.css` ~line 50) was leaking through because `.nav-cta`
never explicitly reset `text-decoration` the way `.nav-link` already
did. Same root cause turned out to affect the shared `.btn` base class
too (used by every button sitewide — primary, secondary, ghost, in
every size), not just `.nav-cta`. Both fixed with
`text-decoration: none !important` — `!important` is required in both
cases because `a:hover` (element + pseudo-class) outranks a plain
class selector on specificity, so a non-important override loses even
though it comes later in the file. Verified against `.btn-primary`,
`.btn-secondary`, and `.nav-cta` hover states directly with real
screenshots after the fix.

## Open design findings (Impeccable scan)

Still open as of B-032. The resolved findings (`side-tab`, `low-contrast`) are in the archive.

**Re-scan, A-038 (`npx impeccable detect .` on a scratch copy of the built site, without `pages-src/` and `docs-archive/`,
which make it read unresolved stylesheets; it needs the npm registry).** Before the fixes: 11 findings. Neither
`gpt-thin-border-wide-shadow` nor `layout-transition` was reported, so both are treated as not flagged now (the code
for the mobile nav submenu `max-height` and the progress-bar `width` is unchanged and unscanned-for; the owner can still
call them). Found and fixed: `low-contrast` 2.5:1 on all 10 pages, from two inline colours using raw `--accent`
(`#8b3f5e`) as text: the footer wordmark "PCs" (`js/partials/footer.html`, now the same `.brand-name span` rule as the
header, `--accent-text`, 5.05:1) and the "custom builds" link in the no-builds notice (`js/render/notifyBox.js`, now
`--accent-text`). After: 1 finding + 8 advisories, both open and listed below. A live-browser pinpoint found no other
text using raw `--accent`.
- **Advisory, resolved in A-039 (M5):** `low-contrast` 4.2:1 (need 4.5:1), `--accent-text` `#ae798e` on the accent tint
  (active nav link, "For Sale" trigger and caret, active dropdown link, `.faq-icon`, `.box-category` chip). Fixed with
  `--accent-text-tint`; the detector now reports 0 advisories.
- **`broken-image`, resolved in A-040 (false positive):** `js/render/galleryGrid.js` built the lightbox's `<img
  class="lightbox-img" alt="">` inside a markup string with no `src`. Checked in a live browser: the lightbox is not in
  the DOM until the first photo is opened, is `display: none` until a `src` is set, and the photo loads (1 / 22, next,
  Escape, focus return all work). The `<img>` is now created with `document.createElement` in the same place in the DOM;
  behaviour is identical and the detector no longer reports it.
- **`--accent-h`, removed in A-040:** it was `#8b3f5e`, equal to `--accent` under Cask. Definitions removed from
  `css/theme.css` and `css/tokens.css`; its 7 uses (`base.css`, `style.css` x5, `part-boxes.css`) now read
  `var(--accent)`. `--accent-h2` (the separate darker hover shade) is untouched. 30 screenshots (10 pages x 390/768/1440px)
  are pixel-identical before and after, ignoring the animated 4px top progress bar (it differs between two runs of the
  same unchanged build). Hover states are not covered by those shots; the values are identical.

### Impeccable scan — new findings (historical; resolved, see the A-038 re-scan above)
Running the detector (owner-permitted, not required, to use again in
future sessions) against the actual built site (all pages + `css/`,
not `pages-src/`, so stylesheets actually resolved) surfaced real
findings beyond the gradient question it was asked about. Two quick,
unambiguous ones fixed immediately (format: dead CSS/undersized text,
not a design call):
- **`.brand-tagline` was 9.92px** (`0.62rem`), under the ~11px
  legibility floor for functional text. Bumped to `0.7rem`, matching
  `.brand-sub`; relies on `--dim` vs `--muted` to keep some
  size-independent hierarchy between the two lines. `css/style.css`.

### `gpt-thin-border-wide-shadow` — PARTIALLY ADDRESSED, not confirmed resolved
**Status (A-038): the detector no longer reports it at all (re-scan above); nothing was changed for it after this note, so the dropdown shadow is as described below. The text below is the historical record.**

A 1px hairline border paired with a wide/diffuse shadow
(`var(--shadow-lg)`, 25px blur) on hover — Impeccable's own description
calls this "a recurring generated-UI signature." Confirmed by code
audit (not just the detector) that exactly three components had both a
resting hairline border and this exact hover shadow: `.build-card`,
`.tier-card`, `.gallery-item`. Other `--shadow-lg` uses
(`.btn-primary`, `.back-to-top`, the gallery lightbox) don't have a
matching border, so they don't fit the pattern; `.nav-dropdown-menu`
does have both, but it's a static always-shown popover shadow, not a
hover effect, and a floating menu panel conventionally earns an
elevation shadow in a way a grid-card hover-glow doesn't — left that
one alone deliberately, not yet discussed with the owner.

Tried to verify alternatives against the real detector the same way
side-tab was verified, and it didn't work this time: isolated mockups
of the exact current (known-flagged) recipe came back clean even with
a realistic 3-card grid and real images, suggesting this rule
(its name literally contains "gpt") may be judged more holistically
against a full real page than as an isolated, deterministic CSS-pattern
match the way `side-tab` was. Implemented anyway on reasoning alone:
removed `box-shadow: var(--shadow-lg)` from all three hover rules,
kept the border-color shift and lift/scale, cleaned up each one's now-
unnecessary `box-shadow` transition component. `css/style.css`.
Verified safe with `smoke-test.js` (all checks pass).

**Re-scanning the real built site afterward still shows 9 instances,
unchanged from before the fix**, all the identical snippet text
("1px border + 25px shadow blur") across all 9 pages — consistent
with this now being entirely the `.nav-dropdown-menu` popover (present
on every page via the shared header partial), but **not confirmed**
with a live-browser pinpoint check the way the low-contrast bug was.
Don't take this as "resolved" — the card-hover shadows are gone and
verified safe, but whether that was the only thing the detector was
actually flagging is unconfirmed. Next session: either confirm the
dropdown is the remaining source and decide whether to touch it too,
or investigate further if it turns out to be something else.

**Update (A-038):** superseded. The re-scan reports no thin-border finding, so the question above is closed.

### `layout-transition` — FAQ accordion DONE (A-030); two places remain
**Update (A-030):** the FAQ accordion item below is done: it now reveals with
`grid-template-rows: 0fr -> 1fr` instead of animating `max-height` to 600px
(see "FAQ page"). The mobile nav submenu and the page-load progress bar are
still not started. The design scanner has not been re-run, so whether it
still flags a grid-rows transition is unknown. Original notes follow.

**Update (A-038):** the scanner was re-run and no longer reports `layout-transition`. The mobile nav submenu and the
progress bar are unchanged and nothing was started on them; the owner can still ask for either.

`transition: width` (page-load progress bar) and `transition:
max-height` (mobile nav submenu, FAQ accordion) can cause layout
thrash; investigated but didn't implement anything. Findings so far,
picked back up from here:
- Mobile nav submenu (`css/style.css`, `.mobile-nav-submenu`, ~line
  487): converting to the `grid-template-rows: 0fr → 1fr` technique
  would need a markup change first — `js/partials/header.html`'s
  `#forsale-mobile-menu` has three `<a>` tags as direct children, and
  that technique needs them wrapped in a single inner div for the row
  to clip correctly.
- FAQ accordion (`css/style.css`, `.faq-answer`, ~line 1291): same
  technique, but no markup change needed — `js/render/faqList.js`
  already wraps the answer content in `.faq-answer-inner`, so the grid
  trick can apply directly to the existing structure. Current approach
  uses a hardcoded `max-height: 600px` guess, which also risks clipping
  any future answer longer than that.
- Page-load progress bar (`css/style.css`, ~line 1765,
  `transition: width`): not yet looked at.
No code touched for any of these three — current behavior is exactly
as it was before this session.

## Closed desktop-pass records (archived)

The page-by-page decision records of the desktop redesign (build-detail, home, custom-build, contact, part-boxes,
about, gallery, faq) were moved verbatim to `docs-archive/VISUAL_REDESIGN-desktop-pass.md` in B-032. Code comments
that cite "home decision 7" or "build-detail decision 14" point there. Grep it; do not read it in full. Index:

**Build-detail page**
- 1. Overall layout — DONE
- 2. Main photo treatment — DONE
- 3. Title sizing/hierarchy — DONE, no change
- 4. Price presentation — DONE
- 5. Availability badge — DONE
- 6. Specifications layout — DONE, no change
- 7. Performance section — DONE
- 8. Inquiry form — DONE
- 10. Borders (general, sitewide within this page) — DONE, no change
- 11. Backgrounds (general) — DONE, no change
- 12. Spacing — DONE, no change
- 13. Typography — DONE, Option B implemented
- 14. Accent color — DONE, Cask implemented (sitewide)
- 15. Hover/focus states — DONE, no change
**Home page**
- 1. Hero — APPROVED, IMPLEMENTED
- 2. Section-header pattern — APPROVED, IMPLEMENTED
- 3. Available Systems (build card grid) — APPROVED, IMPLEMENTED
- 4. Evidence section (checklist rows, numbered marks) — DONE, no change
- 5. Custom Builds section (two-col layout, budget table) — DONE, no change
- 6. Gallery preview section — DONE, no change
- 7. FAQ preview section — DONE, no change
- 8. Contact CTA section — DONE, no change
- 9. Section rhythm/spacing — DONE, no change
**Custom-build page**
- Section-header pattern rollout — mechanical, not a fresh decision
- Open items — RESOLVED
- `side-tab` — RESOLVED
- `low-contrast` — RESOLVED
- Tier-card feature lists — APPROVED (Option B), IMPLEMENTED
- Process section left column — APPROVED (Option A), IMPLEMENTED
- "Not Sure" section layout — APPROVED (Option A), IMPLEMENTED
**Contact page**
- Situation picker — APPROVED (Option B), IMPLEMENTED, class renamed
- Form panel width and placement — APPROVED (Option A), IMPLEMENTED
- Privacy-note margin fix extended to the root rule — APPROVED, IMPLEMENTED
- Form fields — resting boundary and focus — APPROVED (Option A), IMPLEMENTED
- Success states — APPROVED (Option B), IMPLEMENTED
**Part-boxes page**
- Portrait photo cards — APPROVED (Option B), IMPLEMENTED
- Light mode — none; `--success` pinned
- Quantity picker and order confirmation — APPROVED, IMPLEMENTED
**About page**
- Story section layout — APPROVED (Option A), IMPLEMENTED
**Gallery page**
- Photo tile shape — APPROVED (Option B), IMPLEMENTED
- Homepage preview: 5 photos on desktop — APPROVED, IMPLEMENTED
- Empty "Current Builds" — APPROVED (Option A), IMPLEMENTED
**FAQ page**
- Accordion — APPROVED (Option B), IMPLEMENTED

## Closed mobile and tablet pass records (archived)

The mobile and tablet redesign (owner request 2026-10-13, finished A-042) was moved verbatim to
`docs-archive/VISUAL_REDESIGN-mobile-pass.md` in A-045: the mobile walk findings, decisions M1-M6 and the 8-item
backlog. Code comments that cite "Visual Redesign M1" to "M5" point there. Grep it; do not read it in full. Index:

**Decisions**
- M1. Phone gallery grid, Option C: 2 columns, first photo full width (A-033)
- M2. Contact picker buttons on phones, Option B: one equal width (A-034)
- M3. Tier cards at tablet widths, Option A: subgrid rows (A-035)
- M4. Part-box cards on small phones, Option B: two-row card, full-width footer (A-036)
- M5. Accent text on the accent tint, Option C: `--accent-text-tint` (A-039)
- M6. Available and Sold badges, Option C: one outlined pill everywhere (A-043; lives under "Mobile walk findings")
**Backlog (all 8 items done)**
- 1-3. Phone gallery grid, 420px split, homepage preview (M1); 4. tier-card rules (M3); 5. contact picker buttons (M2)
- 6. Part-box price and quantity row at 320-360px (M4); 7. gallery with few photos (noted, not rendered); 8. `visual-check.py` widths (A-037)
**Mobile walk findings** (owner: iPhone 8 Safari, iPad, MacBook; Android untested)
- 1. Form focus left the page scrolling sideways on iOS Safari: fields under 16px; fixed A-041, confirmed by the owner
- M6 (the badges), recorded there as an open decision and then closed in A-043

## Outstanding, not scoped to one page

(none — see "Sitewide image-opacity fix, extended" below.)

- (The part-box photo framing item listed here was implemented in A-021; its original text is in
  `docs-archive/VISUAL_REDESIGN-desktop-pass.md`.)

## Sitewide image-opacity fix, extended

The `onload`/`.loaded`-gated opacity bug found and fixed on
`buildCard.js` during home page decision 3 turned out to exist
identically in three more places. Owner asked for all three to get the
same fix. Not a design decision — a correctness fix, included here
because it was found during the visual redesign process and touches
the same components.

**Fixed:**
- `js/render/partBoxCard.js` + `css/part-boxes.css` (`.box-image img`)
  — part-boxes.html's box photos. No real photos exist in the current
  dataset (`js/data/partBoxes.js` — every entry has an empty
  `images: []`) so this couldn't be visually verified against a real
  image, but the change is mechanically identical to the other three
  and confirmed correct by inspection (attribute removed, no opacity
  gate left in the CSS).
- `js/render/galleryGrid.js` + `css/style.css` (`.gallery-item img`)
  — gallery.html's grids. **Found along the way:** `css/style.css` had
  two separate `.gallery-item img` blocks — one already clean (no
  opacity gating, ~line 1151), and a second, later one (~line 1711)
  that carried the `opacity: 0`/`.loaded` bug. Because the file
  cascades in source order and both are equal specificity, the later
  block was silently winning for `opacity` even though a correct
  definition already existed earlier in the same file. Removed the
  second block outright rather than just de-gating it, since the first
  already covers everything it did, hover-zoom transition included.
- `js/render/buildDetail.js` + `css/build-detail.css`
  (`.gallery-main-img`, both the `<img>` and `<video>` cases) —
  build.html's **main product photo/video**, the single most
  consequential instance of this bug on the site. Also removed the
  now-unnecessary `video.gallery-main-img.active { opacity: 1; }`
  override and its comment, since every case defaults to visible now
  and there's nothing left for that rule to correct for.

Verified with `smoke-test.js` (all checks pass) and real-browser
screenshots of gallery.html and build.html — both fixed components
confirmed at `opacity: 1` with no `.loaded` class and no
`onload`/`onloadeddata` attribute present at all.

## Built pieces that constrain new work
Moved verbatim from START_HERE.md in B-084 (to keep START_HERE under its budget). Read before visual changes.

  - Forms: field border `--border-field`; focus one solid 2px accent edge (A-012). Four forms share one `.success-state` card (A-013, A-023).
  - Accent text on the accent tint (active nav, FAQ icon, part-box chip): `--accent-text-tint` (A-039).
  - Status badges (Available/Sold): one outlined pill, no `.badge-quiet` (A-043).
  - Form fields are 16px on touch screens (`pointer: coarse`) so iOS Safari does not zoom (A-041).
  - Contact picker: `.situation-picker` / `.situation-option` in `css/situation-picker.css` (A-009); buttons 200px wide (A-034).
  - FAQ: ruled rows, buttons in the h2s, `grid-template-rows` reveal (A-030).
  - Gallery: tiles 3:4 `object-fit: contain` (A-027); home preview 5 photos, 3 below 700px (A-028); "Available Now" hidden
    until `currentBuilds` in `js/data/gallery.js` has a photo (A-029); 2 columns below 700px (A-033).
  - Part-boxes: 12 boxes, one portrait photo each; horizontal cards, two per row from 780px (A-021), two-row card at 389px (A-036).
