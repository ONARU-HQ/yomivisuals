import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { NAV, STUDIO_URL } from "@/content/site";

/** Private application shells render their own chrome. */
export const isAppPath = (p: string) => /^\/(admin|portal|auth|reset-password)(\/|$)/.test(p);

export function SiteNav() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (isAppPath(pathname)) return null;

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-[var(--m-standard)] ${
          solid || open ? "bg-[#090909]/85 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="film-pad mx-auto flex h-16 max-w-[1600px] items-center justify-between">
          <Link to="/" className="font-serif text-[22px] italic tracking-tight text-[var(--film-paper)]" aria-label="Yomi Visuals, home">
            Yomi Visuals
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-[11.5px] uppercase tracking-[0.2em] text-[var(--film-paper)]/80 transition-colors hover:text-[var(--film-gold)]"
                activeProps={{ className: "!text-[var(--film-gold)]", "aria-current": "page" }}
              >
                {n.label}
              </Link>
            ))}
            <a
              href={STUDIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[var(--film-paper)]/35 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[var(--film-paper)] transition-colors hover:border-[var(--film-gold)] hover:text-[var(--film-gold)]"
            >
              YV Studios ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 flex h-11 w-11 items-center justify-center text-[var(--film-paper)] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-current transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-6 bg-current transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </header>

      {open ? (
        <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-40 bg-[#090909] pt-20 md:hidden">
          <nav aria-label="Mobile" className="film-pad flex h-full flex-col gap-1 pb-10">
            {NAV.map((n, i) => (
              <Link
                key={n.to}
                to={n.to}
                ref={i === 0 ? firstLink : undefined}
                className="film-title border-b border-white/10 py-5 text-[clamp(2rem,9vw,3rem)] text-[var(--film-paper)]"
              >
                {n.label}
              </Link>
            ))}
            <a href={STUDIO_URL} target="_blank" rel="noopener noreferrer" className="film-btn film-btn--solid mt-8">
              Explore YV Studios ↗
            </a>
            <Link to="/portal" className="mt-auto pt-8 text-[12px] uppercase tracking-[0.2em] text-[var(--film-muted)]">
              Client portal
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  );
}
