import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { testimonialsQuery } from "@/lib/cms";
import { Container, PageHero } from "@/components/site/ui";

export const Route = createFileRoute("/testimonials")({
  loader: ({ context }) => context.queryClient.ensureQueryData(testimonialsQuery),
  head: () => ({
    meta: [
      { title: "Client Testimonials — Yomi Visuals" },
      { name: "description", content: "What marketing directors, founders and brand leads say about working with Yomi Visuals in Lagos." },
      { property: "og:title", content: "Client Testimonials — Yomi Visuals" },
      { property: "og:description", content: "Client feedback on Yomi Visuals creative work." },
      { property: "og:url", content: "https://yomivisuals.lovable.app/testimonials" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/testimonials" }],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const { data: items } = useSuspenseQuery(testimonialsQuery);
  return (
    <>
      <PageHero eyebrow="Clients" title="In their words." />
      <Container className="py-14 md:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((t) => (
            <figure key={t.id} className="panel p-8">
              <blockquote className="text-[17px] leading-relaxed tracking-tight">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-7 text-[12.5px] text-muted-foreground">{t.name} — {t.role}, {t.company}</figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </>
  );
}
