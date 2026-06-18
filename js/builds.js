/*
  ================================================================
  js/builds.js — North Bridge PCs PC Inventory
  ================================================================

  This file controls everything you see on the "Gaming PCs" page
  and the "Available Systems" preview on the homepage.

  You do NOT need to touch any HTML to manage your inventory.
  Just edit this file and save. The website updates automatically.

  ================================================================
  HOW TO ADD A NEW PC
  ================================================================
  Copy the block below (from the opening { to the closing },)
  and paste it at the TOP of the builds array (after the [
  on line ~75). Fill in each field.

  {
    title:   "Ryzen 5 5600 / RTX 3060 12GB",
    image:   "images/your-photo-filename.jpg",
    ram:     "16GB DDR4 3200MHz",
    storage: "500GB NVMe SSD",
    fps: [
      "Fortnite: ~110fps @ 1080p High",
      "War Thunder: ~100fps @ 1080p High"
    ],
    price:   "$649",
    status:  "available"
  },

  ================================================================
  HOW TO MARK A PC AS SOLD
  ================================================================
  Find the build in the list below.
  Change:   status: "available"
  To:       status: "sold"

  The system will automatically move from "Available Systems"
  to the "Sold Systems" section. No other changes needed.

  ================================================================
  HOW TO CHANGE A PRICE
  ================================================================
  Find the build and update:   price: "$XXX"
  Always include the dollar sign. Example:  price: "$750"

  ================================================================
  HOW TO CHANGE OR ADD IMAGES
  ================================================================
  1. Put the image file in the "images" folder.
     (Same folder as index.html, one level up from this file.)
  2. Recommended image size: 1200x750px or similar 16:10 ratio.
  3. Update the image field:   image: "images/your-file.jpg"
  4. If no image is set or the file is missing, a placeholder
     will show automatically — the site won't break.

  ================================================================
  HOW TO CHANGE ESTIMATED PERFORMANCE (fps)
  ================================================================
  The fps field is a list. Each entry is one game + estimate.
  Add or remove entries as needed. Keep them realistic.

  fps: [
    "Fortnite: ~120fps @ 1080p High",
    "Apex Legends: ~140fps @ 1080p High",
    "Minecraft Java: ~200fps+"
  ],

  ================================================================
  HOW TO REORDER THE LISTING
  ================================================================
  Cut and paste a whole build block to a new position.
  Available builds are shown in the order they appear here.

  ================================================================
*/


// ================================================================
// YOUR PC INVENTORY
// ================================================================
// Each item inside this array is one PC listing.
// Available builds appear first on the website.
// Sold builds move to the "Sold Systems" section automatically.
// ================================================================

const builds = [

  // ----------------------------------------------------------------
  // BUILD 1 — Entry-level 1080p system
  // ----------------------------------------------------------------
  {
    title:   "Ryzen 5 5600 / RTX 3060 12GB",
    image:   "images/build-ryzen5600-rtx3060.jpg",
    ram:     "16GB DDR4 3200MHz",
    storage: "500GB NVMe SSD",
    fps: [
      "Fortnite: ~110fps @ 1080p High",
      "War Thunder: ~100fps @ 1080p High",
      "Apex Legends: ~130fps @ 1080p High",
      "Minecraft Java: ~200fps+"
    ],
    price:  "$649",
    status: "available"
    // To mark sold, change "available" to "sold"
  },

  // ----------------------------------------------------------------
  // BUILD 2 — Mid-range 1080p/1440p system
  // ----------------------------------------------------------------
  {
    title:   "Ryzen 7 5700X / RX 6700 XT",
    image:   "images/build-ryzen5700x-rx6700xt.jpg",
    ram:     "32GB DDR4 3600MHz",
    storage: "1TB NVMe SSD",
    fps: [
      "Fortnite: ~150fps @ 1080p Epic",
      "War Thunder: ~120fps @ 1440p High",
      "Cyberpunk 2077: ~75fps @ 1080p High",
      "Call of Duty Warzone: ~130fps @ 1080p High"
    ],
    price:  "$849",
    status: "available"
  },

  // ----------------------------------------------------------------
  // BUILD 3 — 1440p-capable system
  // ----------------------------------------------------------------
  {
    title:   "i5-12400F / RTX 3070 8GB",
    image:   "images/build-i512400f-rtx3070.jpg",
    ram:     "16GB DDR4 3200MHz",
    storage: "1TB NVMe SSD",
    fps: [
      "Fortnite: ~160fps @ 1080p Epic",
      "War Thunder: ~140fps @ 1440p High",
      "Elden Ring: 60fps @ 1440p Max",
      "GTA V: ~140fps @ 1440p High"
    ],
    price:  "$1,049",
    status: "available"
  },

  // ----------------------------------------------------------------
  // BUILD 4 — SOLD EXAMPLE
  // This build is marked sold. It shows in the "Sold Systems" section.
  // Change "sold" back to "available" to re-list it.
  // ----------------------------------------------------------------
  {
    title:   "Ryzen 5 3600 / GTX 1080",
    image:   "images/build-ryzen3600-gtx1080.jpg",
    ram:     "16GB DDR4 3200MHz",
    storage: "500GB NVMe SSD + 1TB HDD",
    fps: [
      "Fortnite: ~100fps @ 1080p High",
      "War Thunder: ~90fps @ 1080p High",
      "Minecraft Java: ~200fps+",
      "Apex Legends: ~110fps @ 1080p High"
    ],
    price:  "$529",
    status: "sold"   // <-- SOLD
  },

  // ----------------------------------------------------------------
  // BUILD 5 — SOLD EXAMPLE
  // ----------------------------------------------------------------
  {
    title:   "i7-9700K / RTX 2070 Super",
    image:   "images/build-i79700k-rtx2070s.jpg",
    ram:     "32GB DDR4 3000MHz",
    storage: "500GB NVMe SSD + 2TB HDD",
    fps: [
      "Fortnite: ~140fps @ 1080p Epic",
      "War Thunder: ~120fps @ 1440p High",
      "Cyberpunk 2077: ~70fps @ 1080p High",
      "Call of Duty Warzone: ~120fps @ 1080p High"
    ],
    price:  "$849",
    status: "sold"   // <-- SOLD
  }

];


