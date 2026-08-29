import { useState } from "react";
import { X } from "lucide-react";
import { startLogin } from "@/const";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.85Z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z" />
  </svg>
);
const MicrosoftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 23 23" aria-hidden>
    <path fill="#F25022" d="M1 1h10v10H1z" /><path fill="#7FBA00" d="M12 1h10v10H12z" />
    <path fill="#00A4EF" d="M1 12h10v10H1z" /><path fill="#FFB900" d="M12 12h10v10H12z" />
  </svg>
);
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.95.93-1.95 1.87V12h3.32l-.53 3.47h-2.79v8.38A12 12 0 0 0 24 12Z" />
  </svg>
);

const providerBtn: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
  width: "100%", padding: "11px 14px", borderRadius: 10, cursor: "pointer",
  background: "var(--gt-fg)", color: "#0a0d14", fontWeight: 600, fontSize: 14.5,
  fontFamily: "var(--font-display)", border: "none",
};

export default function AuthModal({
  open, onClose, onAuthed,
}: { open: boolean; onClose: () => void; onAuthed: () => void }) {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
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

        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <button style={providerBtn} onClick={() => startLogin("google")}><GoogleIcon /> Continue with Google</button>
          <button style={providerBtn} onClick={() => startLogin("ms")}><MicrosoftIcon /> Continue with Microsoft</button>
          <button style={providerBtn} onClick={() => startLogin("facebook")}><FacebookIcon /> Continue with Facebook</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0", color: "var(--gt-mut)", fontSize: 12 }}>
          <span style={{ flex: 1, height: 1, background: "var(--gt-line2)" }} /> or <span style={{ flex: 1, height: 1, background: "var(--gt-line2)" }} />
        </div>

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
