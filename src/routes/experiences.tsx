import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

import portrait1 from "@/assets/portrait-1.jpg";
import wedding1 from "@/assets/wedding-1.jpg";
import fashion1 from "@/assets/fashion-1.jpg";
import brand1 from "@/assets/brand-1.jpg";
import family1 from "@/assets/family-1.jpg";
import maternity1 from "@/assets/maternity-1.jpg";

export const Route = createFileRoute("/experiences")({
  head: () => ({
    meta: [
      { title: "Experiences — Yomi Visuals" },
      {
        name: "description",
        content:
          "Portrait, wedding, fashion, brand, corporate and studio experiences. Reserve a session with Yomi Visuals.",
      },
      { property: "og:title", content: "Experiences — Yomi Visuals" },
      { property: "og:description", content: "Small, considered photography commissions." },
    ],
    links: [{ rel: "canonical", href: "/experiences" }],
  }),
  component: ExperiencesPage,
});

const experiences = [
  {
    id: "portrait",
    name: "Portrait Experience",
    tagline: "One person. One story.",
    from: "₦450,000",
    duration: "3 hours",
    image: portrait1,
    includes: ["Pre-session direction call", "One location or studio", "Wardrobe guidance", "40+ retouched frames", "Private online gallery"],
  },
  {
    id: "wedding",
    name: "Wedding Experience",
    tagline: "The day, as it truly felt.",
    from: "₦2,400,000",
    duration: "Full day",
    image: wedding1,
    includes: ["Two photographers", "Full ceremony & reception", "600+ retouched memories", "Museum-grade print box", "Private online gallery"],
  },
  {
    id: "fashion",
    name: "Fashion Experience",
    tagline: "Editorial with intention.",
    from: "On request",
    duration: "1–2 days",
    image: fashion1,
    includes: ["Creative direction", "Lighting team", "Retouching", "Licensing consultation"],
  },
  {
    id: "brand",
    name: "Brand Experience",
    tagline: "Product as still life.",
    from: "₦1,200,000",
    duration: "1 day",
    image: brand1,
    includes: ["Concept moodboard", "Studio + set design", "Product & lifestyle frames", "Web & print delivery"],
  },
  {
    id: "family",
    name: "Family Experience",
    tagline: "The gestures that stay.",
    from: "₦650,000",
    duration: "2 hours",
    image: family1,
    includes: ["Home or on-location", "Up to 6 people", "50 retouched memories", "Framed heirloom print"],
  },
  {
    id: "maternity",
    name: "Maternity Experience",
    tagline: "The first portrait.",
    from: "₦520,000",
    duration: "2 hours",
    image: maternity1,
    includes: ["Studio session", "Wardrobe collection", "35 retouched memories", "Print box option"],
  },
];

const faqs = [
  { q: "How far in advance should I book?", a: "We accept 2–4 commissions per month. Weddings should be reserved 3–9 months ahead; portraits 2–4 weeks." },
  { q: "Do you travel?", a: "Yes. We work regularly across Nigeria and take a small number of international commissions each year." },
  { q: "When will I receive my memories?", a: "Portrait experiences deliver in 10 days. Weddings deliver in 4 weeks. Editorial timelines are agreed upfront." },
  { q: "How does the deposit work?", a: "A 30% deposit reserves your date. The balance is due the day before the session." },
];

function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32">
      <section className="mx-auto max-w-[1400px] px-5 md:px-10">
        <p className="text-eyebrow mb-5">Experiences</p>
        <h1 className="text-display text-4xl leading-[1] text-primary md:text-7xl">
          Choose the memory <br />
          <span className="text-editorial text-gold-warm">you want to keep.</span>
        </h1>
        <p className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
          Each experience is a small, considered commission. Reserve with a 30% deposit;
          the balance is due the day before your session.
        </p>
      </section>

      <section className="mx-auto mt-16 max-w-[1400px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {experiences.map((e) => (
            <article
              key={e.id}
              className="group flex flex-col overflow-hidden border border-border bg-card transition-all duration-500 hover:border-gold/40"
              style={{ borderRadius: "16px" }}
            >
              <div className="image-reveal relative aspect-[16/10] overflow-hidden">
                <img src={e.image} alt={e.name} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-gold-warm">
                      From {e.from} · {e.duration}
                    </p>
                    <h2 className="mt-1 text-display text-2xl text-primary md:text-3xl">{e.name}</h2>
                    <p className="text-editorial text-sm text-primary/80">{e.tagline}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <p className="text-[10px] uppercase tracking-[0.22em] text-gold">What's included</p>
                <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                  {e.includes.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/book"
                  search={{ exp: e.id }}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 border border-border py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-primary transition-all duration-500 hover:border-gold hover:bg-gold hover:text-primary-foreground"
                  style={{ borderRadius: "12px" }}
                >
                  Reserve
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-32 max-w-[1000px] px-5 md:px-10 md:mt-40">
        <p className="text-eyebrow mb-6 text-center">Questions</p>
        <h2 className="text-center text-display text-3xl text-primary md:text-5xl">
          Everything you might <span className="text-editorial text-gold-warm">wonder.</span>
        </h2>
        <div className="mt-12 divide-y divide-border border-y border-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex cursor-pointer items-start justify-between gap-6 list-none">
                <h3 className="text-lg text-primary md:text-xl">{f.q}</h3>
                <span className="mt-1 text-gold transition-transform duration-500 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-24" />
      <SiteFooter />
    </div>
  );
}
