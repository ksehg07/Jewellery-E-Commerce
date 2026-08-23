import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem } from "./types";

type CartStore = {
  items: CartItem[];

  addItem: (item: CartItem) => void;

  removeItem: (id: string) => void;

  updateQuantity: (
    id: string,
    quantity: number,
  ) => void;

  clearCart: () => void;

  getItemCount: () => number;

  getSubtotal: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existingItem = get().items.find(
          (cartItem) => cartItem.id === item.id,
        );

        if (existingItem) {
          set({
            items: get().items.map((cartItem) =>
              cartItem.id === item.id
                ? {
                    ...cartItem,
                    quantity: cartItem.quantity + item.quantity,
                  }
                : cartItem,
            ),
          });

          return;
        }

        set({
          items: [...get().items, item],
        });
      },

      removeItem: (id) => {
        set({
          items: get().items.filter(
            (item) => item.id !== id,
          ),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity,
                }
              : item,
          ),
        });
      },

      clearCart: () => {
        set({
          items: [],
        });
      },

      getItemCount: () => {
        return get().items.reduce(
          (total, item) => total + item.quantity,
          0,
        );
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) =>
            total + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "npj-cart",
    },
  ),
);