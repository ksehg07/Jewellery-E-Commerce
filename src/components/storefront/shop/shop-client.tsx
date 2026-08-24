"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { EmptyProducts } from "./empty-products";
import { ProductGrid } from "./product-grid";
import type { StorefrontProduct } from "@/features/products/types/product";

type ShopClientProps = {
  products: StorefrontProduct[];
};

export function ShopClient({
  products,
}: ShopClientProps) {
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  const filteredProducts = useMemo(() => {
    const query = currentQuery.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) =>
      [
        product.name,
        product.category,
        product.description,
        product.weight ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [products, currentQuery]);

  return (
    <>
      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <EmptyProducts />
      )}
    </>
  );
}