import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery } from "@/lib/cms";
import { Container, inputClass } from "@/components/site/ui";

const columns = [
  {
    title: "Studio",
    links: [
      { to: "/projects", label: "Work" },
      { to: "/services", label: "Services" },
      { to: "/studio", label: "Studio & Rental" },
      { to: "/about", label: "About" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/articles", label: "Articles" },
      { to: "/careers", label: "Careers" },
      { to: "/testimonials", label: "Testimonials" },
      { to: "/faqs", label: "FAQs" },
    ],
  },
  {
    title: "Connect",
    links: [
      { to: "/contact", label: "Contact" },
      { to: "/book", label: "Book Consultation" },
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms" },
    ],
  },
] as const;

export function SiteFooter() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { data: settings } = useQuery(settingsQuery);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  if (pathname.startsWith("/admin")) return null;

  const company = settings?.company ?? {};
  const social = settings?.social ?? {};

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setState("loading");
    await supabase.from("subscribers").insert({ email: email.trim().toLowerCase() });
    setState("done");
    setEmail("");
  }

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-16 md:py-24">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-display text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.02]">
              Let's build something
              <br />
              incredible.
            </p>
            <Link
              to="/book"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Book Consultation
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <form onSubmit={subscribe} className="mt-10 max-w-sm">
              <label className="text-eyebrow">Newsletter</label>
              <div className="mt-3 flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={inputClass}
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="shrink-0 rounded-[10px] border border-border-strong px-4 text-[13px] font-medium transition-colors hover:bg-elevated"
                >
                  {state === "done" ? "Joined" : "Join"}
                </button>
              </div>
              {state === "done" ? (
                <p className="mt-2 text-[12px] text-muted-foreground">You're on the list.</p>
              ) : null}
            </form>
          </div>

          <div className="grid gap-10 md:col-span-7 md:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-eyebrow">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="text-[13.5px] text-subtle transition-colors hover:text-foreground">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-[12px] text-muted-foreground">
            © {new Date().getFullYear()} {company.name ?? "Yomi Visuals"}. {company.address ?? "Lagos, Nigeria"}.
          </p>
          <div className="flex flex-wrap gap-5 text-[12px] text-muted-foreground">
            {Object.entries(social).map(([key, url]) => (
              <a
                key={key}
                href={String(url)}
                target="_blank"
                rel="noreferrer"
                className="capitalize transition-colors hover:text-foreground"
              >
                {key}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
