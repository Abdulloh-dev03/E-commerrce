// app/orders/OrdersList.tsx (Client Component)
"use client";

import { useGetOrdersQuery } from "@/redux/orderApi";
import {
  Package,
  Calendar,
  DollarSign,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface Props {
  token: string;
}

export default function OrdersList({ token }: Props) {
  const { data: orders, isLoading, error } = useGetOrdersQuery(token);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground animate-in fade-in duration-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-2xl bg-destructive/5 border border-destructive/20 text-center max-w-2xl mx-auto mt-10">
        <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-destructive mb-2">
          Unable to load orders
        </h2>
        <p className="text-muted-foreground mb-4">
          We encountered a problem fetching your order history.
        </p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-muted/20 rounded-3xl border border-dashed border-border mt-8">
        <Package className="w-20 h-20 text-muted-foreground/30 mb-6" />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          No Orders Found
        </h2>
        <p className="text-muted-foreground max-w-md">
          Looks like you haven&apos;t placed any orders yet. Start shopping to
          fill this space!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent inline-block">
        Your Orders
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="group bg-card hover:bg-card/80 border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            <div className="p-6 border-b border-border/50 bg-muted/30 flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
                  Order ID
                </p>
                <p
                  className="font-mono text-sm font-semibold text-foreground truncate max-w-[150px]"
                  title={order._id}
                >
                  #{order._id.slice(-8)}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  order.status === "success"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="p-6 flex-grow space-y-4">
              <div className="flex items-center text-muted-foreground text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "-"}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Products
                </p>
                <div className="space-y-1">
                  {order.products?.slice(0, 3).map((product, idx) => (
                    <div
                      key={idx}
                      className="text-sm font-medium truncate flex items-center justify-between"
                    >
                      <div className="flex items-center truncate">
                        <span className="w-1.5 h-1.5 min-w-[6px] rounded-full bg-primary/50 mr-2"></span>
                        <span className="truncate">{product.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                        x{product.quantity}
                      </span>
                    </div>
                  ))}
                  {(order.products?.length || 0) > 3 && (
                    <p className="text-xs text-muted-foreground pl-3.5">
                      + {(order.products?.length || 0) - 3} more items
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 mt-auto">
              <div className="rounded-xl bg-primary/5 p-4 flex justify-between items-center">
                <span className="font-medium text-muted-foreground">Total</span>
                <div className="flex items-center text-primary font-bold text-lg">
                  <DollarSign className="w-5 h-5 mr-0.5" />
                  {(order.amount / 100).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
