/*
  ================================================================
  js/data/events.js — Sales / Promo Events
  ================================================================

  Replaces the old site's single hardcoded EVENT object. This version
  supports defining multiple events (Back to School, Holiday, Clearance,
  whatever comes up) ahead of time, and controls whether each one shows
  a live countdown.

  Only one event should be active (in its date range) at a time in
  practice — if two overlap, the first match in this array wins. Keep
  it simple; this isn't meant to run parallel sales.

  ================================================================
  WHY A PER-EVENT COUNTDOWN TOGGLE
  ================================================================
  The old site's countdown was always on. That's fine for a real
  fixed-deadline sale, but not every promo needs urgency framing — a
  soft, ongoing clearance sale probably shouldn't have one. Set
  `showCountdown` per event instead of it being a sitewide constant.

  ================================================================
  HOW TO RUN A SALE
  ================================================================
  1. Copy the EXAMPLE block below into the `events` array.
  2. Set `active: true`.
  3. Set real `starts` / `ends` dates.
  4. Write the `banner` message.
  5. Decide `showCountdown` — true for a real hard deadline, false for a
     softer ongoing sale.
  6. On any build in builds.js you want discounted, set that build's
     `eventId` to this event's `id` and set `eventPrice` to the sale price.
  7. Save both files. To end the sale early, set `active: false` — no
     other cleanup needed. `eventPrice` fields left on builds are simply
     ignored once their event isn't active.

  {
    id: "holiday-2026",
    name: "Holiday Sale",
    active: true,
    starts: new Date("2026-12-01T00:00:00"),
    ends:   new Date("2026-12-26T00:00:00"),
    banner: "Holiday sale — priced to move.",
    showCountdown: true
  },

  ================================================================
*/

const events = [

  // No event is currently active.

];

// ================================================================
// DO NOT EDIT BELOW THIS LINE
// ================================================================

function getActiveEvent() {
  const now = new Date();
  return events.find(function (e) {
    return e.active && now >= e.starts && now < e.ends;
  }) || null;
}

function eventDaysLeft(event) {
  const ms = event.ends - new Date();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}
