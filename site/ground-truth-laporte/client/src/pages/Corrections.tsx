/*
  Corrections — the public log of every figure this site has corrected.
  Each entry shows the wrong figure, the verified figure (or the honest
  absence of one), the receipt that proves it, and the date corrected.
  This page is the product's credibility engine: we publish our corrections
  the same way we publish our findings.
*/
import Layout from "@/components/Layout";
import { Eyebrow, H2, Reveal } from "@/components/Section";
import {
  AlertTriangle, CheckCircle2, FileText, ArrowRight, Share2, Link2, Copy,
  Filter, X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface Correction {
  id: string;
  dateCorrected: string;
  category: string;
  wrongFigure: string;
  wrongSource: string;
  rightFigure: string;
  rightSource: string;
  explanation: string;
  receipts: string[];
  status: "corrected" | "disputed" | "unverifiable";
}

const CORRECTIONS: Correction[] = [
  {
    id: "mw-2400",
    dateCorrected: "2026-08-27",
    category: "Electricity",
    wrongFigure: "2,400 MW — Microsoft's LaPorte site",
    wrongSource: "Widely shared on social media and aggregator sites as Microsoft's LaPorte load",
    rightFigure: "No confirmed figure exists in any public record",
    rightSource: "IURC Cause 46362 — full order text",
    explanation:
      "The 2,400 MW figure comes from IURC Cause 46362, a generation arrangement for Amazon Data Services at the Schahfer/Mitchell plants. The full order text contains zero mentions of LaPorte or Microsoft. Reading Amazon's figure as Microsoft's LaPorte load would badly misinform the community conversation about grid impact.",
    receipts: ["IURC Cause 46362 (full order text)", "IURC Cause 46322 (Amazon special contract)"],
    status: "corrected",
  },
  {
    id: "mw-538",
    dateCorrected: "2026-08-27",
    category: "Electricity",
    wrongFigure: "538 MW — Microsoft LaPorte",
    wrongSource: "Aggregator sites (datacenter.fyi, cleanview.co, siliconreport) — no cited source",
    rightFigure: "No confirmed figure exists in any public record",
    rightSource: "Aggregator survey — no primary source found",
    explanation:
      "The 538 MW figure appears only on data-center aggregator websites with no cited source. No Microsoft-named IURC cause exists. The site's actual load is answerable by NIPSCO filings, the interconnection queue, or Microsoft directly — none of which have produced a public figure.",
    receipts: ["Aggregator survey: datacenter.fyi, cleanview.co, siliconreport — no cited sources"],
    status: "unverifiable",
  },
  {
    id: "water-1-8b",
    dateCorrected: "2026-08-27",
    category: "Water",
    wrongFigure: "1.8 billion gallons per year",
    wrongSource: "Generic industry extrapolation from square footage, widely shared as a LaPorte figure",
    rightFigure: "~1,000 gallons per day per building (≈3–4M gal/yr) — reported, not confirmed",
    rightSource: "City water superintendent, reported at public meeting",
    explanation:
      "The 1.8-billion-gallon figure is a generic industry extrapolation — not a LaPorte study. The city water superintendent reportedly described roughly 1,000 gallons per day per building. These are three orders of magnitude apart, and only one of them describes this site. Neither figure has been confirmed by a primary engineering document.",
    receipts: ["VID 0:14:23 · ITIA Summit 8/27/2026", "MSFT Cloud blog 12/9/2024 · closed-loop policy"],
    status: "disputed",
  },
  {
    id: "jobs-200",
    dateCorrected: "2026-08-27",
    category: "Jobs",
    wrongFigure: "200 permanent jobs (2024 announcement)",
    wrongSource: "City of La Porte, June 4, 2024 announcement",
    rightFigure: "600+ permanent jobs (June 2026 groundbreaking)",
    rightSource: "Microsoft Local blog, June 18, 2026",
    explanation:
      "The original announcement promised up to 200 permanent jobs by end-2032. At the June 2026 groundbreaking, Microsoft revised the figure to 600+ — tripled with no published methodology. Both figures are on the record; the revision is tracked as a fair question for Microsoft.",
    receipts: ["CITY 6/4/2024", "MSFT Local 6/18/2026"],
    status: "corrected",
  },
  {
    id: "tax-100m",
    dateCorrected: "2026-08-27",
    category: "Taxes",
    wrongFigure: "$100M tax abatement still in effect",
    wrongSource: "2024 development agreement — widely cited as current",
    rightFigure: "Abatement rescinded March 3, 2026 — Microsoft pays full property taxes",
    rightSource: "City of La Porte, March 3, 2026 agreement",
    explanation:
      "The 40-year personal-property exemption worth up to $100M was rescinded on March 3, 2026. Microsoft now pays full property taxes. The state IEDC 35-year sales-tax credit survived the renegotiation. Many residents still believe the abatement is in effect — it is not.",
    receipts: ["CITY 3/3/2026 · agreement", "IEDC 6/4/2024"],
    status: "corrected",
  },
  {
    id: "water-restaurant",
    dateCorrected: "2026-08-29",
    category: "Water",
    wrongFigure: "Water usage comparable to a single restaurant",
    wrongSource: "Brad Smith, Microsoft Vice Chair & President, at the June 17 groundbreaking (WNDU)",
    rightFigure: "No LaPorte-specific water withdrawal figure exists in the public record",
    rightSource: "No permitted withdrawal or cooling design basis has been published",
    explanation:
      "Brad Smith's characterization — that the data center uses no more water than a single restaurant — is a memorable analogy but not a verifiable figure. No LaPorte-specific water withdrawal permit, cooling design basis, or consumption measurement exists in the public record to test this claim. It is tracked as unmeasurable until a real figure exists.",
    receipts: ["WNDU 6/17/2026 · verbatim transcript", "MSFT Cloud blog 12/9/2024 · closed-loop policy"],
    status: "unverifiable",
  },
];

function shareText(c: Correction): string {
  return `Ground Truth LaPorte correction: "${c.wrongFigure}" is ${c.status === "corrected" ? "wrong" : c.status === "disputed" ? "disputed" : "unverifiable"}. ${c.rightFigure}. Source: ${c.rightSource}. laporte-truth.icystone-d1e018c9.centralus.azurecontainerapps.io/corrections#${c.id}`;
}

function shareUrl(c: Correction): string {
  return `https://laporte-truth.icystone-d1e018c9.centralus.azurecontainerapps.io/corrections#${c.id}`;
}

function ShareButtons({ c }: { c: Correction }) {
  const [copied, setCopied] = useState(false);
  const text = encodeURIComponent(shareText(c));
  const url = encodeURIComponent(shareUrl(c));

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl(c));
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] tracking-[0.1em] uppercase mr-1" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
        Share
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${text}`}
        target="_blank"
        rel="noreferrer"
        className="w-7 h-7 rounded-md border grid place-items-center transition-all duration-150 active:scale-[0.93] hover:border-[var(--gt-gold)]"
        style={{ borderColor: "var(--gt-line2)", color: "var(--gt-fg2)" }}
        title="Share on X"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`}
        target="_blank"
        rel="noreferrer"
        className="w-7 h-7 rounded-md border grid place-items-center transition-all duration-150 active:scale-[0.93] hover:border-[var(--gt-gold)]"
        style={{ borderColor: "var(--gt-line2)", color: "var(--gt-fg2)" }}
        title="Share on Facebook"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      </a>
      <button
        onClick={copyLink}
        className="w-7 h-7 rounded-md border grid place-items-center transition-all duration-150 active:scale-[0.93] hover:border-[var(--gt-gold)]"
        style={{ borderColor: copied ? "var(--gt-verify)" : "var(--gt-line2)", color: copied ? "var(--gt-verify)" : "var(--gt-fg2)" }}
        title="Copy link"
      >
        {copied ? <CheckCircle2 size={12} /> : <Link2 size={12} />}
      </button>
    </div>
  );
}

