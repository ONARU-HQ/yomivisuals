import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery } from "@/lib/cms";
import { Container, inputClass } from "@/components/site/ui";

const columns = [
  {
    title: "Company",
    links: [
      { to: "/portfolio", label: "Work" },
      { to: "/services", label: "Services" },
      { to: "/how-we-work", label: "How We Work" },
      { to: "/ecosystem", label: "Ecosystem" },
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Enquiries",
    links: [
      { to: "/book", label: "Start a Project" },
      { to: "/faqs", label: "FAQs" },
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms" },
    ],
  },
] as const;

export function SiteFooter() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { data: settings } = useQuery(settingsQuery);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => setMounted(true), []);

  if (pathname.startsWith("/admin") || pathname.startsWith("/portal")) return null;

  const company = settings?.company ?? {};
  const social: Record<string, string> = mounted ? (settings?.social ?? {}) : {};

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
      <Container className="py-14 md:py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="text-display text-[clamp(1.7rem,4vw,2.6rem)] leading-[1.05]">
              Let's build something
              <br />
              people remember.
            </p>
            <Link
              to="/book"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start a Project
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

          <div className="grid grid-cols-2 gap-10 md:col-span-6">
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

        <div className="mt-14 flex flex-col gap-5 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-[12px] text-muted-foreground">
            © {new Date().getFullYear()} {company.name ?? "Yomi Visuals"} — {company.address ?? "Lagos, Nigeria"}
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
