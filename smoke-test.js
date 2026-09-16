// Redesign Batch 2 — smoke test harness.
//
// Loads each built root-level page in jsdom, executes its real scripts
// (same files the browser would load), waits for onload, then checks for
// (a) any console/script errors and (b) a handful of page-specific DOM
// assertions confirming the real render pipeline still produces the
// expected structure post-redesign.
//
// Honest scope note: this is DOM/structural verification only, not visual
// regression testing. Playwright's browser binary could not be downloaded
// in this sandbox (its CDN isn't in the network allowlist here — confirmed
// by testing `npx playwright install chromium`, which fails cleanly on the
// download step). No screenshots were taken this session; see CHANGELOG.md.

const { JSDOM } = require('jsdom');
const path = require('path');

const pages = [
  {
    file: 'index.html',
    check: (doc, errors) => {
      const hero = doc.querySelector('.hero, .hero-copy');
      assert(hero, 'homepage hero renders');
      const evidence = doc.querySelector('.evidence');
      assert(evidence, 'homepage evidence section renders');
      assert(!doc.body.classList.contains('theme-forge'), 'theme-forge class removed from body');
    },
  },
  {
    file: 'about.html',
    check: (doc) => {
      assert(doc.querySelector('.lede'), 'about.html lede paragraph renders');
    },
  },
  {
    file: 'builds.html',
    check: (doc) => {
      assert(doc.querySelector('#featured-builds, .builds-grid'), 'builds grid container renders');
    },
  },
  {
    file: 'build.html?id=may26-01',
    check: (doc) => {
      assert(doc.querySelector('.listing-title'), 'build detail page renders a real listing');
      const evidence = doc.querySelector('.trust-section .evidence');
      assert(evidence, 'build.html evidence section renders');
      assert(doc.querySelectorAll('.evidence-row').length === 5, 'build.html evidence has 5 rows');
      assert(!doc.querySelector('.trust-section .card'), 'old trust-card markup is gone from build.html');
      assert(!doc.querySelector('.trust-section .process-steps'), 'old process-steps markup is gone from build.html');
    },
  },
  {
    file: 'custom-build.html',
    check: (doc) => {
      const rows = doc.querySelectorAll('.cb-list .cb-row');
      assert(rows.length === 6, `custom-build.html has 6 cb-row steps (found ${rows.length})`);
      assert(!doc.querySelector('.process-list'), 'old .process-list markup is gone');
      const tiers = doc.querySelectorAll('.tier-card');
      assert(tiers.length === 3, `custom-build.html has 3 tier cards (found ${tiers.length})`);
    },
  },
  {
    file: 'contact.html',
    check: (doc) => {
      const rows = doc.querySelectorAll('.contact-info .cb-list .cb-row');
      assert(rows.length === 4, `contact.html has 4 cb-row info items (found ${rows.length})`);
      assert(!doc.querySelector('.contact-info-card'), 'old .contact-info-card markup is gone');
      assert(!doc.querySelector('#contact-form'), 'old single #contact-form is gone');
      const options = doc.querySelectorAll('#situation-picker .service-hub-card');
      assert(options.length === 6, `situation picker has 6 options (found ${options.length})`);
      const panels = doc.querySelectorAll('.situation-form-panel');
      assert(panels.length === 3, `contact.html has 3 situation form panels (found ${panels.length})`);
      assert(doc.querySelector('#situation-buying form[action]'), 'buying panel form renders with an action');
      assert(doc.querySelector('#situation-custom form[action]'), 'custom-PC panel form renders with an action');
      assert(doc.querySelector('#situation-general form[action]'), 'general/other panel form renders with an action');
    },
  },
  {
    file: 'services.html',
    check: (doc) => {
      assert(doc.querySelector('#service-hub-cards, .service-hub-card, main'), 'services page renders');
    },
  },
  {
    file: 'faq.html',
    check: (doc) => {
      assert(doc.querySelector('#faq-list, main'), 'faq page renders');
    },
  },
  {
    file: 'gallery.html',
    check: (doc) => {
      assert(doc.querySelector('main'), 'gallery page renders');
    },
  },
  {
    file: 'part-boxes.html',
    check: (doc) => {
      assert(doc.querySelector('main'), 'part-boxes page renders');
    },
  },
  {
    file: '404.html',
    check: (doc) => {
      assert(doc.querySelector('.empty-state'), '404 page renders its empty-state card');
      assert(doc.querySelector('meta[name="robots"][content*="noindex"]'), '404 page has a noindex tag');
      assert(!doc.querySelector('.nav-link.active'), '404 page highlights no nav item as active');
    },
  },
];

let failures = 0;
function assert(cond, msg) {
  if (!cond) {
    console.log('  FAIL: ' + msg);
    failures++;
  } else {
    console.log('  ok:   ' + msg);
  }
}

async function run() {
  for (const page of pages) {
    console.log('\n=== ' + page.file + ' ===');
    const [fileName, queryString] = page.file.split('?');
    const filePath = path.resolve(__dirname, fileName);
    const url = 'file://' + filePath + (queryString ? '?' + queryString : '');
    const consoleErrors = [];
    let dom;
    try {
      dom = await JSDOM.fromFile(filePath, {
        url,
        runScripts: 'dangerously',
        resources: 'usable',
        pretendToBeVisual: true,
        virtualConsole: (() => {
          const { VirtualConsole } = require('jsdom');
          const vc = new VirtualConsole();
          vc.on('jsdomError', (e) => consoleErrors.push(e.message));
          vc.on('error', (e) => consoleErrors.push(String(e)));
          return vc;
        })(),
      });
    } catch (e) {
      console.log('  FAIL: page threw during load: ' + e.message);
      failures++;
      continue;
    }

    // Give any deferred/onload script logic a tick to run.
    await new Promise((r) => setTimeout(r, 300));

    // Excludes known jsdom-sandbox noise: images/stylesheets/fonts that
    // can't load without real network access, and external (https://)
    // scripts specifically — e.g. Google Analytics' gtag.js, added
    // sitewide via the ANALYTICS partial — which this offline test
    // environment can't reach either. A typo in one of our own local
    // script paths (no https://) would still be caught.
    const relevantErrors = consoleErrors.filter(
      (e) => !/Could not load img|Could not load link|Could not load script: "https?:\/\/|Not implemented: window.scrollTo|fetch|Not implemented: HTMLFormElement.prototype.requestSubmit/i.test(e)
    );
    if (relevantErrors.length) {
      relevantErrors.forEach((e) => {
        console.log('  FAIL: script error: ' + e);
        failures++;
      });
    } else {
      console.log('  ok:   no script errors');
    }

    try {
      page.check(dom.window.document, consoleErrors);
    } catch (e) {
      console.log('  FAIL: check threw: ' + e.message);
      failures++;
    }
    dom.window.close();
  }

  console.log('\n' + (failures === 0 ? 'ALL CHECKS PASSED' : failures + ' CHECK(S) FAILED'));
  process.exit(failures === 0 ? 0 : 1);
}

run();
