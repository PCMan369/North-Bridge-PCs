#!/usr/bin/env node
/*
  build-tools/test-render.js — checks that listing text from the admin forms
  can't break the pages, and that draft/hidden listings have no public page.

      npm install jsdom --no-save     (once)
      node build-tools/test-render.js

  Loads the real data and renderers in a simulated browser (jsdom), so it
  needs no network and changes no files. Exit code 0 = all passed.
*/

const fs = require('fs');
const path = require('path');
let JSDOM;
try { ({ JSDOM } = require('jsdom')); }
catch (e) { console.error('jsdom is not installed. Run: npm install jsdom --no-save'); process.exit(1); }

const JS = path.join(__dirname, '..', 'js');
const FILES = ['data/config.js', 'data/events.js', 'data/builds.js', 'data/gallery.js',
               'render/escape.js', 'render/buildCard.js', 'render/galleryGrid.js', 'render/trustSection.js', 'render/buildDetail.js'];

let failed = 0, total = 0;
function check(name, ok, detail) {
  total++;
  if (!ok) failed++;
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (!ok && detail ? '  -> ' + detail : ''));
}

function page(url, body) {
  const dom = new JSDOM('<!doctype html><html><head><meta name="description" content=""></head><body>' + body + '</body></html>',
                        { url: url, runScripts: 'dangerously' });
  const w = dom.window;
  FILES.forEach(function (f) {
    const el = w.document.createElement('script');
    el.textContent = fs.readFileSync(path.join(JS, f), 'utf8');
    w.document.body.appendChild(el);
  });
  return w;
}

const HOSTILE = '27" <b>Bold</b> & \'Quote\' <img src=x onerror=alert(1)>';

// 1. every real listing renders on the card and the detail page
const probe = page('https://x.test/builds.html', '');
const real = probe.eval('JSON.stringify(builds)');
const listings = JSON.parse(real);
check('there is at least one public listing in builds.js', listings.length > 0);
listings.forEach(function (b) {
  const w = page('https://x.test/builds.html', '');
  const card = w.eval('renderBuildCard(builds.find(function(x){return x.id==="' + b.id + '"}))');
  check('card renders for ' + b.id, card.length > 100 && card.indexOf('undefined') === -1, card.slice(0, 80));
  const d = page('https://x.test/build.html?id=' + b.id, '<div id="build-content"></div>');
  d.eval('initBuildDetailPage()');
  const h1 = d.document.querySelector('.listing-title');
  check('detail page renders for ' + b.id, !!h1 && h1.textContent === b.title, h1 && h1.textContent);
  check('detail page for ' + b.id + ' has no "undefined"', d.document.getElementById('build-content').innerHTML.indexOf('undefined') === -1);
});

// 2. hostile text is shown as text, never as markup
const hostile = {
  id: 'zzz99-01', title: HOSTILE, status: 'available', price: '$1', eventId: null, eventPrice: null,
  summary: HOSTILE,
  components: { cpu: { model: HOSTILE }, gpu: { model: HOSTILE }, ram: { model: HOSTILE }, storage: { model: HOSTILE } },
  performance: { isEstimate: true, items: [{ game: HOSTILE, fps: HOSTILE, settings: HOSTILE }] },
  media: { images: ['images/a"b.jpg', 'images/c.jpg'], videos: [] },
  condition: HOSTILE, testingNotes: HOSTILE, notes: HOSTILE, listedDate: '2026-01-01'
};
const cw = page('https://x.test/builds.html', '<div id="host"></div>');
cw.eval('builds.push(' + JSON.stringify(hostile) + ')');
cw.document.getElementById('host').innerHTML = cw.eval('renderBuildCard(builds[builds.length-1])');
const card = cw.document.getElementById('host');
check('card: title is plain text', card.querySelector('.build-title').textContent === HOSTILE);
check('card: no injected elements', !card.querySelector('b') && card.querySelectorAll('img').length === 1 && !card.querySelector('[onerror*="alert"]'));
check('card: photo alt equals the title', card.querySelector('img').getAttribute('alt') === HOSTILE);
check('card: photo path with a quote stays inside its attribute', card.querySelector('img').getAttribute('src') === 'images/a"b.jpg');
check('card: spec and performance text are plain', !card.querySelector('.build-specs b') && !card.querySelector('.build-perf b'));

const dw = page('https://x.test/build.html?id=zzz99-01', '<div id="build-content"></div>');
dw.eval('builds.push(' + JSON.stringify(hostile) + ')');
dw.eval('initBuildDetailPage()');
const dd = dw.document;
check('detail: title is plain text', dd.querySelector('.listing-title').textContent === HOSTILE);
check('detail: no injected elements', !dd.querySelector('#build-content b') && !dd.querySelector('#build-content [onerror*="alert"]'));
check('detail: hidden form fields hold the exact text',
      dd.querySelector('input[name="system"]').value === HOSTILE &&
      dd.querySelector('input[name="_subject"]').value === 'Inquiry: ' + HOSTILE + ' \u2014 North Bridge PCs');
check('detail: "Good to Know" notes are plain text', dd.querySelectorAll('.listing-specs-card p').length > 0 &&
      Array.from(dd.querySelectorAll('.listing-specs-card p')).every(function (p) { return p.textContent === HOSTILE; }));

// 3. drafts and hidden listings have no public page, even if one slipped into the data
['draft', 'hidden'].forEach(function (status) {
  const w = page('https://x.test/build.html?id=zzz99-01', '<div id="build-content"></div>');
  w.eval('builds.push(Object.assign(' + JSON.stringify(hostile) + ', {status: "' + status + '", title: "SECRET-TITLE"}))');
  w.eval('initBuildDetailPage()');
  const html = w.document.getElementById('build-content').innerHTML;
  check(status + ' listing shows "not found", not its contents', html.indexOf('System Not Found') !== -1 && html.indexOf('SECRET-TITLE') === -1);
});

// 4. gallery grid escapes photo descriptions
const gw = page('https://x.test/gallery.html', '<div id="g"></div>');
gw.eval('renderGalleryGrid([{src: "images/a.jpg", alt: ' + JSON.stringify(HOSTILE) + '}], "g")');
const g = gw.document.getElementById('g');
check('gallery: description is plain text and attribute-safe',
      g.querySelector('img').getAttribute('alt') === HOSTILE && !g.querySelector('b') && !g.querySelector('[onerror*="alert"]:not(img)'));

console.log('\n' + total + ' checks, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
