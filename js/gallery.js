/*
  ================================================================
  js/gallery.js — North Bridge PCs Photo Gallery
  ================================================================

  This file controls what appears in the gallery on the
  Gallery page, and the preview strip on the homepage.

  ================================================================
  HOW TO ADD A PHOTO
  ================================================================
  1. Put the image file in the "images" folder.
     (Same folder as index.html, one level up from this file.)

  2. Decide which section it belongs to:
       currentBuilds   = systems currently listed or in progress
       completedBuilds = past builds and sold systems

  3. Add a new entry to that section. Follow this format exactly:

     {
       src: "images/your-filename.jpg",
       alt: "A short description of what's in the photo"
     },

     Make sure there's a comma after the closing } unless it's
     the very last entry in the list.

  4. Save this file. The gallery updates automatically.

  ================================================================
  TIPS FOR GOOD GALLERY PHOTOS
  ================================================================
  - Landscape orientation works best (wider than tall)
  - Good lighting makes a big difference
  - Show the full case, or a close-up detail — both work
  - Square images are fine too — they'll be cropped to fit
  - PNG or JPG both work; JPG is smaller and loads faster

  ================================================================
  HOW TO REMOVE A PHOTO
  ================================================================
  Delete the entire entry for that photo, including the
  opening {, all the fields, and the closing },

  ================================================================
  HOW TO REORDER PHOTOS
  ================================================================
  Cut and paste entries to change the display order.
  Photos are shown in the order they appear in the list.

  ================================================================
*/


// ================================================================
// CURRENT BUILDS
// ================================================================
// Photos of systems that are currently available for sale
// or builds that are actively in progress.
// These appear first in the gallery.
// ================================================================

const currentBuilds = [

  // ----------------------------------------------------------------
  // Add your current build photos here.
  // Copy the block below and fill in your details.
  // ----------------------------------------------------------------

  
  {
    src: "images/3600_RTX2060.jpeg",
    alt: "Ryzen 5 3600 / RTX 2060 build — currently being built"
  }
  

  // ----------------------------------------------------------------
  // To add another photo:
  // 1. Add a comma after the last entry above (after the })
  // 2. Then paste this:
  //
  // {
  //   src: "images/your-filename.jpg",
  //   alt: "Description of this photo"
  // }
  // ----------------------------------------------------------------

];


// ================================================================
// COMPLETED BUILDS
// ================================================================
// Photos of past builds, sold systems, detail shots,
// and anything else worth showing.
// ================================================================

const completedBuilds = [

  // ----------------------------------------------------------------
  // Add your completed build photos here.
  // ----------------------------------------------------------------

  {
    src: "images/Website Main Pic.jpeg",
    alt: "Completed Build — Ryzen 5 5500 / RTX 2070 Super"
  }
];


// ================================================================
// DO NOT EDIT BELOW THIS LINE
// ================================================================


/**
 * Renders a grid of gallery images into a container element.
 *
 * @param {Array}  images      - Array of {src, alt} objects
 * @param {string} containerId - The ID of the container element
 */
function renderGalleryGrid(images, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!images || images.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:3rem 2rem; color:var(--dim);">
        <div style="font-size:2.5rem; margin-bottom:1rem; opacity:0.4;">📷</div>
        <p style="color:var(--dim);">Photos coming soon.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = images.map(img => `
    <div class="gallery-item">
      <img
        src="${img.src}"
        alt="${img.alt}"
        loading="lazy"
        onerror="
          this.parentElement.innerHTML =
            '<div class=\\'gallery-placeholder\\'>' +
            '<span class=\\'gp-icon\\'>📷</span>' +
            '<span>Photo coming soon</span>' +
            '</div>';
        "
      >
    </div>
  `).join('');
}


/**
 * Initializes the full gallery page (gallery.html).
 * Renders both the current and completed sections.
 */
function initGalleryPage() {
  renderGalleryGrid(currentBuilds,   'gallery-current');
  renderGalleryGrid(completedBuilds, 'gallery-completed');
}


// Initialize on the gallery page when the DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('gallery-current')) {
    initGalleryPage();
  }
});
