/*
  Shared section primitives — eyebrow, headings, reveal-on-scroll wrapper.
*/
import { useEffect, useRef, useState } from "react";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[11px] tracking-[0.18em] uppercase mb-4"
      style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
    >
      {children}
    </div>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[clamp(26px,4vw,38px)] font-bold leading-[1.08] tracking-[-0.02em] mb-4"
      style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
    >
      {children}
    </h2>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            setVis(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(14px)",
        transition: `opacity .55s cubic-bezier(.23,1,.32,1) ${delay}ms, transform .55s cubic-bezier(.23,1,.32,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function Pill({
  children,
  live = false,
}: {
  children: React.ReactNode;
  live?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center text-[11px] tracking-[0.13em] uppercase font-medium px-3.5 py-2 rounded border"
      style={{
        fontFamily: "var(--font-mono)",
        color: live ? "var(--gt-verify)" : "var(--gt-gold)",
        borderColor: live ? "rgba(49,210,150,.3)" : "var(--gt-gold-line)",
        background: live ? "rgba(49,210,150,.08)" : "var(--gt-gold-dim)",
      }}
    >
      {live && (
        <span className="relative flex h-[6px] w-[6px] mr-2">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{ background: "var(--gt-verify)" }}
          />
          <span className="relative inline-flex rounded-full h-[6px] w-[6px]" style={{ background: "var(--gt-verify)" }} />
        </span>
      )}
      {children}
    </span>
  );
}
