> **ARCHIVED 2026-10-13 (B-032). Verbatim copy of START_HERE.md as of A-031, kept because its "Current state" held a per-chunk narrative.**
> Do not edit or read in full. The live file is START_HERE.md.

# START_HERE.md — North Bridge PCs website

Read this first, then the last few entries of LOG.md. Read other docs only
when the doc map (bottom) says to. Last updated: A-031 (2026-10-13).

## What this is
Static HTML/CSS/vanilla-JS site on GitHub Pages. Real sources are in
`pages-src/`; `build-tools/stitch.py` injects the shared partials and writes
the root `*.html`, `sitemap.xml`. Content lives in `js/data/*.js`.

## Rules (every chat)
1. **The uploaded ZIP is the source of truth.** It is a complete replacement
   snapshot, never a patch. After each new upload, re-read any file before
   editing it; do not rely on copies seen earlier in the conversation.
2. **First reply of every turn is one line:** `Working from <zip name>; last
   log entry <ID>.` If the ZIP name's ID and LOG.md's last ID disagree, say
   so before doing anything else.
3. If LOG.md and the files disagree, say so in the reply. Do not silently
   pick one.
4. Edit `pages-src/`, partials and data, never the generated root `*.html`.
   Run `python3 build-tools/stitch.py` before packaging.
5. Use `unknown` rather than guessing. Never claim a test passed unless it ran.
6. One small chunk per turn: a task the owner can review in one sitting.
7. Return a ZIP only at a clean stopping point where the site works. If the
   chunk cannot finish cleanly, say so and return no ZIP.

