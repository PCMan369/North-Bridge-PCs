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
    title:   "Ryzen 5 3600 / RTX 2060",
    image:   "images/3600_RTX2060.jpeg",
    ram:     "16GB DDR4 2666MHz",
    storage: "480GB SSD",
    fps: [
      "Fortnite: ~100fps @ 1080p High",
      "Minecraft: ~180fps+ @ 1080p High",
      "Marvel Rivals: ~75fps @ 1080p High",
      "Cyberpunk 2077: ~55fps @ 1080p High"
    ],
    photos: [
      "images/3600_RTX2060.jpeg",
      "images/3600_RTX2060_side.jpeg",
      "images/3600_RTX2060_inside.jpeg"
    ],
    price:  "$549",
    status: "available"
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

    {
    title:   "Ryzen 5 3600 / RTX 2070 Super",
    image:   "images/3600_2070S.jpg",
    ram:     "16GB DDR4 2800MHz",
    storage: "512GB NVMe SSD",
    fps: [
      "Fortnite: ~120fps @ 1080p High",
      "Minecraft: ~220fps+ @ 1080p High",
      "Marvel Rivals: ~90fps @ 1080p High",
      "Cyberpunk 2077: ~65fps @ 1080p High"
    ],
    photos: [
      "images/3600_2070S.jpg",
      "images/3600_2070S_Front.jpg",
      "images/3600_2070S_Side.jpg",
      "images/3600_2070S_IO.jpg",
      "images/3600_2070S_Back.jpg"
    ],
    price:  "$625",
    status: "available"
  },

  {
    title:   "Ryzen 5 3600 / RTX 2060",
    image:   "images/3600_RTX2060.jpg",
    ram:     "16GB DDR4 2666MHz",
    storage: "480GB SSD",
    fps: [
      "Fortnite: ~100fps @ 1080p High",
      "Minecraft: ~180fps+ @ 1080p High",
      "Marvel Rivals: ~75fps @ 1080p High",
      "Cyberpunk 2077: ~55fps @ 1080p High"
    ],
    photos: [
      "images/3600_RTX2060.jpg",
      "images/3600_RTX2060_FRONT.jpg",
      "images/3600_RTX2060_SIDE.jpg",
      "images/3600_RTX2060_IO.jpg",
      "images/3600_RTX2060_BACK.jpg"
    ],
    price:  "$549",
    status: "sold"
  },

  {
    title:   "Ryzen 5 5500 / RTX 2070 Super",
    image:   "images/Website Main Pic.jpeg",
    ram:     "16GB DDR4 3000MHz",
    storage: "512GB NVMe SSD",
    fps: [
      "Fortnite: ~130fps @ 1080p High",
      "Minecraft: ~240fps+ @ 1080p High",
      "Marvel Rivals: ~95fps @ 1080p High",
      "Cyberpunk 2077: ~70fps @ 1080p High"
    ],
    photos: [
      "images/Website Main Pic.jpeg"
    ],
    price:  "$649",
    status: "sold"
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
function renderBuildCard(build, originalIndex) {
  const available = build.status === 'available';

  const badge = available
    ? '<span class="badge badge-available">Available</span>'
    : '<span class="badge badge-sold">Sold</span>';

  const image = build.image
    ? `<img
         src="${build.image}"
         alt="${build.title}"
         loading="lazy"
         onload="this.classList.add('loaded')"
         onerror="this.parentElement.innerHTML='<div class=\\'build-img-placeholder\\'>🖥️</div>'"
       >`
    : `<div class="build-img-placeholder">🖥️</div>`;

  const perfItems = (build.fps && build.fps.length > 0)
    ? build.fps.map(f => `<div class="perf-item">• ${f}</div>`).join('')
    : '';

  const perfBlock = perfItems
    ? `<div class="build-perf">
         <div class="perf-label">Estimated Performance</div>
         ${perfItems}
       </div>`
    : '';

  const photoCount = (build.photos && build.photos.length > 1)
    ? `<div style="font-size:0.72rem; color:var(--dim); margin-top:0.5rem; text-align:center;">
         📷 ${build.photos.length} photos — click to view listing
       </div>`
    : '';

  return `
    <a href="build.html?id=${originalIndex}"
       class="build-card ${!available ? 'is-sold' : ''}"
       style="text-decoration:none;">
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
          <span style="font-size:0.82rem; color:var(--accent);">View Listing →</span>
        </div>
        ${photoCount}
      </div>
    </a>
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

  if (!availableEl) return;

  // Pass original index so build.html?id=X always points to the right build
  const availableBuilds = [];
  const soldBuilds      = [];

  builds.forEach(function (build, i) {
    if (build.status === 'available') {
      availableBuilds.push({ build: build, index: i });
    } else {
      soldBuilds.push({ build: build, index: i });
    }
  });

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
    availableEl.innerHTML = availableBuilds
      .map(function (item) { return renderBuildCard(item.build, item.index); })
      .join('');
  }

  if (soldBuilds.length > 0 && soldSection && soldEl) {
    soldSection.style.display = 'block';
    soldEl.innerHTML = soldBuilds
      .map(function (item) { return renderBuildCard(item.build, item.index); })
      .join('');
  }
}

// Initialize on the Gaming PCs page when the DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('available-builds')) {
    initBuildsPage();
  }
});


