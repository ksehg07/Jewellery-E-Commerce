import { ShopClient } from "@/components/storefront/shop/shop-client";
import { ShopHeader } from "@/components/storefront/shop/shop-header";

import { mockProducts } from "@/features/products/data/mock-products";

export default function ShopPage() {
  return (
    <>
      <ShopHeader productCount={mockProducts.length} />

      <ShopClient products={mockProducts} />
    </>
  );
}