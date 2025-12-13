"use client";

import React, { useEffect, useMemo, useState } from "react";
import useCartStore from "@/stores/cartStore";
import { ProductType } from "@repo/types";
import { Info, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Button } from "./ui/button";


const ProductCard = ({ product }: { product: ProductType }) => {
  const router = useRouter();
  const { addToCart } = useCartStore();

  // Attributes from product.attributes JSON
  const attributeKeys = useMemo(
    () => (product.attributes ? Object.keys(product.attributes) : []),
    [product.attributes]
  );

  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  useEffect(() => {
    const defaults: Record<string, string> = {};
    attributeKeys.forEach((key) => {
      const options = product.attributes?.[key];
      if (Array.isArray(options) && options.length > 0) {
        defaults[key] = String(options[0]);
      }
    });
    setSelectedAttributes(defaults);
  }, [product, attributeKeys]);

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart({
      ...product,
      quantity: 1,
      selectedColor: "",
      selectedAttributes,
    });
    toast.success("Product added to cart");
  };

  const getImages = (): string[] => {
    if (!Array.isArray(product.variants) || product.variants.length === 0) return ["/placeholder.png"];
    const allImages: string[] = [];
    product.variants.forEach((v) => {
      if (Array.isArray(v.images) && v.images.length > 0) {
        allImages.push(...v.images);
      }
    });
    return allImages.length > 0 ? allImages : ["/placeholder.png"];
  };

  const images = getImages();

  return (
    <div
      className="group rounded-xl overflow-hidden bg-white dark:bg-neutral-900 shadow-md ring-1 ring-gray-200 dark:ring-neutral-800 hover:shadow-xl transition-all duration-300 cursor-pointer"
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && e.currentTarget === e.target) {
          e.preventDefault();
          router.push(`/products/${product.id}`);
        }
      }}
    >
      <div className="relative aspect-[2/3]">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          loop={images.length > 1}
          autoplay={images.length > 1 ? { delay: 3000, disableOnInteraction: true } : false}
          pagination={{ clickable: true, dynamicBullets: true, dynamicMainBullets: 3 }}
          className="w-full h-full"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <Image
                src={img}
                alt={`${product.name} - Image ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product.shortDescription}</p>

        <div className="flex flex-wrap gap-4 text-xs">
          <span className="font-mono text-lg text-gray-900 dark:text-gray-100">${(product.price ?? 0).toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between mt-2 gap-2">
          <Button 
          variant={"ghost"}
          onClick={() => router.push(`/products/${product.id}`)}
          className="cursor-pointer">
            <Info className="w-4 h-4" />
            More Details
          </Button>
          <Button
          variant={"ghost"}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;