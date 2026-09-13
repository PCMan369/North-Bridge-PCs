/*
  ================================================================
  js/data/partBoxes.js — Part Boxes & Packaging Inventory
  ================================================================
  Empty component boxes (from builds/flips) available for resale.
  Same pattern as builds.js — one structured entry per box type, edit
  this file to add/remove/update inventory, no HTML editing required.

  IMPORTANT: quantities here are NOT automatically updated by orders.
  This is a static site with no backend — when a box sells, you need
  to manually lower (or zero out) its quantity here, the same way you
  mark a PC as "sold" in builds.js. There's no live inventory system
  counting down on its own.

  ================================================================
  HOW TO ADD A BOX TYPE
  ================================================================
  Copy this block into the `partBoxes` array below and fill it in:

  {
    id: "box-01",                    // unique, never reuse even after
                                      // a box type sells out
    brand: "MSI",
    model: "GeForce RTX 3060 Ventus 2X",
    category: "GPU Box",             // optional short label shown on
                                      // the card — omit if not useful
    quantity: 3,                     // how many you actually have
    price: "$5",                     // price per box
    condition: "",                   // optional — e.g. "includes foam
                                      // inserts", "some shelf wear"
    media: {
      images: [],                    // optional photos
      videos: []
    },
    notes: ""                        // optional, anything else worth
                                      // knowing
  },

  ================================================================
  HOW TO MARK A BOX AS SOLD OUT
  ================================================================
  Set quantity to 0. It automatically drops out of the orderable grid
  — no need to delete the entry, useful if you expect more of that box
  type later.
  ================================================================
*/

const partBoxes = [

  // No part box inventory has been added yet.

];
