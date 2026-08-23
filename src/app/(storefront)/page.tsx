import { Categories } from "@/components/storefront/home/categories";
import { FeaturedProducts } from "@/components/storefront/home/featured-products";
import { Hero } from "@/components/storefront/home/hero";
import { Newsletter } from "@/components/storefront/home/newsletter";
import { PromotionalBanner } from "@/components/storefront/home/promotional-banner";
import { TrustSection } from "@/components/storefront/home/trust-section";

export default function HomePage() {
  return (
    <>
      <Hero />

      <Categories />

      <FeaturedProducts />

      <PromotionalBanner />

      <TrustSection />

      <Newsletter />
    </>
  );
}