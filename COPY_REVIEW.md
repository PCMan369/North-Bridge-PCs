# COPY_REVIEW.md — site text audit (planning input for the copy pass)

Written by Lane B in B-020 (2026-10-08), read-only: **no copy was changed.** Owner answers added in B-024 (below). Based on the A-013/B-019 files and on the pages as
rendered in Chromium with every build marked sold (the site's current state). Findings are about accuracy and role, not about
rewording. "Role" below means what the text is for, judged from its style and placement; placements may change in the redesign,
so each item names its place by file so it can be found again. Where something can't be checked from the files it says
**unknown**, and the owner has to confirm it.

Where the text lives: `pages-src/*.html` (page copy, titles, meta descriptions), `js/data/faq.js`, `js/data/builds.js`
(summaries, notes), `js/data/partBoxes.js`, `js/partials/header.html` and `footer.html`, and strings inside
`js/render/*.js` (empty states, form success messages, the "what happens before pickup" section).

## Owner answers (2026-10-09, recorded by Lane B in B-024)

The owner's rule for the copy pass: **reword only if the text is misleading.** Answers to the B-020 questions:

- **Payment:** mostly cash now; other methods possible if wanted. The site's "cash or payment at pickup" is consistent with this.
- **Returns:** none. The owner will help with troubleshooting if a buyer has problems. The FAQ's support answer already says
  troubleshooting help, not a warranty; "no returns" is not stated anywhere. Owner decision: not required unless misleading.
- **New or used:** mostly used; PSU and case almost always new. The site never says used or new (searched all copy).
- **Pickup:** around Grants Pass, usually meeting in the middle. If a buyer would rather not, the owner may deliver for a fee.
  The site says "local pickup" and "exact address shared after we've confirmed a sale" (contact.html), which reads as pickup at the
  owner's location, and delivery is not mentioned. "Serving Grants Pass, Medford, Ashland..." is consistent with meet-in-the-middle.
- **Budget tiers:** unknown. Prices are realistic, but the sold builds at or barely above $500 had a better GPU than an RX 580,
  so the tiers probably undersell. Part 1 item 6 stays open.
- **Privacy line:** owner says it is accurate; the owner only emails about new builds to people who joined the waitlist.
  Decision: no change. (Items 9 and 13 closed. The FormSubmit / Google Analytics observation in item 9 stands as information only.)
- **Process claims on the home page:** owner believes every one is accurate. Items 10 and 12 closed. Item 14 (response time) was not answered.
- **Hero image, real domain, testimonials:** all medium term (no money for a domain yet; wants a good hero photo of several PCs or the
  building setup). Not blocking the copy pass.

**Copy pass progress** (words only; update this list each chunk)
**Process (owner, B-047): Lane B drafts suggested wording, the owner edits it, then Lane B applies it.** Nothing is applied
before the owner has seen the draft, except small fixes the owner has asked for in their own words.
- B-046 done: part-boxes meta description, the pickup wording, the "used parts" statement (home and listing trust text, new FAQ item).
- B-047 done: part-boxes meta description made generic on purpose (no box types named, so it never needs updating).
- B-048 done: chunk 2, the owner's choices applied as they edited them (home "Available Systems" intro, Gaming PCs intro,
  Custom Build last line, gallery intro and description, FAQ Fortnite/War Thunder opening words, contact "Buying a Gaming PC").
  The wording is now on the pages; the drafts were in a picker page and are not kept here.
- **Rewrite plan (owner, B-048/B-049; small markup/CSS changes allowed when helpful):**
  1. Message brief: marked by the owner, final (COPY_BRIEF.md, B-050/B-051).
  2. Location map: COPY_MAP.md (B-051), agreed. 3. Taglines and selling points: chosen (COPY_BRIEF.md 9, 10).
  4. Page by page: home first screen and "How I Work" (B-055), home Available Systems and checklist sections (B-056), home lower sections (B-058) applied; the home page is done. FAQ page (B-060, B-061), Gaming PCs and listing pages (B-062), Custom Builds (B-064), Contact (B-066) applied; About (B-068) applied; Gallery (B-070) applied; Part Boxes (B-072) applied; 404 (B-074) applied: the first copy pass is complete. Next: the purposeful-repetition review, the polish list, the name change.
  3. Taglines and selling points chosen from the brief (picker page, three directions).
  4. Page-by-page drafting in the picker, then apply: header and footer, home, listings, custom builds, About, FAQ, contact,
     part boxes, small messages.
  5. Words only unless a small markup/CSS change helps; flag anything bigger to Lane A.

