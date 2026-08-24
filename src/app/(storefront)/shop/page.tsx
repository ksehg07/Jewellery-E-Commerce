import { Suspense } from "react";

import { ShopClient } from "@/components/storefront/shop/shop-client";
import { ShopHeader } from "@/components/storefront/shop/shop-header";

import { getProducts } from "@/features/products";

type ShopPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function ShopPage({
  searchParams,
}: ShopPageProps) {
  const { category } = await searchParams;
  const products = await getProducts({
    categorySlug: category,
  });

  return (
    <>
      <ShopHeader productCount={products.length} />

      <Suspense fallback={<div className="min-h-[300px]" />}>
        <ShopClient products={products} />
      </Suspense>
    </>
  );
}