import { useState } from "react";
import { X } from "lucide-react";

// Self-hosted email/password auth only — no external identity provider.
// (Social/broker sign-in was removed so nothing points to an outside service.)

export default function AuthModal({
  open, onClose, onAuthed,
}: { open: boolean; onClose: () => void; onAuthed: () => void }) {
  const [mode, setMode] = useState<"signup" | "signin">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const url = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const body = mode === "signup" ? { email, password, name } : { email, password };
      const r = await fetch(url, {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) onAuthed();
      else setError(d.error || "Something went wrong. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 13px", borderRadius: 9, fontSize: 14.5,
    background: "var(--gt-track)", color: "var(--gt-fg)",
    border: "1px solid var(--gt-line2)", outline: "none",
    fontFamily: "var(--font-sans)",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100, display: "flex",
        alignItems: "center", justifyContent: "center", padding: 16,
        background: "rgba(4,6,10,.72)", backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 420, borderRadius: 16, padding: "26px 26px 22px",
          background: "var(--gt-panel)", border: "1px solid var(--gt-line2)",
          boxShadow: "0 24px 70px rgba(0,0,0,.6)", position: "relative",
        }}
      >
        <button
          onClick={onClose} aria-label="Close"
          style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "var(--gt-mut)", cursor: "pointer" }}
        >
          <X size={20} />
        </button>

        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em", color: "var(--gt-fg)" }}>
          Ground<span style={{ color: "var(--gt-gold)" }}>Truth</span>
          <span style={{ color: "var(--gt-fg2)", fontWeight: 500 }}> LaPorte</span>
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 25, letterSpacing: "-0.02em", margin: "12px 0 4px", color: "var(--gt-fg)" }}>
          {mode === "signup" ? "Create your free account" : "Welcome back"}
        </h2>
        <p style={{ color: "var(--gt-fg2)", fontSize: 13.5, margin: "0 0 18px" }}>
          {mode === "signup"
            ? "Join the community record — follow the tracker, get updates, and contribute evidence."
            : "Sign in to your Ground Truth LaPorte account."}
        </p>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {mode === "signup" && (
            <input style={inputStyle} type="text" placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          )}
          <input style={inputStyle} type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          <input style={inputStyle} type="password" placeholder={mode === "signup" ? "Create a password (8+ characters)" : "Password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} required />
          {error && <div style={{ color: "var(--gt-bad)", fontSize: 13, lineHeight: 1.4 }}>{error}</div>}
          <button
            type="submit" disabled={busy}
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "none", cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1, background: "var(--gt-gold)", color: "#0a0d14", fontWeight: 700, fontSize: 15, fontFamily: "var(--font-display)", marginTop: 2 }}
          >
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13.5, color: "var(--gt-fg2)" }}>
          {mode === "signup" ? "Already have an account? " : "New to Ground Truth LaPorte? "}
          <button
            onClick={() => { setError(""); setMode(mode === "signup" ? "signin" : "signup"); }}
            style={{ background: "none", border: "none", color: "var(--gt-gold)", cursor: "pointer", fontWeight: 600, fontFamily: "var(--font-display)", fontSize: 13.5 }}
          >
            {mode === "signup" ? "Sign in" : "Create one free"}
          </button>
        </div>
      </div>
    </div>
  );
}
