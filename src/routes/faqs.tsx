import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { faqsQuery } from "@/lib/cms";
import { Container, PageHero, ButtonLink } from "@/components/site/ui";

export const Route = createFileRoute("/faqs")({
  loader: ({ context }) => context.queryClient.ensureQueryData(faqsQuery),
  head: () => ({
    meta: [
      { title: "FAQs — Yomi Visuals Creative Agency" },
      { name: "description", content: "Budgets, timelines, process and studio questions answered by Yomi Visuals, a creative agency in Lagos." },
      { property: "og:title", content: "FAQs — Yomi Visuals" },
      { property: "og:description", content: "Common questions about working with Yomi Visuals." },
      { property: "og:url", content: "https://yomivisuals.lovable.app/faqs" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/faqs" }],
  }),
  component: FaqsPage,
});

function FaqsPage() {
  const { data: faqs } = useSuspenseQuery(faqsQuery);
  return (
    <>
      <PageHero eyebrow="FAQs" title="The questions we get asked most." />
      <Container className="py-14 md:py-20">
        <div className="divide-y divide-border border-y border-border">
          {faqs.map((f) => (
            <details key={f.id} className="py-6">
              <summary className="cursor-pointer list-none text-[16px] font-medium tracking-tight">{f.question}</summary>
              <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">{f.answer}</p>
            </details>
          ))}
        </div>
        <div className="mt-12"><ButtonLink to="/contact">Still have a question?</ButtonLink></div>
      </Container>
    </>
  );
}
