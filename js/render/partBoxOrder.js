/*
  ================================================================
  js/render/partBoxOrder.js — Order Request Builder
  ================================================================
  Tracks quantities selected across all box cards on part-boxes.html
  and keeps the "Your Request" summary panel in sync. No payment
  processing, no real cart or checkout — this just turns several
  quantity pickers into one clean inquiry. Fulfillment (payment,
  pickup) still happens in person.

  Reliability: the actual submission is a real <form action="..."> POST
  (baked in at build time by stitch.py from config.js, same pattern as
  contact.html/services.html/the build-detail inquiry form), not a
  fetch()/AJAX call — it doesn't depend on that specific request
  succeeding at submit time the way the old fetch()-based version did.
  updateSummary() below keeps two hidden fields (items_requested,
  estimated_total) in sync with the visible summary on every selection
  change, so the real POST always matches what's shown on screen. See
  DECISIONS.md D31 for the reliability fix and why part-boxes.html was
  the one form still on the old pattern.

  Requires: js/data/config.js (for CONTACT.email — used only as a
  fallback if the build-time token wasn't replaced), and the box cards
  (from partBoxCard.js) already in the DOM.
  ================================================================
*/

function initPartBoxOrder() {
  var grid = document.getElementById('part-boxes-grid');
  var summary = document.getElementById('order-summary');
  if (!grid || !summary) return;

  // Thank-you state (progressive enhancement — the form itself already
  // works via a plain POST + redirect with zero custom JS; this just
  // swaps in a nicer confirmation when JS is available). Checked first
  // and returns early: box selections don't survive a page reload, so
  // the normal empty-selection rendering below would otherwise hide
  // this panel right back out.
  if (window.location.search.indexOf('ordered=true') !== -1) {
    summary.style.display = '';
    summary.innerHTML =
      '<div class="notify-success">' +
        '<span class="success-icon" style="color:var(--accent);">&#10003;</span>' +
        '<h3>Request Sent</h3>' +
        '<p>I\'ll follow up by email to arrange pickup and payment.</p>' +
      '</div>';
    return;
  }

  if (!grid.querySelector('.box-card')) return; // nothing orderable — empty state only

  var itemsEl = document.getElementById('order-summary-items');
  var totalWrap = document.getElementById('order-summary-total');
  var totalAmountEl = document.getElementById('order-total-amount');
  var formWrap = document.getElementById('order-form-wrap');
  var itemsHiddenEl = document.getElementById('order-items-hidden');
  var totalHiddenEl = document.getElementById('order-total-hidden');

  var selections = {}; // box id -> selected quantity

  function parsePrice(str) {
    var n = parseFloat(String(str).replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  function formatMoney(n) {
    return '$' + n.toFixed(2).replace(/\.00$/, '');
  }

  function updateSummary() {
    var cards = grid.querySelectorAll('.box-card');
    var lines = [];
    var total = 0;

    cards.forEach(function (card) {
      var id = card.getAttribute('data-id');
      var qty = selections[id] || 0;
      if (qty > 0) {
        var price = parsePrice(card.getAttribute('data-price'));
        var lineTotal = price * qty;
        total += lineTotal;
        lines.push({ label: card.getAttribute('data-label'), qty: qty, lineTotal: lineTotal });
      }
    });

    if (!lines.length) {
      itemsEl.innerHTML = '<p class="order-summary-empty">No boxes selected yet.</p>';
      totalWrap.style.display = 'none';
      formWrap.style.display = 'none';
      if (itemsHiddenEl) itemsHiddenEl.value = '';
      if (totalHiddenEl) totalHiddenEl.value = '';
      return;
    }

    itemsEl.innerHTML = lines.map(function (l) {
      return '<div class="order-line">' +
        '<span class="order-line-label">' + l.label + ' &times; ' + l.qty + '</span>' +
        '<span class="order-line-price">' + formatMoney(l.lineTotal) + '</span>' +
      '</div>';
    }).join('');

    totalAmountEl.textContent = formatMoney(total);
    totalWrap.style.display = 'flex';
    formWrap.style.display = 'block';

    // Keep the real form's hidden fields in sync so the actual POST
    // always matches what's shown in the summary above.
    if (itemsHiddenEl) itemsHiddenEl.value = lines.map(function (l) { return l.label + ' x' + l.qty; }).join(', ');
    if (totalHiddenEl) totalHiddenEl.value = formatMoney(total);
  }

  function setQty(card, val) {
    var input = card.querySelector('.qty-input');
    var max = parseInt(input.getAttribute('max'), 10) || 0;
    var clamped = Math.max(0, Math.min(max, val));
    input.value = clamped;
    selections[card.getAttribute('data-id')] = clamped;
    updateSummary();
  }

  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('.qty-btn');
    if (!btn) return;
    var card = btn.closest('.box-card');
    var input = card.querySelector('.qty-input');
    var current = parseInt(input.value, 10) || 0;
    setQty(card, btn.classList.contains('qty-plus') ? current + 1 : current - 1);
  });

  grid.addEventListener('input', function (e) {
    if (!e.target.classList.contains('qty-input')) return;
    var card = e.target.closest('.box-card');
    setQty(card, parseInt(e.target.value, 10) || 0);
  });

  updateSummary();
}

document.addEventListener('DOMContentLoaded', initPartBoxOrder);
