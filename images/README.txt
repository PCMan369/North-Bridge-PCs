================================================================
NORTH BRIDGE PCs — IMAGES FOLDER
================================================================

This folder holds all the photos used on the website.

You do not need to edit any HTML or CSS files to add images.
Just drop your photos here and update the right data file.

================================================================
HERO IMAGE (Homepage)
================================================================

File name expected: hero-build.jpg

This is the large photo on the right side of the homepage.

HOW TO REPLACE IT:
1. Add your photo to this folder.
   Recommended size: 1200 x 900 pixels (4:3 ratio works well).
   Landscape orientation (wider than tall) is best.

2. Open index.html in a text editor.

3. Find this line (search for "hero-build.jpg"):
      src="images/hero-build.jpg"

4. Change the filename to match whatever you named your file.
   Example:
      src="images/my-pc-photo.jpg"

5. Save index.html. Done.

If the image is missing, the site shows a placeholder automatically.
It won't break anything.

================================================================
PC LISTING IMAGES (Gaming PCs page)
================================================================

These are the card photos shown on the Gaming PCs page.

HOW TO ADD A LISTING PHOTO:
1. Add the photo to this folder.
   Recommended size: 1200 x 750 pixels (16:10 ratio).
   Landscape is best — the cards crop square on shorter images.

2. Open js/builds.js in a text editor.

3. Find the build you want to add the image to.

4. Update the image field:
      image: "images/your-filename.jpg"

5. Save builds.js. Done.

NAMING SUGGESTIONS:
  build-ryzen5600-rtx3060.jpg
  build-i512400f-rtx3070.jpg
  build-ryzen7-rx6700xt.jpg

If an image is missing or the path is wrong, a 🖥️ placeholder
shows instead. The card will still display all the specs and
price — the image slot just shows a placeholder.

================================================================
GALLERY IMAGES
================================================================

These are the photos on the Gallery page.

HOW TO ADD A GALLERY PHOTO:
1. Add the photo to this folder.
   Any landscape or square photo works.
   The gallery crops images to 4:3 — keep your subject centered.

2. Open js/gallery.js in a text editor.

3. Add your photo to the right section:

   currentBuilds   = systems currently listed for sale
   completedBuilds = past/sold builds, detail shots, etc.

4. Copy this and paste it into the array, then fill it in:

      {
        src: "images/your-filename.jpg",
        alt: "Short description of the photo"
      },

   Make sure there's a comma after the closing } unless it's
   the very last item in the list.

5. Save gallery.js. Done — the gallery updates automatically.

If a gallery image is missing, a 📷 placeholder shows instead.

================================================================
FILE FORMAT TIPS
================================================================

- JPG is recommended for photos. Smaller file size, faster load.
- PNG is fine for screenshots or images needing transparency.
- Avoid very large files. Aim for under 1MB per image if possible.
  You can use a free tool like squoosh.app to compress images.
- File names should have no spaces. Use hyphens instead.
  Good:  build-rtx3070-hero.jpg
  Bad:   my pc photo (2).jpg

================================================================
CURRENT IMAGE FILES IN THIS FOLDER
================================================================

Add your own images here. The list below is just a reference
for what filenames the data files are currently looking for.

From js/builds.js:
  build-ryzen5600-rtx3060.jpg
  build-ryzen5700x-rx6700xt.jpg
  build-i512400f-rtx3070.jpg
  build-ryzen3600-gtx1080.jpg
  build-i79700k-rtx2070s.jpg

From js/gallery.js (currentBuilds):
  gallery-current-1.jpg
  gallery-current-2.jpg
  gallery-current-3.jpg

From js/gallery.js (completedBuilds):
  gallery-completed-1.jpg
  gallery-completed-2.jpg
  gallery-completed-3.jpg
  gallery-completed-4.jpg
  gallery-completed-5.jpg
  gallery-completed-6.jpg

From index.html (hero):
  hero-build.jpg

================================================================
NONE OF THESE FILES ARE REQUIRED FOR THE SITE TO WORK.
If an image is missing, a placeholder is shown automatically.
The site will not break.
================================================================
