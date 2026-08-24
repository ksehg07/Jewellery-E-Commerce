import Link from "next/link";
import {
  ArrowRight,
  Package,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { AccountAuth } from "@/components/auth/account-auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma/client";

export default async function AccountPage() {
  const session = await getSession();

  if (!session) {
    return (
      <Container className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-5xl overflow-hidden border border-border lg:grid-cols-[1fr_460px]">
          <div className="hidden bg-muted/20 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                NPJ Jewellery
              </p>

              <h1 className="mt-6 max-w-md font-display text-5xl leading-tight">
                Your jewellery journey, all in one place.
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">
                Sign in to view your orders, manage your account,
                and enjoy a seamless shopping experience.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-medium"
            >
              Explore the collection
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="p-6 sm:p-10">
            <AccountAuth />
          </div>
        </div>
      </Container>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  if (!user || user.status !== "ACTIVE") {
    return (
      <Container className="py-20">
        <div className="mx-auto max-w-xl border border-border p-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Account unavailable
          </p>

          <h1 className="mt-4 font-display text-3xl">
            We couldn't load your account.
          </h1>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Please sign out and try signing in again.
          </p>

          <div className="mt-7">
            <Link href="/">
              <Button>Return home</Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    select: {
      id: true,
      orderNumber: true,
      total: true,
      status: true,
      createdAt: true,
    },
  });

  const displayName =
    user.firstName ||
    user.name ||
    user.email.split("@")[0];

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="border-b border-border pb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            My Account
          </p>

          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl">
                Welcome, {displayName}.
              </h1>

              <p className="mt-3 text-sm text-muted-foreground">
                Manage your profile, orders, and account details.
              </p>
            </div>

            <SignOutButton />
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <section className="border border-border p-6">
            <UserRound className="size-5 text-accent" />

            <h2 className="mt-5 font-display text-2xl">
              Profile
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Name
                </p>
                <p className="mt-1">{user.name}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Email
                </p>
                <p className="mt-1">{user.email}</p>
              </div>

              {user.phone ? (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Phone
                  </p>
                  <p className="mt-1">{user.phone}</p>
                </div>
              ) : null}
            </div>
          </section>

          <Link
            href="/shop"
            className="group border border-border p-6 transition-colors hover:bg-muted/20"
          >
            <ShoppingBag className="size-5 text-accent" />

            <h2 className="mt-5 font-display text-2xl">
              Continue Shopping
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Discover new pieces from our collection.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm font-medium">
              Explore shop
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <section className="border border-border p-6">
            <Package className="size-5 text-accent" />

            <h2 className="mt-5 font-display text-2xl">
              Orders
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {orders.length === 0
                ? "You haven't placed any orders yet."
                : `${orders.length} recent order${orders.length === 1 ? "" : "s"} shown below.`}
            </p>
          </section>
        </div>

        <section className="mt-8 border border-border">
          <div className="border-b border-border px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Order history
            </p>

            <h2 className="mt-1 font-display text-2xl">
              Recent orders
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <Package className="mx-auto size-7 text-muted-foreground" />

              <p className="mt-4 font-display text-2xl">
                No orders yet
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Your orders will appear here once you place one.
              </p>

              <div className="mt-6">
                <Link href="/shop">
                  <Button>
                    Start shopping
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {order.orderNumber}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {order.createdAt.toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="text-sm">
                      ₹{Number(order.total).toLocaleString("en-IN")}
                    </span>

                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Container>
  );
}