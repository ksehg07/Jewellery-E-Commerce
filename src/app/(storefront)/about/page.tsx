import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Luxury
        </p>

        <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
          Crafted for life&apos;s most meaningful moments.
        </h1>

        <div className="mt-8 max-w-2xl space-y-5 text-base leading-7 text-muted-foreground">
          <p>
            We design jewellery that balances contemporary elegance with enduring
            craftsmanship, creating pieces that feel personal, refined, and ready
            for celebration.
          </p>

          <p>
            Every piece is thoughtfully considered to reflect a slower, more
            intentional approach to luxury—beautiful in the moment and treasured for
            years to come.
          </p>
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-secondary/60 p-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Our Craft
          </p>
          <h2 className="mt-4 font-display text-2xl text-foreground">
            Fine detail, thoughtfully made.
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Each design is shaped with a focus on proportion, finish, and the kind
            of quiet luxury that feels effortless to wear.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-secondary/60 p-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Our Promise
          </p>
          <h2 className="mt-4 font-display text-2xl text-foreground">
            Beauty with intention.
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            We curate jewellery for milestones, everyday rituals, and the special
            moments that deserve something lasting and meaningful.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-secondary/60 p-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Our Standard
          </p>
          <h2 className="mt-4 font-display text-2xl text-foreground">
            Trust in every detail.
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            From selection to presentation, we aim to create a premium experience
            grounded in care, clarity, and timeless appeal.
          </p>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-start gap-4 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Discover more
          </p>
          <h2 className="mt-2 font-display text-3xl text-foreground">
            Explore the collection.
          </h2>
        </div>

        <Button asChild size="lg">
          <Link href="/shop">Explore Collection</Link>
        </Button>
      </div>
    </Container>
  );
}
