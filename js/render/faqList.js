/*
  ================================================================
  js/render/faqList.js — FAQ List Renderer
  ================================================================
  Turns an array of items from js/data/faq.js into the accordion
  markup. Click behavior itself lives in js/render/faqAccordion.js
  (already scoped per .faq-list, so it works on whichever container
  this renders into without changes).
  ================================================================
*/

function renderFaqList(items) {
  return items.map(function (item) {
    return (
      '<div class="faq-item">' +
        '<div class="faq-question">' +
          '<h2>' + item.question + '</h2>' +
          '<div class="faq-icon">+</div>' +
        '</div>' +
        '<div class="faq-answer">' +
          '<div class="faq-answer-inner">' +
            '<p>' + item.answer + '</p>' +
            (item.answerExtra ? '<p style="margin-top:0.75rem;">' + item.answerExtra + '</p>' : '') +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}
