# ADMIN_SETUP.md — managing your PC listings from any phone or computer

For the owner. Built in B-084 (Phase 1). Everything here was tested on a copy of the project; **the GitHub Action and the
Pages CMS screens have not been run yet** (marked *untested*). Do the one-time setup, then the test in step 7, before you rely on it.

## How it works, in four lines
1. You sign in to the admin (Pages CMS, free) with your GitHub account and fill in a form.
2. Saving stores the listing and photos in your GitHub repository.
3. That automatically starts the **Publish site** workflow: it cleans the photos, checks the listing, rebuilds the
   data files and publishes. About 1-3 minutes (GitHub says it can take up to 10).
4. If the check finds a problem, **nothing is published** and the live site keeps its last good version.

## One-time setup (about 15 minutes, on a computer)
Do these in order.

1. **Update your local copy first.** `git pull` (the admin writes to GitHub, so GitHub may be ahead of your computer),
   then apply the ZIP as usual (START_HERE.md, "Applying a returned ZIP").
2. **Switch Pages to the new publisher.** GitHub repo, Settings, Pages, "Build and deployment", Source: **GitHub Actions**.
   Do this *before* you push the new files.
3. **Allow the workflow to save files.** Settings, Actions, General, "Workflow permissions": **Read and write permissions**.
4. **Push** the new files to `main` (or `master`; both work). Open the repo's **Actions** tab: "Publish site" should show a
   green check after a few minutes, and the site should look exactly as before. If it shows a red X, open it and read the
   message, then tell Claude. (*untested*: I could not run it on GitHub from here. If the first run fails, the site that is
   already online should stay as it is.)
5. **Turn off location tagging on your phone camera** (the most important privacy step).
   iPhone: Settings, Privacy & Security, Location Services, Camera, **Never**. Android: Camera settings, switch off "Location tags".
   The publisher removes location data from every photo it publishes, but a copy that was already saved in the repository's
   history cannot be erased, so the safe habit is not to create the location data at all.
6. **Connect the admin.** Go to app.pagescms.org, Sign in with GitHub, and install the Pages CMS app on **only** the
   North-Bridge-PCs repository. Read the permissions list before you accept (the app needs to read and write the repository's
   files). Turn on two-step sign-in or a passkey for your GitHub account: that is what protects the admin.
7. **Test it on your phone (iPhone 8) and one other computer** (*untested*; this decides whether the plan works for you):
   - Sign in, open "Gaming PCs", tap New. Fill in ID `zzz26-01`, a title, price, status **Draft**, and add 3 photos from your camera roll. Save.
   - Change Status to **Available**, save, wait for the green check, and look at the Gaming PCs page, the home page, the listing page and the Gallery.
   - Change the price, then Status to **Sold**, then **Hidden** (Hidden removes it from the site). Use Hidden to retire the test listing.
   - Tell Claude anything that was awkward on the phone. If Pages CMS does not work on that phone, say so before going further.

## Everyday use
- **Add a PC:** Gaming PCs, New. ID = month, year, number (`nov26-01`), never reused. Fill in the form, add photos, set Status
  to **Available**, Save. Required before it can be Available: title, price, at least one photo.
- **Change a price or any text:** open the listing, change it, Save.
- **Mark sold:** open it, Status = **Sold**, Save. It moves to Recently Sold, its photos move to the completed gallery, and its page stays up.
- **Hide / archive:** Status = **Hidden**. (Delete is switched off on purpose.)
- **Draft:** saved but not on the website at all, not even by its address. Good for unfinished listings.
- **Photos:** Add photos in the listing form. The first photo is the cover; the order in the form is the order on the site.
  Phone photos are shrunk (longest side 2000 px) and cleaned automatically. JPEG only (iPhone photos are converted by Safari when you pick them; *untested*).
- **Photo descriptions** (for screen readers) are optional. Without one, the site uses "<title>, photo 2". You can write better ones under "Photo descriptions".
- **Extra gallery photos** (not tied to a listing, for example part-box photos): "Extra gallery photos".
- **If the website looks out of date:** use the **Publish now** button in the admin, or Actions, Publish site, Run workflow.

## If something goes wrong
- **Red X in the Actions tab** (GitHub also emails you about failed runs if your notification settings allow): open the run and read the lines
  starting with `-`. They are written in plain language, for example "Listing nov26-01: it needs a price before it can be Available."
  Fix it in the admin and save again. The live site is unchanged until it passes.
- **Undo a bad edit:** on github.com open the repo, `content/builds/<id>.json`, History, open the commit just before the mistake,
  then "Revert" (or ask Claude). Every save is a saved version, so nothing is lost.
- **Listing disappeared:** check its Status. Only Available and Sold are public.

## Honest limits
- Draft and Hidden listings are not on the *website*, but their text is still in your public GitHub repository.
- A photo you remove from a listing stays in the repository's history.
- Video clips are not in the form yet (existing ones are kept). Line breaks in text boxes are ignored on the site; write sentences.
- The Pages CMS app is a free third-party service with access to this one repository. Your listings are plain files, so you
  can leave it at any time; the GitHub website can also edit them directly.
- Backups: Phase 1 relies on GitHub's history. A weekly backup copy and a failure email are planned for Phase 2.

## Where things live (for Claude)
| What | Where |
|---|---|
| Listings (edit these) | `content/builds/<id>.json` |
| Photo descriptions, extra gallery photos | `content/photo-alts.json`, `content/gallery-extras.json` |
| Generated, never hand-edit | `js/data/builds.js`, `js/data/gallery.js` |
| Check + generate | `python3 build-tools/content.py` (`--check` to only check) |
| Photo cleanup | `python3 build-tools/photos.py` (needs Pillow) |
| Admin forms | `.pages.yml` |
| Publisher | `.github/workflows/publish.yml`, `build-tools/ci-build.sh`, `build-tools/assemble-site.sh` |
| Tests | `python3 build-tools/test-content.py`; `node build-tools/test-render.js` (needs `npm install jsdom --no-save`) |
