/*
  Meetings & Decisions — the civic record.
  Local council sessions, commissioner votes, and public panels, each with
  decisions made, money discussed, commitments extracted, and unanswered
  questions. Data is served from the database via tRPC; the transcript for
  the ITIA panel is the sealed, speaker-attributed record.
*/
import { ProvenanceRow } from "@/lib/provenance";
import Layout from "@/components/Layout";
import { Eyebrow, H2, Reveal } from "@/components/Section";
import { trpc } from "@/lib/trpc";
import { useMemo, useState } from "react";
import {
  CalendarDays, Landmark, FileText, Video, ChevronDown,
  CircleDollarSign, HelpCircle, Gavel, Mic, Sparkles, Loader2, Search, X, Download,
  Play, AlertTriangle, CheckCircle2, Share2, Link2,
} from "lucide-react";
import { Streamdown } from "streamdown";
import { useRef, useState as useStateReact } from "react";
import { toast } from "sonner";

/* ── Linked video evidence — YouTube coverage of the LaPorte Microsoft project ── */
interface FactCheck {
  claim: string;
  verdict: "verified" | "open" | "unmeasurable";
  note: string;
  timestamp?: number; // seconds into the video
}

interface VideoEvidence {
  youtubeId: string;
  title: string;
  source: string;
  date: string;
  duration: string;
  summary: string;
  transcript?: string;
  factCheck: FactCheck[];
}

