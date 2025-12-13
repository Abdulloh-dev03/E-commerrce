import SingleUserClientPage from "@/components/SingleUserClientPage";
import { auth } from "@clerk/nextjs/server";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const { id } = params;

  const { getToken } = await auth();
  const token = await getToken();

  return <SingleUserClientPage token={token!} userId={id} />;
}
