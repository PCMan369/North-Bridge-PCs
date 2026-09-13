/*
  ================================================================
  js/render/chrome.js — Shared Page Chrome
  ================================================================
  Handles behavior that's identical on every page: mobile nav toggle,
  page-load progress bar, back-to-top button, footer year, and the
  toggle-driven phone/email/social links in the footer.

  The old site had a version of this copy-pasted inline into all 8
  HTML files. Load this one file on every page instead.

  Load order matters: js/data/config.js must load before this file.
  ================================================================
*/

(function () {

  // ---- Mobile nav toggle ----
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close the whole drawer when a real destination link is tapped —
    // .nav-sublink included, .mobile-nav-toggle excluded even though it
    // shares the .nav-link class for styling (it only expands/collapses
    // its own submenu, see below — closing the drawer on that click
    // would hide the submenu before you ever saw it).
    mobileNav.querySelectorAll('.nav-link:not(.mobile-nav-toggle), .nav-sublink').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Desktop dropdown ("For Sale") ----
  document.querySelectorAll('.nav-dropdown').forEach(function (dropdown) {
    var trigger = dropdown.querySelector('.nav-dropdown-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = !dropdown.classList.contains('open');

      // Only one dropdown open at a time.
      document.querySelectorAll('.nav-dropdown.open').forEach(function (d) {
        d.classList.remove('open');
        var t = d.querySelector('.nav-dropdown-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });

      if (willOpen) {
        dropdown.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Click anywhere outside a dropdown closes it.
  document.addEventListener('click', function () {
    document.querySelectorAll('.nav-dropdown.open').forEach(function (d) {
      d.classList.remove('open');
      var t = d.querySelector('.nav-dropdown-trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  });

  // Escape closes an open dropdown and returns focus to its trigger.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.nav-dropdown.open').forEach(function (d) {
      d.classList.remove('open');
      var t = d.querySelector('.nav-dropdown-trigger');
      if (t) {
        t.setAttribute('aria-expanded', 'false');
        t.focus();
      }
    });
  });

  // ---- Mobile accordion ("For Sale") ----
  document.querySelectorAll('.mobile-nav-toggle').forEach(function (toggle) {
    var submenu = toggle.nextElementSibling;
    if (!submenu || !submenu.classList.contains('mobile-nav-submenu')) return;

    toggle.addEventListener('click', function () {
      var isOpen = toggle.classList.toggle('open');
      submenu.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });
  });

  // ---- Back-to-top (scroll-linked visibility only) ----
  var backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Page-load progress bar ----
  // Two independent moments, not one continuous animation — a real
  // cross-document navigation tears down this whole page (and this
  // script) before the next one runs, so nothing can literally persist
  // through the gap. This is the same illusion every site with a
  // top-loading-bar uses: fill quickly on arrival, and separately
  // start filling immediately when a link is clicked so the wait
  // feels bridged rather than dead air.
  var loadBar = document.getElementById('load-progress');

  if (loadBar) {
    // Arriving on a page (however you got here — a click on this
    // site, a typed URL, a bookmark, back/forward): quickly finish
    // the bar to 100%, then fade it out and reset for next time.
    requestAnimationFrame(function () {
      loadBar.style.transitionDuration = '0.3s';
      loadBar.style.width = '100%';
    });
    setTimeout(function () {
      loadBar.style.opacity = '0';
    }, 350);
    setTimeout(function () {
      loadBar.style.transitionDuration = '0s';
      loadBar.style.width = '0%';
      loadBar.style.opacity = '1';
    }, 600);

    // Clicking a link that's actually navigating to another page on
    // this site: start filling right away. Deliberately excludes
    // anything that won't cause a real same-page navigation away from
    // here — opening in a new tab, a modified click, same-page anchor
    // links (like the "skip to content" link or FAQ anchors),
    // mailto:/tel: links, file downloads, and external links — since
    // none of those leave this bar stranded half-filled with nothing
    // to ever complete it.
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;
      if (link.target === '_blank') return;
      if (link.hasAttribute('download')) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      var href = link.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#') return;
      if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
      if (link.origin && link.origin !== window.location.origin) return;

      loadBar.style.transitionDuration = '0.6s';
      loadBar.style.opacity = '1';
      loadBar.style.width = '80%';
    });
  }

  // ---- Footer year ----
  var yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ---- Toggle-driven footer contact links ----
  // Renders nothing at all unless a feature is both enabled AND has its
  // required value filled in. If it's enabled but the value is missing,
  // this warns loudly in the console (dev-time signal) rather than
  // silently showing a broken link to a customer.
  var footerExtra = document.getElementById('footer-extra');
  if (footerExtra && typeof features !== 'undefined') {
    var links = [];

    if (features.phone && features.phone.show) {
      if (features.phone.number) {
        var display = features.phone.displayFormat || features.phone.number;
        var telHref = features.phone.number.replace(/[^0-9+]/g, '');
        links.push('<a href="tel:' + telHref + '">' + display + '</a>');
      } else {
        console.warn('config.js: features.phone.show is true but no number is set.');
      }
    }

    if (features.email && features.email.show) {
      if (features.email.address) {
        links.push('<a href="mailto:' + features.email.address + '">' + features.email.address + '</a>');
      } else {
        console.warn('config.js: features.email.show is true but no address is set.');
      }
    }

    if (features.facebook && features.facebook.show) {
      if (features.facebook.url) {
        links.push('<a href="' + features.facebook.url + '" target="_blank" rel="noopener">Facebook</a>');
      } else {
        console.warn('config.js: features.facebook.show is true but no url is set.');
      }
    }

    if (links.length) {
      footerExtra.innerHTML = links.join('');
    }
  }

})();
