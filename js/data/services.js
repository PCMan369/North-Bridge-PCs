/*
  ================================================================
  js/data/services.js — Services List
  ================================================================

  Controls the Services page. Two of these (PC Sales, Custom Builds)
  already have full dedicated pages elsewhere on the site — they show
  up here as short cards that link out. The other four don't have
  their own pages, so their content lives directly on the Services page.

  IMPORTANT: `shortDescription` fields below are intentionally left
  blank. Claude has not written any public-facing service descriptions,
  pricing, or policy language — that has to come from you (the business
  owner), not be invented. A service with `show: false` and a blank
  description is safe (it won't appear on the site) — flip `show` to
  true once you've filled in real copy.

  ================================================================
  HOW TO ADD/REMOVE/REORDER A SERVICE
  ================================================================
  Same pattern as builds.js — cut/paste/reorder entries in the array,
  toggle `show` per entry, no HTML editing required.
  ================================================================
*/

const services = [

  {
    id: "pc-sales",
    name: "Gaming PC Sales",
    shortDescription: "Ready-to-buy systems, cleaned and stress tested before pickup.",
    linksToPage: "builds.html",
    show: true
  },

  {
    id: "custom-builds",
    name: "Custom PC Builds",
    shortDescription: "A system built around your budget and the games you play.",
    linksToPage: "custom-build.html",
    show: true
  },

  {
    id: "repair-diagnostics",
    name: "PC Repair & Diagnostics",
    shortDescription: "", // TODO: owner-provided — what's covered, turnaround, etc.
    linksToPage: null,
    show: false // flip to true once shortDescription above is filled in
  },

  {
    id: "upgrades",
    name: "Upgrades",
    shortDescription: "", // TODO: owner-provided
    linksToPage: null,
    show: false
  },

  {
    id: "cleaning-maintenance",
    name: "PC Cleaning & Maintenance",
    shortDescription: "", // TODO: owner-provided
    linksToPage: null,
    show: false
  },

  {
    id: "support",
    name: "Tech Support for Purchased Systems",
    shortDescription: "", // TODO: owner-provided — this may already be
                           // partially covered by the FAQ's "what kind of
                           // support" answer; worth reusing/adapting rather
                           // than writing from scratch
    linksToPage: null,
    show: false
  }

];
