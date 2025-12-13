"use client";

import { columns } from "@/app/(dashboard)/categories/columns";
import { DataTable } from "@/app/(dashboard)/categories/data-table";
import { useGetCategoriesQuery } from "@/redux/categoryApi";
import { Loader2 } from "lucide-react";


export default function CategoriesTable() {
  const { data:categories, isLoading, error } = useGetCategoriesQuery();

  if (isLoading)
    return (
       <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin" />
        </div>
    );

  if (error)
    return <p className="text-center text-red-500">Failed to load categories.</p>;

  return <DataTable columns={columns} data={categories ?? []}/>;
}
