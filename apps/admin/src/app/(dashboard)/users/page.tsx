
import UsersClientPage from "@/components/UserClientPage";
import { auth } from "@clerk/nextjs/server";

const UsersPage = async () => {
  const { getToken } = await auth();
  const token = await getToken();

  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Users</h1>
      </div>
      <UsersClientPage token={token!} />
    </div>
  );
};

export default UsersPage;
