import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";

const KIND_LABEL: Record<string, string> = {
  commitment: "Commitment", question: "Open question", explainer: "Explainer",
  timeline: "Timeline", fact: "Verified spine", career: "Careers", training: "Training",
  gap: "Record gap", correction: "Correction", meeting: "Meeting",
  "meeting-commitment": "Meeting commitment", vault: "Evidence vault",
};

export default function Search() {
  const initial = (() => { try { return new URLSearchParams(window.location.search).get("q") || ""; } catch { return ""; } })();
  const [input, setInput] = useState(initial);
  const [q, setQ] = useState(initial);
  const boxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(input);
      try {
        const url = input ? `/search?q=${encodeURIComponent(input)}` : "/search";
        window.history.replaceState(null, "", url);
      } catch {}
    }, 220);
    return () => clearTimeout(t);
  }, [input]);

  useEffect(() => { boxRef.current?.focus(); }, []);

  const enabled = q.trim().length >= 2;
  const results = trpc.search.query.useQuery({ q }, { enabled, retry: false });
  const size = trpc.search.size.useQuery(undefined, { retry: false });

  return (
    <Layout>
      <div className="max-w-[900px] mx-auto px-5 md:px-7 py-12 md:py-16">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gt-gold)" }}>
          Search the record
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 36, letterSpacing: "-0.02em", margin: "6px 0 4px", color: "var(--gt-fg)" }}>
          Search everything
        </h1>
        <p style={{ color: "var(--gt-fg2)", fontSize: 14.5, maxWidth: "60ch" }}>
          A name, a figure, a phrase — search across every commitment, meeting, correction, transcript, and piece of
          evidence on the site{size.data ? ` (${size.data} records indexed)` : ""}.
        </p>

        <div
          className="flex items-center gap-3 mt-6 px-4 py-3 rounded-xl border"
          style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line2)" }}
        >
          <SearchIcon size={18} style={{ color: "var(--gt-mut)" }} />
          <input
            ref={boxRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Mayor Dermody · water · 15% schools · abatement"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--gt-fg)", fontSize: 16, fontFamily: "var(--font-sans)" }}
          />
          {input && (
            <button onClick={() => setInput("")} style={{ background: "none", border: "none", color: "var(--gt-mut)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12 }}>
              clear
            </button>
          )}
        </div>

        <div className="mt-8">
          {!enabled && (
            <p style={{ color: "var(--gt-mut)", fontSize: 14 }}>Type at least two characters to search.</p>
          )}
          {enabled && results.isLoading && (
            <p style={{ color: "var(--gt-mut)", fontSize: 14 }}>Searching…</p>
          )}
          {enabled && results.data && results.data.length === 0 && (
            <p style={{ color: "var(--gt-fg2)", fontSize: 14.5 }}>
              No matches for “{q}”. Try a name, a figure, or a shorter phrase.
            </p>
          )}
          {enabled && results.data && results.data.length > 0 && (
            <>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gt-mut)", marginBottom: 12 }}>
                {results.data.length} result{results.data.length === 1 ? "" : "s"}
              </div>
              <div className="flex flex-col gap-3">
                {results.data.map((r) => (
                  <Link
                    key={r.id}
                    href={r.url}
                    className="block rounded-xl border p-4 md:p-5 transition-colors hover:border-[var(--gt-gold-line)]"
                    style={{ background: "var(--gt-panel)", borderColor: "var(--gt-line)" }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gt-gold)" }}>
                        {KIND_LABEL[r.kind] || r.kind} · {r.section}
                      </span>
                      <ArrowRight size={15} style={{ color: "var(--gt-mut)" }} />
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17, letterSpacing: "-0.01em", color: "var(--gt-fg)", marginTop: 4 }}>
                      {r.title}
                    </div>
                    <p style={{ color: "var(--gt-fg2)", fontSize: 13.5, lineHeight: 1.5, marginTop: 4 }}>{r.snippet}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
