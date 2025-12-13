"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { CategoryType } from "@repo/types";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import EditCategories from "@/components/EditCategories";

export const columns: ColumnDef<CategoryType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{category.name}</span>
          <span className="text-xs text-muted-foreground">
            ID: {category.id}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono">
        {row.getValue("slug")}
      </Badge>
    ),
  },
  {
    accessorKey: "attributes",
    header: "Attributes",
    cell: ({ row }) => {
      const attributes = row.getValue("attributes");
      const count = Array.isArray(attributes) ? attributes.length : 0;
      return (
        <div className="text-sm text-muted-foreground">
          {count} {count === 1 ? "Attribute" : "Attributes"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="cursor-pointer">
              Edit
            </Button>
          </SheetTrigger>
          <EditCategories category={category} />
        </Sheet>
      );
    },
  },
];
