/*
  ================================================================
  js/data/faq.js — Frequently Asked Questions
  ================================================================
  Single source of truth for FAQ content. The homepage shows a short
  preview (items with `featured: true`); faq.html shows all of them.
  Editing a question here updates it everywhere it appears — no need
  to keep two copies in sync.

  ================================================================
  HOW TO ADD A QUESTION
  ================================================================
  Copy this block into the array below:

  {
    id: "unique-id",
    question: "Your question here?",
    answer: "The answer. Can include multiple sentences.",
    answerExtra: "",   // optional second paragraph — leave "" to omit
    featured: false    // true = also shown in the homepage preview
                        // (keep this to 3 or so, it's meant to be short)
  }
  ================================================================
*/

const faqItems = [

  {
    id: "new-or-used",
    question: "Are the parts new or used?",
    answer: "Mostly used. Most of the parts in my builds are used; the power supply and case are almost always new. If you want to know about the condition of a specific part, ask before you buy and I'll tell you what I know.",
    answerExtra: "",
    featured: true
  },

  {
    id: "fortnite",
    question: "Can it run Fortnite?",
    answer: "Yes — every gaming PC I build is capable of running Fortnite. Entry-level builds handle it at 1080p on medium settings, usually well above 60 fps. Stronger builds push higher frame rates, higher settings or higher resolutions.",
    answerExtra: "Each listing includes estimated performance numbers for common titles, so you can get a sense of what to expect before buying. Keep in mind that Fortnite's performance varies a lot by mode (zero build vs. standard), chapter updates, and the settings you choose.",
    featured: true
  },

  {
    id: "war-thunder",
    question: "Can it run War Thunder?",
    answer: "Yes. War Thunder runs well on all the gaming PCs I build. It's worth knowing that the game leans heavier on CPU in ground battles (especially with lots of players on screen), so builds with stronger CPUs tend to do better in those scenarios. Air battles are generally easier to run.",
    answerExtra: "Performance estimates on each listing reflect typical gameplay, not just the best-case scenario. If War Thunder is your main game, mention it when you reach out — I'll make sure the build makes sense for it specifically.",
    featured: false
  },

  {
    id: "linux",
    question: "Do you offer Linux?",
    answer: "Yes. Linux installation is available on request. It's free for common distributions like Ubuntu, Fedora, Pop!_OS or Linux Mint; anything more advanced, like Arch or a custom configuration, may cost extra, and I'll tell you before I start. Mention what you'd like when you reach out, or ask about something different and I'll tell you what's possible. I'll set it up before pickup.",
    answerExtra: "If you're not sure which distro to go with, I'm happy to suggest something based on what you're planning to use the machine for. For gaming specifically, Pop!_OS and Fedora tend to be solid starting points with good driver support out of the box.",
    featured: true
  },

  {
    id: "upgrade-later",
    question: "Can I upgrade later?",
    answer: "In most cases, yes. Standard desktop gaming PCs are designed to be upgraded. RAM, storage (adding more drives or swapping the existing one), and GPU are usually the easiest things to swap without touching anything else. CPU upgrades depend on the motherboard's socket and chipset support, which varies by build.",
    answerExtra: "If upgradeability is important to you — say, you want to add a second SSD later or upgrade the GPU in a year or two — mention it when you're asking about a system or a custom build. I'll let you know what headroom exists in a specific build, and I can factor it in when speccing a custom system.",
    featured: false
  },

  {
    id: "pickup-payment",
    question: "How do pickup and payment work?",
    answer: "We meet in person at a spot between us near Grants Pass, and you can see the system running. Payment is typically cash; if you'd rather pay another way, ask and I'll see what's possible. If you'd rather not travel, I may be able to deliver for a fee.",
    answerExtra: "",
    featured: false
  },

  {
    id: "trades",
    question: "Do you take trades?",
    answer: "No trades at this time. If that changes, I'll update this page.",
    answerExtra: "",
    featured: false
  },

  {
    id: "support",
    question: "What if something goes wrong after I buy?",
    answer: "There are no returns or warranty, but I can help you troubleshoot over email. If something isn't working right after you get it home, reach out and I'll do my best to help figure out what's going on.",
    answerExtra: "For straightforward issues, like a driver problem or a setting that needs adjusting, this usually gets things sorted. For hardware failures, I'll help you work out next steps, but I can't cover physical repairs.",
    featured: true
  }

];
