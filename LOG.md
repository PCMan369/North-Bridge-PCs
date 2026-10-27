# LOG.md — completed chunks, newest last

Append-only. Entry header: `<lane>-<number> | complete|partial | <date or unknown>`.
Next number = highest in the header lines below + 1 (see START_HERE.md).
Files: A=added M=modified D=deleted, from a real diff of uploaded vs. returned project.
Rollover: entries B-001 to A-022 were moved verbatim to docs-archive/LOG-B001-A022.md in B-032, A-023 to A-027 to
docs-archive/LOG-A023-A027.md in A-037, A-028 and A-029 to
docs-archive/LOG-A028-A029.md in A-039, A-030 to B-032 to
docs-archive/LOG-A030-B032.md in A-042, A-033 and A-034 to
docs-archive/LOG-A033-A034.md in A-044, A-035 and A-036 to
docs-archive/LOG-A035-A036.md in B-046, A-037 and A-038 to
docs-archive/LOG-A037-A038.md in B-048, A-039 to A-045 to
docs-archive/LOG-A039-A045.md in B-055, B-046 and B-047 to
docs-archive/LOG-B046-B047.md in B-057, B-048 and B-049 to
docs-archive/LOG-B048-B049.md in B-059, B-050 and B-051 to
docs-archive/LOG-B050-B051.md in B-061, B-052 and B-053 to
docs-archive/LOG-B052-B053.md in B-063, B-054 and B-055 to
docs-archive/LOG-B054-B055.md in B-065, B-056 and B-057 to
docs-archive/LOG-B056-B057.md in B-066, B-058 and B-059 to
docs-archive/LOG-B058-B059.md in B-067, B-060 and B-061 to
docs-archive/LOG-B060-B061.md in B-070, B-062 and B-063 to
docs-archive/LOG-B062-B063.md in B-072, B-064 and B-065 to
docs-archive/LOG-B064-B065.md in B-074, B-066 and B-067 to
docs-archive/LOG-B066-B067.md in B-076, B-068 and B-069 to
docs-archive/LOG-B068-B069.md in B-078, B-070 and B-071 to
docs-archive/LOG-B070-B071.md in B-081, B-072 and B-073 to
docs-archive/LOG-B072-B073.md in B-082, B-074 and B-075 to
docs-archive/LOG-B074-B075.md in B-084. Keep about the
newest 10 entries here; the newest entry always stays (the next-ID rule reads it).

B-076 | complete | 2026-10-21
Task: Purposeful repetition: apply the owner's choices (all seven option A); balance checked first. Lane B.
Files: M pages-src/index.html, pages-src/custom-build.html, pages-src/about.html, pages-src/contact.html, js/render/buildDetail.js, js/render/buildCard.js, js/render/trustSection.js, js/data/config.js, COPY_BRIEF.md, COPY_REVIEW.md, START_HERE.md, LOG.md; A docs-archive/LOG-B066-B067.md; root index.html, custom-build.html, about.html, contact.html regenerated.
Changed:
- Standard wordings applied: "I build and test every PC myself" (Custom Builds), "you can see the system running" (home, step 06), the promise "exactly what you're getting, good and bad" (About), "I usually reply within a day or two" (Contact block, listing thank-you, unused config note), "Pickup in person near Grants Pass" (listing description), "ready-to-buy" and "available" (Contact).
- Home echoes: step 03 (also the listing pages, which share it), empty-state sentence, gallery label "Photos", bottom heading "Want to Talk It Through?".
- COPY_BRIEF.md section 21 records the standard wordings (table) and the rule: change one everywhere or nowhere.
Decision: balanced; nothing severe. Mild effects noted on the polish list (listing description says "Grants Pass" twice; "running" twice in one home point; "listed" still three times in the home empty state).
Verified: `visual-check.py` clean (150 loads); real Chromium (1440, 390 px): every new string present and every old one gone, no overflow or script errors; on a scratch copy with one listing available, the form sub-line and thank-you show the new wording; `smoke-test.js` not run (jsdom install fails: network).
Next/open: the polish list, the business-name change, the domain-swap checklist; Lane A's redesign when the owner asks.

B-077 | complete | 2026-10-21
Task: Start the polish list: sort every open item and draft the picker for the wording ones. Lane B, docs only.
Files: M COPY_REVIEW.md, START_HERE.md, LOG.md. No site file changed. Published page: "Polish list: small wording fixes".
Changed:
- COPY_REVIEW.md "Polish status": the list was spread over three places; every open item is now sorted (wording to decide, closed on purpose, waiting, Lane A, later chunks). Two old items marked closed/done (tested; budget tiers).
- Picker (10 small fixes, each with three options and a recommendation): Contact custom-form heading and "Pick" echo; Custom Builds "five checks", "GPU", budget-card buttons, "what's listed"; home See-it-running point; listing description's double "Grants Pass"; FAQ after-sale paragraph; Part Boxes "my builds". Items closed on purpose are listed at its top.
- START_HERE.md owner queue updated; question to the owner: refresh or retire COPY_MAP.md.
Decision: none yet; the owner's choices come back from the picker.
Verified: picker tested in Chromium (phone and desktop, light and dark), no errors, copy output checked. Docs only, no site tests run.
Next/open: owner's choices; apply as B-078; then the name change and the domain-swap checklist.

