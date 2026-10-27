# MAINTENANCE.md — running the North Bridge PCs site

For the owner. How to change things day to day, check them, and put them on the live site. Written by Lane B in B-025
(2026-10-09) from the code as of B-024. Things that could not be checked from the project files are marked **unknown**.
For how the site is built, see ARCHITECTURE.md; for the two-chat ZIP workflow, see START_HERE.md.

## 1. The three rules

1. **Edit the sources, never the generated pages.** The 10 `.html` files in the project root (`index.html`, `builds.html`, ...)
   are generated. Page text lives in `pages-src/`, the shared header/footer in `js/partials/`, and the changing content
   (FAQ, boxes, settings) in `js/data/`; PC listings in `content/builds/` (`builds.js` and `gallery.js` are generated). Anything you type into a root `.html` file is wiped the next time
   the build script runs.
2. **After any change, run the build script** from the project folder: `python3 build-tools/stitch.py`. It needs only Python 3
   (nothing to install). It rewrites the root pages, `sitemap.xml` and `robots.txt`, and prints which web address it used.
   Changes to **data files only** (builds, boxes, FAQ, photos, events) don't strictly need it, but running it is harmless, so
   make it a habit.
3. **Check before you publish** (section 4), then commit and push (section 5).

## 2. Everyday tasks

The data files in `js/data/` (except the generated builds.js and gallery.js) start with their own "how to" comment; this is the
short version. Keep the commas, quotes and braces exactly as in the entries already there. One missing comma stops the whole
file from loading (see section 6).

### Add, edit or sell a PC: use the admin (see ADMIN_SETUP.md)
PC listings are no longer edited in `js/data/builds.js`. Each PC is one file, `content/builds/<id>.json`, edited through the admin
forms from any phone or computer (ADMIN_SETUP.md has the one-time setup and daily steps). `js/data/builds.js` and `gallery.js` are
**generated** from those files by `python3 build-tools/content.py`; edits made there are overwritten.
- **Add:** a new listing with ID = month + year + number (`nov26-01`); **never reuse an ID**, even after the PC sells. It needs a
  title, a price and at least one photo before it can be Available. `performance` numbers are estimates unless you measured them.
- **Mark sold / hide:** Status = Sold (moves to Recently Sold; its photos move to the completed gallery by themselves) or Hidden
  (off the site). Draft and Hidden listings are not in `builds.js` at all, so they have no public page.
- **By hand (no admin):** edit the JSON file, run `python3 build-tools/content.py` (it checks the file and says what is wrong in plain
  language), then `python3 build-tools/stitch.py`.

