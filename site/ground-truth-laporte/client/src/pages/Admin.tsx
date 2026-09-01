import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Layout from "@/components/Layout";

function fmtDate(d: string | Date | null) {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }
  catch { return "—"; }
}

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const stats = trpc.admin.stats.useQuery(undefined, { retry: false });
  const usersQ = trpc.admin.users.useQuery(undefined, { retry: false });
  const utils = trpc.useUtils();
  const setRole = trpc.admin.setRole.useMutation({
    onSuccess: () => { utils.admin.users.invalidate(); utils.admin.stats.invalidate(); },
  });
  const settings = trpc.admin.getSettings.useQuery(undefined, { retry: false });
  const [siteForm, setSiteForm] = useState({ siteName: "", address: "", contactEmail: "", notes: "" });
  useEffect(() => {
    if (settings.data) setSiteForm({
      siteName: settings.data.siteName ?? "", address: settings.data.address ?? "",
      contactEmail: settings.data.contactEmail ?? "", notes: settings.data.notes ?? "",
    });
  }, [settings.data]);
  const saveSettings = trpc.admin.updateSettings.useMutation({ onSuccess: () => utils.admin.getSettings.invalidate() });

  const denied = !loading && (!isAuthenticated || user?.role !== "admin" || usersQ.isError);

  const card: React.CSSProperties = {
    background: "var(--gt-panel)", border: "1px solid var(--gt-line)", borderRadius: 12, padding: "16px 18px",
  };

  return (
   <Layout>
    <div className="max-w-[1120px] mx-auto px-5 md:px-7 py-10" style={{ fontFamily: "var(--font-sans)", color: "var(--gt-fg)" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gt-gold)" }}>
        Admin backend
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 34, letterSpacing: "-0.02em", margin: "6px 0 4px" }}>
        Citizens & moderation
      </h1>
      <p style={{ color: "var(--gt-fg2)", fontSize: 14.5, maxWidth: "62ch" }}>
        Everyone who has signed up on Ground Truth LaPorte, their access level, and the evidence review queue.
      </p>

      {denied ? (
        <div style={{ ...card, marginTop: 24, borderColor: "var(--gt-line2)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>Admin access required</div>
          <p style={{ color: "var(--gt-fg2)", fontSize: 14, marginTop: 6 }}>
            You’re {isAuthenticated ? "signed in but not an administrator" : "not signed in"}. Ask an existing admin to grant you access.
          </p>
        </div>
      ) : (
        <>
          <div style={{ ...card, margin: "24px 0" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Site information</div>
            <div style={{ display: "grid", gap: 10, maxWidth: 560 }}>
              {(["siteName", "address", "contactEmail", "notes"] as const).map((f) => (
                <label key={f} style={{ display: "grid", gap: 4 }}>
                  <span style={{ color: "var(--gt-fg2)", fontSize: 12.5 }}>
                    {{ siteName: "Site name", address: "Address", contactEmail: "Contact email", notes: "Notes" }[f]}
                  </span>
                  <input
                    value={siteForm[f]}
                    onChange={(e) => setSiteForm({ ...siteForm, [f]: e.target.value })}
                    style={{ padding: "9px 11px", borderRadius: 8, background: "var(--gt-track)", color: "var(--gt-fg)", border: "1px solid var(--gt-line2)", fontFamily: "var(--font-sans)", fontSize: 14 }}
                  />
                </label>
              ))}
              <button
                onClick={() => saveSettings.mutate(siteForm)} disabled={saveSettings.isPending}
                style={{ justifySelf: "start", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "#0a0d14", background: "var(--gt-gold)", padding: "9px 15px", borderRadius: 9, border: "none", cursor: "pointer", marginTop: 4 }}
              >
                {saveSettings.isPending ? "Saving…" : "Save site info"}
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, margin: "24px 0" }}>
            <div style={card}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30 }}>{stats.data?.total ?? "—"}</div>
              <div style={{ color: "var(--gt-fg2)", fontSize: 12.5 }}>total citizens</div>
            </div>
            <div style={card}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30, color: "var(--gt-gold)" }}>{stats.data?.admins ?? "—"}</div>
              <div style={{ color: "var(--gt-fg2)", fontSize: 12.5 }}>administrators</div>
            </div>
            {Object.entries(stats.data?.byMethod ?? {}).map(([m, n]) => (
              <div style={card} key={m}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30 }}>{n as number}</div>
                <div style={{ color: "var(--gt-fg2)", fontSize: 12.5 }}>via {m === "genie" ? "social" : m}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
            <Link href="/admin/review" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "#0a0d14", background: "var(--gt-gold)", padding: "9px 15px", borderRadius: 9 }}>
              Evidence review queue →
            </Link>
          </div>

          <div style={{ ...card, padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "var(--gt-mut)", fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  <th style={{ padding: "12px 16px", borderBottom: "1px solid var(--gt-line)" }}>Citizen</th>
                  <th style={{ padding: "12px 16px", borderBottom: "1px solid var(--gt-line)" }}>Login</th>
                  <th style={{ padding: "12px 16px", borderBottom: "1px solid var(--gt-line)" }}>Joined</th>
                  <th style={{ padding: "12px 16px", borderBottom: "1px solid var(--gt-line)" }}>Last active</th>
                  <th style={{ padding: "12px 16px", borderBottom: "1px solid var(--gt-line)" }}>Role</th>
                  <th style={{ padding: "12px 16px", borderBottom: "1px solid var(--gt-line)" }}></th>
                </tr>
              </thead>
              <tbody>
                {usersQ.data?.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid rgba(34,44,58,.5)" }}>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ fontWeight: 600 }}>{u.name || "—"}</div>
                      <div style={{ color: "var(--gt-fg2)", fontSize: 12 }}>{u.email}</div>
                    </td>
                    <td style={{ padding: "11px 16px", color: "var(--gt-fg2)" }}>{u.loginMethod === "genie" ? "social" : u.loginMethod}</td>
                    <td style={{ padding: "11px 16px", color: "var(--gt-fg2)" }}>{fmtDate(u.createdAt)}</td>
                    <td style={{ padding: "11px 16px", color: "var(--gt-fg2)" }}>{fmtDate(u.lastSignedIn)}</td>
                    <td style={{ padding: "11px 16px" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.06em", padding: "3px 9px", borderRadius: 20, color: u.role === "admin" ? "var(--gt-gold)" : "var(--gt-fg2)", background: u.role === "admin" ? "var(--gt-gold-dim)" : "transparent", border: `1px solid ${u.role === "admin" ? "var(--gt-gold-line)" : "var(--gt-line2)"}` }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "11px 16px", textAlign: "right" }}>
                      <button
                        disabled={setRole.isPending || u.id === user?.id}
                        onClick={() => setRole.mutate({ id: u.id, role: u.role === "admin" ? "user" : "admin" })}
                        style={{ fontFamily: "var(--font-display)", fontSize: 12.5, fontWeight: 500, padding: "6px 12px", borderRadius: 8, cursor: u.id === user?.id ? "default" : "pointer", opacity: u.id === user?.id ? 0.4 : 1, background: "transparent", color: "var(--gt-fg)", border: "1px solid var(--gt-line2)" }}
                        title={u.id === user?.id ? "You can’t change your own role" : ""}
                      >
                        {u.role === "admin" ? "Make citizen" : "Make admin"}
                      </button>
                    </td>
                  </tr>
                ))}
                {usersQ.data && usersQ.data.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 20, color: "var(--gt-fg2)" }}>No citizens have signed up yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
   </Layout>
  );
}
