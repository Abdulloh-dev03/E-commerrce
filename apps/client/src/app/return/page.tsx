import Link from "next/link";
import { CheckCircle, XCircle, ArrowRight, AlertCircle } from "lucide-react";

export default async function ReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }> | undefined;
}) {
  const session_id = (await searchParams)?.session_id;

  if (!session_id) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md p-8 bg-card rounded-2xl border border-border shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Session Missing
            </h1>
            <p className="text-muted-foreground">
              We couldn&apos;t detect a valid session ID. Please try initiating
              the payment again.
            </p>
            <Link
              href="/"
              className="mt-4 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL;
  const url = `${baseUrl}/sessions/${encodeURIComponent(session_id)}`;

  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
          <div className="w-full max-w-md p-8 bg-card rounded-2xl border border-border shadow-xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold">Error Fetching Status</h1>
              <p className="text-muted-foreground">
                Unable to retrieve payment details.
              </p>
              <Link href="/orders" className="text-primary hover:underline">
                View Orders
              </Link>
            </div>
          </div>
        </div>
      );
    }

    const data = await res.json();
    const isSuccess =
      data.status === "complete" ||
      data.status === "paid" ||
      data.status === "succeeded";

    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md bg-card rounded-3xl border border-border shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          {/* Header Status */}
          <div
            className={`p-8 text-center ${isSuccess ? "bg-green-500/10" : "bg-red-500/10"}`}
          >
            <div
              className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-sm ${isSuccess ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
            >
              {isSuccess ? (
                <CheckCircle className="w-10 h-10" />
              ) : (
                <XCircle className="w-10 h-10" />
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              {isSuccess ? "Payment Successful" : "Payment Failed"}
            </h1>
            <p className="text-muted-foreground font-medium">
              {isSuccess
                ? "Your order has been confirmed."
                : "There was an issue processing your payment."}
            </p>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-4 rounded-xl bg-muted/50 p-5 border border-border/50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-medium">
                  Payment Status
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isSuccess
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {data.status}
                </span>
              </div>
              {data.paymentStatus && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground font-medium">
                    Gateway Message
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {data.paymentStatus}
                  </span>
                </div>
              )}
            </div>

            <Link
              href="/orders"
              className="group w-full flex items-center justify-center px-6 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20"
            >
              View Your Orders
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/"
              className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-destructive/10 text-destructive mb-2">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">Service Unavailable</h2>
          <p className="text-muted-foreground">
            Unable to reach payment service.
          </p>
        </div>
      </div>
    );
  }
}
