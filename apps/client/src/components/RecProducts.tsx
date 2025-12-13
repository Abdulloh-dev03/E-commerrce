"use client";

import { useGetProductsQuery } from "@/redux/productsApi";

import ProductCard from "./ProductCard";

export default function RecommendedProducts({ currentProductId }: { currentProductId: number }) {
  const { data: products, isLoading } = useGetProductsQuery({});

  if (isLoading) return <p>Loading recommendations...</p>;

  const filtered = products?.filter(p => p.id !== currentProductId).slice(0, 4);

  return (
    <div className="mt-20">
      <h2 className="text-xl font-semibold mb-4">Recommended Products</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {filtered?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
