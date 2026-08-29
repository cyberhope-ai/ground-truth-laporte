/*
  Learn — citizen-question explainers.
  Demand-driven education: water, electricity, taxes, jobs, and what happens
  if the company leaves. Every explainer ends with what we don't know.
*/
import Layout from "@/components/Layout";
import { Eyebrow, H2, Reveal } from "@/components/Section";
import { EXPLAINERS } from "@/lib/data";
import { useState } from "react";
import { Zap, Droplets, Landmark, Briefcase, DoorOpen, BookOpen } from "lucide-react";

const ICONS: Record<string, React.ReactNode> = {
  electricity: <Zap size={17} />,
  water: <Droplets size={17} />,
  taxes: <Landmark size={17} />,
  jobs: <Briefcase size={17} />,
  "if-they-leave": <DoorOpen size={17} />,
};

export default function Learn() {
  const [active, setActive] = useState(EXPLAINERS[0].slug);
  const current = EXPLAINERS.find((e) => e.slug === active)!;

  return (
    <Layout>
      <header className="border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7 pt-16 md:pt-20 pb-12">
          <Eyebrow>Learn · the questions residents actually ask</Eyebrow>
          <h1
            className="text-[clamp(34px,5.4vw,56px)] font-bold leading-[1.0] tracking-[-0.025em] max-w-[20ch]"
            style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
          >
            Straight answers, <span style={{ color: "var(--gt-gold)" }}>with the sources attached</span>
          </h1>
          <p className="text-[17px] leading-relaxed max-w-[64ch] mt-5" style={{ color: "var(--gt-fg2)" }}>
            Each explainer is built from the sealed record — utility filings, council minutes, agreements, and on-record
            statements. Two rules make them trustworthy: every number links to its receipt, and where the honest answer
            is “no one has published this,” we say exactly that.
          </p>
        </div>
      </header>

      <section className="py-12 md:py-16">
        <div className="max-w-[1120px] mx-auto px-5 md:px-7 grid gap-10 lg:grid-cols-[280px_1fr]">
          {/* left rail */}
          <div className="lg:sticky lg:top-24 self-start">
            <div
              className="text-[10.5px] tracking-[0.18em] uppercase mb-4"
              style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}
            >
              Explainers
            </div>
            <div className="flex lg:flex-col gap-2 flex-wrap">
              {EXPLAINERS.map((e) => (
                <button
                  key={e.slug}
                  onClick={() => setActive(e.slug)}
                  className="flex items-center gap-3 text-left px-4 py-3 rounded-lg border transition-all duration-200 active:scale-[0.98]"
                  style={{
                    borderColor: active === e.slug ? "var(--gt-gold-line)" : "var(--gt-line)",
                    background: active === e.slug ? "var(--gt-gold-dim)" : "var(--gt-panel)",
                    color: active === e.slug ? "var(--gt-gold)" : "var(--gt-fg2)",
                  }}
                >
                  <span style={{ color: active === e.slug ? "var(--gt-gold)" : "var(--gt-mut)" }}>
                    {ICONS[e.slug]}
                  </span>
                  <span className="text-[13.5px] font-medium leading-snug">{e.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* content */}
          <div key={current.slug}>
            <div
              className="text-[10.5px] tracking-[0.18em] uppercase mb-3 flex items-center gap-2"
              style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
            >
              <BookOpen size={13} /> {current.category}
            </div>
            <H2>{current.title}</H2>
            <p className="text-[17.5px] leading-relaxed max-w-[66ch]" style={{ color: "var(--gt-fg)" }}>
              {current.lead}
            </p>

            <div className="mt-10 space-y-8">
              {current.sections.map((s, i) => (
                <Reveal key={s.heading} delay={i * 60}>
                  <div className="grid md:grid-cols-[190px_1fr] gap-3 md:gap-8 pb-8 border-b" style={{ borderColor: "var(--gt-line)" }}>
                    <div
                      className="text-[12px] tracking-[0.1em] uppercase font-medium pt-1"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
                    >
                      {s.heading}
                    </div>
                    <p className="text-[15px] leading-relaxed" style={{ color: "var(--gt-fg2)" }}>
                      {s.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div
              className="mt-8 rounded-lg border px-5 py-4 text-[12px]"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--gt-mut)",
                borderColor: "var(--gt-line)",
                background: "var(--gt-bg2)",
              }}
            >
              <span style={{ color: "var(--gt-gold)" }}>RECEIPTS · </span>
              {current.receiptNote}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
