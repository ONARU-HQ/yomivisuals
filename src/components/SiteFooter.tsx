import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface pb-24 md:pb-0">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="text-display text-4xl leading-[0.95] text-primary md:text-6xl">
              Yomi<span className="text-gold">.</span>Visuals
            </p>
            <p className="text-editorial mt-5 text-lg text-primary/80 md:text-2xl">
              Preserving your memories with timeless photography.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href="https://instagram.com/yomi.visuals"
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:border-gold hover:text-primary"
              >
                <Instagram className="h-3.5 w-3.5" />
                @yomi.visuals
              </a>
              <a
                href="https://tiktok.com/@yomi.visuals"
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:border-gold hover:text-primary"
              >
                TikTok
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-6 md:grid-cols-3">
            <FooterCol
              title="Explore"
              links={[
                { label: "Work", to: "/portfolio" },
                { label: "Services", to: "/services" },
                { label: "Gallery", to: "/gallery" },
              ]}
            />
            <FooterCol
              title="Studio"
              links={[
                { label: "About", to: "/about" },
                { label: "Contact", to: "/contact" },
                { label: "Book", to: "/book" },
              ]}
            />
            <FooterCol
              title="Account"
              links={[
                { label: "Sign in", to: "/gallery" },
                { label: "My Bookings", to: "/account" },
                { label: "Downloads", to: "/account" },
              ]}
            />
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <p>© {new Date().getFullYear()} Yomi Visuals — Lagos, Nigeria</p>
          <p>Available worldwide · By appointment</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.26em] text-gold">{title}</p>
      <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="link-underline hover:text-primary">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
