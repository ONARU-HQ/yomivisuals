import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { studioPortraitImage } from "@/lib/cms";
import { Container, PageHero, Eyebrow, ButtonLink } from "@/components/site/ui";

export const Route = createFileRoute("/about/founder")({
  head: () => ({
    meta: [
      { title: "Yomi Onalaru — Founder & Creative Producer | Yomi Visuals" },
      {
        name: "description",
        content:
          "Yomi Onalaru founded Yomi Visuals to build a creative production company: leading creative vision, developing ideas and assembling the teams that execute them.",
      },
      { property: "og:title", content: "Yomi Onalaru — Founder & Creative Producer" },
      {
        property: "og:description",
        content: "The vision, philosophy and leadership behind Yomi Visuals.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "https://yomivisuals.lovable.app/about/founder" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/about/founder" }],
  }),
  component: FounderPage,
});

const SECTIONS = [
  {
    label: "Vision",
    body: "Yomi Visuals exists to make ideas real — to give African brands work that can stand next to anything made anywhere. That means building a company, not a personal service. The vision is a production house whose standard holds whoever is on set.",
  },
  {
    label: "Creative Philosophy",
    body: "The idea comes first. A beautiful frame that says nothing is a waste of a budget. Every production starts with a question about the brand, and the visual language answers it.",
  },
  {
    label: "Leadership",
    body: "Yomi leads the creative vision across the ecosystem — setting the direction, approving the work, and holding the quality line from concept through delivery.",
  },
  {
    label: "Approach To Production",
    body: "Teams are assembled per project from the YV Creators Network: the right director, photographer, stylist and post team for that specific brief, coordinated by YV Production.",
  },
  {
    label: "Role Within YV",
    body: "Founder and Creative Producer. Yomi develops ideas, builds production teams and oversees execution — the company delivers the work.",
  },
];

function FounderPage() {
  return (
    <>
      <PageHero
        eyebrow="Founder"
        title="Yomi Onalaru"
        body="Founder & Creative Producer, Yomi Visuals."
      />

      <Container className="pb-6">
        <figure className="overflow-hidden border border-border">
          <img
            src={studioPortraitImage}
            alt="Yomi Onalaru, Founder and Creative Producer of Yomi Visuals"
            className="aspect-[4/5] w-full object-cover md:aspect-[16/9]"
          />
        </figure>
      </Container>

      <Container className="py-10 md:py-16">
        <div className="divide-y divide-border border-y border-border">
          {SECTIONS.map((s) => (
            <section key={s.label} className="grid gap-4 py-8 md:grid-cols-[1fr_1.9fr] md:gap-16 md:py-12">
              <h2 className="text-eyebrow md:pt-2">{s.label}</h2>
              <p className="text-[15.5px] leading-relaxed text-subtle">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-14 border border-border p-8 md:p-12">
          <Eyebrow>The point</Eyebrow>
          <p className="text-display mt-4 max-w-3xl text-[clamp(1.5rem,4.5vw,2.6rem)] leading-[1.1]">
            You don't book Yomi. You work with Yomi Visuals.
          </p>
          <p className="mt-5 max-w-xl text-[14.5px] text-muted-foreground">
            The company is built so the work continues at the same standard whichever team is on the production.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/start-a-project">Start a project</ButtonLink>
            <Link
              to="/about"
              className="tap inline-flex items-center justify-center gap-2 border border-border-strong px-6 py-3.5 text-[12px] uppercase tracking-[0.16em]"
            >
              About YV
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
