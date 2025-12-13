import { CartStoreActionsType, CartStoreStateType } from "@repo/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Helper: Deep compare selectedAttributes objects
const attributesMatch = (
  a: Record<string, string>,
  b: Record<string, string>
): boolean => {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => a[key] === b[key]);
};

const useCartStore = create<CartStoreStateType & CartStoreActionsType>()(
  persist(
    (set, ) => ({
      cart: [],
      hasHydrated: false,

      addToCart: (product) =>
        set((state) => {
          const { cart } = state;

          // Find existing item with same product + color + attributes
          const existingIndex = cart.findIndex((item) => {
            return (
              item.id === product.id &&
              item.selectedColor === product.selectedColor &&
              attributesMatch(item.selectedAttributes, product.selectedAttributes)
            );
          });

          if (existingIndex !== -1) {
            // Item exists → increase quantity
            const updatedCart = [...cart];
            const existing = updatedCart[existingIndex]!;
            const incrementBy = product.quantity ?? 1;
            updatedCart[existingIndex] = {
              ...existing,
              quantity: existing.quantity + incrementBy,
            };
            return { cart: updatedCart };
          }

          // New item → add to cart
          return {
            cart: [
              ...cart,
              {
                ...product,
                quantity: product.quantity || 1,
                selectedColor: product.selectedColor,
                selectedAttributes: product.selectedAttributes,
              },
            ],
          };
        }),

      updateQuantity: (product, type) =>
        set((state) => {
          const { cart } = state;

          const index = cart.findIndex((item) => {
            return (
              item.id === product.id &&
              item.selectedColor === product.selectedColor &&
              attributesMatch(item.selectedAttributes, product.selectedAttributes)
            );
          });

          if (index === -1) return state;

          const updatedCart = [...cart];
          const item = updatedCart[index]!;
          const newQty =
            type === "increment" ? item.quantity + 1 : Math.max(1, item.quantity - 1);

          updatedCart[index] = { ...item, quantity: newQty };
          return { cart: updatedCart };
        }),

      removeFromCart: (product) =>
        set((state) => ({
          cart: state.cart.filter((item) => {
            return !(
              item.id === product.id &&
              item.selectedColor === product.selectedColor &&
              attributesMatch(item.selectedAttributes, product.selectedAttributes)
            );
          }),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    }
  )
);

export default useCartStore;