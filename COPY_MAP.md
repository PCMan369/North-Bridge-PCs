# COPY_MAP.md — every text spot on the site, what it is for, and what the copy should do there

Step 2 of the copy rewrite (COPY_REVIEW.md plan; facts, voice and selling points are in COPY_BRIEF.md). Built by Lane B in B-051 from the
page sources, partials, scripts and data files as of A-045 plus the B-046 to B-050 wording. **Read-only: no copy was changed.** Text
is clipped to about 120 characters here; the full text is in the file named in each heading. "Slot" = one piece of visible text.

## 1. What each kind of slot is for (rules the drafts will follow)

| Slot | Its job | Rule for the drafts |
|---|---|---|
| Page title (browser tab, search result) | Say what this page is, in the first words | Up to about 60 characters; page-specific words first, "North Bridge PCs" second; at most one place name |
| Meta description (search result, link preview) | Make someone click | 120 to 155 characters; one sentence of what and for whom, one proof point; no keyword lists |
| H1 | Name the page in plain words | One per page; matches what the visitor expected to find |
| Page intro (under the H1) | The one thing to know before scrolling | One or two sentences; no town list; no repeating the checklist |
| Kicker (small label over a heading) | Orient the reader | Keep only if it adds a word the heading lacks; never repeat the heading or another page's kicker |
| Section heading | Name what follows | Six words or fewer; plain over clever |
| Body text | Carry one idea | One idea per paragraph; every claim traces to COPY_BRIEF.md; estimates are called estimates |
| Button / link | Tell the reader what happens next | Verb plus outcome; the same destination always gets the same label |
| Empty state | Say what is true right now, give one next step | Never written as if stock exists |
| Form label, placeholder, privacy line, success message | Make the form feel safe and quick | Short labels; placeholders are examples; success says what happens next and when |
| Process / trust list | Prove the claim | Concrete, true, not absolute ("no exceptions"); each line something a buyer could check |
| Listing summary and notes | Tell this system apart from the others | A reason to pick this one; any flaw stated plainly |
| Navigation, header tagline, footer | Instant orientation | Two words or fewer for nav; the tagline carries the one-line promise |

Voice for all of it: straight-talking (brief section 3). Values (honesty, fair dealing, doing the whole job yourself) are stated in plain
words; no quotes from or references to the Bible.

## 2. Repeated and inconsistent copy found while mapping
- "Cleaned / stress tested / ready for pickup" is said, in different words, in: home, Gaming PCs, listing pages, Custom Builds, FAQ and
  the trust section. One strong statement plus pointers would be clearer than six variants.
- The town list ("Grants Pass, Medford, Ashland") appears on the home page, Custom Builds and Contact; "local pickup" on four pages and in the header.
  The brief says to stop repeating it.
- Button vocabulary: "Send a Message", "Send Message", "Contact Me", "Reach Out", "Start the Conversation", "Get Started" (four times),
  "Talk Budget" (three times), "Ask About a Custom Build" all lead to the contact form. Listing buttons: "Browse Systems", "Browse
  Available Systems", "View Gaming PCs", "View All Systems", "Browse Gaming PCs", "Browse More Systems".
- Kickers: "Ready to Buy" and "Get in Touch" are each used on two pages; "Photos" sits over "Gallery" and "Questions & Answers" over "Frequently
  Asked"; "Built for You" and "Extra From the Bench" say little.
- Title and meta lengths: home title 73 characters (search results cut near 60) and home description 184 (cut near 155); part-boxes
  description 160. The listing page uses one generic title and description for every listing.
- The three budget tiers are described twice (home table and Custom Builds cards) in different words, and their GPU classes look weaker
  than the systems actually sold at similar prices (COPY_REVIEW.md item 6).
- Linux: the FAQ says "no extra charge" and lists Arch; brief fact 8 says advanced distros or configuration may cost extra.
- Voice: the About page and parts of Custom Builds already sound like the brief's voice A; the process lists and ledes do not.

## 3. Site-wide slots
- **Header tagline** (`js/partials/header.html`): "Southern Oregon Gaming PCs" and "Local Pickup • Custom Builds • Linux Available".
  The brief's kept taglines ("Gaming PCs, honestly built and tested." / "Ready to play, built around your budget.") could replace the first.
- **Navigation** (header, footer, mobile): Home, For Sale (Gaming PCs, Custom Builds, Part Boxes), About, Gallery, FAQ, Contact.
- **Footer** (`js/partials/footer.html`): "Southern Oregon"; "Availability changes regularly — if you don't see what you're looking for, or aren't sure what's currently available, just send a message."; "North Bridge PCs — Southern Oregon".
- **Settings tagline** (`js/data/config.js`): "Southern Oregon Gaming PCs" (used in structured data).

