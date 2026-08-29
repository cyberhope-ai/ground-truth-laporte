/*
  Evidence Vault — the public record of verified submissions.
  Only items that cleared the full quarantine → authenticity → verification
  pipeline appear here. Each carries its SHA-256 seal and release timestamp.
  If the vault is empty, that is the system working as designed.
*/
import Layout from "@/components/Layout";
import { Eyebrow, Reveal } from "@/components/Section";
import { trpc } from "@/lib/trpc";
import { ShieldCheck, FileText, ExternalLink, Vault as VaultIcon, Download } from "lucide-react";
import { Link } from "wouter";

function exportCsv(items: any[]) {
  const header = "ID,Kind,Title,Statement,SHA-256,Released,Source URL,File URL,Verification Notes\n";
  const rows = items.map((s) =>
    [
      s.id,
      s.kind,
      `"${(s.title || "").replace(/"/g, '""')}"`,
      `"${(s.statement || "").replace(/"/g, '""')}"`,
      s.sha256 || "",
      s.releasedAt ? new Date(s.releasedAt).toISOString().slice(0, 10) : "",
      s.sourceUrl || "",
      s.fileUrl || "",
      `"${(s.authenticityNotes || "").replace(/"/g, '""')}"`,
    ].join(",")
  );
  const csv = header + rows.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ground-truth-laporte-vault-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Vault() {
  const { data: items, isLoading } = trpc.submissions.vault.useQuery();

  return (
    <Layout>
      <header className="border-b" style={{ borderColor: "var(--gt-line)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7 pt-16 md:pt-20 pb-12">
          <Eyebrow>Evidence vault · verified community submissions</Eyebrow>
          <h1
            className="text-[clamp(34px,5.4vw,56px)] font-bold leading-[1.0] tracking-[-0.025em] max-w-[20ch]"
            style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
          >
            What the community <span style={{ color: "var(--gt-gold)" }}>proved</span>
          </h1>
          <p className="text-[17px] leading-relaxed max-w-[64ch] mt-5" style={{ color: "var(--gt-fg2)" }}>
            Every item here was submitted by a resident, sealed with a SHA-256 fingerprint at intake, held in quarantine,
            and released only after clearing authenticity review. If this page is empty, that is the system working as
            designed — nothing publishes without clearing the gate.
          </p>
          {items && items.length > 0 && (
            <button
              onClick={() => exportCsv(items)}
              className="inline-flex items-center gap-2 mt-5 text-[11px] font-medium tracking-[0.1em] uppercase px-4 py-2.5 rounded-lg border transition-all duration-150 active:scale-[0.97]"
              style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)", borderColor: "var(--gt-gold-line)", background: "var(--gt-gold-dim)" }}
            >
              <Download size={13} /> Export CSV
            </button>
          )}
        </div>
      </header>

      <section className="py-12 md:py-16">
        <div className="max-w-[1120px] mx-auto px-5 md:px-7">
          {isLoading && (
            <div className="text-[13px] py-16 text-center" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
              Opening the vault…
            </div>
          )}

          {!isLoading && (!items || items.length === 0) && (
            <Reveal>
              <div
                className="rounded-xl border border-dashed p-14 text-center max-w-[640px] mx-auto"
                style={{ borderColor: "var(--gt-line2)" }}
              >
                <VaultIcon size={28} className="mx-auto mb-4" style={{ color: "var(--gt-gold)" }} />
                <h3 className="text-[20px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
                  The vault is empty — for now.
                </h3>
                <p className="text-[14.5px] leading-relaxed mt-3 max-w-[52ch] mx-auto" style={{ color: "var(--gt-fg2)" }}>
                  No community submission has yet cleared the full verification pipeline. That is not a failure — it is
                  the standard working as intended. When a resident's evidence clears authenticity review, it appears
                  here with its seal intact.
                </p>
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-2 mt-6 text-[12px] font-medium tracking-[0.1em] uppercase px-5 py-2.5 rounded transition-transform duration-150 active:scale-[0.97]"
                  style={{ fontFamily: "var(--font-mono)", background: "var(--gt-gold)", color: "#0a0d14" }}
                >
                  Submit evidence
                </Link>
              </div>
            </Reveal>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {items?.map((s, i) => (
              <Reveal key={s.id} delay={(i % 2) * 70}>
                <div
                  className="rounded-xl border p-6 h-full flex flex-col transition-colors duration-200 hover:border-[var(--gt-gold-line)]"
                  style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line)" }}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <ShieldCheck size={15} style={{ color: "var(--gt-verify)" }} />
                    <span
                      className="text-[10px] tracking-[0.14em] uppercase px-2 py-0.5 rounded"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--gt-verify)", background: "rgba(49,210,150,.08)" }}
                    >
                      Verified
                    </span>
                    <span className="text-[10.5px]" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
                      #{s.id} · {s.kind}
                    </span>
                  </div>
                  <div
                    className="text-[17px] font-semibold tracking-tight leading-snug"
                    style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
                  >
                    {s.title}
                  </div>
                  {s.statement && (
                    <p className="text-[13.5px] leading-relaxed mt-2.5 flex-1" style={{ color: "var(--gt-fg2)" }}>
                      {s.statement}
                    </p>
                  )}
                  {s.authenticityNotes && (
                    <div
                      className="mt-4 rounded-lg border px-3.5 py-2.5 text-[12px] leading-relaxed"
                      style={{ borderColor: "var(--gt-line2)", background: "var(--gt-bg2)", color: "var(--gt-fg2)" }}
                    >
                      <span style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}>VERIFICATION · </span>
                      {s.authenticityNotes}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 pt-3 border-t text-[10.5px]" style={{ borderColor: "var(--gt-line)", fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}>
                    {s.sha256 && (
                      <span style={{ color: "var(--gt-gold)" }}>
                        sealed {s.sha256.slice(0, 16)}…
                      </span>
                    )}
                    {s.releasedAt && (
                      <span>released {new Date(s.releasedAt).toLocaleDateString()}</span>
                    )}
                    {s.fileUrl && (
                      <a
                        href={s.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 underline underline-offset-2"
                        style={{ color: "var(--gt-gold)" }}
                      >
                        <FileText size={10} /> {s.fileName || "View file"} <ExternalLink size={9} />
                      </a>
                    )}
                    {s.sourceUrl && (
                      <a
                        href={s.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 underline underline-offset-2"
                        style={{ color: "var(--gt-gold)" }}
                      >
                        Source <ExternalLink size={9} />
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
