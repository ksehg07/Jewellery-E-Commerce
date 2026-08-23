"use client";

import { useState, useSyncExternalStore } from "react";

import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store";

import { CartSheet } from "./cart-sheet";

export function CartTrigger() {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const itemCount = useCartStore(
    (state) => state.getItemCount(),
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen(true)}
        aria-label="Open cart"
      >
        <ShoppingBag className="size-5" />

        {mounted && itemCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] text-background">
            {itemCount}
          </span>
        ) : null}
      </Button>

      {mounted ? (
        <CartSheet
          open={open}
          onOpenChange={setOpen}
        />
      ) : null}
    </>
  );
}