"use client";

import useCartStore from "@/stores/cartStore";
import { ProductType, VariantType } from "@repo/types";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { RiShoppingBag3Fill } from "react-icons/ri";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProductInteraction = ({
  product,
  selectedColor,
  selectedAttributes,
  variants,
  selectedVariantIndex,
  onSelectVariant,
}: {
  product: ProductType;
  selectedColor: string;
  selectedAttributes: Record<string, string>;
  variants: VariantType[];
  selectedVariantIndex: number;
  onSelectVariant: (index: number) => void;
  onAttributeChange: (key: string, value: string) => void;
}) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore();
  const router = useRouter();

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
      selectedColor,
      selectedAttributes,
    });
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    // Add to cart
    addToCart({
      ...product,
      quantity,
      selectedColor,
      selectedAttributes,
    });
    toast.success("Proceeding to checkout");
    // Navigate to cart page
    router.push("/cart");
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 dark:border-stone-800 bg-white dark:bg-zinc-900 p-6 shadow-md flex flex-col gap-6 transition-all duration-300">
      <div className="flex items-center gap-6 bg-gray-100 dark:bg-zinc-800 rounded-lg w-full p-3 flex-wrap">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleQuantityChange("decrement")}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="font-semibold w-4 text-center">{quantity}</span>

          <button
            onClick={() => handleQuantityChange("increment")}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Variant thumbnails (moved here next to quantity) */}
        {variants && variants.length > 0 && (
          <div className="flex items-center gap-3">
            {variants.map((v, idx) => {
              const thumb =
                Array.isArray(v.images) && v.images.length > 0
                  ? v.images[0]
                  : "/placeholder.svg";
              const selected = idx === selectedVariantIndex;
              return (
                <button
                  key={v.id ?? idx}
                  onClick={() => onSelectVariant(idx)}
                  className={`border rounded-xl overflow-hidden w-[64px] h-[64px] transition-all cursor-pointer ${
                    selected
                      ? "border-gray-900"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                  aria-label={`Select variant ${v.color}`}
                >
                  <Image
                    width={64}
                    height={64}
                    src={thumb ?? "/placeholder.svg"}
                    alt={v.color}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    unoptimized
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <Button onClick={handleAddToCart} className="cursor-pointer">
        <ShoppingCart className="w-4 h-4" />
        Add to Cart
      </Button>

      <Button
        variant={"outline"}
        className="cursor-pointer"
        onClick={handleBuyNow}
      >
        <RiShoppingBag3Fill className="w-4 h-4" />
        Buy this Item
      </Button>
    </div>
  );
};

export default ProductInteraction;
