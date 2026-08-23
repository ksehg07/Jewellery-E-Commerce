export type CartItem = {
  id: string;

  productId: string;
  variantId?: string;

  name: string;
  slug: string;

  image: string;

  price: number;

  quantity: number;

  variantName?: string;
  variantValue?: string;
};