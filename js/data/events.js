/*
  ================================================================
  js/data/events.js — GENERATED FILE. DO NOT EDIT BY HAND.
  ================================================================
  Written by build-tools/content.py from content/events.json (edited
  through the admin form "Sale banners"). Any change made here is
  overwritten the next time the site is built.

  Each sale has a first and last day (the last day is included). Only
  one sale shows at a time; if two overlap, the first in the list wins.
  A sale's price on a PC comes from that listing's "Sale event" and
  "Sale price" fields. The functions below the line are fixed.
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
