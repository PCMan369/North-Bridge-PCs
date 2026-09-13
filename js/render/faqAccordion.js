/*
  ================================================================
  js/render/faqAccordion.js — FAQ Accordion Behavior
  ================================================================
  Click-to-expand behavior for any .faq-list on the page. Scoped per
  list, so this works unmodified on both the homepage FAQ preview and
  the full FAQ page without needing separate scripts.

  Runs on DOMContentLoaded rather than immediately: the FAQ items
  themselves are rendered by an inline script from js/data/faq.js
  (renderFaqList()), and this needs to wire up clicks on content that
  exists by the time the page has finished loading — not whatever
  happened to be in the DOM the instant this file was parsed.
  ================================================================
*/

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.faq-list').forEach(function (list) {
    list.querySelectorAll('.faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        var isOpen = item.classList.contains('open');

        list.querySelectorAll('.faq-item').forEach(function (el) {
          el.classList.remove('open');
        });

        if (!isOpen) {
          item.classList.add('open');
        }
      });
    });
  });
});
