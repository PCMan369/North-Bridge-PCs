# TODO.md — North Bridge PCs Website Rebuild

## Required (blocks launch)

- [x] Confirm the 3 proposed-but-unconfirmed items in DECISIONS.md (D2
      Services page structure, D3 countdown toggle, D5 brand carryover)
      — all 3 confirmed by owner. D5 is also now moot in practice since
      the Forge redesign replaced the carried-forward blue palette
      anyway, but the confirmation stands for the historical record.
- [x] Nav restructuring: flat nav → "For Sale" dropdown/accordion (see
      DECISIONS.md D6) — Services deliberately stayed flat, see D6 note
- [x] Part Boxes system: `js/data/partBoxes.js`, card renderer, multi-item
      order-request page, `part-boxes.html` (see DECISIONS.md D6) — done
- [x] Phase 2: shared header/footer partials + `stitch.py` build script
- [x] Phase 2: homepage
- [x] Phase 3: Services page content (owner-provided wording/pricing) — done
- [x] Phase 3: real PC inventory migrated into the new schema
- [x] Phase 3: About Me content (owner-provided) — done, but see
      Recommended below re: the `[Your Name]` placeholder
- [x] Phase 4: contact form (see DECISIONS.md D7 — consolidated to one
      unified form since build.html now has its own embedded inquiry form)
- [x] `custom-build.html`, `faq.html`, `gallery.html`, `services.html`,
      `about.html` — built, tested
- [x] Phase 5: sitemap, robots.txt, structured data, Open Graph — done,
      built against the placeholder URL, verified swap-safe (see
      DECISIONS.md D10)
- [ ] When the real domain arrives: update `SITE.url` in
      `js/data/config.js`, re-run `stitch.py`, set up a fresh Google
      Search Console property for the new domain, submit the
      regenerated `sitemap.xml` there
- [x] Phase 7: functional/programmatic testing (link integrity, feature
      toggles, form success+failure paths, empty-state, accessibility
      structure, SEO) — done, see DECISIONS.md D14. **Not covered**:
      actual visual rendering in a real browser (sandbox has none).
- [x] Image optimization: 11 real photos, 12.47MB → 4.50MB (63.9%
      reduction), EXIF/GPS metadata stripped (one photo had precise
      GPS coordinates embedded — see DECISIONS.md D13)
