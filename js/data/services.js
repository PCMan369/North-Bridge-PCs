/*
  ================================================================
  js/data/services.js — Services List
  ================================================================

  Controls the Services page. `pc-sales` and `custom-builds` have full
  dedicated pages elsewhere — they show up here as short cards that
  link out. The other four don't have their own pages, so their full
  content (what's included, how pricing works, turnaround, caveats)
  lives directly on the Services page, pulled from the fields below.

  ================================================================
  HOW TO EDIT SERVICE COPY
  ================================================================
  Same pattern as builds.js — edit the fields below, no HTML editing
  required. `included` is a bullet list. `notCovered` is a sentence or
  two of plain text — the one thing worth knowing that's specific to
  this service (a real limitation or caveat), not a restatement of the
  general pricing/turnaround policy. That policy already lives once,
  in services.html's `.service-policy` paragraph below both card
  grids — it applies to all four of these by default, so don't repeat
  it per service here. If a service genuinely works differently
  (e.g. a flat rate, a fixed turnaround), that's worth adding back as
  its own field — but as of this note, none of them do.

  IMPORTANT: don't add specific prices, guaranteed turnaround times, or
  new promises to these fields without also updating the general
  service policy text in services.html — that copy exists specifically
  to avoid over-promising, per the owner's explicit instructions.
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
    shortDescription: "Diagnosing what's wrong and fixing it when it makes sense to.",
    included: [
      "Hardware and software troubleshooting to find the actual cause of a problem",
      "A clear explanation of what's going on before any repair work starts",
      "Parts and labor accounted for separately when a repair needs new hardware"
    ],
    notCovered: "Diagnosis doesn't always mean a repair is possible or worthwhile. If a fix isn't economically sensible, I'll tell you that instead of doing unnecessary work.",
    linksToPage: null,
    show: true
  },

  {
    id: "upgrades",
    name: "Upgrades",
    shortDescription: "Adding RAM, storage, a new GPU, or other upgrades to a system you already have.",
    included: [
      "Compatibility checked before recommending or installing anything",
      "RAM, storage, GPU, CPU, and other upgrades where it makes sense for your system",
      "Hardware cost and installation accounted for separately",
      "Installation and setup once parts are sourced"
    ],
    notCovered: "I can't guarantee a specific performance increase from any given upgrade — results depend on your current system and what's being upgraded.",
    linksToPage: null,
    show: true
  },

  {
    id: "cleaning-maintenance",
    name: "PC Cleaning & Maintenance",
    shortDescription: "Dust removal and general maintenance to help keep your system running the way it should.",
    included: [
      "Removing accumulated dust and debris from the case, fans, and heatsinks",
      "General maintenance to help keep a system in good working condition",
      "Scope adjusted based on the condition and type of PC"
    ],
    notCovered: "Cleaning is maintenance, not a repair — it isn't a fix for an underlying hardware failure, and I can't promise a specific performance improvement from it. Unusually difficult, damaged, or heavily contaminated systems may need a quick conversation before I take them on.",
    linksToPage: null,
    show: true
  },

  {
    id: "support",
    name: "Tech Support for Purchased Systems",
    shortDescription: "Help with setup, troubleshooting, and questions after you've bought a system from me.",
    included: [
      "Setup help and troubleshooting for systems purchased from North Bridge PCs",
      "Answers to general questions about your PC",
      "Help figuring out next steps if something isn't working right"
    ],
    notCovered: "This isn't unlimited support, and not every issue can be resolved remotely or in a single conversation, especially hardware problems — but I'll always help you figure out the next step.",
    linksToPage: null,
    show: true
  }

];
