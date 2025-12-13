"use client";

import { columns } from "@/app/(dashboard)/orders/columns";
import { DataTable } from "@/app/(dashboard)/orders/data-table";
import { useGetOrdersQuery } from "@/redux/orderApi";

interface Props {
  token: string;
}

export default function OrderTableClient({ token }: Props) {
  const { data: orders, isLoading, error } = useGetOrdersQuery({ token });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading orders</div>;

  return <DataTable data={orders ?? []} columns={columns} />;
}