B-078 | complete | 2026-10-21
Task: Polish list: apply the owner's ten choices (all option A); balance checked first. Lane B.
Files: M pages-src/contact.html, pages-src/custom-build.html, pages-src/index.html, js/render/buildDetail.js, js/data/faq.js, COPY_REVIEW.md, START_HERE.md, LOG.md; A docs-archive/LOG-B068-B069.md; root contact.html, custom-build.html and index.html regenerated.
Changed:
- Contact: custom-form heading "Custom Build", intro "Choose what fits below...", Part Boxes row "left over from my builds". Custom Builds: "five steps", "graphics card" (also the same sentence in the home budget table), three buttons "Send a Message →", "see what's available right now".
- Home See-it-running point "before you buy it". Listing search description "Built and tested by North Bridge PCs. Pickup in person near Grants Pass, Oregon." FAQ after-sale paragraph shortened (data).
- Text only; no markup change.
Decision: balanced; nothing severe. Notes on the polish list: "Send a Message" is on six Custom Builds buttons (the "Ready Now" one has no arrow); the home checklist still says "GPU"; a sold listing still says "See what's listed now".
Verified: `visual-check.py` clean (150 loads); real Chromium (1440, 390 px): every new string present and old ones gone on contact, custom-build, home and FAQ (items opened), no overflow or script errors; listing description checked on a scratch copy with one listing available; `smoke-test.js` not run (jsdom install fails: network).
Next/open: the owner checks the whole site with the new copy; refresh COPY_MAP.md (owner: refresh, not retire); the name change; the domain-swap checklist.

B-079 | complete | 2026-10-24
Task: Add the owner's first new PC listing (oct26-01, Ryzen 5 3600 / RX 5700 XT, $650) with nine photos; also in the gallery. Lane B.
Files: A images/oct26-01-{blue,red,green}-{angle,front,close}.jpg (9); M js/data/builds.js, js/data/gallery.js, COPY_REVIEW.md, START_HERE.md, LOG.md. Root HTML unchanged (stitch output identical).
Changed:
- Photos: 9 HEIC converted to 1350x1800 JPEG (sRGB), all metadata removed (no EXIF, GPS or colour profile, checked); order blue, red, green for angled, then front, then close-up, IMG_0181 first.
- builds.js: new listing at the top (available, $650, ten components as the owner named them, four fps estimates, notes on lighting, condition and parts history); testingNotes and videos left empty on purpose.
- gallery.js: the nine photos in currentBuilds, so the "Available Now" section shows.
Decision: summary line drafted by Lane B ("Cleaned and stress tested 1080p gaming build with RGB lighting."); no cores, speeds or VRAM listed (owner: item names only). RAM generation, Ethernet speed and front ports left out (not given).
Verified: data loads (6 builds, 9 gallery photos, all files exist); `visual-check.py` clean (150 loads); real Chromium at 1440 and 390 px: home, Gaming PCs, listing and gallery pages show the listing, no broken images, overflow or script errors; listing page screenshot viewed; `smoke-test.js` not run (jsdom install fails: network).
Next/open: owner to add testing notes and video clips (reminder); is the fan remote included in the sale; COPY_MAP.md refresh; name change; domain-swap checklist.

B-080 | complete | 2026-10-24
Task: Fix the PSU brand on listing oct26-01 (owner: autocorrect error, "Alecia" should be "Apevia"). Lane B.
Files: M js/data/builds.js, START_HERE.md, LOG.md. No other site file changed.
Changed:
- oct26-01 power supply is now "Apevia Prestige 600W" (was "Alecia Prestige 600W"). No other occurrence in the site.
- START_HERE.md owner queue notes the pending review (drafted in chat, no edits made).
Decision: none.
Verified: data loads; `visual-check.py` clean; listing page shows the corrected name. `smoke-test.js` not run (jsdom install fails: network).
Next/open: owner's decision on the accuracy review; testing notes and video clips for oct26-01; COPY_MAP.md refresh; name change; domain-swap checklist.

