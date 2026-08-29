/*
  How We Work — the product's warranty page.
  The method (7 principles), the engine (12-stage pipeline + database),
  who we are, funding & firewall, and what this site will never do.
*/
import Layout from "@/components/Layout";
import { Eyebrow, H2, Reveal } from "@/components/Section";
import { METHOD_PRINCIPLES, PIPELINE_STAGES } from "@/lib/data";
import { ShieldCheck, Database, Users, Ban } from "lucide-react";

export default function HowWeWork() {
  return (
    <Layout>
      <header className="border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7 pt-16 md:pt-20 pb-12">
          <Eyebrow>How we work · the warranty</Eyebrow>
          <h1
            className="text-[clamp(34px,5.4vw,56px)] font-bold leading-[1.0] tracking-[-0.025em] max-w-[20ch]"
            style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
          >
            Evidence, sealed <span style={{ color: "var(--gt-gold)" }}>before it is read</span>
          </h1>
          <p className="text-[17px] leading-relaxed max-w-[64ch] mt-5" style={{ color: "var(--gt-fg2)" }}>
            For a site whose only product is trust, this page is not boilerplate — it is the product's warranty. The
            method, the engine, the people, the funding, and the hard rules enforced in software.
          </p>
        </div>
      </header>

      {/* ── method ── */}
      <section className="py-14 md:py-20 border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          <Reveal>
            <Eyebrow>The method</Eyebrow>
            <H2>
              Seven rules, <span style={{ color: "var(--gt-gold)" }}>enforced not intended</span>
            </H2>
          </Reveal>
          <div className="mt-8 max-w-[860px]">
            {METHOD_PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 40}>
                <div
                  className="border-l-2 pl-5 py-1.5 my-5 transition-colors duration-200 hover:border-[var(--gt-gold)]"
                  style={{ borderColor: "var(--gt-line2)" }}
                >
                  <div className="text-[16.5px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
                    {p.title}
                  </div>
                  <p className="text-[14.5px] leading-relaxed mt-1" style={{ color: "var(--gt-fg2)" }}>
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── engine ── */}
      <section id="engine" className="py-14 md:py-20 border-b scroll-mt-20" style={{ borderColor: "var(--gt-line)", background: "var(--gt-bg2)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          <Reveal>
            <Eyebrow>PrecognitionOS · the trust plane</Eyebrow>
            <H2>
              The engine: <span style={{ color: "var(--gt-gold)" }}>twelve stages, one gate</span>
            </H2>
            <p className="text-[15.5px] max-w-[66ch] leading-relaxed" style={{ color: "var(--gt-fg2)" }}>
              Every artifact on this site passed through the same governed pipeline — ingestion, provenance, entity
              resolution, claim extraction, verification, corroboration, governance, publication. No single model
              produces a final answer alone; independent models cross-check, and the adversary pass runs on a different
              model than the drafting pass.
            </p>
          </Reveal>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mt-10">
            {PIPELINE_STAGES.map((s, i) => (
              <Reveal key={s.n} delay={(i % 3) * 60}>
                <div
                  className="rounded-lg border p-5 h-full transition-colors duration-200 hover:border-[var(--gt-gold-line)]"
                  style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line)" }}
                >
                  <div className="text-[11px] tracking-[0.14em]" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}>
                    STAGE {s.n}
                  </div>
                  <div className="text-[15.5px] font-semibold mt-1.5" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
                    {s.name}
                  </div>
                  <p className="text-[13px] leading-relaxed mt-2" style={{ color: "var(--gt-fg2)" }}>
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="grid md:grid-cols-2 gap-4 mt-10">
              <div className="rounded-lg border p-6" style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line)" }}>
                <div className="flex items-center gap-2.5 mb-3">
                  <Database size={16} style={{ color: "var(--gt-gold)" }} />
                  <span className="text-[10.5px] tracking-[0.16em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}>
                    The database underneath
                  </span>
                </div>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--gt-fg2)" }}>
                  A 22-table evidence graph on PostgreSQL with vector search: subjects, role tenure, sealed artifacts,
                  utterances with speaker and rhetorical-mode gates, claims, commitments, outcomes, submissions,
                  versioned verification records, and right-of-reply. Verification is its own object — never a boolean —
                  so a finding at 82% confidence today can become 98% in six months as a new version, without rewriting
                  history.
                </p>
              </div>
              <div className="rounded-lg border p-6" style={{ background: "var(--gt-panel)", borderColor: "rgba(232,119,107,.3)" }}>
                <div className="flex items-center gap-2.5 mb-3">
                  <ShieldCheck size={16} style={{ color: "var(--gt-bad)" }} />
                  <span className="text-[10.5px] tracking-[0.16em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-bad)" }}>
                    The publish gate
                  </span>
                </div>
                <div
                  className="rounded-lg border p-4 text-[12px] leading-relaxed"
                  style={{ background: "#0d1219", borderColor: "var(--gt-line)", fontFamily: "var(--font-mono)", color: "var(--gt-fg2)" }}
                >
                  <div>$ UPDATE publication SET published_at = now() …</div>
                  <div className="mt-1.5" style={{ color: "var(--gt-bad)" }}>
                    ERROR: publish blocked: 1 finding(s) have no right-of-reply record
                  </div>
                </div>
                <p className="text-[13.5px] leading-relaxed mt-3" style={{ color: "var(--gt-fg2)" }}>
                  A finding with no logged response attempt <strong style={{ color: "var(--gt-fg)" }}>cannot be
                  published</strong> — enforced by a database trigger, not a style guide.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── who we are ── */}
      <section className="py-14 md:py-20 border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          <Reveal>
            <Eyebrow>Who we are</Eyebrow>
            <H2>
              Independent, and <span style={{ color: "var(--gt-gold)" }}>openly funded</span>
            </H2>
            <p className="text-[15.5px] max-w-[66ch] leading-relaxed" style={{ color: "var(--gt-fg2)" }}>
              Ground Truth LaPorte is a community information project of{" "}
              <strong style={{ color: "var(--gt-fg)" }}>CyberHopeAI</strong>, an Indiana artificial-intelligence company.
              We are not funded by, affiliated with, or directed by Microsoft, the City of La Porte, La Porte County, or
              the State of Indiana.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── funding / firewall ── */}
      <section id="funding" className="py-14 md:py-20 border-b scroll-mt-20" style={{ borderColor: "var(--gt-line)", background: "var(--gt-bg2)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          <Reveal>
            <Eyebrow>Funding & the firewall</Eyebrow>
            <H2>
              Have interests. Disclose them. <span style={{ color: "var(--gt-gold)" }}>Never let them touch the ledger.</span>
            </H2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-8 mt-6 max-w-[980px]">
            <Reveal>
              <div className="space-y-4 text-[14.5px] leading-relaxed" style={{ color: "var(--gt-fg2)" }}>
                <p>
                  We have commercial interests, and we would rather state them than have you discover them. CyberHopeAI
                  builds the technology this site runs on, and the site may carry advertising from workforce-training
                  providers — an open marketplace, not one company.
                </p>
                <p>
                  <strong style={{ color: "var(--gt-fg)" }}>No advertiser, sponsor or partner has any influence over a
                  single figure on this site.</strong> Every source of funding will be named on this page. Ad units are
                  visibly labeled and visually distinct from evidence. The failure mode is not having commercial
                  interests — it is having undisclosed ones while implying independence.
                </p>
              </div>
            </Reveal>
            <Reveal delay={90}>
              <div className="rounded-lg border p-6" style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line)" }}>
                <div className="flex items-center gap-2.5 mb-4">
                  <Ban size={15} style={{ color: "var(--gt-bad)" }} />
                  <span className="text-[10.5px] tracking-[0.16em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-bad)" }}>
                    What this site will never do
                  </span>
                </div>
                <ul className="space-y-2.5 text-[13.5px] leading-relaxed" style={{ color: "var(--gt-fg2)" }}>
                  <li>· No comment sections, no ratings, no scoring of companies or officials.</li>
                  <li>· No opinion columns and no endorsements — for the project or against it.</li>
                  <li>· No publishing of anonymous claims. Submit evidence; we verify it or we don't run it.</li>
                  <li>· No political advocacy of any kind. We are for the record, not for a side.</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── symmetry ── */}
      <section className="py-14 md:py-16">
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          <Reveal>
            <div className="rounded-xl border p-7 md:p-9" style={{ borderColor: "var(--gt-gold-line)", background: "linear-gradient(160deg, rgba(209,168,75,.09), var(--gt-panel) 60%)" }}>
              <div className="flex items-center gap-2.5 mb-3">
                <Users size={16} style={{ color: "var(--gt-gold)" }} />
                <span className="text-[10.5px] tracking-[0.16em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}>
                  The symmetry rule
                </span>
              </div>
              <p className="text-[16px] leading-relaxed max-w-[75ch]" style={{ color: "var(--gt-fg)" }}>
                A site that only says favorable things is worth nothing, because nobody who needs persuading will read
                it. Rigor is not a constraint on this project —{" "}
                <strong>rigor is the product</strong>. Every verified item that cuts against the project is what makes
                the verified items that favor it believable. Company-favorable and community-favorable findings are
                visible here at launch, with identical weight.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
