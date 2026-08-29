/*
  Careers & Training — where residents can get the skills for the jobs
  this project creates. Career paths, training providers, and the
  SkillDNA journey. Advertising-free; providers listed, not ranked.
*/
import Layout from "@/components/Layout";
import { Eyebrow, H2, Reveal } from "@/components/Section";
import { CAREER_PATHS, TRAINING } from "@/lib/data";
import { ArrowRight, GraduationCap, Route, BookOpen, Users, Award, ExternalLink } from "lucide-react";

export default function Careers() {
  return (
    <Layout>
      <header className="relative border-b overflow-hidden" style={{ borderColor: "var(--gt-line)" }}>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url(/manus-storage/section-careers_8274eb5c.jpg)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,13,20,.7), var(--gt-bg))" }} />
        <div className="relative max-w-[1120px] mx-auto px-5 md:px-7 pt-16 md:pt-20 pb-14">
          <Eyebrow>Jobs & skills in La Porte</Eyebrow>
          <h1
            className="text-[clamp(34px,5.4vw,56px)] font-bold leading-[1.0] tracking-[-0.025em] max-w-[20ch]"
            style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
          >
            The jobs are real. <span style={{ color: "var(--gt-gold)" }}>The training exists.</span>
          </h1>
          <p className="text-[17px] leading-relaxed max-w-[64ch] mt-5" style={{ color: "var(--gt-fg2)" }}>
            A $1 billion technology investment is being built miles from you. Find out whether your skills match the
            jobs it may create — and where to close the gap, from Indiana's first Microsoft Datacenter Academy at Ivy
            Tech to free online programs you can start tonight.
          </p>
        </div>
      </header>

      {/* ── career paths ── */}
      <section className="py-14 md:py-20 border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          <Reveal>
            <Eyebrow>Projected data-center workforce</Eyebrow>
            <H2>
              Six ways <span style={{ color: "var(--gt-gold)" }}>in</span>
            </H2>
            <p className="text-[15.5px] max-w-[62ch] leading-relaxed" style={{ color: "var(--gt-fg2)" }}>
              Microsoft's own hiring categories for this site, plus the trades that build and maintain it. None of
              these roles requires a four-year degree to start.
            </p>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-10">
            {CAREER_PATHS.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 70}>
                <div
                  className="rounded-lg border p-6 h-full flex flex-col transition-colors duration-200 hover:border-[var(--gt-gold-line)]"
                  style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line)" }}
                >
                  <div
                    className="text-[10px] tracking-[0.14em] uppercase"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
                  >
                    {c.kind}
                  </div>
                  <div
                    className="text-[18px] font-semibold tracking-tight mt-2 leading-snug"
                    style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
                  >
                    {c.title}
                  </div>
                  <p className="text-[13.5px] leading-relaxed mt-2.5 flex-1" style={{ color: "var(--gt-fg2)" }}>
                    {c.description}
                  </p>
                  {c.payNote && (
                    <p className="text-[12px] mt-3" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-verify)" }}>
                      {c.payNote}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {c.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[10.5px] px-2 py-1 rounded border"
                        style={{ fontFamily: "var(--font-mono)", color: "var(--gt-fg2)", borderColor: "var(--gt-line2)" }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── the journey ── */}
      <section className="py-14 md:py-20 border-b" style={{ borderColor: "var(--gt-line)", background: "var(--gt-bg2)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          <Reveal>
            <Eyebrow>How learning becomes a verified capability</Eyebrow>
            <H2>
              Learn → demonstrate → verify → <span style={{ color: "var(--gt-gold)" }}>match</span>
            </H2>
          </Reveal>
          <div className="grid md:grid-cols-4 gap-4 mt-10">
            {[
              ["Your SkillDNA", "A free profile of what you can actually do — not a resume of what you say you can do."],
              ["Local demand", "Compared against the real roles this project and its contractors are hiring for."],
              ["Skill gaps", "The specific, named gaps between you and the role — not a generic 'learn to code.'"],
              ["Training that closes them", "Local, online, and employer programs — with evidence that feeds back into your profile."],
            ].map(([t, b], i) => (
              <Reveal key={t} delay={i * 80}>
                <div className="relative rounded-lg border p-5 h-full" style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line)" }}>
                  <div
                    className="text-[22px] font-bold"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="text-[15.5px] font-semibold mt-2" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
                    {t}
                  </div>
                  <p className="text-[13px] leading-relaxed mt-2" style={{ color: "var(--gt-fg2)" }}>
                    {b}
                  </p>
                  {i < 3 && (
                    <ArrowRight
                      size={16}
                      className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 z-10"
                      style={{ color: "var(--gt-gold)" }}
                    />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── providers ── */}
      <section className="py-14 md:py-20">
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          <Reveal>
            <Eyebrow>Where to train</Eyebrow>
            <H2>
              Training <span style={{ color: "var(--gt-gold)" }}>providers</span>
            </H2>
            <p className="text-[15.5px] max-w-[64ch] leading-relaxed" style={{ color: "var(--gt-fg2)" }}>
              An open directory, not a funnel. Providers are listed, never ranked, and no provider has any influence
              over any figure on this site.
            </p>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 mt-10">
            {TRAINING.map((t, i) => (
              <Reveal key={t.name} delay={(i % 2) * 70}>
                <div
                  className="rounded-lg border p-6 h-full transition-colors duration-200 hover:border-[var(--gt-gold-line)]"
                  style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line)" }}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <GraduationCap size={16} style={{ color: "var(--gt-gold)" }} />
                    <span
                      className="text-[10px] tracking-[0.14em] uppercase"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}
                    >
                      {t.kind}
                    </span>
                  </div>
                  <div
                    className="text-[17.5px] font-semibold leading-snug tracking-tight"
                    style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
                  >
                    {t.name}
                  </div>
                  <div className="text-[12px] mt-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}>
                    {t.location}
                  </div>
                  <ul className="mt-4 space-y-1.5">
                    {t.programs.map((p) => (
                      <li key={p} className="text-[13.5px] flex items-start gap-2" style={{ color: "var(--gt-fg2)" }}>
                        <span style={{ color: "var(--gt-verify)" }}>›</span> {p}
                      </li>
                    ))}
                  </ul>
                  {t.note && (
                    <p className="text-[12.5px] leading-relaxed mt-4 pt-3 border-t" style={{ color: "var(--gt-mut)", borderColor: "var(--gt-line)" }}>
                      {t.note}
                    </p>
                  )}
                  {t.url && (
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] mt-3 underline underline-offset-2"
                      style={{ color: "var(--gt-gold)", fontFamily: "var(--font-mono)" }}
                    >
                      Official announcement <ArrowRight size={12} />
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          {/* ── Hope Training Academy spotlight ── */}
          <Reveal>
            <div
              className="mt-12 rounded-xl border overflow-hidden"
              style={{ borderColor: "var(--gt-gold-line)", background: "linear-gradient(160deg, rgba(209,168,75,.06), var(--gt-panel) 50%)" }}
            >
              <div className="p-7 md:p-9">
                <div className="flex items-center gap-2.5 mb-4">
                  <BookOpen size={16} style={{ color: "var(--gt-gold)" }} />
                  <span className="text-[10.5px] tracking-[0.16em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}>
                    Featured provider · our training arm
                  </span>
                </div>
                <h3 className="text-[clamp(22px,3vw,30px)] font-bold tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
                  Hope Training Academy
                </h3>
                <p className="text-[15px] leading-relaxed mt-3 max-w-[68ch]" style={{ color: "var(--gt-fg2)" }}>
                  CyberHopeAI's training arm, operated through the Video Game Palooza 501(c)(3) public charity. Every
                  dollar of course proceeds funds free tech training and living-wage career placement. The catalog
                  covers the full path from first-time computer user to certified data-center professional — 86 online
                  IT courses, self-paced, available anywhere in Indiana.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mt-7">
                  {[
                    {
                      icon: <BookOpen size={15} />,
                      title: "Online IT courses",
                      desc: "86 self-paced courses from $142 — networking, cybersecurity, cloud, virtualization, and certification tracks with exam vouchers included. A La Porte resident discount code is being established.",
                    },
                    {
                      icon: <Users size={15} />,
                      title: "Apprenticeship programs",
                      desc: "Employer-led, earn-while-you-learn pathways modeled on Indiana's CEMETS iLab framework. High-school juniors and seniors split weeks between school and paid work; adults can enter at any career stage. Graduates emerge with certificates, an associate's degree, and a profession — not just a resume line.",
                    },
                    {
                      icon: <Award size={15} />,
                      title: "Verified competency",
                      desc: "Course completions and apprenticeship milestones feed directly into a SkillDNA profile as sealed, verifiable evidence — not self-reported claims. Employers see what you can actually do.",
                    },
                  ].map((f) => (
                    <div
                      key={f.title}
                      className="rounded-lg border p-5"
                      style={{ background: "var(--gt-bg2)", borderColor: "var(--gt-line)" }}
                    >
                      <div className="flex items-center gap-2 mb-2.5" style={{ color: "var(--gt-gold)" }}>
                        {f.icon}
                        <span className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
                          {f.title}
                        </span>
                      </div>
                      <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--gt-fg2)" }}>
                        {f.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-7">
                  <a
                    href="https://shop.videogamepalooza.org/collections/courses-information-technology"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.1em] uppercase px-5 py-2.5 rounded transition-transform duration-150 active:scale-[0.97]"
                    style={{ fontFamily: "var(--font-mono)", background: "var(--gt-gold)", color: "#0a0d14" }}
                  >
                    Browse IT courses <ExternalLink size={13} />
                  </a>
                  <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
                    La Porte resident discount code coming soon
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div
              className="mt-10 rounded-xl border p-7 flex flex-col md:flex-row md:items-center gap-6"
              style={{
                borderColor: "var(--gt-gold-line)",
                background: "linear-gradient(160deg, rgba(209,168,75,.09), var(--gt-panel) 60%)",
              }}
            >
              <div
                className="shrink-0 w-12 h-12 rounded-lg grid place-items-center border"
                style={{ borderColor: "var(--gt-gold-line)", background: "var(--gt-gold-dim)", color: "var(--gt-gold)" }}
              >
                <Route size={20} />
              </div>
              <div className="flex-1">
                <div className="text-[18px] font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
                  Not sure where you fit?
                </div>
                <p className="text-[14px] leading-relaxed mt-1" style={{ color: "var(--gt-fg2)" }}>
                  Create a free SkillDNA profile and compare yourself against the actual roles this project creates.
                  Your profile is private by default — you choose what to share, and with whom.
                </p>
              </div>
              <a
                href="https://cyberhopeai.com/"
                target="_blank"
                rel="noreferrer"
                className="shrink-0 inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.1em] uppercase px-5 py-2.5 rounded transition-transform duration-150 active:scale-[0.97]"
                style={{ fontFamily: "var(--font-mono)", background: "var(--gt-gold)", color: "#0a0d14" }}
              >
                Start free <ArrowRight size={14} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