export default function Corrections() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [catFilter, setCatFilter] = useState<string | null>(null);

  const categories = useMemo(() => Array.from(new Set(CORRECTIONS.map((c) => c.category))).sort(), []);
  const statuses = useMemo(() => Array.from(new Set(CORRECTIONS.map((c) => c.status))).sort(), []);

  const filtered = useMemo(() => {
    let result = CORRECTIONS;
    if (statusFilter) result = result.filter((c) => c.status === statusFilter);
    if (catFilter) result = result.filter((c) => c.category === catFilter);
    return result;
  }, [statusFilter, catFilter]);

  return (
    <Layout>
      <header className="border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7 pt-16 md:pt-20 pb-12">
          <Eyebrow>Corrections · the public log</Eyebrow>
          <h1
            className="text-[clamp(34px,5.4vw,56px)] font-bold leading-[1.0] tracking-[-0.025em] max-w-[20ch]"
            style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
          >
            Every figure we've <span style={{ color: "var(--gt-gold)" }}>corrected</span>
          </h1>
          <p className="text-[17px] leading-relaxed max-w-[64ch] mt-5" style={{ color: "var(--gt-fg2)" }}>
            Wrong figures circulate. This page logs every correction this site has published — the wrong number, the
            verified number (or the honest absence of one), the receipt that proves it, and the date we corrected it.
            We publish our corrections the same way we publish our findings.
          </p>
        </div>
      </header>

      <section className="py-12 md:py-16">
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          {/* filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <Filter size={14} style={{ color: "var(--gt-gold)" }} />
              <span className="text-[10px] tracking-[0.14em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
                Filter
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setStatusFilter(null)}
                className="text-[10px] tracking-[0.08em] uppercase px-2.5 py-1.5 rounded-md border transition-all duration-150 active:scale-[0.95]"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: !statusFilter ? "#0a0d14" : "var(--gt-fg2)",
                  background: !statusFilter ? "var(--gt-gold)" : "transparent",
                  borderColor: !statusFilter ? "var(--gt-gold)" : "var(--gt-line2)",
                }}
              >
                All statuses
              </button>
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(statusFilter === s ? null : s)}
                  className="text-[10px] tracking-[0.08em] uppercase px-2.5 py-1.5 rounded-md border transition-all duration-150 active:scale-[0.95]"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: statusFilter === s ? "#0a0d14" : "var(--gt-fg2)",
                    background: statusFilter === s ? "var(--gt-gold)" : "transparent",
                    borderColor: statusFilter === s ? "var(--gt-gold)" : "var(--gt-line2)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="w-px h-5 hidden sm:block" style={{ background: "var(--gt-line2)" }} />
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setCatFilter(null)}
                className="text-[10px] tracking-[0.08em] uppercase px-2.5 py-1.5 rounded-md border transition-all duration-150 active:scale-[0.95]"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: !catFilter ? "#0a0d14" : "var(--gt-fg2)",
                  background: !catFilter ? "var(--gt-verify)" : "transparent",
                  borderColor: !catFilter ? "var(--gt-verify)" : "var(--gt-line2)",
                }}
              >
                All topics
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCatFilter(catFilter === c ? null : c)}
                  className="text-[10px] tracking-[0.08em] uppercase px-2.5 py-1.5 rounded-md border transition-all duration-150 active:scale-[0.95]"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: catFilter === c ? "#0a0d14" : "var(--gt-fg2)",
                    background: catFilter === c ? "var(--gt-verify)" : "transparent",
                    borderColor: catFilter === c ? "var(--gt-verify)" : "var(--gt-line2)",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            {(statusFilter || catFilter) && (
              <button
                onClick={() => { setStatusFilter(null); setCatFilter(null); }}
                className="flex items-center gap-1 text-[10px] tracking-[0.08em] uppercase px-2.5 py-1.5 rounded-md border transition-all duration-150 active:scale-[0.95]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--gt-bad)", borderColor: "var(--gt-line2)" }}
              >
                <X size={10} /> Clear
              </button>
            )}
          </div>

          {(statusFilter || catFilter) && (
            <div className="text-[11px] mb-5" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
              {filtered.length} of {CORRECTIONS.length} corrections
              {statusFilter && ` · status: ${statusFilter}`}
              {catFilter && ` · topic: ${catFilter}`}
            </div>
          )}

          <div className="space-y-5">
            {filtered.map((c, i) => (
              <Reveal key={c.id} delay={i * 60}>
                <div
                  id={c.id}
                  className="rounded-xl border overflow-hidden transition-colors duration-200 hover:border-[var(--gt-gold-line)]"
                  style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line)" }}
                >
                  <div className="p-6 md:p-7">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-4">
                      <span
                        className="text-[9.5px] tracking-[0.14em] uppercase px-2 py-0.5 rounded"
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: c.status === "corrected" ? "var(--gt-verify)" : c.status === "disputed" ? "var(--gt-warn)" : "var(--gt-mut)",
                          background: c.status === "corrected" ? "rgba(49,210,150,.08)" : c.status === "disputed" ? "rgba(217,171,69,.08)" : "rgba(111,125,141,.08)",
                        }}
                      >
                        {c.status}
                      </span>
                      <span className="text-[10px] tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
                        {c.category}
                      </span>
                      <span className="text-[10px]" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
                        Corrected {c.dateCorrected}
                      </span>
                      <div className="ml-auto">
                        <ShareButtons c={c} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div
                        className="rounded-lg border p-4"
                        style={{ background: "rgba(217,84,84,.05)", borderColor: "rgba(217,84,84,.15)" }}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <AlertTriangle size={12} style={{ color: "var(--gt-bad)" }} />
                          <span className="text-[9.5px] tracking-[0.12em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-bad)" }}>
                            What circulated
                          </span>
                        </div>
                        <div className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
                          {c.wrongFigure}
                        </div>
                        <p className="text-[11.5px] mt-1.5" style={{ color: "var(--gt-mut)" }}>
                          Source: {c.wrongSource}
                        </p>
                      </div>

                      <div
                        className="rounded-lg border p-4"
                        style={{ background: "rgba(49,210,150,.05)", borderColor: "rgba(49,210,150,.15)" }}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <CheckCircle2 size={12} style={{ color: "var(--gt-verify)" }} />
                          <span className="text-[9.5px] tracking-[0.12em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-verify)" }}>
                            What the record shows
                          </span>
                        </div>
                        <div className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
                          {c.rightFigure}
                        </div>
                        <p className="text-[11.5px] mt-1.5" style={{ color: "var(--gt-mut)" }}>
                          Source: {c.rightSource}
                        </p>
                      </div>
                    </div>

                    <p className="text-[13.5px] leading-relaxed mt-4" style={{ color: "var(--gt-fg2)" }}>
                      {c.explanation}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {c.receipts.map((r) => (
                        <span
                          key={r}
                          className="text-[10px] px-2.5 py-1 rounded border"
                          style={{ fontFamily: "var(--font-mono)", color: "var(--gt-fg2)", borderColor: "var(--gt-line2)" }}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div
              className="mt-10 rounded-lg border p-6 text-[13.5px] leading-relaxed"
              style={{ background: "var(--gt-bg2)", borderColor: "var(--gt-line)", color: "var(--gt-fg2)" }}
            >
              <strong style={{ color: "var(--gt-fg)" }}>How corrections work.</strong> When we find a figure circulating
              that contradicts the sealed record, we publish the correction here with the receipt. When the record is
              silent — when no verified figure exists — we say so rather than filling the gap with the best available
              guess. A correction with an honest "we don't know" is more valuable than a confident number with no
              source.
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
