# DECISIONS.md — North Bridge PCs Website Rebuild

Meaningful business and architecture decisions, in the order they were made.
Trivial implementation choices (CSS class names, helper function names) are
not logged here.

---

### D1 — This is a ground-up rebuild, not an in-place edit
The old site (`pcman369/North-Bridge-PCs`) stays live and untouched. It's
reference material only. New code lives in a separate project and will
replace the old repo's contents when ready to launch, not before.
**Decided by:** owner, explicit instruction.

### D2 — Services gets a dedicated page and nav item
Repair/diagnostics, upgrades, and cleaning/maintenance were not represented
anywhere on the old site (only PC sales and custom builds had real estate).
The new site gives services a real page and nav entry.
**Decided by:** owner, explicit choice among 3 options.
**Page structure — confirmed by owner:** Services page acts as a hub —
Sales/Custom Builds get short cards linking to their existing dedicated
pages, while Repair/Upgrades/Cleaning/Support get their real content
directly on the Services page. This is what's actually built.

### D3 — Old one-off sale event is not carried over; general-purpose event system instead
The old site's hardcoded "Back to School" event (with live day-countdown)
is not being reproduced as-is. Instead, `js/data/events.js` is a reusable
system supporting multiple future promotions (holiday sales, back-to-school,
clearance, etc.) with their own date ranges and banner copy.
**Decided by:** owner, in response to a countdown-timer question — but the
owner's answer described the desired *system* rather than confirming or
rejecting the countdown display specifically. **Countdown display — confirmed
by owner:** a per-event `showCountdown` toggle rather than a sitewide
yes/no, so a real fixed deadline can show one while a soft/ongoing sale
doesn't have to. This is what's actually implemented
(`js/data/events.js`/`js/render/eventBanner.js`).

### D4 — Light/dark theme follows system preference
The old site was dark-only. New site defaults to `prefers-color-scheme`
with dark as the fallback, per the project brief's own default guidance.
**Decided by:** owner, explicit choice among 3 options.

### D5 — Brand colors/identity carried forward from the old site (confirmed, then superseded by the Forge redesign)
Rather than inventing a new palette, `css/tokens.css` reuses the old site's
blue accent (`#3b82f6`) and dark palette as the base, with a light-mode
palette derived from it. Rationale: this isn't a new business or a new
brand — the business already uses this color and an existing logo
elsewhere (flyers, the 3D-printed GPU bracket). Treated as a proposed
default, not a locked decision, since brand identity calls for explicit
sign-off per the project brief.
**Status:** confirmed by owner. Note for anyone reading this later: this
carried-forward blue was the site's palette for the original build and
the full post-launch audit cycle, but D23/D24's "Forge" redesign has
since replaced it sitewide with a dark/amber palette instead. This entry
is kept as-is for the historical record rather than rewritten — it was
the right call for that phase of the project.

