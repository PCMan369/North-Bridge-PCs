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

  {
    id: "box-01",
    brand: "AMD",
    model: "Ryzen 5 5500",
    category: "CPU Box",
    quantity: 3,
    price: "$5",
    condition: "Good condition — includes foam inserts.",
    media: { images: [], videos: [] },
    notes: ""
  },

  {
    id: "box-02",
    brand: "AMD",
    model: "Ryzen 5 3600",
    category: "CPU Box",
    quantity: 2,
    price: "$5",
    condition: "Good condition — includes foam inserts.",
    media: { images: [], videos: [] },
    notes: ""
  },

  {
    id: "box-03",
    brand: "AMD",
    model: "Ryzen 7 5700X3D",
    category: "CPU Box",
    quantity: 1,
    price: "$5",
    condition: "Fair condition.",
    media: { images: [], videos: [] },
    notes: ""
  },

  {
    id: "box-04",
    brand: "MSI",
    model: "MAG A550BN",
    category: "PSU Box",
    quantity: 4,
    price: "$3",
    condition: "Good condition — includes foam inserts.",
    media: { images: [], videos: [] },
    notes: ""
  },

  {
    id: "box-05",
    brand: "MSI",
    model: "MAG A650BE", // owner wrote "mg a650be" — MSI's PSU line is
                          // branded "MAG," so read as a likely typo and
                          // corrected; flag if a different model was meant
    category: "PSU Box",
    quantity: 1,
    price: "$3",
    condition: "Good condition — includes foam inserts.",
    media: { images: [], videos: [] },
    notes: ""
  },

  {
    id: "box-06",
    brand: "ID-Cooling",
    model: "SE-214 XT-V2",
    category: "Cooler Box",
    quantity: 1,
    price: "$3",
    condition: "Good condition. No inserts.",
    media: { images: [], videos: [] },
    notes: ""
  },

  {
    id: "box-07",
    brand: "ASUS",
    model: "TUF Gaming A520",
    category: "Motherboard Box",
    quantity: 1,
    price: "$5",
    condition: "Good condition — includes cardboard insert.",
    media: { images: [], videos: [] },
    notes: ""
  },

  {
    id: "box-08",
    brand: "ASUS",
    model: "TUF Gaming A520",
    category: "Motherboard Box",
    quantity: 1,
    price: "$5",
    condition: "Good condition. No cardboard insert.",
    media: { images: [], videos: [] },
    notes: ""
  },

  {
    id: "box-09",
    brand: "MSI",
    model: "PRO B550M VC WIFI",
    category: "Motherboard Box",
    quantity: 2,
    price: "$5",
    condition: "Good condition — includes inserts.",
    media: { images: [], videos: [] },
    notes: ""
  },

  {
    id: "box-10",
    brand: "ASUS",
    model: "B550-PLUS AC-HES",
    category: "Motherboard Box",
    quantity: 1,
    price: "$5",
    condition: "Good condition. No cardboard insert.",
    media: { images: [], videos: [] },
    notes: ""
  },

  {
    id: "box-11",
    brand: "Rosewill",
    model: "CPU Air Cooler with Digital Display",
    category: "Cooler Box",
    quantity: 1,
    price: "$3",
    condition: "Good condition. No inserts.",
    media: { images: [], videos: [] },
    notes: ""
  }

];
