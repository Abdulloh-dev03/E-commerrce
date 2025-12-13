"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "@/components/TablePagination";
import { useAuth } from "@clerk/nextjs";
import { useDeleteUserMutation } from "@/redux/usersApi";
import { message } from "antd";
import { User } from "@clerk/nextjs/server";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const { getToken } = useAuth();
  const router = useRouter();
    const [deleteUser,{isLoading}] = useDeleteUserMutation();
  
    const handleDeleteUser = async () => {
      const selectedRows = table.getSelectedRowModel().rows;
      Promise.all(selectedRows.map(async (row) => {
        const userId = (row.original as User).id
        try {
          const token = await getToken();
          if (!token) {
            message.error("You must be logged in");
            return;
          }
          await deleteUser({ id:userId, token }).unwrap();
          message.success("User deleted successfully");
          router.refresh();
        } catch (error: any) {
          console.error("Failed to delete user:", error);
          message.error(error.data?.message || "Failed to delete user");
        }
      }))
    };


  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const hasSelection = Object.keys(rowSelection).length > 0;

  return (
    <div className="w-full border rounded-xl bg-card shadow-sm">

      {hasSelection && (
        <div className="flex justify-end p-3">
          <button 
          className="flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          onClick={handleDeleteUser}
          disabled={isLoading}
          
          >
            <Trash2 className="w-4 h-4" />
            {isLoading ? "Deleting..." : "Delete Users(s)"}
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl">
        <Table className="w-full table-fixed">
          <TableHeader className="bg-muted/30 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className="transition hover:bg-muted/20"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <DataTablePagination table={table} />
      </div>

    </div>
  );
}
