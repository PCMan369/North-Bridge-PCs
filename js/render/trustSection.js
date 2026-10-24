/*
  ================================================================
  js/render/trustSection.js — Shared Trust Content
  ================================================================
  The "Why North Bridge PCs" content appears on build detail pages.
  This is the single source of truth for that real content — as of
  Redesign Batch 2, presented as one lead statement + a plain
  checklist (the "evidence" pattern), matching what Batch 1 shipped
  on the homepage. Same real facts, same visual language, both places.

  Batch 1 moved the homepage off this shared function entirely (its
  own evidence section is hardcoded directly in pages-src/index.html —
  see the comment there) specifically so this file could be
  redesigned later without any risk to the homepage. build.html is
  now the only caller — see js/render/buildDetail.js.

  Previously exported renderTrustCards() (3 icon+heading+description
  cards) and renderProcessSteps() (5 numbered-circle steps)
  separately; buildDetail.js assembled them under two headings. Both
  are replaced by the single function below — buildDetail.js was
  updated in the same pass, so this is not a breaking change to any
  other caller (grep-confirmed: build.html/buildDetail.js is the only
  consumer of this file).
  ================================================================
*/

function renderTrustEvidence() {
  return (
    '<div class="evidence evidence-compact">' +
      '<div>' +
        '<p class="evidence-lead">Five steps <span class="accent">before it\'s yours.</span></p>' +
        '<p class="evidence-sub">Performance figures are estimates based on real-world expectations for that hardware, not benchmarks I ran. There are no returns, but if you hit a snag after getting it home, email me and I\'ll help you troubleshoot.</p>' +
      '</div>' +
      '<div class="evidence-checklist">' +
        '<div class="evidence-row">' +
          '<span class="mark">01</span>' +
          '<div><h3>Cleaned</h3><p>Dust removed, thermal paste refreshed where needed. Clean inside and out.</p></div>' +
        '</div>' +
        '<div class="evidence-row">' +
          '<span class="mark">02</span>' +
          '<div><h3>Stress tested</h3><p>CPU and GPU pushed under sustained load to check for stability issues.</p></div>' +
        '</div>' +
        '<div class="evidence-row">' +
          '<span class="mark">03</span>' +
          '<div><h3>Temps checked</h3><p>Temperatures checked under load.</p></div>' +
        '</div>' +
        '<div class="evidence-row">' +
          '<span class="mark">04</span>' +
          '<div><h3>Drivers updated</h3><p>GPU and system drivers current before handoff. Ready to game the same day.</p></div>' +
        '</div>' +
        '<div class="evidence-row">' +
          '<span class="mark">05</span>' +
          '<div><h3>Ready to use</h3><p>Confirmed working, then handed over. A finished computer, not a box of parts.</p></div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}
