import Link from "next/link";

import {
  Heart,
  Search,
  User,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { CartTrigger } from "@/components/storefront/cart/cart-trigger";

import { Container } from "./container";
import { MobileNavigation } from "./mobile-navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container>
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Mobile Navigation */}
          <div className="flex items-center gap-3 lg:hidden">
            <MobileNavigation />

            <Link
              href="/"
              className="font-display text-2xl tracking-tight"
            >
              Parth Jewellers
            </Link>
          </div>

          {/* Desktop Logo */}
          <Link
            href="/"
            className="hidden font-display text-3xl tracking-tight lg:block"
          >
            Parth Jewellers
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm tracking-wide text-foreground transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              aria-label="Search"
              className="inline-flex size-9 items-center justify-center rounded-md transition-colors hover:bg-secondary"
            >
              <Search className="size-5" />
            </button>

            <button
              type="button"
              aria-label="Wishlist"
              className="hidden size-9 items-center justify-center rounded-md transition-colors hover:bg-secondary sm:inline-flex"
            >
              <Heart className="size-5" />
            </button>

            <Link
              href="/account"
              aria-label="Account"
              className="hidden size-9 items-center justify-center rounded-md transition-colors hover:bg-secondary sm:inline-flex"
            >
              <User className="size-5" />
            </Link>

            <CartTrigger />
          </div>
        </div>
      </Container>
    </header>
  );
}