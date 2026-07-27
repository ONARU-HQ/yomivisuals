import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

import aboutPortrait from "@/assets/about-portrait.jpg";
import portrait1 from "@/assets/portrait-1.jpg";
import wedding1 from "@/assets/wedding-1.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Yomi Visuals" },
      {
        name: "description",
        content:
          "A quiet studio in Lagos preserving the memories that matter. Learn about the philosophy behind Yomi Visuals.",
      },
      { property: "og:title", content: "About — Yomi Visuals" },
      {
        property: "og:description",
        content: "The philosophy behind Yomi Visuals.",
      },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32">
      <section className="mx-auto grid max-w-[1400px] gap-12 px-5 md:grid-cols-12 md:gap-16 md:px-10">
        <div className="md:col-span-7">
          <p className="text-eyebrow mb-6">The Studio</p>
          <h1 className="text-display text-4xl leading-[1] text-primary md:text-7xl">
            We don't sell <br />
            photographs. <br />
            <span className="text-editorial text-gold-warm">We preserve memories.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Yomi Visuals is a small studio in Lagos, Nigeria. We work with a limited
            number of families, couples and houses each year — because a memory that
            matters deserves undivided attention.
          </p>
        </div>
        <div className="md:col-span-5">
          <div
            className="image-reveal relative aspect-[3/4] overflow-hidden"
            style={{ borderRadius: "16px" }}
          >
            <img
              src={aboutPortrait}
              alt="The photographer behind Yomi Visuals"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[1000px] px-5 md:mt-40 md:px-10">
        <div className="divider-gold mb-16 mx-auto w-24" />
        <div className="space-y-8 text-lg leading-relaxed text-muted-foreground md:text-xl">
          <p className="text-editorial text-2xl text-primary md:text-3xl">
            We shoot on medium format. We edit slowly. We print on paper that will outlive us.
          </p>
          <p>
            Every commission begins with a conversation — never a questionnaire. We want to
            understand what this memory is for, who will hold it, and where it will live.
            The camera comes later. Sometimes much later.
          </p>
          <p>
            Nothing about how we work is accidental. From the sitting to the frame on your wall,
            every choice is a decision to keep something rather than let it pass.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto mt-24 max-w-[1200px] px-5 md:mt-32 md:px-10">
        <div className="grid grid-cols-3 gap-6 border-y border-border py-12 text-center">
          <Stat n="08" label="Years preserving" />
          <Stat n="240+" label="Memories archived" />
          <Stat n="04" label="Continents visited" />
        </div>
      </section>

      {/* Two images */}
      <section className="mx-auto mt-24 grid max-w-[1400px] gap-6 px-5 md:mt-32 md:grid-cols-2 md:px-10">
        <div className="image-reveal aspect-[3/4] overflow-hidden" style={{ borderRadius: "16px" }}>
          <img src={portrait1} alt="Portrait" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="image-reveal aspect-[3/4] overflow-hidden" style={{ borderRadius: "16px" }}>
          <img src={wedding1} alt="Wedding" loading="lazy" className="h-full w-full object-cover" />
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[900px] px-5 pb-16 text-center md:mt-32 md:px-10">
        <h2 className="text-display text-3xl leading-[1] text-primary md:text-6xl">
          Let's create something <span className="text-editorial text-gold-warm">worth keeping.</span>
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/book"
            className="inline-flex items-center gap-2 bg-primary px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-primary-foreground hover:bg-gold-warm transition-colors"
          >
            Book a session <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 border border-border px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-primary hover:border-gold"
          >
            Start a conversation
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <p className="text-display text-3xl text-primary md:text-5xl">{n}</p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
