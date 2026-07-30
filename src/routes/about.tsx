import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { settingsQuery, industriesQuery, studioPortraitImage } from "@/lib/cms";
import { Container, PageHero, Section, SectionHeading, ButtonLink } from "@/components/site/ui";

export const Route = createFileRoute("/about")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(industriesQuery),
    ]);
  },
  head: () => ({
    meta: [
      { title: "About the Studio — Yomi Visuals" },
      { name: "description", content: "Yomi Visuals is a multidisciplinary creative agency in Lagos combining brand strategy, design, photography, film and content production." },
      { property: "og:title", content: "About the Studio — Yomi Visuals" },
      { property: "og:description", content: "Who we are, how we work and why the standard matters." },
      { property: "og:url", content: "https://yomivisuals.lovable.app/about" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const { data: industries } = useSuspenseQuery(industriesQuery);
  const process: { title: string; body: string }[] = settings.process?.steps ?? [];

  return (
    <>
      <PageHero eyebrow="The Studio" title="A creative agency built like a production house." body={settings.company?.description}>
        <ButtonLink to="/book">Book Consultation</ButtonLink>
      </PageHero>

      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="image-reveal overflow-hidden rounded-[14px] border border-border">
            <img src={studioPortraitImage} alt="Yomi Visuals studio" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="space-y-5 text-[16px] leading-relaxed text-subtle">
            <p>We started as a photography studio and grew into the thing our clients kept asking for: a team that could think the idea, make it, and roll it out without three agencies in between.</p>
            <p>Today we work across strategy, design, photography, film and always-on content — with production capacity in-house so the standard never depends on who is available that week.</p>
            <p>The result is work that looks considered, arrives on schedule, and does a job for the business.</p>
          </div>
        </div>
      </Container>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Approach" title="Five stages, no guesswork." />
        <div className="grid gap-px overflow-hidden rounded-[14px] border border-border bg-border md:grid-cols-5">
          {process.map((s, i) => (
            <div key={s.title} className="bg-background p-7">
              <span className="text-[12px] text-muted-foreground">0{i + 1}</span>
              <h3 className="mt-4 text-[16px] font-medium tracking-tight">{s.title}</h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Industries" title="Sectors we know well." />
        <div className="flex flex-wrap gap-2.5">
          {industries.map((i) => (
            <span key={i.id} className="rounded-full border border-border px-4 py-2 text-[13px] text-subtle">{i.name}</span>
          ))}
        </div>
      </Section>
    </>
  );
}