## 4. Page by page

### Home (index.html)
- Title (73): Gaming PCs for Sale in Southern Oregon | North Bridge PCs, Grants Pass OR
- Meta description (184): North Bridge PCs: gaming PCs built, tested, and sold in Southern Oregon. Ready-to-buy systems and custom builds around your budget. Serving Grants Pass, Medford, and surrounding areas.
- [H1] Gaming PCs Built and Tested in Southern Oregon
- [Body text] Gaming PCs built, tested, and sold locally in Grants Pass, Oregon. Ready-to-buy systems and custom builds around your…
- [Button] View Gaming PCs
- [Button] Custom Builds
- [Kicker] Ready to Buy
- [Section heading] Available Systems
- [Body text] Every system listed is cleaned, stress tested, and ready for pickup, with performance estimates on every listing.
- [Button] View All Systems →
- [Kicker] Before It Leaves
- [Section heading] What Actually Happens Before Pickup
- [Body text] Every system goes through the same checklist: no shortcuts, no exceptions.
- [Body text] Every system gets
- [Text] cleaned, stress tested under load, and temperature-checked
- [Body text] The specs listed are accurate. Most of the parts are used; the power supply and case are almost always new. Performan…
- [Sub-heading] Cleaned
- [Body text] Dust removed, thermal paste refreshed where needed. Clean inside and out.
- [Sub-heading] Stress tested
- [Body text] CPU and GPU pushed under sustained load to check for stability issues.
- [Sub-heading] Temps checked
- [Body text] Thermals verified under load. Nothing runs hot, no surprises after pickup.
- [Sub-heading] Drivers updated
- [Body text] GPU and system drivers current before handoff. Ready to game the same day.
- [Sub-heading] Ready to use
- [Body text] Plugged in and confirmed working on pickup. A finished computer, not a box of parts.
- [Kicker] Built for You
- [Section heading] Custom Builds Around Your Budget
- [Body text] Don't need something off the shelf? I'll put together a system based on what you actually want to do with it. No upse…
- [Text] Tell me your budget.
- [Body text] I'll work with what you have, not push you past it.
- [Text] Tell me what games you play.
- [Body text] Different games have different demands. I'll build for what you actually run.
- [Text] Tell me what features matter.
- [Body text] Wi-Fi, extra storage, Linux, quiet operation: mention what's important to you.
- [Button] See Custom Build Options →
- [Text] Solid 1080p gaming on popular titles. Good starting point without overspending.
- [Text] Smooth gameplay at higher frame rates. More headroom on demanding games.
- [Text] Higher resolution and a stronger GPU. Handles modern titles at quality settings.
- [Body text] Example ranges only. Actual cost depends on parts availability and your specific requirements.
- [Kicker] Recent Work
- [Section heading] From the Build Bench
- [Body text] Photos of recent systems and completed builds.
- [Button] View Full Gallery →
- [Kicker] Common Questions
- [Section heading] Frequently Asked
- [Body text] Quick answers to the questions that come up most often. The full FAQ page has everything else.
- [Button] Full FAQ →
- [Kicker] Get in Touch
- [Section heading] Have a Question? Ready to Buy?
- [Body text] Whether you're interested in a specific system, thinking about a custom build, or just not sure where to start, feel…
- [Button] Send a Message
- [Button] Browse Systems
- (8 numbers, prices and drop-down options not listed here)

### Gaming PCs (builds.html)
- Title (56): Gaming PCs for Sale — North Bridge PCs | Southern Oregon
- Meta description (152): Gaming PCs for sale in Southern Oregon — cleaned, stress tested, and ready for local pickup. Current availability and past builds from North Bridge PCs.
- [Kicker] Ready to Buy
- [H1] Gaming PCs
- [Page intro] Every system is cleaned, stress tested, and ready for local pickup in Southern Oregon, with accurate specs and realis…
- [Kicker] Sale History
- [Section heading] Recently Sold
- [Body text] A look at what's come through recently — for reference, not for sale.

### Single listing (build.html)
- Title (28): Gaming PC — North Bridge PCs
- Meta description (100): Gaming PC for sale — North Bridge PCs, Southern Oregon. Cleaned, tested, and ready for local pickup.
- [Button] Gaming PCs