const VIDEO_EVIDENCE: VideoEvidence[] = [
  {
    youtubeId: "rFb4UPRa5Lc",
    title: "LaPorte City Council approves second Microsoft data center",
    source: "WSBT 22",
    date: "2026-05-18",
    duration: "~2 min",
    summary: "Covers the unanimous May 18 annexation vote. Mayor Dermody: 'the community is rallying around the project.' Union official: 'good-paying construction jobs with good benefits.' Resident: 'I am against the annexation.'",
    factCheck: [
      { claim: "Council voted unanimously to annex 9 parcels", verdict: "verified", note: "Confirmed by WSBT, ABC57, and Ink Free News reporting.", timestamp: 8 },
      { claim: "Original plan approved in 2024", verdict: "verified", note: "June 4, 2024 announcement by Gov. Holcomb.", timestamp: 25 },
      { claim: "Microsoft is 'so respectful of our water resources'", verdict: "unmeasurable", note: "Attributed to Bert Cook (LEAP). No independent water usage data exists in the public record to test this characterization.", timestamp: 65 },
    ],
  },
  {
    youtubeId: "oLtTcQnA5Kg",
    title: "LaPorte breaks ground on Microsoft data center campus",
    source: "WNDU 16",
    date: "2026-06-17",
    duration: "~2 min",
    summary: "Groundbreaking coverage. Brad Smith: 'We don't use the local communities' water more than a single restaurant does on an annual basis.' Display poster: ~500 acres. Phase 1: six buildings, third building expected winter 2029. Potential expansion to 17 buildings.",
    transcript: `[00:00] Anchor: All right, some of the news we're following tonight at 6:00. It's been years in the making, and now today the city of La Porte hit a major milestone. The city is now moving forward on the first steps to create a Microsoft data center campus, and our Emma Brott was there for it. She joins us now with this report from La Porte.

[00:15] Emma Brott (reporter): Well, you might be wondering where I am. I'm at the site of phase one of a brand-new data center campus here in the city of La Porte. Microsoft officials and local leaders came together to break ground on this project today.

[00:27] Brott: This is the site of a soon-to-be Microsoft data center between Boyd Boulevard and County Road 250 in the city of La Porte. Phase one of construction in earnest starts now.

[00:38] Brad Smith (Microsoft Vice Chair & President): Soon you'll see cranes here. Soon you'll see construction workers here. Um, and you're gonna see building go up fast.

[00:46] Brott: You can already see that heavy machinery on site today. The Microsoft vice chair and president tells me the company promises to pay its way by covering its share of electricity and water costs, also promising…

[00:59] Smith: And we don't use the local community's water more than, say, a single restaurant does on an annual basis.

[01:06] Brott: The city is committed to provide 15% of the data center's revenue to the La Porte Community School Corporation.

[01:12] Mayor Tom Dermody: When Indiana is considered a competitive state for education, uh, we need to give Indi— uh, La Porte all the tools possible to be successful. Our kids are gonna come out with a, a special degree that I think others will struggle to compete with.

[01:29] Brott: Phase one includes six buildings. This spring, the city annexed more land for a second phase of the project. Once they move forward, the campus could grow from six buildings to 17.

[01:40] Brott: The third data center building of phase one is expected to be completed around the time of winter of 2029, but everything is subject to change based on permit approval. These are only the preliminary stages at this time.

[01:50] Brott: For 16 News now, I'm Emma Brott.`,
    factCheck: [
      { claim: "~500 acres acquired for Phase 1", verdict: "verified", note: "Consistent with the 489-acre figure in the June 4, 2024 announcement.", timestamp: 15 },
      { claim: "Water usage comparable to a single restaurant", verdict: "unmeasurable", note: "Brad Smith's characterization. No LaPorte-specific water withdrawal figure exists in the public record to verify or refute this.", timestamp: 42 },
      { claim: "15% of data center revenue to schools", verdict: "verified", note: "Consistent with the March 3, 2026 city announcement — 15% of project property-tax revenue for 20 years from 2028.", timestamp: 55 },
      { claim: "Third building expected winter 2029", verdict: "open", note: "Reporter-stated timeline, subject to permit approvals. Not a Microsoft commitment on record.", timestamp: 30 },
    ],
  },
  {
    youtubeId: "0W6RfoOr2VU",
    title: "LaPorte eyes potential annexation for second Microsoft data center",
    source: "WSBT 22",
    date: "2026-04-14",
    duration: "~2 min",
    summary: "Preview of the April 13 hearing. Bert Cook (LEAP) describes the 'super-voluntary annexation' — all 9 property owners petitioning. Discussions ongoing for nearly 4 years. Council vote expected May 18.",
    factCheck: [
      { claim: "All 9 property owners petitioning for annexation", verdict: "verified", note: "Consistent with the 'super-voluntary' description in the May 18 Ink Free News report.", timestamp: 20 },
      { claim: "Discussions ongoing for nearly 4 years", verdict: "open", note: "Attributed to Cook. Consistent with the 2024 announcement timeline but not independently documented.", timestamp: 35 },
      { claim: "Council vote expected May 18", verdict: "verified", note: "The vote occurred May 18, 2026 — unanimous approval.", timestamp: 80 },
    ],
  },
];

function fmtTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function VideoCard({ v, delay }: { v: VideoEvidence; delay: number }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const shareClaim = (fc: FactCheck, idx: number) => {
    const text = encodeURIComponent(
      `Ground Truth LaPorte fact-check: "${fc.claim}" — ${fc.verdict}. ${fc.note} laporte-truth.icystone-d1e018c9.centralus.azurecontainerapps.io/meetings`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const copyClaim = (fc: FactCheck, idx: number) => {
    navigator.clipboard.writeText(
      `"${fc.claim}" — ${fc.verdict}. ${fc.note} (Ground Truth LaPorte: laporte-truth.icystone-d1e018c9.centralus.azurecontainerapps.io/meetings)`
    );
    setCopiedIdx(idx);
    toast.success("Claim copied to clipboard");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const seekTo = (seconds: number) => {
    if (iframeRef.current) {
      iframeRef.current.src = `https://www.youtube.com/embed/${v.youtubeId}?start=${seconds}&autoplay=1&rel=0`;
    }
  };

  return (
    <Reveal delay={delay}>
      <div
        className="rounded-xl border overflow-hidden transition-colors duration-200 hover:border-[var(--gt-gold-line)]"
        style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line)" }}
      >
        {/* embedded player */}
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${v.youtubeId}?rel=0`}
            title={v.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            style={{ border: "none" }}
          />
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Play size={13} style={{ color: "var(--gt-gold)" }} />
            <span className="text-[10px] tracking-[0.12em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
              {v.source} · {v.date} · {v.duration}
            </span>
          </div>
          <div
            className="text-[15px] font-semibold leading-snug tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
          >
            {v.title}
          </div>
          <p className="text-[12.5px] leading-relaxed mt-2" style={{ color: "var(--gt-fg2)" }}>
            {v.summary}
          </p>

          <div className="mt-4 pt-3 border-t space-y-2.5" style={{ borderColor: "var(--gt-line)" }}>
            <div className="text-[9.5px] tracking-[0.14em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}>
              Fact-check · click a timestamp to jump to the claim
            </div>
            {v.factCheck.map((fc) => (
              <div key={fc.claim} className="flex items-start gap-2">
                {fc.verdict === "verified" ? (
                  <CheckCircle2 size={12} className="shrink-0 mt-0.5" style={{ color: "var(--gt-verify)" }} />
                ) : fc.verdict === "open" ? (
                  <AlertTriangle size={12} className="shrink-0 mt-0.5" style={{ color: "var(--gt-warn)" }} />
                ) : (
                  <HelpCircle size={12} className="shrink-0 mt-0.5" style={{ color: "var(--gt-mut)" }} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11.5px] font-medium" style={{ color: "var(--gt-fg)" }}>
                      {fc.claim}
                    </span>
                    <span
                      className="text-[9px] tracking-[0.08em] uppercase px-1.5 py-0.5 rounded"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: fc.verdict === "verified" ? "var(--gt-verify)" : fc.verdict === "open" ? "var(--gt-warn)" : "var(--gt-mut)",
                        background: fc.verdict === "verified" ? "rgba(49,210,150,.08)" : fc.verdict === "open" ? "rgba(217,171,69,.08)" : "rgba(111,125,141,.08)",
                      }}
                    >
                      {fc.verdict}
                    </span>
                    {fc.timestamp !== undefined && (
                      <button
                        onClick={() => seekTo(fc.timestamp!)}
                        className="text-[9.5px] px-1.5 py-0.5 rounded border transition-all duration-150 active:scale-[0.95] hover:border-[var(--gt-gold)]"
                        style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)", borderColor: "var(--gt-line2)" }}
                      >
                        ▸ {fmtTimestamp(fc.timestamp)}
                      </button>
                    )}
                  </div>
                  <p className="text-[10.5px] leading-relaxed mt-0.5" style={{ color: "var(--gt-mut)" }}>
                    {fc.note}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <button
                      onClick={() => shareClaim(fc, v.factCheck.indexOf(fc))}
                      className="w-6 h-6 rounded border grid place-items-center transition-all duration-150 active:scale-[0.93] hover:border-[var(--gt-gold)]"
                      style={{ borderColor: "var(--gt-line2)", color: "var(--gt-mut)" }}
                      title="Share on X"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </button>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://laporte-truth.icystone-d1e018c9.centralus.azurecontainerapps.io/meetings")}&quote=${encodeURIComponent(`"${fc.claim}" — ${fc.verdict}. ${fc.note}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-6 h-6 rounded border grid place-items-center transition-all duration-150 active:scale-[0.93] hover:border-[var(--gt-gold)]"
                      style={{ borderColor: "var(--gt-line2)", color: "var(--gt-mut)" }}
                      title="Share on Facebook"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    <button
                      onClick={() => copyClaim(fc, v.factCheck.indexOf(fc))}
                      className="w-6 h-6 rounded border grid place-items-center transition-all duration-150 active:scale-[0.93] hover:border-[var(--gt-gold)]"
                      style={{
                        borderColor: copiedIdx === v.factCheck.indexOf(fc) ? "var(--gt-verify)" : "var(--gt-line2)",
                        color: copiedIdx === v.factCheck.indexOf(fc) ? "var(--gt-verify)" : "var(--gt-mut)",
                      }}
                      title="Copy claim"
                    >
                      {copiedIdx === v.factCheck.indexOf(fc) ? <CheckCircle2 size={10} /> : <Link2 size={10} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {v.transcript && (
            <div className="mt-4 pt-3 border-t" style={{ borderColor: "var(--gt-line)" }}>
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.1em] uppercase transition-colors"
                style={{ fontFamily: "var(--font-mono)", color: "var(--gt-verify)" }}
              >
                <FileText size={11} />
                {showTranscript ? "Hide transcript" : "Verbatim transcript"}
                <ChevronDown size={12} style={{ transform: showTranscript ? "rotate(180deg)" : "none", transition: "transform 200ms" }} />
              </button>
              {showTranscript && (
                <div
                  className="mt-3 rounded-lg border p-4 text-[11.5px] leading-relaxed whitespace-pre-wrap max-h-[280px] overflow-y-auto"
                  style={{
                    background: "#0d1219",
                    borderColor: "var(--gt-line)",
                    fontFamily: "var(--font-mono)",
                    color: "var(--gt-fg2)",
                  }}
                >
                  {v.transcript}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}

function exportMeetingsCsv(meetings: any[]) {
  const header = "Slug,Body,Title,Date,Summary,Decisions,Money Discussed,Unanswered Questions\n";
  const rows = meetings.map((m) =>
    [
      m.slug,
      `"${m.body}"`,
      `"${(m.title || "").replace(/"/g, '""')}"`,
      m.heldOn,
      `"${(m.summary || "").replace(/"/g, '""')}"`,
      `"${((m.decisions as string[]) || []).join("; ").replace(/"/g, '""')}"`,
      `"${((m.moneyDiscussed as string[]) || []).join("; ").replace(/"/g, '""')}"`,
      `"${((m.unanswered as string[]) || []).join("; ").replace(/"/g, '""')}"`,
    ].join(",")
  );
  const csv = header + rows.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ground-truth-laporte-meetings-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function Section({
  icon,
  title,
  items,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  color: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span style={{ color }}>{icon}</span>
        <span
          className="text-[10.5px] tracking-[0.14em] uppercase"
          style={{ fontFamily: "var(--font-mono)", color }}
        >
          {title}
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((d, i) => (
          <li key={i} className="text-[13.5px] leading-relaxed flex items-start gap-2" style={{ color: "var(--gt-fg2)" }}>
            <span style={{ color }} className="mt-0.5">›</span> {d}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Meetings() {
  const { data: meetings, isLoading } = trpc.meetings.list.useQuery();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [bodyFilter, setBodyFilter] = useState<string | null>(null);
  const { data: detail } = trpc.meetings.bySlug.useQuery(
    { slug: openSlug! },
    { enabled: !!openSlug }
  );
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const summarizeMut = trpc.meetings.summarize.useMutation({
    onSuccess: (data, vars) => {
      setSummaries((p) => ({ ...p, [vars.slug]: data.summary }));
    },
  });

  const bodies = useMemo(() => {
    if (!meetings) return [];
    return Array.from(new Set(meetings.map((m) => m.body))).sort();
  }, [meetings]);

  const filtered = useMemo(() => {
    if (!meetings) return [];
    let result = meetings;
    if (bodyFilter) result = result.filter((m) => m.body === bodyFilter);
    const t = search.trim().toLowerCase();
    if (t) {
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(t) ||
          m.body.toLowerCase().includes(t) ||
          (m.summary || "").toLowerCase().includes(t) ||
          m.heldOn.includes(t) ||
          ((m.decisions as string[]) || []).some((d) => d.toLowerCase().includes(t)) ||
          ((m.moneyDiscussed as string[]) || []).some((d) => d.toLowerCase().includes(t)) ||
          ((m.unanswered as string[]) || []).some((d) => d.toLowerCase().includes(t))
      );
    }
    return result;
  }, [meetings, search, bodyFilter]);

  return (
    <Layout>
      <header className="border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7 pt-16 md:pt-20 pb-12">
          <Eyebrow>Meetings & decisions · the civic record</Eyebrow>
          <h1
            className="text-[clamp(34px,5.4vw,56px)] font-bold leading-[1.0] tracking-[-0.025em] max-w-[20ch]"
            style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
          >
            What was decided, <span style={{ color: "var(--gt-gold)" }}>and what was promised in the room</span>
          </h1>
          <p className="text-[17px] leading-relaxed max-w-[64ch] mt-5" style={{ color: "var(--gt-fg2)" }}>
            Every local session that shaped this project — council votes, commissioner ordinances, public panels —
            with decisions, money discussed, commitments extracted, and the questions that went unanswered. Where a
            recording exists, the transcript is the sealed, speaker-attributed record.
          </p>
        </div>
      </header>

      <section className="py-12 md:py-16">
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          {/* search & filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div
              className="flex items-center gap-3 rounded-lg border px-4 py-3 flex-1"
              style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line2)" }}
            >
              <Search size={16} style={{ color: "var(--gt-gold)" }} className="shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search titles, decisions, commitments, dates…"
                className="w-full bg-transparent outline-none text-[14px]"
                style={{ color: "var(--gt-fg)" }}
              />
              {search && (
                <button onClick={() => setSearch("")} className="shrink-0 p-0.5" style={{ color: "var(--gt-mut)" }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setBodyFilter(null)}
                className="text-[10.5px] tracking-[0.08em] uppercase px-3 py-2.5 rounded-lg border transition-all duration-150 active:scale-[0.97]"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: !bodyFilter ? "#0a0d14" : "var(--gt-fg2)",
                  background: !bodyFilter ? "var(--gt-gold)" : "transparent",
                  borderColor: !bodyFilter ? "var(--gt-gold)" : "var(--gt-line2)",
                }}
              >
                All
              </button>
              {bodies.map((b) => (
                <button
                  key={b}
                  onClick={() => setBodyFilter(bodyFilter === b ? null : b)}
                  className="text-[10.5px] tracking-[0.08em] uppercase px-3 py-2.5 rounded-lg border transition-all duration-150 active:scale-[0.97]"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: bodyFilter === b ? "#0a0d14" : "var(--gt-fg2)",
                    background: bodyFilter === b ? "var(--gt-gold)" : "transparent",
                    borderColor: bodyFilter === b ? "var(--gt-gold)" : "var(--gt-line2)",
                  }}
                >
                  {b.length > 30 ? b.slice(0, 28) + "…" : b}
                </button>
              ))}
            </div>
          </div>

          {(search || bodyFilter) && (
            <div className="text-[11px] mb-5" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
              {filtered.length} of {meetings?.length || 0} sessions
              {search && ` matching "${search}"`}
              {bodyFilter && ` in ${bodyFilter}`}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="flex justify-end mb-4">
              <button
                onClick={() => exportMeetingsCsv(filtered)}
                className="inline-flex items-center gap-2 text-[10.5px] font-medium tracking-[0.08em] uppercase px-3.5 py-2 rounded-lg border transition-all duration-150 active:scale-[0.97]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)", borderColor: "var(--gt-gold-line)", background: "var(--gt-gold-dim)" }}
              >
                <Download size={12} /> Export {filtered.length} session{filtered.length !== 1 ? "s" : ""} as CSV
              </button>
            </div>
          )}

          {isLoading && (
            <div className="text-[14px] py-16 text-center" style={{ color: "var(--gt-mut)", fontFamily: "var(--font-mono)" }}>
              Loading the record…
            </div>
          )}

          <div className="space-y-4">
            {filtered.map((m, i) => {
              const isOpen = openSlug === m.slug;
              const d = isOpen ? detail : null;
              return (
                <Reveal key={m.slug} delay={i * 50}>
                  <div
                    className="rounded-xl border overflow-hidden transition-colors duration-200"
                    style={{
                      background: "var(--gt-panel)",
                      borderColor: isOpen ? "var(--gt-gold-line)" : "var(--gt-line)",
                    }}
                  >
                    <button
                      onClick={() => setOpenSlug(isOpen ? null : m.slug)}
                      className="w-full text-left px-6 py-5 flex items-start gap-4"
                    >
                      <div
                        className="shrink-0 w-10 h-10 rounded-lg grid place-items-center border mt-0.5"
                        style={{ borderColor: "var(--gt-line2)", background: "var(--gt-bg2)", color: "var(--gt-gold)" }}
                      >
                        <Landmark size={17} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span
                            className="text-[10.5px] tracking-[0.12em] uppercase"
                            style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}
                          >
                            {m.body}
                          </span>
                          <span
                            className="text-[10.5px] tracking-[0.08em] flex items-center gap-1"
                            style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
                          >
                            <CalendarDays size={11} /> {m.heldOn}
                          </span>
                        </div>
                        <div
                          className="text-[17px] font-semibold tracking-tight mt-1.5 leading-snug"
                          style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
                        >
                          {m.title}
                        </div>
                      </div>
                      <ChevronDown
                        size={18}
                        className="shrink-0 mt-1.5 transition-transform duration-200"
                        style={{
                          color: "var(--gt-mut)",
                          transform: isOpen ? "rotate(180deg)" : "none",
                        }}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 border-t" style={{ borderColor: "var(--gt-line)" }}>
                        <p className="text-[14.5px] leading-relaxed max-w-[75ch]" style={{ color: "var(--gt-fg2)" }}>
                          {m.summary}
                        </p>

                        <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 mt-6">
                          <Section icon={<Gavel size={14} />} title="Decisions made" items={(m.decisions as string[]) || []} color="var(--gt-verify)" />
                          <Section icon={<CircleDollarSign size={14} />} title="Money discussed" items={(m.moneyDiscussed as string[]) || []} color="var(--gt-gold)" />
                          <Section icon={<HelpCircle size={14} />} title="Unanswered questions" items={(m.unanswered as string[]) || []} color="var(--gt-warn)" />
                        </div>

                        {/* extracted commitments */}
                        {d?.extractedCommitments && d.extractedCommitments.length > 0 && (
                          <div className="mt-7">
                            <div className="flex items-center gap-2 mb-3">
                              <Mic size={14} style={{ color: "var(--gt-gold)" }} />
                              <span
                                className="text-[10.5px] tracking-[0.14em] uppercase"
                                style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
                              >
                                Commitments extracted ({d.extractedCommitments.length})
                              </span>
                            </div>
                            <div className="space-y-2.5">
                              {d.extractedCommitments.map((c) => (
                                <div
                                  key={c.id}
                                  className="rounded-lg border px-4 py-3.5"
                                  style={{ background: "var(--gt-bg2)", borderColor: "var(--gt-line)" }}
                                >
                                  <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--gt-fg)" }}>
                                    "{c.text}"
                                  </p>
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[10.5px]" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
                                    {c.speaker && <span style={{ color: "var(--gt-fg2)" }}>{c.speaker}{c.speakerRole ? ` · ${c.speakerRole}` : ""}</span>}
                                    {c.anchor && <span style={{ color: "var(--gt-gold)" }}>▸ {c.anchor}</span>}
                                    {c.targetValue && <span>target: {c.targetValue}</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* transcript */}
                        {d?.transcript && (
                          <div className="mt-7">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <FileText size={14} style={{ color: "var(--gt-verify)" }} />
                                <span
                                  className="text-[10.5px] tracking-[0.14em] uppercase"
                                  style={{ fontFamily: "var(--font-mono)", color: "var(--gt-verify)" }}
                                >
                                  Sealed transcript · speaker-attributed
                                </span>
                                <ProvenanceRow size="xs" kinds={["sealed", "speaker", "chain"]} />
                              </div>
                              <button
                                onClick={() => summarizeMut.mutate({ slug: m.slug })}
                                disabled={summarizeMut.isPending}
                                className="flex items-center gap-1.5 text-[10.5px] font-medium tracking-[0.08em] uppercase px-3 py-1.5 rounded border transition-all duration-150 active:scale-[0.97] disabled:opacity-50"
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  color: "var(--gt-gold)",
                                  borderColor: "var(--gt-gold-line)",
                                  background: "var(--gt-gold-dim)",
                                }}
                              >
                                {summarizeMut.isPending ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <Sparkles size={12} />
                                )}
                                {summaries[m.slug] ? "Regenerate summary" : "AI summary"}
                              </button>
                            </div>

                            {summaries[m.slug] && (
                              <div
                                className="rounded-lg border p-5 mb-4 text-[13.5px] leading-relaxed"
                                style={{
                                  background: "var(--gt-bg2)",
                                  borderColor: "var(--gt-gold-line)",
                                  color: "var(--gt-fg2)",
                                }}
                              >
                                <div
                                  className="text-[10px] tracking-[0.14em] uppercase mb-2.5"
                                  style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
                                >
                                  AI-generated summary · verify against the transcript below
                                </div>
                                <Streamdown>{summaries[m.slug]}</Streamdown>
                              </div>
                            )}

                            <div
                              className="rounded-lg border p-5 text-[12.5px] leading-relaxed whitespace-pre-wrap max-h-[340px] overflow-y-auto"
                              style={{
                                background: "#0d1219",
                                borderColor: "var(--gt-line)",
                                fontFamily: "var(--font-mono)",
                                color: "var(--gt-fg2)",
                              }}
                            >
                              {d.transcript}
                            </div>
                          </div>
                        )}

                        {/* receipts */}
                        <div className="flex flex-wrap gap-2 mt-6">
                          {m.minutesUrl && (
                            <a
                              href={m.minutesUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-[10.5px] tracking-[0.08em] uppercase px-3 py-1.5 rounded border transition-colors hover:border-[var(--gt-gold-line)]"
                              style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)", borderColor: "var(--gt-line2)" }}
                            >
                              <FileText size={11} /> Official record
                            </a>
                          )}
                          {m.videoUrl && (
                            <a
                              href={m.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-[10.5px] tracking-[0.08em] uppercase px-3 py-1.5 rounded border"
                              style={{ fontFamily: "var(--font-mono)", color: "var(--gt-fg2)", borderColor: "var(--gt-line2)" }}
                            >
                              <Video size={11} /> Recording
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <div
              className="mt-10 rounded-lg border p-6 text-[13.5px] leading-relaxed"
              style={{ background: "var(--gt-bg2)", borderColor: "var(--gt-line)", color: "var(--gt-fg2)" }}
            >
              <strong style={{ color: "var(--gt-fg)" }}>Coverage note.</strong> The April 13, April 20, and May 18
              council sessions and the April 28 Plan Commission are now in the record above, sourced from published
              reporting. Sealed recordings exist only for the ITIA Summit sessions. When primary recordings of the
              municipal sessions are obtained and diarized, they will replace the news-sourced records.
            </div>
          </Reveal>

          {/* ── linked video evidence ── */}
          <Reveal>
            <div className="mt-14">
              <Eyebrow>Linked video evidence</Eyebrow>
              <H2>
                News coverage, <span style={{ color: "var(--gt-gold)" }}>fact-checked</span>
              </H2>
              <p className="text-[15px] max-w-[64ch] leading-relaxed mt-3" style={{ color: "var(--gt-fg2)" }}>
                Broadcast coverage of the project, linked from YouTube and analyzed against the sealed record. Each
                claim is marked verified, open, or unmeasurable — with the note explaining why.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3 mt-8">
            {VIDEO_EVIDENCE.map((v, vi) => (
              <VideoCard key={v.youtubeId} v={v} delay={vi * 80} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
