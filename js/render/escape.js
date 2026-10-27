/*
  ================================================================
  js/render/escape.js — makes text safe to place inside HTML
  ================================================================
  Listing text now comes from admin forms, so a title like
  27" monitor included or Ryzen <5> must not break the page markup.
  The renderers (buildCard.js, buildDetail.js, galleryGrid.js) wrap
  every piece of listing text in escapeHtml(). Load this file BEFORE
  them on any page that uses them.
  ================================================================
*/

function escapeHtml(value) {
  return String(value === null || value === undefined ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
