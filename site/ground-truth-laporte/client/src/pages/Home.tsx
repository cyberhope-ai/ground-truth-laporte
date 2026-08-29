/*
  Home — The Record.
  Hero (dark, full-bleed, hero image) → the correction (launch content) →
  commitment thermometer preview → why we built this → project spine →
  open questions → careers teaser → engine teaser.
*/
import Layout from "@/components/Layout";
import { Eyebrow, H2, Reveal, Pill } from "@/components/Section";
import { Gauge } from "@/components/Thermometer";
import ProjectMap from "@/components/ProjectMap";
import {
  COMMITMENTS,
  CORRECTION,
  OPEN_QUESTIONS,
  PROJECT_SPINE,
  TIMELINE,
} from "@/lib/data";
import { Link } from "wouter";
import { ArrowRight, AlertTriangle, FileSearch, HelpCircle } from "lucide-react";

export default function Home() {
  const featured = COMMITMENTS.slice(0, 6);

  return (
    <Layout>
      {/* ── HERO ── */}
      <header className="relative overflow-hidden border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/manus-storage/hero-bg_17d9aef0.jpg)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,13,20,.82) 0%, rgba(10,13,20,.68) 45%, var(--gt-bg) 100%)",
          }}
        />
        <div className="relative max-w-[1120px] mx-auto px-5 md:px-7 pt-24 pb-20 md:pt-32 md:pb-28">
          <Reveal>
            <Eyebrow>La Porte County, Indiana · Microsoft Data Center · Community Record</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1
              className="text-[clamp(42px,7.4vw,76px)] font-bold leading-[0.99] tracking-[-0.03em] max-w-[13ch]"
              style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
            >
              What was promised.
              <span className="block" style={{ color: "var(--gt-fg2)" }}>
                What actually arrived.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-[18px] md:text-[20px] leading-relaxed max-w-[58ch] mt-6" style={{ color: "var(--gt-fg2)" }}>
              A verified public record of the Microsoft data center project in La Porte — every commitment tracked,
              every figure traceable to the document or recording it came from. Free, independent, and open to anyone:
              supporter, skeptic, reporter, or the company itself.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="flex flex-wrap gap-3 items-center mt-9">
              <Pill live>Record active · 2026</Pill>
              <Pill>Powered by PrecognitionOS</Pill>
              <Link
                href="/tracker"
                className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.1em] uppercase px-5 py-2.5 rounded transition-transform duration-150 active:scale-[0.97]"
                style={{ fontFamily: "var(--font-mono)", background: "var(--gt-gold)", color: "#0a0d14" }}
              >
                Open the tracker <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t" style={{ borderColor: "rgba(233,234,238,.12)" }}>
              {[
                ["$1B+", "announced investment"],
                ["17", "buildings planned"],
                ["12", "commitments tracked"],
                ["0", "figures without receipts"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div
                    className="text-[30px] md:text-[34px] font-bold tracking-tight"
                    style={{ fontFamily: "var(--font-display)", color: "var(--gt-gold)" }}
                  >
                    {n}
                  </div>
                  <div
                    className="text-[10.5px] tracking-[0.14em] uppercase mt-1"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--gt-fg2)" }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </header>

      {/* ── THE CORRECTION ── */}
      <section className="py-16 md:py-20 border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          <Reveal>
            <div
              className="rounded-xl border p-6 md:p-9"
              style={{
                borderColor: "var(--gt-gold-line)",
                background: "linear-gradient(160deg, rgba(209,168,75,.09), var(--gt-panel) 60%)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="shrink-0 w-10 h-10 rounded-lg grid place-items-center border"
                  style={{ borderColor: "var(--gt-gold-line)", background: "var(--gt-gold-dim)", color: "var(--gt-gold)" }}
                >
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <div
                    className="text-[10.5px] tracking-[0.18em] uppercase mb-2"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
                  >
                    The correction · launch finding
                  </div>
                  <h3
                    className="text-[22px] md:text-[26px] font-bold tracking-tight leading-tight"
                    style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
                  >
                    {CORRECTION.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed mt-3 max-w-[75ch]" style={{ color: "var(--gt-fg2)" }}>
                    {CORRECTION.body}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {CORRECTION.receipts.map((r) => (
                      <span
                        key={r}
                        className="text-[10.5px] tracking-[0.06em] px-2.5 py-1 rounded border"
                        style={{ fontFamily: "var(--font-mono)", color: "var(--gt-fg2)", borderColor: "var(--gt-line2)" }}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── THERMOMETER PREVIEW ── */}
      <section className="py-16 md:py-24 border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          <Reveal>
            <Eyebrow>The tracker</Eyebrow>
            <H2>
              Every promise becomes <span style={{ color: "var(--gt-gold)" }}>a line that fills in</span>
            </H2>
            <p className="text-[17px] leading-relaxed max-w-[62ch]" style={{ color: "var(--gt-fg2)" }}>
              Like a fundraising thermometer: each commitment starts empty and climbs as it is independently confirmed.
              Three of these lines legitimately read “no independent measurement exists” — and that honesty is the
              strongest credibility signal on this page. Click any row to see the receipts.
            </p>
          </Reveal>
          <div className="mt-8 border-t" style={{ borderColor: "var(--gt-line)" }}>
            {featured.map((c) => (
              <Gauge key={c.id} c={c} />
            ))}
          </div>
          <Reveal>
            <Link
              href="/tracker"
              className="inline-flex items-center gap-2 mt-8 text-[13px] font-medium tracking-[0.08em] uppercase transition-colors"
              style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
            >
              All 12 commitments + timeline <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── WHY ── */}
      <section className="py-16 md:py-24 border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7 grid gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <Reveal>
              <Eyebrow>Why we built this</Eyebrow>
              <H2>
                Nobody was arguing about facts. They were arguing about{" "}
                <span style={{ color: "var(--gt-gold)" }}>numbers nobody could check</span>.
              </H2>
            </Reveal>
            <Reveal delay={80}>
              <div className="space-y-4 text-[15.5px] leading-relaxed" style={{ color: "var(--gt-fg2)" }}>
                <p>
                  A billion-dollar data center is going up in La Porte. Residents asked exactly the right questions —
                  about water, electricity bills, jobs, what the county agreed to. The answers came from press releases,
                  from opponents, and from social media. Almost none of it could be traced to a source.
                </p>
                <p>
                  Indiana's own economic-development leadership said publicly in August 2026 that the message about
                  growth “is not landing.” <strong style={{ color: "var(--gt-fg)" }}>That is not a messaging problem. It
                  is a trust problem</strong> — and more messaging has never once solved one.
                </p>
                <p>
                  So we built the other thing. Not another voice in the argument:{" "}
                  <strong style={{ color: "var(--gt-fg)" }}>the shared record underneath it</strong>, where anyone can
                  click a number and see exactly where it came from.
                </p>
              </div>
            </Reveal>
          </div>
          <div className="grid gap-4 content-start">
            {[
              ["01", "For residents", "Straight answers to the questions actually being asked, with the source document attached to every figure."],
              ["02", "For local officials", "A durable record of what was agreed to, so commitments survive election cycles and staff turnover."],
              ["03", "For the companies", "A venue where keeping your word is visible and verifiable. Verified good news beats a press release, because it can be checked."],
            ].map(([n, t, b], i) => (
              <Reveal key={n} delay={i * 70}>
                <div
                  className="rounded-lg border p-5 transition-colors duration-200 hover:border-[var(--gt-gold-line)]"
                  style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line)" }}
                >
                  <div
                    className="text-[11px] tracking-[0.14em] mb-2"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
                  >
                    {n}
                  </div>
                  <div className="text-[16px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
                    {t}
                  </div>
                  <p className="text-[13.5px] leading-relaxed mt-1.5" style={{ color: "var(--gt-fg2)" }}>
                    {b}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECT SPINE ── */}
      <section className="py-16 md:py-24 border-b" style={{ borderColor: "var(--gt-line)", background: "var(--gt-bg2)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          <Reveal>
            <Eyebrow>The project, on the record</Eyebrow>
            <H2>
              The verified <span style={{ color: "var(--gt-gold)" }}>spine</span>
            </H2>
            <p className="text-[15.5px] max-w-[62ch] leading-relaxed" style={{ color: "var(--gt-fg2)" }}>
              The skeleton every other fact hangs from. Each row traces to a primary source; where credible outlets
              disagree, we flag the disagreement rather than collapse it.
            </p>
          </Reveal>
          <div className="mt-8 rounded-xl border overflow-hidden" style={{ borderColor: "var(--gt-line)" }}>
            {PROJECT_SPINE.map((f, i) => (
              <div
                key={f.label}
                className="grid md:grid-cols-[200px_1fr_220px] gap-2 md:gap-6 px-5 py-4 items-baseline"
                style={{
                  background: i % 2 === 0 ? "var(--gt-panel)" : "var(--gt-bg2)",
                  borderBottom: i < PROJECT_SPINE.length - 1 ? "1px solid var(--gt-line)" : "none",
                }}
              >
                <div
                  className="text-[10.5px] tracking-[0.14em] uppercase"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}
                >
                  {f.label}
                </div>
                <div className="text-[14.5px] leading-snug" style={{ color: "var(--gt-fg)" }}>
                  {f.value}
                </div>
                <div
                  className="text-[10.5px] tracking-[0.06em]"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
                >
                  {f.receipt}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      {/* ── MAP ── */}
      <section className="py-16 md:py-24 border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          <Reveal>
            <Eyebrow>Where it is</Eyebrow>
            <H2>
              The site and the <span style={{ color: "var(--gt-gold)" }}>community around it</span>
            </H2>
            <p className="text-[15.5px] max-w-[62ch] leading-relaxed mb-8" style={{ color: "var(--gt-fg2)" }}>
              Phase 1 at Radius Industrial Park, the Pleasant Township annexation zone, and the civic institutions the
              record ties to the project — the school corporation, the water utility, the training academy. Every marker
              carries its receipt.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <ProjectMap />
          </Reveal>
          <p className="text-[11.5px] mt-4" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
            Boundaries are approximate, drawn from the public record for orientation — not survey data.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          <Reveal>
            <Eyebrow>How we got here</Eyebrow>
            <H2>
              The project <span style={{ color: "var(--gt-gold)" }}>timeline</span>
            </H2>
          </Reveal>
          <div className="mt-10 relative">
            <div
              className="absolute left-[7px] md:left-[120px] top-1 bottom-1 w-px"
              style={{ background: "var(--gt-line2)" }}
            />
            <div className="space-y-8">
              {TIMELINE.map((t, i) => (
                <Reveal key={t.date} delay={i * 40}>
                  <div className="grid md:grid-cols-[96px_1fr] gap-2 md:gap-10 pl-7 md:pl-0 relative">
                    <div
                      className="absolute left-0 md:left-[113px] top-1.5 w-[15px] h-[15px] rounded-full border-2"
                      style={{ borderColor: "var(--gt-gold)", background: "var(--gt-bg)" }}
                    />
                    <div
                      className="text-[11px] tracking-[0.08em] uppercase md:text-right pt-0.5"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
                    >
                      {t.date}
                    </div>
                    <div className="md:pl-8">
                      <div
                        className="text-[16.5px] font-semibold tracking-tight"
                        style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
                      >
                        {t.title}
                      </div>
                      <p className="text-[14px] leading-relaxed mt-1.5 max-w-[68ch]" style={{ color: "var(--gt-fg2)" }}>
                        {t.body}
                      </p>
                      {t.receipt && (
                        <span
                          className="inline-block text-[10px] tracking-[0.08em] uppercase mt-2 px-2 py-0.5 rounded border"
                          style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)", borderColor: "var(--gt-line)" }}
                        >
                          {t.receipt}
                        </span>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OPEN QUESTIONS ── */}
      <section className="py-16 md:py-24 border-b" style={{ borderColor: "var(--gt-line)", background: "var(--gt-bg2)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          <Reveal>
            <Eyebrow>Honest unknowns</Eyebrow>
            <H2>
              Open questions, <span style={{ color: "var(--gt-gold)" }}>published as open</span>
            </H2>
            <p className="text-[15.5px] max-w-[64ch] leading-relaxed" style={{ color: "var(--gt-fg2)" }}>
              “We don't know yet — and here is who would have to tell us” is more persuasive to a skeptical reader than
              a confident answer. Each of these is a live question with a named path to resolution.
            </p>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 mt-10">
            {OPEN_QUESTIONS.map((q, i) => (
              <Reveal key={q.id} delay={(i % 2) * 70}>
                <div
                  className="rounded-lg border p-6 h-full transition-colors duration-200 hover:border-[var(--gt-gold-line)]"
                  style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line)" }}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <HelpCircle size={15} style={{ color: "var(--gt-gold)" }} />
                    <span
                      className="text-[10px] tracking-[0.14em] uppercase px-2 py-0.5 rounded"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--gt-warn)", background: "rgba(217,171,69,.1)" }}
                    >
                      {q.state}
                    </span>
                  </div>
                  <div
                    className="text-[17px] font-semibold leading-snug tracking-tight"
                    style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
                  >
                    {q.question}
                  </div>
                  <p className="text-[13.5px] leading-relaxed mt-2.5" style={{ color: "var(--gt-fg2)" }}>
                    {q.body}
                  </p>
                  <p className="text-[12px] leading-relaxed mt-3 pt-3 border-t" style={{ color: "var(--gt-mut)", borderColor: "var(--gt-line)" }}>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}>WHO COULD ANSWER · </span>
                    {q.whoCouldAnswer}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAREERS TEASER ── */}
      <section className="relative py-16 md:py-24 border-b overflow-hidden" style={{ borderColor: "var(--gt-line)" }}>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url(/manus-storage/section-careers_8274eb5c.jpg)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, var(--gt-bg) 20%, rgba(10,13,20,.75) 100%)" }} />
        <div className="relative max-w-[1120px] mx-auto px-5 md:px-7">
          <Reveal>
            <Eyebrow>Careers & training</Eyebrow>
            <H2>
              A $1B build is rising miles away. <span style={{ color: "var(--gt-gold)" }}>See where you fit.</span>
            </H2>
            <p className="text-[16px] max-w-[60ch] leading-relaxed" style={{ color: "var(--gt-fg2)" }}>
              Critical-environment technicians, IT technicians, electricians, network and fiber specialists, security,
              logistics. Indiana's first Microsoft Datacenter Academy is launching at Ivy Tech — and free tools exist to
              map your skills to the jobs this project creates.
            </p>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 mt-7 text-[12px] font-medium tracking-[0.1em] uppercase px-5 py-2.5 rounded border transition-all duration-150 hover:bg-[var(--gt-gold-dim)] active:scale-[0.97]"
              style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)", borderColor: "var(--gt-gold-line)" }}
            >
              Explore careers & training <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── ENGINE TEASER ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1120px] mx-auto px-5 md:px-7 grid gap-10 lg:grid-cols-2 items-center">
          <Reveal>
            <div
              className="rounded-xl border p-7"
              style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line)" }}
            >
              <div className="flex items-center gap-2.5 mb-5">
                <FileSearch size={16} style={{ color: "var(--gt-verify)" }} />
                <span
                  className="text-[10.5px] tracking-[0.16em] uppercase"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--gt-verify)" }}
                >
                  Live from the engine
                </span>
              </div>
              <div
                className="rounded-lg border p-4 text-[12px] leading-relaxed overflow-x-auto"
                style={{ background: "#0d1219", borderColor: "var(--gt-line)", fontFamily: "var(--font-mono)", color: "var(--gt-fg2)" }}
              >
                <div style={{ color: "var(--gt-mut)" }}>$ pcos ledger --project microsoft-laporte</div>
                <div className="mt-2">
                  <span style={{ color: "var(--gt-verify)" }}>✓</span> 12 commitments · 6 sealed artifacts
                </div>
                <div>
                  <span style={{ color: "var(--gt-verify)" }}>✓</span> speaker attribution 97% · two-anchor confirm
                </div>
                <div>
                  <span style={{ color: "var(--gt-warn)" }}>◌</span> 5 of 6 panel commitments carry no stated deadline
                </div>
                <div className="mt-2" style={{ color: "var(--gt-bad)" }}>
                  ✗ publish blocked: findings without right-of-reply record
                </div>
              </div>
              <p className="text-[12.5px] mt-4" style={{ color: "var(--gt-mut)" }}>
                The fairness gate is enforced in the database — not in a policy PDF.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Eyebrow>The engine underneath</Eyebrow>
            <H2>
              This site doesn't describe the technology. <span style={{ color: "var(--gt-gold)" }}>It is the technology, working in public.</span>
            </H2>
            <p className="text-[15.5px] leading-relaxed" style={{ color: "var(--gt-fg2)" }}>
              Ground Truth LaPorte runs on <strong style={{ color: "var(--gt-fg)" }}>PrecognitionOS</strong> — CyberHopeAI's
              evidence-chain platform, built for audit-grade work where a conclusion has to survive being challenged
              months later by a resident, a reporter, a county attorney, or a trillion-dollar company's lawyer.
            </p>
            <Link
              href="/how-we-work"
              className="inline-flex items-center gap-2 mt-6 text-[13px] font-medium tracking-[0.08em] uppercase"
              style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
            >
              How we work <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
