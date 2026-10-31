import { Link, useRouterState } from "@tanstack/react-router";
import { INSTAGRAM_URL, NAV, STUDIO_URL } from "@/content/site";
import { isAppPath } from "./SiteNav";

export function SiteFooter() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  if (isAppPath(pathname)) return null;
  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="mx-wrap mx-auto grid max-w-[1600px] gap-14 pb-10 pt-20 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="mx-mono text-[12px] text-white/60">Creative studio · Lagos / Accra</p>
          <p className="mx-h1 mt-4 text-[clamp(2.6rem,7vw,6rem)]">Yomi Visuals</p>
          <p className="mx-mono mt-6 text-[13px] text-white/60">Art. Code. Imagination.</p>
        </div>
        <div className="grid grid-cols-2 gap-10 md:justify-items-end">
          <nav aria-label="Site">
            <ul className="mx-mono space-y-2 text-[clamp(1.1rem,2vw,1.6rem)]">
              {NAV.map((n) => (<li key={n.to}><Link to={n.to} className="hover:opacity-60">{n.label}</Link></li>))}
            </ul>
          </nav>
          <nav aria-label="Connect">
            <ul className="mx-mono space-y-2 text-[15px]">
              <li><Link to="/contact" className="hover:opacity-60">Contact</Link></li>
              <li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:opacity-60">Instagram ↗<span className="sr-only"> (opens in a new tab)</span></a></li>
              <li><a href={STUDIO_URL} target="_blank" rel="noopener noreferrer" className="hover:opacity-60">YV Studios ↗<span className="sr-only"> (opens in a new tab)</span></a></li>
              <li><Link to="/portal" className="hover:opacity-60">Client portal</Link></li>
              <li><Link to="/privacy" className="hover:opacity-60">Privacy</Link></li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="mx-wrap mx-auto flex max-w-[1600px] flex-wrap justify-between gap-3 border-t border-white/15 py-6 text-[12px] text-white/55">
        <span>© {new Date().getFullYear()} Yomi Visuals. All photography © Yomi Visuals.</span>
        <span className="mx-mono">Innovation · Excellence · Integrity · Creativity · Impact</span>
      </div>
    </footer>
  );
}
