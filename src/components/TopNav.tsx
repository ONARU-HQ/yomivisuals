import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { to: "/work", label: "Work" },
  { to: "/services", label: "Services" },
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
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-[var(--motion-cinematic)] ease-[var(--ease-out-expo)] ${
          scrolled || open
            ? "border-b border-border bg-background/90 py-3 backdrop-blur-md"
            : "border-b border-transparent py-5 md:py-7"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-5 md:px-10">
          <Link
            to="/"
            aria-label="Yomi Visuals — home"
            className="press shrink-0 text-[12.5px] font-medium uppercase tracking-[0.22em] text-foreground transition-opacity duration-[var(--motion-micro)] hover:opacity-70 md:text-[13px]"
          >
            Yomi Visuals
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="link-underline text-[11.5px] uppercase tracking-[0.16em] text-muted-foreground transition-colors duration-[var(--motion-fast)] hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              to="/start-a-project"
              className="press group hidden items-center gap-1.5 text-[11.5px] uppercase tracking-[0.16em] text-foreground transition-colors duration-[var(--motion-fast)] hover:text-gold lg:inline-flex"
            >
              Start a Project
              <ArrowUpRight className="arrow-nudge-diagonal h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="tap press relative grid h-11 w-11 place-items-center overflow-hidden border border-border text-foreground transition-colors duration-[var(--motion-fast)] hover:border-border-strong lg:hidden"
            >
              <Menu
                className="icon-morph absolute h-4 w-4"
                style={{ opacity: open ? 0 : 1, transform: open ? "rotate(-90deg) scale(0.7)" : "none" }}
              />
              <X
                className="icon-morph absolute h-4 w-4"
                style={{ opacity: open ? 1 : 0, transform: open ? "none" : "rotate(90deg) scale(0.7)" }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-background lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{
          transition: open
            ? "opacity var(--motion-standard) var(--ease-out-expo)"
            : "opacity var(--motion-fast) var(--ease-in-yv)",
        }}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile" className="flex flex-1 flex-col overflow-y-auto px-4 pt-24 pb-8">
          {links.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              tabIndex={open ? 0 : -1}
              style={{ ["--i" as string]: i }}
              className={`press flex items-baseline justify-between border-b border-border py-5 text-foreground ${
                open ? "menu-item" : "menu-closing"
              }`}
            >
              <span className="text-headline text-[clamp(28px,8vw,38px)]">{l.label}</span>
              <span className="text-index">0{i + 1}</span>
            </Link>
          ))}
          <Link
            to="/start-a-project"
            tabIndex={open ? 0 : -1}
            style={{ ["--i" as string]: links.length + 1 }}
            className={`${open ? "menu-item" : "menu-closing"} press mt-8 inline-flex min-h-[56px] items-center justify-between gap-2 bg-primary px-6 py-5 text-[12px] uppercase tracking-[0.18em] text-primary-foreground`}
          >
            Start a Project
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          <div
            style={{ ["--i" as string]: links.length + 3 }}
            className={`${open ? "menu-item" : "menu-closing"} mt-10 grid gap-3 text-[12.5px] text-muted-foreground`}
          >
            <Link
              to="/contact"
              tabIndex={open ? 0 : -1}
              className="tap flex items-center justify-between border-t border-border pt-3 transition-colors hover:text-foreground"
            >
              Contact <span className="text-subtle">Enquiries</span>
            </Link>
            <Link
              to="/auth"
              tabIndex={open ? 0 : -1}
              className="tap flex items-center justify-between border-t border-border pt-3 transition-colors hover:text-foreground"
            >
              Client Login <span className="text-subtle">Portal</span>
            </Link>
          </div>

          <div
            style={{ ["--i" as string]: links.length + 5 }}
            className={`${open ? "menu-item" : "menu-closing"} mt-auto grid gap-3 pt-10 text-[12.5px] text-muted-foreground`}
          >

            <a
              href="https://www.instagram.com/yomi.visuals/"
              target="_blank"
              rel="noreferrer"
              tabIndex={open ? 0 : -1}
              className="tap flex items-center justify-between border-t border-border pt-3 transition-colors hover:text-foreground"
            >
              Instagram <span className="text-gold">@yomi.visuals</span>
            </a>
            <a
              href="mailto:yomivisualshq@gmail.com"
              tabIndex={open ? 0 : -1}
              className="tap flex items-center justify-between border-t border-border pt-3 transition-colors hover:text-foreground"
            >
              Email <span className="text-gold">yomivisualshq@gmail.com</span>
            </a>
            <p className="flex items-center justify-between border-t border-border pt-3">
              Location <span className="text-subtle">Lagos, Nigeria</span>
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
