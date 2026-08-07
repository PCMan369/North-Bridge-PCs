/*
  ================================================================
  js/event.js — Sitewide Event / Sale Configuration
  ================================================================

  HOW TO USE FOR ANY EVENT (Back to School, Christmas, etc.):

  1. Set active: true
  2. Set name: "Your Event Name"
  3. Set ends: new Date("YYYY-MM-DD") — midnight on the end date
  4. Set banner to your message
  5. Add eventPrice to any builds in builds.js you want on sale
  6. Save and deploy

  TO END EARLY:
  Set active: false — everything reverts immediately.

  AFTER THE EVENT:
  The date check handles it automatically. You don't need to
  change anything — eventPrice fields in builds.js are ignored
  once the event is over.

  ================================================================
*/

const EVENT = {
  active:  true,
  name:    "Back to School",
  ends:    new Date("2026-09-01T00:00:00"),
  banner:  "Back to School deals — priced to move. Ends August 31st."
};

// ================================================================
// DO NOT EDIT BELOW THIS LINE
// ================================================================

// Is the event currently running?
function eventIsLive() {
  return EVENT.active && new Date() < EVENT.ends;
}

// Days remaining (rounded down)
function eventDaysLeft() {
  const ms   = EVENT.ends - new Date();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

// Render the sitewide banner into the page
function renderEventBanner() {
  if (!eventIsLive()) return;

  const days  = eventDaysLeft();
  const label = days === 1 ? "1 day left" : `${days} days left`;

  const banner = document.createElement('div');
  banner.id    = 'event-banner';
  banner.innerHTML = `
    <div class="event-banner-inner">
      <span class="event-banner-dot"></span>
      <span class="event-banner-name">${EVENT.name}</span>
      <span class="event-banner-sep">—</span>
      <span class="event-banner-msg">${EVENT.banner}</span>
      <span class="event-banner-countdown">${label}</span>
    </div>
  `;

  // Insert before everything else in the body
  document.body.insertBefore(banner, document.body.firstChild);
}

// Call on every page
document.addEventListener('DOMContentLoaded', renderEventBanner);
