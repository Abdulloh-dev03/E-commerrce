"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductType } from "@repo/types";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import EditProduct from "@/components/EditProduct";

export const columns: ColumnDef<ProductType>[] = [
  {
    id: "select",
    size: 40,
    maxSize: 40,
    minSize: 40,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(val) => row.toggleSelected(!!val)}
      />
    ),
  },

  {
    id: "image",
    header: "Image",
    size: 70,
    minSize: 70,
    maxSize: 70,
    cell: ({ row }) => {
      const product = row.original;
      const img = product.variants?.[0]?.images?.[0];

      return (
        <div className="w-12 h-12 relative rounded-lg overflow-hidden shadow-sm">
          <Image
            src={img || ""}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      );
    },
  },

  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{product.name}</span>
          <span className="text-xs text-muted-foreground">#{product.id}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="h-4 w-4 ml-2" />
      </Button>
    ),
    cell: ({ getValue }) => {
      const price = getValue<number>();
      return <span className="font-medium">${price.toFixed(2)}</span>;
    },
  },

  {
    accessorKey: "categorySlug",
    header: "Category",
    cell: ({ getValue }) => {
      const categorySlug = getValue<string>();

      return <Badge className="capitalize">{categorySlug}</Badge>;
    },
  },

  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => (
      <p className="line-clamp-2 text-sm text-muted-foreground">
        {getValue<string>()}
      </p>
    ),
  },

  {
    id: "actions",
    size: 50,
    cell: ({ row }) => {
      const product = row.original;

      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="cursor-pointer">
              Edit
            </Button>
          </SheetTrigger>
          <EditProduct product={product} />
        </Sheet>
      );
    },
  },
];
