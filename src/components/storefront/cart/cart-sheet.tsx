"use client";

import Link from "next/link";

import { useSyncExternalStore } from "react";

import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useCartStore } from "@/features/cart/store";

import { CartItem } from "./cart-item";

type CartSheetProps = {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
};

export function CartSheet({
  open,
  onOpenChange,
}: CartSheetProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const items = useCartStore(
    (state) => state.items,
  );

  const subtotal = useCartStore(
    (state) => state.getSubtotal(),
  );

  if (!mounted) {
    return null;
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <ShoppingBag className="size-8 text-muted-foreground" />

            <p className="mt-4 text-sm text-muted-foreground">
              Your cart is currently empty.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                />
              ))}
            </div>

            <div className="border-t border-border pt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Subtotal
                </span>

                <span className="font-medium">
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Taxes and shipping will be calculated at checkout.
              </p>

              <div className="mt-5 grid gap-3">
                <Button
                  asChild
                  className="w-full"
                >
                  <Link
                    href="/checkout"
                    onClick={() =>
                      onOpenChange(false)
                    }
                  >
                    Checkout
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                >
                  <Link
                    href="/cart"
                    onClick={() =>
                      onOpenChange(false)
                    }
                  >
                    View Cart
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}