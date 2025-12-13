// app/orders/page.tsx (Server Component)
import OrdersList from "@/components/OrderList";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Lock } from "lucide-react";

export default async function OrdersPage() {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8">
        <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-3 tracking-tight">
          Access Restricted
        </h1>
        <p className="text-muted-foreground mb-8 text-lg max-w-md">
          Please sign in to access your order history and details.
        </p>
        <Link
          href="/sign-in"
          className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return <OrdersList token={token} />;
}
