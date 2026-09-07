/*
  Ask the Record — an evidence-grounded question interface.
  Two modes: curated answers assembled from the sealed corpus, and a
  free-form LLM query grounded in the same corpus. Where the record is
  silent, both modes say so — that is the product working as designed.
*/
import Layout from "@/components/Layout";
import { Eyebrow, Reveal } from "@/components/Section";
import { COMMITMENTS, OPEN_QUESTIONS, EXPLAINERS } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import { useMemo, useState } from "react";
import { Search, ArrowRight, Sparkles, Loader2, Phone } from "lucide-react";
import { Link } from "wouter";
import { Streamdown } from "streamdown";

interface Answer {
  question: string;
  answer: string;
  receipts: string[];
  unknown?: string;
  related: string;
}

const CURATED: Answer[] = [
  {
    question: "Will the data center raise my electric bill?",
    answer:
      "Microsoft committed on August 27, 2026 to 'pay for our energy and our infrastructure' so residents' bills are not affected — a national policy tied to Brad Smith's January 2026 announcement. No LaPorte-specific metric or filing exists yet, so the commitment is tracked but unmeasured. The answer will ultimately come from NIPSCO/IURC filings, not from either side's characterization of them.",
    receipts: ["VID 0:14:13 · ITIA Summit 8/27/2026", "MSFT 1/13/2026 · Community-First policy", "IURC Cause 46183 · county intervention"],
    unknown: "No Microsoft-named IURC cause exists today — there is no public filing that prices this site's load.",
    related: "/learn",
  },
  {
    question: "How much water will it use?",
    answer:
      "Not confirmed by any primary source. The city water superintendent reportedly described roughly 1,000 gallons per day per building; a widely shared 1.8-billion-gallon figure is a generic industry extrapolation, not a LaPorte study. Microsoft committed to replenishing more water than it consumes — falsifiable, and tracked on the thermometer at zero until a real figure exists.",
    receipts: ["VID 0:14:23 · ITIA Summit 8/27/2026", "MSFT Cloud blog 12/9/2024 · closed-loop policy"],
    unknown: "The permitted withdrawal, the cooling design basis, and the replenishment mechanism.",
    related: "/learn",
  },
  {
    question: "How many megawatts is the LaPorte site?",
    answer:
      "There is no confirmed figure. The '2,400 MW' circulating in Indiana is Amazon's — IURC Cause 46362, with zero mentions of LaPorte or Microsoft in the order text. The '538 MW' attributed to this site appears only on aggregator sites with no cited source.",
    receipts: ["IURC Cause 46362 · full order text", "Aggregator survey · no cited sources"],
    unknown: "The site's actual load — answerable by NIPSCO filings, the interconnection queue, or Microsoft directly.",
    related: "/tracker",
  },
  {
    question: "What did the city agree to?",
    answer:
      "The 2024 deal — a 40-year personal-property exemption worth up to $100M — was rescinded on March 3, 2026. Microsoft now pays full property taxes, 15% of project property-tax revenue goes to La Porte schools for 20 years from 2028, and Microsoft pays $2.60 per square foot of the first building toward city services. The state IEDC 35-year sales-tax credit survived the renegotiation.",
    receipts: ["CITY 3/3/2026 · agreement", "VID 0:17:47 · Mayor Dermody", "IEDC 6/4/2024"],
    unknown: "No dollar value has ever been attached to the 15% school commitment in any public record.",
    related: "/learn",
  },
  {
    question: "How many jobs will there be?",
    answer:
      "Permanent: up to 200 by end-2032 in the 2024 announcement, revised to 600+ at the June 2026 groundbreaking — tripled with no published methodology, a fair question for Microsoft. Construction: 300–400 (April 2026) versus 2,000+ per day at peak (June 2026) — likely 'at any time' versus 'peak day.' We count permanent and construction jobs separately, always.",
    receipts: ["CITY 6/4/2024", "MSFT Local 6/18/2026", "ABC57 / HometownNewsNow"],
    related: "/careers",
  },
  {
    question: "How do I train for a data-center job?",
    answer:
      "Indiana's first Microsoft Datacenter Academy launches at Ivy Tech (MOU signed June 17, 2026, targeting the 2027-28 school year) with technician, engineering-operations, and supply-chain certificates. Hope Training Academy offers online AI, cybersecurity, and cloud programs statewide. SkillDNA maps your existing skills against the actual roles.",
    receipts: ["IVY 6/17/2026 · MOU announcement", "MSFT Local 6/18/2026"],
    related: "/careers",
  },
  {
    question: "What happens if Microsoft leaves?",
    answer:
      "The land, buildings, substation, and road and stormwater improvements remain regardless of operator, and the 15% school allocation attaches to the site's property-tax revenue — which any owner owes. The county's May 2026 ordinance sets setbacks, noise, and water limits. Whether any decommissioning bond exists is not yet in the public record — it is on the request list.",
    receipts: ["County ordinance 5/6/2026", "CITY 3/3/2026"],
    unknown: "Decommissioning and reclamation security for this site.",
    related: "/learn",
  },
];

