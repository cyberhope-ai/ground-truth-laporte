/*
  The Thermometer — the signature element.
  Horizontal commitment gauges that fill as commitments are independently confirmed.
  Empty gauges are the feature: "no independent measurement exists" is a first-class state.
*/
import { useEffect, useRef, useState } from "react";
import { ChevronDown, FileText, Video, Globe, Landmark } from "lucide-react";
import type { Commitment, Receipt } from "@/lib/data";
import { STATUS_META } from "@/lib/data";

function ReceiptIcon({ kind }: { kind: Receipt["kind"] }) {
  const s = 13;
  switch (kind) {
    case "video":
      return <Video size={s} />;
    case "document":
      return <FileText size={s} />;
    case "filing":
      return <Landmark size={s} />;
    default:
      return <Globe size={s} />;
  }
}

export function ReceiptChip({ r }: { r: Receipt }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="inline-block relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 text-[10.5px] tracking-[0.08em] uppercase px-2.5 py-1 rounded border transition-all duration-200 hover:border-[var(--gt-gold)]"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--gt-gold)",
          borderColor: "var(--gt-gold-line)",
          background: open ? "var(--gt-gold-dim)" : "transparent",
        }}
      >
        <ReceiptIcon kind={r.kind} />
        {r.label}
      </button>
      {open && (
        <span
          className="absolute z-30 left-0 top-full mt-2 w-[300px] rounded-lg border p-4 shadow-2xl block text-left normal-case tracking-normal"
          style={{
            background: "var(--gt-panel)",
            borderColor: "var(--gt-line2)",
            boxShadow: "0 18px 50px rgba(0,0,0,.55)",
          }}
        >
          <span
            className="block text-[10px] tracking-[0.16em] uppercase mb-1.5"
            style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
          >
            Receipt · {r.kind}
          </span>
          <span className="block text-[13px] font-medium leading-snug" style={{ color: "var(--gt-fg)" }}>
            {r.source}
          </span>
          <span className="block text-[12.5px] leading-relaxed mt-2" style={{ color: "var(--gt-fg2)" }}>
            {r.detail}
          </span>
          {r.seal && (
            <span
              className="block text-[10.5px] mt-2.5 pt-2.5 border-t"
              style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)", borderColor: "var(--gt-line)" }}
            >
              {r.seal}
            </span>
          )}
          {r.url && (
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-[12px] mt-2.5 underline underline-offset-2"
              style={{ color: "var(--gt-gold)" }}
            >
              View source ↗
            </a>
          )}
        </span>
      )}
    </span>
  );
}

export function Gauge({ c, defaultOpen = false }: { c: Commitment; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const meta = STATUS_META[c.status];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setAnimated(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const fillStyle: React.CSSProperties =
    c.status === "verified"
      ? { background: "linear-gradient(90deg,#1f9a6e,var(--gt-verify))" }
      : c.status === "climbing" || c.status === "open"
        ? {
            background:
              "repeating-linear-gradient(115deg, rgba(217,171,69,.6) 0 6px, rgba(217,171,69,.18) 6px 12px)",
          }
        : { background: "transparent" };

  return (
    <div ref={ref} className="border-b" style={{ borderColor: "var(--gt-line)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-5 group"
        aria-expanded={open}
      >
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="text-[16.5px] md:text-[18px] font-medium tracking-tight transition-colors duration-200 group-hover:text-[var(--gt-gold)]"
              style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
            >
              {c.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] tracking-[0.12em] uppercase whitespace-nowrap px-2 py-0.5 rounded"
              style={{ fontFamily: "var(--font-mono)", color: meta.color, background: meta.bg }}
            >
              {c.statusLabel}
            </span>
            <ChevronDown
              size={16}
              style={{
                color: "var(--gt-mut)",
                transform: open ? "rotate(180deg)" : "none",
                transition: "transform .25s cubic-bezier(.23,1,.32,1)",
              }}
            />
          </div>
        </div>

        <div
          className="h-[7px] rounded-full mt-3.5 overflow-hidden border"
          style={{ background: "var(--gt-track)", borderColor: "var(--gt-line)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: animated ? `${c.fillPct}%` : "0%",
              transition: "width .9s cubic-bezier(.23,1,.32,1)",
              ...fillStyle,
            }}
          />
        </div>

        <div className="flex gap-5 mt-2.5 flex-wrap text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
          {c.target && (
            <span>
              TARGET <span style={{ color: "var(--gt-fg2)" }}>{c.target}</span>
            </span>
          )}
          <span>
            DEADLINE{" "}
            <span style={{ color: c.deadlineStated ? "var(--gt-fg2)" : "var(--gt-warn)" }}>
              {c.deadlineStated ? c.deadline : "none stated"}
            </span>
          </span>
          <span>
            PROMISOR <span style={{ color: "var(--gt-fg2)" }}>{c.promisor}</span>
          </span>
        </div>
      </button>

      <div
        className="grid transition-all duration-300"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transitionTimingFunction: "cubic-bezier(.23,1,.32,1)",
        }}
      >
        <div className="overflow-hidden">
          <div className="pb-6 pl-0 md:pl-2">
            <p className="text-[14.5px] leading-relaxed max-w-[68ch]" style={{ color: "var(--gt-fg2)" }}>
              {c.summary}
            </p>
            {c.quote && (
              <blockquote
                className="mt-4 pl-4 border-l-2 text-[14px] leading-relaxed italic"
                style={{ borderColor: "var(--gt-gold)", color: "var(--gt-fg)" }}
              >
                “{c.quote}”
              </blockquote>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              {c.receipts.map((r, i) => (
                <ReceiptChip key={i} r={r} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
