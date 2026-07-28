import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

import heroWedding from "@/assets/hero-wedding.jpg";
import portrait1 from "@/assets/portrait-1.jpg";
import wedding1 from "@/assets/wedding-1.jpg";
import fashion1 from "@/assets/fashion-1.jpg";
import brand1 from "@/assets/brand-1.jpg";
import family1 from "@/assets/family-1.jpg";
import commercial1 from "@/assets/commercial-1.jpg";
import corporate1 from "@/assets/corporate-1.jpg";
import event1 from "@/assets/event-1.jpg";
import architecture1 from "@/assets/architecture-1.jpg";
import lifestyle1 from "@/assets/lifestyle-1.jpg";
import editorial1 from "@/assets/editorial-1.jpg";
import aboutPortrait from "@/assets/about-portrait.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yomi Visuals — Creative Agency, Photography & Film" },
      {
        name: "description",
        content:
          "Yomi Visuals is a Lagos-based creative agency for photography, film, content and campaigns. We build visual worlds for the brands and people who refuse to look like anyone else.",
      },
      { property: "og:title", content: "Yomi Visuals — Creative Agency, Photography & Film" },
      { property: "og:description", content: "Lagos-based creative agency for photography, film, content and campaigns." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://yomivisuals.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Yomi Visuals",
          image: "https://yomivisuals.lovable.app/og.jpg",
          "@id": "https://yomivisuals.lovable.app/",
          url: "https://yomivisuals.lovable.app/",
          telephone: "+234",
          address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
          priceRange: "₦₦₦",
          description: "Creative agency for photography, film, content and campaigns.",
        }),
      },
    ],
  }),
  component: Home,
});

const rotators = ["Photography", "Film", "Content", "Campaigns"];

// Collage — asymmetric grid
const collage = [
  { src: heroWedding, alt: "Wedding cathedral light", h: "h-52 md:h-72" },
  { src: portrait1, alt: "Studio portrait", h: "h-40 md:h-56" },
  { src: fashion1, alt: "Fashion editorial", h: "h-64 md:h-96" },
  { src: architecture1, alt: "Architecture at dusk", h: "h-40 md:h-56" },
  { src: commercial1, alt: "Commercial still life", h: "h-52 md:h-72" },
  { src: event1, alt: "Event ballroom", h: "h-44 md:h-60" },
  { src: lifestyle1, alt: "Lifestyle rooftop", h: "h-56 md:h-80" },
  { src: editorial1, alt: "Editorial fashion", h: "h-64 md:h-96" },
];

const featuredWork = [
  { cat: "Wedding · 2025", title: "Adaeze & Tolu", image: wedding1, href: "/portfolio/weddings" },
  { cat: "Fashion · 2024", title: "House of Alára SS25", image: fashion1, href: "/portfolio/fashion" },
  { cat: "Commercial · 2025", title: "Lumière Noire", image: commercial1, href: "/portfolio/commercial" },
  { cat: "Portrait · 2025", title: "Amara — a portrait", image: portrait1, href: "/portfolio/portraits" },
];

const clientLogos = [
  "House of Alára",
  "Maison Éclat",
  "Lumière",
  "Aso Villa",
  "Radisson",
  "Ariké",
  "Bank of the Republic",
  "Muri & Muri",
];

const services = [
  { name: "Photography", detail: "Studio, portrait, editorial.", image: portrait1, href: "/services/portrait" },
  { name: "Video Production", detail: "Films, campaigns, docs.", image: wedding1, href: "/services/wedding" },
  { name: "Creative Direction", detail: "Concept & art direction.", image: editorial1, href: "/services/fashion" },
  { name: "Brand Campaigns", detail: "End-to-end campaigns.", image: fashion1, href: "/services/commercial" },
  { name: "Commercial", detail: "Product, brand, launches.", image: commercial1, href: "/services/commercial" },
  { name: "Events", detail: "Galas, weddings, launches.", image: event1, href: "/services/events" },
];

