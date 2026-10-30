/*
  ================================================================
  js/render/eventBanner.js — Sitewide Sale/Promo Banner
  ================================================================
  Reads js/data/events.js + the `events` toggle in config.js. Renders
  nothing at all — no banner, no empty bar taking up space — unless the
  feature is on AND an event is currently active (in its date range).

  Load order: js/data/config.js, js/data/events.js and js/render/escape.js
  must load before this file (sale text comes from an admin form, so it is
  escaped).
  ================================================================
*/

(function () {
  var container = document.getElementById('event-banner');
  if (!container) return;

  if (typeof features === 'undefined' || !features.events || !features.events.show) return;
  if (typeof getActiveEvent !== 'function') return;

  var event = getActiveEvent();
  if (!event) return;

  var html = ''
    + '<div class="event-banner-inner">'
    +   '<span class="event-banner-dot"></span>'
    +   '<span class="event-banner-name">' + escapeHtml(event.name) + '</span>'
    +   '<span class="event-banner-sep">&bull;</span>'
    +   '<span class="event-banner-msg">' + escapeHtml(event.banner) + '</span>';

  if (event.showCountdown) {
    var days = eventDaysLeft(event);
    var label = days === 1 ? '1 day left' : days + ' days left';
    html += '<span class="event-banner-countdown">' + label + '</span>';
  }

  html += '</div>';

  container.innerHTML = html;
})();
