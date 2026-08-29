/*
  Layout — persistent chrome for Ground Truth LaPorte.
  Dark-only, seal-gold accents, mono eyebrows. Sticky nav with blur.
*/
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";

const NAV = [
  { href: "/", label: "The Record" },
  { href: "/tracker", label: "Tracker" },
  { href: "/learn", label: "Learn" },
  { href: "/careers", label: "Careers & Training" },
  { href: "/ask", label: "Ask" },
  { href: "/meetings", label: "Meetings" },
  { href: "/corrections", label: "Corrections" },
  { href: "/vault", label: "Vault" },
  { href: "/how-we-work", label: "How We Work" },
  { href: "/submit", label: "Submit Evidence" },
];

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <img
      src="/manus-storage/logo-gt_021775ae.png"
      alt="Ground Truth LaPorte seal"
      width={size}
      height={size}
      style={{ display: "block" }}
    />
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-sans)" }}>
      <nav
        className="sticky top-0 z-50 border-b transition-colors duration-300"
        style={{
          borderColor: "var(--gt-line)",
          background: scrolled ? "rgba(10,13,20,.92)" : "rgba(10,13,20,.75)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-[1120px] mx-auto px-5 md:px-7 flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo />
            <span className="leading-none">
              <span
                className="block text-[10px] tracking-[0.22em] uppercase"
                style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
              >
                La Porte · Indiana
              </span>
              <span
                className="block text-[17px] font-bold tracking-tight mt-1"
                style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
              >
                Ground<span style={{ color: "var(--gt-gold)" }}>Truth</span>
              </span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-[13.5px] transition-colors duration-200"
                style={{
                  color: location === n.href ? "var(--gt-gold)" : "var(--gt-fg2)",
                  fontWeight: location === n.href ? 600 : 400,
                }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/submit"
              className="text-[12px] font-medium tracking-[0.1em] uppercase px-4 py-2 rounded transition-transform duration-150 active:scale-[0.97]"
              style={{
                fontFamily: "var(--font-mono)",
                color: "#0a0d14",
                background: "var(--gt-gold)",
              }}
            >
              Contribute
            </Link>
            {isAuthenticated ? (
              <button
                onClick={() => logout()}
                title={`Signed in as ${user?.name || user?.email || "contributor"} — click to sign out`}
                className="flex items-center gap-1.5 text-[10.5px] tracking-[0.08em] uppercase px-3 py-2 rounded border transition-colors hover:border-[var(--gt-gold-line)]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--gt-fg2)", borderColor: "var(--gt-line2)" }}
              >
                <LogOut size={12} /> {user?.name?.split(" ")[0] || "Account"}
              </button>
            ) : (
              <button
                onClick={() => startLogin()}
                className="flex items-center gap-1.5 text-[10.5px] tracking-[0.08em] uppercase px-3 py-2 rounded border transition-colors hover:border-[var(--gt-gold-line)]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--gt-fg2)", borderColor: "var(--gt-line2)" }}
              >
                <LogIn size={12} /> Sign in
              </button>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <Link
                href="/admin/review"
                className="flex items-center gap-1.5 text-[10.5px] tracking-[0.08em] uppercase px-3 py-2 rounded border transition-colors hover:border-[var(--gt-gold-line)]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)", borderColor: "var(--gt-gold-line)" }}
              >
                Review
              </Link>
            )}
          </div>

          <button
            className="lg:hidden p-2 rounded"
            style={{ color: "var(--gt-fg)" }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div
            className="lg:hidden border-t px-5 py-4 flex flex-col gap-3"
            style={{ borderColor: "var(--gt-line)", background: "rgba(10,13,20,.97)" }}
          >
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-[15px] py-1"
                style={{ color: location === n.href ? "var(--gt-gold)" : "var(--gt-fg2)" }}
              >
                {n.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="border-t" style={{ borderColor: "var(--gt-line)", background: "var(--gt-bg2)" }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-7 py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Logo size={30} />
              <span className="text-[15px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
                Ground<span style={{ color: "var(--gt-gold)" }}>Truth</span> LaPorte
              </span>
            </div>
            <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--gt-mut)" }}>
              A community information project of <strong style={{ color: "var(--gt-fg2)" }}>CyberHopeAI</strong>, built on{" "}
              <strong style={{ color: "var(--gt-fg2)" }}>PrecognitionOS</strong>. Independent of Microsoft, the City of La
              Porte, La Porte County, and the State of Indiana. Every source of funding is named on this site.
              Corrections are published in the open, alongside what they replaced.
            </p>
            <p
              className="text-[10.5px] tracking-[0.14em] uppercase mt-5"
              style={{ fontFamily: "var(--font-mono)", color: "var(--gt-mut)" }}
            >
              Evidence · Not excuses
            </p>
          </div>
          <div>
            <div
              className="text-[10.5px] tracking-[0.18em] uppercase mb-4"
              style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
            >
              The Record
            </div>
            <div className="flex flex-col gap-2.5 text-[13.5px]" style={{ color: "var(--gt-fg2)" }}>
              <Link href="/tracker">Commitment tracker</Link>
              <Link href="/learn">Explainers: power, water, taxes, jobs</Link>
              <Link href="/careers">Careers & training</Link>
              <Link href="/ask">Ask the record</Link>
              <Link href="/meetings">Meetings & decisions</Link>
              <Link href="/vault">Evidence vault</Link>
              <Link href="/how-we-work">How we work</Link>
              <Link href="/submit">Submit evidence</Link>
            </div>
          </div>
          <div>
            <div
              className="text-[10.5px] tracking-[0.18em] uppercase mb-4"
              style={{ fontFamily: "var(--font-mono)", color: "var(--gt-gold)" }}
            >
              The Engine
            </div>
            <div className="flex flex-col gap-2.5 text-[13.5px]" style={{ color: "var(--gt-fg2)" }}>
              <a href="https://cyberhopeai.com/" target="_blank" rel="noreferrer">
                CyberHopeAI
              </a>
              <Link href="/how-we-work#engine">PrecognitionOS</Link>
              <Link href="/how-we-work#funding">Funding & firewall</Link>
              <a href="mailto:info@cyberhopeai.com">info@cyberhopeai.com</a>
            </div>
          </div>
        </div>
        <div
          className="border-t py-5 text-center text-[11px] tracking-[0.12em] uppercase"
          style={{ borderColor: "var(--gt-line)", color: "var(--gt-mut)", fontFamily: "var(--font-mono)" }}
        >
          Every figure carries its receipt · No finding publishes without right of reply
        </div>
      </footer>
    </div>
  );
}
