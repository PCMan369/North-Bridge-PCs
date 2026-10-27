# VISUAL_REDESIGN-mobile-pass.md — closed mobile and tablet pass records, moved verbatim from VISUAL_REDESIGN.md in A-045

Frozen history; grep, never read in full. Contents, in the order they had in the live file: the mobile walk findings
(owner, real devices; includes decision M6), decisions M1-M5, and the 8-item mobile backlog. Code comments that cite
"Visual Redesign M1" to "M5" point here. The live file keeps an index.

---

## Mobile walk findings (owner, real devices)

Device: iPhone 8, iOS 16.7.16, Safari (owner, A-041). Everything else looked fine. Also checked by the owner and fine: an
iPad and a MacBook (2026-10-15). Android: not tested (no device). **The mobile and tablet pass is finished (A-042).**
1. **FIXED in A-041, confirmed on the iPhone by the owner (2026-10-15).** Tapping into a form field and out again left the page
   scrolling sideways; zooming in and out cleared it. Cause (very likely, not reproduced here: only Chromium is
   available): every field's text was under 16px (`.form-input`, `.form-select`, `.form-textarea` 14.72px; `.qty-input`
   14.4px), and iOS Safari zooms the page when such a field gets focus and can leave it zoomed. Nothing on any page is wider
   than the screen (checked at 375px with touch emulation), which fits a zoom artifact. Fix: 16px in those fields inside
   `@media (pointer: coarse)` (`css/style.css`, `css/part-boxes.css`); desktop unchanged (14.72px). Rejected:
   `maximum-scale=1` in the viewport tag (blocks pinch zoom). Side effect: fields are 1-2px taller on touch screens
   (41px -> 43px).

**M6. Available and Sold badges: Option C, one outlined pill everywhere (A-043, owner chose C: "they have an important
role").** The listing cards (builds page, homepage) used a filled pill and the build detail page the quiet variant (dot +
text, `.badge-quiet`, decision 5); now `.badge-available` / `.badge-sold` in `css/style.css` are a thin coloured outline
(`rgba(34,197,94,0.5)` / `rgba(239,68,68,0.45)`), no fill, round 5px dot, and `.badge-quiet` is deleted (its class removed
from `js/render/buildDetail.js`, 3 places). Text colours unchanged (`--success`, `--danger`); `.build-card.is-sold` still
dims at 0.72 opacity. Rejected: A (quiet everywhere; less eye-catching on a card) and B (filled pill everywhere; reverses
decision 5). Measured on the real pages with real fonts, identical to the option artifact (pixel-identical badge crops;
text contrast 7.85:1 card Available, 9.43:1 card Sold, 8.58:1 and 10.3:1 on the detail page, 9.69:1 in the sold notice).
Badges are one line, 65x28px (Sold) and 93x28px (Available), at 320, 390 and 430px with no overflow. The red `.sold-notice`
panel on a sold build's page is unchanged. All five real builds are sold, so Available was checked on a scratch copy with
one build flipped.

## Mobile and tablet pass — decisions

**M1. Phone gallery grid: Option C (A-033, owner chose C).** At 699px and below every `.gallery-grid` is 2 columns
(gap 0.75rem), the first photo spans both columns, and on the gallery page a last tile that would sit alone (even photo
count) also spans both. Homepage preview stays at 3 tiles: 1 big + 2 small. Replaces the 420px one-column rule in
`style.css`; rules are in `css/theme.css`. Rejected: A (one column on every phone, 480px breakpoint; page 11,625px at 430)
and B (2 columns, preview 2x2; shortest, but no featured photo). Measured on the real pages after implementing
(Chromium; identical to the option artifact): gallery page 3,244px at 390 (was 10,452), 3,617px at 430 (was 2,855), 5,204px
at 600 (was 4,101); preview 688px at 390 (was 1,408), 768px at 430 (was 503). Known trade-off: at 481-699px the featured
photo is large (552x736 at 600). Unchanged at 700px and up (4 columns).

