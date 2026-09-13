/*
  ================================================================
  js/render/serviceCard.js — Service Card Renderers
  ================================================================
  Two card styles for services.html:
    - Hub cards (pc-sales, custom-builds) — short blurb + a link to
      their own dedicated page.
    - Detail cards (repair, upgrades, cleaning, support) — full
      content lives right here since these don't have their own pages.
      The included list and the "Worth knowing" caveat note each only
      render if that field is actually filled in. General pricing/
      turnaround policy lives once, in services.html's
      `.service-policy` paragraph — not repeated per card here.
  ================================================================
*/

function renderServiceHubCard(svc) {
  return (
    '<div class="service-hub-card">' +
      '<h3>' + svc.name + '</h3>' +
      '<p>' + svc.shortDescription + '</p>' +
      '<a href="' + svc.linksToPage + '" class="btn btn-secondary">Learn More &rarr;</a>' +
    '</div>'
  );
}

function renderServiceDetailCard(svc) {
  var includedHtml = (svc.included && svc.included.length)
    ? '<ul class="service-included">' +
        svc.included.map(function (item) { return '<li>' + item + '</li>'; }).join('') +
      '</ul>'
    : '';

  var notes = svc.notCovered
    ? '<div class="service-note service-caveat"><strong>Worth knowing:</strong> ' + svc.notCovered + '</div>'
    : '';

  return (
    '<div class="service-detail-card" id="' + svc.id + '">' +
      '<h3>' + svc.name + '</h3>' +
      (svc.shortDescription ? '<p class="service-lead">' + svc.shortDescription + '</p>' : '') +
      includedHtml +
      notes +
      '<button type="button" class="btn btn-secondary service-request-btn" ' +
        'data-service-name="' + svc.name + '" style="width:100%; justify-content:center; margin-top:1.25rem;">' +
        'Request This Service &rarr;' +
      '</button>' +
    '</div>'
  );
}
