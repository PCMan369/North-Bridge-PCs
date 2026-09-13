/*
  ================================================================
  js/render/galleryGrid.js — Gallery Grid + Lightbox
  ================================================================
  Renders a grid of media into a container, and wires up a simple
  click-to-enlarge lightbox (new — the old site's gallery was
  grid-only). No dependencies, no library — just a modal overlay with
  prev/next and Escape-to-close, consistent with the rest of the site.

  Every gallery grid rendered by this file shares one lightbox that's
  built lazily on first use, so multiple grids on the same page (e.g.
  "Current Builds" and "Completed Builds") can each open it correctly
  with their own media set.

  Each item is either a photo — {src, alt} — or a video clip —
  {type: 'video', src, poster, alt} — the same shape build.html's own
  media list already uses. `type` defaults to 'image' when omitted,
  so existing plain photo lists (gallery.html's) don't need to change.

  Focus management: opening moves focus to the close button and
  remembers whatever had focus beforehand (the grid item that was
  activated); Tab/Shift+Tab cycle within the lightbox's own controls
  (including the video's native controls, when a video is showing)
  while it's open; closing (via Escape, the close button, or clicking
  the overlay) returns focus to that original element. See DECISIONS.md
  D20, D22.
  ================================================================
*/

function renderGalleryGrid(images, containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;

  if (!images || !images.length) {
    container.innerHTML =
      '<div style="grid-column:1/-1; text-align:center; padding:3rem 2rem; color:var(--dim);">' +
        '<div style="font-size:2.5rem; margin-bottom:1rem; opacity:0.4;"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8a1.5 1.5 0 0 1 1.5-1.5h2l1-2h7l1 2h2A1.5 1.5 0 0 1 20 8v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18Z"/><circle cx="12" cy="13" r="3.3"/></svg></div>' +
        '<p style="color:var(--dim);">Photos coming soon.</p>' +
      '</div>';
    return;
  }

  container.innerHTML = images.map(function (img, i) {
    var isVideo = img.type === 'video';
    var label = (isVideo ? 'Play video: ' : 'View full-size: ') + img.alt;
    var thumbSrc = isVideo ? img.poster : img.src;

    var mediaHtml = thumbSrc
      ? '<img src="' + thumbSrc + '" alt="' + img.alt + '" loading="lazy" ' +
          'onload="this.classList.add(\'loaded\')" ' +
          'onerror="this.parentElement.innerHTML=\'<div class=gallery-placeholder><span class=gp-icon><svg width=&quot;1em&quot; height=&quot;1em&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;1.5&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;><path d=&quot;M4 8a1.5 1.5 0 0 1 1.5-1.5h2l1-2h7l1 2h2A1.5 1.5 0 0 1 20 8v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18Z&quot;/><circle cx=&quot;12&quot; cy=&quot;13&quot; r=&quot;3.3&quot;/></svg></span><span>Photo coming soon</span></div>\'">'
      : '<div class="gallery-placeholder"><span class="gp-icon"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 4.6 5h3.6L6.6 9.5Z"/><path d="M9 9.5 10.6 5h3.6L12.6 9.5Z"/><path d="M15 9.5 16.6 5H20L18.4 9.5Z"/><rect x="3" y="9.5" width="18" height="9.5" rx="1"/></svg></span><span>' + img.alt + '</span></div>';

    return '<div class="gallery-item" data-idx="' + i + '" tabindex="0" role="button" ' +
      'aria-label="' + label + '">' +
      mediaHtml +
      (isVideo ? '<span class="gallery-item-video-icon"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5Z"/></svg></span>' : '') +
    '</div>';
  }).join('');

  container.querySelectorAll('.gallery-item').forEach(function (item) {
    function open() {
      var idx = parseInt(item.getAttribute('data-idx'), 10);
      openLightbox(images, idx);
    }
    item.addEventListener('click', open);
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });
}

// ---- Lightbox (shared across all grids on the page) ----

var _lightboxEl = null;
var _lightboxImages = [];
var _lightboxIdx = 0;
var _lightboxTriggerEl = null; // element to restore focus to on close

