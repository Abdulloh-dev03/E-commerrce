"use client"

import Image from "next/image"
import ProductInteraction from "@/components/ProductInteraction"
import { useGetProductByIdQuery } from "@/redux/productsApi"
import RecommendedProducts from "./RecProducts"
import { Bouncy } from "ldrs/react"
import "ldrs/react/Bouncy.css"

import { useEffect, useMemo, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductType } from "@repo/types"

interface ProductPageClientProps {
  id: number
  color?: string
}

export default function ProductPageClient({ id, color: initialColor }: ProductPageClientProps) {
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(id) as {
    data: ProductType | undefined
    isLoading: boolean
    error: unknown
  }

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({})

  // ------------------------------------------------------------
  // INITIALIZE VARIANT + ATTRIBUTES
  // ------------------------------------------------------------
  useEffect(() => {
    if (!product) return

    const variants = product.variants || []

    // Variant selection
    let variantIdx = 0
    if (initialColor) {
      const found = variants.findIndex((v) => v.color === initialColor)
      if (found !== -1) variantIdx = found
    }

    setSelectedVariantIndex(variantIdx)
    setSelectedImageIndex(0)

    // Default attribute selection
    const defaults: Record<string, string> = {}
    for (const [key, value] of Object.entries(product.attributes)) {
      if (Array.isArray(value) && value.length > 0) {
        defaults[key] = String(value[0])
      }
    }

    setSelectedAttrs(defaults)
  }, [product, initialColor])

  // ------------------------------------------------------------
  // DERIVED MEMOS
  // ------------------------------------------------------------
  const selectedVariant = product?.variants?.[selectedVariantIndex]

  const galleryImages = useMemo(() => {
    return Array.isArray(selectedVariant?.images) ? selectedVariant.images : []
  }, [selectedVariant])

  const mainImageUrl = useMemo(() => {
    if (galleryImages[selectedImageIndex]) return galleryImages[selectedImageIndex]
    if (galleryImages[0]) return galleryImages[0]

    const fallbackVariant = (product?.variants ?? []).find((v) => (v.images ?? []).length > 0)
    return fallbackVariant?.images?.[0] || "/placeholder.svg"
  }, [galleryImages, selectedImageIndex, product?.variants])

  const sizeOptions = useMemo(() => {
    const sizeAttr = product?.attributes?.["size"]
    if (Array.isArray(sizeAttr)) return sizeAttr.map(String)
    return []
  }, [product?.attributes])

  const handleAttrChange = (key: string, value: string) => {
    setSelectedAttrs((prev) => ({ ...prev, [key]: value }))
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Bouncy size="80" speed="1.75" color="gray" />
      </div>
    )

  if (!product || error || isNaN(id)) {
    return <div className="text-center py-20 text-gray-500">Product not found</div>
  }


  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div className="w-full lg:w-5/12 lg:sticky lg:top-20 lg:self-start">
            <div className="relative aspect-[2/3] bg-gray-50 rounded-xl overflow-hidden shadow-md">
              <Image
                fill
                src={mainImageUrl}
                alt={`${product.name} - Main Image`}
                className="object-contain transition-transform duration-300 hover:scale-105"
                priority
                unoptimized
              />
            </div>

            {galleryImages.length > 1 && (
              <div className="flex overflow-x-auto gap-2 mt-4 pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                {galleryImages.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`border rounded-md w-16 h-16 overflow-hidden flex-shrink-0 transition-all`}
                  >
                    <Image src={img} alt={`${product.name} thumbnail`} width={64} height={64} className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

        
          <div className="w-full lg:w-7/12 flex flex-col gap-6">
            <h1 className="text-3xl font-serif tracking-tight">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
            <h2 className="text-4xl font-serif text-gray-900 dark:text-gray-200">${product.price.toFixed(2)}</h2>

            <hr className="my-4" />

            {/* SIZE SELECTOR */}
            {sizeOptions.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-100">Size</label>
                <Select
                  value={selectedAttrs["size"] || sizeOptions[0]}
                  onValueChange={(value) => handleAttrChange("size", value)}
                >
                  <SelectTrigger className="w-28 max-w-xs ">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* OTHER ATTRIBUTES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.entries(product.attributes).map(([key, options]) => {
                if (key === "size") return null
                if (!Array.isArray(options) || options.length === 0) return null

                return (
                  <div key={key} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 capitalize">{key}</label>

                    <Select
                      value={selectedAttrs[key] || String(options[0])}
                      onValueChange={(value) => handleAttrChange(key, value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder={`Select ${key}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((option) => (
                          <SelectItem key={String(option)} value={String(option)}>
                            {String(option)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )
              })}
            </div>

            {/* PRODUCT INTERACTION */}
            <div className=" rounded-x">
              <ProductInteraction
                product={product}
                selectedColor={selectedVariant?.color ?? ""}
                selectedAttributes={selectedAttrs}
                variants={product.variants}
                selectedVariantIndex={selectedVariantIndex}
                onSelectVariant={(idx) => {
                  setSelectedVariantIndex(idx)
                  setSelectedImageIndex(0)
                }}
                onAttributeChange={handleAttrChange}
              />
            </div>

            {/* PAYMENT LOGOS */}
            <div className="flex items-center gap-4 mt-6">
              <Image src="/klarna.png" alt="Klarna" width={60} height={30} className="rounded-md" />
              <Image src="/cards.png" alt="Cards" width={60} height={30} className="rounded-md" />
              <Image src="/stripe.png" alt="Stripe" width={60} height={30} className="rounded-md" />
            </div>

            <p className="text-gray-500 text-sm mt-4">
              By clicking Pay Now, you agree to our{" "}
              <span className="underline cursor-pointer">Terms & Conditions</span> and{" "}
              <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>

      {/* RECOMMENDED */}
      <div className="container mx-auto px-4 mt-24 mb-12">
        <hr />
        <RecommendedProducts currentProductId={id} />
      </div>
    </>
  )
}
