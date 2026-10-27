> **ARCHIVED 2026-10-13 (B-032). Frozen history, do not edit.** Closed desktop-pass decision records moved verbatim out of
> VISUAL_REDESIGN.md. Live process, scope, open findings and the mobile backlog stay in VISUAL_REDESIGN.md. Grep this file.

## Build-detail page — decisions made so far

### 1. Overall layout — DONE
Asymmetric split instead of an even `1fr/1fr` — content column wider
than the photo (`0.8fr`/`1fr`), thin vertical divider between columns
instead of a bare gap, photo stays sticky.
**Implemented:** `css/build-detail.css` (`.listing-layout`,
`.listing-gallery`, `.listing-details`, and the 900px breakpoint reset
so the divider/padding don't leak into the not-yet-redesigned mobile
layout).

### 2. Main photo treatment — DONE
Real product photos are shot portrait (checked the actual files: all
1350×1800, a 3:4 ratio) — the old forced 1:1 crop was cutting real
content off every listing. Taller 3:4 crop, same 18px rounded corners
as the rest of the site.
**Implemented:** `css/build-detail.css` (`.gallery-main`).
**Owner note:** photos will continue to be taken portrait going
forward — design around that assumption elsewhere too (e.g. the
homepage build cards and the gallery page, not yet revisited).

### 3. Title sizing/hierarchy — DONE, no change
Kept as-is (1.6rem, weight 800, no kicker label) — already using the
correct heading font (`<h1>`, inherits Bricolage Grotesque), already
appropriately bold, doesn't compete with the price row below it. No
real problem identified worth fixing.

### 4. Price presentation — DONE
Freed from the bordered-card treatment it previously shared with the
specs and performance cards, despite being the single number that
actually drives the buying decision. Larger (3rem), standalone;
pickup location dropped to a small caption underneath instead of
sitting beside it.
**Implemented:** `css/build-detail.css` (`.listing-price-row`,
`.listing-price`, new `.listing-pickup-note`), `js/render/buildDetail.js`
(price/pickup markup restructured).

### 5. Availability badge — DONE
Quiet treatment — small square dot + text, no pill background/border.
**Implemented:** `css/style.css` (new `.badge-quiet` modifier, added
alongside the existing `.badge`/`.badge-available`/`.badge-sold` rules
rather than changing them, so it can be opted into per-page).
`js/render/buildDetail.js` (both badge instances — the header badge and
the sold-notice badge — now include `badge-quiet`).
**Important scoping note:** the homepage/listing-card badges rendered
by `js/render/buildCard.js` deliberately do NOT have this class and
still use the original filled-pill look — verified with a real
screenshot. Don't add `.badge-quiet` there without a separate decision
for that component.

### 6. Specifications layout — DONE, no change
Kept as-is (card container, divider line per row). Reasoning recorded
here since it goes against the pattern of the last two decisions:
specs are genuinely tabular, related data, and a bounding card does
real grouping work for that — this isn't the same situation price and
the badge were in, so the same "remove the box" instinct doesn't
automatically apply. No problem identified worth fixing.

### 7. Performance section — DONE
Background/border now match the specs card exactly (neutral) instead
of the old full amber tint. A thin left-edge rule in `var(--accent)`
carries the "this section is called out" signal instead of a full
color wash — performance/fps data is genuinely more persuasive/
important than a plain spec row, so *some* distinction is earned, just
not as heavy as before.
**Implemented:** `css/build-detail.css` (`.listing-perf-card`).
**Technical note:** the old version used hardcoded
`rgba(242,167,27,...)` values rather than tokens, so it would not have
followed a future accent-color change automatically either way. The
new left-edge rule uses `var(--accent)`, so it will.

### 8. Inquiry form — DONE
Form card border goes neutral, with the same left-edge accent rule
used on the performance card — reusing one consistent "pay attention
here" device rather than each region inventing its own. Bundled into
the same decision: the "Asking about" confirmation badge inside the
form is now fully neutral, matching the background/border of the
form-input fields directly below it, so it reads as part of the same
quiet form surface instead of its own highlighted chip.
**Implemented:** `css/build-detail.css` (`.listing-form-card`,
`.listing-system-badge`).
**Scoping note:** the actual input fields/labels/focus-ring/privacy
text (`.form-input`, `.form-label`, `.form-privacy` in `css/style.css`)
are shared with the contact page and were deliberately left untouched
— that's a separate future decision, not part of this one.
**Found along the way:** the EliteBook's "Good To Know" condition/notes
card (`conditionHtml` in `js/render/buildDetail.js`) reuses
`.listing-specs-card` directly, so it was already covered by decision
6 (kept as-is) with no extra work needed.

### 10. Borders (general, sitewide within this page) — DONE, no change
Compared three real-rendered options for the base card border used by
the specs/performance/form cards: **A** current 1px `var(--border)`
hairline (unchanged); **B** fully borderless, separation from
background fill + shadow alone; **C** the current hairline plus a
faint inset top highlight for a little more tactile depth. Approved
**Option A** — kept as-is. Reasoning: Option B would have quietly
undercut decision 6's own already-recorded logic that the specs
card's tabular data genuinely earns a bounding edge; rather than
re-litigate that silently, flagged the tension and the owner chose to
keep the edge. Option C was judged too marginal to be worth the extra
rule for what it adds.
**Implemented:** no code change — `css/build-detail.css`'s existing
`.listing-specs-card`, `.listing-perf-card`, `.listing-form-card`, and
`.listing-system-badge` border rules already match.

### 11. Backgrounds (general) — DONE, no change
Compared three real-rendered fill options, holding decision 10's
border constant: **A** current flat solid `var(--card)` fill
(unchanged); **B** a subtle top-lit gradient (`--card-lift` to
`--card`) for a touch of bevelled-panel depth; **C** no distinct card
fill at all — same tone as the page, border alone defining the box.
Approved **Option A** — kept as-is. Reasoning: B would introduce the
first gradient anywhere in the card system for a genuinely marginal
gain; C is defensible but has sitewide implications (photos,
thumbnails, and badges all assume a card tone distinct from the page)
that go beyond this one page-scoped decision, so it wasn't worth
opening here.
**Implemented:** no code change — `css/build-detail.css`'s existing
`background: var(--card)` on `.listing-specs-card`, `.listing-perf-card`,
and `.listing-form-card` already matches.

### 12. Spacing — DONE, no change
Compared three real-rendered rhythms, holding decisions 10 & 11
(Option A) constant: **A** current 1.5rem section gap / 1.25rem card
padding; **B** tighter, 1rem / 0.9rem, denser spec-sheet feel; **C**
airier, 2rem / 1.5rem, more breathing room. Approved **Option A** —
kept as-is. Reasoning: the existing rhythm already does intentional
work — card padding steps up specifically on the form card (1.5rem vs
1.25rem) to signal it's the one action to take, and B would flatten
that contrast while C would add dead space on a page whose job is
fast comprehension toward a purchase decision.
**Implemented:** no code change — `css/build-detail.css`'s existing
`.listing-details` gap and card padding values already match.

