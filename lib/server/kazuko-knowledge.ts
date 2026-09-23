import "server-only";

export const KAZUKO_KNOWLEDGE_VERSION = "kazuko-kb-v4-2026-09-20";

type MenuTag =
  | "Best-Seller"
  | "Chef's Recommendation"
  | "Contains Peanuts"
  | "Contains Seafood"
  | "Spicy"
  | "Vegetarian";

type MenuVariant = {
  label: string;
  pricePhp: number;
};

type MenuItem = {
  category: string;
  name: string;
  pricePhp?: number;
  variants?: readonly MenuVariant[];
  ingredients?: readonly string[];
  tags?: readonly MenuTag[];
};

function item(value: MenuItem): MenuItem {
  return value;
}

export const kazukoKnowledge = {
  version: KAZUKO_KNOWLEDGE_VERSION,
  identity: {
    name: "Kazuko Ramenba Japanese Restaurant",
    positioning:
      "A ramen restaurant known for tonkotsu ramen and karaage chicken, offering quality Japanese dining in a Premium Casual setting.",
    voice: "Premium Casual",
  },
  location: {
    address:
      "2 Constellation Street, corner Makati Avenue, Makati, Makati City, 1209 Metro Manila",
    landmarks: [
      "Opposite City Garden Hotel",
      "Opposite UnionBank on Makati Avenue",
    ],
    operatingHours: "Open 24 hours",
    parking:
      "Parking is based on availability. There is no dedicated, guaranteed, or reserved parking.",
  },
  publicChannels: {
    whatsapp: "https://wa.me/639611277777",
    facebook: "https://facebook.com/kazukoramenbaph",
    instagram: "https://instagram.com/kazukoramenba",
    tiktok: "https://tiktok.com/@kazukoramenba",
    website: "https://kazukoramenba.com",
  },
  pricingNotice:
    "Please let us know if you have any allergies or dietary requirements. All prices are inclusive of 12% VAT and subject to 10% service charge.",
  menu: [
    item({
      category: "Appetizer",
      name: "Miso Soup",
      pricePhp: 139,
      ingredients: ["miso", "tofu", "seaweed", "leeks"],
    }),
    item({
      category: "Appetizer",
      name: "Edamame",
      pricePhp: 220,
      ingredients: ["edamame", "salt"],
      tags: ["Vegetarian"],
    }),
    item({
      category: "Appetizer",
      name: "Garden Salad",
      pricePhp: 449,
      ingredients: [
        "lettuce",
        "carrots",
        "red cabbage",
        "cherry tomato",
        "cucumber",
        "sesame seeds",
        "gomadare dressing",
      ],
      tags: ["Vegetarian"],
    }),
    item({
      category: "Appetizer",
      name: "Pork Gyoza",
      variants: [
        { label: "3 pcs", pricePhp: 220 },
        { label: "5 pcs", pricePhp: 260 },
      ],
      ingredients: [
        "gyoza wrapper",
        "pork",
        "cabbage",
        "pork stock",
        "ginger",
        "gyoza sauce",
      ],
      tags: ["Chef's Recommendation"],
    }),
    item({
      category: "Appetizer",
      name: "Karaage",
      variants: [
        { label: "3 pcs", pricePhp: 328 },
        { label: "5 pcs", pricePhp: 388 },
      ],
      ingredients: [
        "marinated chicken",
        "karaage flour mixture",
        "leeks",
        "lemon",
        "teriyaki mayo",
      ],
      tags: ["Chef's Recommendation"],
    }),
    item({
      category: "Ramen",
      name: "Kuro Ramen",
      pricePhp: 549,
      ingredients: [
        "noodles",
        "pork",
        "egg",
        "black garlic",
        "wood ear mushroom",
        "sesame powder",
        "pork stock",
        "leeks",
      ],
      tags: ["Chef's Recommendation"],
    }),
    item({
      category: "Ramen",
      name: "Tantanmen",
      pricePhp: 599,
      ingredients: [
        "noodles",
        "ground pork",
        "chili oil",
        "sesame powder",
        "sesame paste",
        "pork stock",
        "leeks",
      ],
      tags: ["Spicy", "Contains Peanuts"],
    }),
    item({
      category: "Ramen",
      name: "Miso Ramen",
      pricePhp: 528,
      ingredients: [
        "noodles",
        "pork",
        "egg",
        "corn",
        "miso paste",
        "pork stock",
        "leeks",
        "sesame powder",
      ],
    }),
    item({
      category: "Ramen",
      name: "Tori Paitan",
      pricePhp: 539,
      ingredients: [
        "noodles",
        "chicken",
        "egg",
        "leeks",
        "bean sprout",
        "chicken stock",
        "sesame powder",
      ],
    }),
    item({
      category: "Ramen",
      name: "Tonkotsu Shoyu",
      pricePhp: 539,
      ingredients: [
        "noodles",
        "pork",
        "egg",
        "bamboo shoots",
        "sesame powder",
        "pork stock",
        "leeks",
      ],
      tags: ["Chef's Recommendation", "Best-Seller"],
    }),
    item({ category: "Ramen Add-On", name: "Chasu Pork", pricePhp: 135 }),
    item({
      category: "Ramen Add-On",
      name: "Ajitsuke Tamago (seasoned egg)",
      pricePhp: 60,
    }),
    item({
      category: "Ramen Add-On",
      name: "Moyashi (bean sprout)",
      pricePhp: 60,
    }),
    item({
      category: "Ramen Add-On",
      name: "Toumorokoshi (corn kernels)",
      pricePhp: 60,
    }),
    item({ category: "Ramen Add-On", name: "Soup Add-On", pricePhp: 315 }),
    item({
      category: "Ramen Add-On",
      name: "Nori (seaweed)",
      pricePhp: 60,
    }),
    item({
      category: "Ramen Add-On",
      name: "Menma (bamboo shoot)",
      pricePhp: 60,
    }),
    item({ category: "Ramen Add-On", name: "Tantan Meat", pricePhp: 105 }),
    item({
      category: "Ramen Add-On",
      name: "Ramen Noodles (extra)",
      pricePhp: 60,
    }),
    item({ category: "Ramen Add-On", name: "Japanese Rice", pricePhp: 80 }),
    item({
      category: "Donburi",
      name: "Beef Gyudon",
      pricePhp: 468,
      ingredients: [
        "rice",
        "beef",
        "onion",
        "gyudon sauce",
        "gari",
        "benishoga",
        "leeks",
        "kizami nori",
        "black & white sesame seeds",
      ],
      tags: ["Chef's Recommendation"],
    }),
    item({
      category: "Donburi",
      name: "Salmon Poke Bowl",
      pricePhp: 619,
      ingredients: [
        "rice",
        "salmon",
        "avocado",
        "mango",
        "edamame",
        "salmon skin",
        "tobiko",
        "kizami nori",
        "teriyaki mayo",
        "spicy mayo",
      ],
      tags: ["Contains Seafood"],
    }),
    item({
      category: "Donburi",
      name: "Salmon Teriyaki",
      pricePhp: 428,
      ingredients: [
        "rice",
        "salmon",
        "teriyaki sauce",
        "leeks",
        "tanuki",
        "black & white sesame seeds",
      ],
      tags: ["Contains Seafood"],
    }),
    item({
      category: "Donburi",
      name: "Salmon Rice Bowl",
      pricePhp: 439,
      ingredients: [
        "rice",
        "salmon",
        "cucumber",
        "red cabbage",
        "tanuki",
        "tobiko",
        "black & white sesame seeds",
      ],
      tags: ["Contains Seafood"],
    }),
    ...[
      ["Beef Yakimeshi", 490, []],
      ["Chicken Yakimeshi", 430, ["Chef's Recommendation"]],
      ["Pork Yakimeshi", 430, []],
      ["Seafood Yakimeshi", 430, ["Contains Seafood"]],
      ["Salmon Yakimeshi", 430, ["Contains Seafood"]],
    ].map(([name, pricePhp, tags]) =>
      item({
        category: "Yakimeshi",
        name: name as string,
        pricePhp: pricePhp as number,
        ingredients: ["rice", "carrots", "garlic", "onion", "bell pepper", "leeks"],
        tags: tags as MenuTag[],
      }),
    ),
    ...[
      ["Beef Yakisoba", 490, []],
      ["Chicken Yakisoba", 430, []],
      ["Pork Yakisoba", 430, ["Chef's Recommendation"]],
      ["Seafood Yakisoba", 468, ["Contains Seafood"]],
    ].map(([name, pricePhp, tags]) =>
      item({
        category: "Yakisoba",
        name: name as string,
        pricePhp: pricePhp as number,
        ingredients: [
          "noodles",
          "carrots",
          "cabbage",
          "yakisoba sauce",
          "leeks",
          "katsuoboshi",
          "benishoga",
          "sesame seeds",
        ],
        tags: tags as MenuTag[],
      }),
    ),
    item({
      category: "Tempura",
      name: "Ebi Tempura",
      variants: [
        { label: "3 pcs", pricePhp: 328 },
        { label: "5 pcs", pricePhp: 378 },
      ],
      ingredients: ["shrimp", "tempura batter", "tempura sauce"],
      tags: ["Contains Seafood"],
    }),
    item({
      category: "Tempura",
      name: "Mixed Platter",
      pricePhp: 368,
      ingredients: [
        "2 pcs shrimp",
        "1 pc eggplant",
        "1 pc okra",
        "1 pc enoki",
        "tempura sauce",
      ],
      tags: ["Contains Seafood"],
    }),
    item({
      category: "Rolls",
      name: "California Maki",
      pricePhp: 499,
      ingredients: [
        "sushi rice",
        "kani (crab)",
        "cucumber",
        "mango",
        "ginger",
        "wasabi",
        "tanuki",
        "tobiko",
        "kizami nori",
        "Japanese mayo",
      ],
      tags: ["Chef's Recommendation", "Contains Seafood"],
    }),
    item({
      category: "Rolls",
      name: "Salmon Roll",
      pricePhp: 999,
      ingredients: [
        "salmon",
        "sushi rice",
        "cream cheese",
        "teriyaki mayo",
        "leeks",
        "black & white sesame seeds",
        "wasabi",
        "ginger",
        "lemon",
      ],
      tags: ["Contains Seafood"],
    }),
    item({
      category: "Yakiniku",
      name: "A4 Wagyu",
      variants: [
        { label: "Regular, 50g", pricePhp: 1199 },
        { label: "Large, 100g", pricePhp: 2099 },
      ],
    }),
    item({ category: "Yakiniku", name: "Gyukatsu", pricePhp: 1699 }),
    item({
      category: "Salmon",
      name: "Salmon Nigiri",
      pricePhp: 410,
      ingredients: [
        "salmon",
        "sushi rice",
        "teriyaki mayo",
        "tanuki",
        "tobiko",
        "kizami nori",
        "gari",
        "wasabi",
        "calamansi",
        "shoyu",
      ],
      tags: ["Contains Seafood"],
    }),
    item({
      category: "Salmon",
      name: "Aburi Nigiri",
      pricePhp: 410,
      ingredients: [
        "torched salmon",
        "sushi rice",
        "spicy mayo",
        "sesame seeds",
        "leeks",
        "gari",
        "wasabi",
        "calamansi",
        "shoyu",
      ],
      tags: ["Contains Seafood"],
    }),
    item({
      category: "Salmon",
      name: "Salmon Sashimi",
      variants: [
        { label: "3 pcs", pricePhp: 399 },
        { label: "8 pcs", pricePhp: 899 },
      ],
      ingredients: [
        "salmon sashimi slices",
        "lemon",
        "cucumber",
        "gari",
        "wasabi",
        "shoyu",
      ],
      tags: ["Contains Seafood"],
    }),
    item({
      category: "Salmon",
      name: "Salmon Aburi",
      pricePhp: 449,
      ingredients: [
        "torched salmon",
        "spicy mayo",
        "sesame seeds",
        "leeks",
        "gari",
        "wasabi",
        "lemon",
        "shoyu",
      ],
      tags: ["Contains Seafood"],
    }),
    item({
      category: "Salmon",
      name: "Salmon Spring Roll",
      variants: [
        { label: "3 pcs", pricePhp: 339 },
        { label: "5 pcs", pricePhp: 519 },
      ],
      ingredients: [
        "salmon",
        "spring roll wrapper",
        "onion",
        "spring onion",
        "tartare sauce",
      ],
      tags: ["Contains Seafood"],
    }),
    item({
      category: "Salmon",
      name: "Salmon Head",
      pricePhp: 449,
      ingredients: ["salmon head", "teriyaki sauce", "daikon", "lemon"],
      tags: ["Contains Seafood"],
    }),
    ...[
      ["Coffee Jelly", 139],
      ["Mango Sago", 149],
      ["Chocolate Croffle", 278],
      ["Cream Cheese Brulee Croffle", 278],
      ["Strawberry Croffle", 278],
    ].map(([name, pricePhp]) =>
      item({ category: "Dessert", name: name as string, pricePhp: pricePhp as number }),
    ),
    ...[
      ["Bottled Water", 68],
      ["Iced Tea", 149],
      ["Soda Water", 149],
      ["Mango Shake", 280],
      ["Pineapple Shake", 260],
      ["Watermelon Shake", 260],
    ].map(([name, pricePhp]) =>
      item({
        category: "Non-Alcoholic Drink",
        name: name as string,
        pricePhp: pricePhp as number,
      }),
    ),
    item({
      category: "Non-Alcoholic Drink",
      name: "Soft Drinks",
      variants: [
        { label: "Coke Regular", pricePhp: 139 },
        { label: "Coke Zero", pricePhp: 139 },
        { label: "Sprite", pricePhp: 139 },
        { label: "Royal", pricePhp: 139 },
      ],
    }),
    ...[
      ["Highball", 499],
      ["Ume Sour", 349],
      ["Matcha Mirage", 399],
      ["White Sakura Blossom", 399],
      ["Ichigo Bliss", 344],
      ["Golden Luxe", 399],
      ["Yuzu Firefly", 399],
    ].map(([name, pricePhp]) =>
      item({ category: "Cocktail", name: name as string, pricePhp: pricePhp as number }),
    ),
    item({
      category: "Beer",
      name: "Local Beer",
      variants: [
        { label: "San Mig Pale Pilsen", pricePhp: 191 },
        { label: "San Mig Light", pricePhp: 191 },
      ],
    }),
    item({
      category: "Beer",
      name: "Imported Beer",
      variants: [
        { label: "Asahi", pricePhp: 278 },
        { label: "Kirin", pricePhp: 278 },
      ],
    }),
    item({ category: "Beer", name: "Sapporo", pricePhp: 326 }),
    item({ category: "Sake / Umeshu", name: "Yamadanishiki", pricePhp: 888 }),
    item({
      category: "Sake / Umeshu",
      name: "Gekkeikan",
      variants: [
        { label: "Jar, hot or cold", pricePhp: 549 },
        { label: "Bottle", pricePhp: 3686 },
      ],
    }),
    item({ category: "Sake / Umeshu", name: "Choya", pricePhp: 3666 }),
    item({
      category: "Whisky",
      name: "Suntory Kakubin",
      variants: [
        { label: "Glass", pricePhp: 368 },
        { label: "Bottle", pricePhp: 5288 },
      ],
    }),
    item({
      category: "Whisky",
      name: "Suntory Old",
      variants: [
        { label: "Glass", pricePhp: 688 },
        { label: "Bottle", pricePhp: 6699 },
      ],
    }),
    item({
      category: "Whisky",
      name: "Hibiki",
      variants: [
        { label: "Glass", pricePhp: 2899 },
        { label: "Bottle", pricePhp: 22999 },
      ],
    }),
  ] satisfies readonly MenuItem[],
  menuGuidance: {
    broth:
      "All ramen broth is made daily from scratch, with no MSG or ready-made packet broth.",
    bestSeller: "Tonkotsu Shoyu",
    vegetarianItems: ["Edamame", "Garden Salad"],
    wine:
      "Wine is not yet on the menu. Kazuko is still deciding which wine to add; do not promise timing or availability.",
  },
  allergenGuide: {
    labels: {
      "Chef's Recommendation":
        "Our kitchen's favorite dishes and house specialties.",
      Spicy: "Contains chili or heat. Ask your server for spice-level adjustments.",
      "Contains Peanuts":
        "This dish contains peanuts or peanut-derived ingredients.",
      Vegetarian: "Meat-free dishes. May contain dairy or eggs.",
      "Contains Seafood": "Contains fish, shellfish, or crustaceans.",
    },
    crossContact:
      "While we take every precaution to avoid cross-contact, our kitchen handles nuts, seafood, wheat, and dairy. We cannot guarantee a 100% allergen-free environment.",
    responsePolicy:
      "Never say that food is safe for an allergy. Share only printed ingredients and tags, state that cross-contact is possible, and recommend confirmation with Kazuko staff. Treat Tantanmen as containing peanuts even though peanuts are not named in its printed ingredient list.",
  },
  operations: {
    reservations: {
      requiredFields: [
        "requested date",
        "guest full name",
        "requested time",
        "contact number",
        "number of guests",
        "special request or instruction",
      ],
      workflow:
        "Collect the request details and pass them to Kazuko staff. Never confirm availability or a booking; final reservation confirmation always comes from Kazuko staff.",
    },
    deliveryAndPickup:
      "A customer may ask to place an order through Kazuko's page and arrange their own courier. Staff must first confirm the order and payment steps, then advise when it is ready for pickup and request courier or rider details. Do not promise delivery, pickup readiness, courier acceptance, or GrabFood availability. Dine-in may be recommended because takeout can affect food quality, especially ramen.",
    refundsAndDeposits:
      "Refund and deposit questions must be handed to staff. They are handled case by case and there is no fixed customer-facing policy.",
    pets:
      "Small pets are allowed only when carried in a covered bag or cage.",
    birthdayOffer:
      "A complimentary Mango Sago is provided for the birthday table. Do not expand this into other birthday benefits or promotions.",
  },
} as const;

export const KAZUKO_KNOWLEDGE_REFERENCES = [
  "identity",
  "location",
  "hours",
  "parking",
  "channels",
  "menu",
  "recommendations",
  "allergens",
  "pricing",
  "reservations",
  "delivery_pickup",
  "refunds_deposits",
  "pets",
  "birthday",
  "wine",
] as const;

export type KazukoKnowledgeReference =
  (typeof KAZUKO_KNOWLEDGE_REFERENCES)[number];

export const KAZUKO_MENU_ITEM_NAMES = kazukoKnowledge.menu.map(
  ({ name }) => name,
);

export const KAZUKO_RUNTIME_KNOWLEDGE = JSON.stringify(kazukoKnowledge);
