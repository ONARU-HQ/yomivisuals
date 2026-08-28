import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { articleQuery, coverFor } from "@/lib/cms";
import { Container, Eyebrow, ButtonLink } from "@/components/site/ui";

export const Route = createFileRoute("/articles/$slug")({
  loader: async ({ context, params }) => {
    const article = await context.queryClient.ensureQueryData(articleQuery(params.slug));
    if (!article) throw notFound();
    return { article };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Article unavailable — Yomi Visuals" }, { name: "robots", content: "noindex" }] };
    const a = loaderData.article;
    const title = a.seo_title || `${a.title} — Yomi Visuals`;
    const description = a.seo_description || a.excerpt || "An article from Yomi Visuals.";
    const url = `https://yomivisuals.lovable.app/articles/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: a.title, description, author: { "@type": "Organization", name: "Yomi Visuals" } }) }],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { data: article } = useSuspenseQuery(articleQuery(slug));
  if (!article) return null;
  const blocks = (article.content ?? "").split("\n\n");

  return (
    <article>
      <Container className="pt-32 pb-10 md:pt-44">
        <Eyebrow>{article.category}</Eyebrow>
        <h1 className="text-display mt-5 max-w-4xl text-[clamp(2.2rem,6vw,4.2rem)]">{article.title}</h1>
        <p className="mt-6 text-[13px] text-muted-foreground">
          {article.author} · {article.published_at ? new Date(article.published_at).toLocaleDateString() : ""}
        </p>
      </Container>
      <Container>
        <div className="overflow-hidden rounded-sm border border-border">
          <img src={coverFor(article as any)} alt={article.title} className="w-full object-cover" />
        </div>
      </Container>
      <Container className="py-14">
        <div className="mx-auto max-w-2xl space-y-6">
          {blocks.map((block, i) =>
            block.startsWith("## ") ? (
              <h2 key={i} className="text-display pt-4 text-[clamp(1.3rem,3vw,1.8rem)]">{block.replace("## ", "")}</h2>
            ) : (
              <p key={i} className="text-[16px] leading-[1.75] text-subtle">{block}</p>
            ),
          )}
          <div className="pt-6"><ButtonLink to="/start-a-project">Work with us</ButtonLink></div>
        </div>
      </Container>
    </article>
  );
}