export default function Ask() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Answer | null>(null);
  const [freeform, setFreeform] = useState("");
  const [llmAnswer, setLlmAnswer] = useState<string | null>(null);
  const [llmCorpusSize, setLlmCorpusSize] = useState<number | null>(null);

  const askMut = trpc.ask.query.useMutation({
    onSuccess: (data) => {
      setLlmAnswer(data.answer);
      setLlmCorpusSize(data.corpusSize);
    },
  });

  const matches = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return CURATED;
    return CURATED.filter(
      (a) =>
        a.question.toLowerCase().includes(t) ||
        a.answer.toLowerCase().includes(t) ||
        t.split(/\s+/).some((w) => w.length > 3 && a.answer.toLowerCase().includes(w))
    );
  }, [q]);

  const corpusSize = COMMITMENTS.length + OPEN_QUESTIONS.length + EXPLAINERS.length;

  const handleFreeform = () => {
    const question = freeform.trim();
    if (question.length < 5) return;
    setLlmAnswer(null);
    askMut.mutate({ question });
  };

  return (
    <Layout>
      <header className="border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7 pt-16 md:pt-20 pb-12">
          <Eyebrow>Ask the record · evidence-grounded only</Eyebrow>
          <h1
            className="text-[clamp(34px,5.4vw,56px)] font-bold leading-[1.0] tracking-[-0.025em] max-w-[20ch]"
            style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
          >
            Ask. Get the answer <span style={{ color: "var(--gt-gold)" }}>and the receipts.</span>
          </h1>
          <p className="text-[17px] leading-relaxed max-w-[64ch] mt-5" style={{ color: "var(--gt-fg2)" }}>
            This is not a generic chatbot. It answers only from the sealed corpus — {corpusSize} tracked objects plus
            the full meeting transcripts and extracted commitments — and where the record is silent, it says so.
          </p>
        </div>
      </header>

      {/* ── phone information line call-out ── */}
      <div className="max-w-[1120px] mx-auto px-5 md:px-7 -mt-1">
        <a
          href="tel:+12192583479"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border px-5 py-4 mt-8 transition-colors hover:border-[var(--gt-gold-line)]"
          style={{ borderColor: "var(--gt-gold-line)", background: "var(--gt-gold-dim, rgba(209,168,75,.1))" }}
        >
          <span className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 40, height: 40, background: "var(--gt-gold)" }}>
            <Phone size={19} style={{ color: "#0a0d14" }} />
          </span>
          <span className="leading-tight">
            <span className="block text-[10px] tracking-[0.16em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}>
              Prefer to talk? Call the information line
            </span>
            <span className="block text-[22px] font-bold tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
              (219) 258-3479
            </span>
          </span>
          <span className="text-[13px] leading-relaxed sm:ml-auto max-w-[36ch]" style={{ color: "var(--gt-fg2)" }}>
            Our AI assistant answers questions about the record 24/7 — same evidence, over the phone.
          </span>
        </a>
      </div>

      {/* ── free-form LLM query ── */}
      <section className="py-10 md:py-14 border-b" style={{ borderColor: "var(--gt-line)", background: "var(--gt-bg2)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          <Reveal>
            <div className="max-w-[720px]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={15} style={{ color: "var(--gt-gold)" }} />
                <span className="text-[10.5px] tracking-[0.16em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}>
                  Ask anything — grounded in the sealed corpus
                </span>
              </div>
              <div
                className="flex items-end gap-3 rounded-xl border px-5 py-4"
                style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line2)" }}
              >
                <textarea
                  value={freeform}
                  onChange={(e) => setFreeform(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleFreeform(); } }}
                  placeholder="e.g. What did Microsoft promise about water usage? What happened at the April 28 Plan Commission?"
                  rows={2}
                  className="w-full bg-transparent outline-none text-[15.5px] resize-none"
                  style={{ color: "var(--gt-fg)" }}
                />
                <button
                  onClick={handleFreeform}
                  disabled={askMut.isPending || freeform.trim().length < 5}
                  className="shrink-0 flex items-center gap-2 text-[11px] font-medium tracking-[0.1em] uppercase px-4 py-2.5 rounded transition-all duration-150 active:scale-[0.97] disabled:opacity-40"
                  style={{ fontFamily: "var(--font-mono)", background: "var(--gt-gold)", color: "#0a0d14" }}
                >
                  {askMut.isPending ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                  Ask
                </button>
              </div>
              <p className="text-[11px] mt-2" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
                Answers are generated from the sealed meeting transcripts and commitment ledger only. If the corpus
                doesn't cover your question, the system says so.
              </p>
            </div>
          </Reveal>

          {(llmAnswer || askMut.isPending) && (
            <Reveal>
              <div
                className="mt-6 rounded-xl border p-7 max-w-[720px]"
                style={{ background: "var(--gt-panel)", borderColor: "var(--gt-gold-line)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={14} style={{ color: "var(--gt-gold)" }} />
                  <span className="text-[10px] tracking-[0.14em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}>
                    AI answer · grounded in {llmCorpusSize || "…"} sealed sessions · verify against the record
                  </span>
                </div>
                {askMut.isPending ? (
                  <div className="flex items-center gap-3 py-4 text-[13px]" style={{ color: "var(--gt-mut)" }}>
                    <Loader2 size={16} className="animate-spin" style={{ color: "var(--gt-gold)" }} />
                    Searching the sealed corpus…
                  </div>
                ) : (
                  <div className="text-[14.5px] leading-relaxed" style={{ color: "var(--gt-fg2)" }}>
                    <Streamdown>{llmAnswer || ""}</Streamdown>
                  </div>
                )}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── curated questions ── */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          <Reveal>
            <Eyebrow>Curated answers</Eyebrow>
            <p className="text-[14px] max-w-[60ch] leading-relaxed mt-2" style={{ color: "var(--gt-fg2)" }}>
              The questions residents ask most, answered by hand from the sealed record — with receipts and honest gaps.
            </p>
          </Reveal>
          <div
            className="flex items-center gap-3 rounded-xl border px-5 py-4 max-w-[720px] mt-6"
            style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line2)" }}
          >
            <Search size={18} style={{ color: "var(--gt-gold)" }} className="shrink-0" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter curated questions…"
              className="w-full bg-transparent outline-none text-[15.5px]"
              style={{ color: "var(--gt-fg)" }}
            />
          </div>

          <div className="grid gap-10 lg:grid-cols-[380px_1fr] mt-10">
            <div className="space-y-2.5">
              {matches.map((a) => (
                <button
                  key={a.question}
                  onClick={() => setSel(a)}
                  className="w-full text-left px-4 py-3.5 rounded-lg border transition-all duration-150 active:scale-[0.99]"
                  style={{
                    borderColor: sel?.question === a.question ? "var(--gt-gold-line)" : "var(--gt-line)",
                    background: sel?.question === a.question ? "var(--gt-gold-dim)" : "var(--gt-panel)",
                  }}
                >
                  <span
                    className="text-[14px] font-medium leading-snug block"
                    style={{ color: sel?.question === a.question ? "var(--gt-gold)" : "var(--gt-fg2)" }}
                  >
                    {a.question}
                  </span>
                </button>
              ))}
              {matches.length === 0 && (
                <div
                  className="rounded-lg border p-5 text-[13.5px] leading-relaxed"
                  style={{ borderColor: "var(--gt-line)", color: "var(--gt-fg2)", background: "var(--gt-panel)" }}
                >
                  The sealed corpus doesn't cover that yet.{" "}
                  <Link href="/submit" style={{ color: "var(--gt-gold)" }}>
                    Ask it as a question
                  </Link>{" "}
                  — resident questions are what we research first.
                </div>
              )}
            </div>

            <div>
              {sel ? (
                <Reveal key={sel.question}>
                  <div className="rounded-xl border p-7" style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line)" }}>
                    <div
                      className="text-[10.5px] tracking-[0.16em] uppercase mb-3"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--gt-verify)" }}
                    >
                      Answer · grounded in the sealed record
                    </div>
                    <h3 className="text-[21px] font-bold tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
                      {sel.question}
                    </h3>
                    <p className="text-[15px] leading-relaxed mt-3" style={{ color: "var(--gt-fg2)" }}>
                      {sel.answer}
                    </p>
                    {sel.unknown && (
                      <div
                        className="mt-5 rounded-lg border px-4 py-3.5 text-[13.5px] leading-relaxed"
                        style={{ borderColor: "var(--gt-line2)", background: "var(--gt-bg2)", color: "var(--gt-fg2)" }}
                      >
                        <span style={{ fontFamily: "var(--font-mono)", color: "var(--gt-warn)" }}>
                          WHAT WE DON'T KNOW ·{" "}
                        </span>
                        {sel.unknown}
                      </div>
                    )}
                    <div className="mt-5 pt-4 border-t" style={{ borderColor: "var(--gt-line)" }}>
                      <div
                        className="text-[10px] tracking-[0.16em] uppercase mb-2.5"
                        style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
                      >
                        Receipts
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {sel.receipts.map((r) => (
                          <span
                            key={r}
                            className="text-[10.5px] px-2.5 py-1 rounded border"
                            style={{ fontFamily: "var(--font-mono)", color: "var(--gt-fg2)", borderColor: "var(--gt-line2)" }}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={sel.related}
                        className="inline-flex items-center gap-2 mt-4 text-[12px] font-medium tracking-[0.08em] uppercase"
                        style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
                      >
                        Go deeper <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ) : (
                <div
                  className="rounded-xl border border-dashed p-10 text-center"
                  style={{ borderColor: "var(--gt-line2)", color: "var(--gt-mut)" }}
                >
                  <p className="text-[14.5px]">Select a question to see the answer — with its evidence, its gaps, and its receipts.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
