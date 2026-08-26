import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container, Reveal } from "@/components/site/ui";
import { focalStyle, type PortfolioImage } from "@/lib/portfolio";
import type { Project } from "@/lib/cms";
import { coverFor } from "@/lib/cms";

/* ——— Small shared parts ——— */

export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
      <span className="h-px w-6 bg-gold" aria-hidden="true" />
      {children}
    </p>
  );
}

export function SectionShell({
  index,
  kicker,
  children,
  className = "",
  id,
}: {
  index?: string;
  kicker?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`rule-top py-20 md:py-32 ${className}`}>
      <Container>
        {kicker || index ? (
          <div className="mb-10 flex items-center justify-between md:mb-14">
            {kicker ? <Kicker>{kicker}</Kicker> : <span />}
            {index ? <span className="text-index">{index}</span> : null}
          </div>
        ) : null}
        {children}
      </Container>
    </section>
  );
}

/* ——— Case study card ——— */

export function CaseStudyCard({
  project,
  index,
  capabilities,
  variant = "full",
}: {
  project: Project;
  index: number;
  capabilities?: string[];
  variant?: "full" | "offset";
}) {
  const caps = capabilities?.length ? capabilities : project.services;
  return (
    <Reveal>
      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        className={`group block ${variant === "offset" ? "md:mt-24" : ""}`}
      >
        <div className="image-reveal relative overflow-hidden bg-surface">
          <img
            src={coverFor(project)}
            alt={`${project.title} — ${project.industry ?? "campaign"} by Yomi Visuals`}
            loading={index < 2 ? "eager" : "lazy"}
            decoding="async"
            className="aspect-[3/4] w-full object-cover md:aspect-[4/5]"
          />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 hidden items-center gap-2 bg-gradient-to-t from-background/90 to-transparent p-6 text-[11px] uppercase tracking-[0.18em] text-foreground opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:flex">
            View case study
            <ArrowRight className="h-3.5 w-3.5 text-gold" />
          </span>
        </div>

        <div className="mt-5 flex items-start justify-between gap-6 border-t border-border pt-5">
          <div className="min-w-0">
            <span className="text-index">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="text-headline mt-2 text-[clamp(1.7rem,6vw,2.6rem)]">{project.title}</h3>
            <p className="mt-2 text-[13px] text-muted-foreground">{project.industry}</p>
            {caps.length ? (
              <p className="mt-4 text-[12px] leading-relaxed text-subtle">{caps.join("  ·  ")}</p>
            ) : null}
          </div>
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
        </div>
      </Link>
    </Reveal>
  );
}

/* ——— Capabilities ——— */

export const CAPABILITIES = [
  {
    index: "01",
    title: "We Think.",
    items: ["Creative strategy", "Campaign concepts", "Creative direction", "Campaign development"],
  },
  {
    index: "02",
    title: "We Make.",
    items: ["Commercials", "Brand films", "Photography", "Content production", "Production management"],
  },
  { index: "03", title: "We Finish.", items: ["Editing", "Colour", "Motion", "Sound", "Finishing"] },
  {
    index: "04",
    title: "We Experience.",
    items: ["Brand activations", "Launches", "Cultural productions"],
    note: "Coming into focus / future capability",
  },
];

