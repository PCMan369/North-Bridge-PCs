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
function renderBuildCard(build, index) {
  const available = build.status === 'available';

  const badge = available
    ? '<span class="badge badge-available">Available</span>'
    : '<span class="badge badge-sold">Sold</span>';

  const image = build.image
    ? `<img
         src="${build.image}"
         alt="${build.title}"
         loading="lazy"
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

  const action = available
    ? `<a href="contact.html?system=${encodeURIComponent(build.title)}" class="btn btn-primary btn-sm">Inquire →</a>`
    : `<span class="text-dim" style="font-size:0.82rem;">No longer available</span>`;

  const hasPhotos = build.photos && build.photos.length > 1;
  const photoHint = hasPhotos
    ? `<div style="font-size:0.72rem; color:var(--dim); margin-top:0.5rem; text-align:center;">
         📷 ${build.photos.length} photos — click card to view
       </div>`
    : '';

  return `
    <div class="build-card ${!available ? 'is-sold' : ''}"
         style="cursor:pointer;"
         onclick="openBuildModal(${index})">
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
        ${photoHint}
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


// ============================================================
// BUILD MODAL
// ============================================================

function openBuildModal(index) {
  const build     = builds[index];
  const available = build.status === 'available';
  const photos    = (build.photos && build.photos.length > 0)
                    ? build.photos
                    : (build.image ? [build.image] : []);

  const badge = available
    ? '<span class="badge badge-available">Available</span>'
    : '<span class="badge badge-sold">Sold</span>';

  const specsHtml = `
    <div class="modal-specs">
      <div class="modal-spec">
        <span class="modal-spec-label">RAM</span>
        <span>${build.ram}</span>
      </div>
      <div class="modal-spec">
        <span class="modal-spec-label">Storage</span>
        <span>${build.storage}</span>
      </div>
    </div>
  `;

  const perfHtml = (build.fps && build.fps.length > 0)
    ? `<div class="modal-perf">
        <div class="modal-perf-label">Estimated Performance</div>
        ${build.fps.map(f => `<div class="modal-perf-item">• ${f}</div>`).join('')}
       </div>`
    : '';

  const actionHtml = available
    ? `<a href="contact.html?system=${encodeURIComponent(build.title)}"
          class="btn btn-primary btn-lg"
          onclick="event.stopPropagation()">Inquire About This System →</a>`
    : `<span class="text-dim">This system has been sold.</span>`;

  const imagesHtml = photos.length > 0
    ? photos.map((src, i) => `
        <img
          class="modal-gallery-img ${i === 0 ? 'active' : ''}"
          src="${src}"
          alt="${build.title} — photo ${i + 1}"
          loading="${i === 0 ? 'eager' : 'lazy'}"
          onerror="this.style.display='none'"
        >
      `).join('')
    : `<div class="modal-gallery-placeholder">🖥️</div>`;

  const dotsHtml = photos.length > 1
    ? photos.map((_, i) => `
        <button class="modal-dot ${i === 0 ? 'active' : ''}"
                onclick="modalGoTo(${i})" aria-label="Photo ${i+1}"></button>
      `).join('')
    : '';

  const navHtml = photos.length > 1
    ? `<div class="modal-nav">
        <button class="modal-nav-btn hidden" id="modal-prev" onclick="modalPrev()">‹</button>
        <button class="modal-nav-btn ${photos.length <= 1 ? 'hidden' : ''}" id="modal-next" onclick="modalNext()">›</button>
       </div>
       <div class="modal-dots">${dotsHtml}</div>`
    : '';

  const modal = document.getElementById('build-modal');

  modal.innerHTML = `
    <div class="modal-box" onclick="event.stopPropagation()">
      <button class="modal-close" onclick="closeBuildModal()">✕</button>

      <div class="modal-gallery" id="modal-gallery">
        ${imagesHtml}
        ${navHtml}
      </div>

      <div class="modal-content">
        <div class="modal-top">
          <div class="modal-title">${build.title}</div>
          ${badge}
        </div>
        ${specsHtml}
        ${perfHtml}
        <div class="modal-footer">
          <div class="modal-price">${build.price}</div>
          ${actionHtml}
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  window._modalIndex  = 0;
  window._modalPhotos = photos;
}

// Preload all photos in the background as soon as modal opens
  window._modalPhotos.forEach(function(src, i) {
    if (i === 0) return; // first one already loaded
    var img = new Image();
    img.src = src;
  });

function closeBuildModal() {
  document.getElementById('build-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function modalGoTo(i) {
  const photos = window._modalPhotos;
  if (!photos) return;

  window._modalIndex = i;

  document.querySelectorAll('.modal-gallery-img').forEach(function(img, idx) {
    img.classList.toggle('active', idx === i);
  });

  document.querySelectorAll('.modal-dot').forEach(function(dot, idx) {
    dot.classList.toggle('active', idx === i);
  });

  const prev = document.getElementById('modal-prev');
  const next = document.getElementById('modal-next');
  if (prev) prev.classList.toggle('hidden', i === 0);
  if (next) next.classList.toggle('hidden', i === photos.length - 1);
}

function modalPrev() {
  if (window._modalIndex > 0) modalGoTo(window._modalIndex - 1);
}

function modalNext() {
  if (window._modalIndex < window._modalPhotos.length - 1) {
    modalGoTo(window._modalIndex + 1);
  }
}

// Close on overlay click or Escape key
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('build-modal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeBuildModal();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeBuildModal();
    if (e.key === 'ArrowLeft')  modalPrev();
    if (e.key === 'ArrowRight') modalNext();
  });
});
