/*
  ================================================================
  js/render/contactRouter.js — Contact Page Situation Router
  ================================================================
  contact.html presents 5 "what do you need help with" options.
  One of them (Part Box) is a plain link to its own existing dedicated
  page/form (part-boxes.html) — there's nothing to route for that, it's
  just normal <a> navigation and needs no JS at all.

  The other four map to 3 real <form> panels on this page: Buying a
  Gaming PC, Custom PC, and one shared panel for General Question /
  Other-not-sure (those two ask for exactly the same information, so
  a second near-identical form would just be upkeep for no benefit —
  see DECISIONS.md D33). Clicking a picker button reveals its panel,
  relabels the shared one if that's the target, and scrolls to it.

  Reliability: every panel is a real <form action="..."> POST, baked
  in at build time by stitch.py from config.js — same pattern as
  every other form on the site, not JS-rendered and not fetch()-
  based. Nothing in the raw HTML hides the panels — this script does
  that itself, on load. So if JS never runs at all, every panel is
  simply visible already and the page degrades to "three real forms
  stacked, pick the one that applies," not broken.
  ================================================================
*/

function initContactRouter() {
  var flow = document.getElementById('contact-flow');
  var liveRegion = document.getElementById('contact-live-region');
  if (!flow || !liveRegion) return;

  // Thank-you state (progressive enhancement — every form already
  // works without this via its own _next redirect; this just swaps
  // in a nicer confirmation when JS is available). Same dynamic-
  // injection-into-a-role=status-region pattern used everywhere else
  // on the site (notifyBox.js, build-detail form),
  // rather than a plain display toggle, since that's the pattern
  // already confirmed to announce correctly to screen readers.
  if (window.location.search.indexOf('sent=true') !== -1) {
    flow.style.display = 'none';
    liveRegion.innerHTML =
      '<section class="section"><div class="container">' +
        '<div class="success-state">' +
          '<span class="success-mark" aria-hidden="true">&#10003;</span>' +
          '<h2 class="success-title">Message Sent</h2>' +
          '<p>Thanks for reaching out. I\'ll reply by email, usually within a day or two.</p>' +
          '<a href="index.html" class="btn btn-secondary">Back to Home</a>' +
        '</div>' +
      '</div></section>';
    return;
  }

  var formsSection = document.getElementById('situation-forms-section');
  var panels = document.querySelectorAll('.situation-form-panel');
  if (formsSection) formsSection.style.display = 'none';
  panels.forEach(function (panel) { panel.style.display = 'none'; });

  var buttons = document.querySelectorAll('.situation-select-btn');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.getElementById(btn.getAttribute('data-target'));
      if (!target) return;

      if (formsSection) formsSection.style.display = 'block';
      panels.forEach(function (panel) { panel.style.display = 'none'; });
      target.style.display = 'block';

      // The General Question / Other-not-sure buttons share one
      // panel — relabel its heading, hidden subject, and hidden
      // situation tag (and its intro line, only if the button has its own) to match whichever button was clicked.
      var label = btn.getAttribute('data-situation-label');
      if (label) {
        var heading = target.querySelector('.situation-heading');
        var lead = target.querySelector('.situation-lead');
        var tagInput = target.querySelector('.situation-tag-input');
        var subjectInput = target.querySelector('.situation-subject-input');
        if (heading) heading.textContent = label;
        if (lead && btn.hasAttribute('data-situation-lead')) lead.textContent = btn.getAttribute('data-situation-lead');
        if (tagInput) tagInput.value = btn.getAttribute('data-situation-tag') || label;
        if (subjectInput) subjectInput.value = btn.getAttribute('data-situation-subject') || label;
      }

      if (target.scrollIntoView) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initContactRouter);