export function CapabilityBlocks() {
  return (
    <div className="rule-top">
      {CAPABILITIES.map((c, i) => (
        <Reveal key={c.title} delay={i * 60}>
          <div className="grid gap-5 border-b border-border py-10 md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-10 md:py-14">
            <span className="text-index">{c.index}</span>
            <div>
              <h3 className="text-headline text-[clamp(1.9rem,7vw,3.2rem)]">
                {c.title.replace(".", "")}
                <span className="text-gold">.</span>
              </h3>
              {c.note ? (
                <p className="mt-3 inline-block border border-gold/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-gold">
                  {c.note}
                </p>
              ) : null}
            </div>
            <ul className="space-y-2.5 md:pt-2">
              {c.items.map((it) => (
                <li key={it} className="text-[15px] leading-relaxed text-subtle">
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ——— Approach ——— */

const FLOW = ["Problem", "Idea", "Creative", "Production", "Finished work"];

export function ApproachBlock({ image }: { image?: PortfolioImage }) {
  return (
    <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:gap-20">
      <div>
        <h2 className="text-headline text-[clamp(2.2rem,9vw,4.6rem)]">
          We don't start
          <br />
          with a <span className="text-serif normal-case text-gold">camera.</span>
        </h2>
        <p className="text-serif mt-8 text-[clamp(1.4rem,5vw,2rem)] normal-case leading-[1.25] text-foreground">
          We start with the problem.
        </p>
        <div className="mt-8 max-w-xl space-y-4 text-[15px] leading-relaxed text-muted-foreground">
          <p>
            A brand doesn't always need another photograph or another video. Sometimes it needs a better idea.
            Sometimes it needs a campaign. Sometimes it simply needs better visual communication.
          </p>
          <p>Yomi Visuals works from the problem backwards.</p>
        </div>

        <ol className="mt-10 rule-top">
          {FLOW.map((step, i) => (
            <li key={step} className="flex items-baseline gap-5 border-b border-border py-4">
              <span className="text-index w-8">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[15px] uppercase tracking-[0.14em] text-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {image ? (
        <div className="image-reveal overflow-hidden bg-surface">
          <img
            src={image.url}
            srcSet={image.thumb_url ? `${image.thumb_url} 760w, ${image.url} 1600w` : undefined}
            sizes="(max-width: 768px) 100vw, 45vw"
            alt="Yomi Visuals production still from a campaign shoot in Lagos"
            loading="lazy"
            decoding="async"
            style={focalStyle(image)}
            className="h-full min-h-[380px] w-full object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}

/* ——— Sectors ——— */

export const SECTORS = [
  "Tech",
  "Fashion",
  "Beauty",
  "Hospitality",
  "Consumer",
  "Corporate",
  "Entertainment",
  "Culture",
  "Agencies",
];

export function SectorList() {
  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] md:gap-20">
      <h2 className="text-headline text-[clamp(2rem,8vw,4rem)]">
        Built for brands with
        <br />
        <span className="text-serif normal-case text-gold">something to say.</span>
      </h2>
      <ul className="rule-top">
        {SECTORS.map((s, i) => (
          <li
            key={s}
            className="flex items-baseline justify-between border-b border-border py-4 text-[clamp(1.1rem,4.4vw,1.5rem)] uppercase tracking-[0.06em] text-subtle transition-colors hover:text-foreground"
          >
            {s}
            <span className="text-index">{String(i + 1).padStart(2, "0")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ——— For agencies ——— */

export const AGENCY_CAPABILITIES = [
  "Commercial Production",
  "Film",
  "Photography",
  "Content",
  "Post Production",
];

export function AgencyPartnership({ image }: { image?: PortfolioImage }) {
  return (
    <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-20">
      {image ? (
        <div className="image-reveal order-last overflow-hidden bg-surface md:order-first">
          <img
            src={image.url}
            srcSet={image.thumb_url ? `${image.thumb_url} 760w, ${image.url} 1600w` : undefined}
            sizes="(max-width: 768px) 100vw, 45vw"
            alt="Yomi Visuals producing commercial work for an agency campaign"
            loading="lazy"
            decoding="async"
            style={focalStyle(image)}
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
      ) : null}
      <div>
        <h2 className="text-headline text-[clamp(2rem,8vw,3.6rem)]">
          Your agency has the idea.
          <br />
          <span className="text-serif normal-case text-gold">We can make it happen.</span>
        </h2>
        <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
          Yomi Visuals works with marketing, advertising, PR and digital agencies as a creative production partner —
          helping turn campaign ideas into exceptional visual work.
        </p>
        <ul className="mt-9 rule-top">
          {AGENCY_CAPABILITIES.map((c) => (
            <li key={c} className="border-b border-border py-3.5 text-[14px] uppercase tracking-[0.12em] text-subtle">
              {c}
            </li>
          ))}
        </ul>
        <Link
          to="/book"
          className="group mt-9 inline-flex items-center gap-3 border border-border-strong px-7 py-4.5 text-[12px] uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-surface"
        >
          Partner with YV
          <ArrowRight className="h-4 w-4 text-gold transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
