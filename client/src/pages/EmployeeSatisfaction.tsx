import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function EmployeeSatisfaction() {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-[#080a08] flex items-center justify-center"><div className="text-[#667066] text-[13px]">Loading...</div></div>;
  if (!user) return (
    <div className="min-h-screen bg-[#080a08] flex items-center justify-center">
      <div className="text-center">
        <div className="text-[#667066] text-[13px] mb-4">Please sign in to submit feedback</div>
        <a href={getLoginUrl()} className="px-6 py-3 bg-[#e8a020] text-[#080a08] text-[12px] font-medium tracking-[0.1em] uppercase no-underline">Sign In</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-[#c8cfc8] font-mono">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 h-[60px] bg-[#080a08]/85 backdrop-blur-xl border-b border-white/[0.07]">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-7 h-7 border border-[#3ddc84] flex items-center justify-center text-[11px] font-semibold text-[#3ddc84]">ARM</div>
            <span className="text-[13px] font-medium tracking-[0.1em] uppercase text-[#eaf0ea] hidden sm:inline">Team Health</span>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-[12px] tracking-[0.08em] uppercase text-[#667066] hover:text-[#e8a020] transition-colors no-underline">Home</Link>
          {user.role === "admin" && <Link href="/admin" className="text-[12px] tracking-[0.08em] uppercase text-[#667066] hover:text-[#e8a020] transition-colors no-underline">Dashboard</Link>}
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-24 pb-16">
        <div className="text-[11px] tracking-[0.2em] uppercase text-[#3ddc84] mb-4 flex items-center gap-2.5">
          Employee Satisfaction <div className="flex-1 max-w-[60px] h-px bg-[#1a7040]" />
        </div>
        <h1 className="text-3xl font-light text-[#eaf0ea] tracking-tight mb-2">Team Health & Wellbeing</h1>
        <p className="text-[14px] text-[#667066] mb-8 font-sans">Use this space to share satisfaction, workload, and operational concerns. Feedback is retained for internal review; only authorized owners can view team-level aggregates.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FeedbackForm userId={user.id} userName={user.name} />
          <HealthKPIs isAdmin={user.role === "admin"} />
        </div>

        {user.role === "admin" && <FeedbackHistory />}
      </div>
    </div>
  );
}

function FeedbackForm({ userId, userName }: { userId: number; userName: string | null }) {
  const [satisfaction, setSatisfaction] = useState(0);
  const [workload, setWorkload] = useState(0);
  const [comments, setComments] = useState("");

  const submitFeedback = trpc.feedback.submit.useMutation({
    onSuccess: () => {
      toast.success("Feedback submitted. Thank you for keeping the team healthy!");
      setSatisfaction(0);
      setWorkload(0);
      setComments("");
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="p-8 bg-[#0d100d] border border-white/[0.07]">
      <div className="text-[10px] tracking-[0.15em] uppercase text-[#3ddc84] mb-1">Feedback Form</div>
      <div className="text-lg font-light text-[#eaf0ea] mb-6">How are you feeling?</div>

      <div className="mb-6">
        <label className="text-[10px] tracking-[0.15em] uppercase text-[#667066] mb-3 block">Overall Satisfaction</label>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => setSatisfaction(n)}
              className={`w-12 h-12 border text-lg font-light transition-all ${satisfaction === n ? "bg-[#3ddc84] text-[#080a08] border-[#3ddc84]" : "border-white/[0.07] text-[#667066] hover:border-[#3ddc84] hover:text-[#3ddc84]"}`}>
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-[#667066]"><span>Very Unsatisfied</span><span>Very Satisfied</span></div>
      </div>

      <div className="mb-6">
        <label className="text-[10px] tracking-[0.15em] uppercase text-[#667066] mb-3 block">Workload Level</label>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => setWorkload(n)}
              className={`w-12 h-12 border text-lg font-light transition-all ${workload === n ? "bg-[#e8a020] text-[#080a08] border-[#e8a020]" : "border-white/[0.07] text-[#667066] hover:border-[#e8a020] hover:text-[#e8a020]"}`}>
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-[#667066]"><span>Very Light</span><span>Overwhelming</span></div>
      </div>

      <div className="mb-6">
        <label className="text-[10px] tracking-[0.15em] uppercase text-[#667066] mb-2 block">Comments (optional)</label>
        <textarea value={comments} onChange={e => setComments(e.target.value)} rows={4}
          className="w-full bg-transparent border border-white/[0.07] px-3 py-2.5 text-[13px] text-[#eaf0ea] focus:border-[#3ddc84] outline-none transition-colors resize-none"
          placeholder="What's working well? What could improve?" />
      </div>

      <button
        onClick={() => { if (satisfaction > 0) submitFeedback.mutate({ satisfaction, workload: workload || undefined, comments: comments || undefined }); else toast.error("Please rate your satisfaction"); }}
        disabled={submitFeedback.isPending}
        className="w-full py-3.5 bg-[#3ddc84] text-[#080a08] text-[12px] font-medium tracking-[0.1em] uppercase hover:opacity-85 transition-opacity disabled:opacity-50">
        {submitFeedback.isPending ? "Submitting..." : "Submit Feedback →"}
      </button>
    </div>
  );
}

function HealthKPIs({ isAdmin }: { isAdmin: boolean }) {
  const { data: feedbackList, isLoading } = trpc.feedback.list.useQuery(undefined, { enabled: isAdmin });
  const { data: averageSatisfaction } = trpc.feedback.averageSatisfaction.useQuery(undefined, { enabled: isAdmin });

  if (!isAdmin) {
    return (
      <div className="p-8 bg-[#0d100d] border border-white/[0.07]">
        <div className="text-[10px] tracking-[0.15em] uppercase text-[#e8a020] mb-1">Feedback Process</div>
        <div className="text-lg font-light text-[#eaf0ea] mb-6">What happens after you submit</div>
        <div className="space-y-4 text-[13px] leading-[1.8] text-[#c8cfc8] font-sans">
          <p>Your submission records your satisfaction, workload, and optional context for authorized internal review.</p>
          <p>Team-level aggregates and individual comments are not presented as live system telemetry. If a concern needs an immediate response, use the appropriate internal escalation channel in addition to this form.</p>
          <p className="text-[#667066]">No operational-status or wellbeing conclusion is shown here without supporting feedback data.</p>
        </div>
      </div>
    );
  }

  const entries = feedbackList || [];
  const workloadEntries = entries.filter((feedback) => typeof feedback.workload === "number").length;
  const mostRecent = entries[0]?.createdAt ? new Date(entries[0].createdAt).toLocaleDateString() : "No feedback yet";
  const kpis = [
    { label: "Feedback entries", value: isLoading ? "Loading…" : String(entries.length) },
    { label: "Average satisfaction", value: isLoading ? "Loading…" : averageSatisfaction == null ? "No data" : `${Number(averageSatisfaction).toFixed(1)} / 5` },
    { label: "Workload ratings", value: isLoading ? "Loading…" : String(workloadEntries) },
    { label: "Most recent entry", value: isLoading ? "Loading…" : mostRecent },
  ];

  return (
    <div className="p-8 bg-[#0d100d] border border-white/[0.07]">
      <div className="text-[10px] tracking-[0.15em] uppercase text-[#e8a020] mb-1">Feedback Review Signals</div>
      <div className="text-lg font-light text-[#eaf0ea] mb-6">Owner-only aggregate view</div>
      <div className="space-y-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className="flex items-center justify-between py-3 border-b border-white/[0.05] gap-4">
            <span className="text-[13px] text-[#c8cfc8]">{kpi.label}</span>
            <span className="text-[13px] font-medium text-[#3ddc84] text-right">{kpi.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-[#0b1210] border border-white/[0.05]">
        <div className="text-[10px] tracking-[0.12em] uppercase text-[#667066] mb-2">Interpretation boundary</div>
        <div className="text-[13px] text-[#c8cfc8] leading-[1.7] font-sans">These values describe submitted feedback only. They do not establish a wellbeing, workload, or operational conclusion without owner review and context.</div>
      </div>
    </div>
  );
}

function FeedbackHistory() {
  const { data: feedbackList, isLoading } = trpc.feedback.list.useQuery();
  const { data: avgSat } = trpc.feedback.averageSatisfaction.useQuery();

  const chartData = feedbackList?.slice(-20).map((f, i) => ({
    name: `#${i + 1}`,
    satisfaction: f.satisfaction,
    workload: f.workload || 0,
  })) || [];

  return (
    <div className="mt-8">
      <div className="p-6 bg-[#0d100d] border border-white/[0.07] mb-8">
        <div className="text-[10px] tracking-[0.15em] uppercase text-[#667066] mb-1">Satisfaction Trend</div>
        <div className="text-lg font-light text-[#eaf0ea] mb-1">
          Average: <span className="text-[#3ddc84]">{avgSat ? Number(avgSat).toFixed(1) : "N/A"}</span> / 5
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1d1a" />
            <XAxis dataKey="name" tick={{ fill: "#667066", fontSize: 10 }} />
            <YAxis domain={[0, 5]} tick={{ fill: "#667066", fontSize: 10 }} />
            <Tooltip contentStyle={{ background: "#0d100d", border: "1px solid rgba(255,255,255,0.07)", color: "#eaf0ea", fontSize: 12 }} />
            <Line type="monotone" dataKey="satisfaction" stroke="#3ddc84" strokeWidth={2} dot={{ fill: "#3ddc84" }} name="Satisfaction" />
            <Line type="monotone" dataKey="workload" stroke="#e8a020" strokeWidth={2} dot={{ fill: "#e8a020" }} name="Workload" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="p-6 bg-[#0d100d] border border-white/[0.07]">
        <div className="text-[10px] tracking-[0.15em] uppercase text-[#667066] mb-1">Recent Feedback</div>
        <div className="text-lg font-light text-[#eaf0ea] mb-4">All Submissions</div>
        {isLoading ? <div className="animate-pulse h-20 bg-[#111411]" /> : !feedbackList?.length ? (
          <div className="text-[13px] text-[#667066] py-8 text-center">No feedback submitted yet.</div>
        ) : (
          <div className="space-y-3">
            {feedbackList.map(f => (
              <div key={f.id} className="p-4 border border-white/[0.05] hover:bg-[#111411] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] text-[#eaf0ea]">{f.name || "Anonymous"}</span>
                  <span className="text-[11px] text-[#667066]">{new Date(f.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-4 text-[12px]">
                  <span>Satisfaction: <span className="text-[#3ddc84]">{f.satisfaction}/5</span></span>
                  {f.workload && <span>Workload: <span className="text-[#e8a020]">{f.workload}/5</span></span>}
                </div>
                {f.comments && <div className="mt-2 text-[13px] text-[#667066]">{f.comments}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
