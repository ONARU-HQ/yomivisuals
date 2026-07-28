import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { services, formatNaira } from "@/lib/services-data";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Yomi Visuals" },
      {
        name: "description",
        content:
          "Photography, film, commercial, events, fashion and corporate services from Yomi Visuals — bookable end-to-end with transparent pricing.",
      },
      { property: "og:title", content: "Services — Yomi Visuals" },
      { property: "og:description", content: "Transparent pricing across every discipline. Bookable end-to-end." },
      { property: "og:url", content: "https://yomivisuals.lovable.app/services" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/services" }],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32">
      <section className="mx-auto max-w-[1500px] px-5 md:px-10">
        <p className="text-eyebrow mb-5">Services</p>
        <h1 className="text-display text-4xl leading-[1] text-primary md:text-7xl">
          Transparent pricing. <br />
          <span className="text-editorial text-gold-warm">Instantly bookable.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
          Every service is bookable in nine calm steps. Choose your package, pick a date, and we'll hold it with a 30% deposit.
        </p>
      </section>

      <section className="mx-auto mt-14 max-w-[1500px] px-5 md:mt-20 md:px-10">
        <div className="space-y-4 md:space-y-6">
          {services.map((s, i) => {
            const from = Math.min(...s.packages.map((p) => p.price));
            return (
              <Link
                key={s.slug}
                to="/services/$service"
                params={{ service: s.slug }}
                className="group block overflow-hidden border border-border bg-card transition-all duration-500 hover:border-gold/40"
                style={{ borderRadius: "16px" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-12">
                  <div className={`image-reveal md:col-span-5 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                    <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:h-full">
                      <img src={s.cover} alt={s.name} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-between p-6 md:col-span-7 md:p-10">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.26em] text-gold">from {formatNaira(from)}</p>
                      <h2 className="mt-3 text-display text-3xl text-primary md:text-5xl">{s.name}</h2>
                      <p className="mt-3 text-editorial text-lg text-primary/80 md:text-xl">{s.tagline}</p>
                      <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
                        {s.description}
                      </p>
                    </div>
                    <div className="mt-8 flex items-center gap-6">
                      <span className="link-underline text-[11px] uppercase tracking-[0.22em] text-primary group-hover:text-gold-warm">
                        View service →
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        {s.packages.length} packages
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border mt-24 bg-surface py-20 md:py-28">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-8 px-5 md:flex-row md:items-end md:px-10">
          <div>
            <p className="text-eyebrow mb-4">Not sure which?</p>
            <h2 className="text-display text-3xl text-primary md:text-5xl">
              Start with a <span className="text-editorial text-gold-warm">consultation.</span>
            </h2>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-primary px-7 py-4 text-[11px] uppercase tracking-[0.22em] text-primary-foreground hover:bg-gold-warm"
            style={{ borderRadius: "12px" }}
          >
            Talk to the studio
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
