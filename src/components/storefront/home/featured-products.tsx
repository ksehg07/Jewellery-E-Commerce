import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { ProductCard } from "@/components/storefront/product-card";
import { getFeaturedProducts } from "@/features/products";

import { SectionHeading } from "./section-heading";

export async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <section className="bg-secondary py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Featured"
          title="Pieces to treasure."
          description="A curated selection of jewellery chosen for its timeless beauty."
          action={
            <Button asChild variant="outline">
              <Link href="/shop">
                View All
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />

        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
          {featuredProducts.map((product) => (
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