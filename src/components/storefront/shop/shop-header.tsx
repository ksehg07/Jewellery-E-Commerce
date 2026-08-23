import { Container } from "@/components/layout/container";

type ShopHeaderProps = {
  productCount: number;
};

export function ShopHeader({ productCount }: ShopHeaderProps) {
  return (
    <section className="border-b border-border py-14 sm:py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.25em] text-accent uppercase">
            Explore the collection
          </p>

          <h1 className="mt-4 font-display text-5xl sm:text-6xl lg:text-7xl">
            Fine Jewellery
          </h1>

          <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
            Discover timeless designs created for everyday elegance,
            celebrations, and the moments worth remembering.
          </p>

          <p className="mt-6 text-sm text-muted-foreground">
            {productCount} pieces available
          </p>
        </div>
      </Container>
    </section>
  );
}