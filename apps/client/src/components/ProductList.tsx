"use client"
import Categories from "./Categories";
import ProductCard from "./ProductCard";
import Filter from "./Filter";
import { useGetProductsQuery } from "@/redux/productsApi";
import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'
import Link from "next/link";


const ProductList = ({ category,sort, search, params }: 
  { 
    category: string,
    sort:string, 
    search:string, 
    params:"homepage" | "products" 
}) => {
  const { data: products, isLoading, error } = useGetProductsQuery({
  category,
  search,
  sort,
  });
  if (isLoading) return <div 
  className="flex justify-center items-center h-screen">
  <Bouncy
  size="80"
  speed="1.75"
  color="gray" 
/></div>
  if (error) return <div className="flex justify-center items-center h-screen">Error loading products</div>;

  return (
    <div className="w-full">
      <Categories />
      {params === "products" && <Filter/>}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Link
        href={category ? `/products/?category=${category}` : "/products"}
        className="flex justify-end mt-4 underline text-sm text-gray-500"
      >
        View all products
      </Link>
    </div>
  );
};

export default ProductList;
