import type { Product } from "@/lib/types";

const FLOOR_CLEANER_ID = "11111111-1111-4111-8111-111111111101";
const HAND_WASH_ID = "11111111-1111-4111-8111-111111111102";

const floorFragrances = [
  {
    id: "21111111-1111-4111-8111-111111111101",
    name: "Vetiver",
    slug: "floor-cleaner-vetiver",
    image: "/products/IMG-20261106-WA0069.jpg",
    description:
      "CANARDO Floor Cleaner in the earthy, grounded character of Vetiver. A considered essential for everyday floor care.",
    sortOrder: 1,
  },
  {
    id: "21111111-1111-4111-8111-111111111102",
    name: "Sandalwood",
    slug: "floor-cleaner-sandalwood",
    image: "/products/IMG-20261106-WA0070.jpg",
    description:
      "CANARDO Floor Cleaner with the warm, smooth character of Sandalwood. A quiet touch of richness for the everyday.",
    sortOrder: 2,
  },
  {
    id: "21111111-1111-4111-8111-111111111103",
    name: "Lavender",
    slug: "floor-cleaner-lavender",
    image: "/products/IMG-20261106-WA0071.jpg",
    description:
      "CANARDO Floor Cleaner with the soft, calm character of Lavender. Everyday floor care with a gentler mood.",
    sortOrder: 3,
  },
  {
    id: "21111111-1111-4111-8111-111111111104",
    name: "Pine",
    slug: "floor-cleaner-pine",
    image: "/products/IMG-20261106-WA0072.jpg",
    description:
      "CANARDO Floor Cleaner with the crisp, fresh character of Pine. A clean, invigorating presence in the home.",
    sortOrder: 4,
  },
  {
    id: "21111111-1111-4111-8111-111111111105",
    name: "Jasmine",
    slug: "floor-cleaner-jasmine",
    image: "/products/IMG-20261106-WA0073.jpg",
    description:
      "CANARDO Floor Cleaner with the light, floral character of Jasmine. A delicate finishing touch for everyday spaces.",
    sortOrder: 5,
  },
  {
    id: "21111111-1111-4111-8111-111111111106",
    name: "Bergamot",
    slug: "floor-cleaner-bergamot",
    image: "/products/IMG-20261106-WA0074.jpg",
    description:
      "CANARDO Floor Cleaner with the bright, citrus character of Bergamot. A fresh lift for your daily cleaning ritual.",
    sortOrder: 6,
  },
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: FLOOR_CLEANER_ID,
    name: "Floor Cleaning Liquid",
    slug: "floor-cleaner",
    category: "floor-cleaner",
    description:
      "A considered floor care collection, available in six refreshing fragrance expressions.",
    imageUrl: "/products/IMG-20261106-WA0069.jpg",
    isActive: true,
    isPlaceholderImage: false,
    sortOrder: 1,
    variants: floorFragrances.map((fragrance) => ({
      id: fragrance.id,
      productId: FLOOR_CLEANER_ID,
      name: fragrance.name,
      slug: fragrance.slug,
      fragrance: fragrance.name,
      size: null,
      price: null,
      imageUrl: fragrance.image,
      description: fragrance.description,
      isActive: true,
      sortOrder: fragrance.sortOrder,
    })),
  },
  {
    id: HAND_WASH_ID,
    name: "Hand Liquid Wash",
    slug: "hand-liquid-wash",
    category: "hand-wash",
    description:
      "A hand liquid wash created for the everyday cleansing ritual, presented in the quiet CANARDO style.",
    imageUrl: "/products/hand-liquid-wash.svg",
    isActive: true,
    isPlaceholderImage: true,
    sortOrder: 2,
    variants: [
      {
        id: "21111111-1111-4111-8111-111111111107",
        productId: HAND_WASH_ID,
        name: "Hand Liquid Wash",
        slug: "hand-liquid-wash",
        fragrance: null,
        size: null,
        price: null,
        imageUrl: "/products/hand-liquid-wash.svg",
        description:
          "CANARDO Hand Liquid Wash. A thoughtful everyday essential, with a clean and minimal presence for the sink.",
        isActive: true,
        sortOrder: 1,
      },
    ],
  },
];

export const FLOOR_IMAGE_MAP: Record<string, string> = {
  Vetiver: "/products/IMG-20261106-WA0069.jpg",
  Sandalwood: "/products/IMG-20261106-WA0070.jpg",
  Lavender: "/products/IMG-20261106-WA0071.jpg",
  Pine: "/products/IMG-20261106-WA0072.jpg",
  Jasmine: "/products/IMG-20261106-WA0073.jpg",
  Bergamot: "/products/IMG-20261106-WA0074.jpg",
};