const pillars = [
  { n: "01", title: "Calm luxury", body: "We remove noise. Every frame we deliver has been considered twice." },
  { n: "02", title: "Cinematic hand", body: "We approach every commission as a short film. Story first, camera second." },
  { n: "03", title: "Studio, end-to-end", body: "Creative direction, production, post — one house, one accountable team." },
];

const testimonials = [
  { q: "We didn't hire a photographer. We hired someone to remember our wedding for us.", a: "Adaeze & Tolu — Wedding, 2025" },
  { q: "The most restrained, most powerful campaign work we've commissioned.", a: "House of Alára — SS25 Campaign" },
  { q: "Every frame feels like it belongs in a museum.", a: "Maison Éclat — Brand" },
];

const recent = [
  { image: aboutPortrait, cat: "Portraits", title: "The craftsman", href: "/portfolio/portraits" },
  { image: brand1, cat: "Products", title: "Objects, still", href: "/portfolio/products" },
  { image: corporate1, cat: "Corporate", title: "The face of the firm", href: "/portfolio/corporate" },
  { image: family1, cat: "Lifestyle", title: "Small gestures", href: "/portfolio/lifestyle" },
];

function Home() {
  const [rot, setRot] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setRot((r) => (r + 1) % rotators.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO — collage */}
      <section className="relative overflow-hidden pt-24 md:pt-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="grid grid-cols-12 items-center gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-6">
              <p className="text-eyebrow mb-6 flex items-center gap-3">
                <span className="h-px w-10 bg-gold" />
                Yomi Visuals · Creative Agency
              </p>
              <h1 className="text-display text-[13vw] leading-[0.92] text-primary md:text-[6.5vw]">
                Enter the <br />
                <span className="text-editorial text-gold-warm">world</span> of{" "}
                <span className="relative inline-block h-[1em] overflow-hidden align-baseline">
                  <span
                    className="block transition-transform duration-700"
                    style={{ transform: `translateY(-${rot * 100}%)` }}
                  >
                    {rotators.map((w) => (
                      <span key={w} className="block leading-[0.92]">
                        {w}.
                      </span>
                    ))}
                  </span>
                </span>
              </h1>
              <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                A Lagos-based creative agency for photography, film, content and
                brand campaigns. We build visual worlds for the brands and people
                who refuse to look like anyone else.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  to="/book"
                  className="group inline-flex items-center gap-3 bg-primary px-7 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-primary-foreground transition-all duration-500 hover:bg-gold-warm"
                  style={{ borderRadius: "12px" }}
                >
                  Book a Session
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/portfolio"
                  className="group inline-flex items-center gap-3 border border-border px-7 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-primary transition-all duration-500 hover:border-gold hover:text-gold-warm"
                  style={{ borderRadius: "12px" }}
                >
                  Explore Portfolio
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Collage grid */}
            <div className="col-span-12 md:col-span-6">
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {collage.map((img, i) => (
                  <div
                    key={i}
                    className={`image-reveal relative overflow-hidden ${img.h} ${
                      i % 3 === 1 ? "translate-y-4 md:translate-y-8" : ""
                    } ${i % 3 === 2 ? "-translate-y-2 md:-translate-y-4" : ""}`}
                    style={{ borderRadius: "10px" }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading={i < 3 ? "eager" : "lazy"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-[10px] uppercase tracking-[0.26em] text-muted-foreground md:mt-24">
            <p>Lagos, Nigeria · Available worldwide</p>
            <p>Est. 2019 · By appointment</p>
          </div>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="py-24 md:py-40">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-eyebrow mb-4">01 — Featured Work</p>
              <h2 className="text-display text-4xl leading-[1.02] text-primary md:text-6xl">
                Recent <span className="text-editorial text-gold-warm">campaigns</span>.
              </h2>
            </div>
            <Link to="/portfolio" className="link-underline text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-primary">
              View all work →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {featuredWork.map((w, i) => (
              <Link
                key={w.title}
                to={w.href}
                className={`group image-reveal hover-lift block ${i === 0 ? "md:col-span-2" : ""}`}
              >
                <div
                  className={`relative overflow-hidden ${i === 0 ? "aspect-[16/9]" : "aspect-[4/5]"}`}
                  style={{ borderRadius: "14px" }}
                >
                  <img src={w.image} alt={w.title} loading="lazy" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:p-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.26em] text-gold-warm">{w.cat}</p>
                      <h3 className="mt-2 text-display text-2xl text-primary md:text-4xl">{w.title}</h3>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-primary/70 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold-warm" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="border-y border-border bg-surface py-14 md:py-20">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <p className="text-eyebrow mb-8 text-center">Trusted by</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 md:gap-x-16">
            {clientLogos.map((n) => (
              <span key={n} className="text-display text-xl text-muted-foreground/60 md:text-3xl">
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 md:py-40">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="mb-14 max-w-2xl">
            <p className="text-eyebrow mb-4">02 — Agency Services</p>
            <h2 className="text-display text-4xl leading-[1.02] text-primary md:text-6xl">
              One studio. <span className="text-editorial text-gold-warm">Every discipline.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {services.map((s) => (
              <Link
                key={s.name}
                to={s.href}
                className="group image-reveal block overflow-hidden border border-border bg-card transition-colors hover:border-gold/40"
                style={{ borderRadius: "14px" }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={s.image} alt={s.name} loading="lazy" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                </div>
                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-display text-lg text-primary">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.detail}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-warm" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="border-y border-border bg-surface py-24 md:py-40">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="mb-14 max-w-2xl">
            <p className="text-eyebrow mb-4">03 — Why Yomi Visuals</p>
            <h2 className="text-display text-4xl leading-[1.02] text-primary md:text-6xl">
              We don't sell photos. <br />
              <span className="text-editorial text-gold-warm">We preserve memories.</span>
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3 md:gap-12">
            {pillars.map((p) => (
              <div key={p.n} className="border-t border-border pt-8">
                <p className="text-eyebrow">{p.n}</p>
                <h3 className="mt-4 text-display text-2xl text-primary md:text-3xl">{p.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 md:py-40">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10">
          <p className="text-eyebrow mb-10 text-center">04 — In their words</p>
          <div className="space-y-16 md:space-y-24">
            {testimonials.map((t, i) => (
              <blockquote key={i} className="text-center">
                <p className="text-editorial text-2xl leading-[1.3] text-primary md:text-4xl">"{t.q}"</p>
                <footer className="mt-6 text-[11px] uppercase tracking-[0.28em] text-gold">— {t.a}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT PROJECTS */}
      <section className="border-t border-border py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-eyebrow mb-4">05 — Recent Projects</p>
              <h2 className="text-display text-3xl text-primary md:text-5xl">From the studio.</h2>
            </div>
            <Link to="/portfolio" className="link-underline text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-primary">
              Full archive →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {recent.map((r) => (
              <Link key={r.title} to={r.href} className="group image-reveal block">
                <div className="relative aspect-[4/5] overflow-hidden" style={{ borderRadius: "12px" }}>
                  <img src={r.image} alt={r.title} loading="lazy" className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/80 to-transparent p-4">
                    <p className="text-[9px] uppercase tracking-[0.22em] text-gold-warm">{r.cat}</p>
                    <p className="text-display text-sm text-primary md:text-lg">{r.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BOOK BAND */}
      <section className="relative overflow-hidden border-t border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="text-eyebrow mb-6">Book</p>
              <h2 className="text-display text-4xl leading-[1] text-primary md:text-7xl">
                Ready when <br />
                <span className="text-editorial text-gold-warm">you are.</span>
              </h2>
              <p className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
                Reserve a session in nine calm steps. A 30% deposit holds your date.
              </p>
            </div>
            <div className="md:col-span-4 md:justify-self-end">
              <Link
                to="/book"
                className="group inline-flex items-center gap-3 bg-gold px-8 py-5 text-[12px] font-medium uppercase tracking-[0.22em] text-primary-foreground transition-all duration-500 hover:bg-gold-warm"
                style={{ borderRadius: "14px" }}
              >
                Start booking
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
