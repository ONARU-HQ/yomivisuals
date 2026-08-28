import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { to: "/projects", label: "Work" },
  { to: "/services", label: "Services" },
  { to: "/how-we-work", label: "How We Work" },
  { to: "/about", label: "About" },
  { to: "/ecosystem", label: "Ecosystem" },
] as const;

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (pathname.startsWith("/admin") || pathname.startsWith("/portal")) return null;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open ? "border-b border-border bg-background py-3.5" : "py-5 md:py-7"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-5 md:px-10">
          <Link
            to="/"
            aria-label="Yomi Visuals — home"
            className="shrink-0 text-[12.5px] font-medium uppercase tracking-[0.22em] text-foreground md:text-[13px]"
          >
            Yomi Visuals
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="link-underline text-[11.5px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              to="/book"
              className="hidden items-center gap-1.5 text-[11.5px] uppercase tracking-[0.16em] text-foreground transition-colors hover:text-gold lg:inline-flex"
            >
              Start a Project
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="grid h-11 w-11 place-items-center border border-border text-foreground transition-colors hover:border-border-strong lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-background transition-opacity duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile" className="flex flex-1 flex-col px-5 pt-28 pb-10">
          {links.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              tabIndex={open ? 0 : -1}
              className="flex items-baseline justify-between border-b border-border py-6 text-foreground"
            >
              <span className="text-headline text-[30px]">{l.label}</span>
              <span className="text-index">0{i + 1}</span>
            </Link>
          ))}
          <Link
            to="/book"
            tabIndex={open ? 0 : -1}
            className="mt-auto inline-flex items-center justify-between gap-2 border border-border-strong px-6 py-5 text-[12px] uppercase tracking-[0.18em] text-foreground"
          >
            Start a Project
            <ArrowUpRight className="h-4 w-4 text-gold" />
          </Link>
        </nav>
      </div>
    </>
  );
}
