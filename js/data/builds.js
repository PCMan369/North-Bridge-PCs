/*
  ================================================================
  js/data/builds.js — North Bridge PCs PC Inventory
  ================================================================

  This file controls every PC listing on the site: the cards on the
  "Gaming PCs" page, the homepage preview, and each build's full detail
  page. You should not need to edit any HTML file to manage inventory.

  ================================================================
  WHAT CHANGED FROM THE OLD SITE
  ================================================================
  The old inventory stored one combined "title" string like
  "Ryzen 5 3600 / RTX 2070 Super" with no separate CPU/GPU/etc fields.

  This version breaks components out individually (cpu, gpu, motherboard,
  ram, storage, psu, case, cooler, os, networking, accessories). Every
  component field is OPTIONAL — if you leave one out entirely, it just
  won't appear on the listing. You don't have to fill in fields you don't
  have good info for.

  `title` still exists — it's the short name shown on cards (e.g. "Ryzen 5
  3600 / RTX 2070 Super"). Fill it in the same way you always have; the
  detailed component fields are additional, not a replacement.

  ================================================================
  HOW TO ADD A NEW PC
  ================================================================
  Copy the EXAMPLE block below (from the opening { to the closing },),
  paste it at the TOP of the `builds` array (right after the opening [),
  and fill in what applies. Delete any component field you don't want to
  show — don't leave it blank, just remove the whole line.

  {
    id: "aug26-01",                 // month + year + sequence number.
                                     // Prevents two PCs listed in the same
                                     // month from colliding. Never reuse
                                     // an id, even after a PC is sold —
                                     // its URL (build.html?id=aug26-01)
                                     // may already be shared/bookmarked.
    title: "Ryzen 5 5600 / RTX 3060",
    status: "available",            // "available" | "sold" | "hidden"
    price: "$699",
    eventId: null,                  // set to an id from events.js if this
                                     // build is part of an active promo
    eventPrice: null,               // the sale price while that event is
                                     // live, e.g. "$629" — ignored if
                                     // eventId is null or that event isn't
                                     // currently active

    summary: "Solid 1080p/1440p gaming build, cleaned and stress tested.",

    components: {
      cpu:         { model: "AMD Ryzen 5 5600" },
      gpu:         { model: "RTX 3060 12GB" },
      motherboard: { model: "" },   // fine to leave blank/omit
      ram:         { model: "16GB DDR4 3200MHz" },
      storage:     { model: "512GB NVMe SSD" },
      psu:         { model: "" },
      case:        { model: "" },
      cooler:      { model: "" },
      os:          { model: "Windows 11" },
      networking:  { model: "" },
      accessories: []                // e.g. ["Keyboard", "Mouse"]
    },

    // Performance estimates. Keep these realistic — see the old site's
    // FAQ answers for the tone/precision level that's worked so far.
    performance: {
      isEstimate: true,               // always true unless these are real
                                       // benchmark numbers you personally ran
      items: [
        { game: "Fortnite",        fps: "~120fps", settings: "1080p High" },
        { game: "Cyberpunk 2077",  fps: "~65fps",  settings: "1080p High" }
      ]
    },

    media: {
      images: [
        "images/aug26-01-main.jpg",
        "images/aug26-01-side.jpg"
      ],
      videos: []                       // optional short clips, same shape
                                        // as images: ["images/clip.mp4"]
    },

    condition: "",                     // optional cosmetic/condition notes
    testingNotes: "",                  // optional — beyond the standard
                                        // cleaned/stress-tested/temps-checked
                                        // process already described sitewide
    listedDate: "2026-08-01",
    notes: ""                          // optional, anything else worth
                                        // knowing that doesn't fit elsewhere
  },

  ================================================================
  HOW TO MARK A PC AS SOLD
  ================================================================
  Change:   status: "available"
  To:       status: "sold"
  The system moves it from "Available" to "Sold" automatically.

  ================================================================
  HOW TO HIDE A PC WITHOUT DELETING IT
  ================================================================
  Change status to "hidden". It won't appear anywhere on the site but
  stays in this file (useful for a listing you're not ready to publish
  yet, or temporarily pulling something).

  ================================================================
*/

