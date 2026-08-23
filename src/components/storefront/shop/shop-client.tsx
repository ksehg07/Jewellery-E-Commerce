"use client";

import { useMemo, useState } from "react";

import { EmptyProducts } from "./empty-products";
import { ProductGrid } from "./product-grid";
import { ShopToolbar } from "./shop-toolbar";

import type { MockProduct } from "@/features/products/data/mock-products";

type ShopClientProps = {
  products: MockProduct[];
};

export function ShopClient({
  products,
}: ShopClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

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
  }, [products, searchQuery]);

  return (
    <>
      <ShopToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <EmptyProducts />
      )}
    </>
  );
}