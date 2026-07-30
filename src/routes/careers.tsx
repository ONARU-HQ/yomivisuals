import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { careersQuery } from "@/lib/cms";
import { Container, PageHero } from "@/components/site/ui";

export const Route = createFileRoute("/careers")({
  loader: ({ context }) => context.queryClient.ensureQueryData(careersQuery),
  head: () => ({
    meta: [
      { title: "Careers — Yomi Visuals" },
      { name: "description", content: "Open roles at Yomi Visuals, a creative agency in Lagos. Art direction, production and post-production positions." },
      { property: "og:title", content: "Careers — Yomi Visuals" },
      { property: "og:description", content: "Join the Yomi Visuals studio in Lagos." },
      { property: "og:url", content: "https://yomivisuals.lovable.app/careers" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/careers" }],
  }),
  component: CareersPage,
});

function CareersPage() {
  const { data: roles } = useSuspenseQuery(careersQuery);
  return (
    <>
      <PageHero eyebrow="Careers" title="Come make things that outlive the brief." body="We hire for taste, rigour and the ability to finish." />
      <Container className="py-14 md:py-20">
        <div className="divide-y divide-border border-y border-border">
          {roles.map((r) => (
            <details key={r.id} className="group py-7">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                <span className="text-display text-[clamp(1.2rem,3vw,1.8rem)]">{r.title}</span>
                <span className="text-[12.5px] text-muted-foreground">{r.department} · {r.location} · {r.employment_type}</span>
              </summary>
              <div className="mt-4 max-w-2xl space-y-3 text-[14px] leading-relaxed text-muted-foreground">
                <p>{r.description}</p>
                <p>{r.requirements}</p>
                <a href="mailto:hello@yomivisuals.com" className="link-underline inline-block text-foreground">Apply by email</a>
              </div>
            </details>
          ))}
        </div>
      </Container>
    </>
  );
}
