import { Container } from "@/components/layout/container";
import { ProductGrid } from "@/components/storefront/shop/product-grid";
import { mockProducts } from "@/features/products/data/mock-products";

const newArrivals = mockProducts.slice(0, 8);

export default function ArrivalsPage() {
  return (
    <>
      <section className="py-16 sm:py-20">
        <Container>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            New Arrivals
          </p>

          <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Fresh heirlooms for a new chapter.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
            Discover the latest pieces curated for everyday elegance, thoughtful
            gifting, and celebrations that deserve a lasting statement.
          </p>
        </Container>
      </section>

      <ProductGrid products={newArrivals} />
    </>
  );
}
