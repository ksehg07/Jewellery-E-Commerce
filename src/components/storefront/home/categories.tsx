import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";

import { SectionHeading } from "./section-heading";

const categories = [
  {
    name: "Rings",
    slug: "rings",
    image: "/images/categories/rings.jpg",
  },
  {
    name: "Earrings",
    slug: "earrings",
    image: "/images/categories/earrings.jpg",
  },
  {
    name: "Pendants",
    slug: "pendants",
    image: "/images/categories/necklaces.jpg",
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    image: "/images/categories/bracelets.jpg",
  },
];

export function Categories() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Explore"
          title="Find your perfect piece."
          description="Discover jewellery designed for everyday elegance and unforgettable celebrations."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/shop?category=${category.slug}`}
              className="group relative aspect-[4/5] overflow-hidden bg-secondary"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 text-white">
                <h3 className="font-display text-3xl">
                  {category.name}
                </h3>

                <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}