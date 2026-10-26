/*
  ================================================================
  js/data/gallery.js — Photo Gallery
  ================================================================
  Controls the Gallery page (gallery.html) only. The homepage's
  gallery preview strip does NOT read from this file, despite what
  this comment used to say — it independently pulls straight from
  js/data/builds.js (available builds' own media first, falling back
  to sold builds' media if none are available), in that file's array
  order. Reordering here changes gallery.html; reordering builds.js
  changes the homepage preview. Comment corrected to match reality
  while reordering this file for the owner.

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

  4. Save. The gallery page updates automatically. (The homepage preview
     does not read this file — see the note at the top. It shows the first
     5 photos from js/data/builds.js: 3 on phones.)

  ================================================================
  HOW TO REMOVE OR REORDER A PHOTO
  ================================================================
  Delete the entry to remove it. Cut/paste entries to reorder —
  photos display in the order they appear here.
  ================================================================
*/

const currentBuilds = [

  // Ryzen 5 3600 / RX 5700 XT (oct26-01). When it sells, move its photos down
  // to completedBuilds below and add " — previously sold" to each alt text.
  { src: "images/oct26-01-blue-angle.jpg", alt: "Ryzen 5 3600 / RX 5700 XT, blue lighting, angled view" },
  { src: "images/oct26-01-red-angle.jpg", alt: "Ryzen 5 3600 / RX 5700 XT, red lighting, angled view" },
  { src: "images/oct26-01-green-angle.jpg", alt: "Ryzen 5 3600 / RX 5700 XT, green lighting, angled view" },
  { src: "images/oct26-01-blue-front.jpg", alt: "Ryzen 5 3600 / RX 5700 XT, blue lighting, front view" },
  { src: "images/oct26-01-red-front.jpg", alt: "Ryzen 5 3600 / RX 5700 XT, red lighting, front view" },
  { src: "images/oct26-01-green-front.jpg", alt: "Ryzen 5 3600 / RX 5700 XT, green lighting, front view" },
  { src: "images/oct26-01-blue-close.jpg", alt: "Ryzen 5 3600 / RX 5700 XT, blue lighting, close-up of the cooler and graphics card" },
  { src: "images/oct26-01-red-close.jpg", alt: "Ryzen 5 3600 / RX 5700 XT, red lighting, close-up of the cooler and graphics card" },
  { src: "images/oct26-01-green-close.jpg", alt: "Ryzen 5 3600 / RX 5700 XT, green lighting, close-up of the cooler and graphics card" },

];

const completedBuilds = [


  { src: "images/5500_5700XT.jpg",        alt: "Ryzen 5 5500 / RX 5700 XT build — previously sold" },
  { src: "images/5500_5700XT_FRONT.jpg",  alt: "Ryzen 5 5500 / RX 5700 XT build, front panel — previously sold" },
  { src: "images/5500_5700XT_SIDE.jpg",   alt: "Ryzen 5 5500 / RX 5700 XT build, side panel — previously sold" },
  { src: "images/5500_5700XT_IO.jpg",     alt: "Ryzen 5 5500 / RX 5700 XT build, rear I/O — previously sold" },
  { src: "images/5500_5700XT_BACK.jpg",   alt: "Ryzen 5 5500 / RX 5700 XT build, back panel — previously sold" },

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
