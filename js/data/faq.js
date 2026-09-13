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
    id: "fortnite",
    question: "Can it run Fortnite?",
    answer: "Yes — every system I sell is capable of running Fortnite. Entry-level builds will handle it comfortably at 1080p on medium settings, usually hitting well above 60fps. Mid-range systems push higher frame rates and can handle Epic settings without breaking a sweat. High-end builds run it at 1440p or push for very high frame rates on 1080p.",
    answerExtra: "Each listing includes estimated performance numbers for common titles, so you can get a sense of what to expect before buying. Keep in mind that Fortnite's performance varies a lot by mode (zero build vs. standard), chapter updates, and the settings you choose.",
    featured: true
  },

  {
    id: "war-thunder",
    question: "Can it run War Thunder?",
    answer: "Yes. War Thunder runs well on all the systems I sell. It's worth knowing that the game leans heavier on CPU in ground battles (especially with lots of players on screen), so builds with stronger CPUs tend to do better in those scenarios. Air battles are generally easier to run.",
    answerExtra: "Performance estimates on each listing reflect typical gameplay, not just the best-case scenario. If War Thunder is your main game, mention it when you reach out — I'll make sure the build makes sense for it specifically.",
    featured: false
  },

  {
    id: "linux",
    question: "Do you offer Linux?",
    answer: "Yes. Linux installation is available on request at no extra charge. If you have a preferred distribution — Ubuntu, Fedora, Pop!_OS, Linux Mint, Arch, or something else — just mention it when you reach out and I'll set it up before pickup.",
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
    id: "trades",
    question: "Do you take trades?",
    answer: "No trades at this time. All sales are straightforward cash or payment at pickup. If that changes in the future, I'll update this page.",
    answerExtra: "",
    featured: false
  },

  {
    id: "support",
    question: "What kind of support do you provide after purchase?",
    answer: "Basic troubleshooting assistance after purchase, over email. Every system is stress tested before it leaves, so the goal is that you never need it — but if something isn't working right after you get it home, reach out and I'll do my best to help figure out what's going on.",
    answerExtra: "To be clear about what this is: it's a real person helping you troubleshoot over email, not a warranty program or a repair service. For straightforward issues — a driver problem, a setting that needs adjusting, something not behaving the way it should — this usually gets things sorted. For hardware failures, I'll help you figure out next steps, but I can't cover physical repairs under this.",
    featured: true
  }

];
