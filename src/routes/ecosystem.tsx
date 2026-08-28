import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { DIVISIONS, FUTURE_DIVISIONS } from "@/lib/ecosystem";
import { Container, PageHero, Reveal, Eyebrow } from "@/components/site/ui";
import { EcosystemMap } from "@/components/yv";

export const Route = createFileRoute("/ecosystem")({
  head: () => ({
    meta: [
      { title: "The YV Ecosystem — Yomi Visuals Creative Production Company" },
      {
        name: "description",
        content:
          "YV Creative, YV Production, YV Campaigns, YV Studios, YV Entertainment, YV Management, YV Creators Network and YV Shortlets — the divisions inside the Yomi Visuals ecosystem.",
      },
      { property: "og:title", content: "The YV Ecosystem — Yomi Visuals" },
      {
        property: "og:description",
        content: "One master brand, connected divisions: creative, production, campaigns, studios, entertainment and talent.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/ecosystem" }],
  }),
  component: EcosystemPage,
});

function EcosystemPage() {
  return (
    <>
      <PageHero
        eyebrow="The Ecosystem"
        title="One company. Connected divisions."
        body="Yomi Visuals is the master brand. Each division below is a distinct business with its own remit — built so a single campaign can move across creative, production, studio and talent without leaving the ecosystem."
      />

      {/* Architecture diagram */}
      <Container className="py-14 md:py-20">
        <div className="border border-border p-6 md:p-12">
          <div className="text-center">
            <Eyebrow>Master Brand</Eyebrow>
            <p className="text-headline mt-4 text-[clamp(1.6rem,5vw,2.8rem)]">Yomi Visuals</p>
            <p className="mt-2 text-[13px] text-muted-foreground">Creative Production Company</p>
          </div>
          <div className="mx-auto my-8 h-10 w-px bg-border-strong md:my-12" aria-hidden />
          <EcosystemMap divisions={DIVISIONS} />
        </div>
      </Container>

      {/* Division detail */}
      <div className="border-t border-border">
        {DIVISIONS.map((d, i) => (
          <Reveal key={d.name} delay={(i % 2) * 60}>
            <section className="border-b border-border">
              <Container className="grid gap-8 py-12 md:grid-cols-[1fr_1.4fr] md:gap-16 md:py-20">
                <div>
                  <span className="text-index">{d.code}</span>
                  <h2 className="text-headline mt-4 text-[clamp(1.5rem,4vw,2.4rem)]">{d.name}</h2>
                  <p className="text-serif mt-3 text-[clamp(1.05rem,2.4vw,1.35rem)] normal-case text-gold">{d.tagline}</p>
                  {d.status === "building" ? (
                    <span className="mt-5 inline-block border border-border px-3 py-1.5 text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                      In development
                    </span>
                  ) : null}
                </div>
                <div>
                  <p className="max-w-xl text-[15px] leading-relaxed text-subtle">{d.body}</p>
                  <ul className="mt-7 flex flex-wrap gap-2">
                    {d.services.map((s) => (
                      <li key={s} className="border border-border px-3.5 py-2 text-[12.5px] text-muted-foreground">
                        {s}
                      </li>
                    ))}
                  </ul>
                  {d.href ? (
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-7 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-foreground transition-colors hover:text-gold"
                    >
                      {d.href.replace("https://", "")}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              </Container>
            </section>
          </Reveal>
        ))}
      </div>

      <Container className="py-16 md:py-24">
        <Eyebrow>Built to expand</Eyebrow>
        <h2 className="text-display mt-4 max-w-3xl text-[clamp(1.7rem,4.5vw,2.8rem)]">
          The architecture is modular. New divisions plug in.
        </h2>
        <ul className="mt-8 flex flex-wrap gap-2">
          {FUTURE_DIVISIONS.map((f) => (
            <li key={f} className="border border-dashed border-border px-3.5 py-2 text-[12.5px] text-muted-foreground">
              {f}
            </li>
          ))}
        </ul>
        <Link
          to="/book"
          className="mt-10 inline-flex items-center gap-2 bg-primary px-7 py-4 text-[12px] uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90"
        >
          Start a Project
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Container>
    </>
  );
}
