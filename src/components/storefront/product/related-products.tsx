import { Container } from "@/components/layout/container";
import { ProductCard } from "@/components/storefront/product-card";

import type { MockProduct } from "@/features/products/data/mock-products";

type RelatedProductsProps = {
  products: MockProduct[];
};

export function RelatedProducts({
  products,
}: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border py-20 sm:py-24">
      <Container>
        <div className="mb-12">
          <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
            Discover More
          </p>

          <h2 className="mt-3 font-display text-4xl sm:text-5xl">
            You may also like
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}