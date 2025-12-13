"use client";

import { columns } from "@/app/(dashboard)/products/columns";
import { DataTable } from "@/app/(dashboard)/products/data-table";
import { useGetProductsQuery } from "@/redux/productsApi";
import { Loader2 } from "lucide-react";


export default function ProductTableClient() {
  const { data:products, isLoading, error } = useGetProductsQuery({});

  if (isLoading)
    return (
       <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin" />
        </div>
    );

  if (error)
    return <p className="text-center text-red-500">Failed to load products.</p>;

  return <DataTable columns={columns} data={products ?? []}/>;
}
