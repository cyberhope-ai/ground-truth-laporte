/*
  Admin Review — the quarantine queue.
  Secure dashboard (admin role only) to evaluate evidence submissions,
  add authenticity/verification notes, and move them through the pipeline:
  quarantined → under_review → verified | rejected.
  Every status change is a deliberate, logged act — the publish gate in UI form.
*/
import Layout from "@/components/Layout";
import { Eyebrow } from "@/components/Section";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  ShieldCheck, FileText, ExternalLink, CheckCircle2, XCircle,
  Eye, AlertTriangle, Lock,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  quarantined: { label: "Quarantined", color: "var(--gt-warn)", bg: "rgba(217,171,69,.1)" },
  under_review: { label: "Under review", color: "var(--gt-gold)", bg: "var(--gt-gold-dim)" },
  verified: { label: "Verified", color: "var(--gt-verify)", bg: "rgba(49,210,150,.08)" },
  rejected: { label: "Rejected", color: "var(--gt-bad)", bg: "rgba(232,119,107,.08)" },
};

const NEXT_ACTIONS: Record<string, { to: string; label: string; icon: React.ReactNode; danger?: boolean }[]> = {
  quarantined: [
    { to: "under_review", label: "Begin review", icon: <Eye size={13} /> },
    { to: "rejected", label: "Reject", icon: <XCircle size={13} />, danger: true },
  ],
  under_review: [
    { to: "verified", label: "Verify & release", icon: <CheckCircle2 size={13} /> },
    { to: "rejected", label: "Reject", icon: <XCircle size={13} />, danger: true },
    { to: "quarantined", label: "Return to quarantine", icon: <AlertTriangle size={13} /> },
  ],
  verified: [],
  rejected: [],
};