// ================================================================
// DO NOT EDIT BELOW THIS LINE
// The code below handles displaying your builds on the website.
// ================================================================


/**
 * Generates the HTML for a single PC listing card.
 * Used on both the homepage (featured preview) and builds.html.
 *
 * @param {Object} build - One entry from the builds array above.
 * @returns {string}     - HTML string for the card.
 */
function renderBuildCard(build) {
  const available = build.status === 'available';

  // Status badge
  const badge = available
    ? '<span class="badge badge-available">Available</span>'
    : '<span class="badge badge-sold">Sold</span>';

  // Image or placeholder
  const image = build.image
    ? `<img
         src="${build.image}"
         alt="${build.title}"
         loading="lazy"
         onerror="this.parentElement.innerHTML='<div class=\\'build-img-placeholder\\'>🖥️</div>'"
       >`
    : `<div class="build-img-placeholder">🖥️</div>`;

  // Performance estimates section
  const perfItems = (build.fps && build.fps.length > 0)
    ? build.fps.map(f => `<div class="perf-item">• ${f}</div>`).join('')
    : '';

  const perfBlock = perfItems
    ? `<div class="build-perf">
         <div class="perf-label">Estimated Performance</div>
         ${perfItems}
       </div>`
    : '';

  // Action button — available gets an inquiry link, sold gets a note
  const systemParam = encodeURIComponent(build.title);
const action = available
    ? `<a href="contact.html?system=${systemParam}" class="btn btn-primary btn-sm">Inquire →</a>`
    : `<span class="text-dim" style="font-size:0.82rem;">No longer available</span>`;
  
  return `
    <div class="build-card ${!available ? 'is-sold' : ''}">
      <div class="build-image">
        ${image}
      </div>
      <div class="build-body">
        <div class="build-header">
          <div class="build-title">${build.title}</div>
          ${badge}
        </div>
        <div class="build-specs">
          <div class="build-spec">
            <span class="spec-label">RAM</span>
            <span>${build.ram}</span>
          </div>
          <div class="build-spec">
            <span class="spec-label">Storage</span>
            <span>${build.storage}</span>
          </div>
        </div>
        ${perfBlock}
        <div class="build-footer">
          <div class="build-price">${build.price}</div>
          ${action}
        </div>
      </div>
    </div>
  `;
}


/**
 * Renders all builds on the Gaming PCs page (builds.html).
 * Splits inventory into Available and Sold sections automatically.
 * Only runs when the required container elements are on the page.
 */
function initBuildsPage() {
  const availableEl = document.getElementById('available-builds');
  const soldEl      = document.getElementById('sold-builds');
  const soldSection = document.getElementById('sold-section');

  // Only run on builds.html
  if (!availableEl) return;

  const availableBuilds = builds.filter(b => b.status === 'available');
  const soldBuilds      = builds.filter(b => b.status === 'sold');

  // Render available builds
  if (availableBuilds.length === 0) {
    availableEl.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🖥️</span>
        <h3>No Systems Currently Listed</h3>
        <p>Nothing available right now, but custom builds are still on the table.<br>
           Reach out and we can talk through what you're looking for.</p>
        <a href="custom-build.html" class="btn btn-primary">Explore Custom Builds →</a>
      </div>
    `;
  } else {
    availableEl.innerHTML = availableBuilds.map(renderBuildCard).join('');
  }

  // Only show the Sold section if there are sold builds
  if (soldBuilds.length > 0 && soldSection && soldEl) {
    soldSection.style.display = 'block';
    soldEl.innerHTML = soldBuilds.map(renderBuildCard).join('');
  }
}


// Initialize on the Gaming PCs page when the DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('available-builds')) {
    initBuildsPage();
  }
});
