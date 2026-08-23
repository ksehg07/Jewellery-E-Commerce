export type MockProductVariant = {
  id: string;
  name: string;
  value: string;
  price: number;
};

export type MockProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  badge?: string;

  shortDescription?: string;
  description?: string;

  material?: string;
  purity?: string;
  weight?: string;

  variants?: MockProductVariant[];
};

export const mockProducts: MockProduct[] = [
  {
    id: "1",
    name: "Classic Gold Ring",
    slug: "classic-gold-ring",
    price: 24999,
    image: "/images/products/product-1.jpg",

    images: [
      "/images/products/product-1.jpg",
      "/images/products/product-2.jpg",
      "/images/products/product-3.jpg",
    ],

    category: "Rings",
    badge: "Bestseller",

    shortDescription:
      "A timeless gold ring designed for everyday elegance and special celebrations.",

    description:
      "Crafted with attention to detail, this elegant gold ring brings together timeless design and modern sophistication. A versatile piece created to be worn, celebrated, and treasured.",

    material: "Gold",
    purity: "22K",
    weight: "3.5g",

    variants: [
      {
        id: "ring-size-14",
        name: "Size",
        value: "14",
        price: 24999,
      },
      {
        id: "ring-size-16",
        name: "Size",
        value: "16",
        price: 25999,
      },
      {
        id: "ring-size-18",
        name: "Size",
        value: "18",
        price: 26999,
      },
    ],
  },
  {
    id: "2",
    name: "Elegant Pearl Earrings",
    slug: "elegant-pearl-earrings",
    price: 18499,
    image: "/images/products/product-2.jpg",
    category: "Earrings",
    badge: "New",
  },
  {
    id: "3",
    name: "Timeless Gold Pendant",
    slug: "timeless-gold-pendant",
    price: 32999,
    image: "/images/products/product-3.jpg",
    category: "Necklaces",
  },
  {
    id: "4",
    name: "Signature Bracelet",
    slug: "signature-bracelet",
    price: 27999,
    image: "/images/products/product-4.jpg",
    category: "Bracelets",
  },
  {
    id: "5",
    name: "Radiant Diamond Ring",
    slug: "radiant-diamond-ring",
    price: 45999,
    image: "/images/products/product-1.jpg",
    category: "Rings",
  },
  {
    id: "6",
    name: "Golden Drop Earrings",
    slug: "golden-drop-earrings",
    price: 21999,
    image: "/images/products/product-2.jpg",
    category: "Earrings",
  },
  {
    id: "7",
    name: "Heritage Gold Necklace",
    slug: "heritage-gold-necklace",
    price: 68999,
    image: "/images/products/product-3.jpg",
    category: "Necklaces",
    badge: "Featured",
  },
  {
    id: "8",
    name: "Minimal Gold Bracelet",
    slug: "minimal-gold-bracelet",
    price: 18999,
    image: "/images/products/product-4.jpg",
    category: "Bracelets",
  },
];
