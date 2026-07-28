import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUpRight, ArrowLeft, Check } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { getService, services, formatNaira } from "@/lib/services-data";
import type { Service } from "@/lib/services-data";

export const Route = createFileRoute("/services/$service")({
  loader: ({ params }) => {
    const s = getService(params.service);
    if (!s) throw notFound();
    return s;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Service — Yomi Visuals" }, { name: "robots", content: "noindex" }] };
    }
    const from = Math.min(...loaderData.packages.map((p) => p.price));
    return {
      meta: [
        { title: `${loaderData.name} — Yomi Visuals` },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: `${loaderData.name} — Yomi Visuals` },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `https://yomivisuals.lovable.app/services/${params.service}` },
      ],
      links: [{ rel: "canonical", href: `https://yomivisuals.lovable.app/services/${params.service}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: loaderData.name,
            description: loaderData.description,
            provider: { "@type": "LocalBusiness", name: "Yomi Visuals" },
            areaServed: "Lagos, Nigeria",
            offers: { "@type": "Offer", price: from, priceCurrency: "NGN" },
          }),
        },
      ],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const s = Route.useLoaderData() as Service;
  const others = services.filter((x) => x.slug !== s.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative h-[70svh] min-h-[500px] w-full overflow-hidden">
        <img src={s.cover} alt={s.name} className="h-full w-full object-cover drift" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/50" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col justify-end px-5 pb-14 md:px-10 md:pb-20">
          <Link
            to="/services"
            className="mb-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-3 w-3" /> All services
          </Link>
          <p className="text-eyebrow mb-4">Service</p>
          <h1 className="text-display text-4xl leading-[1] text-primary md:text-7xl">{s.name}</h1>
          <p className="mt-6 max-w-xl text-editorial text-xl text-primary/80 md:text-2xl">{s.tagline}</p>
        </div>
      </section>

      {/* DESCRIPTION + GALLERY */}
      <section className="mx-auto max-w-[1500px] px-5 py-16 md:grid md:grid-cols-12 md:gap-10 md:px-10 md:py-24">
        <div className="md:col-span-5">
          <p className="text-eyebrow mb-4">About</p>
          <p className="text-editorial text-2xl leading-relaxed text-primary/90 md:text-3xl">{s.description}</p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:col-span-7 md:mt-0 md:gap-4">
          {s.gallery.map((g, i) => (
            <div
              key={i}
              className={`image-reveal relative overflow-hidden ${i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-[3/4]"}`}
              style={{ borderRadius: "12px" }}
            >
              <img src={g} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* PACKAGES */}
      <section className="border-y border-border bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-eyebrow mb-4">Packages</p>
              <h2 className="text-display text-3xl text-primary md:text-5xl">
                Choose your <span className="text-editorial text-gold-warm">commission.</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {s.packages.map((p, i) => {
              const highlighted = i === 1;
              return (
                <div
                  key={p.id}
                  className={`flex flex-col overflow-hidden border p-6 md:p-8 ${
                    highlighted ? "border-gold bg-gold/5" : "border-border bg-card"
                  }`}
                  style={{ borderRadius: "16px" }}
                >
                  <p className="text-[10px] uppercase tracking-[0.26em] text-gold">{p.name}</p>
                  <h3 className="mt-3 text-display text-3xl text-primary md:text-4xl">{formatNaira(p.price)}</h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{p.duration}</p>
                  <ul className="mt-6 flex-1 space-y-2.5 text-sm text-muted-foreground">
                    {p.includes.map((inc) => (
                      <li key={inc} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/book"
                    search={{ exp: s.slug }}
                    className={`mt-8 inline-flex items-center justify-center gap-2 py-3.5 text-[11px] uppercase tracking-[0.22em] transition ${
                      highlighted
                        ? "bg-gold text-primary-foreground hover:bg-gold-warm"
                        : "border border-border text-primary hover:border-gold hover:text-gold-warm"
                    }`}
                    style={{ borderRadius: "12px" }}
                  >
                    Book {p.name}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXTRAS + TIMELINE */}
      <section className="mx-auto max-w-[1500px] px-5 py-20 md:grid md:grid-cols-12 md:gap-12 md:px-10 md:py-28">
        <div className="md:col-span-6">
          <p className="text-eyebrow mb-4">Extras</p>
          <h3 className="text-display text-3xl text-primary md:text-4xl">
            Add what you <span className="text-editorial text-gold-warm">need.</span>
          </h3>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {s.extras.map((e) => (
              <li key={e.label} className="flex items-center justify-between py-4">
                <span className="text-sm text-primary md:text-base">{e.label}</span>
                <span className="text-[11px] uppercase tracking-[0.22em] text-gold">{e.price}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-14 md:col-span-6 md:mt-0">
          <p className="text-eyebrow mb-4">Timeline</p>
          <h3 className="text-display text-3xl text-primary md:text-4xl">
            From reserve to <span className="text-editorial text-gold-warm">delivery.</span>
          </h3>
          <ol className="mt-8 space-y-6">
            {s.timeline.map((t, i) => (
              <li key={t.step} className="flex gap-5">
                <span className="text-display text-2xl text-gold">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-display text-lg text-primary">{t.step}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQS */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="mx-auto max-w-[1000px] px-5 md:px-10">
          <p className="text-eyebrow mb-4 text-center">Questions</p>
          <h3 className="text-center text-display text-3xl text-primary md:text-5xl">Everything to know.</h3>
          <div className="mt-12 divide-y divide-border border-y border-border">
            {s.faqs.map((f) => (
              <details key={f.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                  <h4 className="text-base text-primary md:text-lg">{f.q}</h4>
                  <span className="mt-1 text-gold transition-transform duration-500 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* BOOK BAND */}
      <section className="border-t border-border bg-surface py-20 md:py-28">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-6 px-5 md:flex-row md:items-end md:px-10">
          <div>
            <p className="text-eyebrow mb-4">Ready?</p>
            <h2 className="text-display text-3xl text-primary md:text-5xl">
              Reserve your <span className="text-editorial text-gold-warm">{s.name.toLowerCase()}</span>.
            </h2>
          </div>
          <Link
            to="/book"
            search={{ exp: s.slug }}
            className="inline-flex items-center gap-2 bg-gold px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-primary-foreground hover:bg-gold-warm"
            style={{ borderRadius: "12px" }}
          >
            Book now
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* OTHER SERVICES */}
      <section className="mx-auto max-w-[1500px] px-5 py-20 md:px-10 md:py-28">
        <p className="text-eyebrow mb-8">Other services</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {others.map((o) => (
            <Link
              key={o.slug}
              to="/services/$service"
              params={{ service: o.slug }}
              className="group image-reveal block overflow-hidden border border-border"
              style={{ borderRadius: "14px" }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={o.cover} alt={o.name} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-display text-xl text-primary md:text-2xl">{o.name}</p>
                  <p className="text-editorial text-sm text-primary/80">{o.tagline}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
