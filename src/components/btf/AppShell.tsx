import { Link, useRouterState } from "@tanstack/react-router";
import type { ComponentType, ReactNode } from "react";
import { LogOut } from "lucide-react";

export type ShellItem = { to: string; label: string; icon?: ComponentType<{ className?: string }>; exact?: boolean };

/**
 * Layer 03 — the signed-in shell shared by /admin and /portal. Same wordmark, tokens and type as the public site;
 * only the chrome differs. Pages inside keep their own data logic untouched.
 */
export function AppShell({
  area, title, items, sections, switchTo, onSignOut, children,
}: {
  area: "Studio CMS" | "Client portal";
  title?: string;
  items: ShellItem[];
  sections?: { heading: string; items: ShellItem[] }[];
  switchTo?: { to: string; label: string };
  onSignOut: () => void;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const link = (n: ShellItem) => {
    const active = n.exact ? pathname === n.to : pathname === n.to || pathname.startsWith(n.to + "/");
    return (
      <Link
        key={n.to}
        to={n.to}
        aria-current={active ? "page" : undefined}
        className={`flex shrink-0 items-center gap-2.5 border-l-2 px-3 py-2.5 text-[13px] transition-colors ${
          active ? "border-gold bg-elevated text-foreground" : "border-transparent text-subtle hover:text-foreground"
        }`}
      >
        {n.icon ? <n.icon className="h-4 w-4" /> : null}
        {n.label}
      </Link>
    );
  };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#app-main" className="skip-link">Skip to content</a>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur md:px-8">
        <div className="flex items-baseline gap-4">
          <Link to="/" className="whitespace-nowrap font-serif text-[21px] italic tracking-tight" aria-label="Yomi Visuals, public site">Yomi Visuals</Link>
          <span className="text-eyebrow hidden md:inline">{area}</span>
        </div>
        <div className="flex items-center gap-0 whitespace-nowrap text-[12.5px] sm:gap-1">
          {switchTo ? <Link to={switchTo.to} className="px-3 py-2 text-subtle hover:text-gold">{switchTo.label}</Link> : null}
          <Link to="/" className="hidden px-3 py-2 text-subtle hover:text-gold sm:block">View site</Link>
          <button onClick={onSignOut} className="flex items-center gap-1.5 px-3 py-2 text-subtle hover:text-gold"><LogOut className="h-3.5 w-3.5" aria-hidden /> <span className="hidden sm:inline">Sign out</span><span className="sr-only sm:hidden">Sign out</span></button>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-[1700px] flex-col lg:flex-row">
        <aside className="border-b border-border lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:w-64 lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r" aria-label={`${area} navigation`}>
          <nav className="flex gap-0 overflow-x-auto px-2 py-2 lg:flex-col lg:px-4 lg:py-6">{items.map(link)}</nav>
          {sections?.map((s) => (
            <div key={s.heading} className="hidden px-4 pb-6 lg:block">
              <p className="text-eyebrow px-3 pb-2 pt-2">{s.heading}</p>
              <nav className="flex flex-col">{s.items.map(link)}</nav>
            </div>
          ))}
        </aside>
        <main id="app-main" className="min-w-0 flex-1 px-4 py-8 md:px-10 md:py-12">
          {title ? <h1 className="text-display mb-8 text-[clamp(2rem,4vw,3.2rem)]">{title}</h1> : null}
          {children}
        </main>
      </div>
    </div>
  );
}
