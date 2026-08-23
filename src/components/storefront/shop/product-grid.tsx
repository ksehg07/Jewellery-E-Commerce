import { Container } from "@/components/layout/container";
import { ProductCard } from "@/components/storefront/product-card";

import type { StorefrontProduct } from "@/features/products/types/product";

type ProductGridProps = {
  products: StorefrontProduct[];
};

export function ProductGrid({
  products,
}: ProductGridProps) {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        {products.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No products found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}