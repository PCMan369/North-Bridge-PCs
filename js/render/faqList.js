/*
  ================================================================
  js/render/faqList.js — FAQ List Renderer
  ================================================================
  Turns an array of items from js/data/faq.js into the accordion
  markup. Click behavior itself lives in js/render/faqAccordion.js
  (already scoped per .faq-list, so it works on whichever container
  this renders into without changes).

  Each question is a real <button> inside the <h2> (so it is reachable
  and operable by keyboard) with aria-expanded / aria-controls, and the
  answer is a labelled region. Visual Redesign, FAQ "Accordion",
  Option B (A-030). Before, the question was a plain <div> that only
  responded to a mouse click.
  ================================================================
*/

// Unique ids across every list rendered on a page (the homepage and the FAQ page
// each call renderFaqList once, but a counter keeps this safe if that changes).
var faqUid = 0;

function renderFaqList(items) {
  return items.map(function (item) {
    var n = ++faqUid;
    var qid = 'faq-q-' + n;
    var aid = 'faq-a-' + n;
    return (
      '<div class="faq-item">' +
        '<h2 class="faq-heading">' +
          '<button type="button" class="faq-question" id="' + qid + '" aria-expanded="false" aria-controls="' + aid + '">' +
            '<span class="faq-q-text">' + item.question + '</span>' +
            '<span class="faq-icon" aria-hidden="true">+</span>' +
          '</button>' +
        '</h2>' +
        '<div class="faq-answer" id="' + aid + '" role="region" aria-labelledby="' + qid + '">' +
          '<div class="faq-answer-inner">' +
            '<p>' + item.answer + '</p>' +
            (item.answerExtra ? '<p style="margin-top:0.75rem;">' + item.answerExtra + '</p>' : '') +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}
