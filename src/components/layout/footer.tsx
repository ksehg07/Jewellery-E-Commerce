import Link from "next/link";

import { Globe } from "lucide-react";

import { siteConfig } from "@/config/site";

import { Container } from "./container";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="font-display text-3xl tracking-tight">
              {siteConfig.name}
            </Link>

            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Timeless jewellery crafted for celebrations, memories, and moments
              that last forever.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="inline-flex size-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-background"
              >
                <Globe className="size-4" />
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="inline-flex size-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-background"
              >
                <Globe className="size-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide">SHOP</h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-muted-foreground hover:text-accent"
                >
                  All Jewellery
                </Link>
              </li>

              <li>
                <Link
                  href="/collections"
                  className="text-sm text-muted-foreground hover:text-accent"
                >
                  Collections
                </Link>
              </li>

              <li>
                <Link
                  href="/arrivals"
                  className="text-sm text-muted-foreground hover:text-accent"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide">
              CUSTOMER CARE
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-accent"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-muted-foreground hover:text-accent"
                >
                  Shipping Information
                </Link>
              </li>

              <li>
                <Link
                  href="/returns"
                  className="text-sm text-muted-foreground hover:text-accent"
                >
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide">
              INFORMATION
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-accent"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-muted-foreground hover:text-accent"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-accent"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>

          <p>Secure payments • Pan India delivery</p>
        </div>
      </Container>
    </footer>
  );
}
