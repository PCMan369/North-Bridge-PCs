/*
  ================================================================
  js/render/faqAccordion.js — FAQ Accordion Behavior
  ================================================================
  Click-to-expand behavior for any .faq-list on the page. Scoped per
  list, so this works unmodified on both the homepage FAQ preview and
  the full FAQ page (Phase 3) without needing separate scripts.
  ================================================================
*/

(function () {
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
})();
