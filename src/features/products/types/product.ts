export type StorefrontProductVariant = {
  id: string;
  name: string;
  value: string;
  price: number | null;
  weight: number | null;
  inStock: boolean;
};

export type StorefrontProduct = {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  image: string;
  images: string[];
  category: string;
  categorySlug: string;
  audience: string;
  material: string;
  purity: string;
  weight: number | null;
  badge?: string;
  shortDescription?: string;
  description?: string;
  variants: StorefrontProductVariant[];
  inStock: boolean;
  isFeatured: boolean;
  createdAt: string;
};