## Roles (alternating, never simultaneous)
- **Lane A: interactive visual/design.** Mockup-driven, needs owner approvals.
  Options may be shown as screenshots or as artifacts (owner OK'd artifacts in A-006).
- **Lane B: batch/checklist.** Continues while A waits on the owner.
- B does not make visual decisions. Either lane may touch any file a task
  requires; the log entry says which.

## End of every chunk: return exactly this
1. Short reply: what was done, what to check, decisions needed from the owner.
2. Added/modified/deleted paths as text, taken from a real diff of the
   uploaded vs. returned project (not from memory).
3. Files presented, in order: the complete ZIP, then LOG.md, then START_HERE.md.
   The ZIP is authoritative; the two .md copies are extracted from the final
   ZIP and must match it byte for byte.

Sequence: finish edits, run stitch (and tests if they can run here), append
the log entry, update this file, build the ZIP, check it opens (`unzip -t`),
extract LOG.md and START_HERE.md from it and compare, then present.
ZIP name: `nbpcs_after-<last ID>.zip`. Same single top folder `nbpcs/`; no
`.git`, `node_modules`, `__pycache__`, temp or scratch files.

## Log IDs
Next ID = highest number in the entry header lines of LOG.md, plus one, with
the working lane's prefix (A-013, B-014, A-015, so next is 016). Ignore IDs
mentioned inside entries. Never use conversation memory or per-lane counters.
Archiving old entries is fine; the newest entry always stays in LOG.md.
Entries are append-only; corrections are new entries ("Corrects: A-009").

## Applying a returned ZIP (owner)
Make the local working tree match the ZIP exactly, keeping `.git`, so deleted
files disappear too (mirror-style sync, e.g. `rsync -a --delete --exclude .git`
or `robocopy /MIR /XD .git`). Dry-run first, or check `git status` after: the
deleted files shown should match the `D` lines in the log entry. A mirror
sync also deletes local-only files that are not in the ZIP (for example
`design-prototypes/` if it still exists), so exclude or relocate those.
Commit with the entry ID in the message.

## Current state (as of A-031)
- V1 build is complete (history through D43 in docs-archive/DECISIONS.md).
- **Visual redesign in progress.** Live record: VISUAL_REDESIGN.md. Accent is
  "Cask" `#8b3f5e` sitewide. Build-detail and home pages are done;
  custom-build is done apart from deferred items (section headers, open
  items, tier-card feature lists, process-section column, "Not Sure"
  section); contact is done apart from hero copy (situation picker, form panel
  layout, shared form fields and success states); part-boxes is done apart
  from copy items (portrait photo cards, quantity picker, order confirmation);
  about is done (story section); gallery is done (photo tile shape, homepage preview,
  empty "Current Builds" hidden); faq is done (accordion). Every page has now been walked at desktop width.
- **Services are gone (B-003).** The owner no longer offers services, so the
  Services page and everything tied to it were removed: services.html, its
  data/renderer/most of its CSS, the nav and footer links, the contact page's
  "PC Service / Repair" card (picker is now 5 cards), and the smoke/visual test
  entries. The old services.html URL now returns the 404 page. The repair
  wording in about.html and the homepage structured data was also removed
  (B-004, owner-approved).
- Changes found in the ZIP that older docs do not record (made by Lane A before
  this system existed, no log entries): `.btn-primary:hover` white-text
  contrast fix; hover `box-shadow` removed from `.build-card`, `.tier-card`,
  `.gallery-item`; aug26-02 (EliteBook) marked sold in `builds.js` and its
  photos moved to Completed Builds in `gallery.js`. All builds are now sold,
  so the site shows its no-inventory states. Details are in VISUAL_REDESIGN.md.
- Generated root HTML matches `pages-src/` + stitch.py as of B-005 (all local
  links and assets resolve). A real-Chromium pass on this state found no script
  errors on any of the 10 pages, no horizontal overflow at desktop/tablet/mobile,
  and 5 cards in the contact picker.
- Lane A's closing summary (received after B-001): nothing was decided but
  left unwritten, and its two open items (nav-dropdown shadow check,
  `layout-transition`) are already in VISUAL_REDESIGN.md. Lane A reports
  `smoke-test.js` passing on this state; Lane B could not re-run it (see Tests).
- A-006 (Lane A): `css/style.css` only. The three tier-card feature lists on
  custom-build are now flush-left hairline rows without check marks (owner
  chose Option B; also fixes a stray 40px list indent). `smoke-test.js` ran
  and passed in Lane A's sandbox, which also covers the 6 -> 5 picker
  assertion B-003 could not run.
- A-007 (Lane A): `pages-src/custom-build.html` only (root file regenerated). The
  "How a Custom Build Works" section is now plain `.two-col`, so its left column
  top-aligns with the step list instead of floating centered (owner chose Option A).
  Home page's `.two-col.center` is untouched. Options were shown as a published
  artifact for the first time.
- A-008 (Lane A): `pages-src/custom-build.html` and `css/style.css`. The "Not Sure
  What Hardware You Need?" section is now two columns on the page grid (heading +
  lead left, paragraphs + buttons right) instead of a centered 760px block (owner
  chose Option A). New opt-in utility `.text-balance` in style.css, used only on
  that heading. Copy unchanged.
- A-009 (Lane A): contact page situation picker. The five choices are now hairline
  ruled rows (title + description left, equal-width button right) instead of cards
  (owner chose Option B), with a fix for stray default h3/p margins. Renamed (owner
  approved): `css/services.css` -> `css/situation-picker.css`, `.service-hub-card` ->
  `.situation-option`; picker container is `.situation-picker` (no longer `.grid-2`).
  Files: css/situation-picker.css (A), css/services.css (D), pages-src/contact.html,
  smoke-test.js, css/style.css (comment), ARCHITECTURE.md. Copy unchanged.
- A-010 (Lane A): contact form panels (`pages-src/contact.html`, `css/style.css`). The
  panels stay full container width; the intro paragraph is capped at 52ch, the submit
  buttons are natural width above 640px (full width at 640px and below, as before), and
  the privacy note's stray paragraph margins are removed (81px box -> 56px). Owner chose
  Option A.
- A-011 (Lane A): `css/style.css` only. The privacy-note margin fix now lives on the root
  `.form-privacy p` rule (owner approved), so it also applies to the notify box on
  builds.html and the build-detail inquiry form (both boxes 102px -> 77px at 1440px).
  The scoped contact rule from A-010 was removed.
