import { ShopClient } from "@/components/storefront/shop/shop-client";
import { ShopHeader } from "@/components/storefront/shop/shop-header";

import { getProducts } from "@/features/products";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <ShopHeader productCount={products.length} />

      <ShopClient products={products} />
    </>
  );
}