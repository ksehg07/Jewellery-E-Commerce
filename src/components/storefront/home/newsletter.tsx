import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/layout/container";

export function Newsletter() {
  return (
    <section className="bg-primary py-20 text-primary-foreground sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium tracking-[0.25em] text-accent uppercase">
            Stay Connected
          </p>

          <h2 className="mt-4 font-display text-5xl leading-tight sm:text-6xl">
            A little more sparkle, delivered to your inbox.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-primary-foreground/70 sm:text-base">
            Be the first to discover new collections, festive edits,
            and exclusive offers.
          </p>

          <form className="mx-auto mt-8 flex max-w-md gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              className="border-primary-foreground/20 bg-primary-foreground text-foreground placeholder:text-muted-foreground"
            />

            <Button
              type="submit"
              variant="secondary"
              size="icon"
              aria-label="Subscribe"
            >
              <ArrowRight className="size-4" />
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}