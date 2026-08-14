import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading) return <DashboardSkeleton />;
  if (!user) return <LoginPrompt />;
  if (user.role !== "admin") return <AccessDenied />;

  return (
    <div className="min-h-screen text-[#c8cfc8] font-mono">
      <DashboardNav />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-24 pb-16">
        <div className="text-[11px] tracking-[0.2em] uppercase text-[#e8a020] mb-4 flex items-center gap-2.5">
          Admin Dashboard <div className="flex-1 max-w-[60px] h-px bg-[#a06010]" />
        </div>
        <h1 className="text-3xl font-light text-[#eaf0ea] tracking-tight mb-8">Revenue & Operations</h1>
        <StatsGrid />
        <FunnelOverview />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <RevenueChart />
          <RevenueByStream />
        </div>
        <div className="mt-8"><SatisfactionChart /></div>
        <LeadsCRM />
        <PurchasesTable />
      </div>
    </div>
  );
}

function DashboardNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 h-[60px] bg-[#080a08]/85 backdrop-blur-xl border-b border-white/[0.07]">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-7 h-7 border border-[#e8a020] flex items-center justify-center text-[11px] font-semibold text-[#e8a020]">ARM</div>
          <span className="text-[13px] font-medium tracking-[0.1em] uppercase text-[#eaf0ea] hidden sm:inline">Dashboard</span>
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/" className="text-[12px] tracking-[0.08em] uppercase text-[#667066] hover:text-[#e8a020] transition-colors no-underline">Home</Link>
        <Link href="/satisfaction" className="text-[12px] tracking-[0.08em] uppercase text-[#667066] hover:text-[#3ddc84] transition-colors no-underline">Team Health</Link>
      </div>
    </nav>
  );
}

