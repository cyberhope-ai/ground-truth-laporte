/*
  Layout — persistent chrome for Ground Truth LaPorte.
  Dark-only, seal-gold accents, mono eyebrows. Sticky nav with blur.
*/
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Menu, X, LogIn, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import AuthModal from "./AuthModal";
import { TechViewToggle } from "@/lib/provenance";

// The logo links home ("The Record"), so it isn't repeated as a nav item.
// A tight primary set keeps the bar clean (never wraps); the rest live under "More".
const PRIMARY = [
  { href: "/tracker", label: "Tracker" },
  { href: "/meetings", label: "Meetings" },
  { href: "/corrections", label: "Corrections" },
  { href: "/learn", label: "Learn" },
  { href: "/how-we-work", label: "How We Work" },
];
const MORE = [
  { href: "/", label: "The Record" },
  { href: "/ask", label: "Ask the Record" },
  { href: "/vault", label: "Evidence Vault" },
  { href: "/careers", label: "Careers & Training" },
];
const NAV = [...PRIMARY, ...MORE.filter((m) => m.href !== "/")];

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
  const [moreOpen, setMoreOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user, isAuthenticated, logout, refresh } = useAuth();

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
          background: scrolled ? "rgba(10,13,20,.95)" : "rgba(10,13,20,.82)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
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
                className="block text-[19px] font-bold tracking-[-0.02em] mt-1"
                style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)" }}
              >
                Ground<span style={{ color: "var(--gt-gold)" }}>Truth</span>
              </span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            {PRIMARY.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="whitespace-nowrap text-[14.5px] tracking-tight transition-colors duration-200 hover:text-[var(--gt-gold)]"
                style={{
                  fontFamily: "var(--font-display)",
                  color: location === n.href ? "var(--gt-gold)" : "var(--gt-fg)",
                  fontWeight: location === n.href ? 700 : 500,
                }}
              >
                {n.label}
              </Link>
            ))}

            <div
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button
                className="flex items-center gap-1 whitespace-nowrap text-[14.5px] tracking-tight transition-colors hover:text-[var(--gt-gold)]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  color: MORE.some((m) => m.href === location) ? "var(--gt-gold)" : "var(--gt-fg)",
                }}
              >
                More
                <ChevronDown
                  size={15}
                  style={{ opacity: 0.7, transform: moreOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}
                />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full pt-3 z-50">
                  <div
                    className="min-w-[210px] rounded-lg border py-1.5 shadow-2xl"
                    style={{ borderColor: "var(--gt-line2)", background: "rgba(15,20,29,.98)", backdropFilter: "blur(20px)" }}
                  >
                    {MORE.map((m) => (
                      <Link
                        key={m.href}
                        href={m.href}
                        className="block px-4 py-2.5 text-[14px] tracking-tight transition-colors hover:bg-[var(--gt-gold-dim)]"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 500,
                          color: location === m.href ? "var(--gt-gold)" : "var(--gt-fg2)",
                        }}
                      >
                        {m.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className="w-px h-5 self-center" style={{ background: "var(--gt-line2)" }} />

            <Link
              href="/submit"
              className="whitespace-nowrap text-[13.5px] font-semibold tracking-tight px-4 py-2 rounded-md transition-transform duration-150 active:scale-[0.97]"
              style={{ fontFamily: "var(--font-display)", color: "#0a0d14", background: "var(--gt-gold)" }}
            >
              Submit Evidence
            </Link>

            {isAuthenticated ? (
              <button
                onClick={() => logout()}
                title={`Signed in as ${user?.name || user?.email || "contributor"} — click to sign out`}
                className="flex items-center gap-1.5 whitespace-nowrap text-[13.5px] font-medium tracking-tight px-3.5 py-2 rounded-md border transition-colors hover:border-[var(--gt-gold-line)]"
                style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg2)", borderColor: "var(--gt-line2)" }}
              >
                <LogOut size={14} /> {user?.name?.split(" ")[0] || "Account"}
              </button>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="flex items-center gap-1.5 whitespace-nowrap text-[13.5px] font-medium tracking-tight px-3.5 py-2 rounded-md border transition-colors hover:border-[var(--gt-gold-line)]"
                style={{ fontFamily: "var(--font-display)", color: "var(--gt-fg)", borderColor: "var(--gt-line2)" }}
              >
                <LogIn size={14} /> Sign In
              </button>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <Link
                href="/admin"
                className="whitespace-nowrap text-[13.5px] font-medium tracking-tight px-3 py-2 rounded-md border transition-colors hover:border-[var(--gt-gold-line)]"
                style={{ fontFamily: "var(--font-display)", color: "var(--gt-gold)", borderColor: "var(--gt-gold-line)" }}
              >
                Admin
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
                className="text-[16px] py-1 tracking-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: location === n.href ? 700 : 500,
                  color: location === n.href ? "var(--gt-gold)" : "var(--gt-fg)",
                }}
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
          className="border-t py-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 text-[11px] tracking-[0.12em] uppercase text-center"
          style={{ borderColor: "var(--gt-line)", color: "var(--gt-mut)", fontFamily: "var(--font-mono)" }}
        >
          <span>Every figure carries its receipt · No finding publishes without right of reply</span>
          <TechViewToggle />
        </div>
      </footer>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthed={() => { setAuthOpen(false); refresh(); }}
      />
    </div>
  );
}