**What this leaves for the copy pass, by the "only if misleading" rule** (my reading; the owner decides):
1. Pickup wording (see above): a buyer is told "pickup" and "address shared after sale" but the usual arrangement is a meeting point near
   Grants Pass, with paid delivery possible.
2. "Used": the site never says the parts are used, and the listings only show older parts. A buyer could assume new.
3. Still wrong or contradictory regardless of the answers: Part 1 A1 (part-boxes meta description), A2 (stock copy above the empty
   states), A3/A4 (FAQ "every system" vs. the sold laptop; checklist wording for the laptop).
4. Optional (not misleading, owner's call): stating "no returns", extra payment methods, custom-build timing, and Part 2 items.

---

## Part 1 — Text that is incorrect or may mislead

### A. Wrong against the current files or state (checked)

1. **Part-boxes meta description says "GPU, CPU, and case packaging"** (`pages-src/part-boxes.html`, description and og:description).
   The listings are CPU, PSU, cooler and motherboard boxes. There is no GPU box and no case box. This text shows in search results
   and link previews.
2. **Intro copy written for stock, shown above "nothing in stock".** All five builds are sold, so these pairs contradict each other:
   - Home "Available Systems": "Cleaned, tested, and ready for pickup. Performance estimates listed for every system." sits directly above
     "No Systems Listed Right Now" (`pages-src/index.html`).
   - `builds.html` lede: "Cleaned, stress tested, and ready for local pickup... Every listing includes real specs..." above "Nothing Listed Right Now".
   - Home hero primary button "View Gaming PCs" and the page titles "Gaming PCs for Sale..." (home, builds) lead to an empty-state page.
   - Gallery "Current Builds — Systems that are currently available or in progress." above "Photos coming soon."
     (the "coming soon" line is in `js/render/galleryGrid.js`).
   - Contact picker "Buying a Gaming PC — I'll check it against what's currently available."
3. **FAQ says every system is capable of gaming, but one sold system is a laptop that is not.** FAQ "Can it run Fortnite?": "every
   system I sell is capable of running Fortnite". War Thunder: "runs well on all the systems I sell." The EliteBook listing
   (`js/data/builds.js`) says it is not a gaming PC and "will not perform very well in most PC games". The EliteBook is also listed
   under "Gaming PCs / Recently Sold", with no performance estimates, while the same page says every listing has them.
4. **Process claims that can't apply to the laptop.** The home checklist says "CPU and GPU pushed under sustained load" for every
   system, and the EliteBook has no dedicated GPU. Its own summary says "cleaned and tested", not stress tested.
5. **FAQ describes build classes the site does not sell.** "Mid-range systems... can handle Epic settings" and "High-end builds
   run it at 1440p". All listings so far are one class (1080p High, $400–$649). Not false, but it isn't backed by anything on the site.
6. **Budget tiers vs. real listings (possible mismatch, unknown).** Custom-build tiers: ~$500 = "GTX 1080 / RX 580 class",
   ~$800 = "RTX 3060 / RX 6700 class", ~$1,200 = "RTX 3070 / RX 6800 class". Sold listings were $549–$649 with RTX 2060 / RX 5700 XT /
   RTX 2070 Super, which is stronger than the $500 tier. Either the tiers undersell, or the listings were priced low. Owner to confirm
   which numbers reflect current parts prices.
7. **Duplicate, slightly different tier text.** The home table and the three custom-build cards describe the same three budgets in
   different words (e.g. "Good starting point without overspending" vs "A good starting point if you're getting into PC gaming without
   overcommitting on budget").

### B. May mislead a reader (wording could be read the wrong way)

8. **"Serving Grants Pass, Medford, Ashland..."** (home hero, contact, custom-build, gallery, structured data `areaServed`) next to
   "pickup is in person" and "exact address shared after we've confirmed a sale". It does not say where pickup happens, so a
   Medford or Ashland reader may expect delivery or a meet-up. Whether you meet elsewhere: **unknown**.
9. **Privacy line: "won't be shared or used for anything else"** (contact forms, notify box, listing inquiry form).
   Messages go through the third-party FormSubmit service (`formsubmit.co`), and the site loads Google Analytics (`partials/analytics.html`).
   The sentence is about the email address and is probably meant that way, but it reads as a stronger promise than the
   setup supports. There is no privacy page. **Unknown** whether that is a problem; flagging it only.
10. **Absolute claims.** "no shortcuts, no exceptions" (home); "Nothing runs hot, no surprises after pickup" (home); "The specs listed are accurate" (home).
    They are fine only if true for every system without exception. The EliteBook's CPU (exact generation) and Windows version are noted in
    `builds.js` comments as **not confirmed**, so "Intel Core i5" and "Windows" are vague rather than wrong.
11. **Performance estimates vs. "tested".** The numbers are estimates "based on real-world expectations for that hardware"
    (home), while the checklist says the system is stress tested. A reader can mistake the fps figures for measured results. The listings
    do say "Estimated". The FAQ says they "reflect typical gameplay". Three different descriptions of the same thing.
12. **"Linux available on request", "no extra charge", "set up before pickup"** (header, contact, FAQ, tier cards). Plausible and
    repeated consistently; I can't check it, so the owner should confirm it is a firm offer.
13. **Notify box: "one-time heads up"** vs. success message "I'll reach out when something comes in that might be a good fit".
    Probably consistent (one message when something fits) but could be read as "only ever one email". Minor.
14. **"I typically respond within a day or two"** (contact, success messages) is the owner's promise; **unknown** if it holds.

### C. Gaps (not wrong, but a buyer will look for them and won't find them)

15. No stated payment methods ("cash or payment at pickup" is the only mention), returns/refunds, or "sold as-is" statement. The FAQ
    says support is not a warranty but never says what happens if the system is dead on arrival.
16. Whether parts are new or used is not stated anywhere (the data suggests used/older parts: RTX 2060, 2070 Super). Buyers ask.
17. Custom builds: no timeframe on that page (only on About, "can run longer during the school year"), and nothing about deposits
    or who buys the parts first.
18. The old services URL now shows the generic 404 page, with no mention that repair/services are no longer offered. Minor.

---

## Part 2 — Text with an important role that is not doing it well

Ordered by how prominent the role is (hero first). "Idea" = what the text says; "wording" = how it says it.

1. **Home hero (H1 + body + two buttons).** Role: the first thing every visitor reads.
   - Wording: the H1 is clear and keyword-friendly but generic; the body paragraph is a long single sentence that lists three towns.
   - Idea: it says what and where, not why this seller. The real differentiators (one person, honest, local, tested, Linux)
     sit lower on the page. The primary button points at the empty listings (item 2 above) while the second button, the live offer,
     is secondary.
2. **Call-to-action buttons sitewide.** Role: tell the reader what happens next.
   - Eight different labels for roughly the same next step: Send a Message, Send Message →, Contact Me →, Reach Out →, Start the
     Conversation →, Get Started → (four times on the contact picker, identical), Talk Budget → (three times), Ask About a Custom Build.
   - Idea: the contact picker's four "Get Started →" buttons are identical, so the title next to each does all the work.
3. **Empty states (home "No Systems Listed", builds notify box, gallery "Photos coming soon", part-boxes).** Role: right now these are the
   main content of the shopping pages.
   - The home and builds pages use different headings for the same situation ("No Systems Listed Right Now" vs "Nothing Listed Right Now").
   - "Photos coming soon." is placeholder language, and gives a visitor nothing.
   - Idea that works: the notify form (ask what they're looking for, tell them what happens next) is the strongest piece here. It
     is long for its job and the "Privacy:" line is flat.
4. **The "What actually happens before pickup" trust section** (home; repeated as "Why North Bridge PCs / What You're Getting" on every
   listing). Role: main reason to trust a stranger's used-parts PC. Strongest idea on the site.
   - Wording: the five steps are generic ("Dust removed", "Thermals verified"), the claims are absolute (item 10 above), and the
     lead paragraph is one dense block that mixes three ideas (accurate specs, honest estimates, a real person after pickup).
   - Idea gap: no concrete evidence of any step (how long the stress test runs, what temperature counts as OK, which tests), and nothing
     about what the buyer gets in hand (receipt, parts list).
5. **Budget tiers (home table + custom-build cards).** Role: set expectations and anchor the price.
   - Wording is vague ("Solid 1080p gaming on popular titles"); the real information (the part classes) is only on the custom-build page.
   - Duplicated in two places in different words, and possibly out of step with the listing prices (items 6 and 7).
6. **FAQ (five questions, three featured on home).** Role: answer the objections that stop a purchase.
   - Idea: the questions are two game-specific ones (Fortnite, War Thunder), Linux, upgrades, trades, support. The questions buyers
     are most likely to have are missing (item 15–17: payment, returns, new vs used, custom build timeline).
   - Wording: answers are good ("Yes — ...", "To be clear about what this is...") but long; the home preview leads with Fortnite.
7. **Contact situation picker** (five rows). Role: route the visitor to the right form.
   - "General Question" and "Other / Not Sure" overlap, and the second one apologises ("This works too").
   - The contact page puts four info blocks (Response Time, Pickup Location, Custom Builds, Linux Available) above the picker, so the
     action starts below them. The last two are sales copy rather than contact information.
8. **About page.** Role: personal trust, and the strongest human voice on the site.
   - Idea is good (honest, new, local, a student). Structure is weak: five long paragraphs in a block, and the clearest promise ("What I can promise
     is...") is near the end of the fourth. H1 "About" is generic.
   - The lede line "The short version" is followed by a long version.
9. **Page ledes under each H1** (builds, gallery, custom-build, contact). Role: say what the page is for in one breath.
   - Several repeat the same location list and "cleaned, stress tested, ready for pickup" phrase, which reads like keyword repetition,
     and tells a returning visitor nothing new. Gallery lede: "Current listings and completed builds, serving Southern Oregon."
10. **Listing summaries** (`builds.js` `summary`, shown on cards and listing pages). Role: tell this build apart from the others.
    - Three of the five are the same sentence ("Cleaned and stress tested 1080p/1440p gaming build."), a fourth differs by one
      word ("1080p"), with no price/performance or notable-part hook, so the listing grid reads as copies.
11. **Page titles and meta descriptions** (search results and link previews; `pages-src/*.html`). Role: the first impression off-site.
    - Inconsistent patterns: separators `|`, `—` and `,` mixed; some titles carry "Grants Pass OR", some don't; "for Sale" appears
      while nothing is for sale; part-boxes has the description error (item 1); `build.html` uses one static title/description for all
      listings (any per-listing title is set later by script, **unknown** whether search engines see it).
12. **Section kickers** (small labels above headings: "Built for You", "Extra From the Bench", "Photos", "Questions & Answers").
    Role: orient the reader. Some do ("Ready to Buy", "Sold History"); others repeat the heading ("Photos" over "Gallery",
    "Questions & Answers" over "Frequently Asked") or say nothing ("Built for You"). Low impact.
13. **Header tagline and nav labels.** Role: instant value proposition. "Local Pickup • Custom Builds • Linux Available" works well.
    "For Sale" groups Custom Builds (a service, not a stock item) with Gaming PCs and Part Boxes; fine, but worth a look if
    the nav changes.

Not a problem (checked and left alone): About's start date (May 2026) matches the first listing; footer availability line; 404 text; sold-listing
message; part-box condition lines (as of B-019); form success messages.

## Suggested order for the copy pass (when the owner is ready)
1. Facts first (owner answers): payment methods, returns/as-is, new vs used, where pickup happens, tier prices, privacy wording, process claims.
2. Fix the wrong/stale items (Part 1 section A) so nothing contradicts the current state or the part-box inventory.
3. Then the role work (Part 2) page by page, after Lane A finishes each page's layout, since placement changes what is worth saying.

## Polish list (small things noticed during the rewrite; handle after the rewording is done)
Rule (owner, B-057): whenever Lane B notices a small issue, it goes here instead of being fixed on the spot or forgotten.
- "Before" is said six times in the home checklist section (label, heading, lead, big line, steps 03 and 04); trim step 03's "before it goes anywhere". (B-056) DONE (B-076): step 03 trimmed; "before" is now said five times.
- "Listed" is said four times in the home empty state; trim its first sentence. (B-056) DONE (B-076): the sentence now says "Everything I've listed so far has sold."; "listed" is still said three times there (heading, sentence, section title).
- "Tested" is said in the header tagline, the home intro and "Ready to play". (B-055) CLOSED (B-077): kept on purpose (the hands-on promise, COPY_BRIEF.md section 21).
- DONE (B-062, checked B-066): the listing pages' checklist big line is now "Five steps before it's yours."
- DONE (B-060): the FAQ Linux answer now states where free ends.
- `js/data/config.js` tagline is still "Southern Oregon Gaming PCs" (used in structured data) while the header now says "Gaming PCs, honestly built and tested." (B-055)
- Budget tiers (~$500, ~$800, ~$1,200): the owner is unsure the GPU classes match what the sold systems had; confirm before the Custom Builds page is reworded. (B-049) DONE (B-064): named graphics cards removed, fps marked "Typically".
- Button labels on pages not yet reworded (Talk Budget, three times on the Custom Builds budget cards; Contact Me in the Part Boxes cards, `partBoxCard.js`) should use the chosen set: Browse Gaming PCs, Start a Custom Build, Send a Message, Get Notified. (B-051) DONE (B-078): no old label is left on the site.
- COPY_MAP.md describes the copy as it was at B-051; refresh or retire it when the rewrite ends. (B-057)
- Gallery section on the home page says "Recent Work", "Recent Builds" and "built and sold": the label and heading echo each other. (B-058) DONE (B-076): the label is now "Photos".
- "Questions" is in two adjacent home headings ("Questions Before You Buy" and "Have a Question? Ready to Buy?"). (B-058) DONE (B-076): the bottom heading is "Want to Talk It Through?".

## Accuracy review (B-080 to B-081)
An outside review (ChatGPT's notes, checked against the source by Lane B at B-080) found ten items. All are applied at B-081 except the first, which the owner deferred: the "no returns or warranty" wording (FAQ answer, `trustSection.js` on every listing page, home checklist) stays as it is until the owner's legal check (parent/guardian and an Oregon legal or small-business resource). Notes for that check: Oregon's sales statute (ORS 72.3160) lets implied warranties be excluded by language like "as is" or "with all faults" that makes the exclusion plain, with writing and conspicuousness rules for other exclusions; a signed bill of sale at pickup may be the stronger place; the site sentence alone may not settle it. Proposed copy for later: "Systems are sold as-is, so there are no returns, but if you hit a snag after getting it home, email me and I'll help you troubleshoot." The EliteBook laptop was removed from the site at B-081, which closes the audit items about the laptop (A3, A4 and the gallery/"built by me" concern). FormSubmit's policy (read at B-080) states no retention period, so the site makes no promise about retention.

## Polish status (B-077)
The polish list is spread over this file (the list above, items after "Name change", and the Lane A list). Sorted at B-077:
- Wording to decide (owner): DONE, B-078: ten small fixes from the published picker "Polish list: small wording fixes" (Contact custom-form heading and "Pick" echo; Custom Builds "five checks", "GPU", budget-card buttons and "what's listed"; the home See-it-running point; the listing search description's double "Grants Pass"; the FAQ after-sale paragraph; Part Boxes "my builds"). Apply as B-078 when the owner's choices come back.
- Closed, kept on purpose (no work): "tested" and "ready" on the home page, About's "one person" and "before it's yours", the home empty-state "listed" (three uses), the gallery intro next to the traded laptop (owner, B-070), the budget tiers (B-064).
- Waiting for something else: the Gallery "For Sale" label (until a current photo exists); the config tagline (`js/data/config.js`, not shown on any page; goes with the name change).
- Lane A (visual, see that list): the lone RGB dropdown, Custom Builds accent line spacing, longer header tagline, FAQ game answers (owner). (The EliteBook photo order item is closed: the laptop was removed, B-081.)
- Later chunks: the name change ("Name change"), the domain-swap checklist, and COPY_MAP.md (it still describes the copy as of B-051: refresh it or retire it; owner to say which).

New items from applying the polish picker (B-078): "Send a Message" is now the button on six Custom Builds buttons (the process section, the three budget cards, "Not Sure" and "Ready Now"), all to the Contact page, and the "Ready Now" one has no arrow while the other five have →; the Custom Builds cards say "graphics card" in the blurb and again in the list (tier 3); the home checklist steps still say "GPU" ("CPU and GPU pushed under sustained load", "GPU and system drivers current"); a sold listing page still says "See what's listed now" (standard: "available"); COPY_MAP.md refresh is the next chunk (owner: refresh, not retire).

New with the first available listing (B-079): the gallery's "Available Now" section now shows, with label "For Sale" and "Systems listed for sale right now." (the echo noted at B-070 is now visible); the listing page's "More Gaming PCs" box still says "See what's listed now" (standard: "available").

## Purposeful repetition (owner, B-069: after the first copy pass, consider it)
Task for Lane B once every page has its new copy and before the polish list is closed. The brief warns against repeating phrases like keywords, but some repetition helps: a visitor who sees the same few promises in the same words on several pages learns to trust them.
- Decide which messages are repeated on purpose (candidates: one person who builds and tests; "see it running" before pickup; honest about being new; the usual reply time; local pickup; Linux available; no pressure).
- For each, pick one standard wording and the pages where it belongs (and where it does not). Record it as a short table in COPY_BRIEF.md.
- Sort the echo items on the polish list into "keep, on purpose" and "vary or cut", and make wording of the kept ones identical.
- Present it in a picker like the others (the table, with a recommendation and reason per message), then apply. Check the balance again: a message repeated more than three times per page, or word for word in neighbouring sentences, still counts as an echo.

Status (B-076): the owner chose option A on all seven and the changes are applied; the standard wordings are recorded in COPY_BRIEF.md section 21. New polish items from applying them: the listing search description says "Grants Pass" twice ("...in Grants Pass, Oregon. Pickup in person near Grants Pass."); the home "See it running" point now repeats "running" in title and text, and "before it's yours" appears in it and in the checklist big line; Custom Builds "Ready Now" text says "see what's listed right now" (the standard is "available"); `responseTimeNote` in `js/data/config.js` is not used by any page (now the standard wording); the Part Boxes hero and Contact row still describe the boxes in two wordings. Earlier status (B-075): picker drafted with seven messages (hands-on promise, "see it running", the truth promise, reply time, pickup label, "ready-to-buy"/"available", home-page echoes) and a list of wording that is already identical and needs no choice. Owner chooses; then apply, and record the standard wordings as a table in COPY_BRIEF.md. Found while surveying: the home page uses "ready" seven times; the listing pages' "What You're Getting" heading is another use of the promise phrase (keep); each of the three Custom Builds budget cards says "Linux available on request" (kept unless the owner says otherwise); the listing search description says "Built and tested by North Bridge PCs" (a name-change item).

## For Lane A (after the copy pass): minor redesign for the new wording and paragraph sizes
Owner, B-059: the layout may need small changes once the new copy is in. Places already known (add more as the rewrite goes on):
- Header tagline is longer ("Gaming PCs, honestly built and tested."); check the header at 320 to 1440px and in the mobile menu.
- New "How I Work" strip on the home page: only a hairline-row style (`.point` in theme.css); may want spacing, emphasis or icons.
- Home hero: new heading and shorter intro; the empty-state block and the shortened checklist paragraph leave more white space.
- Home FAQ preview now shows four questions, and every FAQ answer changes length as the FAQ page is reworded.
- Button labels are longer in places ("Start a Custom Build", "Read the Full FAQ"): check widths on phones.
- Listing pages: the checklist text there was shortened too.
- FAQ "What if something goes wrong after I buy?": the paragraph under the answer still says "not a warranty program or a repair service", which repeats "no returns or warranty" in the answer above it. (B-060) DONE (B-078).
- FAQ: two answers are about specific games (Fortnite, War Thunder); consider whether one is enough once the rest of the site is reworded. (B-060)
- Part Boxes (B-072): the hero says "left over from my builds" while the Contact row says "left over from builds" (same idea, two wordings: DONE B-078, the Contact row now says "my builds"); "Includes insert(s)" (owner's wording) merges the old "includes inserts" and "includes cardboard insert" lines, so per-box accuracy is the owner's to check.
- Part Boxes order emails: the hidden field `estimated_total` is now `total`, so the owner's notification email shows "total" (B-072).
- Gallery (B-069): all 22 photos carry the alt text "previously sold" (screen readers hear it each time); `js/render/galleryGrid.js` says "Photos coming soon." only if a grid is empty (never today); the first six gallery photos are a laptop (HP EliteBook 840 G10) that the owner got in a trade for a PC they built; the owner said to change no wording because of it (B-070), so the photos stay first. Moving them after the PCs is a data-order change in `js/data/gallery.js`, left to the owner.
- Gallery: "For Sale" label over "Systems listed for sale right now." says it twice (section hidden until a current photo exists); the intro says "built and sold" while the first photos are the traded laptop. (B-070)
- About: "before it's yours" (local paragraph) echoes the home checklist's "before"; ("what you're getting" twice: DONE B-076); the opening line ("I build and test every PC here myself") and the hero line ("One person") overlap. (B-068)
- Contact custom form: with the monitor field gone, the three dropdowns (Wi-Fi, Windows or Linux, RGB) leave RGB alone on the last row at desktop width; Lane A may want it full width or paired. (B-066)
- A sold listing page says "See what's listed now, or ask about a custom build" in the sold notice and again, with the same button, in the "More Gaming PCs" box below. (B-062)
- The listing description now says "Pickup in person near Grants Pass" (DONE B-076); the header "Local Pickup" and Contact's "Pickup and Delivery" stay on purpose. (B-062)
- `js/render/buildDetail.js` writes the business name as a literal in four places (title, description, form subject, "Why North Bridge PCs"); see Name change below. (B-062)

## Name change (owner, B-062: the business name may change; do it as one pass, together with the domain if possible)
Where the name appears today (counts of "North Bridge" in sources, from a search at B-062): pages-src/contact.html 8, about.html 4, part-boxes.html 3, gallery.html 2,
faq.html 2, builds.html 2, build.html 2, 404.html 2, index.html 1, custom-build.html 1; js/render/buildDetail.js 4, trustSection.js 1, notifyBox.js 1; js/partials/footer.html 2,
header.html 1 (the logo splits it as "North Bridge" plus an accent-coloured "PCs"); js/data/config.js `businessName` (feeds the home page structured data and, via build-tools/stitch.py,
other generated text); js/data/builds.js 1. Also: page titles end in "| North Bridge PCs" (all 10 pages); FormSubmit subject lines in the forms; `SITE.url` still contains
"North-Bridge-PCs" (the GitHub repository path); the ZIP names (nbpcs) and a few docs mention it. A rename is a search-and-replace plus a check of the logo (two-colour split)
and the structured data; it should be one chunk after the copy pass, and it changes the tagline and title lengths, so the minor redesign should come after it.
- Custom Builds step 05 says "five checks" while the home page and listings say "Five steps"; pick one word. (B-064) DONE (B-078): "steps".
- The Custom Builds cards say "GPU" in the one-line blurb and "graphics card" in the list; pick one term. (B-064) DONE (B-078): "graphics card" (also in the home budget table).
- The three budget cards still have the button "Talk Budget →"; the chosen set is "Send a Message". (B-064) DONE (B-078).
- On the Custom Builds page the accent line sits right above the "Send a Message" button in the process section: Lane A may want more space. (B-064)
- DONE (B-066): the Contact form's "Need a Monitor?" field was removed (owner's pick).
- Contact: the custom panel's heading is still "Custom PC" while the picker row is now "Custom Build". (B-066) DONE (B-078).
- Contact: "Pick" opens both the hero intro and the picker intro. DONE (B-078; the "ready-to-go" and "what's listed" parts DONE B-076)
- DONE (B-076): the Contact Response Time block now says "I usually reply within a day or two."
- DONE (B-076): the listing-page inquiry thank-you now matches Contact's confirmation.

## How the picker pages work (so a new chat can continue the copy pass)
Each step is a single self-contained HTML page published with the Artifact tool (items: current text, options A/B/C, "Keep current wording", a star on the recommended option, a
"Why I'd pick X" note, an editable box for the chosen option, and a "Copy my choices" button whose list the owner pastes back). Pickers are not stored in the project; they live in
the chat that made them. To make the next one: read the page's current text (script-made text lives in js/render/*.js and js/data/*.js), draft three directions in the voice in
COPY_BRIEF.md, recommend one with a reason, check title/description lengths (title about 60, description up to 155), then check the balance of the owner's choices before applying and put small
things on the polish list. Pages done: all of them (first copy pass complete, B-074). Next: the polish list (see "Polish status"), the
business-name change (see "Name change"), the domain-swap checklist, and Lane A's minor redesign.

