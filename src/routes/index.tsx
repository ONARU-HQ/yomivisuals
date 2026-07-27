import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Instagram, Play } from "lucide-react";

import heroWedding from "@/assets/hero-wedding.jpg";
import portrait1 from "@/assets/portrait-1.jpg";
import wedding1 from "@/assets/wedding-1.jpg";
import fashion1 from "@/assets/fashion-1.jpg";
import maternity1 from "@/assets/maternity-1.jpg";
import family1 from "@/assets/family-1.jpg";
import aboutPortrait from "@/assets/about-portrait.jpg";
import brand1 from "@/assets/brand-1.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const navLinks = [
  { label: "Portfolio", href: "#portfolio" },
  { label: "Experiences", href: "#experiences" },
  { label: "Studio", href: "#studio" },
  { label: "Journal", href: "#journal" },
];

const collections = [
  { title: "Weddings", count: "48 memories", image: wedding1 },
  { title: "Portraits", count: "112 memories", image: portrait1 },
  { title: "Fashion", count: "31 memories", image: fashion1 },
  { title: "Maternity", count: "24 memories", image: maternity1 },
  { title: "Family", count: "67 memories", image: family1 },
  { title: "Brands", count: "19 memories", image: brand1 },
];

const timeline = [
  {
    year: "2025",
    client: "Adaeze & Tolu",
    location: "Lekki, Lagos",
    title: "A vow written in golden light",
    image: wedding1,
    story:
      "A private ceremony at sunset, held above the water. We photographed the silence between them — the moment before the promise.",
  },
  {
    year: "2025",
    client: "Amara",
    location: "Studio, Ikoyi",
    title: "The portrait she will hand to her daughter",
    image: portrait1,
    story:
      "A single sitting. One light. Three hours. A portrait she will pass down long after the shoot is forgotten.",
  },
  {
    year: "2024",
    client: "House of Alára",
    location: "Victoria Island",
    title: "A campaign carved from shadow",
    image: fashion1,
    story:
      "An editorial for the SS25 collection. We built the story around a single sculptural silhouette and let the fabric speak.",
  },
  {
    year: "2024",
    client: "The Okonkwo Family",
    location: "Ibadan",
    title: "Small hands, held forever",
    image: family1,
    story:
      "A quiet Sunday morning. We photographed the smallest gestures — the ones that will one day mean everything.",
  },
];

const experiences = [
  {
    name: "Portrait Experience",
    tagline: "One person. One story.",
    detail:
      "A private sitting in the studio or on location. Directed, styled, and preserved on medium format.",
    from: "from ₦450,000",
    image: portrait1,
  },
  {
    name: "Wedding Experience",
    tagline: "The day, as it truly felt.",
    detail:
      "Documentary and editorial coverage of your ceremony, delivered as a museum-grade memory collection.",
    from: "from ₦2.4M",
    image: wedding1,
  },
  {
    name: "Fashion Experience",
    tagline: "Editorial with intention.",
    detail:
      "Campaign and lookbook photography for designers who treat their collections as art.",
    from: "on request",
    image: fashion1,
  },
  {
    name: "Brand Experience",
    tagline: "Product as still life.",
    detail:
      "Considered brand imagery for houses that refuse to look like anyone else.",
    from: "from ₦1.2M",
    image: brand1,
  },
];

const testimonials = [
  {
    quote:
      "We didn't hire a photographer. We hired someone to remember our wedding for us. Every image feels like it always existed.",
    author: "Adaeze & Tolu",
    role: "Wedding, 2025",
  },
  {
    quote:
      "Yomi doesn't take pictures. He listens, and then he composes something you didn't know was inside you.",
    author: "Amara O.",
    role: "Portrait, 2025",
  },
  {
    quote:
      "The most restrained, most powerful campaign work we've commissioned. It looks like it belongs in a museum.",
    author: "House of Alára",
    role: "SS25 Campaign",
  },
];