- [x] Contact form works with zero JavaScript now (owner's live-site
      critique #1) — `stitch.py` bakes the real form action/redirect
      into static HTML at build time; see DECISIONS.md D15
- [x] Post-audit implementation Batch 1: "Get Notified" waitlist
      (builds.html) now works with zero JavaScript — converted to a
      real `<form action="...">` with the same honeypot/`_next`
      pattern as contact.html, instead of a JS-only `fetch()` call
      with no fallback; see DECISIONS.md D16
- [ ] Owner's live-site critique #2: pre-render JS-driven content
      (PC listings, trust cards, FAQ, service cards, gallery) into
      static HTML at build time, so it isn't empty when JS fails or
      isn't run — **deferred** (owner is planning bigger changes here);
      moved into the future build-time-rendering architecture
      experiment (see ARCHITECTURE.md and the post-audit implementation
      plan in PROJECT_STATUS.md) — not started, explicitly sequenced
      after the current audit-fix batches and the visual redesign
- [ ] Owner's live-site critique #3: replace the hero image fallback
      text with a real photo — blocked, waiting on owner to provide it
- [x] Homepage gallery-preview logic ("sold-PC gallery fallback"):
      prioritize available-PC photos/video, fall back to sold-PC media
      when nothing's available, empty state if neither, sourced from
      `builds.js` directly (not the separate `gallery.js`) — done, see
      DECISIONS.md D22
- [x] Create a real `404.html` — done. Follows the same design system
      as every other page (theme.css, shared header/footer, the same
      centered `.empty-state` card pattern used elsewhere), highlights
      no nav item as active, has a `noindex` tag, and is deliberately
      excluded from `sitemap.xml` (see `stitch.py` and DECISIONS.md
      D25). Buttons back to the homepage and the gaming-PC listings.
- [x] **V1 finishing pass**, done one part at a time — see
      PROJECT_STATUS.md for full detail:
      - [x] Part 1 — sitewide availability notice (D30)
      - [x] Part 2 — contact-forms system review (D31)
      - [x] Part 3 — services page content/structure rework (D32)
- [x] Contact page rebuilt as a situation router — 6 options, 2 link
      to existing dedicated forms (Service/Repair, Part Box), 4 map to
      3 real form panels (Buying, Custom PC, shared General/Other).
      Supersedes D31's dropdown. See DECISIONS.md D33.
- [x] Migrated 2 remaining builds from the old live site's leftover
      legacy `js/builds.js` (Ryzen 5 5500/RX 5700 XT, HP EliteBook 840
      G10) into the current `builds.js` schema, with their real
      photos. Laptop's old performance-section disclaimer moved to
      `notes` per owner request. Found and fixed a real bug along the
      way: `notes` was never wired up to render anywhere on the site.
      See DECISIONS.md D34.
- [ ] **Reminder (owner asked to be reminded):** decide what belongs
      in the EliteBook's (`aug26-02`) now-empty performance-estimate
      section, if anything — see PROJECT_STATUS.md "Known open
      questions."
- [x] Scroll progress bar replaced with a page-load progress bar
      (`#scroll-progress` → `#load-progress`) — fills on page arrival,
      starts filling on click of an internal link. Same visual look.
      See DECISIONS.md D35.
- [x] Added first real part box inventory (5 box types, real
      quantities/pricing/condition, no photos yet by owner's choice).
      See DECISIONS.md D36.
- [x] Confirm "MSI MAG A650BE" — owner wrote "MG A650BE"; corrected
      as a likely typo (MSI's PSU line is "MAG," not "MG"). Owner
      confirmed correct. See DECISIONS.md D42.
- [x] Evaluated the Impeccable design-critique tool (owner asked).
      Fixed 2 real issues + 1 text-size inconsistency it surfaced.
      See DECISIONS.md D37 for the full list of what was fixed vs.
      flagged as the owner's call.
- [x] Fixed all remaining hardcoded-blue instances (30 total across
      style.css/build-detail.css/part-boxes.css, not just the 21 in
      style.css D37 had found) — zero left anywhere in the codebase
      now except tokens.css's own base --accent value, which is
      supposed to default to blue. Found 2 unused CSS rules along the
      way. See DECISIONS.md D38.
- [x] Resolved all remaining Impeccable "owner's call" items (D39):
      removed the hero eyebrow chip + its dead CSS; removed the static
      border+shadow combo from 5 of the 6 selectors that had it (kept
      it on the nav dropdown menu and on hover-triggered states,
      both deliberate); rewrote every em-dash in
      about.html/contact.html/index.html by hand. Re-ran the actual
      Impeccable CLI afterward to confirm both findings are fully
      resolved. See DECISIONS.md D39.
- [x] Marked aug26-01 (Ryzen 5 5500/RX 5700 XT) as sold.
- [ ] 3 unused CSS rules now on record (`.highlight-box`,
      `.step-list-num`, `.card`) — worth a deletion pass whenever one's
      wanted, not urgent.
- [ ] Impeccable's "dark-glow" finding is unchanged (38, D39) — it's
      flagging the intentional amber glow on buttons/back-to-top/focus
      rings, part of the already-approved Forge identity. Not touched;
      worth an explicit decision if the owner wants it revisited.
- [x] Google Analytics (gtag.js) added sitewide via a new
      `<!--ANALYTICS-->` marker + `js/partials/analytics.html` —
      exactly once per page on all 11 pages, verified in the built
      output. See DECISIONS.md D40.
- [x] Second part box batch added (6 more, 11 total) — 2 new
      categories (Motherboard Box, Cooler Box), found and fixed a
      real empty-brand rendering bug along the way. See DECISIONS.md
      D41.
- [x] Confirm the brand for the "B550-PLUS AC-HES" part box (D41) —
      owner confirmed ASUS.
- [x] Carried the 2 D34-migrated builds' photos into `gallery.js`:
      the sold RX 5700 XT set into Completed Builds, the available
      EliteBook set into Current Builds (previously empty). Found and
      fixed along the way: those same 11 photos were never run
      through the D13 image-optimization pass — done now, 6.72MB →
      3.35MB, no GPS data found this time. See DECISIONS.md D42.

## Recommended

- [x] Take a look at the Batch 1 + Batch 2 visual redesign (and the
      D27 audit fixes) yourself, on your own machine — done, confirmed
      it looks fine; see DECISIONS.md D24/D27/D28
- [x] Fill in `[Your Name]` placeholder in `about.html` — done, "Jacob Skrove"
- [x] Decide whether to carry over the "sold" builds from the old site into
      the new sold-PC gallery, or start that section fresh — carry
      over; done, see DECISIONS.md D42
- [x] Decide on business email handling — going with the personal
      Gmail for now, managed with inbox rules; see DECISIONS.md D29
- [ ] Before actual launch: turn phone/Facebook back on with real
      values whenever those are ready (currently off, per D29) — the
      display email is already real (`jacobskrove@gmail.com`)
- [ ] Testimonials — collect any real ones that exist, or leave the
      section off (toggle is already safe either way; owner confirmed
      leaving it off for now)
- [x] Part boxes: real inventory added (11 total across D36 + D41) —
      this line was stale, left over from before that inventory
      existed; the page still handles 0/1/many gracefully if the
      count changes again.

## Optional

- [ ] Manual light/dark toggle (architecture already supports adding this
      later without restructuring tokens)
- [ ] Flyer generator / QR code integration with the new build pages

## Future / explicitly disabled for now

- [ ] Blog/articles (toggle exists in config.js, nothing else built)
- [ ] Online payments / Stripe (no scaffold built — reassess when actually
      being implemented, per the project brief)
- [ ] Customer accounts (not planned)
- [ ] Expanded service area copy (don't write until the area actually
      expands)
