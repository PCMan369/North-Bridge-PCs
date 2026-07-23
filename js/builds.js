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
      <div class="notify-box" id="notify-box">

        <div class="notify-copy">
          <span class="section-label" style="display:block; margin-bottom:0.75rem;">Nothing Listed Right Now</span>
          <h3>Get Notified When Something Comes In</h3>
          <p>
            Leave your email and a note about what you're looking for.
            When I have something that fits, I'll reach out directly.
            No spam, no mailing list — just a one-time heads up.
          </p>
          <p style="margin-top:1rem; font-size:0.88rem;">
            In the meantime, <a href="custom-build.html">custom builds</a> are always available
            if you have something specific in mind.
          </p>
        </div>

        <div class="notify-form-wrap">
          <div class="form-group">
            <label class="form-label" for="notify-email">Your Email</label>
            <input
              type="email"
              id="notify-email"
              class="form-input"
              placeholder="So I can reach out when something comes in"
            >
          </div>
          <div class="form-group">
            <label class="form-label" for="notify-looking">
              What are you looking for? <span class="optional">(optional)</span>
            </label>
            <textarea
              id="notify-looking"
              class="form-textarea"
              style="min-height:90px;"
              placeholder="Budget, games you play, anything specific — or just leave it blank"
            ></textarea>
          </div>
          <div class="form-privacy">
            <p>
              <strong>Privacy:</strong> Your email is only used to notify you about
              new listings. It won't be shared or used for anything else.
            </p>
          </div>
          <button
            class="btn btn-primary btn-lg"
            style="width:100%; justify-content:center;"
            id="notify-submit"
          >
            Notify Me →
          </button>
          <p id="notify-error" style="color:var(--danger); font-size:0.85rem; display:none; text-align:center;">
            Something went wrong — try again or <a href="contact.html">send a message instead</a>.
          </p>
        </div>

      </div>
    `;

    // Handle notify form submission via FormSubmit AJAX
    document.getElementById('notify-submit').addEventListener('click', function () {
      const email   = document.getElementById('notify-email').value.trim();
      const looking = document.getElementById('notify-looking').value.trim();
      const errEl   = document.getElementById('notify-error');
      const btn     = document.getElementById('notify-submit');

      errEl.style.display = 'none';

      if (!email || !email.includes('@')) {
        errEl.textContent  = 'Please enter a valid email address.';
        errEl.style.display = 'block';
        return;
      }

      btn.textContent  = 'Sending…';
      btn.disabled     = true;

      // ============================================================
      // REPLACE YOUR_EMAIL_HERE with your actual email address
      // ============================================================
      fetch('https://formsubmit.co/ajax/YOUR_EMAIL_HERE', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept':       'application/json'
        },
        body: JSON.stringify({
          _subject:    'Notify me request — North Bridge PCs',
          email:       email,
          looking_for: looking || 'Not specified'
        })
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success === 'true' || data.success === true) {
          // Show success state
          document.getElementById('notify-box').outerHTML = `
            <div class="notify-success">
              <span class="success-icon">✅</span>
              <h3>You're on the list</h3>
              <p>
                I'll reach out when something comes in that might be a good fit.
                In the meantime, feel free to <a href="contact.html">send a message</a>
                if you have questions.
              </p>
            </div>
          `;
        } else {
          throw new Error('Submission failed');
        }
      })
      .catch(function () {
        btn.textContent  = 'Notify Me →';
        btn.disabled     = false;
        errEl.textContent  = 'Something went wrong — try again or send a message instead.';
        errEl.style.display = 'block';
      });
    });

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


