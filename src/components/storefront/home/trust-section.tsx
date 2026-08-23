import {
  Gem,
  ShieldCheck,
  Truck,
  WalletCards,
} from "lucide-react";

import { Container } from "@/components/layout/container";

const features = [
  {
    icon: Gem,
    title: "Quality Craftsmanship",
    description:
      "Carefully crafted jewellery designed to be treasured.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    description:
      "A safe and secure experience from browsing to payment.",
  },
  {
    icon: Truck,
    title: "Pan India Delivery",
    description:
      "Bringing timeless jewellery to celebrations across India.",
  },
  {
    icon: WalletCards,
    title: "Secure Payments",
    description:
      "Trusted payment options for a confident shopping experience.",
  },
];

export function TrustSection() {
  return (
    <section className="border-y border-border bg-background py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title} className="space-y-4">
                <Icon className="size-6 text-accent" />

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}