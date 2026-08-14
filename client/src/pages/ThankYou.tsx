import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Mail, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function ThankYou() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id");
    if (sid) {
      setSessionId(sid);
    }
  }, []);

  const { data: orderDetails, isLoading, error } = trpc.stripe.getCheckoutSession.useQuery(
    { sessionId: sessionId || "" },
    { enabled: !!sessionId && isAuthenticated }
  );

  const formatAmount = (cents: number, currency: string) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    });
    return formatter.format(cents / 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-green-500 rounded-full blur-xl opacity-20 animate-pulse" />
            <CheckCircle2 className="w-24 h-24 text-green-500 relative" />
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 font-mono">Payment Successful</h1>
          <p className="text-xl text-foreground/70 mb-2">
            Thank you for your purchase! Your order has been confirmed.
          </p>
          {sessionId && (
            <p className="text-sm text-foreground/50 font-mono">
              Order ID: {sessionId.substring(0, 16)}...
            </p>
          )}
        </div>

        {/* Order Details */}
        {isLoading ? (
          <div className="bg-card border border-border rounded-lg p-8 mb-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500 mr-2" />
            <span className="text-foreground/70">Loading order details...</span>
          </div>
        ) : error ? (
          <div className="bg-card border border-red-500/30 rounded-lg p-8 mb-8">
            <p className="text-red-500 font-mono">Unable to load order details</p>
            <p className="text-sm text-foreground/50 mt-2">Please check your email for confirmation</p>
          </div>
        ) : orderDetails ? (
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <h2 className="text-lg font-bold mb-6 font-mono text-amber-500">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-start pb-4 border-b border-border/50">
                <div>
                  <p className="font-mono font-semibold text-foreground">{orderDetails.productName}</p>
                </div>
                <p className="font-mono text-lg font-bold text-green-500">
                  {formatAmount(orderDetails.amount, orderDetails.currency)}
                </p>
              </div>

              <div className="pt-4">
                <p className="text-sm text-foreground/70">
                  <span className="font-mono">Status: </span>
                  <span className="font-mono font-semibold capitalize text-green-500">
                    {orderDetails.status === "paid" ? "Confirmed" : orderDetails.status}
                  </span>
                </p>
                <p className="text-sm text-foreground/70 mt-2">
                  <span className="font-mono">Order Date: </span>
                  <span className="font-mono">
                    {new Date(orderDetails.createdAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* What Happens Next */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-lg font-bold mb-6 font-mono text-amber-500">What Happens Next</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <Mail className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-mono font-semibold mb-1">Receipt Email</p>
                <p className="text-sm text-foreground/70">
                  A detailed receipt and invoice have been sent to your email address. Check your inbox (and spam folder) within the next few minutes.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Download className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-mono font-semibold mb-1">Access Your Purchase</p>
                <p className="text-sm text-foreground/70">
                  Log in to your account to access your purchased assets, subscriptions, and download materials from your client portal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => (window.location.href = "/portal")}
            className="bg-green-600 hover:bg-green-700 text-white font-mono"
          >
            {isAuthenticated ? "View My Portal" : "Sign In to View My Portal"}
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="border-amber-500 text-amber-500 hover:bg-amber-500/10 font-mono"
          >
            Return Home
          </Button>
        </div>

        {/* Support Section */}
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-foreground/50">
          <p className="mb-2">Questions about your order?</p>
          <a href="/#contact" className="text-green-500 hover:text-green-400 font-mono">
            Contact our support team →
          </a>
        </div>
      </div>
    </div>
  );
}