### Custom Builds (custom-build.html)
- Title (61): Custom Gaming PC Builds in Southern Oregon — North Bridge PCs
- Meta description (132): Custom gaming PC builds in Southern Oregon. Tell me your budget and what you play — I'll put together a parts list that makes sense.
- [Kicker] Built to Order
- [H1] Custom Gaming PCs
- [Page intro] Custom gaming PC builds in Grants Pass, Oregon and surrounding Southern Oregon areas including Medford and Ashland. T…
- [Kicker] The Process
- [Section heading] How a Custom Build Works
- [Body text] There's no complicated form to fill out. Just reach out, tell me what you're working with, and we'll go from there. M…
- [Body text] I won't spec out a build that's way over your budget, and I won't pad the parts list to inflate the price. The goal i…
- [Button] Start the Conversation →
- [Body text] Give me a number you're comfortable with — a range is fine too. I'll work within it, not past it.
- [Body text] Different games pull on different hardware. Knowing what you play helps me prioritize where the budget goes.
- [Body text] Wi-Fi, extra storage, quiet operation, Linux, RGB or no RGB — anything that matters to you, say so.
- [Body text] I'll send over what I'm thinking and why. You can ask questions or suggest changes before anything is ordered.
- [Body text] Once we agree on the parts, I assemble, stress test, and verify the build before it's ready to go.
- [Body text] Pickup in person. The system will be plugged in and running when you arrive.
- [Kicker] Example Ranges
- [Section heading] What Different Budgets Get You
- [Body text] These are rough examples based on typical parts pricing. Actual builds vary depending on what's available and your sp…
- [Text] Entry Gaming
- [Text] approximate starting range
- [Body text] Solid 1080p gaming on popular titles. A good starting point if you're getting into PC gaming without overcommitting o…
- [List item] 1080p gaming on most popular titles
- [List item] 60fps+ on well-optimized games
- [List item] Ryzen 5 or i5-class CPU
- [List item] Midrange GPU (GTX 1080 / RX 580 class)
- [List item] 16GB RAM, NVMe SSD
- [List item] Linux available on request
- [Button] Talk Budget →
- [Text] High Refresh 1080p
- [Body text] Smooth gameplay at higher frame rates. More headroom on demanding titles and a noticeably better experience overall.
- [List item] 100–144fps on most 1080p titles
- [List item] More comfortable on newer games
- [List item] Ryzen 7 or i5-class CPU
- [List item] Strong midrange GPU (RTX 3060 / RX 6700 class)
- [List item] 16–32GB RAM, NVMe SSD
- [Text] 1440p Gaming
- [Body text] Higher resolution and a stronger GPU. Handles modern titles at quality settings, and has room to grow with future rel…
- [List item] 1440p gaming at high settings
- [List item] 60–100fps+ depending on the title
- [List item] Ryzen 7 or i7-class CPU
- [List item] Upper-midrange GPU (RTX 3070 / RX 6800 class)
- [List item] 32GB RAM, large NVMe SSD
- [Body text] These are example ranges only and are not guarantees or fixed prices. Actual build cost depends on current parts avai…
- [Kicker] No Tech Knowledge Required
- [Section heading] Not Sure What Hardware You Need?
- [Body text] That's fine — most people aren't. You don't need to know what GPU you want or what CPU tier makes sense. That's the p…
- [Body text] What actually helps: knowing your budget, knowing what games you play, and knowing whether there's anything specific…
- [Body text] If you don't know the answers to any of those either, just say so. We can work backwards from "I want to play X and I…
- [Button] Reach Out →
- [Button] Read the FAQ
- [Section heading] Want Something Ready Now?
- [Body text] If you'd rather not wait for a build, see whether I have a system listed right now. Everything is cleaned, tested, an…
- [Button] Browse Available Systems →
- [Button] Ask About a Custom Build
- (9 numbers, prices and drop-down options not listed here)

### Gallery (gallery.html)
- Title (61): Build Gallery — North Bridge PCs | Southern Oregon Gaming PCs
- Meta description (106): Photo gallery of gaming PC builds from North Bridge PCs in Southern Oregon — listed and completed systems.
- [Kicker] Photos
- [H1] Gallery
- [Page intro] A look at the PCs I've built, listed, and sold around Southern Oregon. Click any photo to view it larger.
- [Kicker] For Sale
- [Section heading] Current Builds
- [Body text] Systems that are currently available or in progress.
- [Kicker] Past Work
- [Section heading] Completed Builds
- [Body text] Sold systems, detail shots, and past builds.
- [Section heading] See Something You Like?
- [Body text] If a listed system catches your eye, reach out and ask about it. Or if you're thinking about a custom build, I'm happ…
- [Button] Browse Available Systems →
- [Button] Custom Builds