export default function AdminReview() {
  const { user, isAuthenticated, loading } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "admin";
  const utils = trpc.useUtils();

  const { data: subs, isLoading } = trpc.submissions.listAll.useQuery(undefined, {
    enabled: isAdmin,
  });
  const setStatus = trpc.submissions.setStatus.useMutation({
    onSuccess: () => {
      utils.submissions.listAll.invalidate();
      toast.success("Status updated.");
    },
    onError: (e) => toast.error(e.message),
  });

  const [notes, setNotes] = useState<Record<number, string>>({});
  const [filter, setFilter] = useState<string>("all");

  const filtered = (subs || []).filter((s) => filter === "all" || s.status === filter);
  const counts = (subs || []).reduce<Record<string, number>>((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <Layout>
        <div className="py-32 text-center text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
          Verifying credentials…
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7 py-32 text-center">
          <Lock size={28} style={{ color: "var(--gt-bad)" }} className="mx-auto" />
          <h1 className="text-[26px] font-bold mt-4" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
            Restricted
          </h1>
          <p className="text-[15px] mt-2 max-w-[46ch] mx-auto" style={{ color: "var(--gt-fg2)" }}>
            The review queue is available to administrators only. Every status change here is a deliberate, logged act —
            the publish gate in UI form.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7 pt-14 md:pt-16 pb-10">
          <Eyebrow>Admin · quarantine queue</Eyebrow>
          <h1
            className="text-[clamp(30px,4.5vw,44px)] font-bold leading-[1.02] tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
          >
            Evidence <span style={{ color: "var(--gt-gold)" }}>review</span>
          </h1>
          <p className="text-[15px] leading-relaxed max-w-[62ch] mt-3" style={{ color: "var(--gt-fg2)" }}>
            Evaluate quarantined submissions, record authenticity notes, and move each through the pipeline. Nothing
            leaves quarantine without a deliberate decision.
          </p>

          <div className="flex flex-wrap gap-2 mt-6">
            {["all", "quarantined", "under_review", "verified", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="text-[10.5px] tracking-[0.1em] uppercase px-3 py-1.5 rounded border transition-all duration-150 active:scale-[0.97]"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: filter === f ? "#0a0d14" : "var(--gt-fg2)",
                  background: filter === f ? "var(--gt-gold)" : "transparent",
                  borderColor: filter === f ? "var(--gt-gold)" : "var(--gt-line2)",
                }}
              >
                {f === "all" ? `All · ${subs?.length || 0}` : `${STATUS_META[f].label} · ${counts[f] || 0}`}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="py-10 md:py-14">
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          {isLoading && (
            <div className="text-[13px] py-16 text-center" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
              Loading queue…
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div
              className="rounded-xl border border-dashed p-14 text-center"
              style={{ borderColor: "var(--gt-line2)", color: "var(--gt-mut)" }}
            >
              <ShieldCheck size={24} className="mx-auto mb-3" style={{ color: "var(--gt-verify)" }} />
              <p className="text-[14.5px]">
                {filter === "all" ? "The queue is empty — no submissions yet." : `No ${STATUS_META[filter]?.label.toLowerCase()} submissions.`}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {filtered.map((s) => {
              const st = STATUS_META[s.status] || STATUS_META.quarantined;
              const actions = NEXT_ACTIONS[s.status] || [];
              return (
                <div
                  key={s.id}
                  className="rounded-xl border p-6"
                  style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line)" }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5 mb-2">
                        <span
                          className="text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded"
                          style={{ fontFamily: "var(--font-mono)", color: st.color, background: st.bg }}
                        >
                          {st.label}
                        </span>
                        <span className="text-[10.5px]" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
                          #{s.id} · {s.kind} · {new Date(s.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[16.5px] font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
                        {s.title}
                      </div>
                      {s.statement && (
                        <p className="text-[13.5px] leading-relaxed mt-2 max-w-[70ch]" style={{ color: "var(--gt-fg2)" }}>
                          {s.statement}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
                        {s.fileName && (
                          <span className="flex items-center gap-1.5">
                            <FileText size={11} /> {s.fileName}
                            {s.fileSize ? ` (${(s.fileSize / 1024).toFixed(0)} KB)` : ""}
                          </span>
                        )}
                        {s.sha256 && <span style={{ color: "var(--gt-gold)" }}>sealed {s.sha256.slice(0, 16)}…</span>}
                        {s.sourceUrl && (
                          <a href={s.sourceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline underline-offset-2" style={{ color: "var(--gt-gold)" }}>
                            source <ExternalLink size={10} />
                          </a>
                        )}
                        {s.fileUrl && (
                          <a href={s.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline underline-offset-2" style={{ color: "var(--gt-gold)" }}>
                            view file <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                      {s.authenticityNotes && (
                        <div
                          className="mt-3 rounded-lg border px-3.5 py-2.5 text-[12.5px] leading-relaxed"
                          style={{ borderColor: "var(--gt-line2)", background: "var(--gt-bg2)", color: "var(--gt-fg2)" }}
                        >
                          <span style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}>NOTES · </span>
                          {s.authenticityNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  {actions.length > 0 && (
                    <div className="mt-5 pt-4 border-t flex flex-wrap items-end gap-3" style={{ borderColor: "var(--gt-line)" }}>
                      <div className="flex-1 min-w-[240px]">
                        <label className="block text-[10px] tracking-[0.14em] uppercase mb-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
                          Verification notes
                        </label>
                        <textarea
                          rows={2}
                          value={notes[s.id] || ""}
                          onChange={(e) => setNotes((p) => ({ ...p, [s.id]: e.target.value }))}
                          placeholder="Authenticity findings, source check, manipulation check…"
                          className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none transition-colors focus:border-[var(--gt-gold)] resize-y"
                          style={{ background: "var(--gt-bg2)", borderColor: "var(--gt-line2)", color: "var(--gt-fg)" }}
                        />
                      </div>
                      <div className="flex gap-2">
                        {actions.map((a) => (
                          <button
                            key={a.to}
                            onClick={() => setStatus.mutate({ id: s.id, status: a.to as any, notes: notes[s.id] || undefined })}
                            disabled={setStatus.isPending}
                            className="flex items-center gap-1.5 text-[10.5px] font-medium tracking-[0.08em] uppercase px-3.5 py-2.5 rounded border transition-all duration-150 active:scale-[0.97] disabled:opacity-50"
                            style={{
                              fontFamily: "var(--font-mono)",
                              color: a.danger ? "var(--gt-bad)" : a.to === "verified" ? "var(--gt-verify)" : "var(--gt-gold)",
                              borderColor: a.danger ? "rgba(232,119,107,.35)" : a.to === "verified" ? "rgba(49,210,150,.35)" : "var(--gt-gold-line)",
                              background: a.danger ? "rgba(232,119,107,.06)" : a.to === "verified" ? "rgba(49,210,150,.06)" : "var(--gt-gold-dim)",
                            }}
                          >
                            {a.icon} {a.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
