/*
  ================================================================
  js/render/buildDetail.js — Complete Build Detail Page
  ================================================================
  Renders build.html?id=X entirely from one entry in js/data/builds.js.
  This is the "complete build card" system: full component spec sheet
  (not just RAM/Storage), a photo+video gallery, performance estimates,
  condition/testing notes when present, and a status-aware CTA (an
  inquiry form for available systems, a sold notice for sold ones).

  Every section is genuinely optional — a build with no photos, no
  performance data, or missing component fields still renders a
  complete-looking page; it just omits what isn't there.

  Requires (load order): config.js, events.js, builds.js,
  trustSection.js.
  ================================================================
*/

var COMPONENT_LABELS = [
  ['cpu', 'CPU'],
  ['gpu', 'GPU'],
  ['motherboard', 'Motherboard'],
  ['ram', 'RAM'],
  ['storage', 'Storage'],
  ['psu', 'Power Supply'],
  ['case', 'Case'],
  ['cooler', 'Cooling'],
  ['os', 'Operating System'],
  ['networking', 'Networking']
];

function initBuildDetailPage() {
  var contentEl = document.getElementById('build-content');
  if (!contentEl) return;

  var params = new URLSearchParams(window.location.search);
  var id = params.get('id');
  var build = builds.find(function (b) { return b.id === id; }) || null;

  if (!build) {
    contentEl.innerHTML =
      '<div class="empty-state" style="margin-top:2rem;">' +
        '<span class="empty-icon">&#128421;&#65039;</span>' +
        '<h3>System Not Found</h3>' +
        '<p>This listing may have been removed or the link is incorrect.</p>' +
        '<a href="builds.html" class="btn btn-primary" style="margin-top:1.5rem;">Browse Available Systems &rarr;</a>' +
      '</div>';
    return;
  }

  // ---- Page title / meta description ----
  document.title = build.title + ' \u2014 North Bridge PCs';
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.content = build.title + ' for sale \u2014 ' + build.price + '. North Bridge PCs, Southern Oregon.';
  }

  var isAvailable = build.status === 'available';
  var badge = isAvailable
    ? '<span class="badge badge-available">Available</span>'
    : '<span class="badge badge-sold">Sold</span>';

  // ---- Media list: images + videos combined into one ordered gallery ----
  var media = [];
  if (build.media && build.media.images) {
    build.media.images.forEach(function (src) { media.push({ type: 'image', src: src }); });
  }
  if (build.media && build.media.videos) {
    build.media.videos.forEach(function (v) {
      var src = typeof v === 'string' ? v : v.src;
      var poster = typeof v === 'string' ? null : v.poster;
      media.push({ type: 'video', src: src, poster: poster || null });
    });
  }

  var mainMediaHtml = media.length
    ? media.map(function (m, i) {
        if (m.type === 'video') {
          return '<video class="gallery-main-img' + (i === 0 ? ' active' : '') + '" ' +
            (m.poster ? 'poster="' + m.poster + '" ' : '') +
            'controls playsinline preload="none" onloadeddata="this.classList.add(\'loaded\')">' +
            '<source src="' + m.src + '">' +
            '</video>';
        }
        return '<img class="gallery-main-img' + (i === 0 ? ' active' : '') + '" src="' + m.src + '" ' +
          'alt="' + build.title + ' \u2014 photo ' + (i + 1) + '" ' +
          'loading="' + (i === 0 ? 'eager' : 'lazy') + '" ' +
          'onload="this.classList.add(\'loaded\')" onerror="this.style.display=\'none\'">';
      }).join('')
    : '<div class="gallery-main-placeholder">&#128421;&#65039;</div>';

  var arrowsHtml = media.length > 1
    ? '<div class="gallery-arrows">' +
        '<button class="gallery-arrow hidden" id="gal-prev" aria-label="Previous photo">&lsaquo;</button>' +
        '<button class="gallery-arrow" id="gal-next" aria-label="Next photo">&rsaquo;</button>' +
      '</div>' +
      '<div class="gallery-counter" id="gal-counter">1 / ' + media.length + '</div>'
    : '';

  var thumbsHtml = media.length > 1
    ? '<div class="gallery-thumbs">' +
        media.map(function (m, i) {
          var thumbSrc = m.type === 'video' ? (m.poster || m.src) : m.src;
          return '<div class="gallery-thumb' + (i === 0 ? ' active' : '') + '" data-idx="' + i + '">' +
            '<img src="' + thumbSrc + '" alt="Photo ' + (i + 1) + '" loading="lazy">' +
            (m.type === 'video' ? '<span class="gallery-thumb-video-icon">&#9654;</span>' : '') +
          '</div>';
        }).join('') +
      '</div>'
    : '';

  // ---- Full specifications: every populated component, nothing hardcoded ----
  var c = build.components || {};
  var specRows = COMPONENT_LABELS
    .filter(function (pair) { return c[pair[0]] && c[pair[0]].model; })
    .map(function (pair) {
      return '<div class="listing-spec-row">' +
        '<span class="listing-spec-label">' + pair[1] + '</span>' +
        '<span class="listing-spec-value">' + c[pair[0]].model + '</span>' +
      '</div>';
    }).join('');

  if (c.accessories && c.accessories.length) {
    specRows += '<div class="listing-spec-row">' +
      '<span class="listing-spec-label">Included</span>' +
      '<span class="listing-spec-value">' + c.accessories.join(', ') + '</span>' +
    '</div>';
  }

  var specsHtml = specRows
    ? '<div class="listing-specs-card"><div class="listing-specs-title">Specifications</div>' + specRows + '</div>'
    : '';

  // ---- Performance ----
  var perfHtml = '';
  if (build.performance && build.performance.items && build.performance.items.length) {
    var perfLabel = build.performance.isEstimate === false ? 'Performance' : 'Estimated Performance';
    perfHtml = '<div class="listing-perf-card">' +
      '<div class="listing-perf-title">' + perfLabel + '</div>' +
      build.performance.items.map(function (p) {
        return '<div class="listing-perf-item">' + p.game + ': ' + p.fps + ' @ ' + p.settings + '</div>';
      }).join('') +
      '<p style="font-size:0.75rem; color:var(--dim); margin-top:0.75rem; font-style:italic;">' +
        'Performance varies based on game settings, resolution, and title.' +
      '</p>' +
    '</div>';
  }

  // ---- Condition / testing notes (only if provided) ----
  var conditionHtml = '';
  if (build.condition || build.testingNotes) {
    conditionHtml = '<div class="listing-specs-card">' +
      '<div class="listing-specs-title">Condition &amp; Testing</div>' +
      (build.condition ? '<p style="font-size:0.9rem; margin-bottom:' + (build.testingNotes ? '0.75rem' : '0') + ';">' + build.condition + '</p>' : '') +
      (build.testingNotes ? '<p style="font-size:0.9rem;">' + build.testingNotes + '</p>' : '') +
    '</div>';
  }

  // ---- Price (with event pricing if this build's event is active) ----
  var priceHtml = '<div class="listing-price">' + build.price + '</div>';
  if (isAvailable && build.eventId && build.eventPrice && typeof getActiveEvent === 'function') {
    var activeEvent = getActiveEvent();
    if (activeEvent && activeEvent.id === build.eventId) {
      priceHtml =
        '<div class="price-original">' + build.price + '</div>' +
        '<div style="display:flex; align-items:center; gap:0.6rem;">' +
          '<div class="price-event">' + build.eventPrice + '</div>' +
          '<span class="event-badge">' + activeEvent.name + '</span>' +
        '</div>';
    }
  }

  // ---- Inquiry form (available) or sold notice ----
  var formHtml;
  if (isAvailable) {
    var nextUrl = window.location.origin + window.location.pathname + '?id=' + encodeURIComponent(build.id) + '&sent=true';
    formHtml =
      '<div class="listing-form-card">' +
        '<div class="listing-form-title">Inquire About This System</div>' +
        '<div class="listing-form-sub">Fill out the form and I\'ll get back to you by email.</div>' +
        '<div class="listing-system-badge"><span>Asking about:</span> <strong>' + build.title + '</strong></div>' +
        '<form action="https://formsubmit.co/' + CONTACT.email + '" method="POST">' +
          '<input type="hidden" name="_subject" value="Inquiry: ' + build.title + ' \u2014 North Bridge PCs">' +
          '<input type="hidden" name="_captcha" value="false">' +
          '<input type="hidden" name="_template" value="table">' +
          '<input type="hidden" name="_next" value="' + nextUrl + '">' +
          '<input type="hidden" name="system" value="' + build.title + '">' +
          '<input type="text" name="_honey" class="form-honeypot" tabindex="-1" autocomplete="off">' +
          '<div style="display:flex; flex-direction:column; gap:1rem;">' +
            '<div class="form-group"><label class="form-label" for="name">Your Name</label>' +
              '<input type="text" id="name" name="name" class="form-input" placeholder="First name is fine" required autocomplete="name"></div>' +
            '<div class="form-group"><label class="form-label" for="email">Your Email</label>' +
              '<input type="email" id="email" name="email" class="form-input" placeholder="So I can reply to you" required autocomplete="email"></div>' +
            '<div class="form-group"><label class="form-label" for="os">Windows or Linux?</label>' +
              '<select id="os" name="operating_system" class="form-select">' +
                '<option value="" disabled selected>Select one</option>' +
                '<option value="Windows">Windows</option>' +
                '<option value="Linux">Linux</option>' +
                '<option value="Open to either">Open to either</option>' +
                '<option value="Not sure">Not sure</option>' +
              '</select></div>' +
            '<div class="form-group"><label class="form-label" for="notes">Anything else? <span class="optional">(optional)</span></label>' +
              '<textarea id="notes" name="additional_notes" class="form-textarea" style="min-height:90px;" placeholder="Questions, preferences, anything at all..."></textarea></div>' +
            '<div class="form-privacy"><p><strong>Privacy:</strong> Your email is only used to respond to your message. It won\'t be shared or used for anything else.</p></div>' +
            '<button type="submit" class="btn btn-primary btn-lg" style="width:100%; justify-content:center;">Send Message &rarr;</button>' +
          '</div>' +
        '</form>' +
      '</div>';
  } else {
    formHtml =
      '<div class="sold-notice">' +
        '<span class="badge badge-sold" style="margin-bottom:0.5rem;">Sold</span>' +
        '<p>This system has already been sold. Check the listings page for what\'s currently available.</p>' +
        '<a href="builds.html" class="btn btn-secondary" style="margin-top:1rem;">Browse Available Systems &rarr;</a>' +
      '</div>';
  }

  // ---- Trust section (shared content, own wrapper) ----
  var trustHtml =
    '<div class="trust-section">' +
      '<div class="section-header" style="text-align:left; margin-bottom:2rem;">' +
        '<span class="section-label">Why North Bridge PCs</span>' +
        '<h2 style="font-size:1.5rem;">What You\'re Getting</h2>' +
      '</div>' +
      '<div style="margin-bottom:3rem;">' + renderTrustCards() + '</div>' +
      '<div class="listing-process">' +
        '<div class="section-label" style="display:block; margin-bottom:0.5rem;">Before Pickup</div>' +
        '<h3 style="margin-bottom:0.25rem;">Testing &amp; Setup Process</h3>' +
        '<p style="font-size:0.9rem; margin-bottom:0; line-height:1.6;">Every system goes through the same checklist before it\'s ready to hand off.</p>' +
        renderProcessSteps() +
      '</div>' +
    '</div>';

  // ---- Browse more CTA ----
  var ctaHtml =
    '<div class="cta-box" style="margin-top:3rem;">' +
      '<h2>Browse More Systems</h2>' +
      '<p>Looking for something different? See everything that\'s currently available.</p>' +
      '<div class="btn-group">' +
        '<a href="builds.html" class="btn btn-primary btn-lg">View All Systems &rarr;</a>' +
        '<a href="custom-build.html" class="btn btn-secondary btn-lg">Custom Builds</a>' +
      '</div>' +
    '</div>';

  // ---- Assemble ----
  contentEl.innerHTML =
    '<div class="listing-layout">' +
      '<div class="listing-gallery">' +
        '<div class="gallery-main">' + mainMediaHtml + arrowsHtml + '</div>' +
        thumbsHtml +
      '</div>' +
      '<div class="listing-details">' +
        '<div class="listing-header"><h1 class="listing-title">' + build.title + '</h1>' + badge + '</div>' +
        '<div class="listing-price-row">' +
          '<div class="listing-price-wrap">' + priceHtml + '</div>' +
          '<div style="flex:1;"></div>' +
          '<div style="font-size:0.8rem; color:var(--dim); text-align:right; line-height:1.5;">Local pickup<br>Grants Pass, OR</div>' +
        '</div>' +
        specsHtml + conditionHtml + perfHtml + formHtml +
      '</div>' +
    '</div>' +
    trustHtml + ctaHtml;

  // ---- Gallery navigation ----
  var currentIdx = 0;

  function galGoTo(i) {
    currentIdx = i;
    contentEl.querySelectorAll('.gallery-main-img').forEach(function (el, idx) {
      el.classList.toggle('active', idx === i);
      if (el.tagName === 'VIDEO' && idx !== i) el.pause();
    });
    contentEl.querySelectorAll('.gallery-thumb').forEach(function (t, idx) {
      t.classList.toggle('active', idx === i);
    });
    var counter = document.getElementById('gal-counter');
    if (counter) counter.textContent = (i + 1) + ' / ' + media.length;
    var prev = document.getElementById('gal-prev');
    var next = document.getElementById('gal-next');
    if (prev) prev.classList.toggle('hidden', i === 0);
    if (next) next.classList.toggle('hidden', i === media.length - 1);
  }

  contentEl.querySelectorAll('.gallery-thumb').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      galGoTo(parseInt(thumb.getAttribute('data-idx'), 10));
    });
  });

  var prevBtn = document.getElementById('gal-prev');
  var nextBtn = document.getElementById('gal-next');
  if (prevBtn) prevBtn.addEventListener('click', function () { if (currentIdx > 0) galGoTo(currentIdx - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { if (currentIdx < media.length - 1) galGoTo(currentIdx + 1); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' && currentIdx > 0) galGoTo(currentIdx - 1);
    if (e.key === 'ArrowRight' && currentIdx < media.length - 1) galGoTo(currentIdx + 1);
  });

  // Preload remaining images (not videos — those use preload="none" on purpose)
  media.forEach(function (m, i) {
    if (i === 0 || m.type === 'video') return;
    var img = new Image();
    img.src = m.src;
  });

  // ---- Thank-you state ----
  if (window.location.search.includes('sent=true')) {
    var form = contentEl.querySelector('.listing-form-card form');
    if (form) {
      form.innerHTML =
        '<div style="text-align:center; padding:2rem 1rem;">' +
          '<div style="font-size:2.5rem; margin-bottom:1rem;">&#9989;</div>' +
          '<h3 style="margin-bottom:0.5rem; font-size:1.1rem;">Message Sent</h3>' +
          '<p style="font-size:0.9rem; margin-bottom:1.5rem;">Thanks for reaching out. I\'ll get back to you by email within a day or two.</p>' +
          '<a href="builds.html" class="btn btn-secondary btn-sm">Browse More Systems</a>' +
        '</div>';
    }
  }

  // ---- Back button ----
  var backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      if (document.referrer && document.referrer.includes(window.location.hostname)) {
        history.back();
      } else {
        window.location.href = 'builds.html';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', initBuildDetailPage);
