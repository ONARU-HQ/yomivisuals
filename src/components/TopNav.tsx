import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { to: "/projects", label: "Work" },
  { to: "/services", label: "Services" },
  { to: "/studio", label: "Studio" },
  { to: "/about", label: "About" },
  { to: "/articles", label: "Articles" },
  { to: "/contact", label: "Contact" },
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

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-400 ${
          scrolled || open ? "border-b border-border bg-background py-3.5" : "py-5 md:py-7"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between px-5 md:px-10">
          <Link to="/" className="text-[15px] font-semibold tracking-[-0.04em] text-foreground md:text-base">
            Yomi Visuals
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="link-underline text-[13px] text-subtle transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/book"
              className="hidden items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[12.5px] font-medium text-primary-foreground transition-opacity hover:opacity-90 md:inline-flex"
            >
              Book Consultation
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-background transition-opacity duration-300 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav className="flex h-full flex-col px-5 pt-24 pb-10">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="flex items-center justify-between border-b border-border py-5 text-foreground"
            >
              <span className="text-display text-[28px]">{l.label}</span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
          <Link
            to="/book"
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-[14px] font-medium text-primary-foreground"
          >
            Book Consultation
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </>
  );
}
