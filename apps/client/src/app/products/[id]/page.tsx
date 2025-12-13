// app/products/[id]/page.tsx
import { notFound } from "next/navigation";
import ProductPageClient from "@/components/ProductPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${id}`,
      { cache: "no-store" } // or next: { revalidate: 60 } for ISR
    );

    if (!res.ok) throw new Error("Product not found");

    const response = await res.json();
    const product = response.data;

    // Grab the first image from any variant
    const firstImage =
      product?.variants?.[0]?.images?.[0] ||
      product?.variants?.find((v: any) => Array.isArray(v.images) && v.images.length > 0)?.images?.[0] ||
      "/fallback-image.png";

    return {
      title: `${product.name} | MyStore`,
      description: product.shortDescription || product.description,
      openGraph: {
        title: product.name,
        description: product.shortDescription || product.description,
        images: [firstImage],
        // "product" is NOT a valid og:type → use one of the allowed values
        type: "website", // <-- this is the fix
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.shortDescription || product.description,
        images: [firstImage],
      },
    };
  } catch {
    return {
      title: "Product Not Found | MyStore",
      description: "The product you are looking for does not exist.",
    };
  }
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ color?: string }>; // size removed
}) {
  const { id } = await params;
  const { color } = await searchParams;

  const productId = Number(id);
  if (isNaN(productId)) notFound();

  let product;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${id}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch product");
    const response = await res.json();
    product = response.data;
  } catch {
    notFound();
  }

  // Validate that the requested color actually exists on this product
  const validColor =
    color && product?.variants?.some((v: any) => v.color === color)
      ? color
      : undefined;

  return (
    <ProductPageClient
      id={productId}
      color={validColor} 
    />
  );
}