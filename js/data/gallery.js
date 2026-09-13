/*
  ================================================================
  js/data/gallery.js — Photo Gallery
  ================================================================
  Controls the Gallery page and the homepage's gallery preview strip.
  Both read from this same file — no need to manage photos in two places.

  ================================================================
  HOW TO ADD A PHOTO
  ================================================================
  1. Put the image file in the images/ folder.
  2. Decide which section it belongs to:
       currentBuilds   = systems currently listed or in progress
       completedBuilds = past builds and sold systems
  3. Add an entry to that section:

     {
       src: "images/your-filename.jpg",
       alt: "A short description of what's in the photo"
     },

  4. Save. Both the gallery page and the homepage preview update
     automatically — the homepage just shows the first 3 combined.

  ================================================================
  HOW TO REMOVE OR REORDER A PHOTO
  ================================================================
  Delete the entry to remove it. Cut/paste entries to reorder —
  photos display in the order they appear here.
  ================================================================
*/

const currentBuilds = [

  // No current-build photos yet — these would be systems that are
  // listed or in progress right now. See builds.js for the actual
  // for-sale listings; this is just supplementary gallery photos.

];

const completedBuilds = [

  { src: "images/3600_2070S.jpg",         alt: "Ryzen 5 3600 / RTX 2070 Super build — previously sold" },
  { src: "images/3600_2070S_Front.jpg",   alt: "Ryzen 5 3600 / RTX 2070 Super build, front panel — previously sold" },
  { src: "images/3600_2070S_Side.jpg",    alt: "Ryzen 5 3600 / RTX 2070 Super build, side panel — previously sold" },
  { src: "images/3600_2070S_IO.jpg",      alt: "Ryzen 5 3600 / RTX 2070 Super build, rear I/O — previously sold" },
  { src: "images/3600_2070S_Back.jpg",    alt: "Ryzen 5 3600 / RTX 2070 Super build, back panel — previously sold" },

  { src: "images/3600_RTX2060.jpg",       alt: "Ryzen 5 3600 / RTX 2060 build — previously sold" },
  { src: "images/3600_RTX2060_FRONT.jpg", alt: "Ryzen 5 3600 / RTX 2060 build, front panel — previously sold" },
  { src: "images/3600_RTX2060_SIDE.jpg",  alt: "Ryzen 5 3600 / RTX 2060 build, side panel — previously sold" },
  { src: "images/3600_RTX2060_IO.jpg",    alt: "Ryzen 5 3600 / RTX 2060 build, rear I/O — previously sold" },
  { src: "images/3600_RTX2060_BACK.jpg",  alt: "Ryzen 5 3600 / RTX 2060 build, back panel — previously sold" },

  { src: "images/may26-01-main.jpg",      alt: "Ryzen 5 5500 / RTX 2070 Super build — previously sold" }

];
