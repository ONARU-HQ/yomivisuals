import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getExperiment } from "@/content/lab";
import { PageHead, Main } from "@/components/btf/PageHead";
import { LayerLab } from "@/components/btf/LayerLab";
import { seo } from "@/lib/film/seo";

export const Route = createFileRoute("/lab/$slug")({
  loader: ({ params }) => { const e = getExperiment(params.slug); if (!e) throw notFound(); return e; },
  head: ({ loaderData: e }) => e ? seo({ title: `${e.title}, Lab ${e.n} | Yomi Visuals`, description: e.concept, path: `/lab/${e.slug}` }) : {},
  component: Detail,
});

function Detail() {
  const e = Route.useLoaderData();
  const rows: [string, string][] = [["The idea", e.idea], ["The problem", e.problem], ["The creative approach", e.creative], ["The engineering approach", e.engineering], ["The result", e.result], ["What it taught", e.learned]];
  return (
    <Main>
      <PageHead eyebrow={`Experiment ${e.n} · ${e.status}`} title={e.title}>{e.concept}<span className="mt-4 block text-[12px] uppercase tracking-[0.18em] text-[var(--film-muted)]">{e.tech}</span></PageHead>
      {e.slug === "layers" ? <section aria-label="Interactive demonstration"><LayerLab standalone /></section> : (
        <section className="film-pad pb-6"><div className="mx-auto max-w-[1400px] border border-white/10 p-8">
          <p className="text-[15px]">This experiment runs on the homepage as the gallery scene.</p>
          <Link to="/" hash="act-3" className="film-btn film-btn--solid mt-5">Walk the gallery</Link>
        </div></section>
      )}
      <section className="film-pad mx-auto max-w-[1100px] py-16">
        <dl className="divide-y divide-white/10 border-y border-white/10">
          {rows.map(([k, v]) => (
            <div key={k} className="grid gap-3 py-7 md:grid-cols-[240px_1fr]"><dt className="film-eyebrow film-eyebrow--gold">{k}</dt><dd className="text-[16px] leading-relaxed text-[var(--film-paper)]/88">{v}</dd></div>
          ))}
        </dl>
        <Link to="/lab" className="film-btn film-btn--line mt-10">← All experiments</Link>
      </section>
    </Main>
  );
}
