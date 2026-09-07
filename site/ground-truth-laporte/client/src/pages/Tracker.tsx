/*
  Tracker — the full commitment thermometer.
  All twelve commitments, filterable by category, with the status legend
  and the public-record gaps published as their own finding.
*/
import { ProvenanceLegend } from "@/lib/provenance";
import Layout from "@/components/Layout";
import { Eyebrow, H2, Reveal, Pill } from "@/components/Section";
import { Gauge } from "@/components/Thermometer";
import { COMMITMENTS, RECORD_GAPS, STATUS_META, type CommitmentStatus } from "@/lib/data";
import { useState } from "react";
import { FileWarning } from "lucide-react";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "power", label: "Electricity" },
  { key: "water", label: "Water" },
  { key: "taxes", label: "Taxes" },
  { key: "jobs", label: "Jobs & training" },
  { key: "community", label: "Community" },
  { key: "infrastructure", label: "Infrastructure" },
] as const;

export default function Tracker() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const rows = COMMITMENTS.filter((c) => filter === "all" || c.category === filter);

  const counts = COMMITMENTS.reduce<Record<CommitmentStatus, number>>(
    (acc, c) => {
      acc[c.status] += 1;
      return acc;
    },
    { verified: 0, climbing: 0, open: 0, unmeasurable: 0 }
  );

  return (
    <Layout>
      <header className="border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7 pt-16 md:pt-20 pb-12">
          <Eyebrow>The promise ledger · Microsoft LaPorte</Eyebrow>
          <h1
            className="text-[clamp(34px,5.4vw,56px)] font-bold leading-[1.0] tracking-[-0.025em] max-w-[18ch]"
            style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
          >
            The commitment <span style={{ color: "var(--gt-gold)" }}>thermometer</span>
          </h1>
          <p className="text-[17px] leading-relaxed max-w-[64ch] mt-5" style={{ color: "var(--gt-fg2)" }}>
            Twelve commitments, each traced to a sealed source — a public panel recording at video + timestamp, or the
            city's own agreement at document + date. Lines fill as independent evidence arrives.{" "}
            <strong style={{ color: "var(--gt-fg)" }}>Empty gauges are the feature, not a gap.</strong>
          </p>
          <div className="flex flex-wrap gap-2.5 mt-7">
            {(Object.keys(STATUS_META) as CommitmentStatus[]).map((k) => (
              <span
                key={k}
                className="text-[10.5px] tracking-[0.1em] uppercase px-3 py-1.5 rounded border"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: STATUS_META[k].color,
                  borderColor: "var(--gt-line2)",
                  background: STATUS_META[k].bg,
                }}
              >
                {STATUS_META[k].label} · {counts[k]}
              </span>
            ))}
          </div>
        </div>
      </header>

      <section className="py-12 md:py-16 border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          <div className="flex flex-wrap gap-2 mb-8">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="text-[11px] tracking-[0.1em] uppercase px-3.5 py-2 rounded border transition-all duration-150 active:scale-[0.97]"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: filter === f.key ? "#0a0d14" : "var(--gt-fg2)",
                  background: filter === f.key ? "var(--gt-gold)" : "transparent",
                  borderColor: filter === f.key ? "var(--gt-gold)" : "var(--gt-line2)",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="my-6">
            <ProvenanceLegend />
          </div>

          <div className="border-t" style={{ borderColor: "var(--gt-line)" }}>
            {rows.map((c) => (
              <Gauge key={c.id} c={c} />
            ))}
          </div>

          <div
            className="rounded-lg border p-6 mt-10"
            style={{ background: "var(--gt-bg2)", borderColor: "var(--gt-line)" }}
          >
            <h3
              className="text-[18px] font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
            >
              Why so many lines are empty — and why that is the point
            </h3>
            <p className="text-[14.5px] leading-relaxed mt-2 max-w-[75ch]" style={{ color: "var(--gt-fg2)" }}>
              This project broke ground in June 2026 and opens in 2029. A tracker showing confident numbers today would
              be inventing them. Where no independent measurement exists, we say so and leave the bar at zero — and we
              name who would have to publish the figure for that to change. A thermometer at 78% with sealed receipts is
              a far stronger public statement than a press release claiming success, because a reader can check it.
            </p>
          </div>
        </div>
      </section>

      {/* ── RECORD GAPS ── */}
      <section className="py-14 md:py-20 border-b" style={{ borderColor: "var(--gt-line)", background: "var(--gt-bg2)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          <Reveal>
            <div className="flex items-start gap-4">
              <div
                className="shrink-0 w-10 h-10 rounded-lg grid place-items-center border"
                style={{ borderColor: "rgba(232,119,107,.35)", background: "rgba(232,119,107,.08)", color: "var(--gt-bad)" }}
              >
                <FileWarning size={18} />
              </div>
              <div>
                <Eyebrow>Published as its own finding</Eyebrow>
                <H2>
                  What governs this project that{" "}
                  <span style={{ color: "var(--gt-gold)" }}>you cannot read</span>
                </H2>
                <p className="text-[15px] leading-relaxed max-w-[70ch]" style={{ color: "var(--gt-fg2)" }}>
                  These documents govern the deal and are not published anywhere. “Here is what governs this project and
                  here is why you cannot read it” is a legitimate, non-adversarial finding — and these are the first
                  public-records requests this project files.
                </p>
              </div>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-3">
            {RECORD_GAPS.map((g, i) => (
              <Reveal key={g} delay={i * 50}>
                <div
                  className="flex items-start gap-4 rounded-lg border px-5 py-4"
                  style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line)" }}
                >
                  <span
                    className="text-[11px] tracking-[0.1em] pt-0.5 shrink-0"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--gt-bad)" }}
                  >
                    GAP {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[14.5px] leading-relaxed" style={{ color: "var(--gt-fg2)" }}>
                    {g}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-[12.5px] mt-6" style={{ color: "var(--gt-mut)" }}>
            No dollar value has ever been attached to the 15% / 20-year school commitment in any public record. The
            “tens of millions annually” characterization appears only in newspaper framing.
          </p>
        </div>
      </section>

      {/* ── SYMMETRY NOTE ── */}
      <section className="py-14 md:py-16">
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border p-6" style={{ background: "var(--gt-panel)", borderColor: "rgba(49,210,150,.3)" }}>
              <div className="text-[10.5px] tracking-[0.16em] uppercase mb-2" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-verify)" }}>
                Verified good news
              </div>
              <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--gt-fg2)" }}>
                The rescinded 2024 exemption, full property taxes, and the 15% school allocation are{" "}
                <strong style={{ color: "var(--gt-fg)" }}>good news for the community that is also good news for Microsoft</strong>{" "}
                — exactly the verified good news this site exists to supply.
              </p>
            </div>
            <div className="rounded-lg border p-6" style={{ background: "var(--gt-panel)", borderColor: "var(--gt-gold-line)" }}>
              <div className="text-[10.5px] tracking-[0.16em] uppercase mb-2" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}>
                Corrections that help the company
              </div>
              <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--gt-fg2)" }}>
                The 2,400 MW figure is Amazon's. Debunking a false viral claim is worth more to the company than ten
                press releases — precisely because we would have published it had it been true.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