### D7 — Contact form consolidated from two variants into one
The old site's `contact.html` had two form variants toggled by a
`?system=X` URL parameter: a "simple" pre-filled version (reached by
clicking a build card) and a "full" general/custom-build version. In
the new architecture, `build.html` has its own embedded inquiry form
(see D-notes in CHANGELOG's Phase 3 entry) — nothing links to
`contact.html?system=X` anymore, so the "simple" variant's only purpose
no longer applies. `contact.html` is now just the one form (identical
fields to the old "full" variant), with its FormSubmit destination and
redirect URL now sourced dynamically from `config.js`/`window.location`
instead of hardcoded.
**Decided by:** Claude, technical simplification — no customer-facing
capability was removed (asking about a specific system is still one
click away, just on that system's own page now), so treated as an
ordinary implementation choice rather than a business decision requiring
sign-off. Flagged here for visibility regardless.

### D2/D3/D5 status update
Not corrected across two subsequent "continue" turns — Phase 2 proceeded
on all three as accepted. Still easy to revisit: D2 only affects
`services.html` (not yet built), D3 only affects `js/data/events.js`
(no event is currently active, so nothing customer-facing depends on it
yet), D5 only affects `css/tokens.css` (isolated, single file).

---

### D6 — Part Boxes resale system + two-level nav restructuring (planned, not yet built)
Owner wants a "PC Part Boxes & Packaging" resale system (empty component
boxes from flips) — brand/model, quantity available, and multi-item order
requests. Same data/render pattern as PC builds, no payment backend
needed (order requests still get fulfilled in person like everything
else). Quantity tracking will be manual, same as marking a PC sold —
flagged to the owner as a real constraint, not hidden.

Paired with this: restructure the flat nav into two dropdown parents —
"For Sale" (Gaming PCs / Custom Builds / Part Boxes) and "Services"
(Repair / Upgrades / Cleaning / Support) — replacing the flat nav shipped
in Phase 2. Owner's call, delegated grouping/labeling details to Claude.
**Decided by:** owner, explicit request.
**Sequencing:** deliberately after the in-flight Gaming PCs Phase 3 work
(builds.html/build.html) finishes, so the nav isn't retrofitted mid-page.
Both done together in one pass, since the nav change exists to serve
this feature.

**Nav restructuring — done.** "For Sale" is now a real dropdown (desktop)
/ accordion (mobile) over Gaming PCs, Custom Builds, and Part Boxes.
**Services was deliberately kept as a flat link, not a matching
dropdown** — a technical call, not asked about, since it doesn't change
customer-facing meaning: 4 of its 6 sub-services (Repair/Upgrades/
Cleaning/Support) still have `show:false` and no real copy yet. A
dropdown listing four mostly-empty destinations would be worse than the
current single link to a hub page. Once those four have real content,
Services can become a matching dropdown with the same mechanism — the
`{{activegroup:...}}` token added to `stitch.py` already supports it,
no architecture change needed then.

**Part Boxes system — done.** `js/data/partBoxes.js` (empty, no real
inventory yet — same "schema first, real data later" pattern as
builds.js), `js/render/partBoxCard.js`, `js/render/partBoxOrder.js`
(tracks quantities across cards, builds a running itemized summary, no
real cart/checkout), and `part-boxes.html`. Order requests submit as one
itemized inquiry via the same FormSubmit pattern as everything else —
fulfillment (payment, pickup) still happens in person, matching current
business practice. Quantities are manually maintained, not automatically
decremented (no backend) — flagged to the owner up front, not discovered
later.

### D8 — Services and About content added
Owner provided real facts for all 4 pending services (Repair &
Diagnostics, Upgrades, Cleaning & Maintenance, Support) and About Me.
Converted directly into customer-facing copy — no new prices, turnaround
times, or guarantees were introduced beyond what was given. `services.js`
schema extended (`included`/`pricingNote`/`turnaroundNote`/`notCovered`)
since a one-line description wasn't enough to represent the real
constraints (e.g. "not every repair is worth doing," "no guaranteed
performance increase") honestly. `services.html` and `about.html` built;
"About" added to the nav (flat link, between Services and Gallery).
**Decided by:** owner-provided content, Claude did the copywriting.
**Flagged, not yet resolved:** `about.html` has a `[Your Name]`
placeholder — no name was provided anywhere. Needs the owner to fill
that in (or tell Claude what to put there).
**Also confirmed:** testimonials stay off — no real ones exist yet, the
architecture already handles this safely (empty array + toggle, from
Phase 1). No changes needed there.

### D9 — Owner name added, turnaround claim corrected, dedicated service-request form added
Three fixes from owner review:
1. `[Your Name]` placeholder replaced with "Jacob Skrove" in `about.html`.
2. **Corrected an error from the original business input**: the notes
   said turnaround is slower "during the summer... because of school,"
   but the owner clarified summer is actually *faster* (less going on)
   and it's the school year that can run slower. Fixed in both
   `about.html` and `services.html`'s policy blurb.
3. Owner flagged that `services.html` linked to the general contact
   form (budget/games/Wi-Fi/monitor/RGB fields), which doesn't fit
   someone asking about a repair or upgrade. Added a dedicated
   service-request form directly on `services.html`: name, email, a
   service dropdown (populated from `services.js`, not hardcoded — can't
   list a service that doesn't exist above it), what the system is
   (optional), and what's going on. Each of the 4 service detail cards
   got a "Request This Service" button that pre-selects that service in
   the dropdown and scrolls to the form. Replaces the old generic
   "Contact Me" CTA box that prompted this fix.
**Decided by:** owner correction (1, 2) and owner-identified UX gap (3).

### D10 — Phase 5 (SEO) built against the placeholder URL, verified swap-safe
Owner asked whether building canonical/OG/structured-data/sitemap now,
against the placeholder GitHub Pages URL, would cause problems once a
real domain arrives in a few months. Answer: no functional risk (this
metadata doesn't affect page rendering), but it does need updating when
the domain changes — so `stitch.py` was extended to read `SITE.url`
from `config.js` as the only source for every URL it generates
(canonical tags, Open Graph, Twitter Card, JSON-LD, sitemap.xml,
robots.txt). Title/description for OG tags are read from each page's
own existing `<title>`/`<meta name="description">` rather than
duplicated by hand, so they can't drift out of sync.
**Verified, not just claimed**: temporarily changed `SITE.url` to a
fake real domain, re-ran `stitch.py`, confirmed every generated file
updated correctly and no trace of the old URL remained anywhere, then
reverted.
**Decided by:** owner question, Claude's technical judgment on how to
build it safely.
**Still to do when the real domain arrives:** update `SITE.url` in
`config.js`, re-run `stitch.py`, and — this part isn't automatic — set
up a Google Search Console property for the new domain and submit the
regenerated sitemap.xml there (a fresh GSC property is needed either
way for a new domain, independent of anything built here).

### D11 — Accessibility contrast fixes (buttons + dark-theme dim text)
Fixed the two confirmed WCAG AA contrast failures from the earlier audit,
scoped narrowly per owner instruction — no other changes.

**Fix 1 — white text on solid accent backgrounds (buttons, badges, banner):**
`--accent` (#3b82f6) with white text only reached 3.68:1. Audited every
usage first (9 locations sharing this exact pairing: buttons, nav CTA,
step/process numbers, FAQ toggle icon, back-to-top, skip link, part-box
quantity buttons, event banner) rather than fixing `.btn-primary` alone
and leaving the rest inconsistently broken. Solution: the already-existing
`--accent-h` (#2563eb, used for hover states) already reaches 5.17:1 with
white text, so it became the *resting* background for all 9; a new
`--accent-h2` (#1d4ed8, 6.70:1) became their *hover* background, since
they could no longer hover to the color they now rest at.
`--accent`/`--accent-h` themselves were NOT changed — only which
components use them for backgrounds changed, so text-color and
decorative uses of both variables are byte-identical to before.

**Fix 2 — `--dim` in dark theme:** #64748b only reached 2.79:1 against
the worst-case surface it can sit on (`--card-h`) — worse than the
3.75:1 originally reported, which had only been checked against `--bg`.
Changed to #8c9bb1 (4.70:1 against `--card-h`, 5.18:1 against `--card`,
6.32:1 against `--bg`). Light theme's `--dim` was NOT touched.

**Verified mathematically, not just asserted** — see CHANGELOG.md for
the exact numbers. Also ran the existing DOM-based functional regression
suite (all 10 pages, zero JS errors) and confirmed HTML tag balance +
CSS brace balance across every file touched.

**Found but explicitly NOT fixed (out of scope, flagged for owner):**
1. `--accent` as text color on `--card` background: 3.98:1, fails AA.
   Affects small-caps labels (section labels, tier badges) that happen
   to sit on card surfaces. Unrelated variable pairing to what was asked.
2. `a:hover` text color (`--accent-h` on `--bg`): 3.45:1, fails AA.
   Pre-existing; `--accent-h`'s *value* wasn't changed by this fix, so
   this issue is unchanged by it either.
3. Light theme's `--dim` against `--card-h`: 4.34:1, fails AA (barely).
   Newly discovered while auditing surfaces for fix 2. Owner's original
   ask named dark theme specifically; light theme left untouched pending
   a decision on whether to include it.
**Decided by:** owner-specified fix, Claude's technical implementation.

### D12 — Light-mode header bug fixed + the 3 previously-flagged contrast issues fixed
**Header bug (owner-reported: "header is same as in dark mode, looks
odd")**: root cause was `.site-header` having a hardcoded
`rgba(15, 23, 42, 0.96)` background — that's literally dark theme's
`--bg` spelled out in decimal, with no light-theme override, so the
header stayed dark navy regardless of theme. It existed because the
original hardcoded-color audit (Phase 2) only searched for `#hex`
patterns and had a blind spot for `rgba()` decimal notation. Fixed with
a new theme-aware `--header-bg` token (dark value unchanged from
before, light value is light theme's own `--bg` at the same alpha).
While investigating this, found the same blind-spot pattern affecting 5
hover-feedback backgrounds (`rgba(255,255,255,0.06)` on nav links,
dropdown links, hamburger, mobile sublinks, secondary buttons) — a
white tint is nearly invisible against an already-light surface, so
light-mode hover states would have shown almost no feedback. Fixed with
a new `--hover-tint` token (dark: unchanged white tint; light: a dark
tint instead).

**The 3 flagged-but-not-fixed contrast issues, now fixed:**
1. `--accent` as text color on `--card`: 3.98:1 (dark theme). Turned
   out more pervasive on investigation — dark theme also failed against
   `--card-h` (3.61:1), and **light theme failed against every surface**
   (3.36–3.68:1), not just the one case originally measured. New
   `--accent-text` token: dark #6aa5fb (5.30–7.13:1 across all
   surfaces), light #1a44c4 (7.19–7.87:1). `--accent` itself is
   unchanged — still used for backgrounds/borders/decorative elements.
2. `a:hover` text color: 3.45:1. Now uses `--accent-text` (same as
   resting state) with `text-decoration: underline` added for hover
   feedback, rather than inventing a third blue shade for one hover
   transition.
3. Light theme `--dim` vs `--card-h`: 4.34:1. New value #5c6b82 reaches
   4.94:1 on that surface (5.17–5.41:1 on the others).

**A real bug introduced and caught during this fix**: the first
implementation pass replaced `color: var(--accent);` via plain string
substitution, which also matched inside `border-color: var(--accent);`
and `background-color: var(--accent);` (since both end in `-color:`, a
superstring of the search text) — silently converting 6 border/
decorative-background rules that were never supposed to change.
Caught by grepping for the corrupted pattern specifically before
considering the fix complete; all 6 reverted to plain `--accent`.

**Verified mathematically** (all ratios in CHANGELOG.md) and with a full
functional regression sweep across all 10 pages (zero JS errors) plus
HTML tag-balance and CSS brace-balance checks on every file touched.
**Decided by:** owner-reported bug + owner's explicit request to fix
the 3 previously-flagged items.

---

### D13 — Image optimization, and a privacy issue found along the way
All 11 real product photos were full phone-camera resolution
(3024×4032, ~1.1MB average, 12.47MB total) despite never being
displayed larger than ~1100px anywhere on the site (the lightbox's max
width). Optimized: EXIF orientation baked into pixels first (so nothing
would render sideways once metadata was stripped), resized to a 1800px
max dimension, re-encoded at JPEG quality 82, metadata stripped.
12.47MB → 4.50MB (63.9% reduction), checked visually for quality, not
just by file size. No filenames changed, so no references anywhere
needed updating.

**Found in the process, not something being looked for**: one photo
(`may26-01-main.jpg`) had precise GPS coordinates embedded in its EXIF
data — accurate enough to pinpoint where it was taken. That metadata
was about to go into a public GitHub repo along with everything else.
Removed along with the rest of the stripped metadata; confirmed gone
by direct before/after EXIF inspection. Worth knowing for any future
photos added to this project — phone cameras embed this by default,
and it's not visible just by looking at the image.
**Decided by:** owner's "finish the pic stuff" follow-through on the
already-flagged Phase 6 item; the GPS finding was Claude's own
discovery during the work, not requested.

---

### D14 — Phase 7 testing pass: 3 real bugs found and fixed
Systematic functional/programmatic testing across all 10 pages: link/
asset reference integrity, feature-toggle matrix (every state of
phone/facebook/testimonials/events), form success *and* failure paths
(previously only success had been tested), empty/missing-content states,
accessibility structure (alt text, heading hierarchy, ARIA), and a
post-image-optimization SEO re-check.

**Real bugs found and fixed, not just checked-and-clean:**
1. `favicon.ico` was referenced on all 10 pages but never existed —
   every page showed a blank browser-tab icon. Created one (simple "N"
   monogram in the site's existing accent blue, not a new brand
   decision). First generation attempt only embedded a single 16×16
   size due to a Pillow API gotcha (`append_images` doesn't reliably
   work for the ICO plugin) — caught by verifying the embedded sizes
   programmatically rather than trusting the save call succeeded;
   fixed by generating one high-res base image and letting Pillow's
   ICO writer handle the resizing internally. Now correctly
   multi-size (16/32/48/64px).
2. `contact.html` skipped heading levels (h1 straight to h3, no h2) —
   4 info-card headings promoted to h2.
3. `custom-build.html` skipped heading levels (h2 straight to h4) — 6
   process-step headings promoted to h3.
Both heading fixes required renaming the matching CSS selectors
(`.contact-info-card h3`→`h2`, `.pl-content h4`→`h3`) so component
styling didn't silently stop applying when the tags changed — checked
for this specifically rather than assuming a tag rename is free.

**Explicitly not covered by this pass**: actual visual rendering.
This sandbox has no real browser, so nothing has been eyeballed on a
real mobile/tablet/desktop viewport, and there's been no true
cross-browser check. Everything verified here is mathematical (contrast
ratios) or structural/functional (DOM behavior, no JS errors, correct
data flow) — not visual QA.
**Decided by:** owner's request to do Phase 7 testing.

---

### D15 — Contact form now works with zero JavaScript
Owner reviewed the live beta site directly and found `contact.html`'s
(and `services.html`'s service-request form's) submission was entirely
JS-dependent: the form `action` and `_next` redirect were both set at
runtime via JS, reading `CONTACT.email` from config.js. If JS failed to
load or run for any reason, the form had no destination — a visitor
could fill it out, submit, and nothing would happen, with no error
shown. Silent lost inquiries.

**Fix**: extended `stitch.py` with a general-purpose build-time token
system (`{{SITE_URL}}`, `{{CONTACT_EMAIL}}`, both already read from
`config.js`) that bakes the real, working `action`/`_next` values
directly into the static HTML. The form now works with zero JavaScript
— confirmed by parsing the raw built HTML with no JS executed at all
and checking the values are already correct. The JS that previously set
these values at runtime was removed; the only JS remaining on these
forms is the "Message Sent" thank-you-state swap, which is a pure
enhancement — if JS fails, FormSubmit's own redirect still lands the
visitor back on the page with `?sent=true` in the URL, just without the
fancier confirmation message.

**Also fixed while in there**: both forms' `_subject` hidden field used
a literal `\u2014` text sequence directly in static HTML (a JS-style
unicode escape, meaningless outside a JS string) — FormSubmit would
have emailed the literal text `\u2014` instead of an em-dash. Replaced
with the HTML entity `&mdash;`. Confirmed this pattern doesn't exist
anywhere else that isn't inside an actual JS string context.

**Verified**: raw-HTML parse with zero JS proving the form action/next
are correct without any script running, the JS-enhanced thank-you state
still works with JS, no stray `\u201X`-style escapes remain in static
HTML anywhere in the project, and a full functional regression sweep
across all 10 pages.
**Decided by:** owner's live-site review (critique item #1) + explicit
request to fix it.

---

### D16 — "Get Notified" waitlist form now works with zero JavaScript

**Found during**: the post-launch comprehensive audit (visual/UX/
accessibility/SEO/performance/architecture review), implemented as
Batch 1 of the resulting fix plan.

**Problem**: `js/render/notifyBox.js` (the waitlist box shown on
`builds.html` whenever there are zero available systems) was the same
category of bug as D15, just not caught by that pass — it was a plain
`<div>` with a button wired to a `fetch()` call and no `<form action>`
at all. If JS failed to load or run, or the `fetch()` call itself
failed (network hiccup, an ad-blocker blocking a third-party POST,
etc.), the visitor had no way to submit — silent lost inquiries again.
It also had no honeypot spam field, unlike every other form on the
site. This mattered more than a typical dormant bug because, at the
time of the audit, all real inventory was marked sold — meaning this
box was the *only* working conversion path on the PC-sales pages.

**Fix**: converted it to the same real `<form method="POST"
action="https://formsubmit.co/...">` pattern already proven by D15 and
by the build-detail inquiry form, with `_subject`/`_captcha`/
`_template`/`_next`/honeypot hidden fields and a native
`required`/`type="email"` input instead of custom JS validation —
matching contact.html's approach exactly. Because this file is
JS-rendered (not a static `pages-src` page `stitch.py` processes), the
email address and `_next` URL are filled in with `CONTACT.email` and
`window.location` at render time, the same way `buildDetail.js`
already does it for its own inquiry form — no new email source, no
token system needed here. The old `fetch()`/AJAX submit handler was
removed; the only JS remaining is a small enhancement that swaps in a
"You're on the list" message after FormSubmit's redirect brings the
visitor back with `?notified=true` in the URL — same pattern as
contact.html's `?sent=true` handling. No other page or file references
this box's internal DOM IDs, so no other changes were needed.

**Verified**: rendered the component in an isolated Node context to
confirm the generated markup is well-formed HTML with every required
hidden field present exactly once; confirmed the success-state swap
fires only when `?notified=true` is present and not otherwise;
confirmed no other file references the removed `#notify-error` element;
full `stitch.py` rebuild in a scratch copy produced byte-identical
output for all 10 pages (this file isn't part of the static build, so
that also confirms no other page was affected); JS syntax check across
every file in `js/`.

**Decided by:** finding from the owner-requested comprehensive audit;
implemented per the owner's Batch 1 instructions.

---

### D17 — Waitlist form redirect fixed for real-browser testing (`_url` field)

**Found during**: owner's first live-browser test of the D16 fix.
Submitting showed FormSubmit's own generic "Thanks! ... Return to
original site: https://pcman369.github.io/" page instead of redirecting
to `_next`.

**Cause**: this is FormSubmit's own documented behavior, not a bug in
the `_next` value itself. Modern browsers send a stripped,
origin-only `Referer` header (no path) on cross-domain POSTs like this
one (`strict-origin-when-cross-origin` is now the default policy).
FormSubmit relies on that header to confirm the request's true origin;
when it's stripped, FormSubmit falls back to its own generic success
page instead of trusting `_next`. FormSubmit's help page documents
exactly this and recommends a hidden `_url` field with the exact page
URL as the fix.

**Fix**: added `<input type="hidden" name="_url" value="...">` to the
waitlist form, computed the same dynamic way as `_next` (this file is
JS-rendered, so it always reflects the real live URL regardless of
what `SITE.url` is configured to in `config.js`).

**Separately surfaced, not yet fixed**: the owner's test also revealed
the site is currently live at `https://pcman369.github.io/NBPCs-BETA/`,
which does not match `SITE.url` in `config.js`
(`.../north-bridge-pcs-v2`). Unlike this form, `contact.html` and
`services.html` bake their `_next` (and would need the same new `_url`
field baked in too) from that static `SITE.url` value at build time —
so if `NBPCs-BETA` really is the current live path, those two forms'
redirects are currently pointing at the wrong place, not just showing
FormSubmit's generic page. Left alone pending the owner's answer on
whether `NBPCs-BETA` is the value to bake in now, since a prior session
explicitly decided to leave the "beta" canonical URL alone rather than
keep chasing a moving target — see "Still open" below.

**Verified**: re-rendered the component simulating the exact reported
live URL (`https://pcman369.github.io/NBPCs-BETA/builds.html`) and
confirmed both `_next` and the new `_url` compute correctly; HTML
tag-balance check on the output; full JS syntax sweep; `stitch.py`
rebuild in a scratch copy — byte-identical output for all 10 pages
(confirming this JS-only change didn't touch anything build-related).

**Decided by:** owner's live-browser test report.

---

### D18 — SITE_URL synced to the live testing path; `_url` field added to the other FormSubmit forms

**Context**: D17 left the SITE_URL-vs-actual-deployed-path mismatch as
an open question rather than deciding it unilaterally. Owner confirmed
the D17 `_url` fix works (tested successfully across multiple devices)
and gave explicit direction: sync `SITE.url` to the current live path
now, since it's also useful for testing, understanding they'll change
it again later when the final domain/repo is settled.

**Changed**:
- `config.js`: `SITE.url` updated from the `north-bridge-pcs-v2`
  placeholder to `https://pcman369.github.io/NBPCs-BETA` (the owner's
  confirmed current live path).
- `pages-src/contact.html` and `pages-src/services.html`: added the
  same `_url` hidden field D17 added to the waitlist form (same
  FormSubmit-recommended fix for the browser referrer-stripping
  issue), baked from `{{SITE_URL}}` like the existing `_next` field.
- `buildDetail.js` (per-build inquiry form): added the same `_url`
  field, computed dynamically like the waitlist form since this is
  JS-rendered rather than a static `pages-src` page.
- Ran `stitch.py` for real this time and confirmed the root HTML
  reflects it — an earlier pass had only verified the rebuild in
  scratch copies without applying it to the actual project files,
  which a repeat diff caught before shipping.

**Note for later**: the owner has said they'll update `SITE.url` again
once the final domain/repo is settled — this is intentionally not a
"final" value, just the current best one for live testing. No
functional difference in `stitch.py` or the token system either way;
it's a one-line config change whenever that happens (see D10).

**Verified**: fresh `stitch.py` rebuild in a scratch copy is
byte-identical to the actual project's root files (confirms nothing
stale); zero remaining references to the old URL anywhere in the
project; HTML tag-balance check on `contact.html`/`services.html`
output — both fully balanced; both forms have all six FormSubmit
hidden fields present exactly once; full JS syntax sweep across the
project.

**Decided by:** explicit owner instruction, after confirming the D17
fix works live.

---

### D19 — Batch 2: keyboard-accessible galleries + aria-live form status

**Scope**: per the owner's batch plan — (1) make gallery controls
keyboard accessible, (2) add `aria-live` to dynamic form status
messages. No visual changes.

**Gallery keyboard access**: `.gallery-item` (`gallery.html`'s grid,
`galleryGrid.js`) and `.gallery-thumb` (`build.html`'s thumbnail strip,
`buildDetail.js`) were plain `<div>`s with only a `click` listener — a
keyboard-only visitor couldn't reach them at all, and on `gallery.html`
that meant the lightbox was completely unreachable without a mouse.
Added `tabindex="0"`, `role="button"`, and a descriptive `aria-label`
to each, plus a `keydown` handler that treats Enter/Space the same as
a click (with `preventDefault()` on Space so the page doesn't scroll).
`build.html`'s existing prev/next `<button>`s were already fine and
weren't touched.

**Form status aria-live**: confirmed via a full-project search that
`aria-live`/`role="alert"`/`role="status"` appeared nowhere before this
— every "message sent" confirmation was silent to screen readers.
Added `role="status" aria-live="polite" aria-atomic="true"` to all four
real submission forms (`contact.html`, `services.html`, the
build-detail inquiry form, the waitlist). For `contact.html`/
`services.html`/the inquiry form, the attributes go directly on the
`<form>` tag, since only its `innerHTML` is swapped on success — the
form element itself persists, which is what a live region requires.
The waitlist is different: `wireNotifyBox()` replaces `#notify-box`
itself (`outerHTML`, not `innerHTML`) with the success markup, so
putting the live-region attributes on `#notify-box` would have broken
on that exact swap. Instead added a `display:contents` wrapper
(`#notify-region`) around it — adds no layout box of its own (visually
identical either way), but gives the live region a stable node that
survives the inner swap. `part-boxes.html`'s order form was
deliberately left out of this pass — it's still on the older
JS-only-submit pattern (flagged separately, not yet converted to the
same reliable form pattern as the other four) and dormant with no real
inventory yet; revisit its accessibility once its reliability fix
happens.

**Verified**: installed `jsdom` temporarily (removed after) to test in
a real DOM rather than just reading the code — confirmed Enter and
Space both open the lightbox / advance the gallery, Space doesn't
scroll the page, other keys and Tab don't falsely trigger anything,
and plain click still works unchanged. Confirmed by node identity that
the aria-live container survives each swap (the `<form>` elements and
the new `#notify-region` wrapper are literally the same DOM node
before and after their respective success-state swaps, which is what
makes the announcement work at all). Full JS syntax sweep, HTML
tag-balance check on every page, and a `stitch.py` rebuild diffed
byte-for-byte against the shipped files.

**Decided by:** owner's Batch 2 instructions, following the original
audit's A1/B3 findings.

---

### D20 — Batch 3: lightbox focus management

**Scope**: per the owner's batch plan — move focus in on open, trap it
inside while open, restore it on close, keep Escape working. No visual
changes. Applies to the one shared lightbox in `galleryGrid.js` (used
by `gallery.html`); `build.html`'s gallery is a different, simpler
pattern (main image + thumbnail strip, no modal) and wasn't in scope.

**Changed** (`js/render/galleryGrid.js` only):
- `openLightbox()` now records `document.activeElement` (whichever
  grid item was actually clicked or Enter/Space-activated) before
  doing anything else, then moves focus to the close button once the
  dialog is open.
- A new `_trapLightboxFocus()` keeps Tab/Shift+Tab cycling among the
  lightbox's own buttons instead of leaking focus to the page
  underneath. It only counts buttons that are actually visible right
  now (`getComputedStyle(btn).display !== 'none'`) — prev/next are
  hidden via inline `style.display` when there's only one photo, so
  with a single photo, Tab just cycles back to the close button;
  chosen over the more common `offsetParent` check because this
  codebase always hides those buttons via `style.display`, and reading
  that back doesn't depend on a real layout engine.
- `closeLightbox()` returns focus to whatever was recorded on open —
  guarded with `document.contains(...)` first in case that element
  somehow isn't around anymore.

**Verified**: temporarily installed `jsdom` again (removed after) and
ran real-DOM scenarios rather than just reading the code: mouse-click
open/close, keyboard (Enter) open + Escape close, close via the X
button, close via clicking the dark overlay, Tab-trap wrap-around in
both directions with 3 photos, Tab from a non-boundary button doing
nothing unusual, and the single-photo case where prev/next are hidden
and Tab correctly only cycles the close button. Confirmed the Tab-trap
handler is a no-op whenever the lightbox is closed, so ordinary page
tabbing elsewhere is untouched. Full JS syntax sweep, HTML tag-balance
check, and a `stitch.py` rebuild diffed byte-for-byte against the
shipped files.

**Decided by:** owner's Batch 3 instructions, following the original
audit's C3 finding.

---

### D21 — Batch 4: touch target sizes

**Scope**: per the owner's batch plan — review interactive controls for
touch target size, bring undersized ones toward a comfortable size
without redesigning or adding bulk.

**Method**: rather than relying on memory from the earlier audit,
re-swept every CSS rule setting an explicit small width/height, then
checked each one's actual markup to separate real interactive controls
from decorative badges (numbered circles like `.step-num`/`.pl-num`,
the FAQ's icon, a video-overlay icon with `pointer-events:none`) —
none of those are themselves clickable, so they were left alone. Also
confirmed nav links and the FAQ accordion row are already comfortably
sized as full-width tappable rows, and `.lightbox-close`/`.back-to-top`
were already 44×44.

**Changed** — four real icon-only buttons that were under the 44×44
comfort threshold, all fixed by adjusting `min-width`/`min-height` or
`width`/`height` only (no layout, spacing, or visual-glyph changes):
- `.hamburger` (mobile nav toggle): effective clickable area was
  ~38×32px (22px icon + 8px padding). Added `min-width`/`min-height:
  44px` plus `align-items`/`justify-content: center` so the same
  3-line icon glyph stays centered in the now-larger button.
- `.gallery-arrow` (`build.html`'s prev/next buttons): 38×38 → 44×44.
- `.lightbox-arrow` at the ≤640px breakpoint only (`gallery.html`'s
  lightbox prev/next): 40×40 → 44×44. Desktop was already 48×48,
  untouched.
- `.qty-btn` (part-boxes quantity stepper, still dormant/no real
  inventory yet): 34×34 → 44×44. `.qty-input` between them stretches
  to match automatically (`align-items: stretch` on the shared row),
  so the whole stepper grows together rather than looking mismatched.

**Verified**: confirmed via text search that no other rule anywhere
overrides these sizes at any breakpoint; full JS syntax sweep (no JS
touched, but checked regardless); `stitch.py` rebuild diffed
byte-for-byte against the shipped files. This was a CSS-only change,
so there was nothing for `jsdom` to usefully test — verified by
reading the resulting computed values directly instead.

**Decided by:** owner's Batch 4 instructions, following the original
audit's C2 finding.

---

### D22 — Special task: homepage gallery-preview now sourced from `builds.js` directly (sold-PC fallback)

**Scope**: per the owner's plan — homepage gallery prioritizes
available-PC media, falls back to sold/completed builds when nothing's
available, empty state if neither, no duplicated data, no manual
homepage edits needed as inventory changes, both photos and video
clips supported. This is the same item long-tracked as "homepage
gallery-preview logic."

**Correction while investigating**: earlier in this project (including
this session) `js/data/builds.js` was believed to have a 4th,
available build. Re-reading the actual file (not a keyword search
across it) showed that entry is inside the file's top-of-file
documentation comment — a copy-paste template showing how to add a
new PC, not a live entry. The real `const builds = [...]` array
(starting after the comment closes) has always had exactly 3 builds,
all `status: "sold"`. Noted here so this doesn't get miscounted again.

**Problem**: the homepage's gallery preview read from `js/data/gallery.js`
(`currentBuilds`/`completedBuilds`) — a separate, hand-maintained photo
list duplicating what's already in `builds.js`'s own `media` field per
build. It combined the first 3 entries from both arrays with no regard
for availability, and had already drifted out of sync (missing photos
for at least one build that existed in `builds.js` but was never added
to `gallery.js`) — concrete proof the duplication was a real, live
maintenance risk, not just a theoretical one.

**Fix** (`pages-src/index.html` — the inline script, script list, and
head `<link>`s):
- New logic reads `builds.js` directly: filters to `status: "available"`
  first; if that set has no usable media, falls back to `status: "sold"`;
  shows the existing "Photos coming soon" empty state if neither has
  any. Each build's `media.images` and `media.videos` are combined into
  the same `{type, src, poster, alt}` shape `buildDetail.js` already
  uses, capped at 3 total. Alt text is synthesized from the build's
  title (gallery.js's hand-written alt text is no longer used here).
- Now calls the shared `renderGalleryGrid()` (`galleryGrid.js`) instead
  of a third hand-rolled copy of "build a grid of `.gallery-item`
  divs." As a direct consequence, the homepage preview is now
  click-to-enlarge with the same lightbox as `gallery.html` — it wasn't
  interactive at all before (no click handler existed). Flagging this
  clearly since it wasn't explicitly asked for: it's a natural result
  of reusing the already-hardened shared component rather than writing
  a 3rd non-interactive variant, and it's the same visual grid either
  way — nothing about it looks different, it's just now clickable.
- `<script src="js/data/gallery.js">` removed from `pages-src/index.html`
  (no longer used there) and replaced with
  `<script src="js/render/galleryGrid.js">`; added
  `<link rel="stylesheet" href="css/gallery.css">` so the lightbox is
  actually styled when opened from the homepage (it previously wasn't
  loaded there at all, since only `gallery.html` used the lightbox).
- `gallery.html` itself is untouched — it's a separate, intentionally
  curated page (not just "current inventory"), so it keeps reading
  `gallery.js` as its own deliberate list.

**Video support** (`galleryGrid.js`, needed for the fix above to
genuinely satisfy "preserve support for video/clips," not just claim
to): the grid and lightbox previously only knew how to render `<img>`.
Added a `type: 'video'` branch throughout — grid thumbnails show the
video's poster (or a generic placeholder icon if no poster is set,
rather than trying to load a video file as an `<img src>`, which
doesn't reliably work); the lightbox now has a `<video controls>`
alongside the `<img>`, toggling which is visible per item; the Tab-trap
now also recognizes a visible `video[controls]` as part of its
focusable set, so a lightbox showing only a single video (no prev/next)
still traps Tab correctly between the close button and the video
instead of leaking focus past it. Every build's `videos` array is
currently empty, so none of this changes anything visible today — it's
there so a real clip drops in automatically the next time inventory
changes, same as photos already do.

**Verified**: temporarily installed `jsdom` (removed after) and tested
against the actual `builds.js` file, not synthetic data, for the
real-world case — confirmed it correctly falls back to sold-build
photos (3 sold, 0 available is the real current state) with correct
"previously sold" alt-text suffixing. Separately tested, with
hand-built data (since current inventory doesn't exercise every path):
an available build correctly takes priority over a sold one; an
available build with zero photos correctly still falls through to the
sold fallback rather than showing nothing; a fully-empty inventory
correctly shows the empty state; a mixed image+video build correctly
caps at 3 total; opening a video item correctly shows the video and
hides the image (and vice versa); closing correctly pauses playback;
the Tab-trap correctly includes the video element when it's the only
other visible control. One thing `jsdom` can't verify at all — it
doesn't implement real browser tab-key focus traversal between
non-boundary elements — so ordinary (non-wrapping) Tab movement relies
on standard browser behavior rather than being independently confirmed
here. Full JS syntax sweep, HTML tag-balance check on the rebuilt
`index.html`, and a `stitch.py` rebuild diffed byte-for-byte against
the shipped files.

**Decided by:** owner's special-task instructions, following the
original audit's finding on `gallery.js`/`builds.js` duplication risk.

---

### D23 — Redesign Batch 1: homepage visual redesign ("Forge" direction)

**Context**: after the design-review phase and three disposable visual
prototypes, owner chose Prototype 3 ("Forge" — dark, amber accent,
Bricolage Grotesque/Manrope/Space Mono type system, photography-led,
evidence-based trust) as the foundation for a real redesign. Explicit
instruction: preserve the data/build architecture, but restructure
presentation-level HTML where it's inherently tied to the old visual
language (icon+heading+description cards, numbered circles). Batch 1
scope: homepage only.

**Architecture decision — isolation strategy**: rather than editing
`tokens.css`/`base.css`/`style.css` in place (which would instantly
change every other page's colors, since they're shared), added a new
`css/homepage-forge.css`, loaded only by `index.html`, that redefines
the site's existing CSS custom properties (`--bg`, `--accent`, etc.)
scoped under a new `body.theme-forge` class. This re-themes every
shared component (header, footer, nav, buttons, forms) automatically
via the cascade, with zero changes to the shared stylesheets — that's
exactly what the token system was built for. New typography tokens
(`--font-heading`/`--font-mono`, new concepts) follow the same
pattern. Confirmed by direct diff: all 9 other pages are byte-for-byte
identical to before this batch; nothing outside `index.html` and the
new CSS file references `theme-forge` anywhere.

**A real structural conflict found and resolved**: `#trust-cards` and
`#process-steps` (the old "Why North Bridge PCs" cards and 5-step
numbered-circle process) are populated by `js/render/trustSection.js`
— which is **shared with `build.html`**. Restructuring that file's
output would have redesigned build.html's trust section too, violating
the "homepage only" scope. Resolved by no longer calling that shared
function from `index.html` at all (removed the script tag and the two
container divs) and writing new, homepage-only markup instead — the
file itself and build.html's usage of it are completely untouched.
Same reasoning applied to `buildCard.js`'s `renderEmptyBuildsState()`:
confirmed via grep that only `index.html` calls it (`builds.html` uses
`renderNotifyBox()` for its own empty state instead), so it was safe
to restyle directly without any risk to `builds.html`.

**Changed** (`pages-src/index.html`, `js/render/buildCard.js`,
new `css/homepage-forge.css`):
- Hero: full-bleed-leaning photo treatment (dark scrim, text overlaid
  at the bottom on desktop; stacks normally on mobile/tablet). Same
  `onerror` fallback mechanism as before for the still-missing hero
  photo, with non-developer-facing placeholder copy ("Photo coming
  soon" instead of "Add hero-build.jpg to the images folder" — this
  was already a flagged issue from the original audit, fixed as a
  natural side effect of touching this section anyway).
- Replaced the old "Why North Bridge PCs" cards + separate "Testing &
  Setup Process" numbered-circle section with **one** new "Evidence"
  section: a bold lead statement plus a plain, non-circular checklist
  of the same 5 real testing steps. Built entirely from the exact same
  real facts already in `trustSection.js` — nothing invented, just
  restructured, and the two old sections' redundancy is gone.
- "Custom Builds Around Your Budget": replaced the numbered-circle
  process list and highlight-box pricing cards with a plain divided
  list and a dense monospace price/description table. Same real copy.
- Gallery preview: zero changes to the JS/data logic (D22's
  available-first/sold-fallback/video-support behavior is completely
  untouched) — only a new CSS-only asymmetric grid (one large photo +
  two smaller ones) via `:nth-child` spans, scoped to `theme-forge`.
- FAQ, waitlist form, back-to-top, nav, footer: unchanged structurally,
  re-themed automatically via the token cascade plus a few explicit
  overrides (see below).

**Contrast fix required**: the old accent-driven components
(`.btn-primary`, `.back-to-top`) hardcode `color: white` on top of
`var(--accent-h)` — safe with the old blue, but white-on-amber fails
contrast badly. Overrode those specific rules to dark text
(`#1a1200`) within the new scope, matching what already worked well
in the approved prototype.

**Hardcoded-blue sweep**: searched the whole stylesheet for
`rgba(59,130,246,...)` (the old blue, written as raw rgba instead of
a token in several places) and found it in more places than expected:
`.hero-eyebrow`, `.faq-icon`, `.faq-item.open`, `.form-privacy`,
`.build-perf`, `.nav-link.active`/`.nav-dropdown-link.active`/
`.nav-sublink.active`, on top of the buttons/back-to-top already
mentioned. All overridden to amber-tinted equivalents within
`theme-forge`. `.build-perf` doesn't render today (no available
builds) but was fixed anyway for whenever inventory appears.

**Bugs found and fixed during verification** (real screenshots, not
just code review):
- The empty-state box only filled one column of the underlying
  3-column `.builds-grid`, leaving a large empty gap — added
  `grid-column: 1 / -1` plus a max-width so it reads as one centered
  box instead.
- On mobile/tablet, the hero headline visually overlapped the photo
  placeholder. Root cause: `.hero-copy` was nested *inside*
  `.hero-media-frame`, whose `aspect-ratio` + `overflow: hidden`
  prevented it from growing to fit the copy's content, so the two
  overlapped instead of stacking. Fixed by making `.hero-copy` a
  sibling of `.hero-media-frame` instead of a child, with
  `.hero-inner` as their shared positioning context — confirmed via
  computed-style inspection before and after, not just visually.
- A first attempt at a full-page screenshot of the hero looked broken
  (image tiny, oddly placed) even though computed styles were already
  correct — a `full_page=True` capture artifact specific to the
  `vh`-based hero height, not a real bug. Confirmed by cross-checking
  a plain viewport screenshot and `getBoundingClientRect()` directly.
  Switched to segment-by-segment viewport screenshots for the rest of
  the review to avoid the same artifact recurring.

**Verified**: real Chromium rendering (Playwright) at desktop
(1440px), tablet (768px), and mobile (390px), plus the mobile nav open
state and the FAQ open state — not just code inspection. Zero
horizontal overflow at any breakpoint (checked via
`scrollWidth`, not just visually). Full JS syntax sweep, HTML
tag-balance check, `stitch.py` rebuild diffed byte-for-byte against
shipped files for all 10 pages, and an explicit diff confirming the 9
non-homepage pages are unchanged.

**Decided by:** owner's redesign-implementation instructions (Batch 1
of the "keep the engine, redesign the body" plan).

---

### D24 — Redesign Batch 2: rest of the site, same "Forge" direction

**Context:** With D23 (homepage) shipped and approved as a direction,
owner asked for the remaining 9 customer-facing pages redesigned in
one pass — not the page-by-page/owner-sign-off-between-each-page
approach Batch 1 used, since the direction itself was already settled.

**What changed:**
- `css/homepage-forge.css` renamed to `css/theme.css`, and every rule
  unscoped from `body.theme-forge` to a plain global selector. That
  class doesn't exist anywhere in the codebase anymore. Every page
  (not just the homepage) now loads `theme.css` as its last
  stylesheet, so the dark/amber palette applies sitewide.
- New hardcoded-blue sweep entries only reachable from the other 9
  pages: `.page-hero`'s background gradient, `.tier-badge`,
  `.box-category`, `.listing-perf-card`, `.listing-system-badge`,
  `.listing-form-card`. Same reasoning as D23's sweep — these set a
  raw `rgba(59,130,246,...)` instead of referencing a token, so they
  didn't pick up the palette change automatically.
- `js/render/trustSection.js` — the shared "Why North Bridge PCs"
  content — was redesigned directly, per the finding recorded in the
  Batch 2 plan: it had exactly one remaining caller (`build.html`,
  via `buildDetail.js`) since D23 already moved the homepage onto its
  own hardcoded evidence section. The old output (3 icon+heading+
  description cards, then a numbered-circle 5-step strip under a
  second heading) is replaced by one `renderTrustEvidence()` function
  that outputs the same `.evidence` lead-statement-plus-checklist
  pattern already shipped on the homepage — and reuses that exact
  copy verbatim, since it's the same real facts already written and
  approved once. `buildDetail.js` was updated to call it and to drop
  the now-unnecessary `.listing-process` box wrapper.
- `custom-build.html`'s 6-step "How a Custom Build Works" list: the
  numbered-circle `.process-list`/`.pl-num` markup is replaced with
  the `.cb-list`/`.cb-row` divided-list pattern (the same one the
  homepage uses for its custom-builds section) — plain mono step
  numbers (`01`–`06`) inline with each heading instead of filled
  circles. The `h3` on each step was kept (not flattened to a plain
  `<strong>`), so the page's heading hierarchy is unchanged. Tier
  cards (the 3-column pricing examples) kept their existing markup —
  only their badge/border colors were re-themed via `theme.css`; a
  full restructure wasn't judged necessary since they're not an
  icon-card or numbered-circle pattern, just a card with real
  structured content (features list, price, CTA) that a plain list
  would have flattened awkwardly.
- `contact.html`'s 4 `.contact-info-card` boxes (Response Time,
  Pickup Location, Custom Builds, Linux Available) are replaced with
  the same `.cb-list`/`.cb-row` pattern — no icon, no numbered circle,
  but a boxed-card treatment for 4 one-line facts didn't fit Forge's
  "plain divided list over card grid" language either. The `h2` on
  each item was kept as `h2` specifically to preserve the
  heading-hierarchy fix from the post-audit accessibility pass (those
  were promoted from `h3` to `h2` in that earlier work — see the
  Phase 7 testing section above).
- `about.html` got one small, low-risk addition: a `.lede` utility
  class (new, not tied to removing any old pattern) on the opening
  paragraph for a bit of editorial weight. No copy changes.
- `services.html`, `builds.html`, `build.html`, `gallery.html`,
  `faq.html`, `part-boxes.html` needed no markup restructuring at
  all — every card/grid on those pages already reads its colors from
  CSS custom properties, so they re-themed automatically once
  `theme.css` was linked. This was confirmed by grep before assuming
  it, not just assumed: a sweep for the old card/icon/numbered-circle
  class names (`card-icon`, `process-list`, `process-step`,
  `tier-card`, `contact-info-card`, bare `class="card"`) turned up
  exactly the instances listed above and nothing else.
- Dead CSS from every removed pattern was deleted, not left behind:
  `.card-icon`, `.process-list`/`.process-list-item`/`.pl-num`/
  `.pl-content`, `.process-steps`/`.process-step`/`.step-num`/
  `.step-icon` (including all 4 of its responsive-breakpoint
  overrides), and `.listing-process` are gone from
  `style.css`/`build-detail.css`. Confirmed via grep that nothing in
  any HTML or JS file referenced them before removing them.

**Verified:** `stitch.py` rebuild succeeded for all 10 pages, no
stale `homepage-forge`/`theme-forge` references and no unfilled
`{{...}}` build tokens left in the output. Every JS file in the
project passes `node --check`. Every CSS file touched this batch
parses cleanly under a real CSS parser (not just brace-counting —
a brace-matching mistake made mid-edit while removing dead CSS was
caught this way and fixed immediately). A jsdom-based smoke test
(`smoke-test.js`, left in the repo root for reuse) loads all 10 built
pages, executes their real scripts, and asserts on the resulting DOM:
no script errors on any page, the homepage's `theme-forge` class is
gone, `custom-build.html` has exactly 6 `.cb-row` steps and zero
`.process-list` markup, `contact.html` has exactly 4 `.cb-row` items
and zero `.contact-info-card` markup, and — loading
`build.html?id=may26-01` (a real inventory entry, not a placeholder)
— the evidence section renders with exactly 5 rows and zero leftover
`.card`/`.process-steps` markup in the trust section.

**Also verified, in a follow-up pass — real Chromium rendering.** The
first pass of this batch (write-up above, kept as-is for the record)
tried real-browser verification via `npx playwright install chromium`
(Node/npm route) and that download failed cleanly — looked like a
genuine environment limitation at the time. It wasn't: the correct
route in this sandbox is Python, not Node. `pip install playwright
--break-system-packages` came back "Requirement already satisfied"
(the package is pre-baked into the image), and
`python3 -m playwright install chromium` succeeded silently because
the browser binary is *also* pre-baked, at a non-default location the
`PLAYWRIGHT_BROWSERS_PATH` environment variable points to
(`/opt/pw-browsers`) — not the default `~/.cache/ms-playwright` the
Node CLI checks, which is why that route failed while this one
didn't. **For any future session that needs real-browser verification
in this environment: use `python3 -m playwright install chromium` +
Playwright's Python API, not the Node/npx CLI.**

With that working, all 10 pages were screenshotted at desktop
(1440px), tablet (768px), and mobile (390px) — 30 screenshots total —
plus a `scrollWidth` vs `clientWidth` check at every breakpoint on
every page. Zero horizontal overflow anywhere. Visual spot-check
confirmed: the evidence section on `build.html` renders correctly
(lead statement, 5-row checklist, no leftover card/circle markup);
`custom-build.html`'s `cb-list` steps and re-themed tier cards
(amber badge, amber highlight border on the featured tier) render
correctly at all 3 breakpoints, tier cards collapsing to one column
on mobile; `contact.html`'s info list sits cleanly alongside the form
card; the unscoped asymmetric gallery-grid rule (first item spanning
2×2) now applies correctly to `gallery.html`'s real grids, not just
the homepage preview; and the pages that got no markup changes
(`services.html`, `builds.html`, `faq.html`, `part-boxes.html`,
`about.html`) all re-themed automatically exactly as predicted, with
no visual regressions. One cosmetic-only caveat: Google Fonts
(Bricolage Grotesque/Manrope/Space Mono) don't load in this sandbox
(no network access to `fonts.googleapis.com`), so screenshots show
system-font fallback — this is a sandbox artifact, not a site bug;
production will load the real fonts. Screenshots themselves weren't
saved into the repo (a point-in-time QA artifact, not a project
file), but the script that generates them was: `visual-check.py` in
the repo root. Re-run it after future visual changes rather than
trusting old screenshots.

**Decided by:** owner's redesign-implementation instructions ("start
Batch 2" — the remaining 9-page redesign, all in one pass).

---

### D25 — 404.html: built, follows site design, excluded from sitemap

**Context:** Never actually built (TODO.md item, `ARCHITECTURE.md`'s
directory layout mentioned one but it didn't exist) — owner asked for
it, "simple, but following the site design."

**What it is:** `pages-src/404.html`, built through the normal
`stitch.py` pipeline like every other page (shared header/footer,
`theme.css`), so it can't visually drift from the rest of the site
over time. Content is the same `.empty-state` card pattern already
used for `build.html`'s "System Not Found" state and
`part-boxes.html`'s empty inventory state (icon, heading, one line of
text, two buttons) — reusing an established, already-centered pattern
rather than inventing a one-off layout, in the spirit of "simple."
Buttons go to the homepage and the gaming-PC listings.

**Follow-up (same day):** the initial version used an emoji (a
compass) for the icon, matching the emoji used in the other
`.empty-state` instances sitewide. Owner asked for it removed —
emoji glyphs are drawn by the operating system, not the page, so the
same character can look noticeably different (or, on older systems,
fail to render as a color glyph at all) depending on the visitor's
device. Replaced with a plain `404` numeral in the site's own mono
font (`--font-mono`, i.e. Space Mono) at accent color — a new
`.error-code` class in `theme.css`, specific to this page rather than
a change to the shared `.empty-icon` class other pages still use.
Since it's just styled type in an already-loaded web font rather than
a font-dependent glyph, it renders identically everywhere. The other
`.empty-state` instances (`build.html`, `part-boxes.html`) still use
their emoji icons — owner only asked about this page, so that's the
intentionally scoped fix rather than a sitewide sweep. Worth revisiting
if the same OS-inconsistency concern applies there too, but that's the
owner's call to raise, not an assumption to make on their behalf.

**Two things needed to *not* just fall out of the normal page
pipeline, handled deliberately:**
- No nav item should show as active — a `<!--HEADER:404-->` page-id
  that matches nothing in `header.html`'s `{{active:...}}`/
  `{{activegroup:...}}` tokens achieves this for free, no special-
  casing needed.
- A 404 page shouldn't be indexed or listed as real content. Two
  parts: a `<meta name="robots" content="noindex, follow">` tag
  directly in the page (not generated by the reusable `<!--SEO-->`
  block, which is skipped here — a canonical/OG/structured-data set
  for an error page doesn't make sense), and `stitch.py` itself now
  excludes `404.html` by name from the `sitemap.xml` it generates,
  while still giving it the full header/footer/token-replacement
  treatment every other page gets.

**Verified:** `stitch.py` rebuild (11 pages now); `sitemap.xml`
confirmed to list the other 10 and not this one; `smoke-test.js`
extended with checks for the empty-state card, the noindex tag, and
zero active nav items, all passing; real-Chromium screenshots at
desktop and mobile confirm it matches the site's dark/amber design
and has no layout issues.

**Decided by:** owner ("A 404.html sounds good, do that. simple, but
following the site design").

---

### D26 — Every decorative emoji sitewide replaced with inline SVG icons

**Context:** Owner asked for the 404 page's compass emoji removed
first (see D25's follow-up note), then asked for the same treatment
everywhere else: "swap the other emojis, keeping the general theme and
style of the site." Reasoning throughout: emoji glyphs are drawn by
the visitor's operating system, not the page, so the same character
can look noticeably different — or fail to render as a color glyph at
all on older systems — depending on the device. This affected every
page, not just one.

**Full inventory (grep-confirmed complete before starting, and
re-confirmed at zero remaining afterward):** 17 occurrences across 9
files, six distinct icons:
- Desktop/monitor (hero photo placeholder, two different "no builds"
  empty states, build-detail "not found" and gallery placeholder) —
  `pages-src/index.html`, `js/render/buildCard.js` (×2),
  `js/render/buildDetail.js` (×2)
- Camera (gallery "no photos" placeholder, ×2 spots) and clapperboard
  (gallery video-without-thumbnail placeholder) —
  `js/render/galleryGrid.js`
- Package/box (part-box image placeholder ×2, empty inventory state) —
  `js/render/partBoxCard.js`
- Play triangle (video badge overlay on gallery thumbnails, ×2 spots)
  — `js/render/galleryGrid.js`, `js/render/buildDetail.js`
- Checkmark (form-success confirmation, ×5 spots) —
  `js/render/notifyBox.js`, `js/render/partBoxOrder.js`,
  `js/render/buildDetail.js`, `pages-src/contact.html`,
  `pages-src/services.html`

**Two different replacement approaches, deliberately:**
- **Checkmark → plain `✓` character (`&#10003;`), not an SVG,** styled
  `color:var(--accent)`. This isn't a new pattern — it's the *same*
  character already used for tier-card feature-list bullets
  (`.tier-features li::before` in `style.css`, styled
  `var(--accent-text)`), which was already proven to render
  consistently: it's a plain Dingbat-block character, not one with an
  emoji-style default presentation the way ✅ (U+2705) has, so it
  doesn't have the problem being fixed in the first place. Reusing an
  already-established sitewide pattern beat inventing a new one, in
  the spirit of "keeping the general theme and style."
- **Everything else → small inline SVGs,** `width="1em" height="1em"`
  so each one scales with whatever `font-size` its container already
  sets (no need to hunt down and hardcode the ~8 different existing
  sizes), `stroke="currentColor"`/`fill="currentColor"` so each one
  picks up whatever `color` its container already sets. Every
  container involved already had an explicit or sensibly-inherited
  color (`.box-img-placeholder`/`.gallery-main-placeholder`:
  `var(--dim)`; `.gallery-item-video-icon`/`.gallery-thumb-video-icon`:
  `white`, deliberately, since they sit on top of photos), so no new
  CSS rules were needed to get correct, theme-consistent coloring —
  only the markup itself changed. Style is simple line-art (1.5px
  stroke, rounded joins) rather than filled/detailed icons, matching
  the site's existing minimal, geometric feel rather than introducing
  a busier icon style.

**The one real complication: two of these seventeen sit inside
`onerror="..."` attributes** (`buildCard.js`, `galleryGrid.js`,
`partBoxCard.js` — one each), which is HTML embedded inside an HTML
attribute value embedded inside a JS string embedded inside a JS
string. An SVG's own `"`-quoted attributes (`viewBox="0 0 24 24"`,
etc.) can't be written literally at that depth — the browser's HTML
parser would read the first `"` inside the SVG as closing the
*outer* `onerror="..."` attribute early, silently truncating
everything after it. Fixed by writing those three SVGs' attribute
quotes as `&quot;` instead of `"` — the HTML parser decodes that back
to a literal `"` when it first reads the `onerror` attribute's value,
before the browser ever executes the handler, so by the time the
`onerror` code actually runs (on a real image-load failure) it sees
correctly-quoted SVG markup. This is standard, correct HTML
entity-decoding behavior, not a workaround.

**Verified:** every touched JS file passes `node --check`; a full
grep for all the old emoji entities came back empty; `stitch.py`
rebuild succeeded (11 pages); `smoke-test.js` passes with zero script
errors on every page; a full-site overflow re-check at desktop width
came back clean. The two trickiest, `onerror`-nested cases (the ones
actually at risk from the quoting problem above) were verified with a
dedicated real-Chromium test that deliberately points at nonexistent
image files, waits for the real `onerror` handler to actually fire,
and inspects the resulting DOM — confirming exactly one well-formed
`<svg>` element lands in each fallback, with no JS errors beyond the
expected "file not found" network messages. Real-Chromium screenshots
of the homepage hero, "no builds" empty state, gallery placeholder,
and part-boxes empty state confirm all four read cleanly and
consistently against the dark/amber palette.

**Decided by:** owner ("plz do swap the other emojis, keeping the
general theme and style of the site").

---

### D27 — Full-site QA/visual audit, then 7 concrete fixes

**Context:** Owner asked for a full customer-facing audit (all page
types, desktop+mobile, broken links/forms/JS, accessibility,
responsive issues, content/wording, SEO) as an audit-only pass —
explicitly no fixes yet. Live site (GitHub Pages) couldn't be
screenshotted directly — this sandbox's browser has no network route
to `*.github.io` (confirmed: `host_not_allowed`) — but its text
content was fetchable and matched the local files closely, so the
audit ran against local files rendered in real Chromium, with that
caveat stated upfront. Method: `axe-core` injected into every page at
real desktop/mobile viewports, plus a full internal-link crawl, console/
network error capture, and manual screenshot review. Findings were
reported as Must Fix / Should Fix / Minor, with a screenshots-only ZIP
delivered separately (no source/notes, per owner's request).

Owner then asked for 6 of those findings fixed, explicitly *not* as a
redesign pass — same layouts/content/visual direction, targeted fixes
only:

1. **`.nav-cta`/`.skip-link` contrast (Must Fix).** White text on the
   amber accent measured 2.04:1 (need 4.5:1) — badly fails, and it's
   the header "Contact" button, present on every page. Root cause:
   `--accent-h` was a genuinely darker shade than `--accent` under the
   old blue palette, so white text worked; under Forge (D23/D24) it's
   identical to `--accent`, so that assumption silently broke. Fixed
   by reusing the dark text (`#1a1200`) already proven on
   `.btn-primary`/`.back-to-top` for the same reason — 9.13:1 at rest,
   6.1:1 on hover. Bonus catch: white on the hover/active shade was
   *also* failing (3.04:1), not caught by the original audit since a
   static contrast scan doesn't simulate `:hover`.
2. **Heading-order skips (Should Fix), 3 separate spots.** Evidence-row
   `h4` retargeted to `h3` (homepage's own markup + the shared
   `trustSection.js`, so both homepage and build.html got fixed
   together) — was jumping straight from the section's `h2`. Empty-
   state headings retargeted `h3`→`h2` in `notifyBox.js` (builds.html)
   and `partBoxCard.js` (part-boxes.html) — both were jumping straight
   from the page's own `h1` with nothing at `h2`. FAQ questions
   retargeted `h3`→`h2` in `faqList.js` — same pattern. Every one of
   these had its own explicit CSS selector (not relying on the tag's
   global default size), so the selectors were updated alongside the
   markup — confirmed visually unchanged, only the semantic level
   moved.
3. **Two in-text links with no non-color distinguishing feature
   (Should Fix).** The notify-box's "custom builds" link (`notifyBox.js`)
   had zero styling at all — not even a color difference from the
   surrounding paragraph. Services' "general contact page" link had
   color only. Both now get `text-decoration: underline` added
   alongside `color:var(--accent)`, so both read the same way and
   don't rely on color alone.
4. **Invalid `role="status"` on `<form>` (Should Fix), contact.html +
   services.html.** `role="status"` isn't an allowed ARIA role for a
   `<form>` element. Fix was simpler than expected: `aria-live`/
   `aria-atomic` are global ARIA attributes that don't need a role to
   function at all, so the fix was just deleting `role="status"` and
   keeping the rest — the same JS (`form.innerHTML = ...`) still
   triggers the same screen-reader announcement, now through
   spec-valid markup. **Not fixed, out of scope:** `buildDetail.js`'s
   inquiry form has the identical issue and wasn't in the owner's
   list — left alone, flagged in the report instead.
5. **build.html "not found" state had zero H1 (Should Fix).** Was
   `<h3>System Not Found</h3>` with no other heading on that page
   state (confirmed: it's an early-return branch in `buildDetail.js`
   that never reaches the normal `<h1 class="listing-title">`).
   Retagged to `<h1>` — same visual size as before (no separate CSS
   needed to preserve appearance; see the shared `.empty-state h1,
   .empty-state h2` rule added for this and item 2's part-boxes fix
   together, both replacing the old shared `.empty-state h3` rule).
6. **`.badge-sold` borderline contrast (Minor → turned out bigger than
   it looked).** The original audit calculated 4.3:1 for the badge
   text *in isolation* — borderline, hence "Minor." Verifying the
   actual fix against real rendered pixels (not just the isolated
   calculation) surfaced something the audit missed: `.build-card.
   is-sold` has `opacity:0.72` (a separate, pre-existing, intentional
   "de-emphasize sold cards" choice — left untouched), which further
   dims everything inside it. The *real* effective contrast was
   3.11:1, not 4.3:1. A small hue nudge (`#f25555`, tried first)
   verified at only 3.07:1 post-opacity — nowhere close. Reaching
   4.5:1 through that compounding genuinely needs a lighter shade, not
   a subtle one: `--danger: #fca5a5`, verified against actual rendered
   pixels at 5.15:1. This is a text-only token change; `--danger` is
   used nowhere else in the codebase (grep-confirmed both times).
   **Discovered as a side effect, fixed too (owner asked for it
   explicitly after the initial report):** the same `opacity:0.72`
   was independently dimming `.spec-label` (the "CPU"/"GPU"/etc. row
   labels) inside sold cards to a real ~3.3:1. Since `.spec-label`
   is shared with *available* (non-dimmed, already-fine) cards too,
   this couldn't be a `--dim` token change — scoped instead to
   `.build-card.is-sold .spec-label` specifically, new
   `--sold-spec-label: #b3aea1` token, verified at 4.78:1 against
   real rendered pixels.

**Verified:** `stitch.py` rebuild clean; `smoke-test.js` passes; a
fresh `axe-core` pass across all 8 affected pages (home, builds
listing, build-detail sold, build-detail not-found, part-boxes,
services, faq, contact) found zero remaining instances of any of the
6 originally-targeted violation types, plus the `.spec-label` one;
every page confirmed to have exactly one `h1`; real-Chromium
screenshots at desktop+mobile for every affected page, zero
horizontal overflow. Where a number is claimed above (contrast
ratios), it's from either the WCAG relative-luminance formula on the
actual composited colors or from sampling real rendered pixel values
with Pillow — not just reading a token's nominal hex value, which is
exactly what led the original audit's `.badge-sold` number astray in
the first place.

**Explicitly not touched, per owner's instructions:** hero image
behavior, Google Fonts, overall visual design, services page
structure, the empty inventory states, any working interaction or
data architecture.

**Decided by:** owner (full audit request, then the 6-item fix list,
then "fix the extra one you discovered" for `.spec-label`).

---

### D28 — Destination URL set; phone/email/Facebook turned on with placeholders for visual testing

**Context:** Owner confirmed the site looks fine on their own machine
after the D27 audit fixes — closes the "owner hasn't reviewed it
themselves yet" open item from PROJECT_STATUS.md/TODO.md.

Owner then asked for two things ahead of an eventual launch:

1. **`SITE.url` updated** from the `NBPCs-BETA` testing URL to
   `https://pcman369.github.io/North-Bridge-PCs` — the repo the owner
   will push this project to once it's ready, replacing the old live
   site there (no custom domain for now; can't currently afford one).
   `stitch.py` re-run: sitemap.xml, robots.txt, canonical/OG/Twitter
   tags, homepage JSON-LD, and the contact/services/build-inquiry
   forms' baked-in `_url` redirect all updated together, confirmed by
   inspecting the built output directly. This is **not yet live** —
   nothing is deployed to that repo, it's just what the build now
   points at, per the owner's plan to move it there after completion.
2. **Phone, email, and Facebook toggled on with placeholder values**
   so the owner can see how the footer looks with contact info
   populated, before deciding on real values. `features.phone` and
   `features.facebook` already existed (`541-555-0123` /
   `facebook.com/placeholder`); added a new `features.email` toggle
   (`show`/`address`, same shape as the others) since no config
   existed for *visibly displaying* an email anywhere on the site —
   `CONTACT.email` already existed but is only ever used as the
   forms' submission destination, never rendered as text. `chrome.js`
   extended to render a `mailto:` link for it in the footer alongside
   phone/Facebook, using the same "renders nothing if not both
   enabled and filled in" pattern. Placeholder used
   (`placeholder@example.com`) deliberately does not reuse
   `CONTACT.email`'s real address, since which address to show
   publicly is exactly the open question below — showing the real one
   now would presume an answer to it.
   **All three are placeholder values, not real ones — flagged inline
   in config.js comments. Must be swapped for real values (or turned
   back off) before actual launch.**

**Verified:** `stitch.py` rebuild clean (11 pages); `smoke-test.js`
all pages pass; a direct jsdom check of the built `index.html`
confirmed the footer renders exactly the three expected links
(`tel:`, `mailto:`, and the Facebook URL) with no console errors.

**Decided by:** owner.

---

### D29 — Business email decided (personal Gmail); phone/Facebook placeholders reverted, display email switched to real address

**Context:** Owner decided to use the personal Gmail for now (already
`CONTACT.email`'s real value) rather than creating a second address,
and will use inbox rules to keep it manageable. This resolves the
"Business/contact email" item that was open above.

Two config changes followed:

1. `features.phone` and `features.facebook` reverted from D28's
   placeholder testing values back to their original off state
   (`show: false`, values cleared) — the owner was done visually
   testing them and neither is a real feature yet.
2. `features.email.address` (the new D28 footer display toggle,
   previously the placeholder `placeholder@example.com`) switched to
   the real decided address, matching `CONTACT.email`. `show` stays
   `true` — this one's real now, not a placeholder.

**Verified:** `stitch.py` rebuild clean; `smoke-test.js` all pages
pass; direct jsdom check of the built homepage confirmed
`#footer-extra` now renders only the email `mailto:` link (no
phone/Facebook), with the real address.

**Decided by:** owner.

---

### D30 — V1 finishing pass, Part 1: sitewide availability notice

**Context:** Owner asked for the three remaining items to close out
the "Version 1" pass, done one at a time (implement, verify, stop,
repeat) rather than all at once. This is Part 1.

**Ask:** a small, professional notice — general, no specific
inventory claims, doesn't make the business sound bigger or smaller
than it is — telling visitors availability changes and inviting them
to message if they're unsure.

**Implementation:** one line added to `js/partials/footer.html`
(shared across all 11 pages via `stitch.py`, so one edit propagates
everywhere): *"Availability changes regularly — if you don't see
what you're looking for, or aren't sure what's currently available,
just send a message."* Placed above the existing copyright line
inside `.footer-copy`, reusing that class's existing styling
(`0.78rem`, `var(--dim)`) — no new CSS, no new visual pattern, matches
the "keep the design system intact" instruction exactly. Deliberately
avoids any number, "always in stock," "limited stock," or similar
claim — just the fact that availability moves and an invitation to
ask.

**Verified:** `stitch.py` rebuild clean; `smoke-test.js` all pages
pass; real-Chromium screenshots (Playwright) at desktop (1440px) and
mobile (390px) of the homepage, `builds.html`, `build.html`,
`services.html`, `contact.html`, `custom-build.html`, and
`part-boxes.html` — zero horizontal overflow on any page/viewport,
footer reads cleanly at both sizes (close-up screenshots of both
confirmed the notice wraps normally and doesn't crowd the nav links,
email link, or copyright line above/below it).

**Decided by:** owner (spec given directly; wording is Claude's,
within the stated constraints).

---

### D31 — V1 finishing pass, Part 2: full forms evaluation and fixes

**Ask:** evaluate every customer-facing form as a system — clear
purposes, no unnecessary fields, an "Other" option where people might
not know what fits. Preserve the build-detail inquiry form unless a
real issue turned up. Don't overcomplicate it.

**Full inventory (5 forms found):**

1. **Contact form** (contact.html)
2. **Service request form** (services.html)
3. **Build-detail inquiry form** (buildDetail.js, on build.html)
4. **Waitlist/notify form** (notifyBox.js, on builds.html)
5. **Part-boxes order form** (partBoxOrder.js, on part-boxes.html)

**Findings and fixes:**

1. **Contact form — real issue: no clear purpose.** It quietly serves
   two different intents (general questions and custom-build
   inquiries — custom-build.html has no form of its own and links
   here for everything) with no way to tell which a given message is,
   and a wall of PC-spec optional fields even for someone with a
   one-line question. Fix: added one required field at the very top,
   `reason_for_contact` — "Buying a listed system" / "Custom build" /
   "General question" / "Something else / not sure". Deliberately no
   conditional show/hide logic (would need JS the rest of this form
   doesn't require) — every existing field stays exactly as it was,
   just now labeled by intent for triage. The catch-all option covers
   the required "Other" case directly.
2. **Services form — real issue: no catch-all.** The service dropdown
   only lists the 4 actual in-house services, so a request that
   doesn't cleanly fit one of those has to force a pick or leave.
   Fix: added an "Other / not sure — I'll explain below" option,
   generated alongside the real ones so it can't drift out of sync;
   pairs with the existing required "What's Going On?" field, which
   was already the place to elaborate. No other fields touched.
3. **Build-detail inquiry form — preserved as asked, one real issue
   found.** Fields (name, email, OS, notes) are genuinely lean and
   well-scoped to "inquire about this specific system" — left alone.
   But it still had the invalid `role="status"` on its `<form>` tag
   that D27 already fixed on contact.html/services.html, explicitly
   left here at the time because it wasn't in the owner's original
   audit list (see D27 item 4). Fixed now to match — `aria-live`/
   `aria-atomic` don't need the role to work, confirmed via a direct
   DOM check (temporarily forcing a build to `status: "available"` in
   memory, since every real listing is currently sold and the form
   doesn't render at all otherwise).
4. **Waitlist/notify form — no issue found.** Minimal, single clear
   purpose, no multi-choice field that would need an "Other" option.
   Left untouched.
5. **Part-boxes order form — real issue, already flagged.** The one
   form still submitting via JS-only `fetch()` with no `<form action>`
   fallback (D19 explicitly deferred this: "revisit once that gets
   its own reliability fix"). A `fetch()`/XHR call to a third-party
   endpoint is also more commonly blocked by ad-blockers/privacy
   extensions than a plain top-level form POST, independent of the
   JS-availability question. Converted to the same real-form pattern
   as every other form: added `method`/`action` (build-time tokens),
   the standard hidden fields, `name`/`email` attributes on the
   visible inputs (they only had `id` before — never actually
   submittable), and two new hidden fields (`items_requested`,
   `estimated_total`) that `updateSummary()` keeps in sync on every
   quantity change so the real POST always matches the visible
   summary. This let the old custom fetch/JSON/error-handling logic
   in `partBoxOrder.js` be deleted rather than patched — net simpler,
   not more complex, and now shares the aria-live confirmation pattern
   the other four forms already had (D19 had explicitly excluded this
   form from that treatment for the same reason). The confirmation
   state is a fresh check for `?ordered=true` on page load (selections
   don't survive FormSubmit's redirect), returning early before the
   normal quantity-picker wiring runs.

**Verified:** `stitch.py` rebuild clean; `smoke-test.js` all pages
pass, no script errors anywhere. Targeted jsdom checks: contact.html's
new field renders required with the 4 correct options and the form
action still resolves correctly; services.html's dropdown includes
the new option alongside the 4 real services; build-detail form
confirmed to have the role removed and aria-live/atomic/action/fields
all intact (via the temporary in-memory "available" override above);
part-boxes form simulated end-to-end — injected a test box (real
inventory is currently empty), clicked quantity up twice, confirmed
the hidden fields exactly matched the visible summary (`"MSI Test GPU
Box x2"` / `"$10"` both places), and confirmed the `?ordered=true`
thank-you state renders with zero script errors even against the
current empty-inventory state. Real-Chromium screenshots (desktop +
mobile) of all three changed forms (including the part-boxes form
with an item selected, and its thank-you state) — zero horizontal
overflow, all render cleanly, no visual change to anything not
explicitly listed above.

**Decided by:** owner (spec given directly; evaluation, plan, and
implementation are Claude's, within the stated constraints).

---

### D32 — V1 finishing pass, Part 3: services page content/structure rework

**Ask:** the page felt crowded. Rework functionally/content-wise —
keep the current visual direction and design system, no broad
redesign — prioritizing what a customer needs to know before
contacting over adding more content.

**What was actually crowded:** each of the 4 service detail cards
(Repair, Upgrades, Cleaning, Support) carried three separate labeled
"note" blocks — Pricing, Turnaround, and Worth Knowing — each with
its own divider line. Across all four cards the Pricing and
Turnaround notes were near-identical restatements of the same
generic idea ("depends on the job, no flat rate, you'll know before
starting" / "depends on scope, realistic estimate, not a guess") —
and that same idea was *also* stated once already, clearly, in the
`.service-policy` paragraph below both card grids. A customer reading
top to bottom hit the same promise five times in slightly different
words before ever reaching the form.

**Fix — removed the redundancy, kept the substance:**

- Dropped `pricingNote`/`turnaroundNote` from all 4 services in
  `services.js` and simplified `renderServiceDetailCard()` in
  `serviceCard.js` to match — each card now shows one "Worth
  knowing" caveat instead of three notes. Nothing generic was lost:
  it was already covered once by the policy paragraph.
- The two genuinely distinct details buried in those notes were
  preserved, not deleted: Upgrades' "hardware cost and installation
  accounted for separately" moved into its `included` list (a real,
  specific fact, not boilerplate); Support's "this isn't unlimited
  support" folded into its existing `notCovered` sentence (a real
  boundary worth knowing, not a restatement of the general policy).
- Tightened the policy paragraph itself, which had a smaller version
  of the same problem — it said "realistic estimate" twice in three
  sentences. Merged into one sentence; no facts changed or added.
- That paragraph also had no section header at all — it just sat as
  a floating paragraph between the card grids and the form. Gave it
  the exact same `.section-header` pattern already used by the two
  sections above it on this same page ("Before You Reach Out" / "How
  Pricing & Turnaround Work") so it reads as its own clearly-labeled
  section instead of an afterthought. This is the one structural
  addition — reusing an existing pattern already on the page, not a
  new visual element.
- `services.js`'s own "how to edit this" header comment updated to
  match the simplified schema, so a future edit doesn't try to add
  a pricing/turnaround note back per service out of habit.

**Verified:** `stitch.py` rebuild clean; `smoke-test.js` all pages
pass. Direct DOM check confirmed each of the 4 detail cards now
renders exactly 1 "Worth knowing" note (down from 3), the service
dropdown still lists all 4 real services plus D31's "Other" option
unaffected, and the "Request This Service" pre-select-and-scroll flow
still correctly sets the dropdown value. Before/after real-Chromium
screenshots of the card grid at desktop confirmed the visible
decluttering; full-page screenshots at desktop (1440px) and mobile
(390px) — zero horizontal overflow, new section header reads cleanly
at both sizes, nothing outside the services page touched.

**Decided by:** owner (spec given directly; evaluation and specific
content cuts are Claude's, within the stated constraints).

---

### D33 — Contact page rebuilt as a situation router (supersedes D31's dropdown)

**Ask:** the contact page should act as a router — customer picks
what they need help with first, then sees only the fields relevant
to that situation, instead of one generic form. Six situations:
Buying a Gaming PC, Custom PC, PC Service/Repair, Part Box, General
Question, Other/Not Sure. Use existing dedicated forms where they
already do the job well rather than duplicating them. Keep each
form short. Buying a Gaming PC needs a short, honest (not salesy,
no availability promises) explanation up top. No inventory-connected
picker yet — that's an explicitly deferred future improvement.

**This replaces D31's "What's This About?" dropdown entirely** — that
dropdown labeled intent without acting on it (everyone still saw
every field); this routes to genuinely different, shorter field sets
per situation instead.

**Architecture — 3 real forms + 2 links, not 6 of everything:**

Two of the six situations already have a better, purpose-built
destination elsewhere on the site, so those cards are plain links
rather than a second, weaker copy of something that already works:

- **PC Service/Repair** → links to services.html, which already has
  a live-synced dropdown of the 4 real services (plus D31's "Other"
  option), optional system description, and a required description
  field. Nothing to duplicate.
- **Part Box** → links to part-boxes.html, which shows real current
  inventory and quantities — a text field on contact.html guessing
  at stock would be strictly worse than the live picker that already
  exists there.

The other four became 3 real `<form>` panels (General Question and
Other/Not Sure share one — see below):

- **Buying a Gaming PC**: name, email (required); budget, games you
  play, Windows/Linux, anything else (all optional). Explanation
  paragraph above the fields, exact wording requested: "Tell me a
  bit about what you're looking for, and I'll check it against
  what's currently available. If nothing currently listed is a good
  fit, I'll let you know — and can put together a custom build
  instead if that makes more sense for what you need." Deliberately
  doesn't promise a specific system will be available.
- **Custom PC**: name, email (required); budget, games, Wi-Fi,
  monitor, Windows/Linux, RGB preference, anything else (all
  optional) — this is the field set that used to be on every
  submission of the old monolithic form, now scoped only to the one
  situation where all of it is actually relevant. "Extra storage"
  and "quiet operation" (both mentioned on custom-build.html's own
  process copy but never a dedicated field even before this change)
  stay folded into the freeform "anything else" field rather than
  getting 2 more dedicated fields — flagged for the owner to revisit
  if tighter structure is wanted later.
- **General Question / Other-Not-Sure**: name, email, message (all
  required) — one shared panel rather than two identical ones, since
  both ask for exactly the same information. Clicking either button
  relabels the shared panel's heading, intro line, hidden `_subject`,
  and a hidden `situation_type` tag to match which was actually
  clicked, so the owner's inbox still shows the distinction even
  though the visible fields are identical. Default (pre-JS,
  pre-click) copy covers both cases at once so the no-JS fallback
  still makes sense.

**Subject-line differentiation** — every other form on the site
already sends a distinct FormSubmit `_subject` (build title, "Service
request," "Part box order request," etc.); the old contact form was
the one outlier always sending "New inquiry" regardless of what it
was about. Now: "Buying inquiry," "Custom build inquiry," and
"General question — North Bridge PCs" / "Other inquiry — North
Bridge PCs" (the shared panel, set dynamically per click same as the
heading/lead above).

**Reliability, consistent with every other form on the site:** all 3
panels are real `<form action="...">` elements with build-time-baked
`{{CONTACT_EMAIL}}`/`{{SITE_URL}}` tokens — not JS-rendered, not
fetch()-based. Nothing in the raw HTML hides them; `contactRouter.js`
hides all three (and the whole wrapping section, so an empty section
doesn't leave dead padding behind) on load and reveals one on click.
If JS never runs at all, every panel is simply visible already and
the page degrades to "three real forms stacked, pick the one that
applies" — confirmed by loading the built page with scripts disabled
entirely and checking for zero inline `display:none` in the raw
markup. The thank-you confirmation uses the same dynamic-injection-
into-a-`role="status"`-region pattern already established elsewhere
on the site (notifyBox.js, services.html, the build-detail form)
rather than a plain visibility toggle, since that's the pattern
already confirmed to announce correctly to screen readers.

**Visual reuse, not a redesign:** the 6-option picker reuses
`.service-hub-card` verbatim (contact.html now also loads
`services.css` for this one class) — same card component already
used for services.html's own hub cards, just with 6 instead of 2.
Zero new CSS written.

**Untouched by this change:** the build-detail inquiry form on
individual listings (build.html) — separate, preserved exactly as
it was, not part of this router at all.

**Verified:** `stitch.py` rebuild clean; `smoke-test.js` updated
(the old assertion checked for the single `#contact-form` id, which
no longer exists — replaced with checks for the 6 picker options, 3
panels, and each panel's form having a resolved `action`) and all
pages pass. Direct simulation: clicking each of the 4 in-page buttons
shows the correct panel and hides the others; clicking either shared-
panel button correctly relabels heading/lead/hidden tag/hidden
subject; `?sent=true` correctly hides the whole flow and shows the
confirmation; loading the page with scripts disabled confirmed all 3
panels have no inline `display:none` and all 3 forms have a resolved
`action` attribute, i.e. the true no-JS fallback actually works, not
just in theory. Real-Chromium screenshots at desktop (1440px) and
mobile (390px) of the picker, all 3 panel states (including the
relabeled shared panel), and the thank-you state — zero horizontal
overflow anywhere, and a dead visual gap between the picker and the
footer (caused by the wrapping section's own padding surviving even
with all children hidden) was found and fixed during this same pass
by hiding the section itself, not just its children.

**Decided by:** owner (situations, use-existing-forms-where-they-fit
principle, and the Buying explanation wording constraints given
directly; field lists within each situation, the shared-panel
simplification, and the technical architecture are Claude's, within
the stated constraints).

---

### D34 — Migrated 2 remaining builds from the old live site; found and fixed a real bug (notes field never rendered anywhere)

**Ask:** move over all remaining builds from the old live site
(`pcman369.github.io/North-Bridge-PCs`). The laptop's disclaimer,
currently sitting in its performance-estimate section, should move to
notes — then a reminder to deal with the now-empty performance section.

**What was actually there:** the live site's current `js/data/builds.js`
(checked both `main` and `master` branches, identical) only has the
same 3 sold builds already in our project — nothing new there. The
real find was a leftover **legacy** `js/builds.js` (old flat pre-
rebuild schema, not the current `js/data/builds.js` — a different
file, still sitting in the repo unused by the live pages) containing
2 real listings that were apparently never migrated when this project
did its ground-up rebuild:

- **Ryzen 5 5500 / RX 5700 XT** — a normal gaming desktop, $550,
  status "available," real fps estimates already present.
- **HP EliteBook 840 G10** — a business laptop, $400, status
  "available." Its old "fps" field (meant for real performance
  numbers) instead contained a hand-written disclaimer split across
  5 array entries: "Given that this is not a gaming PC and does not
  have dedicated graphics, it will not perform very well in most PC
  games." — exactly the disclaimer the owner flagged.

Both had real photos already sitting in the repo's `images/` folder
(11 total) that were never referenced by anything live — copied all
11 into this project's `images/` folder.

**Added as `aug26-01` (5700XT) and `aug26-02` (EliteBook)** in the
current schema. For the EliteBook specifically: `cpu: "Intel Core
i5"` and `os: "Windows"` are both directly visible in the source
photos (a palm-rest badge and the on-screen desktop respectively) —
included with an inline comment noting the exact CPU generation/OS
version aren't confirmed, rather than guessing further. No
motherboard/GPU fields added since nothing in the source data or
photos confirms them for this unit — left blank per the schema's own
"every component field is optional" rule rather than fabricated.

**The disclaimer**: moved verbatim into `notes`; `performance.items`
left as an empty array (renders nothing at all, confirmed — not an
empty box) per the owner's explicit instruction.

**Real bug found while doing this:** `notes` has existed in the
schema since early in this project (documented in `builds.js`'s own
header comment) but had **zero rendering code anywhere** — every
existing build always had `notes: ""`, so nobody would have noticed
it was silently swallowed. The owner's request to move real,
customer-relevant text into this field was the first time it
mattered. Fixed by extending the existing `condition`/`testingNotes`
card in `buildDetail.js` (renamed "Condition & Testing" → "Good to
Know" since it now covers a third, more general kind of content) to
also render `notes` when present. Confirmed via direct check that
builds with no condition/testingNotes/notes still correctly show no
card at all — this isn't a new always-on section.

**Verified:** `stitch.py` rebuild clean; `smoke-test.js` all pages
pass. Real-Chromium screenshots (desktop 1440px + mobile 390px) of
the builds listing page (both new systems show correctly — 5700XT
with its performance box, EliteBook cleanly without one) and both
detail pages, including a close-up confirming the "Good to Know"
card now actually displays the disclaimer text. Cross-checked an
existing build with no notes/condition/testingNotes to confirm the
card still doesn't render for it.

**Reminder for the owner, as requested:** the EliteBook's performance-
estimate section is now genuinely empty by design. Worth revisiting
whenever there's a plan for what (if anything) belongs there for a
non-gaming laptop — see PROJECT_STATUS.md.

**Not done as part of this:** anything to do with the scroll bar/
loading bar or the part-boxes inventory — owner asked for these one
at a time, in order, and the scroll bar change specifically needs a
plan presented before any implementation.

**Decided by:** owner (which builds to move, the notes-migration
instruction, and the reminder request given directly; the discovery
that this required checking a legacy file, the specific fields filled
in for the EliteBook, and the notes-rendering fix are Claude's).

---

### D35 — Scroll progress bar replaced with a page-load progress bar

**Ask:** change the top scroll-progress bar into a loading bar. Plan
first, get sign-off before implementing (owner picked the full
click+load pattern over a simpler on-load-only flourish; visual look
stays identical).

**Why this needed a real design, not just a rename:** this site has
no client-side routing — every page is a genuine separate HTML file
with a full browser navigation between them. Nothing can literally
stay alive and keep animating through that gap; the whole page (and
this script) tears down before the next one runs. Implemented the
same illusion every site with a top-loading-bar actually uses,
without any external library:

1. **On arrival at any page** (however you got there — a click on
   this site, typed URL, bookmark, back/forward): the bar fills
   0→100% quickly (~300ms), holds briefly, fades out, and resets —
   confirmed via real-Chromium timing checks (not jsdom, which has no
   real paint loop and gave misleading timing here during
   development).
2. **On clicking a link that's actually navigating to another page on
   this site**: the bar starts filling immediately (to 80%, held —
   there's no way to know when the real navigation will complete, so
   it doesn't try to finish itself). This is what makes it read as
   one continuous bar bridging the wait, not just a post-arrival
   flourish.

Click-detection deliberately excludes anything that isn't actually
leaving this page to another page on this site: `target="_blank"`,
modified clicks (cmd/ctrl/shift/alt — all "open in new tab" signals),
`download` links, `mailto:`/`tel:` links, same-page anchor links (the
skip-link, FAQ anchors), and external-origin links. Without these,
the bar would end up stranded half-filled with nothing that will ever
complete it. All 5 confirmed individually with real-Chromium clicks
(and one dispatched-event test for the skip-link specifically, since
it's intentionally invisible until focused and Playwright's normal
`.click()` won't act on it).

**Reused the exact same element/visual** (renamed `#scroll-progress`
→ `#load-progress` throughout — HTML partial, CSS, JS — since the old
name was actively misleading once it stopped tracking scroll at all):
same 3px height, same accent gradient, same fixed-top position, same
z-index. No new visual design. Back-to-top's own scroll-linked
visibility logic (separate feature, was living in the same function)
is completely untouched.

**Verified:** `stitch.py` rebuild clean; `smoke-test.js` all pages
pass. Real-Chromium checks (not jsdom) of the full timing sequence —
confirmed width/opacity at 100ms/400ms/700ms match the intended
fill/fade/reset curve — plus all 5 click-exclusion cases individually
confirmed to correctly leave the bar at 0%, and a genuine internal
link click confirmed to correctly fill it to 80%. Screenshot of the
bar mid-animation after a real click.

**Decided by:** owner (asked for the change, picked the full pattern
over the simpler alternative once presented with both, confirmed the
visual stays as-is). Implementation is Claude's.

---

### D36 — First real part box inventory added

**Ask:** add real part boxes. Owner explicitly deferred photos to a
later pass.

**Owner-provided inventory** (5 box types, given informally and
structured here):

- AMD Ryzen 5 5500 — qty 3, good condition (includes foam inserts)
- AMD Ryzen 5 3600 — qty 2, good condition (includes foam inserts)
- AMD Ryzen 7 5700X3D — qty 1, fair condition
- MSI MAG A550BN — qty 4, good condition (includes foam inserts)
- MSI MAG A650BE — qty 1, good condition (includes foam inserts).
  Owner wrote "MSI MG A650BE" — MSI's PSU line is branded "MAG," not
  "MG," so read as a likely typo and corrected. Flagged for the owner
  to confirm; noted inline in `partBoxes.js` too.

**Pricing, as given directly:** $5 per CPU box, $3 per PSU box (not a
flat rate across all boxes) — categorized accordingly (`category:
"CPU Box"` / `"PSU Box"`) so the right price landed on the right
entries.

**Photos:** none yet, by the owner's own choice, added later. No
`media.images` populated — confirmed this renders a clean placeholder
icon rather than a broken image or empty gap, per the file's existing
established fallback behavior (unchanged from before this pass).

**Verified:** `stitch.py` rebuild clean; `smoke-test.js` all pages
pass. Direct simulation of the full order flow with the real data —
all 5 cards render with correct labels/prices/quantities/condition
text; selected 2× Ryzen 5 5500 + 1× MAG A550BN and confirmed the
visible summary, the total ($13), and the hidden form fields all
matched exactly. Real-Chromium screenshots at desktop (1440px) and
mobile (390px) — zero overflow, all 5 cards render cleanly with
placeholder icons, correct category badges, correct condition text.

**Decided by:** owner (full inventory, pricing, and photo timing
given directly). Category inference, id numbering, and condition-text
phrasing are Claude's.

**This completes all three items from the owner's "all that's left"
list** (build migration, loading bar, part boxes) — see
PROJECT_STATUS.md.

---

### D37 — Evaluated the "Impeccable" design-critique tool; fixed 2 real issues it surfaced

**Ask:** look into `github.com/pbakaus/impeccable`, see if it's usable
here, to help the site look less AI-generated.

**What it actually is:** a design-language/skill system built for AI
coding agents (Claude Code, Cursor, etc.) — slash-commands like
`/impeccable audit` that hook into an agent's edit loop, plus a
separate, standalone deterministic detector (61 rules) that scans
HTML/CSS for known "AI slop" tells: overused fonts, purple-blue
gradients, glowing shadows, cards nested in cards, hero eyebrow
chips, and more. The full skill/hook system is built for an
interactive agent CLI session (Claude Code) and doesn't apply to this
environment. The standalone detector (`npx impeccable detect <path>`)
is a separate, self-contained piece that doesn't need that
infrastructure — that part genuinely runs anywhere Node does,
including here, so that's what got tested.

**What I did:** ran it for real against the actual built site (`npx
impeccable detect .`), not just read about it — 161 raw findings,
filtered down to 95 once `design-prototypes/` (archived, unused
early-phase mockups from before "Forge" was chosen) and `pages-src/`
(source templates with unresolved `{{tokens}}`, duplicate echoes of
the same issues already in the built files) were excluded. Then
manually verified a sample of the findings rather than trusting the
raw output — the tool does per-file static analysis and can't trace
cross-file CSS cascades, so some findings needed checking before
acting on them.

**2 real issues found and fixed:**

1. **`js/render/galleryGrid.js`'s "broken-image" flag was a false
   positive** — the lightbox's `<img>` template intentionally starts
   with an empty `src`/`alt`, populated by `_renderLightboxItem()`
   before the lightbox is ever shown. Verified by reading that
   function directly. No fix needed.
2. **5 hardcoded old-blue `rgba(59,130,246,...)` box-shadow values
   still sitting in `style.css`** (`.btn-primary`, `.btn-primary:hover`,
   `.form-input/select/textarea:focus`, `.back-to-top`,
   `.back-to-top:hover`) — literal leftovers from before the Forge
   redesign. **Not a live visual bug**: `theme.css` (loaded later)
   already overrides every one of these exact selectors to the
   correct amber value, confirmed both by reading `theme.css`'s own
   override block and by checking `getComputedStyle` in real
   Chromium before and after — identical amber output either way. But
   leaving raw blue values sitting in the base file is misleading for
   anyone reading it later (looks like it renders blue; never does).
   Corrected all 5 to the exact amber+opacity values `theme.css`
   already forces them to, so the base file is now honest about what
   it actually produces. Pure clarity fix, zero visual change,
   confirmed via computed-style check.
3. **`part-boxes.html`'s "not a payment" disclaimer was smaller than
   the equivalent notice everywhere else** — 0.72rem (11.52px) vs.
   0.8rem used by `.form-privacy p` for the same kind of fine-print
   disclaimer on every other form. Bumped to match. Minor, but this
   is the one sentence on that page clarifying the form isn't a
   purchase — worth it being as legible as the equivalent text
   elsewhere.

**Broader pattern found but not touched:** the same hardcoded-blue
issue exists in 21 more `background-color`/`border`/`gradient`
declarations throughout `style.css` (the "dark-glow" rule only
flagged box-shadow specifically, not tints/borders/gradients, which
is why the tool surfaced 5, not 26). Spot-checked 3 more
(`.nav-link.active`, `.btn-ghost`, `.page-hero`) and confirmed
`theme.css` covers those too — consistent with `theme.css`'s own
documented "swept every instance" history from the original
redesign. Very likely all 21 are equally harmless-but-misleading.
Did not mechanically fix all 21 — that's a bigger, more mechanical
cleanup pass than this exploratory check warranted on its own;
flagged for the owner as an optional future pass, not urgent since
nothing renders incorrectly.

**Real findings surfaced but deliberately left as the owner's call
(design/content judgment, not bugs):**

- **Hero eyebrow chip** — the small "SOUTHERN OREGON" label directly
  above the homepage's big H1 is a specifically-named, recognizable
  "AI SaaS hero" pattern. Real and worth knowing, but changing it is
  a visual-design decision, not a fix.
- **Card border+shadow combo** — the sitewide `1px solid border` +
  soft `--shadow-lg` blur combination used on most cards is a
  recognizable "generated UI" signature by the tool's own
  description. Pervasive (used on effectively every card component
  sitewide), so addressing it would be a real visual-redesign-level
  change, not a small fix — exactly the kind of change the owner has
  repeatedly asked to be consulted on before touching.
- **Em-dash density** — 9–16 em-dashes per page on `about.html`,
  `contact.html`, and `index.html`, flagged as an AI writing-cadence
  tell (advisory, not a primary finding). Likely the single most
  impactful item on this whole list for the stated goal, since
  writing style often reads as "AI" faster than visual choices do —
  but fixing it means rewriting a meaningful amount of already-
  written, already-approved copy across multiple pages. Left
  entirely alone pending the owner's direction.
- **2 legitimate (non-"AI slop") technical notes, both low-priority:**
  the load-progress bar (D35) animates `width`, which is technically
  a layout-triggering property rather than a compositor-only one —
  real, but negligible impact for a single tiny fixed-position
  element; and the FAQ/mobile-nav accordions use the common
  `max-height` transition trick rather than the newer CSS Grid
  `0fr→1fr` technique — a very standard, widely-used pattern, not
  really an "AI" tell despite being flagged.

**Verified:** `stitch.py` rebuild clean; `smoke-test.js` all pages
pass. Confirmed via real-Chromium `getComputedStyle` checks that
`.btn-primary`'s rendered box-shadow is identical amber
(`rgba(242,167,27,...)`) before and after the style.css correction —
zero visual regression, as expected for a base-value correction that
was always being overridden anyway.

**Decided by:** owner (asked to evaluate the tool). Which findings
were worth fixing immediately vs. flagging for a decision is Claude's
judgment — a case-by-case read of "genuine bug," "already-covered
dead code," and "real but subjective design/content call," rather
than uniformly fixing or uniformly ignoring everything the tool
reported.

---

### D38 — Remaining 30 hardcoded-blue instances cleaned up (all of them, not just style.css)

**Ask:** fix the remaining hardcoded-blue instances flagged in D37's
evaluation.

**Scope ended up bigger than D37 estimated**: that pass only checked
`style.css` (21 remaining after the 5 box-shadows already fixed).
Doing this properly meant re-checking every CSS file — found 6 more
in `build-detail.css` (5) and `part-boxes.css` (1) that D37 hadn't
looked at. Fixed all 30 total across all three files.

**Method, to avoid the risk of a bad text-match:** many of these
lines are byte-identical to each other (e.g. six separate
`background-color: rgba(59,130,246,0.1);` lines with nothing
distinguishing one from another out of context), which makes a
find-and-replace genuinely risky — the wrong occurrence could get
"fixed" instead of the right one, or the same one twice. Mapped every
line by exact line number instead, verified each line's *current*
content matched what was expected before touching it (all 30
matched, zero surprises), then wrote each one individually so
opacity could match whatever `theme.css` actually overrides that
specific selector to — some are a straight color swap at the same
opacity (e.g. `.tier-card.featured`, `.faq-item.open`), others needed
the opacity adjusted too since `theme.css` deliberately retuned it
during the original redesign (e.g. `.nav-link.active` 0.1→0.12,
`.form-privacy` 0.05→0.06 / 0.14→0.16).

**2 genuinely unused rules found along the way**: `.highlight-box`
and `.step-list-num` aren't referenced by any current page or render
script — confirmed via a full-project grep, zero matches. Almost
certainly leftovers from before some earlier content restructuring
(`.step-list-num` in particular looks like the old filled-circle
step-number badge that `.cb-row .cb-num`'s plain-mono-digit style
replaced). Fixed their color anyway for consistency rather than
leaving stray blue in unused rules, since deleting dead CSS wasn't
asked for and removing rules I can't 100% verify are never
conditionally referenced somewhere felt like a bigger, separate call
than "fix the hardcoded colors." Flagging both as candidates for
deletion in a future cleanup, if the owner wants that.

**Verified:** `stitch.py` rebuild clean; `smoke-test.js` all pages
pass. A comprehensive `grep` across every `.css`/`.html`/`.js` source
file confirms zero `rgba(59,130,246,...)` or `#3b82f6` literals
remain anywhere except `tokens.css`'s own base `--accent` definition
— which is supposed to be blue-by-default and exists specifically
for `theme.css` to override, not a leftover (see D23). Real-Chromium
`getComputedStyle` checks across a representative sample covering
every fixed selector — static states, `:hover`, `.featured`, and
`.open` — all confirmed rendering the exact amber values expected,
with zero visual difference from before this fix (as expected, since
every one of these was already being silently overridden the same
way).

**Decided by:** owner (asked directly, scope is mechanical/objective
— match what `theme.css` already forces each selector to, not a
design judgment call). The 2 unused-rule discoveries and the
decision to fix-rather-than-delete them are Claude's.

---

### D39 — Remaining Impeccable findings resolved (hero eyebrow, card shadows, em-dash density); 5700 XT marked sold

**Ask:** fix the rest of what D37 flagged as "owner's call" rather
than acted on unilaterally, and give a fresh zip. Also: mark the
Ryzen 5 5500/RX 5700 XT (`aug26-01`) as sold.

**Build status:** `aug26-01` changed from `available` to `sold`.
Confirmed via screenshot it now shows correctly under "Recently
Sold" with a SOLD badge, no longer under "Available Systems."

**1. Hero eyebrow chip removed.** The "Southern Oregon" pill above
the homepage H1 was pure redundancy (the H1 immediately below it
also ends in "Southern Oregon") and a specifically-named "AI SaaS
hero" pattern. Removed the element from `index.html` and fully
cleaned up the now-dead CSS behind it in both `style.css` and
`theme.css` (a grouped selector, a standalone border rule, and a
font-styling override) rather than leaving orphaned rules — 3 more
found via the same "hero-eyebrow" grep, none of which would have
been obvious just from removing the one HTML line.

**2. Sitewide card border+shadow pattern fixed — surgically, not a
redesign.** Found the exact scope first rather than assuming "every
card": only 6 selectors sitewide actually combine a 1px border with
a `--shadow`/`--shadow-lg` box-shadow on the same rule
(`.nav-dropdown-menu`, `.hero-image-wrap`, `.card`, `.build-card`,
`.tier-card`, `.form-card`). Removed the box-shadow from 5 of them
(`.hero-image-wrap`, `.card`, `.build-card`, `.tier-card`,
`.form-card`) — border alone gives clean definition against the dark
background, and the soft blur was redundant depth on elements that
don't need it. Deliberately kept `.nav-dropdown-menu`'s shadow: it's
a floating overlay menu, not a static content card, and a shadow
there does real work (separating it from the page behind it), so
removing it would be a UX regression for a purely stylistic reason,
not a fix. Also deliberately kept the `:hover` shadow increase on
`.card`/`.build-card`/`.tier-card` — a shadow that appears
specifically in response to interaction is a motivated affordance
("this card just lifted"), not the static always-on default the tool
is calling out. `.card` itself turned out to be unused (same
situation as D38's `.highlight-box`/`.step-list-num`) — fixed anyway
for consistency, not deleted.

**3. Em-dash density reduced across all 3 flagged pages** (about.html,
contact.html, index.html) — every real, visitor-facing instance
rewritten by hand, checked in full paragraph context first so nothing
lost its actual meaning. Punctuation varied deliberately (periods,
commas, one colon here and there) rather than replacing every dash
with the same character, which would just trade one monotonous
pattern for another. Also cleaned up a handful instances outside
visible body copy while in there: meta descriptions, `<title>` tags,
image alt text, 5 dropdown option values on the contact form (their
literal value= text, which is what would show up in the owner's
inbox), and 2 JS-generated gallery alt-text strings. Left internal
dev comments alone — never visitor-facing, not what was being asked
about. The one sentence in the Buying panel that's the owner's own
approved wording (D33) kept its exact meaning — only the em-dash
became a comma.

**Verified with the actual tool, not just spot-checks:** re-ran
`npx impeccable detect` against the rebuilt site. `hero-eyebrow-chip`:
gone. `em-dash-overuse`: gone. `gpt-thin-border-wide-shadow`: down
from 15 to 11, and confirmed the remaining 11 (exactly one per page)
is `.nav-dropdown-menu` — the deliberate exception above, not a miss.
`dark-glow` is unchanged at 38: this rule flags *any* colored glow
shadow regardless of color, so it's now catching the intentional
amber button/back-to-top/focus-ring glows that are part of the
already-approved Forge identity (D22-24) — a different, much bigger
design call (removing a signature glow effect from the approved
redesign) than anything flagged as "owner's call" in D37, so left
alone rather than assumed. `stitch.py` rebuild clean; `smoke-test.js`
all pages pass; real-Chromium screenshots of all 3 rewritten pages at
desktop and mobile — zero overflow, copy reads naturally, no layout
regressions.

**Decided by:** owner (asked directly to fix what D37 had left open,
and to mark the build sold). Which specific selectors to touch for
the shadow fix, the exact rewording for every sentence, and treating
the button-glow finding as a separate, bigger call rather than
folding it in are Claude's judgment.

---

### D40 — Google Analytics (gtag.js) added sitewide via a new build-time marker

**Ask:** add the given Google tag snippet to every HTML page, exactly
once per page.

**Not pasted into all 11 pages by hand** — that would invite drift
(11 copies to keep in sync forever, easy to miss one on the next new
page) and this project has consistently avoided that pattern for
anything shared (header, footer, SEO block). Instead: the snippet
lives once in a new `js/partials/analytics.html`, and `stitch.py`
gained a 3rd marker (`<!--ANALYTICS-->`) alongside the existing
`<!--HEADER:id-->`/`<!--FOOTER-->`/`<!--SEO-->` ones — same pattern,
one new partial, one new replace step. The marker was added as the
very first line inside `<head>` on all 11 `pages-src/*.html` files
(Google's own recommended placement — as high in `<head>` as
possible, before anything else loads).

**Built-in guardrails**, matching how the SEO marker already warns
rather than silently doing nothing:
- Exactly 1 marker per page → replaced normally.
- 0 markers on a page → build still succeeds, but prints a `NOTE`
  that the page won't have analytics, so a future new page isn't
  silently missing it forever.
- 2+ markers on a page (the literal thing the owner said not to do)
  → treated as an error: the page is skipped from the build and
  logged, rather than silently duplicating the whole snippet twice.

**Verified:** `stitch.py` rebuild clean, zero `NOTE`/`ERROR` lines
printed (confirming all 11 pages had exactly 1 marker, resolved
correctly). Checked the built output directly rather than trusting
the build log alone: the tracking ID string appears twice per page
(once in the script `src=`, once in `gtag('config', ...)`) — that's
correct, both are part of the one snippet Google's own instructions
specify; confirmed it's genuinely one snippet, not two, by counting
the `<script src="...googletagmanager.com/gtag/js...">` tag
specifically, which appears exactly once per page across all 11.
Confirmed placement is the first line inside `<head>`.

**Smoke test needed a real fix, not a workaround**: `smoke-test.js`
started failing on every page afterward — jsdom's sandboxed test
environment has no route to an external domain, so it can't actually
load `googletagmanager.com/gtag/js`, which is expected and harmless
in production (a real browser with real internet loads it fine).
Rather than loosen the check broadly, scoped the existing known-noise
filter (which already excluded unloadable images/stylesheets for the
same underlying reason) to also exclude `Could not load script:` only
when the URL is `http(s)://` — verified directly that this still
correctly flags a *local* script path typo (no protocol) as a real
failure, so this doesn't quietly weaken the test.

**Decided by:** owner (exact snippet and the "once per page" rule
given directly). The build-time marker approach (vs. copy-pasting
into all 11 files) and the smoke-test fix are Claude's, within the
literal ask.

---

### D41 — Second part box batch added (6 more, 2 new categories); found and fixed a real empty-brand rendering bug

**Ask:** add more part boxes.

**Owner-provided inventory**, structured here same as D36:

- ID-Cooling SE-214 XT-V2 (cooler) — qty 1, good condition, no
  inserts, $3
- ASUS TUF Gaming A520 (motherboard) — qty 2, but the owner noted one
  has a cardboard insert and one doesn't. Split into 2 separate
  listings (qty 1 each) rather than one combined qty-2 listing — the
  owner explicitly left this choice to Claude. Matches this file's
  existing pattern of a new listing per real difference (e.g. the 2
  different PSU models are already 2 separate entries), and means a
  customer sees the insert difference immediately from the listing
  itself rather than having to read a combined description carefully.
- MSI PRO B550M VC WIFI (motherboard) — qty 2, good condition,
  includes inserts, $5
- A motherboard box the owner wrote as just "B550-PLUS AC-HES" with
  no brand — a few real "B550-PLUS"-family boards exist across
  different brands, so rather than guess, `brand` was left empty and
  flagged inline in `partBoxes.js` and here. Still added and live
  (as "B550-PLUS AC-HES" alone) rather than held back entirely, since
  the rest of the listing (condition, price, quantity) was given with
  full confidence.
- Rosewill CPU Air Cooler with Digital Display (cooler) — qty 1, good
  condition, no inserts, $3

**Pricing/categories:** motherboard and cooler boxes are new
categories not seen in D36 — owner gave $5 for the motherboard boxes
and $3 for both cooler boxes directly, so no guessing needed there.

**Real bug found and fixed**: `partBoxCard.js` built every box's
display label as `box.brand + ' ' + box.model` unconditionally — fine
for every box until this batch's intentionally-blank-brand entry,
which would have rendered with a stray leading space (`" B550-PLUS
AC-HES"`). Fixed to only prepend the brand and the separating space
when a brand is actually set. Confirmed via direct DOM inspection
that the fix propagates everywhere the label is used — the card,
the order summary, and the hidden form fields all read from the same
`data-label` attribute this function sets, so one fix covered all of
them.

**Verified:** `stitch.py` rebuild clean; `smoke-test.js` all pages
pass. Direct DOM check confirms all 11 boxes (5 from D36 + 6 new)
render with correct labels — including confirming the empty-brand
entry now shows cleanly with no leading space. Simulated selecting
the empty-brand box plus the Rosewill cooler and confirmed the
summary, the $8 total, and the hidden form fields all matched
exactly. Real-Chromium screenshots at desktop (1440px) and mobile
(390px) of the full 11-box grid — zero overflow, the two ASUS
listings read clearly distinct from each other, new category badges
(Motherboard Box, Cooler Box) display correctly alongside the
existing CPU/PSU ones.

**Decided by:** owner (full inventory, pricing, and the ASUS
listing-split choice given directly, the last explicitly left to
Claude's judgment). The empty-brand handling and its bug fix are
Claude's.

**Update:** owner confirmed the brand — "ASUS B550-PLUS AC-HES."
`brand` set accordingly; the flag above is resolved.

---

## Still open

- Whether any real testimonials exist to seed that system (owner
  confirmed: not yet — leave disabled).
- **MSI MAG A650BE model name** — owner wrote "MG A650BE"; corrected
  to "MAG A650BE" as a likely typo (D36). Worth a quick confirmation
  next time it comes up.
