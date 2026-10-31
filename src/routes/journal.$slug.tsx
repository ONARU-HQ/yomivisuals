import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ENTRIES } from "@/content/journal";
import { PageHead, Main } from "@/components/btf/PageHead";
import { seo } from "@/lib/film/seo";

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => { const e = ENTRIES.find((x) => x.slug === params.slug); if (!e) throw notFound(); return e; },
  head: ({ loaderData: e }) => e ? seo({ title: `${e.title} | Yomi Visuals Journal`, description: e.excerpt, path: `/journal/${e.slug}`, type: "article" }) : {},
  component: Article,
});

function Article() {
  const e = Route.useLoaderData();
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => setP(Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)));
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <Main>
      <div className="fixed inset-x-0 top-16 z-40 h-0.5 bg-black/10" role="progressbar" aria-label="Reading progress" aria-valuenow={Math.round(p * 100)} aria-valuemin={0} aria-valuemax={100}><div className="h-full origin-left bg-[var(--film-gold)]" style={{ transform: `scaleX(${p})` }} /></div>
      <PageHead eyebrow={`${e.category} · ${e.date}`} title={e.title} />
      <article className="film-pad mx-auto max-w-[720px] space-y-6 pb-24 text-[18px] leading-[1.75] text-[var(--film-paper)]/90">{e.body.map((t, i) => <p key={i}>{t}</p>)}<Link to="/journal" className="film-btn film-btn--line">← Journal</Link></article>
    </Main>
  );
}