function StatsGrid() {
  const { data: stats, isLoading } = trpc.admin.stats.useQuery();
  if (isLoading || !stats) return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">{Array(6).fill(0).map((_, i) => <div key={i} className="p-6 bg-[#0d100d] border border-white/[0.07] animate-pulse h-24" />)}</div>;

  const items = [
    { label: "Recorded Purchase Revenue", value: `$${(stats.revenue / 100).toLocaleString()}`, color: "#3ddc84" },
    { label: "Users on Pro Plan", value: stats.subscribers.toString(), color: "#e8a020" },
    { label: "Total Leads", value: stats.leadCount.toString(), color: "#e8a020" },
    { label: "Newsletter Subs", value: stats.newsletterCount.toString(), color: "#3ddc84" },
    { label: "Total Users", value: stats.userCount.toString(), color: "#c8cfc8" },
    { label: "Avg Satisfaction", value: stats.avgSatisfaction ? `${Number(stats.avgSatisfaction).toFixed(1)}/5` : "N/A", color: stats.avgSatisfaction >= 4 ? "#3ddc84" : stats.avgSatisfaction >= 3 ? "#e8a020" : "#ff4444" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {items.map(item => (
        <div key={item.label} className="p-6 bg-[#0d100d] border border-white/[0.07]">
          <div className="text-2xl font-semibold tracking-tight" style={{ color: item.color }}>{item.value}</div>
          <div className="text-[10px] tracking-[0.12em] uppercase text-[#667066] mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function RevenueChart() {
  const { data: overview, isLoading } = trpc.admin.growthOverview.useQuery();
  const chartData = overview?.weeklyRevenue.map((row) => ({ ...row, revenue: row.revenue / 100 })) || [];
  return (
    <div className="p-6 bg-[#0d100d] border border-white/[0.07]">
      <div className="text-[10px] tracking-[0.15em] uppercase text-[#667066] mb-1">Completed Purchase Revenue</div>
      <div className="text-lg font-light text-[#eaf0ea] mb-1">Weekly Cohorts</div>
      <p className="text-[11px] text-[#667066] mb-4">Last eight weeks. Values are recorded completed one-time purchases, not a subscription MRR forecast.</p>
      {isLoading ? <div className="animate-pulse h-[200px] bg-[#111411]" /> : <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a1d1a" />
          <XAxis dataKey="name" tick={{ fill: "#667066", fontSize: 10 }} />
          <YAxis tick={{ fill: "#667066", fontSize: 10 }} />
          <Tooltip formatter={(value: number) => [`$${Number(value).toLocaleString()}`, "Revenue"]} contentStyle={{ background: "#0d100d", border: "1px solid rgba(255,255,255,0.07)", color: "#eaf0ea", fontSize: 12 }} />
          <Bar dataKey="revenue" fill="#3ddc84" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>}
    </div>
  );
}

function RevenueByStream() {
  const { data: overview, isLoading } = trpc.admin.growthOverview.useQuery();
  const chartData = overview?.revenueByStream.map((row) => ({ ...row, revenue: row.revenue / 100 })) || [];
  return (
    <div className="p-6 bg-[#0d100d] border border-white/[0.07]">
      <div className="text-[10px] tracking-[0.15em] uppercase text-[#667066] mb-1">Revenue Attribution</div>
      <div className="text-lg font-light text-[#eaf0ea] mb-1">Revenue by Stream</div>
      <p className="text-[11px] text-[#667066] mb-4">Completed purchase data in the same eight-week cohort window.</p>
      {isLoading ? <div className="animate-pulse h-[200px] bg-[#111411]" /> : chartData.length === 0 ? <div className="h-[200px] flex items-center justify-center text-[13px] text-[#667066]">No completed purchase attribution in this period.</div> : <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a1d1a" />
          <XAxis dataKey="stream" tick={{ fill: "#667066", fontSize: 10 }} />
          <YAxis tick={{ fill: "#667066", fontSize: 10 }} />
          <Tooltip formatter={(value: number) => [`$${Number(value).toLocaleString()}`, "Revenue"]} contentStyle={{ background: "#0d100d", border: "1px solid rgba(255,255,255,0.07)", color: "#eaf0ea", fontSize: 12 }} />
          <Bar dataKey="revenue" fill="#e8a020" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>}
    </div>
  );
}

function FunnelOverview() {
  const { data: overview, isLoading } = trpc.admin.growthOverview.useQuery();
  const items = [
    { label: "Page Views", key: "pageViews", color: "#c8cfc8" },
    { label: "CTA Clicks", key: "ctaClicks", color: "#e8a020" },
    { label: "Leads", key: "leads", color: "#3ddc84" },
    { label: "Checkouts Started", key: "checkoutsStarted", color: "#e8a020" },
    { label: "Payments Confirmed", key: "checkoutsCompleted", color: "#3ddc84" },
    { label: "Portal Views", key: "portalViews", color: "#a78bfa" },
  ] as const;
  return <section className="mt-8 p-6 bg-[#0d100d] border border-white/[0.07]">
    <div className="flex items-baseline justify-between gap-4 mb-5"><div><div className="text-[10px] tracking-[0.15em] uppercase text-[#667066] mb-1">First-Party Funnel Signals</div><div className="text-lg font-light text-[#eaf0ea]">Last 30 days</div></div><div className="text-[10px] text-[#667066] max-w-[310px] text-right">Minimal event counts only. No cross-site tracking or customer PII is stored in this event log.</div></div>
    {isLoading ? <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">{Array.from({ length: 6 }, (_, i) => <div key={i} className="h-20 animate-pulse bg-[#111411]" />)}</div> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">{items.map((item) => <div key={item.key} className="p-4 bg-[#0b1210] border border-white/[0.05]"><div className="text-2xl font-semibold" style={{ color: item.color }}>{overview?.funnel[item.key] || 0}</div><div className="mt-1 text-[9px] tracking-[0.11em] uppercase text-[#667066]">{item.label}</div></div>)}</div>}
  </section>;
}

function SatisfactionChart() {
  const { data: feedbackList } = trpc.feedback.list.useQuery();
  const chartData = feedbackList?.slice(-10).map((f, i) => ({
    name: `#${i + 1}`,
    satisfaction: f.satisfaction,
    workload: f.workload || 0,
  })) || [];

  return (
    <div className="p-6 bg-[#0d100d] border border-white/[0.07]">
      <div className="text-[10px] tracking-[0.15em] uppercase text-[#667066] mb-1">Employee Satisfaction</div>
      <div className="text-lg font-light text-[#eaf0ea] mb-4">Satisfaction Trend (Last 10)</div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a1d1a" />
          <XAxis dataKey="name" tick={{ fill: "#667066", fontSize: 10 }} />
          <YAxis domain={[0, 5]} tick={{ fill: "#667066", fontSize: 10 }} />
          <Tooltip contentStyle={{ background: "#0d100d", border: "1px solid rgba(255,255,255,0.07)", color: "#eaf0ea", fontSize: 12 }} />
          <Line type="monotone" dataKey="satisfaction" stroke="#3ddc84" strokeWidth={2} dot={{ fill: "#3ddc84" }} />
          <Line type="monotone" dataKey="workload" stroke="#e8a020" strokeWidth={2} dot={{ fill: "#e8a020" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function LeadsCRM() {
  const { data: leads, isLoading } = trpc.leads.list.useQuery({});
  const updateStatus = trpc.leads.updateStatus.useMutation({
    onSuccess: () => toast.success("Lead status updated"),
    onError: (err) => toast.error(err.message),
  });
  const utils = trpc.useUtils();

  const statusColors: Record<string, string> = {
    new: "#3ddc84",
    contacted: "#e8a020",
    qualified: "#a78bfa",
    converted: "#3ddc84",
    lost: "#ff4444",
  };

  return (
    <div className="mt-8 p-6 bg-[#0d100d] border border-white/[0.07]">
      <div className="text-[10px] tracking-[0.15em] uppercase text-[#667066] mb-1">Leads CRM</div>
      <div className="text-lg font-light text-[#eaf0ea] mb-4">Pipeline Management</div>
      {isLoading ? (
        <div className="animate-pulse h-32 bg-[#111411]" />
      ) : !leads?.length ? (
        <div className="text-[13px] text-[#667066] py-8 text-center">No leads yet. They'll appear here when someone submits the contact form.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.07]">
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Name</th>
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Email</th>
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Company</th>
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Use Case</th>
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Status</th>
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} className="border-b border-white/[0.03] hover:bg-[#111411] transition-colors">
                  <td className="py-3 text-[#eaf0ea]">{lead.firstName} {lead.lastName}</td>
                  <td className="py-3 text-[#c8cfc8]">{lead.email}</td>
                  <td className="py-3 text-[#667066]">{lead.company || "—"}</td>
                  <td className="py-3 text-[#667066]">{lead.useCase || "—"}</td>
                  <td className="py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => {
                        updateStatus.mutate({ id: lead.id, status: e.target.value as any });
                        utils.leads.list.invalidate();
                      }}
                      className="bg-transparent border border-white/[0.07] px-2 py-1 text-[11px] outline-none"
                      style={{ color: statusColors[lead.status] || "#c8cfc8" }}
                    >
                      {["new", "contacted", "qualified", "converted", "lost"].map(s => (
                        <option key={s} value={s} style={{ background: "#0d100d" }}>{s.toUpperCase()}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 text-[#667066] text-[12px]">{new Date(lead.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PurchasesTable() {
  const { data: purchases, isLoading } = trpc.admin.purchases.useQuery();
  return (
    <div className="mt-8 p-6 bg-[#0d100d] border border-white/[0.07]">
      <div className="text-[10px] tracking-[0.15em] uppercase text-[#667066] mb-1">Purchases</div>
      <div className="text-lg font-light text-[#eaf0ea] mb-4">Transaction History</div>
      {isLoading ? <div className="animate-pulse h-20 bg-[#111411]" /> : !purchases?.length ? (
        <div className="text-[13px] text-[#667066] py-8 text-center">No purchases yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.07]">
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Package</th>
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Email</th>
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Amount</th>
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Status</th>
                <th className="text-left py-3 text-[10px] tracking-[0.12em] uppercase text-[#667066] font-normal">Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(p => (
                <tr key={p.id} className="border-b border-white/[0.03] hover:bg-[#111411] transition-colors">
                  <td className="py-3 text-[#eaf0ea]">{p.packageName}</td>
                  <td className="py-3 text-[#c8cfc8]">{p.email}</td>
                  <td className="py-3 text-[#3ddc84]">${(p.amount / 100).toLocaleString()}</td>
                  <td className="py-3"><span className={`text-[11px] px-2 py-0.5 border ${p.status === "completed" ? "text-[#3ddc84] border-[#1a7040]" : p.status === "pending" ? "text-[#e8a020] border-[#a06010]" : "text-[#ff4444] border-[#ff4444]/30"}`}>{p.status.toUpperCase()}</span></td>
                  <td className="py-3 text-[#667066] text-[12px]">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return <div className="min-h-screen bg-[#080a08] flex items-center justify-center"><div className="text-[#667066] text-[13px]">Loading dashboard...</div></div>;
}

function LoginPrompt() {
  return (
    <div className="min-h-screen bg-[#080a08] flex items-center justify-center">
      <div className="text-center">
        <div className="text-[#667066] text-[13px] mb-4">Authentication required</div>
        <a href={getLoginUrl()} className="px-6 py-3 bg-[#e8a020] text-[#080a08] text-[12px] font-medium tracking-[0.1em] uppercase no-underline">Sign In</a>
      </div>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="min-h-screen bg-[#080a08] flex items-center justify-center">
      <div className="text-center">
        <div className="text-[#ff4444] text-[13px] mb-4">Access denied. Admin role required.</div>
        <Link href="/" className="text-[#e8a020] text-[12px] tracking-[0.1em] uppercase no-underline">← Back to Home</Link>
      </div>
    </div>
  );
}
