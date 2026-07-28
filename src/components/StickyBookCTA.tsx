import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

const HIDDEN = ["/book", "/gallery", "/account"];

export function StickyBookCTA() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  if (HIDDEN.some((p) => pathname.startsWith(p))) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-20 z-30 flex justify-center md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Link
        to="/book"
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-primary-foreground shadow-[0_12px_40px_-8px_rgba(198,161,74,0.55)] transition-transform duration-300 active:scale-95"
      >
        Book Now
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
