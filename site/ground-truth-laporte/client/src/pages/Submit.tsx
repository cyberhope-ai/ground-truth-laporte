/*
  Submit Evidence — authenticated intake, quarantine-by-default.
  Real file upload to S3 with SHA-256 sealing at intake. Contributor
  accounts via OAuth. Nothing submitted becomes public without
  authenticity review — the pipeline state is visible to the contributor.
*/
import Layout from "@/components/Layout";
import { Eyebrow, Reveal } from "@/components/Section";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { useRef, useState } from "react";
import {
  Upload, MessageSquareQuote, ShieldCheck, Lock, FileUp, X, LogIn, Search, PackageSearch,
} from "lucide-react";
import { toast } from "sonner";

const JOURNEY = [
  ["Submitted", "Your file or link arrives with your statement — what you believe it shows."],
  ["Quarantine", "Nothing submitted becomes public automatically. Quarantine is the default state."],
  ["Authenticity review", "Source availability, file integrity, metadata consistency, duplicate and manipulation checks."],
  ["Verification", "Claims are extracted and checked against the sealed record. Your statement is a hypothesis, never evidence."],
  ["Published or rejected", "Verified material enters the public evidence vault with its receipt. Rejected material keeps only a hash, timestamp, and reason — the raw file is purged."],
];

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  quarantined: { label: "Quarantined", color: "var(--gt-warn)" },
  under_review: { label: "Under review", color: "var(--gt-gold)" },
  verified: { label: "Verified", color: "var(--gt-verify)" },
  rejected: { label: "Rejected", color: "var(--gt-bad)" },
};

const PIPELINE_STAGES = ["quarantined", "under_review", "verified"] as const;
const STAGE_LABELS: Record<string, string> = {
  quarantined: "Quarantine",
  under_review: "Review",
  verified: "Verified",
  rejected: "Rejected",
};