- A-012 (Lane A): shared form fields (`css/style.css`, `css/theme.css`; applies to the contact
  panels, build-detail form, notify box and part-boxes order form). Resting border is now the
  new `--border-field` token (#6a665e, 3.13:1 against the card, was 1.29:1); focus is one solid
  2px accent edge instead of border + glow (the glow override in theme.css was removed); select
  arrow recolored from the old #64748b to `--dim`. Owner chose Option A. `.qty-input` on
  part-boxes was not touched.
- B-014 (Lane B): `ARCHITECTURE.md` only (docs). Theming text (directory-layout entries for tokens.css/theme.css,
  "Theming", and the redesign section, now "Visual redesign history") rewritten to match the code as of A-013.
  No site files changed.
- B-015 (Lane B): docs and CSS comments only. ARCHITECTURE.md directory layout, docs references and
  build-script paragraph brought up to date (page list, pages-src/, data files, docs-archive, gallery.css
  scope); the two `/areas/website-visual-redesign.md` citations in `css/theme.css` comments now say
  `VISUAL_REDESIGN.md`. No rules or visuals changed.
- B-016 (Lane B): comments only. The dead `/areas/website-visual-redesign.md` citation is gone from
  `css/style.css` and `css/build-detail.css` (now `VISUAL_REDESIGN.md`); `css/gallery.css` header now says it
  is loaded by gallery.html and index.html; `js/data/config.js` comment now describes how the FormSubmit
  address is wired (stitch.py fills `{{CONTACT_EMAIL}}`, so re-run it after changing the email).
- B-017 (Lane B): part-box photos. All 11 boxes in `js/data/partBoxes.js` now have one photo
  (`images/box-01.jpg` ... `box-11.jpg`, named by box id; converted from the owner's HEIC originals, resized
  to 1350x1800, EXIF/location stripped, 230-400 KB each). Data and images only; no layout change. Photos are
  portrait, the card frame is landscape 4:3 with `object-fit: cover`, so each is center-cropped (Lane A item in Next up, B-018).
- B-018 (Lane B): part boxes. box-03 model corrected to "Ryzen 7 5800X3D" (owner: the photo label is right).
  B550M split into two listings (owner): box-09 = with inserts (`images/box-09.jpg`, qty 1) and new box-12 =
  no inserts (`images/box-12.jpg`, qty 1); the two photos are swapped accordingly. Owner confirmed the "_W" in
  the photo file names means "with inserts". Owner decision recorded for Lane A: part-box photos stay portrait,
  uncropped (see Next up).
- B-019 (Lane B): box-06 (ID-Cooling SE-214) condition corrected to "Good condition — includes inserts." (owner
  confirmed; it had said "No inserts"). box-12's wording approved by owner. `js/data/partBoxes.js` only.
- B-025 (Lane B): new `MAINTENANCE.md` (owner guide: the three rules, everyday tasks with the file for each, preview and check,
  publish to GitHub Pages, troubleshooting table). Closes the old Phase 8 gap. Docs only; ARCHITECTURE.md's file list updated.
- B-024 (Lane B): docs only. Owner answers to the B-020 questions recorded in `COPY_REVIEW.md` (new "Owner answers" section)
  and the owner queue rewritten; no site files changed.
- B-020 (Lane B): new `COPY_REVIEW.md` (read-only audit; no copy changed): Part 1 lists text that is wrong or may
  mislead (e.g. the part-boxes meta description names GPU and case boxes that aren't listed; intro text written for stock
  sits above the empty states; the FAQ says every system can game but one sold system was a laptop), Part 2 lists
  prominent text that is not doing its job. Input for the copy pass; the owner does the rewriting.
- A-013 (Lane A): success states (`css/style.css`, `js/render/contactRouter.js`, `notifyBox.js`,
  `buildDetail.js`). The contact "Message Sent", the builds.html notify confirmation and the
  build-detail confirmation are now one shared `.success-state` card (check in a 56px outlined
  circle in `--accent-text`, h2 heading); owner chose Option B. (The part-boxes order confirmation was
  the last user of the old `.notify-success` class and was migrated in A-023; that class is gone.)
- A-021 (Lane A): part-boxes portrait photo cards (`css/part-boxes.css` only) and the `--success` pin
  (`css/theme.css`). The cards are now horizontal, two per row: a 144px-wide 3:4 photo column
  (`object-fit: contain`, never cropped) on the left, details on the right, price + quantity pinned to the
  card bottom (this also fixes pickers that did not line up across a row); two columns only when the grid is at
  least 780px wide (viewports of about 840-900px and 1168px+), otherwise one column (including phones). The 12-box grid is about 1,340px tall at 1440px (was 1,620px). Owner chose Option B. Owner queue
  item 5 is resolved: the owner confirmed there is no light mode and a light/dark emulation of all 9 pages
  agrees; the only leak was `--success` (pinned in theme.css in A-021; the pin and the leftover light block
  were then removed in A-022, see below).
- A-022 (Lane A): no light mode, light and dark identical (owner decision). Removed the leftover
  `@media (prefers-color-scheme: light)` block from `css/tokens.css` (theme.css already overrode every token in
  it except `--success`), changed tokens.css's `color-scheme` from `dark light` to `dark`, removed the A-021
  `--success` pin from `css/theme.css` (redundant now), and updated the comments and ARCHITECTURE.md's
  "Dark only" paragraph. The `--success` token itself stays (defined once in tokens.css, #22c55e): the
  Available badge, event price and event badge use it. Light and dark emulation of 10 page states is
  pixel-identical.
- A-023 (Lane A): part-boxes leftovers (`css/part-boxes.css`, `css/style.css`, `js/render/partBoxOrder.js`).
  The quantity picker uses the approved `--border-field` for its border and dividers and shows a visible
  inset 2px accent edge on keyboard focus (the old ring was clipped by `overflow: hidden`); the order
  confirmation (`?ordered=true`) now uses the shared `.success-state` card (no own box inside the order
  panel) and the old `.notify-success` CSS is deleted. part-boxes is done apart from copy items
  (COPY_REVIEW.md).
- A-026 (Lane A): about page story section (`pages-src/about.html`, `css/style.css`). The one 720px centered
  block is now two columns on the page grid: the opening line ("Hi, I'm Jacob Skrove...") as a large
  statement on the left, pinned while reading, the five paragraphs in the right column at 65-76 characters
  per line; one column (paragraphs capped at 34rem) below 900px. Owner chose Option A. Copy unchanged
  (rendered text identical to B-025; hero and CTA untouched).
- A-027 (Lane A): gallery photo tile shape (`css/style.css`, `pages-src/gallery.html`). Gallery tiles are now
  3:4 with `object-fit: contain` (they were 1:1 squares with `cover`, which cropped 16 of the 22 portrait
  photos by a quarter); the 2x2 featured tile and 4-column layout are kept; 4:3 photos sit whole inside a
  tile with bars. The same grid feeds the homepage preview, whose tiles are now 3:4 too. The two section
  sub-headings are aligned with their titles (inline style replaced by `.section-header.align-left`).
  Owner chose Option B. Open items noticed: the homepage preview showed 3 photos in a layout built for 5 (an
  empty bottom-right quadrant; resolved in A-028); on phones at 420px and below the grid is one column and
  very tall (10,452px at 390px).
- A-028 (Lane A): homepage gallery preview shows 5 photos on desktop (`pages-src/index.html`, `css/theme.css`,
  `js/data/gallery.js` comment). The 4x2 bento is now full (featured tile + four around it); below 700px
  tiles 4 and 5 are hidden so phones keep 3. Owner approved ("yes, on desktop"). The lightbox from the preview
  lists all 5 photos. The stale "homepage just shows the first 3" line in gallery.js's instructions was fixed.
- A-029 (Lane A): gallery's empty "Current Builds" section is hidden while `currentBuilds` is empty
  (`pages-src/gallery.html`); it returns by itself when a photo is added in `js/data/gallery.js`. The first
  Completed Builds photo heading moves from 995px to 516px down the page. Owner chose Option A. Also added a
  "Mobile and tablet pass — backlog" section to VISUAL_REDESIGN.md collecting everything noticed for the mobile
  redesign, including the owner's new observation that iPhone Plus / Pro Max widths (428-430px) get a 2-column
  photo grid while smaller iPhones get one stacked column (cause: the single `max-width: 420px` rule on
  `.gallery-grid` in css/style.css). Nothing in that backlog was changed; the owner wants it handled in the
  mobile redesign.
- A-030 (Lane A): FAQ accordion (`js/render/faqList.js`, `js/render/faqAccordion.js`, `css/style.css`,
  `css/theme.css`, `pages-src/faq.html`). Questions are now real buttons inside the h2s (Tab, Enter and Space
  work, `aria-expanded`/`aria-controls` wired; before, Tab never reached them), closed answers are hidden from
  screen readers, answers reveal by their real height (grid-template-rows) instead of `max-height: 600px`, the
  boxes are replaced by hairline rows in an 800px column on the page grid, answers are capped at 65ch, and rows
  are 66px (were 88px). Applies to the homepage FAQ preview too. Owner chose Option B; this supersedes home
  decision 7's boxed accordion. Copy unchanged. This was the last unwalked page.
- A-031 (Lane A): handoff preparation, docs only. Lane A moves to a new chat (same account) for the mobile and tablet
  redesign. START_HERE.md: fixed stale lines (Next up, Do not touch, the ARCHITECTURE.md doc-map entry), added the
  browser and width facts under Tests. VISUAL_REDESIGN.md: the "Desktop first" process bullet now says the mobile pass
  is current, a how-to for building option artifacts was added, and the mobile backlog gained item 8 (tooling). No site
  files changed.

## Next up
**Lane A:** the desktop walk is finished (every page, A-030). Next: the mobile and tablet redesign (owner,
2026-10-13; Lane A moves to a new chat for it). The collected findings are in VISUAL_REDESIGN.md, "Mobile and tablet
pass — backlog" (8 items). Item 1 is the owner's own observation that iPhone Plus / Pro Max widths (428-430px) get a
2-column photo grid while smaller iPhones get one stacked column, caused by the single `max-width: 420px` rule on
`.gallery-grid`; a sensible first chunk. Baseline at A-031: no horizontal overflow and no script errors on any of the
10 pages at 14 widths from 320px to 1024px (Chromium only, see Tests). Page status: every page is walked; contact is
done apart from hero copy; custom-build apart from two deferred items (tier-card rule alignment at tablet widths, which
belongs to this mobile and tablet pass, and the final CTA box's kicker label, which waits for the copy pass); part-boxes
apart from copy items (COPY_REVIEW.md).
Open design findings (see VISUAL_REDESIGN.md): confirm whether the 9 remaining `gpt-thin-border-wide-shadow` hits are
the nav dropdown; `layout-transition` (FAQ accordion done in A-030; still open: the mobile nav submenu, which needs a
wrapper div first, and the page-load progress bar, not yet examined; the scanner has not been re-run); `--accent-h`
still equals `--accent` (harmless, noted).
**Lane B:** domain-swap checklist (`SITE.url`, Search Console, GitHub Pages custom domain; the owner cannot afford a domain yet,
so this can wait). The maintenance guide was written in B-025. (The ARCHITECTURE.md theming refresh was done in B-014.)

## Owner queue (waiting on you)
Medium term, not blocking (owner, 2026-10-09): a hero image (wants a good photo of several PCs or the building setup);
a real domain (cannot afford it yet), plus phone/Facebook values when ready; testimonials (stay off until real ones exist).

For the copy pass: the facts questions are answered (recorded in COPY_REVIEW.md, "Owner answers"). Owner rule: reword
only if misleading. Still to decide: whether to fix the two items that look misleading (pickup is described as at the
owner's address, but is usually a meet-in-the-middle with paid delivery possible; the site never says parts are used), and
the wrong/contradictory items in COPY_REVIEW.md Part 1 A. The copy pass itself waited until Lane A had walked
every page; that finished in A-030, so it can start.

## Do not touch
- Site copy wording: changes go through the copy pass (Lane B, COPY_REVIEW.md, owner rule "reword only if
  misleading"); Lane A does not reword copy. The custom-build final CTA label and the contact hero copy wait for it.
- Visual styling and layout: Lane A owns them (every page is walked at desktop; the mobile and tablet redesign is the
  current work). Lane B's copy pass changes words only, not CSS, markup structure or layout.

## Doc map
- **LOG.md**: completed chunks, newest last.
- **VISUAL_REDESIGN.md**: live design decisions and reasoning (Lane A).
- **MAINTENANCE.md**: owner guide to editing, previewing, publishing and fixing the site (B-025).
- **COPY_REVIEW.md**: audit of site text (what is wrong or misleading, what is not doing its job) for the copy pass (B-020).
- **ARCHITECTURE.md**: stack and structure (its theming text was refreshed in B-014 and updated in A-022 and A-030).
- **docs-archive/**: frozen as of B-001. DECISIONS.md (D1-D43, large), PROJECT_STATUS.md,
  TODO.md, CHANGELOG.md. Code comments cite "DECISIONS.md D##"; those are in
  docs-archive/DECISIONS.md. Grep them, do not read in full.
- **Tests:**
  - `smoke-test.js` (DOM checks in jsdom): run `npm install jsdom --no-save`
    first (jsdom is not in the repo). It needs the npm registry; whether that is
    reachable depends on the chat's sandbox network settings (Lane A's account
    reached it; Lane B's sandbox in B-002..B-005 did not, registry returned 403).
    If it cannot run, log "not run (reason)", never a pass. A-006: it ran in
    Lane A's sandbox (jsdom installed, npm reachable), ALL CHECKS PASSED.
  - Fonts: theme.css loads Google Fonts, which A-006's sandbox could not reach
    (no web fonts loaded), so screenshots, including visual-check.py's, use
    fallback fonts. For font-accurate mockups, install
    `@fontsource-variable/manrope`, `@fontsource-variable/bricolage-grotesque`
    and `@fontsource/space-mono` from npm in a scratch folder and inject
    `@font-face` rules (scratch copy only).
  - Browsers: only Chromium is installed for Playwright here (`chromium`, `chromium_headless_shell`, `ffmpeg` in
    `/opt/pw-browsers`); no WebKit or Firefox. The owner tests in Safari (macOS responsive design mode), so anything
    engine-specific needs the owner's eyes. CSS used on the site that older versions of other engines may ignore (all
    written to degrade gracefully, none verified outside Chromium): `text-wrap: balance` / `pretty`, `color-mix()`,
    `aspect-ratio`, and animating `grid-template-rows` (the FAQ accordion).
  - Widths: `visual-check.py` only checks 1440, 768 and 390px, and only for horizontal overflow, so it never sees the
    428-430px iPhone Plus / Pro Max widths or small phones. A-031 ran an ad hoc overflow and script-error check on all 10
    pages at 320, 360, 375, 390, 393, 412, 428, 430, 480, 600, 700, 768, 820 and 1024px: none of either. Extending
    `visual-check.py`'s `breakpoints` list is a reasonable first tooling step for the mobile pass.
  - `visual-check.py` (real Chromium screenshots + horizontal-overflow check):
    needs no network. Chromium is pre-installed at `/opt/pw-browsers`; both the
    Python and Node Playwright bindings launch it (checked in B-005). Run it
    on a scratch copy of the project: it writes `screenshots/` next to itself,
    and that folder must not go into the ZIP.
  - docs-archive statements (DECISIONS.md D24, PROJECT_STATUS.md) that the
    Node/npx Playwright route "doesn't work" are outdated: only the
    `npx playwright install chromium` download step failed, and it is not needed.