B-081 | complete | 2026-10-24
Task: Apply the approved accuracy-review fixes and the laptop removal; the "no returns or warranty" wording and its legal check are deferred (owner). Lane B.
Files: M js/data/builds.js, js/data/gallery.js, js/data/faq.js, js/render/buildDetail.js, js/render/notifyBox.js, js/partials/footer.html, pages-src/{index,builds,contact,about,part-boxes,custom-build}.html, COPY_BRIEF.md, COPY_REVIEW.md, MAINTENANCE.md, START_HERE.md, LOG.md; D images/EliteBook*.jpg (6); A docs-archive/LOG-B070-B071.md; all root pages regenerated (footer line).
Changed:
- Laptop: listing, six gallery entries and six photo files removed. oct26-01 summary now "Cleaned 1080p gaming build with RGB lighting." (not stress tested yet).
- Privacy lines on every form (FormSubmit named; part-box form gets one), Google Analytics line in the footer; performance, Linux, pickup/delivery, About, notify-form and sold-page wording (COPY_BRIEF.md section 22).
- Availability: neutral Gaming PCs title and home hero; the "Ready to Buy" labels are now "Available Now" or "Recent Builds" (page script). Small markup/script changes under the B-049 rule.
Decision: balanced; all approved fixes applied. Deferred, with reminders: no-returns wording and legal check, oct26-01 testing notes, video clips, fan remote question.
Verified: `visual-check.py` clean (150 loads); real Chromium (1440, 390 px): every new string present and old ones gone, labels switch on a scratch copy with everything sold, notify box and sold page text, gallery layout and footer viewed, no overflow or script errors; `smoke-test.js` not run (jsdom install fails: network).
Next/open: COPY_MAP.md refresh, the name change, the domain-swap checklist; the reminders above.

B-082 | complete | 2026-10-24
Task: Reorder the photos on listing oct26-01 (owner): blue, red, green, each as angle, front, close-up. Lane B.
Files: M js/data/builds.js, js/data/gallery.js, START_HERE.md, LOG.md; A docs-archive/LOG-B072-B073.md. Root HTML unchanged.
Changed:
- builds.js: oct26-01 images now blue-angle, blue-front, blue-close, red-angle, red-front, red-close, green-angle, green-front, green-close.
- gallery.js: the same nine photos in "Available Now", in the same order, so the two places match (Lane B's choice; the owner asked only for the listing).
Decision: none. Side effect: the home gallery preview (first five photos of the available listing) now shows three blue and two red.
Verified: data loads; `visual-check.py` clean; real Chromium (1440, 390 px): listing main photo and thumbnails, gallery section and home preview in the new order, no errors.
Next/open: COPY_MAP.md refresh; name change; domain-swap checklist; reminders (no-returns wording and legal check, testing notes, video clips, fan remote).

B-083 | complete | 2026-10-24
Task: Record that the RGB remote is included in the sale of listing oct26-01 (owner). Lane B.
Files: M js/data/builds.js, START_HERE.md, LOG.md. Root HTML unchanged.
Changed:
- oct26-01 "Included" row: "Power cable" and "RGB remote for the fan lighting"; the lighting note says "the fans with the included remote".
- START_HERE.md: the remote question is closed (reminders now: no-returns wording and legal check, testing notes, video clips).
Decision: none.
Verified: data loads; `visual-check.py` clean; listing page shows both included items and the updated note. `smoke-test.js` not run (jsdom install fails: network).
Next/open: COPY_MAP.md refresh; name change; domain-swap checklist; the remaining reminders.

B-084 | complete | 2026-10-26
Task: Phase 1 of remote listing management (owner-approved plan: Pages CMS forms + GitHub Action; ADMIN_SETUP.md). Lane B.
Files: A .pages.yml, .github/workflows/publish.yml, content/, ADMIN_SETUP.md, 7 build-tools scripts/tests, js/render/escape.js, docs-archive/LOG-B074-B075.md; M js/data/builds.js and gallery.js (now generated), 3 renderers, 4 pages (one script tag), START_HERE, MAINTENANCE, ARCHITECTURE, TESTING, VISUAL_REDESIGN.md.
Changed:
- Listings are content/builds/*.json (price a number); builds.js and gallery.js are generated, same data (B-083's remote edit carried over). Draft/hidden never reach public data.
- Listing text is escaped when drawn; the listing page 404s any status but available/sold.
- photos.py strips GPS/EXIF; the Action checks, builds, saves and deploys; a failed check publishes nothing.
- Built-pieces list moved verbatim from START_HERE to VISUAL_REDESIGN.md (START_HERE was over budget).
Decision: gallery derived from listings (extras: gallery-extras.json); videos not in the form yet.
Verified: data deep-equal to the uploaded B-083 builds.js; renders identical old vs new; test-content 49/49, test-render 28/28 (12 fail on old renderers); smoke-test, visual-check clean. NOT run: the Action on GitHub, Pages CMS, a phone.
Next/open: owner setup + iPhone 8 test (ADMIN_SETUP.md); Phase 2 (part boxes, events/FAQ forms, failure email, backup).
