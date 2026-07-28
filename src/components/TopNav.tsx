import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { to: "/portfolio", label: "Work" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled || open ? "glass-nav py-3" : "py-4 md:py-6"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 md:px-10">
          <Link to="/" className="flex items-center">
            <span className="text-display text-base tracking-tight text-primary md:text-lg">
              Yomi<span className="text-gold">.</span>Visuals
            </span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="link-underline text-[12px] font-medium tracking-wide text-primary/80 hover:text-primary"
                activeProps={{ className: "text-primary" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/book"
              className="group hidden items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-gold-warm transition-all duration-500 hover:bg-gold hover:text-primary-foreground md:inline-flex"
            >
              Book Now
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setOpen((o) => !o)}
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        className={`fixed inset-0 z-30 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-background/70 backdrop-blur-md transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute inset-x-0 top-0 border-b border-border bg-surface pt-20 pb-8 transition-transform duration-500 ${open ? "translate-y-0" : "-translate-y-full"}`}
        >
          <nav className="mx-auto flex max-w-md flex-col gap-1 px-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="flex items-center justify-between border-b border-border/60 py-4 text-primary"
              >
                <span className="text-display text-2xl">{l.label}</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
            <Link
              to="/book"
              className="mt-6 inline-flex items-center justify-center gap-2 bg-gold px-6 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-primary-foreground"
              style={{ borderRadius: "12px" }}
            >
              Book Your Experience
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
