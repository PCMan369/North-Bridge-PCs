/*
  ================================================================
  js/render/notifyBox.js — "Get Notified" Waitlist
  ================================================================
  Shown on builds.html whenever there are zero available systems.
  This is a real, already-proven feature from the old site — carried
  forward with the same behavior, just reading the contact email from
  config.js instead of having it hardcoded in this file.

  Requires: js/data/config.js loaded first (for CONTACT.email).
  ================================================================
*/

function renderNotifyBox() {
  return (
    '<div class="notify-box" id="notify-box">' +
      '<div class="notify-copy">' +
        '<span class="section-label" style="display:block; margin-bottom:0.75rem;">Nothing Listed Right Now</span>' +
        '<h3>Get Notified When Something Comes In</h3>' +
        '<p>Leave your email and a note about what you\'re looking for. ' +
        'When I have something that fits, I\'ll reach out directly. ' +
        'No spam, no mailing list — just a one-time heads up.</p>' +
        '<p style="margin-top:1rem; font-size:0.88rem;">' +
          'In the meantime, <a href="custom-build.html">custom builds</a> are always available ' +
          'if you have something specific in mind.' +
        '</p>' +
      '</div>' +
      '<div class="notify-form-wrap">' +
        '<div class="form-group">' +
          '<label class="form-label" for="notify-email">Your Email</label>' +
          '<input type="email" id="notify-email" class="form-input" ' +
            'placeholder="So I can reach out when something comes in">' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label" for="notify-looking">' +
            'What are you looking for? <span class="optional">(optional)</span>' +
          '</label>' +
          '<textarea id="notify-looking" class="form-textarea" style="min-height:90px;" ' +
            'placeholder="Budget, games you play, anything specific — or just leave it blank"></textarea>' +
        '</div>' +
        '<div class="form-privacy">' +
          '<p><strong>Privacy:</strong> Your email is only used to notify you about ' +
          'new listings. It won\'t be shared or used for anything else.</p>' +
        '</div>' +
        '<button class="btn btn-primary btn-lg" style="width:100%; justify-content:center;" id="notify-submit">' +
          'Notify Me &rarr;' +
        '</button>' +
        '<p id="notify-error" style="color:var(--danger); font-size:0.85rem; display:none; text-align:center;">' +
          'Something went wrong — try again or <a href="contact.html">send a message instead</a>.' +
        '</p>' +
      '</div>' +
    '</div>'
  );
}

function wireNotifyBox() {
  var submitBtn = document.getElementById('notify-submit');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', function () {
    var email = document.getElementById('notify-email').value.trim();
    var looking = document.getElementById('notify-looking').value.trim();
    var errEl = document.getElementById('notify-error');

    errEl.style.display = 'none';

    if (!email || !email.includes('@')) {
      errEl.textContent = 'Please enter a valid email address.';
      errEl.style.display = 'block';
      return;
    }

    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    var endpoint = 'https://formsubmit.co/ajax/' + CONTACT.email;

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: 'Notify me request — North Bridge PCs',
        email: email,
        looking_for: looking || 'Not specified'
      })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success === 'true' || data.success === true) {
          document.getElementById('notify-box').outerHTML =
            '<div class="notify-success">' +
              '<span class="success-icon">&#9989;</span>' +
              '<h3>You\'re on the list</h3>' +
              '<p>I\'ll reach out when something comes in that might be a good fit. ' +
              'In the meantime, feel free to <a href="contact.html">send a message</a> ' +
              'if you have questions.</p>' +
            '</div>';
        } else {
          throw new Error('Submission failed');
        }
      })
      .catch(function () {
        submitBtn.textContent = 'Notify Me \u2192';
        submitBtn.disabled = false;
        errEl.textContent = 'Something went wrong — try again or send a message instead.';
        errEl.style.display = 'block';
      });
  });
}