**M2. Contact situation picker buttons on phones: Option B (A-034, owner chose B).** At 640px and below the five picker
buttons keep the desktop `min-width: 12.5rem`, so all are 200px wide (were 148px for "Get Started" and 196px for "Browse
Part Boxes"), left-aligned under the text. The phone rule no longer resets `min-width` (`css/situation-picker.css`).
Rejected: A (full-width bars) and C (same width, right-aligned). Measured on the real page with real fonts (identical to the
option artifact): all five buttons 200px at 320, 360, 390, 430, 600 and 640px; picker height unchanged (875px at 390).
Above 640px unchanged.

**M3. Tier cards at tablet widths: Option A, subgrid rows (A-035, owner chose A).** At 641px and up the six parts of each
custom-build tier card share rows across the cards (`.grid-3 > .tier-card`, `grid-row: span 6`, `grid-template-rows:
subgrid`, in `css/style.css`, inside `@supports`), so list rules and buttons align whatever the descriptions wrap to. Needs
exactly six children per card. Before: row-1 rules 23-24px apart at 661-681 and 751-781px. Rejected: B (also a full-width
third card at 641-900px) and C (one column up to 900px, 1,790px tall). Measured on the real page with real fonts (identical to
the option artifact): row-1 rule gap 0px at 661, 671, 681, 751, 768, 781, 820, 900, 901, 1024 and 1440px; grid 1,324px at 768
(was 1,303); phones unchanged. The third card still sits alone at half width at 641-900px. Safari (subgrid needs 16+) not run.

**M4. Part-box cards on small phones: Option B (A-036, owner chose B).** At 389px and below the card is two rows: photo +
text on top, then a ruled footer across the whole card with price left and quantity picker right (`css/part-boxes.css`;
`.box-body` is `display: contents`, row 3 is `1fr`). Photo column 96px. Before: price wrapped above the picker at 321-375px
(all 12 cards) and again at 381-388px, where the photo column jumps from 96 to 110px at 381. Rejected: A (stack on purpose,
full-width picker) and C (same two-row card up to 480px; taller cards at 390-480px). Measured on the real page with real
fonts (identical to the option artifact): 0 of 12 cards wrapped at 320, 360, 375, 384, 390, 430, 480 and at 381-388; grid
3,079px at 320 (was 3,493), 2,868px at 375 (was 2,750, which had only 2 wrapped); 390px and up unchanged. Quantity
buttons still work at 320px. Cards without a category or condition line (none today) are not rendered.

**M5. Accent text on the accent tint: Option C, a lighter shade on tinted surfaces only (A-039, owner chose C).** New token
`--accent-text-tint: #b38195` (`css/theme.css`), used by the active nav link, active dropdown link and mobile sublink
(`css/style.css`), `.faq-icon` (`css/theme.css`) and `.box-category` (`css/part-boxes.css`); the caret inherits from its
trigger. Everything else keeps `--accent-text` `#ae798e`, and the filled Contact button keeps white text. Why: the tint
darkens the surface, so `#ae798e` was 4.68:1 there in the real pages (4.24:1 in the scanner's static estimate); the tint
shade is 5.13:1 (4.64:1 in the scanner's worst case). Rejected: A (leave it; passes AA but 8 advisories stay) and B (lighten
`--accent-text` sitewide). Measured on the real pages after implementing: lowest accent text on a tint 5.13:1 (was 4.68:1);
detector 0 advisories (was 8). Never use the tint shade on plain `--card`/`--bg` or on the solid accent fill (a blanket
version put it on the filled Contact button at 2.2:1 and was caught by the detector).

## Mobile and tablet pass — backlog
Collected during the desktop-first walk and worked through in the mobile redesign. All 8 items are DONE (A-033 to
A-037); kept as the record.

1. **DONE in A-033 (M1).** **iPhone Plus / Pro Max see grids where smaller iPhones see a stack (owner
   observation, 2026-10-11, Safari responsive design mode).** Confirmed by
   measurement. The only small-screen breakpoint that falls between common
   iPhone widths is `@media (max-width: 420px) { .gallery-grid { grid-template-columns: 1fr } }`
   in `css/style.css`. Column counts for the gallery grid and the homepage
   preview (same `.gallery-grid`): 1 column at 320, 375, 390 and 393px (iPhone
   SE, mini, 12-15, 14/15 Pro); 2 columns at 428 (Plus / 12-13 Pro Max), 430
   (14-16 Pro Max), 480 and 600px. Other grids measured at the same widths
   (builds grid, part-box grid, custom-build tier cards, home builds grid) are
   1 column at all of them, and the only other rules at 480px and below are
   part-boxes' card photo column (110px at 480 and below, 96px at 380 and
   below), which do not split the 390-430 range. The owner reports similar
   problems "in other places like the gallery"; those were not identifiable
   from the CSS alone, so walk 390 against 430 side by side, page by page.
2. **DONE in A-033 (M1).** Gallery grid at 420px and below: one column of 342x456 tiles, 10,452px for
   22 photos on a 390px phone (about 8,000px with squares). 2 columns on small
   phones is an option (and would also address item 1).
3. **DONE in A-033 (M1).** Homepage preview: at 421-699px its 3 visible tiles sit in 2 columns, so one
   is alone on the second row; at 420px and below 3 tall tiles are 1,408px.
   Its lightbox still lists all 5 photos on a phone.
4. **DONE in A-035 (M3).** Tier-card rules on custom-build at tablet widths: the top rules of the
   three cards line up at 1440 and 1024px but are 24px apart at 768px (one
   description wraps to 4 lines, another to 3); a robust fix would be CSS
   subgrid (see the custom-build "Tier-card feature lists" subsection).
5. **DONE in A-034 (M2).** Contact situation picker at 640px and below: the two button widths differ
   (148px and 196px) because they size to their text.
6. **DONE in A-036 (M4).** Part-boxes at 360px and 320px: the price + quantity row wraps to two lines
   (price above the picker) because there is no room beside a photo; tidy, but
   a mobile-specific card layout may do better.
7. Gallery grid with few photos (any width): see the note above. After M1, by the CSS rules (not rendered): 1 photo is
   full width; 2 photos are both full width; 3 or more start with a full-width tile.
8. **DONE in A-037.** Tooling: `visual-check.py` only checked 1440, 768 and 390px (overflow only), so
   it never sees 428-430px or small phones; add at least 320, 375, 393, 428, 430
   and probably 600, 820 and 1024. Baseline (A-031, ad hoc, real Chromium): no
   horizontal overflow and no script errors on all 10 pages at 320, 360, 375, 390,
   393, 412, 428, 430, 480, 600, 700, 768, 820 and 1024px. Only Chromium is
   available in the sandbox; Safari behaviour (the owner uses its responsive
   design mode) needs the owner's eyes.