### 13. Typography — DONE, Option B implemented
Compared three real-rendered approaches, holding decisions 10–12
constant: **A** current, Manrope everywhere except the Bricolage
Grotesque `<h1>` title, no mono anywhere on this page; **B** mono
touch — price and spec/performance values switch to Space Mono
(already used sitewide for technical content — budget tables,
evidence rows), labels and title unchanged; **C** full mono technical
block — specs/performance card entirely mono, labels included, price
too. Approved **Option B**. Reasoning: extends a device the site
already has in its vocabulary to content that's genuinely technical
(CPU model, RAM speed, fps) without touching the parts of the page
doing attention-hierarchy work (labels, title, price weight). C was
judged a bigger shift worth revisiting later against more builds,
since Space Mono's max weight (700, vs the current 900) would soften
the price specifically.
**Implemented** in `css/build-detail.css`:
- `.listing-price` — added `font-family: var(--font-mono)`, weight
  900 → 700 (Space Mono's heaviest available)
- `.listing-spec-value` — added `font-family: var(--font-mono)`,
  weight 500 → 400
- `.listing-perf-item` — added `font-family: var(--font-mono)`
Space Mono 400/700 already loaded sitewide via `theme.css`'s
`@import`, so no new font request. `smoke-test.js` is DOM/structural
only (jsdom not installed this session) — not relevant to a
font-family-only change, so not run.

### 14. Accent color — DONE, Cask implemented (sitewide)
This decision is sitewide, not page-scoped, same as decision 9 —
`--accent` and its family live in `theme.css`'s `:root`, loaded on
every page.

Compared amber (current) against the three Quiet Signal variations
using real WCAG-checked values (the exact hex recalled from the
earlier session — Oxide `#8C4A3A`, Verdigris `#3E6B5C`, Cask
`#6B3E52` — all failed the 3:1 non-text minimum against `--card` and
needed white button text instead of amber's dark text; adjusted
working values were used for the actual comparison and decision).
**Approved: Cask, `#8b3f5e`, with white button text.** Chosen over
Oxide/Verdigris specifically because it's the only one of the three
with no hue overlap with the site's existing semantic colors
(`--danger` red for sold, `--success` green for available) — Oxide
sits close to danger's red family, Verdigris close to success's
green family. Distinctiveness against competitor PC-shop branding
(red/blue/green is near-universal in the category) was the secondary
reason.

**Full token family** (`theme.css` `:root`):
- `--accent` / `--accent-h`: `#8b3f5e` (Cask's base — kept equal, same
  pattern as amber; no separate darker shade needed since white text
  already clears 7.07:1 on the base value)
- `--accent-text`: `#ae798e` (30% lighten, ~5:1 against `--card`) —
  see note below on why this token now carries more weight than it
  did under amber
- `--accent-2`: `#cba9b7` (gradient-endpoint tint, `.load-progress`)
- `--accent-h2`: `#763650` (still unused/dead code, kept in sync for
  whenever it might be)

**The scope turned out to be much bigger than "one edge needs a
lighter tint."** Amber's base value happened to be light enough
(8.8–10.7:1) to work as *both* a solid fill (with dark text) *and* as
thin foreground content — borders, outlines, small text/icons —
directly. Cask's base value only reaches 2.1–2.9:1 against
`--card`/`--bg`, which is fine for a solid button fill with white
text but fails everywhere it was being used as a border, outline, or
small piece of text. A full sitewide sweep of every direct
`var(--accent)` usage turned up ~20 spots relying on that assumption:
- **Fixed to `var(--accent-text)`:** the global `:focus-visible`
  outline (`base.css` + its `theme.css` override — both needed
  fixing, or the second would have silently undone the first),
  `.gallery-thumb.active` border, the perf/form card left-edge
  borders (the fix promised earlier in this decision),
  `.accent-line`, `.gallery-item:hover` border, `.form-input:focus`
  border, `.btn-ghost` hover border, `.evidence-lead .accent`,
  `.evidence-row .mark`, `.cb-row .cb-num`,
  `.budget-table td:first-child`, `.faq-icon`, `.error-code`.
- **Hardcoded amber `rgba(242,167,27,…)` literals** (never tokens,
  so they wouldn't have moved regardless): ~20 instances across
  `style.css`, `theme.css`, and `part-boxes.css` — nav active-states,
  `.page-hero` gradient, `.build-perf`, `.tier-badge`/`.tier-card`,
  `.faq-item`/`.faq-icon`, `.form-privacy`, `.box-category`, plus two
  in `style.css` shadowed by `theme.css` overrides but kept in sync.
  Border-ish ones → `rgba(174,121,142,…)` (accent-text's RGB, same
  alpha); background-wash ones → `rgba(139,63,94,…)` (accent's RGB,
  same alpha).
- **Button/nav text flipped dark → white:** `.btn-primary`,
  `.back-to-top`, `.nav-cta`, `.skip-link` (`theme.css`).

**A real pre-existing bug found during the sweep, unrelated to this
decision but only surfaced by it:** `theme.css` had a leftover
override block — `.listing-perf-card`, `.listing-system-badge`,
`.listing-form-card` — hardcoding the *pre*-decision-7/8 full-amber
treatment. Because `theme.css` loads after `build-detail.css`, it was
silently winning the cascade on every property both files set,
meaning decisions 7 and 8 (both marked "DONE, Implemented" in this
log from an earlier session) likely never actually rendered as
approved — the page was probably still showing the old boxed amber
treatment the whole time. Removed the stale block entirely; the
correct rules already existed in `build-detail.css`.

**Side effect, no action needed:** `.faq-item.open .faq-icon` and
`#event-banner` both hardcode `color: white` directly in `style.css`
on top of `var(--accent-h)`, with no per-theme text-color override —
under amber this was a live, unfixed contrast failure (2.04:1).
Cask's white-on-base is 7.07:1, so both are now correct without any
change.

**Verified** with a from-scratch render using the real, final values
(not the earlier approximated mockups) against actual markup from
`buildDetail.js` — confirms the left-edge, system badge, and privacy
box all render correctly for the first time.

### 15. Hover/focus states — DONE, no change
Compared two real, live (not static) options for the two elements
with a genuine open question — thumbnail hover and the back link —
holding everything else constant: **A** current, opacity-only
thumbnail hover with the accent border reserved for the actively
selected thumbnail, back link brightens to plain white; **B**
accent-touched, a faint accent ring previews on thumbnail hover and
the back link picks up the wine tint on hover (matching the
ghost-button pattern). Approved **Option A** — kept as-is. Reasoning:
opacity (hover) and the accent border (active/selected) are currently
two cleanly distinct signals; introducing a faint accent ring on
hover would blur that distinction, especially scanning across several
thumbnails quickly, and competes with the one border that actually
needs to stand out. Consistent with the restraint principle carried
through decisions 10-12: accent stays tied to something meaningful
(selection, primary action), not sprinkled into every hover.
Keyboard focus is already covered by decision 14's global outline fix.
**Implemented:** no code change — `.gallery-thumb:hover`,
`.gallery-thumb.active`, and `.back-btn:hover` in `css/build-detail.css`
already match.

## Build-detail page — still to decide

(none — all 15 decisions made: layout, photo treatment, title
hierarchy, price, availability badge, specifications, performance
section, inquiry form, buttons (sitewide), borders, backgrounds,
spacing, typography, accent color (sitewide), hover/focus states.)

## After the build-detail page

- Mobile layout for this page specifically (based on the desktop
  decisions above, not a direct copy of them)
- Other page types, one at a time, following the same process
  (`services.html` excluded — being removed)

## Home page (`index.html`) — decisions made so far

### 1. Hero — APPROVED, IMPLEMENTED
Compared three real-copy options: **A** current (full-bleed image,
bottom gradient scrim, text overlaid at the bottom — a real,
considered treatment, not a default); **B** side-by-side (text one
side, photo the other, smaller and more forgivable placeholder);
**C** text-focused, no image slot at all. Flagged as directly relevant
to the choice: there is no real hero photo yet (`images/hero-build.jpg`
doesn't exist, live site shows its "Photo coming soon" fallback at
full hero size), and every real photo in the project is a portrait 3:4
product shot — the wrong shape for a wide hero regardless. **Approved
Option C.** Not a permanent verdict against A — full-bleed photography
(a real landscape shot: the workspace, the owner mid-build) is worth
reconsidering specifically once one exists; this decision was sized to
what's actually true today, not a photo that might show up later.

**Owner also flagged**, once this was implemented: the old image-based
hero (with its `onerror`-JS fallback to the "Photo coming soon"
placeholder) had previously sometimes failed to render in AI
crawls/renders, despite always working fine in a real browser.
Worth weighing if Option A is ever revisited — that fallback pattern
carries real crawler risk, not just an aesthetic downside, so a future
image-based hero should avoid leaning on inline `onerror` JS for its
fallback state. Option C sidesteps the issue entirely: the hero is now
plain static HTML with no image or JS dependency at all.

**Implemented** in `pages-src/index.html` (removed the
`.hero-media-frame`/`.hero-scrim`/`.hero-placeholder` image markup and
the `.hero-copy`/`.hero-copy-inner` overlay wrapper — `.hero-inner` now
wraps the h1/body/buttons directly) and `css/theme.css` (rewrote the
HERO block for a centered text layout: `.hero-inner` max-width 860px,
h1 `clamp(2.1rem, 1.3rem + 3.2vw, 3.4rem)` with no line-length cap so
it breaks to two balanced lines on desktop instead of three, copy
unchanged, `.hero-buttons` centered; removed the 900px
overlay-positioning media query since the layout no longer changes
shape across viewports). Found and fixed along the way (all in
`css/style.css`): `.hero-image-wrap`/`.hero-img-placeholder` were
already fully dead — leftover from the pre-Forge original design,
superseded by the media-frame markup and unreferenced by any page or
script — removed along with their dead `order: -1` and grid-column
overrides in the 900px query, plus a `.hero { padding: 48px 0 64px; }`
rule in that same query that turned out to have been moot at any
viewport width even before this change, since `theme.css` has always
set its own unconditional `.hero` padding at equal specificity, later
in the cascade. Verified with `smoke-test.js` (all checks pass) and
real-browser screenshots at 1440px and 390px — no horizontal overflow
at either width.

## Home page — decision 2

### 2. Section-header pattern — APPROVED, IMPLEMENTED
Compared three options: **A** one centered pattern everywhere, forcing
Custom Builds/FAQ's headers into the same full centered block above
their two-column content; **B** two intentional variants sharing the
same label/accent-line/spacing DNA — centered for the three standalone
intro sections (unchanged), left-aligned for the two sections where
the header really just introduces one column, with Contact CTA (a
centered card) staying centered; **C** drop the accent-line sitewide,
standardize spacing only, leave alignment as every section already has
it. **Approved Option B.** Reasoning: the centered treatment earns its
place on a standalone intro; it doesn't on a section where the heading
is really labeling one half of a two-column layout — and the real
inconsistency wasn't the alignment split (which already had a reason),
it was that three sections had quietly lost the accent-line and picked
up one-off inline-style spacing along the way.

**Implemented** in `css/style.css` (new `.section-header.align-left`
modifier next to the existing centered `.section-header` — shares its
`.section-label`/`.accent-line`/h2-to-p spacing, only alignment and
outer margin differ; also a scoped `.cta-box .accent-line` rule, a
no-op on every other page's CTA box since only the homepage's has one)
and `pages-src/index.html`:
- **Custom Builds** — label/h2/p now wrapped in
  `.section-header.align-left` with an accent-line added; dropped the
  old per-element inline `style="margin-bottom:..."` attributes in
  favor of the shared rhythm.
- **FAQ Preview** — same treatment; also dropped an inline
  `line-height:1.8` on the paragraph (now the sitewide base 1.6, like
  every other section-header paragraph).
- **Contact CTA** — kept its existing unwrapped structure (nesting it
  in `.section-header` would've broken `.cta-box`'s own `h2`/`> p`
  selectors, which are tuned for that box specifically); just dropped
  the inline `display:block; margin-bottom:1rem;` on the label and
  added an accent-line after the paragraph, with a scoped margin rule
  so the gap to the buttons below reads right.
Verified with `smoke-test.js` (all checks pass) and real-browser
screenshots of all three changed sections at 1440px and 390px.

## Home page — decision 3

### 3. Available Systems (build card grid) — APPROVED, IMPLEMENTED
Two sub-questions, both stemming from `js/render/buildCard.js` never
having been brought in line with the build-detail page's restraint
decisions (5, 7).

**Part A — performance callout box.** Compared three options: **A1**
keep the current full Cask-tinted background/border box; **A2** match
`.listing-perf-card`'s already-approved treatment (decision 7) exactly
— neutral `var(--card)` background, left accent edge, mono item font
with a bullet marker; **A3** drop the box entirely, render perf items
as plain unboxed rows like `.build-spec` already does. **Approved
Option A2.** Reasoning: the identical content (estimated FPS numbers)
already has a settled, justified treatment one page over — reusing it
here isn't inventing a new pattern, and A3 would go further than
decision 7 itself was willing to go for the same content, creating a
new mismatch in the other direction instead of resolving one.

**Part B — availability/sold badge.** Compared **B1** keep the current
filled-pill look vs. **B2** switch to `.badge-quiet` (decision 5's
detail-page treatment). **Approved B1 — kept as-is.** Reasoning: a card
grid is a scanning context (separating available from sold across
several cards at a glance), where a filled color pill does that job
better than a quiet dot+label; the detail page is a single-item,
already-focused context where quiet suits better. This is exactly why
decision 5 scoped the quiet treatment to the detail page only and
flagged the card badge as its own future decision rather than
assuming the same answer — that instinct held up.

**Implemented:**
- `css/style.css` — `.build-perf`/`.perf-label`/`.perf-item` rewritten
  to the A2 recipe (label/item font-size kept at this component's own
  smaller scale — 0.68rem/0.8rem vs the detail page's 0.72rem/0.9rem —
  rather than forced to match, since the card already runs its own
  smaller type scale throughout).
- `css/theme.css` — removed `.build-perf`'s old rgba(139,63,94,...)
  override, which would otherwise have silently undone the new
  treatment (this file loads after style.css).
- No change for Part B — `.badge-available`/`.badge-sold` untouched.

**Also found and fixed, not a visual change:** `buildCard.js`'s image
had the identical opacity-gated-by-`onload` pattern flagged against
the old hero — `.build-image img` sat at `opacity: 0` until an inline
`onload` handler added a `.loaded` class. If a renderer doesn't fire
`onload` the way a real browser does, a correctly-loading image would
stay invisible indefinitely — worse than a missing one. Removed the
gate; the image is visible by default now, `onerror` stays as a
non-load-bearing nicety for genuinely broken files. Verified directly:
with the `.loaded`/`onload` mechanism entirely absent from the markup,
computed opacity is still `1`.
**The same pattern exists in three more places** — flagged for the
owner, not yet touched pending a decision on scope: `js/render/
partBoxCard.js` (part-boxes.html), `js/render/buildDetail.js` (both
the `<img>` and the `<video>` for `.gallery-main-img` — build.html's
*primary* product photo/video), and `js/render/galleryGrid.js`
(gallery.html grids, `.gallery-item img`). Matching CSS in
`css/part-boxes.css` (`.box-image img`) and `css/build-detail.css`
(`.gallery-main-img`) would need the same opacity-default fix.

Verified with `smoke-test.js` (all checks pass) and real-browser
screenshots at 1440px and 390px.

## Home page — decision 4

### 4. Evidence section (checklist rows, numbered marks) — DONE, no change
Reviewed the existing `.evidence`/`.evidence-row` pattern against
every angle the rest of this process has been checking components
for: box/background treatment (none — plain hairline `border-bottom`
dividers, no card-within-a-card), accent color (`.mark` and
`.evidence-lead .accent` both already use `var(--accent-text)`, Cask),
typography (mono numbered marks, consistent with the rest of the
site's mono-for-technical-detail convention), and consistency between
the two contexts that use it — this pattern is already shared between
the home page's two-column layout and build.html's `.evidence-compact`
single-column variant, real-screenshotted side by side. Checked mobile
too. All of it already reads clean, restrained, and consistent — no
inconsistency or leftover pre-redesign styling to fix.

This one predates the current visual-redesign process: the header
comment in `css/theme.css` notes it replaced the original icon+
heading+description trust cards and numbered-circle testing steps,
and was already unified across both pages before this decision-by-
decision pass started. Nothing to implement.

## Home page — decision 5

### 5. Custom Builds section (two-col layout, budget table) — DONE, no change
Same review as decision 4, same result. `.cb-list`/`.cb-row` is
another pattern that predates this process and is already shared
across three pages — the home page's plain 3-row variant, custom-
build.html's numbered 6-step variant (`.cb-num`, mono digits, not a
filled circle), and contact.html's info list — confirmed by
screenshotting all three side by side. `.budget-table` uses the same
restrained language: hairline row dividers, mono font, accent-text
for the price column, italic dim note below. Nothing boxed, nothing
off-token, nothing inconsistent between pages. Nothing to implement.

## Home page — decision 6

### 6. Gallery preview section — DONE, no change
`#gallery-preview` renders through the same `js/render/galleryGrid.js`
already covered by the sitewide image-opacity fix. Checked the piece
that fix didn't touch — the visual/hover treatment — separately:
`.gallery-item` hover (border to accent-text, subtle card scale +
larger inner-image scale, flat neutral shadow) matches decision 9's
flat-shadow language and decision 15's hover precedent, confirmed with
real hover-state screenshots. No video items in the current homepage
subset to check the video-icon overlay against, but it uses the same
tokens as everything else here. Nothing to implement.

*(Update, A-027: the tile SHAPE of this shared grid changed in the gallery
decision, from 1:1 squares to 3:4, so the homepage preview's tiles changed
too; the hover/visual treatment judged here is untouched. See "Gallery
page" below.)*

## Home page — decision 7

### 7. FAQ preview section — DONE, no change
This one got closer scrutiny than 4-6, since `.faq-item` is structurally
different — a genuinely boxed item (`var(--card)` background + border
per row), unlike the plain hairline-divided lists everywhere else.
Decided that's justified rather than leftover: it's an interactive
accordion control, not a static information list, and needs its own
click target and open/closed affordance — not the same kind of
component as Evidence or Custom Builds, so it isn't a mismatch for not
matching their treatment. Confirmed the open/closed states both look
intentional and clean (screenshotted both).

**Later tokenized** (owner asked, not a design decision): `.faq-item.open`'s
border-color and the closed `.faq-icon`'s background/border were
hardcoded `rgba(174,121,142,...)`/`rgba(139,63,94,...)` rather than
referencing `var(--accent-text)`/`var(--accent)`. Now
`color-mix(in srgb, var(--accent-text) 40%, transparent)` and
`color-mix(in srgb, var(--accent) 10%/20%, transparent)` respectively —
verified via computed-style in a real browser to resolve to the exact
same `rgba(...)` values as before (pixel-identical), so if the accent
color is ever revisited again, these now follow it automatically
instead of needing a manual second edit.

*(Superseded in part, A-030: the boxed `.faq-item` this decision kept was
replaced by ruled rows in the FAQ page decision (Option B) — see "FAQ page"
below. The tokenized `.faq-icon` colours described here are kept.)*

## Home page — decision 8

### 8. Contact CTA section — DONE, no change
Already fully covered by decision 2's implementation (accent-line
added, inline styles removed) — re-checked here against the same
token/restraint criteria as the others. `.cta-box` uses
`var(--card)`/`var(--border)` directly, no hardcoded colors anywhere
in it. Nothing to implement.

## Home page — decision 9

### 9. Section rhythm/spacing — DONE, no change
Checked actual rendered gap between every section on the page (not
just the shared `padding: 80px 0` rule in isolation) — each section
butts directly against the next with zero unintended overlap or extra
margin, so the 80px+80px pairing (160px between content, `.section-alt`
marking alternating bands instead of a gap) is landing consistently
everywhere, not just on paper. Full-page screenshot reviewed
top to bottom for any section that reads cramped or overly sparse next
to its neighbors — none did. Nothing to implement.

## Home page — COMPLETE

All 9 home page decisions made (3 required real changes: hero,
section-header pattern, Available Systems; 6 confirmed already correct
on review: Evidence, Custom Builds, Gallery preview, FAQ preview,
Contact CTA, section rhythm), plus the sitewide image-opacity
correctness fix found along the way. See "Scope notes" above for
what's next.

## Custom-build page (`custom-build.html`)

### Section-header pattern rollout — mechanical, not a fresh decision
This page's "How a Custom Build Works" and "Not Sure What Hardware You
Need?" headers predated decision 2's rollout — bare/inline-styled
labels and headings, no accent-line, one using an inline
`style="text-align:left"` override instead of the `.align-left`
modifier decision 2 already built for exactly this. Applied the same
recipe used on the home page, no new decision needed:
- **How a Custom Build Works** — label/h2/first paragraph now in
  `.section-header.align-left` with an accent-line; the second,
  smaller supporting paragraph stays outside the header block (same
  shape as the home page's Custom Builds section), own inline
  `font-size:0.95rem` kept since it's a deliberate smaller-emphasis
  paragraph, not a default.
- **Not Sure What Hardware You Need?** — this one had three roughly
  equal-weight paragraphs rather than one lead + supporting detail;
  put the first in `.section-header.align-left` (matching the
  one-paragraph-per-header-block shape used everywhere else), left the
  other two outside at their original `font-size:1.05rem` (dropped the
  now-redundant `line-height:1.8` inline overrides, already the page
  default).
Verified with `smoke-test.js` and real-browser screenshots at 1440px
and mobile.

### Open items — RESOLVED
1. **`.page-hero` background gradient** (sitewide, 8 pages) — **kept
   as-is.** Owner asked whether the Impeccable anti-slop tool
   (github.com/pbakaus/impeccable) said anything about it; checked, and
   ran its detector against the live built site (not just pages-src, so
   linked CSS actually resolved). It did not flag `.page-hero` or
   `.tier-card.featured`'s gradients at all — its named gradient rule
   (`gradient-text`) is about multi-color text-fill gradients, a
   different and much louder thing than a single-brand-color fade at 5%
   opacity. Supports the "subtle enough to be a real exception" read.
2. **`.tier-card.featured`'s gradient** — **kept as-is.** Doing real
   comparison work across three cards, not just ambient polish.
3. **`.tier-badge` pill treatment** — **approved quiet**, implemented.
   `css/style.css`: dropped the filled-pill background/border/padding
   entirely for a plain styled-text kicker label (same visual language
   as `.section-label` elsewhere), reasoning being a category label
   doesn't carry the same scan-at-a-glance need the availability badge
   does. Removed the now-dead rgba override in `css/theme.css`.
4. **Final CTA box kicker label** — **deferred, not mine to word.**
   Owner wants to rewrite site copy sitewide in its own dedicated pass
   after the visual redesign, based on their own principles/practices
   rather than the AI-generated copy the site started with. No wording
   proposed; box stays without a label until that pass.

### [B-032: moved to the live VISUAL_REDESIGN.md, section "Open design findings" (still open)]

### `side-tab` — RESOLVED
Impeccable's own description calls a colored left-border "tab" on a
card or section **"the most recognizable tell of AI-generated UIs."**
This was exactly the pattern build-detail decision 7 chose
(`.listing-perf-card`), decision 8 reused (`.listing-form-card`), and
home page decision 3A reused again this session (`.build-perf`) — all
three explicitly reasoned through as "the restrained choice" at the
time. "Restrained" and "a well-known AI tell" turned out to be two
different things here.

Built three real mockups (not just described in the abstract) and ran
the actual detector against each before picking one:
- **Unboxed** — no card, label + hairline dividers carry it (same
  device as the Evidence section / cb-list rows). **Clean.**
- **Top accent rule instead of left** — same box, edge moved to the
  top. **Still flagged** — a different rule this time,
  `border-accent-on-rounded` ("thick accent border on a rounded card —
  the border clashes with the rounded corners"). Ruled out with
  evidence, not just a guess: rotating the border doesn't dodge the
  underlying concern.
- **Icon beside the label, plain neutral box** — specs-card-style box,
  small accent-colored glyph instead of any border accent. **Clean.**

**Approved: unboxed for the two performance cards; "drop the edge,
keep the plain box" (same logic, adapted) for the form card**, since a
form with real input fields needs an actual boundary in a way a label
+ list doesn't.

**Implemented:**
- `css/build-detail.css` — `.listing-perf-card` no longer has any
  background/border/padding at all (plain wrapper div now); title and
  items get hairline `border-bottom` dividers instead, last item's
  border removed. Spacing to siblings already came from
  `.listing-details`' flex `gap`, not this card's own padding, so
  nothing else needed adjusting.
- `css/build-detail.css` — `.listing-form-card` just lost its
  `border-left`; now identical to `.listing-specs-card`.
- `css/style.css` — `.build-perf`/`.perf-label`/`.perf-item` got the
  same unboxed treatment as `.listing-perf-card`, kept its own
  `margin-bottom` since this card's internal layout uses stacked
  margins, not a flex-gap parent.

**Verified two ways:** `smoke-test.js` (all checks pass) and a full
re-scan of the real built site with Impeccable — `side-tab` went from
9 instances to 0, no new findings introduced. Screenshots of all three
real components (not just the test mockups) confirmed clean.

### `low-contrast` — RESOLVED
Pinned down with a live browser instead of a static scan: wrote a
Playwright script that actually hovers every element on the 5 affected
pages (Impeccable's own browser can't launch as root in this sandbox)
and compares computed styles against the flagged color pair. Several
elements matched a raw RGB check (`.nav-link.active`, `.faq-icon`,
`.btn-ghost`) but turned out to be false positives once alpha was
accounted for — all three use a low-opacity accent tint (8-14%), which
composites to something nowhere near the solid failing color against
the dark page background underneath.

The real one: **`.btn-primary:hover` never redeclared `color`**, so on
an `<a>` element (every primary CTA sitewide — hero buttons, cta-box
buttons, "View Build," etc. are all anchors, not `<button>`s) the
global `a:hover { color: var(--accent-text) }` rule — one type selector
+ one pseudo-class — silently outranked `.btn-primary`'s plain-class
`color: white` the instant it was hovered. Confirmed live before
touching anything: computed color really did flip from `rgb(255,255,255)`
to `rgb(174,121,142)` on the still-solid `rgb(139,63,94)` background on
real mouse hover — Impeccable's exact numbers. `.btn-secondary`/
`.btn-ghost` were never affected, just by luck: both happen to
redeclare `color` in their own `:hover` rule for unrelated styling
reasons, which incidentally outranks `a:hover` too. The identical root
cause was already diagnosed for `.nav-cta` (see its comment in
`css/style.css`) but never applied to `.btn-primary` itself.

**Fixed:** added an explicit `color: white;` to the existing
`.btn-primary:hover` rule in `css/style.css`. Normal specificity
((0,2,0) vs `a:hover`'s (0,1,1)) wins cleanly, no `!important` needed.
Verified with a real hover before and after (white confirmed stable
now) and a full site re-scan: `low-contrast` went from 10 instances to
0.

**The `--accent-h` = `--accent` collapse turned out to be a red
herring, not the cause** — `tokens.css`'s own comments describe
`--accent-h` as meant to be a **distinct** hover-state shade from
`--accent` (it was, under the old blue palette); they were set equal
during decision 14's Cask swap, which is still a real, slightly sloppy
loose end, but Cask's base already clears white-text contrast
comfortably (7.07:1) regardless, so nothing was actually broken by it.
Left as-is — correct by accident rather than by design, but correct.

### [B-032: moved to the live VISUAL_REDESIGN.md, section "Open design findings" (still open)]

### [B-032: moved to the live VISUAL_REDESIGN.md, section "Open design findings" (still open)]

### Tier-card feature lists — APPROVED (Option B), IMPLEMENTED
`.tier-features` (the 6-row lists in the three "What Different Budgets
Get You" cards) had a real bug plus an open look question.

**Bug found:** the list had `list-style: none` but kept the browser's
default `padding-left: 40px`, so it sat 40px right of the badge, price,
description and button edge (measured at 1440px: badge x=187, list text
x=227).

Three renders from the real page CSS (real fonts, real copy), all
flush-left:
- **A — aligned ✓ list.** Indent fix only. Keeps the pricing-table
  checklist look. Cards stay 545px tall.
- **B — ruled rows, no marks.** Hairline between rows, body font.
  Cards grow to 626px (+81px).
- **C — spec-sheet.** Space Mono + accent bullet + hairlines (the
  `.perf-item` recipe). Cards 594px. Not chosen: mono
  suits short data values, not these phrases; 4 rows wrapped in the
  first card vs. 0 in B.

**Approved: B.** Reasoning: matches the ruled-row language already used
by `.cb-list` (directly above on this page) and the Evidence section;
drops the ✓, which implies "included in this tier" where there are no ✗
rows and the cards share items; accent now comes only from the kicker
and the featured button. Cost: +81px per card, 18 hairlines inside
bordered cards (same `--border` token as the card edge).

**Implemented (css/style.css only, no markup change):**
- `.tier-features`: `padding: 0`, `border-top` hairline, `flex: 1`;
  `li`: `padding: 0.6rem 0`, `border-bottom` hairline, last one none;
  `li::before` check mark rule removed; the old `gap` and `li` flex
  layout removed.
- `flex: 1` moved from `.tier-desc` to `.tier-features`, so the list
  starts right after the description and slack falls below it, above the
  button.

**Verified:** `smoke-test.js` ALL CHECKS PASSED; `visual-check.py` no
horizontal overflow at desktop/tablet/mobile (9 pages x 3 viewports);
measured on the real page: list text x equals badge x in all three cards
at 1440/1024/768/390; top rules align across cards at 1440 (all 2012px)
and 1024 (all 2024px); 0 script errors at all four widths.

**Known limitation (tablet, not fixed here):** cross-card alignment of
the top rules depends on how many lines each description wraps to.
Measured at 900/840/700 they align; at 768 (two-column) the first-row
cards differ by 24px because one description wraps to 4 lines and the
other to 3. The original bottom-anchored layout wasn't aligned at every
width either (19px off at 900). A robust fix would be CSS subgrid on the
card rows, which is a larger layout change; left for the tablet/mobile
pass.

**Noticed, not yet raised as a decision:** the featured tier card's
button sits 2px lower than its siblings (existing; primary button has no
border). Not touched. (The process-section left column, also noted here
at the time, was decided in the next subsection.)

### Process section left column — APPROVED (Option A), IMPLEMENTED
"How a Custom Build Works" uses `.two-col.center`: the left column
(heading, promise paragraph, button) was vertically centered against the
tall 6-step list. Measured at 1440px: left column 378px vs. list 842px,
so "The Process" label sat 239px below the first rule, with empty space
above and below the text block. The home page's Custom Builds section
uses the same shared `.two-col.center` rule (it centers its shorter
table column; home decision 5 kept that), so any change had to be scoped
to this section.

Options shown as a published artifact (first use of artifacts for
options, owner-approved 2026-10-06), built from the real markup and CSS:
- **A — top-align.** Label level with the first rule (5px). CSS/markup
  change only, section height unchanged (1034px). Empty space moves under
  the button.
- **B — header top, button bottom.** Button level with the last step's
  text. Leaves a large hole in the middle of the left column.
- **C — header row over a 2x3 step grid.** Most balanced composition,
  section 842px (192px shorter). Needs a markup restructure and loses the
  single tall sequence.

**Approved: A.** Reasoning: smallest change that fixes the actual flaw
(a floating text block), keeps the six steps as one continuous column,
and top-aligned two-column layouts already exist on the home page (FAQ
preview). Cost: about 400px of quiet empty space beside the lower steps.
C was the runner-up (close call).

**Implemented:** `pages-src/custom-build.html` only: that one element is
now `<div class="two-col">` instead of `<div class="two-col center">`
(plain `.two-col` already has `align-items: start`), with a short HTML
comment saying why. No CSS change; `.two-col.center` stays for the home
page. Root `custom-build.html` regenerated with stitch.py.

**Verified:** `smoke-test.js` ALL CHECKS PASSED; `visual-check.py` no
horizontal overflow; on the real page the label sits 5px below the first
rule and the left column's top equals the list's top at 1440, 1180,
1024 and 901px; at 768 and 390 the section collapses to one column as
before; 0 script errors at all six widths; home page's `.two-col.center`
still computes `align-items: center`.

### "Not Sure" section layout — APPROVED (Option A), IMPLEMENTED
"Not Sure What Hardware You Need?" was a single 760px block centered on
the page (inline `max-width:760px; margin:0 auto`), left-aligned text
inside it. Measured at 1440px with real fonts: its text started at
x=340 while the process section and the nav start at x=154; lead 520px
wide vs. body 760px (body 75 characters per line); section 630px tall.
With real fonts the section read cleanly, so this was a small fix, not a
redesign. (An earlier fallback-font render had made the body look longer
than it is.)

Options shown as a published artifact, from the real markup and CSS,
copy unchanged:
- **A — two columns on the page grid.** Heading + lead left, the two
  paragraphs and buttons right, same pattern as the process section.
  Left edge x=154; body column 534px, 57 characters per line; section
  469px (-161px).
- **B — single column, left edge on the grid.** Same 760px column moved
  to x=154; right side stays empty; 75 characters per line stays.
  Smallest change (one inline style).
- **C — centered.** Matches the tier section above and the CTA box below.
  Would make three centered sections in a row, centered body text, and a
  two-button cluster directly above the CTA box's two buttons. Ruled out.

**Approved: A.** Reasoning: fixes the grid alignment and the line length
together, and reuses a pattern already on this page and in the home page's
FAQ preview. Cost: about 100px of empty space under the left column.
"Keep as is" and B were the defensible minimal alternatives.

**Implemented:**
- `pages-src/custom-build.html`: the block is now `.two-col` with the
  header (plus `style="margin-bottom:0;"`, because it is the only child of
  its column) in the left div and the two paragraphs + button row in the
  right div. Copy unchanged. Inline styles kept, as elsewhere on this page.
- `css/style.css`: new opt-in utility `.text-balance { text-wrap: balance; }`
  with a comment; applied only to this h2. Without it the heading broke as
  "...Hardware You / Need?". Not applied to any other heading.
- The right column's first paragraph got `margin-top: 0`. In the options
  the first line sat about 18px below the label; I described that as
  top-aligned boxes, but the real cause was the paragraph's default
  1em top margin, which no longer collapses once the paragraph is inside
  a grid item (it used to collapse into the header's 2rem margin). With it
  zeroed the first line sits level with the label (box tops within the
  label's 5px inline-block offset) and the collapsed spacing stays close to
  before (36px vs. 32px between the accent line and the body at 768/390).
  This differs slightly from the mockup the owner approved; flagged in
  A-008.

**Verified:** `smoke-test.js` ALL CHECKS PASSED; `visual-check.py` no
horizontal overflow; real page at 1440/1180/1024/901/768/390: 0 script
errors, no horizontal overflow; two columns down to 901px, one column at
768 and 390 as before; section height 469px at 1440 (was 630),
643px at 768 (was 639), 816px at 390 (was 812); heading is two balanced
lines on desktop.

## Contact page (`contact.html`)

### Situation picker — APPROVED (Option B), IMPLEMENTED, class renamed
The "What Do You Need Help With?" picker was five equal cards in a
two-column grid (`.grid-2` of `.service-hub-card`). Measured at 1440px
with real fonts:
- The fifth card ("Other / Not Sure") sat alone on the last row.
- Spacing bug: the card's `h3` and `p` kept their default margins
  (17.6px and 14.7px), which stack on top of the card's 12px flex gap
  because margins don't collapse in a flex container. Result: 44px
  between a title and its description, and the title sat 43px below the
  card's top edge versus 24px at the sides. Same kind of bug as the
  tier-list indent.
- Picker height 832px (1439px stacked at 390px).

Options shown as a published artifact, real markup/CSS/copy; all three
included the same margin fix:
- **A — cards, last spans the row.** Odd last card becomes a wide card
  with its button on the right (self-adjusting `:last-child:nth-child(odd)`
  rule). Picker 560px (1115px at 390px).
- **B — ruled rows.** No boxes: five hairline rows, title + description
  left, equal-width button right. Picker 542px (875px at 390px).
- **C — three cards + two rows.** Buying, Custom and General Question
  stay cards; Part Box and Other / Not Sure become quieter rows. Picker
  477px. Reorders the choices and demotes Part Box (owner's call).

**Approved: B.** Reasoning: the choices are navigation, not products;
rows match the ruled language already used beside it (the info column,
`.cb-list`) and in the process list and tier lists; by far the shortest
on a phone. Cost: rows signal "clickable" less than boxes, so the
buttons carry that alone. A was the safe alternative.

**Rename (owner approved):** `.service-hub-card` is now
`.situation-option` (not `.situation-card`, as suggested earlier,
because they are rows now), and `css/services.css` is now
`css/situation-picker.css`. The picker container no longer uses
`.grid-2`; it is `.situation-picker`.

**Implemented:**
- `css/situation-picker.css` (new; replaces the deleted
  `css/services.css`): `.situation-picker` top hairline;
  `.situation-option` is a 2-column grid (text | button), hairline
  `border-bottom`, last row open, `h3`/`p` margins zeroed, `p` has
  `text-wrap: pretty` (stops "here." sitting alone in the Custom PC
  row); the button has `min-width: 12.5rem` so "Get Started" and
  "Browse Part Boxes" share one width; at 640px and below each row
  stacks with the button underneath, left-aligned at natural width.
- `pages-src/contact.html`: stylesheet link, picker container class and
  the five option classes. Copy unchanged.
- `smoke-test.js`: selector updated to `.situation-option`, plus an
  assertion that no `.service-hub-card` markup remains.
- `ARCHITECTURE.md` file listing and a historical comment in
  `css/style.css` updated to the new names. `LOG.md` and `docs-archive/`
  keep the old names (append-only / frozen).

**Verified:** `smoke-test.js` ALL CHECKS PASSED; `visual-check.py` no
horizontal overflow; all local links/assets in the 10 built pages
resolve; real page at 1440/1024/901/768/641/640/390: 0 script errors, no
horizontal overflow; at 1440 the picker is 542px with rows 119/119/119/93/92px,
a 4px title-to-text gap, and all five buttons 200px wide on one right
edge; clicking each of the four form buttons reveals the expected panel
(buying, custom, general, general) and the Part Box button still links
to `part-boxes.html`.

**Left for later:** at 640px and below the two button widths differ
(148px and 196px) because they size to their text; left-aligned, so
left as is, revisit in the mobile pass if wanted.

### Form panel width and placement — APPROVED (Option A), IMPLEMENTED
The three form panels (Buying, Custom PC, General/Other) open below the
picker in `#situation-forms-section`. Measured at 1440px with real fonts:
- The panel spans the full 1132px container (x=154), while the picker
  above sits in a 792px column at x=494.
- The buying panel's intro paragraph ran about 142 characters per line
  and the submit button was 1058px wide (inline `width:100%`).
- Privacy note: `.form-privacy p` kept default 12.8px top/bottom margins
  inside the box padding, so a one-line note was an 81px box. Same bug
  class as the picker cards and tier lists.

Options shown as a published artifact (real markup/CSS/copy; the picker
plus the opened panel; Buying and General panels shown), all three with
the same intro cap and privacy fix:
- **A — full width, internals fixed.** Panel stays full width, button at
  natural width (187px), inputs 519px.
- **B — in the picker's column.** Panel at x=494, 792px, inputs 349px;
  left 340px stays empty.
- **C — 760px on the page grid.** Panel at x=154, inputs 333px; about
  670px stays empty on the right.

**Approved: A.** Reasoning: the panel keeps spanning the container like
the CTA box and other sections, so it adds no new empty side (the last
few decisions removed exactly that kind of void), and its real problems
were internal. Cost: wide two-column inputs. B was the alternative for
picker-to-form continuity.

**Implemented:**
- `pages-src/contact.html`: the three submit buttons lost their inline
  `width:100%; justify-content:center;`. Copy unchanged.
- `css/style.css` (next to the `.form-privacy` rules, with a comment):
  `.situation-form-panel > p { max-width: 52ch; }` (468px; the site's
  lead measure); the privacy note's margin reset
  (box 56px at 1440, was 81px; first scoped to the panels, moved to the
  root `.form-privacy p` rule in A-011, see below); and, at 640px and
  below, the submit
  button is `width:100%; justify-content:center` again so phones keep the
  full-width button they had before (without it the button would have
  been 187px, left-aligned, in a 292px column at 390px).

**Scoped on purpose at the time, then extended (A-011):** the same
`.form-privacy` markup is rendered by `js/render/buildDetail.js` and
`js/render/notifyBox.js` with the same default margins. The owner then
approved applying the fix at the root; see the next subsection.

**Noticed, not touched:** with JavaScript off, the three panels stack
with no gap between them (no spacing rule on `.situation-form-panel`).
The options page added a 2rem gap only to show two panels together.

**Verified:** `smoke-test.js` ALL CHECKS PASSED; `visual-check.py` no
horizontal overflow; all local links/assets in the 10 built pages
resolve; clicking each of the three form buttons shows exactly its panel;
real page at 1440/1024/768/390 (and 641/640 for the button): 0 script
errors, no horizontal overflow; panel 1132px wide at 1440, intro 468px
wide, button 187px (641px and up) or full width (640px and below),
privacy box 56px at 1440/1024 (77px at 768 and 98px at 390 because the
note wraps).

### Privacy-note margin fix extended to the root rule — APPROVED, IMPLEMENTED
The owner approved moving the contact panels' privacy-note fix to the
shared rule, so every place the note renders gets it: the contact form
panels, the notify box on `builds.html` (`js/render/notifyBox.js`) and
the build-detail inquiry form (`js/render/buildDetail.js`). This
touches two pages signed off earlier (builds, build-detail); the change
is only the paragraph's default 12.8px top/bottom margins, which stacked
inside the box padding.

**Implemented (css/style.css only):** `margin: 0` added to
`.form-privacy p` (with a comment); the scoped
`.situation-form-panel .form-privacy p` rule from A-010 removed as
redundant; the contact block's comment points to the root rule. No
markup or JS change.

**Measured before -> after (1440px / 390px):**
- Notify box on `builds.html`: 102px -> 77px / 123px -> 98px.
- Build-detail form: 102px -> 77px / 123px -> 98px (measured in scratch
  copies with `aug26-02` set to available, since every real listing is
  sold and the form only renders for an available one; the real data is
  unchanged).
- Contact panels: 56px / 98px, unchanged from A-010.
Each box is 25.6px shorter (two 12.8px margins); no layout shift beyond
that.

**Verified:** `smoke-test.js` ALL CHECKS PASSED; `visual-check.py` no
horizontal overflow; the measurements above ran with 0 script errors and
no horizontal overflow on builds, the detail page and contact at both
widths.

### Form fields — resting boundary and focus — APPROVED (Option A), IMPLEMENTED
The shared field styles (`.form-input`, `.form-select`, `.form-textarea`)
had been left open since the build-detail page. They are used by the
contact panels, the build-detail inquiry form, the notify box on
`builds.html` and the part-boxes order form, so this decision applies to
all four. Measured/computed from the site's real token colors (WCAG
relative luminance):
- Resting border (`--border` #2c2c30) vs. the card: 1.29:1; the fill
  (`--bg`) vs. the card: 1.09:1. WCAG 1.4.11 asks 3:1 to identify a form
  control, so a strict audit would likely flag these (the owner has cared
  about AA elsewhere; this is not a compliance audit).
- Focus was an accent border plus a 3px 15%-opacity glow. Contrast was
  fine (accent border 5.05:1 against the card, 3.92:1 against the resting
  border) but inconsistent with the sitewide 2px offset outline.
- The select arrow was hardcoded `#64748b`, the old blue-gray from the
  previous theme.
- The old glow was a thin border plus a wide soft shadow, the pattern the
  `gpt-thin-border-wide-shadow` finding describes; whether it was among
  the 9 remaining hits is unknown (the detector was not run here).

Options shown as a published artifact (real Custom PC panel plus a strip
of three fields forced into their focused look):
- **A — visible border, solid focus edge.** Resting border `#6a665e`
  (3.13:1 against the card), dark inset fill kept; focus is one solid 2px
  accent edge (border + outline, no offset), no glow. An offset ring was
  tried first and read as a busy double ring on a field.
- **B — underline fields.** A 3.13:1 line under each field, 2px accent
  line on focus; the textarea keeps a full box. Matches the ruled
  language but the boxed textarea sits oddly among the lines.
- **C — keep the quiet look.** Resting border unchanged (1.29:1); only
  focus and the arrow change.

**Approved: A.** Reasoning: fixes the contrast and the focus
inconsistency with the smallest visual change; bordered boxes still read
clearly as fields. B was the stylistic alternative, C the
quiet-on-purpose choice.

**Implemented:**
- `css/theme.css`: new token `--border-field: #6a665e` (with a comment);
  the `:focus` `box-shadow` glow override REMOVED (it loads after
  style.css and would otherwise have kept the glow), with a comment in
  its place.
- `css/style.css`: the three field classes use `border: 1px solid
  var(--border-field)`; the `:focus` rule is now `border-color:
  var(--accent-text); box-shadow: none; outline: 1px solid
  var(--accent-text); outline-offset: 0` (a solid 2px edge); select
  arrow fill `%238f8a7d` (`--dim`). Both with comments.
- No markup or JS change; generated HTML unchanged.

**Not touched:** `.qty-input` and the `.qty-btn` picker on part-boxes
(own styling in `css/part-boxes.css`; part-boxes is not walked yet).

**Verified:** `smoke-test.js` ALL CHECKS PASSED; `visual-check.py` no
horizontal overflow. Real browser, before -> after: resting border
rgb(44,44,48) -> rgb(106,102,94) (1.29:1 -> 3.13:1 against the card);
after the focus transition finishes (400ms wait), every input, select and
textarea on contact, the notify box and the build-detail form (scratch
copy with `aug26-02` set to available) shows border rgb(174,121,142),
`outline: solid 1px` at offset 0, `box-shadow: none`; select arrow fill
#64748b -> #8f8a7d; field heights unchanged (45px); 0 script errors. The
part-boxes order form (revealed by adding one box) shows the same focused
style. Not measured: the 390px widths for the field change specifically
(visual-check found no overflow at mobile).

### Success states — APPROVED (Option B), IMPLEMENTED
Four places confirm a sent form; three were shown to the owner and are
now one shared component, with a fourth found during implementation:
contact.html (`?sent=true`, JS in `contactRouter.js`), the notify box on
`builds.html` (`?notified=true`, `notifyBox.js`), the build-detail
inquiry form (`?sent=true`, `buildDetail.js`), and the part-boxes order
confirmation (`?ordered=true`, `partBoxOrder.js`, see below).

**Found (before):** three different treatments. Contact and build-detail
used an inline-styled `h3` straight under the page's `h1` (a skipped
heading level) with a 3rem/2.5rem checkmark in `--accent` (2.53:1
against the card; the redesign introduced `--accent-text` for exactly
this); the notify box was a card with a hardcoded old-palette green
border (`rgba(34,197,94,0.25)`) and the same `--accent` mark.

Options shown as a published artifact (the real CSS and the exact
strings from the scripts, in all three contexts; copy unchanged):
- **A — centered, unboxed.** Reads as floating text; notify loses its card.
- **B — centered badge in a card.** Check in a 56px outlined circle, the
  message in a neutral card; inside the build-detail card it drops its
  own box. Echoes the CTA box used on five pages.
- **C — left-aligned on the page grid.** Small outlined check beside the
  heading, no box. Shrinks the notify confirmation from a 358px card to
  about 210px of leftover-looking text.

**Approved: B.** Reasoning: the clearest "it worked" moment, with
closure, and consistent with the CTA box pattern. Cost: one more boxed
element (contact's confirmation had no box).

**Implemented:**
- `css/style.css`: new `.success-state`, `.success-mark`, `.success-title`
  (with a comment), placed after the `.notify-success` block. Card:
  `--card` fill, 1px `--border`, `--radius-lg`, 3rem/2rem padding; mark:
  56px circle, 1px `--accent-text` border, check in `--accent-text`
  (5.05:1 against the card); title `h2`, 1.4rem; paragraph capped at 52ch;
  button 1.75rem below the text; `.listing-form-card .success-state` drops
  its box (no card in a card); `grid-column: 1 / -1` so it spans the grid
  the notify box sits in.
- `js/render/contactRouter.js`: the thank-you block is the shared markup,
  wrapped in `<section class="section"><div class="container">` because
  `#contact-live-region` sits directly in `<main>`, outside any
  container (a bare card would have stretched edge to edge).
- `js/render/notifyBox.js` and `js/render/buildDetail.js`: shared markup.
  The mark has `aria-hidden="true"`; the text carries the meaning.
  Copy, links, buttons and the live-region mechanism are unchanged.

**Caught during verification (not visible in the options):** on
`builds.html` the notify box's parent is a grid, so without
`grid-column: 1 / -1` the new card was only 361px wide (one of three
columns); the old `.notify-success` had that rule for this reason. The
options page placed the component in a plain container and could not show
it.

**Not touched at the time, flagged for the owner:** `js/render/partBoxOrder.js`
(the part-boxes order confirmation, inside the sticky `.order-summary`
panel) still used `.notify-success` with its old green border and an
`h3`, so that CSS block stayed on purpose. **Resolved in A-023** (see
"Quantity picker and order confirmation" under the Part-boxes page): the
confirmation now uses `.success-state` and the old `.notify-success` CSS
is deleted.

**Also noticed, copy only:** the hero on `contact.html?sent=true` still
says "Choose what fits below..." above the confirmation. Left for the
copy pass.

**Verified:** `smoke-test.js` ALL CHECKS PASSED; `visual-check.py` no
horizontal overflow; `node --check` on the three JS files; each state
rendered for real by its URL parameter at 1440/768/390 with 0 script
errors and no horizontal overflow; at 1440 the contact card is 1132px
wide (x=154..1286), the builds card 1132px (720px at 768), the
build-detail state sits inside its form card with no box of its own;
heading structure on contact is now h1 then h2; all three live in their
`role=status` regions. The build-detail state was checked in a scratch
copy with `aug26-02` set to available (every real listing is sold); real
data unchanged.

## Part-boxes page (`part-boxes.html`)

### Portrait photo cards — APPROVED (Option B), IMPLEMENTED
The owner's requirement (via Lane B, B-017): the part-box photos
(1350x1800, portrait 3:4) stay portrait and are never cropped; the card
design was left to Lane A. Measured at 1440px with real fonts and the
real photos:
- The card's `.box-image` was a 4:3 frame (249x186px at three columns)
  with `object-fit: cover`, which shows only about 56% of each photo's
  area. The TUF motherboard boxes and the 5800X3D box lost the most.
- Pre-existing, separate from the photos: the price + quantity rows did
  not line up across a row of cards (the middle card's picker sat 23px
  higher), because the footer followed the text instead of the card's
  bottom.
- Uncropped 3:4 photos need frames about 332px tall at the old card width,
  so the question was how to arrange the card.

Options shown as a published artifact (the real card markup/CSS/copy, the
real photos downscaled to 600px, beside the real "Your Request" panel so
the grid has its real 792px width; six of the twelve boxes). The 12-box
grid heights below are computed from the measured card heights:
- **A — portrait frame in the same 3-column cards.** 249px photos; cards
  538px tall; 12-box grid about 2,210px (was 1,620px).
- **B — horizontal cards, two per row.** Photo left, details right; cards
  about 206px tall; 12-box grid about 1,340px.
- **C — keep the 4:3 frame, show the whole photo inside it** (one-line
  change). Photo only 140px wide on a dark field; grid about 1,630px.
- Tried and dropped: four compact portrait columns (footer wraps, so the
  quantity pickers do not align across a row).

**Approved: B.** Reasoning: the only option that shows whole photos while
making the page shorter; at about 150px you can still read "TUF GAMING"
and see whether foam inserts are included. Cost: smaller photos than A. A
click-to-enlarge lightbox (gallery already has one) is a possible later
addition; not done.

**Implemented (css/part-boxes.css only; no markup or JS change):**
- `.box-grid`: `repeat(auto-fill, minmax(380px, 1fr))` (two columns in the
  792px grid beside the order summary; one column below that), with a
  comment deriving the minimum.
- `.box-card`: `display: grid; grid-template-columns: 144px 1fr`.
- `.box-image`: `aspect-ratio: 3 / 4; align-self: start`; `.box-image img`:
  `object-fit: contain` (a non-3:4 photo letterboxes instead of cropping).
- `.box-body`: flex column; `.box-category`: `align-self: flex-start`;
  `.box-footer`: `margin-top: auto` (pins price + quantity to the bottom,
  which also fixes the misaligned pickers).
- Responsive: at 480px and below one column with a 110px photo column; at
  380px and below a 96px photo column.
- The photo column is 144px, not the 150px shown in the options: the
  price + quantity row needs 198px (measured), so at the 386px card width
  150px left only about 4px of slack and a two-digit stock count would have
  wrapped the row; 144px gives about 10px.

**Caught during verification:** the first implementation used a 372px grid
minimum, which was wrong (the row needs a card of about 382px). At 820px
viewport the cards were 376px wide and the footer wrapped. Now 380px, and
that width drops to one column instead.

**Verified:** `smoke-test.js` ALL CHECKS PASSED; `visual-check.py` no
horizontal overflow. Real page at 1440/1180/1000/900/840/820/768/641/480/390/
360/320px: 0 script errors, no horizontal overflow, every photo shown whole
(object-fit contain in a frame that matches its ratio), pickers aligned in
every row; the 12-box grid is 1,338px at 1440 (was 1,620px); two columns at
1440, 1180, 900 and 840, one column at 1000 and 820 and below. At 360px and
320px the price + quantity row wraps to two lines (price above the picker)
because there is no room for one line beside a photo; it stays tidy.
Quantity buttons add boxes, the "Your Request" summary updates and the order
form appears.

### Light mode — none; `--success` pinned
The owner checked the live site in a light-mode browser and believes there
is no light mode. Confirmed by emulating `prefers-color-scheme` light and
dark on all 9 pages: identical body background and text color. The only
token that differed was `--success` (#22c55e dark, #16a34a light):
`tokens.css` has a light-mode block, `theme.css` overrides every other
token but never `--success`. It colors `.badge-available`, `.price-event`
and `.event-badge`, which only render for an available listing (none are
available right now), so the leak was not visible today.
**Fixed (A-021):** `--success: #22c55e` pinned in `css/theme.css` with a
comment; verified on a scratch copy with one listing available:
`.badge-available` computes `rgb(34, 197, 94)` under both color schemes.
Not done: the now-dead light block in `css/tokens.css` could be removed;
left alone as a cleanup choice for the owner.

**Follow-up (A-022, owner decision): no light mode at all; light and dark
are identical.** The owner asked for the old, unused light-mode values to
go. Removed: the whole `@media (prefers-color-scheme: light)` block in
`css/tokens.css` (every token in it except `--success` was already
overridden by `theme.css`, so `--success` was its only visible effect);
`tokens.css`'s `color-scheme: dark light` is now `dark` (theme.css already
forced `dark`); and the `--success` pin added in A-021, which is redundant
now that the cause is gone. Header comments in both files and the
"Dark only" paragraph of `ARCHITECTURE.md` updated. **Not removed:** the
`--success` token itself, still defined once in `tokens.css` as `#22c55e`,
because `.badge-available`, `.price-event` and `.event-badge` use it (they
show for an available listing); removing it would leave those with no
colour. **Verified:** all 32 custom properties from `tokens.css` and
`theme.css` are equal under light and dark emulation on 10 page states
(9 pages, plus contact with a form panel open, `contact.html?sent=true`
and part-boxes with a box added); full-page screenshots are
pixel-identical in light and dark on all of them (the contact panel
screenshot needs the button transition to settle, 1,500ms; at 250ms even
dark vs dark differs in that one 200x41px area, so that was timing noise,
not a scheme difference); `computed color-scheme` is `dark` in both; no
CSS variable is used without a definition (31 used, 32 defined);
`.badge-available` computes `rgb(34, 197, 94)` under both schemes on a
scratch copy with a listing available.

### Quantity picker and order confirmation — APPROVED, IMPLEMENTED
The owner approved (A-022 follow-up, shown as a before/after artifact, not
a three-option round, because both items apply decisions already made):

**Quantity picker.** Two findings, measured on the real page at 1440px:
- The picker's outer border and its two dividers were `--border` (#2c2c30):
  1.29:1 against the card, and the +/- fill 1.1:1, the same faint boundary
  fixed on the form fields (A-012).
- The keyboard focus ring was invisible: `.qty-picker` keeps
  `overflow: hidden` for its rounded corners, which clipped the sitewide 2px
  offset outline drawn around a button (tabbing to "Decrease quantity"
  showed no ring in the render).
Implemented in `css/part-boxes.css`: outer border and dividers use
`--border-field` (3.13:1 against the card); `.qty-btn:focus-visible` and
`.qty-input:focus-visible` get `outline: none; box-shadow: inset 0 0 0 2px
var(--accent-text)`, an inset edge that cannot be clipped. Hover is unchanged
(white on `--accent-h`, 7.07:1). With a real Tab: the "-" button and then the
number input each show `rgb(174, 121, 142) 0 0 0 2px inset`.

**Order confirmation** (`?ordered=true`, inside the sticky `.order-summary`
panel). It was the last user of `.notify-success`: a card with a hardcoded
green border (`rgba(34,197,94,0.25)`) inside a card, an `h3` under the `h1`,
a `--accent` check (2.5:1). Implemented: `js/render/partBoxOrder.js` now
renders the shared markup (`.success-state`, `.success-mark` with
`aria-hidden="true"`, `h2.success-title`; copy unchanged: "Request Sent" /
"I'll follow up by email to arrange pickup and payment."); `css/part-boxes.css`
adds `.order-summary .success-state { background: none; border: 0;
padding: 1.25rem 0.25rem }` so it has no box inside the panel;
`css/style.css` drops the whole `.notify-success` block (4 rules; nothing
else used it) and its comment now says so.

**Verified:** `smoke-test.js` ALL CHECKS PASSED; `visual-check.py` no horizontal
overflow; `node --check` on partBoxOrder.js. Real page: picker border and
dividers `rgb(106, 102, 94)` (3.13:1, was 1.29:1); real keyboard focus
(Tab) shows the inset edge on both the button and the number input; the +
buttons add boxes and the "Your Request" summary updates; the picker stays
inside its card at 390, 360 and 320px; the confirmation via `?ordered=true`
at 1440/768/390: heading structure h1 then h2, no old class, no own box
(border 0, transparent) with the panel's own 1px border kept, mark
`rgb(174, 121, 142)` (5.05:1 against the card), the 12 box cards still render,
0 script errors, no horizontal overflow; panel is sticky at 1440 and static
at 768 and 390 as before. Not run: actually submitting the order form (the
real redirect to `?ordered=true` was simulated by loading the URL).

## About page (`about.html`)

### Story section layout — APPROVED (Option A), IMPLEMENTED
The about page is a hero, one block of prose and the CTA box; only the
prose block was designed. Measured at 1440px with real fonts:
- The prose was one 720px block centered on the page (inline
  `max-width:720px; margin:0 auto`), so the text started at x=360 while the
  hero label and nav start at x=154: the same floating indent fixed on
  custom-build's "Not Sure" section.
- Three of the six paragraphs ran 95-100 characters per line (70-100 across
  all six), long for comfortable reading.
- The opening line ("Hi, I'm Jacob Skrove...") was 1.15rem against a 1.05rem
  body, barely distinguished.

Options shown as a published artifact (real markup/copy/CSS; copy unchanged
in every option; B and C set to the same 536px column as A's right column so
the line lengths are comparable, all 65-76 characters per line):
- **A — two columns on the page grid.** Opening line as a large statement on
  the left (1.6rem), pinned while reading; five paragraphs in the right
  column. Section 1,086px tall.
- **B — one column, left edge on the grid.** Larger opening line, one 536px
  column at x=154; more than half the page empty. 1,181px.
- **C — centered column, shorter lines.** 536px centered column, text at
  x=452, further in than today. 1,181px.
- First draft note: my initial option text said A's lines were "about 62
  characters"; measured they are 65-76, and B/C at 576px were 70-83, so B/C
  were narrowed before the owner saw them.

**Approved: A.** Reasoning: fixes the indent and the line length together and
uses both halves of the page; same pattern the owner chose for the process
and "Not Sure" sections. Cost: a tall empty area under the opening line on
the left, which the pinned line gives a job while reading; a photo of the
owner's PCs/build setup (wanted eventually) could later sit under it.

**Implemented (pages-src/about.html and css/style.css; copy unchanged):**
- `pages-src/about.html`: the inline-styled block is now
  `.about-grid` > `.about-side` (the existing `.lede` paragraph plus an
  `.accent-line`) and `.about-body` (the five paragraphs, no inline styles),
  with an HTML comment pointing here. The rendered prose text is identical
  to the B-025 page (compared after whitespace normalization), and the hero
  and CTA sections are byte-identical after rendering.
- `css/style.css` (after `.two-col.center`, with a comment): `.about-grid` is
  two equal columns with a 4rem gap; `.about-side` is `position: sticky; top:
  6rem`; `.about-side .lede` is 1.6rem/1.4 with no margin; `.about-side
  .accent-line` is left-aligned (the base one is centered); `.about-body p` is
  1.05rem/1.9 with 1.5rem between paragraphs. At 900px and below one column,
  nothing pinned, and `.about-body` is capped at 34rem so a single column does
  not return to 97-110 characters per line.

**Caught during verification:** the first implementation let the collapsed
(single-column) paragraphs run the full width: 97-110 characters per line at
900px. Capped at 34rem: now 66-77 at 900px and 768px.

**Verified:** `smoke-test.js` ALL CHECKS PASSED; `visual-check.py` no
horizontal overflow. Real page at 1440/1180/1024/901/900/768/390px: 0 script
errors, no horizontal overflow; two columns at 901px and up with the opening
line at x=154 (1440px), 66-77 characters per line at 1440px (54-66 at 1024px,
54-58 at 901px); one column at 900px and below (66-77 characters per line at
900px and 768px, 41-48 at 390px); heading structure h1 then h2 (the CTA's).
Pinning checked against the real sticky header (bottom at y=77) at viewport
heights 900 and 700: after scrolling the opening line settles at 96px from
the top (19px clear of the header) and stays inside the grid.

## Gallery page (`gallery.html`)

### Photo tile shape — APPROVED (Option B), IMPLEMENTED
Measured at 1440px with real fonts and the real photos:
- The gallery grid (and the homepage preview; same `.gallery-grid` /
  `.gallery-item` component and `renderGalleryGrid()`) is a 4-column layout
  (`theme.css`) where the first tile spans 2x2, but every tile was a 1:1
  square with `object-fit: cover`. Of the 22 gallery photos, 16 are 3:4
  portrait (1350x1800), 1 is 0.82 and 5 are 4:3 landscape, so most lost a
  quarter of their height (the lightbox always shows the whole photo). The
  owner's earlier requirement for the part-box photos was "portrait, never
  cropped".
- The sub-heading under each section title started at x=430 while the title
  started at x=154 (276px off): the page used an inline `text-align:left;
  margin-bottom:2rem` instead of `.section-header.align-left`.
- Not part of this decision, flagged: the homepage preview shows 3 photos
  (`media.slice(0, 3)` in `index.html`), but the bento is built for 5, so the
  featured tile sits on the left and the other two side by side at the top
  right, leaving the whole bottom-right quadrant empty (it already did with
  squares, and decision 6 said "no change"). An idea for a later decision:
  show 5 photos so the block fills.

Options shown as a published artifact (the real tiles, header and CSS, the
real photos downscaled to 600px, gallery page grid plus homepage preview):
- **A — keep the square tiles.** Only the sub-heading fix.
- **B — 3:4 tiles, same layout.** The featured tile (2x2) is then also about
  3:4; 4:3 photos sit whole inside a portrait tile with bars above and below.
  Gallery grid (all 22) 1,996px -> 2,619px; homepage preview 556px -> 741px.
- **C — masonry at natural proportions.** Nothing cropped, no bars, and the
  3-photo preview looked clean, but the photos have no declared dimensions so
  lazy loading can reshuffle the columns, the featured tile is lost, and it
  reads down the columns.
- First-draft problems found while building the options (not seen by the
  owner): B's featured tile first rendered 741px against 734px of rows
  (a 3.5px edge mismatch) and then collapsed to 377px in the 3-photo preview;
  fixed by keeping every tile 3:4 and using `align-self: stretch`.

**Approved: B.** Reasoning: keeps the established featured-tile look, shows the
portrait photos whole, fixed layout with no shifting, CSS-only. Cost: a taller
grid, bars on the 4:3 photos, and the homepage preview's empty quadrant stays.

**Implemented (css/style.css and pages-src/gallery.html; no JS change):**
- `.gallery-item`: `aspect-ratio: 3 / 4; align-self: stretch` (was `1 / 1`);
  `.gallery-item img`: `object-fit: contain` (was `cover`); a comment explains
  why `stretch` is needed: the featured tile's 3:4 height is about 741px against
  two 357px rows + the 20px gap, so without stretch the tiles beside it end 3.5px
  short.
- `pages-src/gallery.html`: both section headers use `class="section-header
  align-left"` instead of the inline style.

**Verified:** `smoke-test.js` ALL CHECKS PASSED; `visual-check.py` no horizontal
overflow. Real gallery page at 1440/1180/1024/768/700/699/480/421/420/390px: 0
script errors, no horizontal overflow; four columns at 700px and up with the
featured tile and the tiles beside it ending on exactly the same line at every
one of those widths (1440px: featured 556x741, others 270x361, grid 2,628px for
7 rows); 2 columns at 421-699px and 1 column at 420px and below (existing
breakpoints, unchanged); every image `object-fit: contain`; sub-heading x equals
title x on both sections. Lightbox: click opens it on photo 1/22, ArrowRight
moves to the next, Escape closes, Enter on a focused tile opens it. The empty
"Current Builds" state is unchanged ("Photos coming soon."). Homepage preview at
1440px: featured 556x741, others 268x357, grid 741px, quadrant still empty.

**Noticed for the mobile pass (not changed):** at 420px and below the grid is
one column, so on a 390px phone the 22 tiles are 342x456 each and the grid is
10,452px tall (about 8,000px with squares); 2 columns on small phones would
be an option, and the 3-photo homepage preview is 1,400px tall there.
(At 421-699px the preview's 3 tiles also sit in a 2-column grid, so one tile
is alone on the second row; that was already the case with squares.)

### Homepage preview: 5 photos on desktop — APPROVED, IMPLEMENTED
Raised in the tile-shape round (the 3-photo preview left the whole bottom-right
quadrant of the 4x2 bento empty) and approved by the owner: "yes, on desktop".
Implemented: `pages-src/index.html` loads `media.slice(0, 5)` (was 3, with a
comment); `css/theme.css` hides preview tiles 4 and 5 below 700px
(`#gallery-preview .gallery-item:nth-child(n+4) { display: none }`), because
below 700px there is no bento and five tall tiles would be a very long strip
on a phone, so phones keep 3. The gallery page grid is unaffected. The stale
"homepage just shows the first 3 combined" line in the `js/data/gallery.js`
instructions was corrected (the homepage does not read that file at all; it
reads `js/data/builds.js`). The other `slice(0, 3)` in `index.html`, for the
available-builds card strip, is unrelated and unchanged.
**Verified:** `smoke-test.js` ALL CHECKS PASSED; `visual-check.py` no overflow.
Real homepage at 1440/1180/1024/768/700/699/480/421/420/390px: 0 script errors,
no horizontal overflow; from 700px up all 5 tiles show and all 8 cells of the
4x2 block are covered (at 1440px: featured 556x741, four 270x361 tiles, grid
741px, the same height as before); below 700px 3 tiles show (5 stay in the
DOM). The lightbox opened from the preview reads "1 / 5" and still lists all
5 photos, including the two hidden tiles on a phone.

### Empty "Current Builds" — APPROVED (Option A), IMPLEMENTED
Every build is sold, so the gallery's "Current Builds" section was empty: a
556px block (title, one line, then a camera icon and "Photos coming soon." in
3rem of padding) before the first photo, which put the "Completed Builds"
heading 995px down the page, below a 900px-tall screen.

Options shown as a published artifact (the real hero, the real section, and
the real first five Completed Builds photos; the site's existing copy
throughout, nothing reworded):
- **A — hide the section while it is empty.** Completed Builds heading moves
  to 439px (artifact) / 516px (real page).
- **B — keep it, compact.** Same words, no icon, tighter padding: section
  284px, heading at 723px.
- **C — reuse the notify card from builds.html** (the exact existing card and
  copy): section 622px, heading at 1,062px; adds a form and its script to the
  gallery page.
Context found while preparing them: `COPY_REVIEW.md` (Lane B) already flags
"Photos coming soon." as placeholder language that tells a visitor nothing,
and the line above it as a mismatch.

**Approved: A.** Reasoning: the page's job is showing photos, and A puts them
on the first screen; it makes the placeholder line moot while the copy pass
decides what, if anything, to say; the section needs no manual upkeep.

**Implemented (`pages-src/gallery.html` only):** the section has
`id="gallery-current-section"` and the page script now reads
`if (currentBuilds.length) { renderGalleryGrid(currentBuilds, 'gallery-current'); }
else { document.getElementById('gallery-current-section').hidden = true; }`.
`js/render/galleryGrid.js` and its own empty-state text are untouched (still
used by the other grid). Nothing else links to `#gallery-current`.

**Verified:** `smoke-test.js` ALL CHECKS PASSED; `visual-check.py` no overflow.
Real data at 1440/768/390px: the section computes `display: none`, 0 tiles
rendered in it, 3 visible sections (hero, Completed Builds, CTA), headings H1
"Gallery" then H2 "Completed Builds" then the CTA's H2, Completed Builds
heading at y=516/483/498, 22 completed tiles, 0 script errors, no overflow.
Scratch copy with one photo added under `currentBuilds`: the section comes
back (4 visible sections, 1 tile, H2 "Current Builds" before H2 "Completed
Builds") and the lightbox opens from it ("1 / 1").

**Noticed, not changed (layout with few photos, any width):** the grid's first
tile always spans 2x2, so a single current photo renders as a 556x741 tile
(the scratch section was 1,077px tall at 1440px), and 2 to 4 photos leave
empty cells in the 4x2 block (the same effect the homepage preview had with 3
photos). It works best with 5 or more. Worth a decision when the owner next
adds current photos.

## FAQ page (`faq.html`)

### Accordion — APPROVED (Option B), IMPLEMENTED
The last page of the desktop walk. Six questions, rendered from
`js/data/faq.js` by `renderFaqList()`; the same component feeds the homepage
FAQ preview (3 featured questions in a 534px column). Measured on the real
page at 1440px with real fonts:
- **Not keyboard-operable (the serious one).** Each question was a plain
  `div` with a click handler: no button role, no `tabindex`, no
  `aria-expanded`. Tab never reached a question (tested), Enter did nothing,
  and the closed answers were still exposed to screen readers.
- The reveal animated `max-height` up to a hardcoded 600px. Today's longest
  answer is 229px so nothing was clipped, but a longer one would be, and
  closing lagged.
- Six full-width boxed cards (a 1,132px column): answers ran 139 characters
  per line across 1,085px, and a question and its + icon were 1,059px apart.
- The `h2` inside each question kept its default margins on top of the row
  padding: 88px rows (the same family of bug as the privacy note, the picker
  cards and the tier lists).
- No recorded owner decision about the full-width variant; it was a code
  choice (`.faq-list.full-width`).

Options shown as a published, live artifact (the real six questions plus the
real homepage preview, copy unchanged; all three had the same accessibility,
animation, line-length and row-height fixes):
- **A — keep the boxes.** Same six cards with the insides fixed.
- **B — ruled rows, one 800px column** on the page grid, hairline dividers
  like the picker and process list; + icon 774px from its question; the
  right third empty.
- **C — ruled rows, two columns** (questions 1-3 and 4-6 as independent
  stacks): full width used, + icon 508px from its question, opening one
  question never stretches the other column; read order runs down.
- Two bugs in my own first draft of the comparison page, fixed before the
  owner saw it: a literal `<div>` in a description that broke the layout, and
  vertical padding left on the answer wrapper that kept closed rows
  unevenly padded.

**Approved: B.** Reasoning: matches the ruled-row language chosen elsewhere,
a calm scannable list, simplest to maintain. C was the alternative that uses
the full width. This supersedes the boxed-accordion judgment in home decision 7.

**Implemented:**
- `js/render/faqList.js`: each question is `<h2 class="faq-heading"><button
  type="button" class="faq-question" id aria-expanded="false"
  aria-controls>` with `.faq-q-text` and an `aria-hidden` `.faq-icon`; the
  answer is `role="region" aria-labelledby` with the same
  `.faq-answer-inner`; ids come from a module counter (`faqUid`) so they are
  unique across lists. Copy, the `answerExtra` second paragraph and its inline
  margin are unchanged.
- `js/render/faqAccordion.js`: the same open/close logic, plus
  `aria-expanded` kept in sync (only one item open per list, as before).
  Enter and Space work because the question is a button.
- `css/style.css` section 18 replaced (with a long comment): `.faq-list` is an
  800px column with a top hairline; `.faq-item` has a bottom hairline and no
  box; `.faq-question` is a full-width button, `1.25rem 0` padding;
  `.faq-answer` is `display: grid; grid-template-rows: 0fr -> 1fr` with
  `visibility: hidden` while closed (the visibility switch is delayed by the
  transition so the close animation still shows); `.faq-answer-inner` has
  `min-height: 0; overflow: hidden` and no padding or border of its own (they
  would leak as invisible space at zero height); the bottom space is on the
  last paragraph; answers are `max-width: 65ch`. The icon keeps its tokenized
  colours; a hover rule makes its border `--accent-text` (the box's hover tint
  is gone with the box; this hover cue was not in the mockup). Keyboard focus
  uses the sitewide `:focus-visible` 2px offset ring (the mockup showed an
  inset edge, which crowded the text now that the row has no side padding).
  The global reduced-motion rule in `base.css` already covers the transition.
- `css/theme.css`: the `.faq-item.open` accent border override and the
  `.faq-item` 4px radius removed; the `.faq-icon` overrides kept.
- `pages-src/faq.html`: the list is no longer `faq-list full-width`.
- Rows are 66px (was 88px). Docs: `ARCHITECTURE.md` and `START_HERE.md` updated;
  nothing in `MAINTENANCE.md` changed (editing `js/data/faq.js` works as before).

**Caught while implementing:** my first scripted edit stopped partway (a
no-op replacement that did not match), leaving the renderer changed but the
CSS and behaviour script not, so the project was briefly inconsistent; the
remaining edits were applied immediately and verified before anything was
packaged.

**Verified:** `smoke-test.js` ALL CHECKS PASSED; `visual-check.py` no
horizontal overflow; `node --check` on both scripts. Real FAQ page at
1440/1024/768/390px: 0 script errors, no horizontal overflow; 6 buttons, all
`aria-expanded="false"` at rest, every `aria-controls` resolves, ids unique;
closed answers `visibility: hidden` at height 0 (checked at rest before any
interaction); list at x=154, 800px wide at 1440px; rows 67px (66 + the
divider); icon 774px from its question; answer paragraphs 585px wide (the
65ch cap); headings H1 then the six question H2s then the closing box's H2.
Keyboard: Tab reaches 6 of 6 questions, Enter opens one, Space on another
opens it and closes the first, Space again closes it; `aria-expanded`
follows each step; the focused question shows a 2px `rgb(174, 121, 142)`
outline at 2px offset. Animation, sampled every 40ms: opening 23 -> 223px
over about 280ms; closing starts immediately (179 -> 0px, no lag). Scratch
copy with a 3,556-character first answer: it opens to its full 1,388px
(the old cap was 600px), nothing clipped, last line visible, and closes
back to 0 and hidden. Homepage preview: 534px column, 3 buttons, opens and
closes correctly.


## Outstanding, not scoped to one page (old item, resolved in A-021 by the portrait photo cards)

- **Part-box photo framing (owner request, recorded by Lane B in B-018; not designed or implemented).** The
  11 part-box photos are portrait (1350x1800) but `.box-image` (`css/part-boxes.css`) is a 4:3 landscape frame
  with `object-fit: cover`, so each is center-cropped. Owner: the photos should stay portrait and not be
  cropped. How the card frame changes to do that is a design decision for Lane A.

