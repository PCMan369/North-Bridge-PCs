/*
  ================================================================
  js/render/partBoxCard.js — Part Box Card + Quantity Picker
  ================================================================
  Renders one box type as a card with a quantity picker. Used on
  part-boxes.html. This file only renders the cards — selection state
  and the order summary are handled by js/render/partBoxOrder.js.
  ================================================================
*/

function renderPartBoxCard(box) {
  var label = box.brand + ' ' + box.model;

  var image = box.media && box.media.images && box.media.images[0];
  var imageHtml = image
    ? '<img src="' + image + '" alt="' + label + '" loading="lazy" ' +
      'onload="this.classList.add(\'loaded\')" ' +
      'onerror="this.parentElement.innerHTML=\'<div class=box-img-placeholder><svg width=&quot;1em&quot; height=&quot;1em&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;1.5&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;><path d=&quot;M12 3 20 7.5v9L12 21 4 16.5v-9Z&quot;/><path d=&quot;M12 3v9m0 0-8-4.5M12 12l8-4.5&quot;/></svg></div>\'">'
    : '<div class="box-img-placeholder"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 20 7.5v9L12 21 4 16.5v-9Z"/><path d="M12 3v9m0 0-8-4.5M12 12l8-4.5"/></svg></div>';

  var categoryHtml = box.category
    ? '<span class="box-category">' + box.category + '</span>'
    : '';

  var conditionHtml = box.condition
    ? '<p class="box-condition">' + box.condition + '</p>'
    : '';

  return (
    '<div class="box-card" data-id="' + box.id + '" data-price="' + box.price + '" data-label="' + label + '">' +
      '<div class="box-image">' + imageHtml + '</div>' +
      '<div class="box-body">' +
        categoryHtml +
        '<div class="box-title">' + label + '</div>' +
        conditionHtml +
        '<div class="box-footer">' +
          '<div class="box-price-wrap">' +
            '<div class="box-price">' + box.price + '</div>' +
            '<div class="box-stock">' + box.quantity + ' available</div>' +
          '</div>' +
          '<div class="qty-picker">' +
            '<button type="button" class="qty-btn qty-minus" aria-label="Decrease quantity">&minus;</button>' +
            '<input type="number" class="qty-input" value="0" min="0" max="' + box.quantity + '" ' +
              'aria-label="Quantity for ' + label + '">' +
            '<button type="button" class="qty-btn qty-plus" aria-label="Increase quantity">+</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

function renderEmptyPartBoxesState() {
  return (
    '<div class="empty-state">' +
      '<span class="empty-icon"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 20 7.5v9L12 21 4 16.5v-9Z"/><path d="M12 3v9m0 0-8-4.5M12 12l8-4.5"/></svg></span>' +
      '<h2>No Part Boxes Available Right Now</h2>' +
      '<p>Nothing listed at the moment — check back later, or reach out directly if you\'re looking for something specific.</p>' +
      '<a href="contact.html" class="btn btn-primary" style="margin-top:1.5rem;">Contact Me &rarr;</a>' +
    '</div>'
  );
}
