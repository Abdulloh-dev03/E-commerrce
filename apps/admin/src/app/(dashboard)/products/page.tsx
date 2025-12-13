import ProductTableClient from "@/components/ProductTableClient";

export default async function ProductsPage() {
  return (
    <div className="w-full">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Products</h1>
      </div>
      <ProductTableClient />
    </div>
  );
}
