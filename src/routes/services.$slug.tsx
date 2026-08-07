import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { serviceQuery, servicesQuery, coverFor, imageFor } from "@/lib/cms";
import { portfolioQuery, imagesForSubject, focalStyle } from "@/lib/portfolio";
import { Container, Section, Eyebrow, ButtonLink, PageHero } from "@/components/site/ui";


export const Route = createFileRoute("/services/$slug")({
  loader: async ({ context, params }) => {
    const service = await context.queryClient.ensureQueryData(serviceQuery(params.slug));
    if (!service) throw notFound();
    await context.queryClient.ensureQueryData(servicesQuery);
    return { service };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Service unavailable — Yomi Visuals" }, { name: "robots", content: "noindex" }] };
    }
    const s = loaderData.service;
    const title = s.seo_title || `${s.title} — Yomi Visuals`;
    const description = s.seo_description || s.excerpt || "A Yomi Visuals service.";
    const url = `https://yomivisuals.lovable.app/services/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.title,
            description,
            areaServed: "Lagos, Nigeria",
            provider: { "@type": "Organization", name: "Yomi Visuals" },
          }),
        },
      ],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const { slug } = Route.useParams();
  const { data: service } = useSuspenseQuery(serviceQuery(slug));
  const { data: all } = useSuspenseQuery(servicesQuery);
  const { data: photos } = useSuspenseQuery(portfolioQuery);
  if (!service) return null;

  const process = Array.isArray(service.process) ? service.process : [];
  const pricing = Array.isArray(service.pricing) ? service.pricing : [];
  const faqs = Array.isArray(service.faqs) ? service.faqs : [];
  const matched = imagesForSubject(photos, `${service.title} ${service.excerpt ?? ""}`, 3);
  const others = all.filter((s) => s.slug !== slug).slice(0, 4);

  return (
    <>
      <PageHero eyebrow="Service" title={service.title} body={service.overview || service.excerpt || undefined}>
        <ButtonLink to="/book">Book Consultation</ButtonLink>
      </PageHero>

      <Container className="py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {matched.length
            ? matched.map((img) => (
                <div key={img.id} className="image-reveal overflow-hidden rounded-[14px] border border-border">
                  <img
                    src={img.thumb_url ?? img.url}
                    alt={`${service.title} — ${img.title} by Yomi Visuals`}
                    loading="lazy"
                    decoding="async"
                    style={focalStyle(img)}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
              ))
            : (service.gallery?.length ? service.gallery : [0, 1, 2].map((i) => imageFor(service.slug, i))).map(
                (src: string, i: number) => (
                  <div key={i} className="image-reveal overflow-hidden rounded-[14px] border border-border">
                    <img
                      src={src}
                      alt={`${service.title} work ${i + 1}`}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover"
                    />
                  </div>
                ),
              )}
        </div>
      </Container>


      {process.length ? (
        <Section className="border-t border-border">
          <Eyebrow>Process</Eyebrow>
          <div className="mt-10 grid gap-px overflow-hidden rounded-[14px] border border-border bg-border md:grid-cols-3">
            {process.map((step: any, i: number) => (
              <div key={i} className="bg-background p-7">
                <span className="text-[12px] text-muted-foreground">0{i + 1}</span>
                <h3 className="mt-4 text-[16px] font-medium tracking-tight">{step.title}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {pricing.length ? (
        <Section className="border-t border-border">
          <Eyebrow>Investment</Eyebrow>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {pricing.map((tier: any, i: number) => (
              <div key={i} className="panel flex flex-col p-8">
                <h3 className="text-[16px] font-medium tracking-tight">{tier.name}</h3>
                <p className="text-display mt-3 text-[clamp(1.6rem,3.4vw,2.2rem)]">{tier.price}</p>
                <ul className="mt-7 space-y-3">
                  {(tier.features ?? []).map((f: string) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-subtle">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <ButtonLink to="/book" variant="outline">
                    Enquire
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {faqs.length ? (
        <Section className="border-t border-border">
          <Eyebrow>Questions</Eyebrow>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {faqs.map((f: any, i: number) => (
              <details key={i} className="group py-6">
                <summary className="cursor-pointer list-none text-[15.5px] font-medium tracking-tight">{f.q}</summary>
                <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>
      ) : null}

      <Section className="border-t border-border">
        <Eyebrow>Other services</Eyebrow>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {others.map((s) => (
            <Link
              key={s.id}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="rounded-full border border-border px-4 py-2 text-[13px] text-subtle transition-colors hover:bg-elevated hover:text-foreground"
            >
              {s.title}
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
