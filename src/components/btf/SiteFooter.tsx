import { Link, useRouterState } from "@tanstack/react-router";
import { INSTAGRAM_URL, NAV, STUDIO_URL } from "@/content/site";
import { isAppPath } from "./SiteNav";

export function SiteFooter() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  if (isAppPath(pathname)) return null;
  return (
    <footer className="border-t border-white/10 bg-[var(--film-ink)] text-[var(--film-paper)]">
      <div className="film-pad mx-auto grid max-w-[1600px] gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-serif text-3xl italic">Yomi Visuals</p>
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-[var(--film-muted)]">Art. Code. Imagination.</p>
          <p className="mt-6 text-[12px] text-[var(--film-muted)]">The creative identity of Yomi Onalaru.</p>
        </div>
        <nav aria-label="Site">
          <p className="film-eyebrow">Explore</p>
          <ul className="mt-4 space-y-2.5 text-[14px]">
            {NAV.map((n) => (
              <li key={n.to}><Link to={n.to} className="hover:text-[var(--film-gold)]">{n.label}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Connect">
          <p className="film-eyebrow">Connect</p>
          <ul className="mt-4 space-y-2.5 text-[14px]">
            <li><Link to="/contact" className="hover:text-[var(--film-gold)]">Contact</Link></li>
            <li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--film-gold)]">Instagram<span className="sr-only"> (opens in a new tab)</span></a></li>
            <li><a href={STUDIO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--film-gold)]">YV Studios Africa ↗<span className="sr-only"> (opens in a new tab)</span></a></li>
          </ul>
        </nav>
        <nav aria-label="Account and legal">
          <p className="film-eyebrow">Account</p>
          <ul className="mt-4 space-y-2.5 text-[14px]">
            <li><Link to="/portal" className="hover:text-[var(--film-gold)]">Client portal</Link></li>
            <li><Link to="/privacy" className="hover:text-[var(--film-gold)]">Privacy</Link></li>
          </ul>
        </nav>
      </div>
      <div className="film-pad mx-auto flex max-w-[1600px] flex-wrap justify-between gap-3 border-t border-white/10 py-6 text-[12px] text-[var(--film-muted)]">
        <span>© {new Date().getFullYear()} Yomi Visuals. All photography © Yomi Visuals.</span>
        <span>Innovation · Excellence · Integrity · Creativity · Impact</span>
      </div>
    </footer>
  );
}
