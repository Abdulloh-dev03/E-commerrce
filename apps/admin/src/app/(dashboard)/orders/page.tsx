
import OrderTableClient from "@/components/OrderTableClient";
import { auth } from "@clerk/nextjs/server";

const OrdersPage = async () => {
  const { getToken } = await auth();
  const token = await getToken();

  return (
    <div>
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Orders</h1>
      </div>
      <OrderTableClient token={token!} />
    </div>
  );
};

export default OrdersPage;
