/*
  ChatWidget — the members-only on-site assistant.

  A floating bubble (bottom-right) shown only to signed-in members. Every answer
  is grounded in the sealed record via the server `chat.send` endpoint, which
  runs the sitewide search corpus through our own Azure OpenAI. Anonymous
  visitors never see this — it renders null unless authenticated.
*/
import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, ArrowUpRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

type Source = { title: string; section: string; url: string };
type Msg = { role: "user" | "assistant"; content: string; sources?: Source[] };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi — I'm the Ground Truth assistant. Ask me anything about the La Porte data center record: power bills, water use, taxes, jobs, meetings, or a specific commitment. I answer only from the sealed record, and I'll tell you when something isn't public yet.",
};

const SUGGESTIONS = [
  "Will the data center raise my electric bill?",
  "How much water will it use?",
  "What did the city agree to on taxes?",
  "How many permanent jobs are real?",
];

export default function ChatWidget() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const send = trpc.chat.send.useMutation({
    onSuccess: (data) => {
      setMsgs((m) => [...m, { role: "assistant", content: data.answer, sources: data.sources }]);
    },
    onError: (err) => {
      setMsgs((m) => [
        ...m,
        { role: "assistant", content: `Sorry — something went wrong (${err.message.slice(0, 80)}). Please try again.` },
      ]);
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, send.isPending]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  if (!isAuthenticated) return null;

  const submit = (text: string) => {
    const q = text.trim();
    if (!q || send.isPending) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setInput("");
    // Send only role+content (the API shape), last 12 turns.
    send.mutate({ messages: next.slice(-12).map((m) => ({ role: m.role, content: m.content })) });
  };

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ask the Ground Truth assistant"
          className="fixed z-[60] flex items-center gap-2 rounded-full shadow-2xl transition-transform duration-150 active:scale-95"
          style={{
            right: 20, bottom: 20, padding: "13px 18px",
            background: "var(--gt-gold)", color: "#0a0d14",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14,
          }}
        >
          <MessageSquare size={18} /> Ask the record
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          className="fixed z-[60] flex flex-col rounded-2xl border shadow-2xl overflow-hidden"
          style={{
            right: 20, bottom: 20, width: "min(408px, calc(100vw - 40px))",
            height: "min(600px, calc(100vh - 90px))",
            background: "var(--gt-bg2, #0f141d)", borderColor: "var(--gt-line2)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--gt-line)", background: "rgba(10,13,20,.6)" }}>
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center rounded-lg" style={{ width: 30, height: 30, background: "var(--gt-gold-dim, rgba(209,168,75,.14))" }}>
                <MessageSquare size={16} style={{ color: "var(--gt-gold)" }} />
              </span>
              <span className="leading-tight">
                <span className="block text-[9px] tracking-[0.18em] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}>
                  Members · grounded in the record
                </span>
                <span className="block text-[14px] font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}>
                  Ground Truth Assistant
                </span>
              </span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" style={{ color: "var(--gt-mut)" }} className="p-1.5 rounded hover:text-[var(--gt-fg)]">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3.5">
            {msgs.map((m, i) => (
              <div key={i} className="flex flex-col gap-1.5" style={{ alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div
                  className="max-w-[86%] px-3.5 py-2.5 rounded-2xl text-[13.5px] leading-relaxed whitespace-pre-wrap"
                  style={
                    m.role === "user"
                      ? { background: "var(--gt-gold)", color: "#0a0d14", borderBottomRightRadius: 4, fontFamily: "var(--font-sans)" }
                      : { background: "var(--gt-panel, #151b26)", color: "var(--gt-fg)", border: "1px solid var(--gt-line)", borderBottomLeftRadius: 4, fontFamily: "var(--font-sans)" }
                  }
                >
                  {m.content}
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 max-w-[92%]">
                    {m.sources.map((s, j) => (
                      <a
                        key={j}
                        href={s.url}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] transition-colors hover:border-[var(--gt-gold-line)]"
                        style={{ border: "1px solid var(--gt-line2)", color: "var(--gt-fg2)", fontFamily: "var(--font-mono)" }}
                        title={`${s.section} · ${s.title}`}
                      >
                        {s.title.length > 34 ? s.title.slice(0, 34) + "…" : s.title}
                        <ArrowUpRight size={11} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {send.isPending && (
              <div className="self-start px-3.5 py-2.5 rounded-2xl text-[13.5px]" style={{ background: "var(--gt-panel, #151b26)", border: "1px solid var(--gt-line)", color: "var(--gt-mut)", fontFamily: "var(--font-sans)" }}>
                Searching the record…
              </div>
            )}

            {msgs.length === 1 && !send.isPending && (
              <div className="flex flex-col gap-1.5 mt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="text-left px-3 py-2 rounded-lg text-[12.5px] transition-colors hover:border-[var(--gt-gold-line)]"
                    style={{ border: "1px solid var(--gt-line)", color: "var(--gt-fg2)", background: "var(--gt-panel, #151b26)", fontFamily: "var(--font-sans)" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t px-3 py-3" style={{ borderColor: "var(--gt-line)", background: "rgba(10,13,20,.5)" }}>
            <div className="flex items-end gap-2 rounded-xl border px-3 py-2" style={{ borderColor: "var(--gt-line2)", background: "var(--gt-bg, #0a0d14)" }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(input); } }}
                placeholder="Ask about the record…"
                maxLength={2000}
                className="flex-1 bg-transparent outline-none text-[14px]"
                style={{ color: "var(--gt-fg)", fontFamily: "var(--font-sans)" }}
              />
              <button
                onClick={() => submit(input)}
                disabled={!input.trim() || send.isPending}
                aria-label="Send"
                className="flex items-center justify-center rounded-lg transition-transform active:scale-90 disabled:opacity-40"
                style={{ width: 32, height: 32, background: "var(--gt-gold)", color: "#0a0d14" }}
              >
                <Send size={15} />
              </button>
            </div>
            <p className="text-[10px] mt-2 text-center" style={{ color: "var(--gt-mut)", fontFamily: "var(--font-mono)" }}>
              Answers only from the sealed record · every claim carries its receipt
            </p>
          </div>
        </div>
      )}
    </>
  );
}