const journal = [
  {
    tag: "Behind the scenes",
    title: "Why we still shoot on medium format film",
    date: "March 2025",
    image: aboutPortrait,
  },
  {
    tag: "Wedding stories",
    title: "Adaeze & Tolu — a golden hour we will never repeat",
    date: "February 2025",
    image: wedding1,
  },
  {
    tag: "Philosophy",
    title: "On the difference between a photo and a memory",
    date: "January 2025",
    image: portrait1,
  },
];

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroOffset, setHeroOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHeroOffset(Math.min(y * 0.35, 260));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Floating navigation */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-nav py-3" : "py-6"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-10">
          <a href="#top" className="flex items-center gap-2">
            <span className="text-display text-lg tracking-tight text-primary md:text-xl">
              Yomi<span className="text-gold">.</span>Visuals
            </span>
          </a>
          <nav className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="link-underline text-[13px] font-medium tracking-wide text-primary/85 hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="#book"
            className="group inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-gold-warm transition-all duration-500 hover:bg-gold hover:text-primary-foreground"
          >
            Book Session
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" ref={heroRef} className="relative h-[100svh] w-full overflow-hidden">
        <div
          className="absolute inset-0 drift"
          style={{ transform: `translateY(${heroOffset}px) scale(1.08)` }}
        >
          <img
            src={heroWedding}
            alt="A bride standing in cathedral light"
            className="h-full w-full object-cover"
            width={1920}
            height={1280}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
        <div className="absolute inset-0 bg-background/25" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-24 md:px-10 md:pb-32">
          <div className="max-w-4xl fade-up">
            <p className="text-eyebrow mb-8 flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              Yomi Visuals — Est. Lagos
            </p>
            <h1 className="text-display text-[13vw] leading-[0.95] text-primary md:text-[7.5vw] lg:text-[6.2vw]">
              Some moments <br />
              <span className="text-editorial text-gold-warm">deserve</span> to
              live forever.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              We create timeless imagery that lets you relive life's most
              meaningful moments — again, and again, and again.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <a
                href="#book"
                className="group inline-flex items-center gap-3 bg-primary px-8 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-primary-foreground transition-all duration-500 hover:bg-gold-warm"
              >
                Book your experience
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#portfolio"
                className="group inline-flex items-center gap-3 border border-border px-8 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-primary transition-all duration-500 hover:border-gold hover:text-gold-warm"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Explore stories
              </a>
            </div>
          </div>

          <div className="mt-20 flex flex-wrap items-end justify-between gap-6 border-t border-border/60 pt-8">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              Lagos, Nigeria · Available worldwide
            </p>
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              Scroll to enter
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="relative py-32 md:py-48">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:grid-cols-12 md:px-10">
          <div className="md:col-span-5">
            <p className="text-eyebrow mb-8">01 — The Philosophy</p>
            <h2 className="text-display text-4xl leading-[1.02] text-primary md:text-6xl">
              We preserve <br />
              <span className="text-editorial text-gold-warm">what time</span>{" "}
              cannot.
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-editorial text-2xl leading-relaxed text-primary/90 md:text-3xl">
              Photography isn't about cameras. It isn't about editing, or
              megapixels, or filters.
            </p>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              It's about remembering. The first smile. The wedding. The
              proposal. The pregnancy. The success. The portrait that lives
              forever on a wall long after we're gone.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              We approach every session as a memory in the making — cinematic,
              considered, and quietly permanent. Nothing is staged. Everything
              is composed.
            </p>
            <div className="divider-gold mt-12 w-32" />
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="relative border-y border-border py-32 md:py-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="mb-20 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-eyebrow mb-6">02 — The Exhibition</p>
              <h2 className="text-display text-4xl leading-[1.02] text-primary md:text-6xl">
                A curated <br />
                <span className="text-editorial text-gold-warm">collection</span>{" "}
                of memories.
              </h2>
            </div>
            <a
              href="#"
              className="link-underline text-[12px] uppercase tracking-[0.22em] text-muted-foreground hover:text-primary"
            >
              View full archive →
            </a>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {collections.map((c, i) => (
              <a
                key={c.title}
                href="#"
                className={`group relative block image-reveal hover-lift ${
                  i === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden ${
                    i === 0 ? "aspect-[4/5] md:aspect-[6/7]" : "aspect-[4/5]"
                  }`}
                  style={{ borderRadius: "14px" }}
                >
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:p-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-gold-warm">
                        Collection
                      </p>
                      <h3 className="mt-2 text-display text-2xl text-primary md:text-3xl">
                        {c.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {c.count}
                      </p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-primary/70 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold-warm" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative py-32 md:py-48">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="mb-20">
            <p className="text-eyebrow mb-6">03 — The Timeline</p>
            <h2 className="text-display text-4xl leading-[1.02] text-primary md:text-6xl">
              Every project <br />
              <span className="text-editorial text-gold-warm">becomes</span> a
              story.
            </h2>
          </div>

          <div className="space-y-24 md:space-y-32">
            {timeline.map((t, i) => (
              <article
                key={t.title}
                className={`grid gap-10 md:grid-cols-12 md:gap-16 ${
                  i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="md:col-span-7 image-reveal">
                  <div
                    className="relative aspect-[4/3] overflow-hidden"
                    style={{ borderRadius: "14px" }}
                  >
                    <img
                      src={t.image}
                      alt={t.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center md:col-span-5">
                  <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.26em] text-gold">
                    <span>{t.year}</span>
                    <span className="h-px w-8 bg-gold/40" />
                    <span className="text-muted-foreground">{t.location}</span>
                  </div>
                  <h3 className="mt-6 text-display text-3xl leading-[1.05] text-primary md:text-5xl">
                    {t.title}
                  </h3>
                  <p className="mt-6 text-editorial text-lg text-primary/80">
                    — {t.client}
                  </p>
                  <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                    {t.story}
                  </p>
                  <a
                    href="#"
                    className="link-underline mt-8 inline-flex w-fit items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-primary hover:text-gold-warm"
                  >
                    Read the full memory →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences */}
      <section id="experiences" className="relative border-y border-border bg-surface py-32 md:py-48">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="mb-20 max-w-3xl">
            <p className="text-eyebrow mb-6">04 — The Experiences</p>
            <h2 className="text-display text-4xl leading-[1.02] text-primary md:text-6xl">
              Not services. <br />
              <span className="text-editorial text-gold-warm">Experiences.</span>
            </h2>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground">
              Every commission is shaped around the memory you want to keep.
              Each one is small, considered, and reserved months in advance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {experiences.map((e) => (
              <article
                key={e.name}
                className="group relative overflow-hidden border border-border bg-card transition-all duration-700 hover:border-gold/40"
                style={{ borderRadius: "16px" }}
              >
                <div className="grid grid-cols-5 gap-0">
                  <div className="col-span-2 image-reveal">
                    <div className="relative aspect-[3/4] h-full w-full overflow-hidden">
                      <img
                        src={e.image}
                        alt={e.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="col-span-3 flex flex-col justify-between p-8 md:p-10">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.26em] text-gold">
                        {e.from}
                      </p>
                      <h3 className="mt-4 text-display text-2xl text-primary md:text-3xl">
                        {e.name}
                      </h3>
                      <p className="mt-3 text-editorial text-base text-primary/80">
                        {e.tagline}
                      </p>
                      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                        {e.detail}
                      </p>
                    </div>
                    <a
                      href="#book"
                      className="link-underline mt-8 inline-flex w-fit items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-primary group-hover:text-gold-warm"
                    >
                      Reserve →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-32 md:py-48">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <p className="text-eyebrow mb-16 text-center">05 — In Their Words</p>
          <div className="space-y-24">
            {testimonials.map((t, i) => (
              <blockquote
                key={i}
                className={`max-w-3xl ${
                  i % 2 === 0 ? "" : "ml-auto text-right"
                }`}
              >
                <p className="text-editorial text-3xl leading-[1.25] text-primary md:text-5xl">
                  "{t.quote}"
                </p>
                <footer className="mt-8 flex items-center gap-4 text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                  <span className="text-gold">— {t.author}</span>
                  <span className="h-px w-8 bg-border" />
                  <span>{t.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Studio */}
      <section id="studio" className="relative border-y border-border py-32 md:py-48">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:grid-cols-12 md:px-10">
          <div className="md:col-span-5 image-reveal">
            <div
              className="relative aspect-[3/4] overflow-hidden"
              style={{ borderRadius: "16px" }}
            >
              <img
                src={aboutPortrait}
                alt="The photographer behind Yomi Visuals"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center md:col-span-6 md:col-start-7">
            <p className="text-eyebrow mb-6">06 — The Studio</p>
            <h2 className="text-display text-4xl leading-[1.02] text-primary md:text-6xl">
              A quiet room <br />
              for <span className="text-editorial text-gold-warm">loud</span>{" "}
              memories.
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              Yomi Visuals is a small studio based in Lagos, Nigeria. We work
              with a limited number of families, couples and houses each year —
              because a memory that matters deserves undivided attention.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              We shoot on medium format, we edit slowly, and we print on paper
              that will outlive us. Nothing about how we work is accidental.
            </p>
            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-border pt-10">
              <div>
                <p className="text-display text-4xl text-primary">08</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Years preserving
                </p>
              </div>
              <div>
                <p className="text-display text-4xl text-primary">240+</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Memories archived
                </p>
              </div>
              <div>
                <p className="text-display text-4xl text-primary">4</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Continents visited
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journal */}
      <section id="journal" className="relative py-32 md:py-48">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-eyebrow mb-6">07 — The Journal</p>
              <h2 className="text-display text-4xl leading-[1.02] text-primary md:text-6xl">
                Notes from <br />
                <span className="text-editorial text-gold-warm">the</span> studio.
              </h2>
            </div>
            <a
              href="#"
              className="link-underline text-[12px] uppercase tracking-[0.22em] text-muted-foreground hover:text-primary"
            >
              Read all entries →
            </a>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {journal.map((j) => (
              <a key={j.title} href="#" className="group block image-reveal">
                <div
                  className="relative aspect-[4/5] overflow-hidden"
                  style={{ borderRadius: "14px" }}
                >
                  <img
                    src={j.image}
                    alt={j.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.26em] text-gold">
                  <span>{j.tag}</span>
                  <span className="h-px w-6 bg-gold/40" />
                  <span className="text-muted-foreground">{j.date}</span>
                </div>
                <h3 className="mt-3 text-display text-2xl leading-tight text-primary transition-colors duration-500 group-hover:text-gold-warm md:text-[26px]">
                  {j.title}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="book" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={maternity1}
            alt=""
            aria-hidden
            loading="lazy"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        </div>
        <div className="relative mx-auto max-w-[1100px] px-6 py-32 text-center md:px-10 md:py-48">
          <p className="text-eyebrow mb-8">08 — Reserve Your Session</p>
          <h2 className="text-display text-5xl leading-[0.98] text-primary md:text-7xl">
            When you are <br />
            <span className="text-editorial text-gold-warm">ready</span> to
            remember.
          </h2>
          <p className="mx-auto mt-10 max-w-xl text-lg text-muted-foreground">
            We accept a limited number of commissions each season. Tell us your
            story and we will personally reply within 48 hours.
          </p>

          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full border border-border bg-card/60 px-6 py-4 text-sm text-primary placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
              style={{ borderRadius: "12px" }}
            />
            <a
              href="mailto:hello@yomivisuals.com"
              className="inline-flex items-center justify-center gap-2 bg-primary px-8 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-primary-foreground transition-all duration-500 hover:bg-gold-warm"
              style={{ borderRadius: "12px" }}
            >
              Begin the conversation
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
            <a
              href="https://instagram.com/yomi.visuals"
              className="link-underline inline-flex items-center gap-2 hover:text-primary"
            >
              <Instagram className="h-3.5 w-3.5" />
              @yomi.visuals
            </a>
            <span className="h-px w-8 bg-border" />
            <a
              href="https://tiktok.com/@yomi.visuals"
              className="link-underline hover:text-primary"
            >
              TikTok · @yomi.visuals
            </a>
            <span className="h-px w-8 bg-border" />
            <a
              href="mailto:hello@yomivisuals.com"
              className="link-underline hover:text-primary"
            >
              hello@yomivisuals.com
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-24">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-6">
              <p className="text-display text-5xl leading-[0.95] text-primary md:text-7xl">
                Yomi<span className="text-gold">.</span>Visuals
              </p>
              <p className="text-editorial mt-6 text-xl text-primary/80 md:text-2xl">
                Preserving memories that last forever.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:col-span-6 md:grid-cols-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.26em] text-gold">
                  Studio
                </p>
                <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                  <li><a href="#studio" className="link-underline hover:text-primary">About</a></li>
                  <li><a href="#journal" className="link-underline hover:text-primary">Journal</a></li>
                  <li><a href="#book" className="link-underline hover:text-primary">Contact</a></li>
                </ul>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.26em] text-gold">
                  Experiences
                </p>
                <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                  <li><a href="#experiences" className="link-underline hover:text-primary">Portraits</a></li>
                  <li><a href="#experiences" className="link-underline hover:text-primary">Weddings</a></li>
                  <li><a href="#experiences" className="link-underline hover:text-primary">Fashion</a></li>
                  <li><a href="#experiences" className="link-underline hover:text-primary">Brands</a></li>
                </ul>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.26em] text-gold">
                  Follow
                </p>
                <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                  <li><a href="https://instagram.com/yomi.visuals" className="link-underline hover:text-primary">Instagram</a></li>
                  <li><a href="https://tiktok.com/@yomi.visuals" className="link-underline hover:text-primary">TikTok</a></li>
                  <li><a href="mailto:hello@yomivisuals.com" className="link-underline hover:text-primary">Email</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <p>© {new Date().getFullYear()} Yomi Visuals — Lagos, Nigeria</p>
            <p>Available worldwide · By appointment</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
