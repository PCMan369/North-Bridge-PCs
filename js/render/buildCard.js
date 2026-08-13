/*
  ================================================================
  js/render/buildCard.js — Build Card Renderer
  ================================================================
  Turns one entry from js/data/builds.js into a build-card HTML string.
  Used on the homepage (featured builds) and builds.html (Phase 3).

  Every optional field is genuinely optional here — a build missing
  performance data, event pricing, or even a photo still renders a
  complete-looking card, it just omits that section rather than
  showing an empty one.

  Load order: js/data/config.js and js/data/events.js should load
  before this file if any build uses event pricing.
  ================================================================
*/

function renderBuildCard(build) {
  var isSold = build.status === 'sold';
  var badgeClass = isSold ? 'badge-sold' : 'badge-available';
  var badgeText = isSold ? 'Sold' : 'Available';

  // ---- Image or placeholder ----
  var image = build.media && build.media.images && build.media.images[0];
  var imageHtml = image
    ? '<img src="' + image + '" alt="' + build.title + '" loading="lazy" ' +
      'onload="this.classList.add(\'loaded\')" ' +
      'onerror="this.parentElement.innerHTML=\'<div class=build-img-placeholder>&#128421;</div>\'">'
    : '<div class="build-img-placeholder">&#128421;</div>';

  // ---- Spec lines: CPU / GPU / RAM / Storage, each optional ----
  var c = build.components || {};
  var specRows = [];
  if (c.cpu && c.cpu.model)         specRows.push(['CPU', c.cpu.model]);
  if (c.gpu && c.gpu.model)         specRows.push(['GPU', c.gpu.model]);
  if (c.ram && c.ram.model)         specRows.push(['RAM', c.ram.model]);
  if (c.storage && c.storage.model) specRows.push(['Storage', c.storage.model]);

  var specsHtml = specRows.map(function (row) {
    return '<div class="build-spec"><span class="spec-label">' + row[0] + '</span>' + row[1] + '</div>';
  }).join('');

  // ---- Performance (optional, always labeled as estimate unless told otherwise) ----
  var perfHtml = '';
  if (build.performance && build.performance.items && build.performance.items.length) {
    var perfItems = build.performance.items.slice(0, 3).map(function (p) {
      return '<div class="perf-item">' + p.game + ': ' + p.fps + ' @ ' + p.settings + '</div>';
    }).join('');
    var perfLabel = build.performance.isEstimate === false ? 'Performance' : 'Estimated Performance';
    perfHtml = '<div class="build-perf"><div class="perf-label">' + perfLabel + '</div>' + perfItems + '</div>';
  }

  // ---- Price, with event pricing only if this build's event is currently active ----
  var priceHtml = '<div class="build-price">' + build.price + '</div>';
  if (!isSold && build.eventId && build.eventPrice && typeof getActiveEvent === 'function') {
    var activeEvent = getActiveEvent();
    if (activeEvent && activeEvent.id === build.eventId) {
      priceHtml =
        '<div>' +
          '<div class="price-original">' + build.price + '</div>' +
          '<div class="price-event">' + build.eventPrice + '</div>' +
        '</div>';
    }
  }

  return (
    '<div class="build-card' + (isSold ? ' is-sold' : '') + '">' +
      '<div class="build-image">' + imageHtml + '</div>' +
      '<div class="build-body">' +
        '<div class="build-header">' +
          '<div class="build-title">' + build.title + '</div>' +
          '<span class="badge ' + badgeClass + '">' + badgeText + '</span>' +
        '</div>' +
        '<div class="build-specs">' + specsHtml + '</div>' +
        perfHtml +
        '<div class="build-footer">' +
          priceHtml +
          '<a href="build.html?id=' + build.id + '" class="btn btn-primary btn-sm">' +
            (isSold ? 'View Build' : 'View Details') +
          '</a>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

function renderEmptyBuildsState() {
  return (
    '<div class="empty-state">' +
      '<span class="empty-icon">&#128421;&#65039;</span>' +
      '<h3>No Systems Listed Right Now</h3>' +
      '<p>Nothing available at the moment — check back soon, or get notified when something comes in.</p>' +
      '<div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; margin-top:1.5rem;">' +
        '<a href="builds.html" class="btn btn-primary">Get Notified &rarr;</a>' +
        '<a href="custom-build.html" class="btn btn-secondary">Custom Builds</a>' +
      '</div>' +
    '</div>'
  );
}
