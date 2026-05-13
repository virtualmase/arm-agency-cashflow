import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import {
  CreditCard, FileText, Download, ExternalLink,
  Package, Clock, CheckCircle2, XCircle, AlertCircle, ArrowLeft, Ban
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ClientPortal() {
  const { user, loading } = useAuth();

  if (loading) return <PortalSkeleton />;
  if (!user) return <LoginPrompt />;

  return (
    <div className="min-h-screen text-[#c8cfc8] font-mono">
      <PortalNav />
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-24 pb-16">
        <div className="text-[11px] tracking-[0.2em] uppercase text-[#3ddc84] mb-4 flex items-center gap-2.5">
          Client Portal <div className="flex-1 max-w-[60px] h-px bg-[#1a7040]" />
        </div>
        <h1 className="text-3xl font-light text-[#eaf0ea] tracking-tight mb-2">
          Welcome back, {user.name || user.email || "Operator"}
        </h1>
        <p className="text-[14px] text-[#667066] mb-10 font-sans">
          View your active subscriptions, purchased assets, and download invoices.
        </p>

        <PortalSummary />
        <SubscriptionsSection />
        <PurchasesSection />
        <InvoicesSection />
      </div>
    </div>
  );
}

// ── NAV ──
function PortalNav() {
  const { user } = useAuth();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 h-[60px] bg-[#080a08]/85 backdrop-blur-xl border-b border-white/[0.07]">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-7 h-7 border border-[#e8a020] flex items-center justify-center text-[11px] font-semibold text-[#e8a020]">ARM</div>
          <span className="text-[13px] font-medium tracking-[0.1em] uppercase text-[#eaf0ea] hidden sm:inline">Client Portal</span>
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/" className="text-[12px] tracking-[0.08em] uppercase text-[#667066] hover:text-[#e8a020] transition-colors no-underline hidden md:inline">Home</Link>
        <Link href="/#pricing" className="text-[12px] tracking-[0.08em] uppercase text-[#667066] hover:text-[#e8a020] transition-colors no-underline hidden md:inline">Pricing</Link>
        {user?.role === "admin" && (
          <Link href="/admin" className="text-[12px] tracking-[0.08em] uppercase text-[#3ddc84] hover:text-[#3ddc84]/80 transition-colors no-underline hidden md:inline">Dashboard</Link>
        )}
        <Link href="/satisfaction" className="text-[12px] tracking-[0.08em] uppercase text-[#667066] hover:text-[#3ddc84] transition-colors no-underline hidden md:inline">Team Health</Link>
      </div>
    </nav>
  );
}

// ── SUMMARY CARDS ──
function PortalSummary() {
  const { data: summary, isLoading } = trpc.portal.summary.useQuery();

  if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">{[1, 2, 3].map(i => <div key={i} className="h-24 bg-[#0d100d] border border-white/[0.07] animate-pulse" />)}</div>;

  const planLabel = summary?.plan === "pro" ? "ARM Pro" : summary?.plan === "enterprise" ? "Enterprise" : "Starter";
  const planColor = summary?.plan === "pro" ? "#e8a020" : summary?.plan === "enterprise" ? "#a78bfa" : "#667066";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      <div className="p-6 bg-[#0d100d] border border-white/[0.07]">
        <div className="flex items-center gap-3 mb-2">
          <Package size={16} style={{ color: planColor }} />
          <span className="text-[10px] tracking-[0.12em] uppercase text-[#667066]">Current Plan</span>
        </div>
        <div className="text-xl font-medium" style={{ color: planColor }}>{planLabel}</div>
      </div>
      <div className="p-6 bg-[#0d100d] border border-white/[0.07]">
        <div className="flex items-center gap-3 mb-2">
          <CreditCard size={16} className="text-[#3ddc84]" />
          <span className="text-[10px] tracking-[0.12em] uppercase text-[#667066]">Stripe Status</span>
        </div>
        <div className="text-xl font-medium text-[#eaf0ea]">
          {summary?.stripeCustomerId ? (
            <span className="text-[#3ddc84]">Connected</span>
          ) : (
            <span className="text-[#667066]">Not linked</span>
          )}
        </div>
      </div>
      <div className="p-6 bg-[#0d100d] border border-white/[0.07]">
        <div className="flex items-center gap-3 mb-2">
          <FileText size={16} className="text-[#e8a020]" />
          <span className="text-[10px] tracking-[0.12em] uppercase text-[#667066]">Account</span>
        </div>
        <div className="text-sm text-[#eaf0ea] truncate">{summary?.email || "—"}</div>
        <div className="text-[12px] text-[#667066] mt-0.5">{summary?.name || "—"}</div>
      </div>
    </div>
  );
}

// ── SUBSCRIPTIONS ──
function SubscriptionsSection() {
  const { data: subscriptions, isLoading } = trpc.portal.mySubscriptions.useQuery();
  const utils = trpc.useUtils();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const cancelMutation = trpc.portal.cancelSubscription.useMutation({
    onSuccess: (data) => {
      toast.success(
        data.currentPeriodEnd
          ? `Subscription will cancel on ${new Date(data.currentPeriodEnd).toLocaleDateString()}. You retain access until then.`
          : "Subscription cancellation scheduled."
      );
      setConfirmingId(null);
      utils.portal.mySubscriptions.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
      setConfirmingId(null);
    },
  });

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <CreditCard size={18} className="text-[#e8a020]" />
        <h2 className="text-lg font-light text-[#eaf0ea]">Active Subscriptions</h2>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2].map(i => <div key={i} className="h-28 bg-[#0d100d] border border-white/[0.07] animate-pulse" />)}</div>
      ) : !subscriptions?.length ? (
        <div className="p-8 bg-[#0d100d] border border-white/[0.07] text-center">
          <div className="text-[#667066] text-[13px] mb-3">No active subscriptions</div>
          <Link href="/#pricing" className="text-[#e8a020] text-[12px] tracking-[0.1em] uppercase no-underline hover:opacity-80 transition-opacity">
            Browse Plans →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {subscriptions.map(sub => (
            <div key={sub.id} className="p-6 bg-[#0d100d] border border-white/[0.07] hover:border-white/10 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  {sub.items.map((item, i) => (
                    <div key={i}>
                      <div className="text-[15px] font-medium text-[#eaf0ea]">{item.productName}</div>
                      {item.productDescription && <div className="text-[12px] text-[#667066] mt-0.5">{item.productDescription}</div>}
                    </div>
                  ))}
                </div>
                <StatusBadge status={sub.status} />
              </div>
              <div className="flex flex-wrap items-center gap-6 text-[12px]">
                {sub.items.map((item, i) => (
                  <div key={i} className="text-[#3ddc84]">
                    ${(item.amount / 100).toLocaleString()}<span className="text-[#667066]">/{item.interval}</span>
                  </div>
                ))}
                {sub.currentPeriodEnd && (
                  <div className="text-[#667066]">
                    <Clock size={12} className="inline mr-1" />
                    {sub.cancelAtPeriodEnd ? "Access until" : "Renews"} {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                  </div>
                )}
                {sub.cancelAtPeriodEnd ? (
                  <div className="text-[#e8a020]">
                    <AlertCircle size={12} className="inline mr-1" />
                    Cancellation scheduled
                  </div>
                ) : (sub.status === "active" || sub.status === "trialing") ? (
                  <div className="ml-auto">
                    <AlertDialog open={confirmingId === sub.id} onOpenChange={(open) => { if (!open) setConfirmingId(null); }}>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={() => setConfirmingId(sub.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#ff4444]/30 text-[#ff4444] text-[10px] tracking-[0.1em] uppercase hover:border-[#ff4444] transition-all"
                        >
                          <Ban size={11} /> Cancel Subscription
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#0d100d] border border-white/[0.07] text-[#c8cfc8] font-mono max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-[#eaf0ea] text-lg font-light tracking-tight">
                            Cancel subscription?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-[#667066] text-[13px] leading-relaxed font-sans">
                            Your subscription will remain active until the end of the current billing period
                            {sub.currentPeriodEnd && (
                              <span className="text-[#e8a020]"> ({new Date(sub.currentPeriodEnd).toLocaleDateString()})</span>
                            )}. After that, you will lose access to the associated services. This action can be reversed by contacting support before the period ends.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-3 mt-4">
                          <AlertDialogCancel className="bg-transparent border border-white/[0.07] text-[#667066] text-[11px] tracking-[0.1em] uppercase hover:border-[#667066] hover:text-[#c8cfc8] font-mono">
                            Keep Subscription
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => cancelMutation.mutate({ subscriptionId: sub.id })}
                            disabled={cancelMutation.isPending}
                            className="bg-[#ff4444] text-white border-none text-[11px] tracking-[0.1em] uppercase hover:bg-[#ff4444]/80 font-mono disabled:opacity-50"
                          >
                            {cancelMutation.isPending ? "Cancelling..." : "Confirm Cancellation"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── PURCHASES ──
function PurchasesSection() {
  const { data: purchases, isLoading } = trpc.portal.myPurchases.useQuery();

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <Package size={18} className="text-[#3ddc84]" />
        <h2 className="text-lg font-light text-[#eaf0ea]">Purchased Assets</h2>
      </div>

      {isLoading ? (
        <div className="h-32 bg-[#0d100d] border border-white/[0.07] animate-pulse" />
      ) : !purchases?.length ? (
        <div className="p-8 bg-[#0d100d] border border-white/[0.07] text-center">
          <div className="text-[#667066] text-[13px] mb-3">No purchases yet</div>
          <Link href="/#pricing" className="text-[#3ddc84] text-[12px] tracking-[0.1em] uppercase no-underline hover:opacity-80 transition-opacity">
            Browse Packages →
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.07]">
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Package</th>
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Amount</th>
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Status</th>
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(p => (
                <tr key={p.id} className="border-b border-white/[0.03] hover:bg-[#111411] transition-colors">
                  <td className="py-3 text-[#eaf0ea]">{p.packageName}</td>
                  <td className="py-3 text-[#3ddc84]">${(p.amount / 100).toLocaleString()}</td>
                  <td className="py-3"><StatusBadge status={p.status} /></td>
                  <td className="py-3 text-[#667066]">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── INVOICES ──
function InvoicesSection() {
  const { data: invoices, isLoading } = trpc.portal.myInvoices.useQuery();

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <FileText size={18} className="text-[#a78bfa]" />
        <h2 className="text-lg font-light text-[#eaf0ea]">Invoices</h2>
      </div>

      {isLoading ? (
        <div className="h-32 bg-[#0d100d] border border-white/[0.07] animate-pulse" />
      ) : !invoices?.length ? (
        <div className="p-8 bg-[#0d100d] border border-white/[0.07] text-center">
          <div className="text-[#667066] text-[13px]">No invoices available</div>
          <div className="text-[#667066] text-[11px] mt-1">Invoices will appear here after your first payment.</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.07]">
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Invoice</th>
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Description</th>
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Amount</th>
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Status</th>
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Date</th>
                <th className="text-right py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-b border-white/[0.03] hover:bg-[#111411] transition-colors">
                  <td className="py-3 text-[#eaf0ea] font-medium">{inv.number || inv.id.slice(0, 16)}</td>
                  <td className="py-3 text-[#667066] max-w-[200px] truncate">{inv.description || "—"}</td>
                  <td className="py-3 text-[#3ddc84]">
                    ${((inv.amountPaid || inv.amountDue) / 100).toLocaleString()}
                    <span className="text-[#667066] ml-1 text-[11px]">{inv.currency.toUpperCase()}</span>
                  </td>
                  <td className="py-3"><StatusBadge status={inv.status || "unknown"} /></td>
                  <td className="py-3 text-[#667066]">{new Date(inv.created).toLocaleDateString()}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inv.invoicePdf && (
                        <a href={inv.invoicePdf} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 border border-[#a78bfa]/30 text-[#a78bfa] text-[10px] tracking-[0.1em] uppercase no-underline hover:bg-[#a78bfa] hover:text-[#080a08] transition-all">
                          <Download size={11} /> PDF
                        </a>
                      )}
                      {inv.hostedInvoiceUrl && (
                        <a href={inv.hostedInvoiceUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 border border-white/[0.07] text-[#667066] text-[10px] tracking-[0.1em] uppercase no-underline hover:border-[#e8a020] hover:text-[#e8a020] transition-all">
                          <ExternalLink size={11} /> View
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── STATUS BADGE ──
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; borderColor: string; icon: typeof CheckCircle2 }> = {
    active: { color: "#3ddc84", borderColor: "#1a7040", icon: CheckCircle2 },
    completed: { color: "#3ddc84", borderColor: "#1a7040", icon: CheckCircle2 },
    paid: { color: "#3ddc84", borderColor: "#1a7040", icon: CheckCircle2 },
    trialing: { color: "#a78bfa", borderColor: "#7b5ea7", icon: Clock },
    pending: { color: "#e8a020", borderColor: "#a06010", icon: Clock },
    open: { color: "#e8a020", borderColor: "#a06010", icon: Clock },
    draft: { color: "#667066", borderColor: "#667066", icon: FileText },
    canceled: { color: "#ff4444", borderColor: "#ff4444", icon: XCircle },
    cancelled: { color: "#ff4444", borderColor: "#ff4444", icon: XCircle },
    refunded: { color: "#ff4444", borderColor: "#ff4444", icon: XCircle },
    past_due: { color: "#ff4444", borderColor: "#ff4444", icon: AlertCircle },
    incomplete: { color: "#e8a020", borderColor: "#a06010", icon: AlertCircle },
    void: { color: "#667066", borderColor: "#667066", icon: XCircle },
    uncollectible: { color: "#667066", borderColor: "#667066", icon: XCircle },
  };
  const c = config[status] || { color: "#667066", borderColor: "#667066", icon: AlertCircle };
  const Icon = c.icon;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 border text-[11px] tracking-[0.05em] uppercase"
      style={{ color: c.color, borderColor: c.borderColor }}>
      <Icon size={11} /> {status}
    </span>
  );
}

// ── SKELETON ──
function PortalSkeleton() {
  return (
    <div className="min-h-screen bg-[#080a08] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#e8a020] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <div className="text-[#667066] text-[13px]">Loading portal...</div>
      </div>
    </div>
  );
}

// ── LOGIN PROMPT ──
function LoginPrompt() {
  return (
    <div className="min-h-screen bg-[#080a08] flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="w-12 h-12 border border-[#e8a020] flex items-center justify-center text-[14px] font-semibold text-[#e8a020] mx-auto mb-6">ARM</div>
        <h2 className="text-xl font-light text-[#eaf0ea] mb-2 font-mono">Client Portal</h2>
        <p className="text-[14px] text-[#667066] mb-6 font-sans">Sign in to view your subscriptions, purchased assets, and download invoices.</p>
        <a href={getLoginUrl()} className="inline-block px-8 py-3 bg-[#e8a020] text-[#080a08] text-[12px] font-medium tracking-[0.1em] uppercase no-underline hover:opacity-85 transition-opacity">
          Sign In →
        </a>
        <div className="mt-6">
          <Link href="/" className="text-[12px] text-[#667066] hover:text-[#e8a020] transition-colors no-underline">
            <ArrowLeft size={12} className="inline mr-1" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
