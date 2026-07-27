import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Images, Calendar, FolderLock, User } from "lucide-react";

const items: { to: string; label: string; icon: typeof Home; primary?: boolean }[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/portfolio", label: "Portfolio", icon: Images },
  { to: "/book", label: "Book", icon: Calendar, primary: true },
  { to: "/gallery", label: "Gallery", icon: FolderLock },
  { to: "/account", label: "Account", icon: User },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border md:hidden"
      style={{
        background: "rgba(5,5,5,0.82)",
        backdropFilter: "saturate(180%) blur(24px)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-5 px-2 py-2">
        {items.map((it) => {
          const active = pathname === it.to || (it.to !== "/" && pathname.startsWith(it.to));
          const Icon = it.icon;
          if (it.primary) {
            return (
              <li key={it.to} className="flex items-center justify-center">
                <Link
                  to={it.to}
                  className="-mt-6 grid h-14 w-14 place-items-center rounded-full bg-gold text-primary-foreground shadow-[0_10px_30px_-8px_rgba(198,161,74,0.55)] transition-transform duration-300 active:scale-95"
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </Link>
              </li>
            );
          }
          return (
            <li key={it.to} className="flex flex-col items-center justify-center">
              <Link
                to={it.to}
                className={`flex flex-col items-center gap-1 py-2 transition-colors duration-300 ${
                  active ? "text-gold-warm" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                <span className="text-[10px] uppercase tracking-[0.18em]">
                  {it.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
