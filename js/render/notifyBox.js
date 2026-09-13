/*
  ================================================================
  js/render/notifyBox.js — "Get Notified" Waitlist
  ================================================================
  Shown on builds.html whenever there are zero available systems.
  This is a real, already-proven feature from the old site — carried
  forward with the same behavior, just reading the contact email from
  config.js instead of having it hardcoded in this file.

  Reliability: this is a real <form action="..."> that posts straight
  to FormSubmit — the same zero-JS-dependent pattern already used by
  contact.html, services.html, and the build-detail inquiry form. It
  works even if JavaScript never runs. The only thing JS adds is
  swapping in a nicer "you're on the list" message after the redirect
  back (same progressive-enhancement pattern as contact.html).

  Includes a hidden `_url` field (FormSubmit's own documented fix for
  browsers that now send a stripped/origin-only Referer header on
  cross-domain POSTs) so FormSubmit reliably knows the real page URL
  and honors `_next` instead of falling back to its own generic
  "Thanks!" page. See DECISIONS.md D17.

  The success-state swap is announced to screen readers via an
  aria-live region wrapping the whole box (see #notify-region below).

  Requires: js/data/config.js loaded first (for CONTACT.email).
  ================================================================
*/

function renderNotifyBox() {
  var pageUrl = window.location.origin + window.location.pathname;
  var nextUrl = pageUrl + '?notified=true';
  // The outer #notify-region wrapper exists only so aria-live has a
  // stable element to watch — wireNotifyBox() below replaces #notify-box
  // itself (outerHTML) with the success markup, and a live region has
  // to persist across that swap to be announced. display:contents means
  // this wrapper adds no layout box of its own — visually identical to
  // not having it.
  return (
    '<div id="notify-region" role="status" aria-live="polite" aria-atomic="true" style="display:contents;">' +
      '<div class="notify-box" id="notify-box">' +
        '<div class="notify-copy">' +
          '<span class="section-label" style="display:block; margin-bottom:0.75rem;">Nothing Listed Right Now</span>' +
          '<h2>Get Notified When Something Comes In</h2>' +
          '<p>Leave your email and a note about what you\'re looking for. ' +
          'When I have something that fits, I\'ll reach out directly. ' +
          'No spam, no mailing list — just a one-time heads up.</p>' +
          '<p style="margin-top:1rem; font-size:0.88rem;">' +
            'In the meantime, <a href="custom-build.html" style="color:var(--accent); text-decoration:underline;">custom builds</a> are always available ' +
            'if you have something specific in mind.' +
          '</p>' +
        '</div>' +
        '<form class="notify-form-wrap" id="notify-form" method="POST" action="https://formsubmit.co/' + CONTACT.email + '">' +
          '<input type="hidden" name="_subject" value="Notify me request \u2014 North Bridge PCs">' +
          '<input type="hidden" name="_captcha" value="false">' +
          '<input type="hidden" name="_template" value="table">' +
          '<input type="hidden" name="_next" value="' + nextUrl + '">' +
          '<input type="hidden" name="_url" value="' + pageUrl + '">' +
          '<input type="text" name="_honey" class="form-honeypot" tabindex="-1" autocomplete="off">' +
          '<div class="form-group">' +
            '<label class="form-label" for="notify-email">Your Email</label>' +
            '<input type="email" id="notify-email" name="email" class="form-input" ' +
              'placeholder="So I can reach out when something comes in" required autocomplete="email">' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label" for="notify-looking">' +
              'What are you looking for? <span class="optional">(optional)</span>' +
            '</label>' +
            '<textarea id="notify-looking" name="looking_for" class="form-textarea" style="min-height:90px;" ' +
              'placeholder="Budget, games you play, anything specific — or just leave it blank"></textarea>' +
          '</div>' +
          '<div class="form-privacy">' +
            '<p><strong>Privacy:</strong> Your email is only used to notify you about ' +
            'new listings. It won\'t be shared or used for anything else.</p>' +
          '</div>' +
          '<button type="submit" class="btn btn-primary btn-lg" style="width:100%; justify-content:center;" id="notify-submit">' +
            'Notify Me &rarr;' +
          '</button>' +
        '</form>' +
      '</div>' +
    '</div>'
  );
}

function wireNotifyBox() {
  // Progressive enhancement only — the form above already works via a
  // plain POST + redirect with zero JS, same as contact.html. This just
  // swaps in a nicer confirmation message when the redirect lands back
  // here with ?notified=true.
  if (window.location.search.indexOf('notified=true') !== -1) {
    var box = document.getElementById('notify-box');
    if (box) {
      box.outerHTML =
        '<div class="notify-success">' +
          '<span class="success-icon" style="color:var(--accent);">&#10003;</span>' +
          '<h2>You\'re on the list</h2>' +
          '<p>I\'ll reach out when something comes in that might be a good fit. ' +
          'In the meantime, feel free to <a href="contact.html">send a message</a> ' +
          'if you have questions.</p>' +
        '</div>';
    }
  }
}