### Part boxes — `js/data/partBoxes.js`
Add a box type by copying an existing entry. `id` is never reused (the next unused one is `box-13`). **Quantities don't count
down by themselves**: orders arrive as an email, and when a box sells you lower `quantity` by hand (0 = sold out, and it
drops out of the page; leave the entry in if you'll get more).

### Photos
- Use **JPEG**. In the admin, add photos in the listing form. The publisher (`build-tools/photos.py`) removes location data
  (GPS/EXIF), applies the camera's rotation and shrinks anything over 2000 px, so phone photos are fine. Photos already clean are
  left alone. If you add photos by hand, run `python3 build-tools/photos.py` (needs `pip install pillow`).
- Switch off location tagging in the phone camera too: a copy saved in GitHub's history before cleaning cannot be erased.
- Files live in `images/` and are referred to as `images/name.jpg` (GitHub Pages is **case-sensitive**).
- Unused images aren't removed automatically. `content.py` stops publishing if a listing, the link-preview photo or a part-box
  photo points to a missing file.

### Gallery — generated
`js/data/gallery.js` is generated: photos come from the listings (Available under Available Now, Sold under Recently Sold), in
listing order. Photo descriptions: `content/photo-alts.json`; extra photos that belong to no listing: `content/gallery-extras.json`
(both editable in the admin). The homepage's photo strip reads the listings directly.

### FAQ — `js/data/faq.js`
Copy a block, give it a unique `id`, write the question and answer. `featured: true` also shows it in the homepage preview.
It appears on `faq.html` automatically.

### Run a sale — `js/data/events.js`
Add an event (copy the example), set `active`, the start/end dates, the banner text and whether it shows a countdown. Then on
each discounted PC fill in "Sale event" (the event's id) and "Sale price" in its listing form (`eventId` / `eventPrice` in its JSON). To end a sale early,
set `active: false`. The sale system itself is switched on by `features.events.show` in `config.js` (it is `true` now).

### Testimonials — `js/data/testimonials.js`
Empty on purpose. Add only real ones the customer approved, in the format at the top of the file. An empty list shows nothing.

### Contact details and switches — `js/data/config.js`
- Phone number or Facebook link: set that feature's `show: true` and fill in the value. Nothing appears while `show` is false.
- **Changing the contact email:** edit `CONTACT.email` (the address forms send to) and `features.email.address` (the address shown to
  visitors), then **run the build script**, because the form address is written into the pages when they're built. The first form
  submission to a new address makes FormSubmit send a confirmation email to it; click the link in it or messages won't arrive.
  Whether the current address has already been confirmed: **unknown**.
- Business name, tagline and service area are in the same file.

### Page wording — `pages-src/*.html`
Edit the page in `pages-src/`, run the build script, preview. Shared header/footer text is in `js/partials/header.html` and
`footer.html` (change once, every page updates after the build). The FAQ, listing and form wording that appears from scripts lives
in `js/data/` and `js/render/`.

## 3. Before you start each time
Open the project folder (the one that matches the latest ZIP, with `.git` kept), and make sure no other chat is editing at
the same time. If you work with the two Claude chats, follow START_HERE.md ("Applying a returned ZIP") first.

## 4. Check before you publish
1. Run `python3 build-tools/stitch.py`. It should end with "Wrote sitemap.xml and robots.txt" and print the address in use.
2. **Preview.** The simplest way: open `index.html` from the folder in a browser. That works for browsing and for listings (checked
   for the home and part-boxes pages); form submissions need a real web address and won't send from your computer. A
   closer match to the live site: in the project folder run `python3 -m http.server` and open http://localhost:8000 .
3. Click through what you changed, on a phone-width window too: listings, a listing page, the contact picker.
4. Catch typos before they bite: `python3 build-tools/content.py --check` checks every listing in plain language. For other
   data files, `node --check js/data/<file>.js` prints the line of the first mistake and prints nothing when the file is fine. Requires Node.js; **unknown** whether it's on your computer.
5. Optional automatic checks (what Claude runs): `npm install jsdom --no-save` then `node smoke-test.js` (page structure, needs
   Node and the internet), and `python3 visual-check.py` (screenshots and a sideways-scroll check, needs Python Playwright). They write
   `screenshots/` next to the script: don't commit that folder.

## 5. Publish
**Admin edits publish by themselves** (ADMIN_SETUP.md): saving a listing starts the "Publish site" workflow, which checks, builds and
deploys. Before working locally, run `git pull` so you have those edits. You can still push by hand; the workflow runs on every push.
The site is hosted on GitHub Pages. Commit **the generated files along with your edits**
(the root `.html` files, `sitemap.xml`, `robots.txt`), because GitHub Pages serves what's in the repo; it doesn't run the build script.
1. In the project folder: `git status` (look at what changed), `git add -A`, `git commit -m "short description"`, `git push`.
2. Wait a minute or two, then reload the live site with a hard refresh (Ctrl+F5 / Cmd+Shift+R) so your browser doesn't show the old page.
3. Live address in the files: `https://pcman369.github.io/North-Bridge-PCs` (`SITE.url`).
4. Which branch and folder GitHub Pages publishes from, and whether the repository is set up for it: **unknown**. You can see it in the
   repository's Settings, under Pages.
5. Don't commit: `screenshots/`, `node_modules/`, `__pycache__/`, or scratch folders (`design-prototypes/` and similar).

## 6. If something looks wrong

| What you see | Most likely cause | Fix |
|---|---|---|
| A change doesn't show on the live site | Not pushed; build script not run; browser showing the old page | Run the build script, check `git status`, push, hard-refresh |
| A change vanished after a build | You edited a root `.html` file | Redo it in `pages-src/` (or the partial) and rebuild |
| The box grid (or another data-driven section) is empty / shows no items | A typo in a data file (missing comma, quote or bracket). Tested: the page loads but the data doesn't, and there is no error message on screen | `node --check js/data/<file>.js`, fix the line it names (listings are checked by `content.py` instead) |
| A listing is missing | Status is Draft or Hidden (only Available and Sold are public) | Check its Status |
| Red X on the Actions tab / a change did not publish | The checker found a problem and stopped, on purpose; the live site is unchanged | Open the run; the lines starting with `-` say what to fix; save again |
| A photo is a broken image | Wrong file name, wrong capital letters, or the file wasn't pushed | Match the name exactly; check it's in `images/` and committed |
| Form messages don't arrive | The address was never confirmed with FormSubmit, or was typed wrong | Check `CONTACT.email`, rebuild, submit once and confirm the email; check spam |
| Sitemap or link previews show the wrong address | `SITE.url` is wrong | Fix it in `config.js`, rebuild |
| A box quantity is wrong after an order | Quantities are manual | Edit `partBoxes.js` |

## 7. Other notes
- **Analytics.** A Google Analytics tag (`G-B0EGXM9JNN`) is installed on every page through `js/partials/analytics.html`. Who can see its
  reports: **unknown**.
- **Privacy:** photos, listing text and everything in `js/` are public once pushed. Draft/Hidden listings are off the website but their
  files in `content/` are still in the public repository.
- **Changing the web address** (a real domain) is more than one setting. See the domain-swap checklist when it exists (planned, not written).
- Old decisions and history: `docs-archive/DECISIONS.md` (large; search it rather than reading it). Design decisions: `VISUAL_REDESIGN.md`.

## Applying a returned ZIP from a Claude chat
First `git pull` (the admin may have saved listings or photos since). Then make the local working tree match the ZIP exactly, keeping `.git`, so deleted
files disappear too (mirror-style sync, e.g. `rsync -a --delete --exclude .git`
or `robocopy /MIR /XD .git`). Dry-run first, or check `git status` after: the
deleted files shown should match the `D` lines in the log entry. A mirror
sync also deletes local-only files that are not in the ZIP (for example
`design-prototypes/` if it still exists), so exclude or relocate those.
Commit with the entry ID in the message.
