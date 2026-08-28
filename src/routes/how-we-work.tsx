import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PROCESS_STAGES } from "@/lib/ecosystem";
import { Container, PageHero, Eyebrow } from "@/components/site/ui";

export const Route = createFileRoute("/how-we-work")({
  head: () => ({
    meta: [
      { title: "How We Work — Yomi Visuals Creative Production Company" },
      {
        name: "description",
        content:
          "Discover, Define, Concept, Produce, Create, Deliver, Scale — the seven-stage production process Yomi Visuals runs on every campaign.",
      },
      { property: "og:title", content: "How We Work — Yomi Visuals" },
      { property: "og:description", content: "A seven-stage process from brief to campaign delivery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/how-we-work" }],
  }),
  component: HowWeWorkPage,
});

function HowWeWorkPage() {
  const [active, setActive] = useState(0);

  return (
    <>
      <PageHero
        eyebrow="How We Work"
        title="Ideas first. Production second."
        body="Every project runs through the same seven stages. It keeps the intent of the idea intact from the first conversation to the final delivery."
      />

      <Container className="py-14 md:py-20">
        <div className="grid gap-px bg-border md:grid-cols-[minmax(0,1fr)_1.3fr]">
          <ul className="bg-background">
            {PROCESS_STAGES.map((s, i) => (
              <li key={s.code}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-current={active === i}
                  className={`flex w-full items-baseline gap-5 border-b border-border px-2 py-5 text-left transition-colors md:px-4 md:py-6 ${
                    active === i ? "bg-elevated" : "hover:bg-elevated/50"
                  }`}
                >
                  <span className={`text-index ${active === i ? "text-gold" : ""}`}>{s.code}</span>
                  <span
                    className={`text-headline text-[clamp(1.2rem,3.6vw,2rem)] transition-colors ${
                      active === i ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex flex-col justify-between bg-background p-7 md:p-12">
            <div>
              <Eyebrow>Stage {PROCESS_STAGES[active].code}</Eyebrow>
              <h2 className="text-display mt-5 text-[clamp(1.8rem,4.5vw,3rem)]">{PROCESS_STAGES[active].title}</h2>
              <p className="mt-5 max-w-lg text-[15.5px] leading-relaxed text-subtle">{PROCESS_STAGES[active].body}</p>
            </div>
            <div className="mt-10 flex gap-1.5">
              {PROCESS_STAGES.map((s, i) => (
                <span
                  key={s.code}
                  className={`h-px flex-1 transition-colors ${i <= active ? "bg-gold" : "bg-border"}`}
                  aria-hidden
                />
              ))}
            </div>
          </div>
        </div>
      </Container>

      <section className="border-t border-border py-16 md:py-24">
        <Container>
          <Eyebrow>Campaign workflow</Eyebrow>
          <h2 className="text-display mt-4 max-w-3xl text-[clamp(1.7rem,4.5vw,2.8rem)]">
            Come to us with a business problem, not a shopping list.
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            “I need a campaign for my new product” is enough to begin. We build the rest — strategy, concept, crew,
            production and rollout.
          </p>
          <ol className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {["Brief", "Strategy", "Concept", "Creative Direction", "Pre-Production", "Production", "Post-Production", "Delivery"].map(
              (step, i) => (
                <li key={step} className="bg-background px-5 py-7">
                  <span className="text-index">0{i + 1}</span>
                  <p className="mt-3 text-[14px] font-medium uppercase tracking-[0.1em]">{step}</p>
                </li>
              ),
            )}
          </ol>
          <Link
            to="/book"
            className="mt-12 inline-flex items-center gap-2 bg-primary px-7 py-4 text-[12px] uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            Submit a project brief
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Container>
      </section>
    </>
  );
}
