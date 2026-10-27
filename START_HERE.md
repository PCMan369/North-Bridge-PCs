# START_HERE.md — North Bridge PCs website

Read this first, then the last few entries of LOG.md. Read other docs only
when the doc map (bottom) says to. Last updated: B-084 (2026-10-26).

## What this is
Static HTML/CSS/vanilla-JS site on GitHub Pages. Real sources are in
`pages-src/`; `build-tools/stitch.py` injects the shared partials and writes
the root `*.html`, `sitemap.xml`. Content lives in `js/data/*.js`; PC listings live in `content/builds/*.json`
(ADMIN_SETUP.md); `js/data/builds.js` and `gallery.js` are generated from them.

## Rules (every chat)
1. **The uploaded ZIP is the source of truth.** It is a complete replacement
   snapshot, never a patch. After each new upload, re-read any file before
   editing it; do not rely on copies seen earlier in the conversation. Inventory (`content/`, `images/`) can change on
   GitHub between ZIPs: the owner pulls before zipping; never return older inventory over newer.
2. **First reply of every turn is one line:** `Working from <zip name>; last
   log entry <ID>.` If the ZIP name's ID and LOG.md's last ID disagree, say
   so before doing anything else.
3. If LOG.md and the files disagree, say so in the reply. Do not silently
   pick one.
4. Edit `pages-src/`, partials and data, never the generated root `*.html`, `js/data/builds.js` or `gallery.js`. For listings
   edit `content/builds/*.json`, then run `python3 build-tools/content.py` and `python3 build-tools/stitch.py` before packaging.
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
Mirror the ZIP into your repo so deleted files disappear (keep `.git`; dry-run first; commit with the entry ID). Steps and
cautions: MAINTENANCE.md, "Applying a returned ZIP".

## Docs budgets (keep the docs lean)
- **START_HERE.md under about 8 KB**: rules plus CURRENT state only. Edit the matching line when state changes; never
  append a per-chunk bullet (that is the log's job).
- **A LOG.md entry under about 1.2 KB**: Task, Changed (5 short bullets at most), Decision, Verified (1-2 lines),
  Next/open. Point to the VISUAL_REDESIGN.md section for detail. No diffs, code or per-file narration.
- **LOG.md keeps about the newest 10 entries.** Roll older ones verbatim into docs-archive/ (`LOG-<first>-<last>.md`);
  the newest entry always stays.
- **VISUAL_REDESIGN.md** keeps process, scope, sitewide decisions, open findings and the current pass's backlog; closed
  page records go verbatim to docs-archive/ with a heading index in the live file.
- If a budget is exceeded when you start, say so; fix it in the same chunk if the fix is docs-only.

## Current state (as of B-084)
- V1 build is complete. Services were removed (B-003, B-004); the old
  services.html URL returns the 404 page. One PC is listed and available (oct26-01); the HP EliteBook laptop was removed from the site (B-081); the no-inventory states show only when none is available. Dark only, no
  light mode (A-022); the `--success` token stays.
- **Visual redesign.** Live record: VISUAL_REDESIGN.md (closed desktop decisions: docs-archive/VISUAL_REDESIGN-desktop-pass.md).
  Accent is "Cask" `#8b3f5e` sitewide. Desktop walk done A-030; mobile and tablet pass done (A-042; owner checked
  iPhone 8 Safari, iPad, MacBook; Android untested). Left open: custom-build's final CTA kicker label (copy pass).
- **Built pieces that constrain new work** (forms, badges, gallery, part-boxes, FAQ): moved to VISUAL_REDESIGN.md, "Built pieces that
  constrain new work"; read it before visual changes.
- **Remote admin (B-084):** Pages CMS forms (`.pages.yml`) edit `content/`; `publish.yml` checks and deploys. Tested here; NOT yet run
  on GitHub or a phone (ADMIN_SETUP.md).
- **Checks:** `visual-check.py` and `smoke-test.js` clean at B-084; `test-content.py` and `test-render.js` added (B-084); Impeccable last ran at A-043 (clean).

## Next up
**Lane A:** the copy pass is done, so a minor redesign so the layout suits the new wording and paragraph sizes (list in COPY_REVIEW.md,
"For Lane A"). New visual work starts from an owner request.
**Lane B:** after the owner's phone test, Phase 2 of the admin (part-box quantities, events/FAQ forms, failure email, weekly backup). Earlier: the first copy pass (B-074) and the purposeful-repetition review (B-076; standard wordings: COPY_BRIEF.md section 21) are done. The polish list is applied (B-078). Next: refresh COPY_MAP.md (owner: refresh, not retire), the business-name change and the domain-swap checklist (with a business email instead of the personal one).

## Owner queue (waiting on you)
- **Admin setup and iPhone 8 test** (ADMIN_SETUP.md). Not done yet.
- Not blocking (owner): a hero image; a real domain plus phone/Facebook values; testimonials.
- Reminders (owner asked): (1) the "no returns or warranty" wording (FAQ, home checklist, listing pages) is deliberately unchanged until the legal
  check (COPY_REVIEW.md "Accuracy review"); (2) oct26-01 testing notes, then change its summary to "Cleaned and stress tested..."; (3) oct26-01 video
  clips.
- Copy pass: first pass complete (B-074); the accuracy-review fixes are applied (B-081, COPY_BRIEF.md section 22). Standard wordings repeat on purpose
  (section 21): change one everywhere or nowhere. The business name may change ("Name change" in COPY_REVIEW.md). Delivery fee left unstated.

## Do not touch
- Site copy wording goes through the copy pass (Lane B; the owner approves every wording); Lane A does not reword copy.
  While applying copy, Lane B may make small markup/CSS changes when necessary or very helpful (owner, B-049) and says
  so in the log; anything larger or purely visual goes to Lane A.

## Doc map
- **LOG.md**: newest ~10 completed chunks, newest last. **docs-archive/**: frozen history (grep, never read in full):
  DECISIONS.md (D1-D43; code comments cite "DECISIONS.md D##"), PROJECT_STATUS.md, TODO.md, CHANGELOG.md,
  LOG-<first>-<last>.md (rolled-over log entries, by ID range), START_HERE-through-A-031.md, VISUAL_REDESIGN-desktop-pass.md,
  VISUAL_REDESIGN-mobile-pass.md (M1-M6, backlog, walk findings).
- **VISUAL_REDESIGN.md**: live design process, scope, open findings (Lane A); mobile pass (M1-M6) archived.
- **ADMIN_SETUP.md**: remote listing admin, setup and daily use. **ARCHITECTURE.md**: stack and structure. **MAINTENANCE.md**: owner guide. **COPY_REVIEW.md**: text audit and rewrite plan. **COPY_BRIEF.md**: message brief. **COPY_MAP.md**: every text spot and its job.
- **TESTING.md**: how to run `smoke-test.js`, `visual-check.py` and the Impeccable scan, sandbox limits (npm registry,
  fonts, browsers) and widths covered. Read it before running or reporting a test. Never claim a test passed unless it ran.