const builds = [

  {
    id: "jul26-01",
    title: "Ryzen 5 3600 / RTX 2070 Super",
    status: "sold",
    price: "$625",
    eventId: null,
    eventPrice: null,

    summary: "Cleaned and stress tested 1080p/1440p gaming build.",

    components: {
      cpu: { model: "Ryzen 5 3600" },
      gpu: { model: "RTX 2070 Super" },
      ram: { model: "16GB DDR4 2800MHz" },
      storage: { model: "512GB NVMe SSD" }
    },

    performance: {
      isEstimate: true,
      items: [
        { game: "Fortnite",       fps: "~120fps", settings: "1080p High" },
        { game: "Minecraft",      fps: "~220fps+", settings: "1080p High" },
        { game: "Marvel Rivals",  fps: "~90fps",  settings: "1080p High" },
        { game: "Cyberpunk 2077", fps: "~65fps",  settings: "1080p High" }
      ]
    },

    media: {
      images: [
        "images/3600_2070S.jpg",
        "images/3600_2070S_Front.jpg",
        "images/3600_2070S_Side.jpg",
        "images/3600_2070S_IO.jpg",
        "images/3600_2070S_Back.jpg"
      ],
      videos: []
    },

    condition: "",
    testingNotes: "",
    listedDate: "2026-07-01",
    notes: ""
  },

  {
    id: "jun26-01",
    title: "Ryzen 5 3600 / RTX 2060",
    status: "sold",
    price: "$549",
    eventId: null,
    eventPrice: null,

    summary: "Cleaned and stress tested 1080p gaming build.",

    components: {
      cpu: { model: "Ryzen 5 3600" },
      gpu: { model: "RTX 2060" },
      ram: { model: "16GB DDR4 2666MHz" },
      storage: { model: "480GB SSD" }
    },

    performance: {
      isEstimate: true,
      items: [
        { game: "Fortnite",       fps: "~100fps", settings: "1080p High" },
        { game: "Minecraft",      fps: "~180fps+", settings: "1080p High" },
        { game: "Marvel Rivals",  fps: "~75fps",  settings: "1080p High" },
        { game: "Cyberpunk 2077", fps: "~55fps",  settings: "1080p High" }
      ]
    },

    media: {
      images: [
        "images/3600_RTX2060.jpg",
        "images/3600_RTX2060_FRONT.jpg",
        "images/3600_RTX2060_SIDE.jpg",
        "images/3600_RTX2060_IO.jpg",
        "images/3600_RTX2060_BACK.jpg"
      ],
      videos: []
    },

    condition: "",
    testingNotes: "",
    listedDate: "2026-06-01",
    notes: ""
  },

  {
    id: "may26-01",
    title: "Ryzen 5 5500 / RTX 2070 Super",
    status: "sold",
    price: "$649",
    eventId: null,
    eventPrice: null,

    summary: "Cleaned and stress tested 1080p/1440p gaming build.",

    components: {
      cpu: { model: "Ryzen 5 5500" },
      gpu: { model: "RTX 2070 Super" },
      ram: { model: "16GB DDR4 3000MHz" },
      storage: { model: "512GB NVMe SSD" }
    },

    performance: {
      isEstimate: true,
      items: [
        { game: "Fortnite",       fps: "~130fps", settings: "1080p High" },
        { game: "Minecraft",      fps: "~240fps+", settings: "1080p High" },
        { game: "Marvel Rivals",  fps: "~95fps",  settings: "1080p High" },
        { game: "Cyberpunk 2077", fps: "~70fps",  settings: "1080p High" }
      ]
    },

    media: {
      images: [
        "images/may26-01-main.jpg"
      ],
      videos: []
    },

    condition: "",
    testingNotes: "",
    listedDate: "2026-05-01",
    notes: ""
  }

];
