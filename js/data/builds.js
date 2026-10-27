/*
  ================================================================
  js/data/builds.js — GENERATED FILE. DO NOT EDIT BY HAND.
  ================================================================
  Written by build-tools/content.py from the listing files in
  content/builds/*.json (edited through the admin forms). Any change
  made here is overwritten the next time the site is built.

  To change a listing: edit its file in content/builds/ (or use the
  admin forms), then run  python3 build-tools/content.py
  Only listings whose status is "available" or "sold" appear here;
  drafts and hidden listings are left out on purpose, so they are not
  reachable on the public site.
  ================================================================
*/

const builds = [
  {
    "id": "oct26-01",
    "title": "Ryzen 5 3600 / RX 5700 XT",
    "status": "available",
    "price": "$650",
    "eventId": null,
    "eventPrice": null,
    "summary": "Cleaned 1080p gaming build with RGB lighting.",
    "components": {
      "cpu": {
        "model": "AMD Ryzen 5 3600"
      },
      "gpu": {
        "model": "MSI Radeon RX 5700 XT MECH OC BV Dual Fan"
      },
      "motherboard": {
        "model": "Gigabyte B550M K (mATX)"
      },
      "ram": {
        "model": "GeIL Super Luce RGB Sync 2x8GB 3000MHz"
      },
      "storage": {
        "model": "500GB SATA SSD (PNY CS900)"
      },
      "psu": {
        "model": "Apevia Prestige 600W"
      },
      "case": {
        "model": "Okies Aqua Uno (black)"
      },
      "cooler": {
        "model": "ID-Cooling SE-214 XT-V2, stock case fans"
      },
      "os": {
        "model": "Windows 11 Home (activated)"
      },
      "networking": {
        "model": "Wi-Fi and Bluetooth dongle included"
      },
      "accessories": [
        "Power cable",
        "RGB remote for the fan lighting"
      ]
    },
    "performance": {
      "isEstimate": true,
      "items": [
        {
          "game": "Fortnite",
          "fps": "~100fps",
          "settings": "1080p High"
        },
        {
          "game": "Minecraft",
          "fps": "~180fps+",
          "settings": "1080p High"
        },
        {
          "game": "Marvel Rivals",
          "fps": "~70fps",
          "settings": "1080p High"
        },
        {
          "game": "Cyberpunk 2077",
          "fps": "~50fps",
          "settings": "1080p High"
        }
      ]
    },
    "media": {
      "images": [
        "images/oct26-01-blue-angle.jpg",
        "images/oct26-01-blue-front.jpg",
        "images/oct26-01-blue-close.jpg",
        "images/oct26-01-red-angle.jpg",
        "images/oct26-01-red-front.jpg",
        "images/oct26-01-red-close.jpg",
        "images/oct26-01-green-angle.jpg",
        "images/oct26-01-green-front.jpg",
        "images/oct26-01-green-close.jpg"
      ],
      "videos": []
    },
    "condition": "Good condition. Everything is used except the case and power supply, which are new.",
    "testingNotes": "",
    "listedDate": "2026-10-24",
    "notes": "Lighting: the RAM is controlled with OpenRGB and the fans with the included remote. Photos show blue, red and green."
  },
  {
    "id": "aug26-01",
    "title": "Ryzen 5 5500 / RX 5700 XT",
    "status": "sold",
    "price": "$550",
    "eventId": null,
    "eventPrice": null,
    "summary": "Cleaned and stress tested 1080p/1440p gaming build.",
    "components": {
      "cpu": {
        "model": "AMD Ryzen 5 5500"
      },
      "gpu": {
        "model": "AMD RX 5700 XT"
      },
      "ram": {
        "model": "16GB DDR4 2800MHz"
      },
      "storage": {
        "model": "512GB NVMe SSD"
      }
    },
    "performance": {
      "isEstimate": true,
      "items": [
        {
          "game": "Fortnite",
          "fps": "~130fps",
          "settings": "1080p High"
        },
        {
          "game": "Minecraft",
          "fps": "~240fps+",
          "settings": "1080p High"
        },
        {
          "game": "Marvel Rivals",
          "fps": "~90fps",
          "settings": "1080p High"
        },
        {
          "game": "Cyberpunk 2077",
          "fps": "~65fps",
          "settings": "1080p High"
        }
      ]
    },
    "media": {
      "images": [
        "images/5500_5700XT.jpg",
        "images/5500_5700XT_FRONT.jpg",
        "images/5500_5700XT_SIDE.jpg",
        "images/5500_5700XT_IO.jpg",
        "images/5500_5700XT_BACK.jpg"
      ],
      "videos": []
    },
    "condition": "",
    "testingNotes": "",
    "listedDate": "2026-08-01",
    "notes": ""
  },
  {
    "id": "jul26-01",
    "title": "Ryzen 5 3600 / RTX 2070 Super",
    "status": "sold",
    "price": "$625",
    "eventId": null,
    "eventPrice": null,
    "summary": "Cleaned and stress tested 1080p/1440p gaming build.",
    "components": {
      "cpu": {
        "model": "Ryzen 5 3600"
      },
      "gpu": {
        "model": "RTX 2070 Super"
      },
      "ram": {
        "model": "16GB DDR4 2800MHz"
      },
      "storage": {
        "model": "512GB NVMe SSD"
      }
    },
    "performance": {
      "isEstimate": true,
      "items": [
        {
          "game": "Fortnite",
          "fps": "~120fps",
          "settings": "1080p High"
        },
        {
          "game": "Minecraft",
          "fps": "~220fps+",
          "settings": "1080p High"
        },
        {
          "game": "Marvel Rivals",
          "fps": "~90fps",
          "settings": "1080p High"
        },
        {
          "game": "Cyberpunk 2077",
          "fps": "~65fps",
          "settings": "1080p High"
        }
      ]
    },
    "media": {
      "images": [
        "images/3600_2070S.jpg",
        "images/3600_2070S_Front.jpg",
        "images/3600_2070S_Side.jpg",
        "images/3600_2070S_IO.jpg",
        "images/3600_2070S_Back.jpg"
      ],
      "videos": []
    },
    "condition": "",
    "testingNotes": "",
    "listedDate": "2026-07-01",
    "notes": ""
  },
  {
    "id": "jun26-01",
    "title": "Ryzen 5 3600 / RTX 2060",
    "status": "sold",
    "price": "$550",
    "eventId": null,
    "eventPrice": null,
    "summary": "Cleaned and stress tested 1080p gaming build.",
    "components": {
      "cpu": {
        "model": "Ryzen 5 3600"
      },
      "gpu": {
        "model": "RTX 2060"
      },
      "ram": {
        "model": "16GB DDR4 2666MHz"
      },
      "storage": {
        "model": "480GB SSD"
      },
      "psu": {
        "model": "MSI MAG A550BN"
      },
      "os": {
        "model": "Windows 11 Home"
      }
    },
    "performance": {
      "isEstimate": true,
      "items": [
        {
          "game": "Fortnite",
          "fps": "~100fps",
          "settings": "1080p High"
        },
        {
          "game": "Minecraft",
          "fps": "~180fps+",
          "settings": "1080p High"
        },
        {
          "game": "Marvel Rivals",
          "fps": "~75fps",
          "settings": "1080p High"
        },
        {
          "game": "Cyberpunk 2077",
          "fps": "~55fps",
          "settings": "1080p High"
        }
      ]
    },
    "media": {
      "images": [
        "images/3600_RTX2060.jpg",
        "images/3600_RTX2060_FRONT.jpg",
        "images/3600_RTX2060_SIDE.jpg",
        "images/3600_RTX2060_IO.jpg",
        "images/3600_RTX2060_BACK.jpg"
      ],
      "videos": []
    },
    "condition": "",
    "testingNotes": "",
    "listedDate": "2026-06-01",
    "notes": ""
  },
  {
    "id": "may26-01",
    "title": "Ryzen 5 5500 / RTX 2070 Super",
    "status": "sold",
    "price": "$649",
    "eventId": null,
    "eventPrice": null,
    "summary": "Cleaned and stress tested 1080p/1440p gaming build.",
    "components": {
      "cpu": {
        "model": "Ryzen 5 5500"
      },
      "gpu": {
        "model": "RTX 2070 Super"
      },
      "ram": {
        "model": "16GB DDR4 3000MHz"
      },
      "storage": {
        "model": "512GB NVMe SSD"
      }
    },
    "performance": {
      "isEstimate": true,
      "items": [
        {
          "game": "Fortnite",
          "fps": "~130fps",
          "settings": "1080p High"
        },
        {
          "game": "Minecraft",
          "fps": "~240fps+",
          "settings": "1080p High"
        },
        {
          "game": "Marvel Rivals",
          "fps": "~95fps",
          "settings": "1080p High"
        },
        {
          "game": "Cyberpunk 2077",
          "fps": "~70fps",
          "settings": "1080p High"
        }
      ]
    },
    "media": {
      "images": [
        "images/may26-01-main.jpg"
      ],
      "videos": []
    },
    "condition": "",
    "testingNotes": "",
    "listedDate": "2026-05-01",
    "notes": ""
  }
];
