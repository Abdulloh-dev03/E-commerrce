"use client";

import { columns } from "@/app/(dashboard)/users/columns";
import { DataTable } from "@/app/(dashboard)/users/data-table";
import { useGetUsersQuery } from "@/redux/usersApi";

interface Props {
  token: string;
}
const UsersClientPage = ({ token }: Props) => {
  const { data:users, isLoading, isError } = useGetUsersQuery(token);
  
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load users.</p>;

  return <DataTable columns={columns} data={users?.data.data ?? []} />;
};

export default UsersClientPage;