### FAQ (faq.html)
- Title (58): FAQ — North Bridge PCs | Gaming PCs in Grants Pass, Oregon
- Meta description (104): Frequently asked questions about North Bridge PCs — gaming PCs, Linux, custom builds, support, and more.
- [Kicker] Questions & Answers
- [H1] Frequently Asked
- [Page intro] Answers to the questions that come up most often. If something isn't covered here, just reach out.
- [Section heading] Question Not Listed Here?
- [Body text] If there's something you want to know that isn't covered above, feel free to send a message. There's no dumb question…
- [Button] Send a Message
- [Button] Custom Builds

### About (about.html)
- Title (41): About | North Bridge PCs, Southern Oregon
- Meta description (89): About North Bridge PCs, a small, local PC building business based in Grants Pass, Oregon.
- [Kicker] Who's Behind This
- [H1] About
- [Page intro] The short version: one person, building PCs in Southern Oregon, trying to do it honestly.
- [Body text] Hi, I'm
- [Text] Jacob Skrove
- [Body text] It began the way a lot of these things do: I built a PC for myself, enjoyed the process, and realized I could build m…
- [Body text] Right now, everything is local. Selling in person means I can skip the complications and risks that come with shippin…
- [Body text] PC building is genuinely one of my hobbies, not just something I do for the business. I care more about finding good…
- [Body text] I want North Bridge PCs to feel professional and trustworthy without pretending to be something it's not: a big, esta…
- [Body text] I'm also balancing this with school, so turnaround on custom builds can run a little longer during the school year. S…
- [Section heading] Want to Talk Through Something?
- [Body text] Whether it's a listed system or a custom build, reach out any time.
- [Button] Contact Me →
- [Button] Browse Systems

### Part Boxes (part-boxes.html)
- Title (59): Part Boxes & Packaging — North Bridge PCs | Southern Oregon
- Meta description (160): Empty PC component boxes and packaging for sale from North Bridge PCs builds. Availability changes as boxes sell and more come in. Southern Oregon local pickup.
- [Kicker] Extra From the Bench
- [H1] Part Boxes & Packaging
- [Page intro] Empty component boxes left over from builds — useful for shipping, storage, or reselling your own parts. Pick any com…
- [Text] Your Request
- [Body text] No boxes selected yet.
- [Text] Estimated Total
- [Form label] Your Name
- [Placeholder] First name is fine
- [Form label] Your Email
- [Placeholder] So I can follow up
- [Button] Send Request →
- [Body text] This sends a request, not a payment. I'll follow up by email to arrange pickup and payment.
- (1 numbers, prices and drop-down options not listed here)

### Contact (contact.html)
- Title (57): Contact | North Bridge PCs, Gaming PCs in Southern Oregon
- Meta description (117): Contact North Bridge PCs: ask about a system, start a custom build, or just get a question answered. Southern Oregon.
- [Kicker] Get in Touch
- [H1] Contact
- [Page intro] Based in Grants Pass, Oregon, serving Grants Pass, Medford, Ashland, and surrounding Southern Oregon areas. Choose wh…
- [Section heading] Response Time
- [Body text] I typically respond within a day or two. If it's been longer than that, feel free to send a follow-up.
- [Section heading] Pickup Location
- [Body text] Based in Grants Pass, Oregon. Pickup is in person, usually at a meeting spot somewhere between us in the Grants Pass…
- [Section heading] Custom Builds
- [Body text] Not sure what you need? Just fill in your budget and the games you play. I'll take it from there. You don't need to k…
- [Section heading] Linux Available
- [Body text] Prefer Linux? Mention your distro of choice in the form and I'll have it set up before pickup.
- [Section heading] What Do You Need Help With?
- [Body text] Pick whichever fits best. You'll only see the fields that actually apply.
- [Sub-heading] Buying a Gaming PC
- [Body text] Looking for a ready-to-go system? Tell me what you need and I'll check it against what's currently available, or let…
- [Button] Get Started →
- [Sub-heading] Custom PC
- [Body text] Want something built around your exact budget and the games you play? Start here.
- [Sub-heading] Part Box
- [Body text] Empty component boxes left over from builds, good for shipping, storage, or reselling parts.
- [Button] Browse Part Boxes →
- [Sub-heading] General Question
- [Body text] Anything else about North Bridge PCs. Ask away.
- [Sub-heading] Other / Not Sure
- [Body text] Not sure which of these fits? This works too, just tell me what's going on.
- [Section heading] Buying a Gaming PC
- [Body text] Tell me a bit about what you're looking for, and I'll check it against what's currently available. If nothing current…
- [Form label] Your Name
- [Placeholder] First name is fine
- [Form label] Your Email
- [Placeholder] So I can reply to you
- [Form label] Budget
- [Text] (optional)
- [Placeholder] e.g. Around $800, or $600–900
- [Form label] Games You Play
- [Placeholder] e.g. Fortnite, War Thunder, Minecraft
- [Form label] Windows or Linux?
- [Form label] Anything Else
- [Placeholder] Anything else worth knowing
- [Text] Privacy:
- [Button] Send Message →
- [Section heading] Custom PC
- [Body text] Tell me your budget and what matters to you. Fill in whatever's relevant, skip the rest.
- [Form label] Need Wi-Fi?
- [Form label] Need a Monitor?
- [Form label] RGB Preference
- [Placeholder] Extra storage, quiet operation, distro preference, or anything else worth knowing
- [Section heading] General Question or Other Inquiry
- [Body text] Ask a general question, or tell me what's going on if you're not sure where it fits.
- [Form label] Your Message
- [Placeholder] What's on your mind?
- (14 numbers, prices and drop-down options not listed here)