function PipelineBar({ status }: { status: string }) {
  const isRejected = status === "rejected";
  const currentIdx = isRejected ? -1 : PIPELINE_STAGES.indexOf(status as any);

  return (
    <div className="mt-3">
      <div className="flex items-center gap-0">
        {PIPELINE_STAGES.map((stage, i) => {
          const reached = !isRejected && i <= currentIdx;
          const isCurrent = !isRejected && i === currentIdx;
          return (
            <div key={stage} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className="w-4 h-4 rounded-full border-2 transition-all duration-300"
                  style={{
                    borderColor: reached ? "var(--gt-gold)" : "var(--gt-line2)",
                    background: isCurrent ? "var(--gt-gold)" : reached ? "var(--gt-gold-dim)" : "var(--gt-bg)",
                  }}
                />
                <span
                  className="text-[8.5px] tracking-[0.08em] uppercase mt-1.5 whitespace-nowrap"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: isCurrent ? "var(--gt-gold)" : reached ? "var(--gt-fg2)" : "var(--gt-mut)",
                    fontWeight: isCurrent ? 600 : 400,
                  }}
                >
                  {STAGE_LABELS[stage]}
                </span>
              </div>
              {i < PIPELINE_STAGES.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-1 transition-all duration-300"
                  style={{
                    background: !isRejected && i < currentIdx ? "var(--gt-gold)" : "var(--gt-line2)",
                  }}
                />
              )}
            </div>
          );
        })}
        {isRejected && (
          <div className="flex flex-col items-center ml-2">
            <div
              className="w-4 h-4 rounded-full border-2"
              style={{ borderColor: "var(--gt-bad)", background: "var(--gt-bad)" }}
            />
            <span
              className="text-[8.5px] tracking-[0.08em] uppercase mt-1.5"
              style={{ fontFamily: "var(--font-mono)", color: "var(--gt-bad)", fontWeight: 600 }}
            >
              Rejected
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Submit() {
  const { user, isAuthenticated, loading } = useAuth();
  const [kind, setKind] = useState<"evidence" | "question">("evidence");
  const [title, setTitle] = useState("");
  const [statement, setStatement] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [done, setDone] = useState<{ id: number; sha256?: string } | null>(null);
  const [trackId, setTrackId] = useState("");
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackSearched, setTrackSearched] = useState(false);

  const trackQuery = trpc.submissions.track.useQuery(
    { id: parseInt(trackId, 10) },
    { enabled: false }
  );

  const handleTrack = async () => {
    const id = parseInt(trackId, 10);
    if (!id || id < 1) return;
    setTrackSearched(true);
    const result = await trackQuery.refetch();
    setTrackResult(result.data ?? null);
  };
  const fileRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useUtils();
  const createMut = trpc.submissions.create.useMutation({
    onSuccess: (data) => {
      setDone(data);
      utils.submissions.mine.invalidate();
      toast.success("Submitted — sealed and quarantined for review.");
    },
    onError: (e) => toast.error(e.message),
  });
  const { data: mySubs } = trpc.submissions.mine.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let fileData: string | undefined;
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        toast.error("File exceeds the 8MB limit.");
        return;
      }
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      bytes.forEach((b) => (binary += String.fromCharCode(b)));
      fileData = btoa(binary);
    }
    createMut.mutate({
      kind,
      title,
      statement: statement || undefined,
      sourceUrl: sourceUrl || undefined,
      fileName: file?.name,
      mimeType: file?.type,
      fileData,
    });
  };

  const inputStyle: React.CSSProperties = {
    background: "var(--gt-panel)",
    borderColor: "var(--gt-line2)",
    color: "var(--gt-fg)",
  };

  return (
    <Layout>
      <header className="border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7 pt-16 md:pt-20 pb-12">
          <Eyebrow>Contribute · community evidence</Eyebrow>
          <h1
            className="text-[clamp(34px,5.4vw,56px)] font-bold leading-[1.0] tracking-[-0.025em] max-w-[20ch]"
            style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
          >
            Have something <span style={{ color: "var(--gt-gold)" }}>we should see?</span>
          </h1>
          <p className="text-[17px] leading-relaxed max-w-[64ch] mt-5" style={{ color: "var(--gt-fg2)" }}>
            Meeting recordings, letters, notices, permits, utility bills, photographs — residents are this system's
            sensors. Every file is fingerprinted (SHA-256) and sealed the moment it arrives, then quarantined until it
            clears authenticity review.
          </p>
        </div>
      </header>

      <section className="py-12 md:py-16 border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7 grid gap-12 lg:grid-cols-[1fr_380px]">
          <div>
            {/* auth gate */}
            {!loading && !isAuthenticated && (
              <div
                className="rounded-xl border p-8 text-center"
                style={{ borderColor: "var(--gt-gold-line)", background: "linear-gradient(160deg, rgba(209,168,75,.09), var(--gt-panel) 60%)" }}
              >
                <Lock size={22} style={{ color: "var(--gt-gold)" }} className="mx-auto" />
                <h3 className="text-[20px] font-semibold mt-3" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
                  Sign in to contribute
                </h3>
                <p className="text-[14.5px] leading-relaxed mt-2 max-w-[52ch] mx-auto" style={{ color: "var(--gt-fg2)" }}>
                  Evidence intake requires a contributor account so we can follow up on authenticity and protect the
                  integrity of the record. Your identity is never published without your consent.
                </p>
                <button
                  onClick={() => startLogin()}
                  className="inline-flex items-center gap-2 mt-5 text-[12px] font-medium tracking-[0.1em] uppercase px-6 py-3 rounded transition-transform duration-150 active:scale-[0.97]"
                  style={{ fontFamily: "var(--font-mono)", background: "var(--gt-gold)", color: "#0a0d14" }}
                >
                  <LogIn size={14} /> Sign in to continue
                </button>
              </div>
            )}

            {isAuthenticated && !done && (
              <>
                <div className="flex gap-2 mb-8">
                  {(
                    [
                      ["evidence", "Send a document or recording", Upload],
                      ["question", "Ask a question", MessageSquareQuote],
                    ] as const
                  ).map(([k, label, Icon]) => (
                    <button
                      key={k}
                      onClick={() => setKind(k)}
                      className="flex items-center gap-2.5 text-[12px] font-medium tracking-[0.08em] uppercase px-4 py-2.5 rounded border transition-all duration-150 active:scale-[0.97]"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: kind === k ? "#0a0d14" : "var(--gt-fg2)",
                        background: kind === k ? "var(--gt-gold)" : "transparent",
                        borderColor: kind === k ? "var(--gt-gold)" : "var(--gt-line2)",
                      }}
                    >
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>

                <form onSubmit={onSubmit} className="space-y-5 max-w-[640px]">
                  <div>
                    <label className="block text-[11px] tracking-[0.14em] uppercase mb-2" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
                      {kind === "evidence" ? "What is it?" : "Your question"}
                    </label>
                    <input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={kind === "evidence" ? "e.g. Recording of Tuesday's county council meeting" : "e.g. Will my electric bill go up?"}
                      className="w-full rounded-lg border px-4 py-3 text-[14.5px] outline-none transition-colors focus:border-[var(--gt-gold)]"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.14em] uppercase mb-2" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
                      {kind === "evidence" ? "What do you believe it shows?" : "Context (optional)"}
                    </label>
                    <textarea
                      rows={4}
                      value={statement}
                      onChange={(e) => setStatement(e.target.value)}
                      placeholder={kind === "evidence" ? "e.g. This is the meeting where they promised 500 jobs" : "Anything that helps us research it"}
                      className="w-full rounded-lg border px-4 py-3 text-[14.5px] outline-none transition-colors focus:border-[var(--gt-gold)] resize-y"
                      style={inputStyle}
                    />
                    {kind === "evidence" && (
                      <p className="text-[12px] mt-2" style={{ color: "var(--gt-mut)" }}>
                        Your statement is a hypothesis we investigate — it is never published as a finding.
                      </p>
                    )}
                  </div>

                  {kind === "evidence" && (
                    <>
                      <div>
                        <label className="block text-[11px] tracking-[0.14em] uppercase mb-2" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
                          Attach the file (max 8MB)
                        </label>
                        <input
                          ref={fileRef}
                          type="file"
                          className="hidden"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        {file ? (
                          <div
                            className="flex items-center gap-3 rounded-lg border px-4 py-3"
                            style={{ borderColor: "var(--gt-gold-line)", background: "var(--gt-gold-dim)" }}
                          >
                            <FileUp size={16} style={{ color: "var(--gt-gold)" }} />
                            <span className="text-[13.5px] flex-1 truncate" style={{ color: "var(--gt-fg)" }}>
                              {file.name}
                            </span>
                            <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
                              {(file.size / 1024).toFixed(0)} KB
                            </span>
                            <button type="button" onClick={() => setFile(null)} style={{ color: "var(--gt-mut)" }}>
                              <X size={15} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="w-full rounded-lg border border-dashed px-4 py-6 text-center transition-colors hover:border-[var(--gt-gold-line)]"
                            style={{ borderColor: "var(--gt-line2)", color: "var(--gt-mut)" }}
                          >
                            <FileUp size={18} className="mx-auto mb-2" style={{ color: "var(--gt-gold)" }} />
                            <span className="text-[13px]">Click to attach — PDF, image, audio, video, document</span>
                          </button>
                        )}
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[0.14em] uppercase mb-2" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
                          Link or description of where it came from
                        </label>
                        <input
                          value={sourceUrl}
                          onChange={(e) => setSourceUrl(e.target.value)}
                          placeholder="Source URL, meeting date, or how you obtained it"
                          className="w-full rounded-lg border px-4 py-3 text-[14.5px] outline-none transition-colors focus:border-[var(--gt-gold)]"
                          style={inputStyle}
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={createMut.isPending}
                    className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.1em] uppercase px-6 py-3 rounded transition-transform duration-150 active:scale-[0.97] disabled:opacity-50"
                    style={{ fontFamily: "var(--font-mono)", background: "var(--gt-gold)", color: "#0a0d14" }}
                  >
                    {createMut.isPending ? "Sealing & submitting…" : kind === "evidence" ? "Submit for verification" : "Ask the record"}
                  </button>
                </form>
              </>
            )}

            {isAuthenticated && done && (
              <div
                className="rounded-xl border p-8"
                style={{ borderColor: "rgba(49,210,150,.35)", background: "rgba(49,210,150,.06)" }}
              >
                <ShieldCheck size={22} style={{ color: "var(--gt-verify)" }} />
                <h3 className="text-[20px] font-semibold mt-3" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
                  Sealed and quarantined.
                </h3>
                <p className="text-[14.5px] leading-relaxed mt-2 max-w-[60ch]" style={{ color: "var(--gt-fg2)" }}>
                  Submission #{done.id} is in the quarantine queue.{" "}
                  {done.sha256 && (
                    <>
                      Its SHA-256 fingerprint is{" "}
                      <code className="text-[12px] px-1.5 py-0.5 rounded" style={{ background: "var(--gt-bg2)", color: "var(--gt-gold)", fontFamily: "var(--font-mono)" }}>
                        {done.sha256.slice(0, 16)}…
                      </code>{" "}
                      — if a single byte changes, the seal breaks.
                    </>
                  )}{" "}
                  You can track its status below.
                </p>
                <button
                  onClick={() => { setDone(null); setTitle(""); setStatement(""); setSourceUrl(""); setFile(null); }}
                  className="mt-5 text-[12px] font-medium tracking-[0.08em] uppercase"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
                >
                  Submit another →
                </button>
              </div>
            )}

            {/* my submissions */}
            {isAuthenticated && mySubs && mySubs.length > 0 && (
              <div className="mt-10">
                <div
                  className="text-[10.5px] tracking-[0.16em] uppercase mb-4"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}
                >
                  Your submissions
                </div>
                <div className="space-y-2.5">
                  {mySubs.map((s) => {
                    const st = STATUS_LABEL[s.status] || STATUS_LABEL.quarantined;
                    return (
                      <div
                        key={s.id}
                        className="flex items-center gap-4 rounded-lg border px-4 py-3.5"
                        style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line)" }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-[13.5px] font-medium truncate" style={{ color: "var(--gt-fg)" }}>
                            {s.title}
                          </div>
                          <div className="text-[11px] mt-0.5" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
                            #{s.id} · {s.kind} · {new Date(s.createdAt).toLocaleDateString()}
                            {s.sha256 && ` · sealed ${s.sha256.slice(0, 10)}…`}
                          </div>
                        </div>
                        <span
                          className="text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded border shrink-0"
                          style={{ fontFamily: "var(--font-mono)", color: st.color, borderColor: "var(--gt-line2)" }}
                        >
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* journey rail */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="rounded-xl border p-6" style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line)" }}>
              <div className="flex items-center gap-2.5 mb-5">
                <Lock size={15} style={{ color: "var(--gt-gold)" }} />
                <span className="text-[10.5px] tracking-[0.16em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}>
                  What happens to a submission
                </span>
              </div>
              <div className="space-y-0">
                {JOURNEY.map(([t, b], i) => (
                  <div key={t} className="relative pl-7 pb-5 last:pb-0">
                    {i < JOURNEY.length - 1 && (
                      <div className="absolute left-[7px] top-5 bottom-0 w-px" style={{ background: "var(--gt-line2)" }} />
                    )}
                    <div
                      className="absolute left-0 top-1 w-[15px] h-[15px] rounded-full border-2"
                      style={{ borderColor: "var(--gt-gold)", background: "var(--gt-bg)" }}
                    />
                    <div className="text-[14px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
                      {t}
                    </div>
                    <p className="text-[12.5px] leading-relaxed mt-1" style={{ color: "var(--gt-fg2)" }}>
                      {b}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          {/* ── submission tracking ── */}
          <Reveal>
            <div
              className="rounded-xl border p-7 mb-10"
              style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line)" }}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <PackageSearch size={16} style={{ color: "var(--gt-gold)" }} />
                <span className="text-[10.5px] tracking-[0.16em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}>
                  Track a submission
                </span>
              </div>
              <p className="text-[13.5px] leading-relaxed mb-4" style={{ color: "var(--gt-fg2)" }}>
                Enter the submission ID you received when you filed. You'll see its current pipeline status — no login
                required, no internal notes exposed.
              </p>
              <div className="flex gap-3 max-w-[480px]">
                <div
                  className="flex items-center gap-2.5 rounded-lg border px-4 py-3 flex-1"
                  style={{ background: "var(--gt-bg2)", borderColor: "var(--gt-line2)" }}
                >
                  <Search size={15} style={{ color: "var(--gt-mut)" }} className="shrink-0" />
                  <input
                    value={trackId}
                    onChange={(e) => { setTrackId(e.target.value); setTrackSearched(false); setTrackResult(null); }}
                    onKeyDown={(e) => { if (e.key === "Enter") handleTrack(); }}
                    placeholder="Submission ID (e.g. 3)"
                    className="w-full bg-transparent outline-none text-[14px]"
                    style={{ color: "var(--gt-fg)", fontFamily: "var(--font-mono)" }}
                  />
                </div>
                <button
                  onClick={handleTrack}
                  disabled={trackQuery.isFetching || !trackId.trim()}
                  className="shrink-0 text-[11px] font-medium tracking-[0.1em] uppercase px-4 py-2.5 rounded-lg transition-all duration-150 active:scale-[0.97] disabled:opacity-40"
                  style={{ fontFamily: "var(--font-mono)", background: "var(--gt-gold)", color: "#0a0d14" }}
                >
                  {trackQuery.isFetching ? "…" : "Track"}
                </button>
              </div>

              {trackSearched && !trackQuery.isFetching && (
                <div className="mt-4">
                  {trackResult ? (
                    <div
                      className="rounded-lg border px-5 py-4"
                      style={{ background: "var(--gt-bg2)", borderColor: "var(--gt-line)" }}
                    >
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-medium" style={{ color: "var(--gt-fg)" }}>
                            {trackResult.title}
                          </div>
                          <div className="text-[11px] mt-1" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
                            #{trackResult.id} · {trackResult.kind} · submitted {new Date(trackResult.createdAt).toLocaleDateString()}
                            {trackResult.releasedAt && ` · released ${new Date(trackResult.releasedAt).toLocaleDateString()}`}
                          </div>
                        </div>
                        <span
                          className="text-[10.5px] tracking-[0.1em] uppercase px-3 py-1.5 rounded border shrink-0"
                          style={{
                            fontFamily: "var(--font-mono)",
                            color: STATUS_LABEL[trackResult.status]?.color || "var(--gt-mut)",
                            borderColor: "var(--gt-line2)",
                          }}
                        >
                          {STATUS_LABEL[trackResult.status]?.label || trackResult.status}
                        </span>
                      </div>
                      <PipelineBar status={trackResult.status} />
                    </div>
                  ) : (
                    <div
                      className="rounded-lg border border-dashed px-5 py-4 text-[13px]"
                      style={{ borderColor: "var(--gt-line2)", color: "var(--gt-mut)" }}
                    >
                      No submission found with that ID. Check the number and try again.
                    </div>
                  )}
                </div>
              )}
            </div>
          </Reveal>

          <p className="text-[13.5px] leading-relaxed max-w-[72ch]" style={{ color: "var(--gt-mut)" }}>
            <strong style={{ color: "var(--gt-fg2)" }}>A note on recordings:</strong> public meetings and public
            conferences are fair game; a side conversation where participants had a reasonable expectation of privacy is
            not publishable evidence, regardless of what it contains. Provenance is established before ingestion, not
            after.
          </p>
        </div>
      </section>
    </Layout>
  );
}
