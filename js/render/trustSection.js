/*
  ================================================================
  js/render/trustSection.js — Shared Trust Content
  ================================================================
  The "Why North Bridge PCs" cards and "Testing & Setup Process" steps
  appear on both the homepage and every build detail page. The old site
  had this copy-pasted verbatim in both places — this is the single
  source of truth now. Each page keeps its own surrounding section
  markup/heading (they're laid out slightly differently), but the actual
  card/step content comes from here.
  ================================================================
*/

function renderTrustCards() {
  return (
    '<div class="grid-3">' +
      '<div class="card">' +
        '<div class="card-icon">&#128269;</div>' +
        '<h3>Tested Before It Leaves</h3>' +
        '<p>Every system gets cleaned, stress tested under load, and temperatures checked ' +
        'before it goes anywhere. You\'re not getting a gamble — you\'re getting a machine ' +
        'that\'s been run through its paces.</p>' +
      '</div>' +
      '<div class="card">' +
        '<div class="card-icon">&#128203;</div>' +
        '<h3>Honest Specs, Realistic Numbers</h3>' +
        '<p>The specs listed are accurate. The performance estimates are based on real-world ' +
        'expectations for that hardware — not cherry-picked benchmark runs. If a system has ' +
        'a limitation, I\'ll tell you.</p>' +
      '</div>' +
      '<div class="card">' +
        '<div class="card-icon">&#128205;</div>' +
        '<h3>Local Pickup, Real Support</h3>' +
        '<p>Based in Southern Oregon. Pickup is in person. If you hit a snag after getting ' +
        'it home, reach out over email and I\'ll do my best to help. Not a ticket queue — ' +
        'an actual person.</p>' +
      '</div>' +
    '</div>'
  );
}

function renderProcessSteps() {
  var steps = [
    ['&#129535;', 'Cleaned', 'Dust removed, thermal paste refreshed where needed. Clean inside and out.'],
    ['&#9889;', 'Stress Tested', 'CPU and GPU pushed under sustained load to check for stability issues.'],
    ['&#127777;&#65039;', 'Temps Checked', 'Thermals verified under load. Nothing runs hot, no surprises after pickup.'],
    ['&#128190;', 'Drivers Updated', 'GPU and system drivers current before handoff. Ready to game the same day.'],
    ['&#9989;', 'Ready to Use', 'Plugged in and confirmed working on pickup. A finished computer, not a box of parts.']
  ];

  return (
    '<div class="process-steps">' +
      steps.map(function (s, i) {
        return (
          '<div class="process-step">' +
            '<div class="step-num">' + (i + 1) + '</div>' +
            '<div class="step-icon">' + s[0] + '</div>' +
            '<h4>' + s[1] + '</h4>' +
            '<p>' + s[2] + '</p>' +
          '</div>'
        );
      }).join('') +
    '</div>'
  );
}
