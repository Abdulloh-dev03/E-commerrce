"use client";

import useCartStore from "@/stores/cartStore";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ShoppingCartIcon = () => {
  const { cart, hasHydrated } = useCartStore();

  if (!hasHydrated) return null;

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link href="/cart">
      <Button
        size="sm"
        className="text-sm font-medium px-4 h-9 rounded-md shadow-sm cursor-pointer flex items-center gap-2"
      >
        <span className="flex items-baseline gap-2">
          <ShoppingCart className="w-5 h-5" />
          <span className="text-primary-foreground/60 text-sm">
            {cartCount}
          </span>
        </span>
      </Button>
    </Link>
  );
};

export default ShoppingCartIcon;
