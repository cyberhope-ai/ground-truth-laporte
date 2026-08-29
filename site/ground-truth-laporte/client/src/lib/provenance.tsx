import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

/*
  Provenance badges — every piece of evidence is tagged with the technology that
  proved it. PUBLIC visitors see the badge by what it PROVES (Sealed / Speaker-
  verified / Independent / Chain of proof). SIGNED-IN users can flip on a
  "technology view" that reveals the underlying CyberHope Q-stack name
  (QSurface / VerityQ). The Q-names are NEVER shown to anonymous visitors — that
  is a fleet cardinal rule.
*/

export type BadgeKind = "sealed" | "speaker" | "independent" | "chain";

type BadgeDef = {
  label: string;
  qName: string; // revealed only in technology view
  proves: string; // public tooltip — what it asserts
  tech: string; // technology-view tooltip
  tone: "seal" | "verify" | "indep" | "chain";
};

export const BADGES: Record<BadgeKind, BadgeDef> = {
  sealed: {
    label: "Sealed",
    qName: "QSurface",
    proves: "Fingerprinted (SHA-256) and hash-chained the moment it was captured — tamper-evident.",
    tech: "QSurface seal — Ed25519-signed, hash-chained custody receipt (RFC-8785 JCS + transparency log).",
    tone: "seal",
  },
  speaker: {
    label: "Speaker-verified",
    qName: "QSurface · diarization",
    proves: "Speaker separated and confirmed against at least two independent anchors before attribution.",
    tech: "QSurface diarization + two-anchor speaker-confirm gate (confirmed / probable / unresolved).",
    tone: "verify",
  },
  independent: {
    label: "Independent",
    qName: "Source tier 1–2",
    proves: "Traces to a primary or official source — not authored by the party making the promise.",
    tech: "Source-tier gate: tier 1–2 primary/official, outcome not authored by the promisor.",
    tone: "indep",
  },
  chain: {
    label: "Chain of proof",
    qName: "VerityQ",
    proves: "Every figure clicks through to the exact document + page or video + timestamp it came from.",
    tech: "VerityQ — legal-grade per-figure provenance render over the sealed ledger.",
    tone: "chain",
  },
};

const TONE_COLOR: Record<BadgeDef["tone"], string> = {
  seal: "var(--gt-gold)",
  verify: "var(--gt-verify)",
  indep: "var(--gt-verify)",
  chain: "var(--gt-gold)",
};

// ── Technology-view context (signed-in only) ───────────────────────────────
type Ctx = { showTech: boolean; canToggle: boolean; toggle: () => void };
const ProvenanceCtx = createContext<Ctx>({ showTech: false, canToggle: false, toggle: () => {} });

export function ProvenanceProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [pref, setPref] = useState(false);

  useEffect(() => {
    try { setPref(localStorage.getItem("gt-tech-view") === "1"); } catch {}
  }, []);

  const canToggle = isAuthenticated; // Q-names only ever for signed-in users
  const showTech = canToggle && pref;

  const toggle = () => {
    setPref((p) => {
      const next = !p;
      try { localStorage.setItem("gt-tech-view", next ? "1" : "0"); } catch {}
      return next;
    });
  };

  return (
    <ProvenanceCtx.Provider value={{ showTech, canToggle, toggle }}>
      {children}
    </ProvenanceCtx.Provider>
  );
}

export const useProvenanceView = () => useContext(ProvenanceCtx);

// ── Badge component ────────────────────────────────────────────────────────
export function ProvenanceBadge({ kind, size = "sm" }: { kind: BadgeKind; size?: "sm" | "xs" }) {
  const { showTech } = useProvenanceView();
  const b = BADGES[kind];
  const color = TONE_COLOR[b.tone];
  const fontSize = size === "xs" ? 9.5 : 10.5;
  return (
    <span
      title={showTech ? b.tech : b.proves}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5, cursor: "help",
        fontFamily: "var(--font-mono)", fontSize, letterSpacing: "0.04em", textTransform: "uppercase",
        padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap",
        color, background: "color-mix(in srgb, " + color + " 12%, transparent)",
        border: "1px solid color-mix(in srgb, " + color + " 34%, transparent)",
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: 9, background: color, boxShadow: "0 0 6px " + color }} />
      {b.label}
      {showTech && <span style={{ opacity: 0.7 }}>· {b.qName}</span>}
    </span>
  );
}

/** A row of badges for an evidence item. Pass the kinds that genuinely apply. */
export function ProvenanceRow({ kinds, size }: { kinds: BadgeKind[]; size?: "sm" | "xs" }) {
  if (!kinds.length) return null;
  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
      {kinds.map((k) => <ProvenanceBadge key={k} kind={k} size={size} />)}
    </span>
  );
}

/** Legend explaining what each proof badge means. Reveals the Q-name in tech view. */
export function ProvenanceLegend() {
  const { showTech } = useProvenanceView();
  const kinds: BadgeKind[] = ["sealed", "speaker", "independent", "chain"];
  return (
    <div
      style={{
        border: "1px solid var(--gt-line)", borderRadius: 12, padding: "16px 18px",
        background: "color-mix(in srgb, var(--gt-panel) 60%, transparent)",
      }}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gt-gold)", marginBottom: 12 }}>
        How every piece of evidence is proved
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 12 }}>
        {kinds.map((k) => (
          <div key={k} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <ProvenanceBadge kind={k} />
            <span style={{ fontSize: 12.5, lineHeight: 1.45, color: "var(--gt-fg2)" }}>
              {showTech ? BADGES[k].tech : BADGES[k].proves}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The signed-in toggle: "Technology view" — reveals the Q-stack names. */
export function TechViewToggle() {
  const { showTech, canToggle, toggle } = useProvenanceView();
  if (!canToggle) return null;
  return (
    <button
      onClick={toggle}
      title="Reveal the CyberHope technology (QSurface / VerityQ) behind each proof badge. Visible to signed-in members only."
      style={{
        display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
        fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase",
        padding: "6px 11px", borderRadius: 8, background: "transparent",
        color: showTech ? "var(--gt-gold)" : "var(--gt-fg2)",
        border: "1px solid " + (showTech ? "var(--gt-gold-line)" : "var(--gt-line2)"),
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: 9, background: showTech ? "var(--gt-gold)" : "var(--gt-mut)" }} />
      Technology view {showTech ? "on" : "off"}
    </button>
  );
}