### 404 page (404.html)
- Title (33): Page Not Found — North Bridge PCs
- Meta description (34): Page not found — North Bridge PCs.
- [H1] Page Not Found
- [Body text] That page doesn't exist, or it's moved. Double-check the link, or head back to one of these.
- [Button] Back to Home →
- [Button] Browse Gaming PCs
- (1 numbers, prices and drop-down options not listed here)

## 5. Text made by scripts and data files (not in the page sources)
- **Single listing** (`js/render/buildDetail.js`): "Estimated Performance" and "Performance varies based on game settings, resolution, and title."; "Inquire About This System" / "Fill out the form and I'll get back to you by email."; "Windows or Linux?"; "Anything else? (optional)"; privacy line; "Send Message →"; sold notice "This system has already been sold. Check the listings page for what's currently available."; "Why North Bridge PCs" / "What You're Getting"; "Browse More Systems" / "Looking for something different? See everything that's currently available."; "Local pickup · Grants Pass, OR"; success "Thanks for reaching out. I'll get back to you by email within a day or two."; not-found "System Not Found".
- **Trust checklist** (`js/render/trustSection.js`, also on the home page): lead line, accuracy paragraph, and five steps (Cleaned, Stress tested, Temps checked, Drivers updated, Ready to use). Includes "Nothing runs hot, no surprises after pickup." and "no shortcuts, no exceptions", which the brief says to avoid.
- **Empty states**: Gaming PCs and home, "No Systems Listed Right Now" / "Nothing available at the moment — check back soon, or get notified when something comes in." (`buildCard.js`); the notify box, "Nothing Listed Right Now" / "Get Notified When Something Comes In" / "No spam, no mailing list — just a one-time heads up." / "You're on the list" (`notifyBox.js`); part boxes, "No Part Boxes Available Right Now" (`partBoxCard.js`); gallery fallback "Photos coming soon." (`galleryGrid.js`).
- **Part box order** (`partBoxOrder.js`): "No boxes selected yet.", "I'll follow up by email to arrange pickup and payment."
- **FAQ** (`js/data/faq.js`): seven questions: Are the parts new or used? / Can it run Fortnite? / Can it run War Thunder? / Do you offer Linux? / Can I upgrade later? / Do you take trades? / What kind of support do you provide after purchase?; the home page shows the three marked featured.
- **Listings** (`js/data/builds.js`): each listing's title, one-line summary ("Cleaned and stress tested 1080p/1440p gaming build." on three of five), notes and performance lines.
- **Part boxes** (`js/data/partBoxes.js`): brand and model, category, price, one condition line each.

## 6. Proposed drafting order (step 4, three directions per slot, owner edits, then apply)
1. **Global and home**: header tagline, home title and description, hero H1 and intro, the home sections and the trust checklist (the biggest trust job on the site).
2. **Shopping path**: Gaming PCs page, empty states and notify box, listing page text, FAQ (includes the Linux answer).
3. **Custom Builds and Contact**: process text, budget tiers (needs the owner's price call first), contact picker and form text, one agreed set of button labels.
4. **About, Gallery, Part Boxes, 404**, then small strings and titles/descriptions for every page.

Small site changes that would help the copy (allowed when helpful; each would be proposed before doing it):
- A one-line tagline slot under the home H1, if the chosen tagline is not part of the intro text.
- One shared source for the checklist wording: today the same lines exist twice (the home page markup and `trustSection.js`, on purpose per the code comments), so edits to one can drift from the other.
- A real per-listing title and description for `build.html` (today one generic pair), if wanted for search results.
