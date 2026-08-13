/*
  ================================================================
  js/data/config.js — Site Identity & Feature Toggles
  ================================================================

  This is the ONE file that controls:
    - your business identity (name, tagline, site URL)
    - where contact form submissions go
    - which not-yet-active features are visible on the live site

  You should almost never need to touch any HTML file. Change a value
  here and the site updates everywhere that value is used.

  ================================================================
  HOW TO TURN ON A FUTURE FEATURE (example: a phone number)
  ================================================================
  1. Find `features.phone` below.
  2. Set `show: true`.
  3. Fill in `number` with the real number.
  4. Save. Every page that's built to show a phone number will now show
     one, formatted as a tel: link automatically. Pages don't need to be
     edited individually.

  If `show` is false, nothing related to that feature appears anywhere —
  no "coming soon" text, no empty boxes, no placeholder links.
  ================================================================
*/

const SITE = {
  // Core identity — used in <title> tags, footer, structured data, etc.
  businessName: "North Bridge PCs",
  tagline: "Southern Oregon Gaming PCs",

  // IMPORTANT: update this the day you get a custom domain, and nowhere
  // else needs to change. Used to build the sitemap, canonical URLs, and
  // Open Graph tags.
  url: "https://pcman369.github.io/north-bridge-pcs-v2", // placeholder — update when the new repo/URL is final

  // Current service area copy — keep this in sync with what's true today.
  // Do not expand this until the business actually expands its area.
  serviceArea: {
    city: "Grants Pass",
    state: "OR",
    servesAlso: ["Medford", "Ashland"],
    region: "Southern Oregon"
  }
};

const CONTACT = {
  // Where general contact-form submissions go. FormSubmit requires this
  // to be a real, confirmed email address (first submission triggers a
  // confirmation email to this address — click the link to activate it).
  email: "jacobskrove@gmail.com", // TODO: replace with a dedicated business email when available

  // FormSubmit endpoint is derived from `email` above — see
  // js/render/contactForm.js (Phase 4) for how this gets used.

  // Future: once inquiry-type routing exists, different inquiry types
  // could point at different addresses/rules here without touching any
  // form markup.
  responseTimeNote: "I typically respond within a day or two."
};

const features = {

  phone: {
    show: false,
    number: "", // e.g. "541-555-0123" — only used if show is true
    displayFormat: "" // optional, e.g. "(541) 555-0123" for display vs. tel: link
  },

  facebook: {
    show: false,
    url: ""
  },

  // Any other future social platform can follow the same shape:
  // instagram: { show: false, url: "" },

  onlinePayments: {
    show: false
    // No further scaffold here on purpose — see ARCHITECTURE.md.
    // Reassess the provider/API when this is actually being built.
  },

  expandedServiceArea: {
    show: false
    // When this flips true, update SITE.serviceArea above too.
  },

  blog: {
    show: false
  },

  testimonials: {
    show: true // safe to leave true — an empty testimonials.js renders nothing
  },

  // General-purpose sale/promo system. See js/data/events.js for the
  // actual event list — this just controls whether the system is active
  // at all.
  events: {
    show: true
  }

};