function _ensureLightbox() {
  if (_lightboxEl) return _lightboxEl;

  var el = document.createElement('div');
  el.className = 'lightbox';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', 'Photo viewer');
  el.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&times;</button>' +
    '<button class="lightbox-arrow lightbox-prev" aria-label="Previous photo">&lsaquo;</button>' +
    '<img class="lightbox-img" alt="">' +
    '<video class="lightbox-video" controls playsinline></video>' +
    '<button class="lightbox-arrow lightbox-next" aria-label="Next photo">&rsaquo;</button>' +
    '<div class="lightbox-counter"></div>';

  document.body.appendChild(el);

  el.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  el.querySelector('.lightbox-prev').addEventListener('click', function () { lightboxStep(-1); });
  el.querySelector('.lightbox-next').addEventListener('click', function () { lightboxStep(1); });

  // Click the dark overlay (not the image itself) to close.
  el.addEventListener('click', function (e) {
    if (e.target === el) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!el.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxStep(-1);
    if (e.key === 'ArrowRight') lightboxStep(1);
    if (e.key === 'Tab') _trapLightboxFocus(e);
  });

  _lightboxEl = el;
  return el;
}

// Keeps Tab/Shift+Tab cycling within the lightbox's own controls while
// it's open, instead of moving focus to the page underneath. Only
// considers currently-visible controls — prev/next are hidden via
// style.display when there's just one item, and the video element is
// only relevant when a video is actually showing (see
// _renderLightboxItem) — so a visible, focusable video counts too.
function _trapLightboxFocus(e) {
  var candidates = _lightboxEl.querySelectorAll('button, video[controls]');
  var focusable = Array.prototype.filter.call(
    candidates,
    function (el) { return getComputedStyle(el).display !== 'none'; }
  );
  if (!focusable.length) return;
  var first = focusable[0];
  var last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function openLightbox(images, idx) {
  _lightboxTriggerEl = document.activeElement;
  var el = _ensureLightbox();
  _lightboxImages = images;
  _lightboxIdx = idx;
  _renderLightboxItem();
  el.classList.add('open');
  document.body.classList.add('lightbox-open');
  el.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
  if (!_lightboxEl) return;
  _lightboxEl.classList.remove('open');
  document.body.classList.remove('lightbox-open');
  var videoEl = _lightboxEl.querySelector('.lightbox-video');
  if (videoEl) videoEl.pause();
  if (_lightboxTriggerEl && document.contains(_lightboxTriggerEl)) {
    _lightboxTriggerEl.focus();
  }
  _lightboxTriggerEl = null;
}

function lightboxStep(delta) {
  var len = _lightboxImages.length;
  _lightboxIdx = (_lightboxIdx + delta + len) % len;
  _renderLightboxItem();
}

function _renderLightboxItem() {
  var item = _lightboxImages[_lightboxIdx];
  var imgEl = _lightboxEl.querySelector('.lightbox-img');
  var videoEl = _lightboxEl.querySelector('.lightbox-video');
  var isVideo = item.type === 'video';

  videoEl.pause();

  if (isVideo) {
    var existingSource = videoEl.querySelector('source');
    if (existingSource) existingSource.remove();
    var source = document.createElement('source');
    source.src = item.src;
    videoEl.appendChild(source);
    if (item.poster) {
      videoEl.setAttribute('poster', item.poster);
    } else {
      videoEl.removeAttribute('poster');
    }
    videoEl.load();
    videoEl.style.display = '';
    imgEl.style.display = 'none';
  } else {
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    imgEl.style.display = '';
    videoEl.style.display = 'none';
  }

  _lightboxEl.querySelector('.lightbox-counter').textContent =
    (_lightboxIdx + 1) + ' / ' + _lightboxImages.length;

  var multi = _lightboxImages.length > 1;
  _lightboxEl.querySelector('.lightbox-prev').style.display = multi ? '' : 'none';
  _lightboxEl.querySelector('.lightbox-next').style.display = multi ? '' : 'none';
}
