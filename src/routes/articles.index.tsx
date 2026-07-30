import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { articlesQuery, coverFor } from "@/lib/cms";
import { Container, PageHero } from "@/components/site/ui";

export const Route = createFileRoute("/articles/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(articlesQuery),
  head: () => ({
    meta: [
      { title: "Articles & Insights — Yomi Visuals" },
      { name: "description", content: "Essays on brand strategy, creative direction and production craft from the Yomi Visuals studio in Lagos." },
      { property: "og:title", content: "Articles & Insights — Yomi Visuals" },
      { property: "og:description", content: "Thinking on brand, content and production from Yomi Visuals." },
      { property: "og:url", content: "https://yomivisuals.lovable.app/articles" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/articles" }],
  }),
  component: ArticlesPage,
});

function ArticlesPage() {
  const { data: articles } = useSuspenseQuery(articlesQuery);
  return (
    <>
      <PageHero eyebrow="Journal" title="How we think about the work." body="Strategy, craft and the unglamorous parts of making good things." />
      <Container className="py-14 md:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((a, i) => (
            <Link key={a.id} to="/articles/$slug" params={{ slug: a.slug }} className="image-reveal group block overflow-hidden rounded-[14px] border border-border">
              <div className="aspect-[3/2] overflow-hidden">
                <img src={coverFor(a as any, i)} alt={a.title} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <p className="text-[12px] text-muted-foreground">{a.category}</p>
                <h2 className="mt-1.5 text-[16px] font-medium tracking-tight">{a.title}</h2>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
