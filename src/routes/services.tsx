import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { servicesQuery } from "@/lib/cms";
import { Container, PageHero, ButtonLink } from "@/components/site/ui";

export const Route = createFileRoute("/services")({
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  head: () => ({
    meta: [
      { title: "Creative Agency Services — Yomi Visuals Lagos" },
      {
        name: "description",
        content:
          "Creative direction, brand strategy, photography, videography, campaign and content production, studio rental and digital design from Yomi Visuals, Lagos.",
      },
      { property: "og:title", content: "Creative Agency Services — Yomi Visuals" },
      { property: "og:description", content: "Twelve disciplines, one studio. Explore Yomi Visuals services and pricing." },
      { property: "og:url", content: "https://yomivisuals.lovable.app/services" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services } = useSuspenseQuery(servicesQuery);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything a brand needs, under one roof."
        body="Engage us for a single discipline or the whole system. Either way you get the same standard."
      >
        <ButtonLink to="/book">Book Consultation</ButtonLink>
      </PageHero>

      <Container className="py-14 md:py-20">
        <div className="grid gap-px overflow-hidden rounded-[14px] border border-border bg-border md:grid-cols-2">
          {services.map((s) => {
            const price = Array.isArray(s.pricing) && s.pricing.length ? s.pricing[0].price : null;
            return (
              <Link
                key={s.id}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group flex flex-col justify-between gap-10 bg-background p-8 transition-colors hover:bg-elevated md:p-10"
              >
                <div>
                  <h2 className="text-display text-[clamp(1.4rem,3vw,2rem)]">{s.title}</h2>
                  <p className="mt-3.5 max-w-md text-[14px] leading-relaxed text-muted-foreground">{s.excerpt}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-subtle">{price ?? "On request"}</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </>
  );
}
