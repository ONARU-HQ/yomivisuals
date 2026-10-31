import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SETS, assetsInSet, getSet, src } from "@/lib/film/portfolio";
import { Photo } from "@/components/btf/Photo";
import { Main } from "@/components/btf/PageHead";
import { Lightbox } from "@/components/btf/Lightbox";
import { seo } from "@/lib/film/seo";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => { const set = getSet(params.slug); if (!set) throw notFound(); return set; },
  head: ({ loaderData: set }) => set
    ? seo({ title: `${set.name} | Yomi Visuals`, description: `${set.blurb} ${set.count} frames from the Yomi Visuals archive.`, path: `/work/${set.slug}`, image: src(set.cover, 1600) })
    : {},
  component: SetPage,
});

const PAGE = 24;

function SetPage() {
  const set = Route.useLoaderData();
  const all = assetsInSet(set.slug);
  const [shown, setShown] = useState(PAGE);
  const [light, setLight] = useState<number | null>(null);
  const visible = all.slice(0, shown);
  const idx = SETS.findIndex((s) => s.slug === set.slug);
  const next = SETS[(idx + 1) % SETS.length]!;
  const related = SETS.filter((s) => s.slug !== set.slug && s.slug !== next.slug).slice(0, 2);

  return (
    <Main>
      {/* 1. Cinematic hero */}
      <header className="relative flex min-h-[86svh] items-end overflow-hidden">
        <Photo id={set.cover} priority sizes="100vw" className="!absolute inset-0 h-full w-full" style={{ aspectRatio: "auto" }} imgClassName="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/35" aria-hidden />
        <div className="film-pad relative w-full pb-12 text-white md:pb-20">
          <p className="film-eyebrow !text-white/80">Set {String(idx + 1).padStart(2, "0")} of {String(SETS.length).padStart(2, "0")}</p>
          <h1 className="film-title mt-4 text-[clamp(2.6rem,9vw,9rem)]">{set.name}</h1>
        </div>
      </header>

      {/* 2 + 3. Introduction and project information */}
      <section className="film-pad mx-auto grid max-w-[1500px] gap-10 py-16 md:grid-cols-[2fr_1fr] md:py-24">
        <p className="mx-mono text-[clamp(1.5rem,3vw,2.4rem)] leading-snug">{set.blurb}</p>
        <dl className="space-y-5 text-[14px]">
          <div><dt className="film-eyebrow">Frames</dt><dd className="mt-1">{set.count}</dd></div>
          <div><dt className="film-eyebrow">Collection</dt><dd className="mt-1">{set.name} (original Pixieset set)</dd></div>
          <div><dt className="film-eyebrow">Photography</dt><dd className="mt-1">Yomi Visuals</dd></div>
        </dl>
      </section>

      {/* 4. Curated image sequence: alternating scale, never identical */}
      <section className="film-pad mx-auto max-w-[1500px] pb-16" aria-label={`${set.name} image sequence`}>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-5">
          {visible.map((a, i) => {
            const big = i % 7 === 0;
            const wide = a.ratio > 1.1;
            const span = big ? "md:col-span-7" : wide ? "md:col-span-6" : i % 3 === 1 ? "md:col-span-4" : "md:col-span-5";
            return (
              <li key={a.id} className={`${big ? "col-span-2" : ""} ${span} ${i % 2 ? "md:mt-16" : ""}`}>
                <button onClick={() => setLight(i)} className="group block w-full overflow-hidden" aria-label={`View frame ${i + 1} of ${all.length}`}>
                  <Photo id={a.id} sizes={big ? "(min-width:768px) 58vw, 100vw" : "(min-width:768px) 40vw, 50vw"} className="w-full transition-transform duration-[var(--m-editorial)] group-hover:scale-[1.02]" priority={i < 2} />
                </button>
              </li>
            );
          })}
        </ul>
        {shown < all.length ? <div className="mt-12 text-center"><button className="film-btn film-btn--line" onClick={() => setShown((n) => n + PAGE)}>Show more ({all.length - shown} remaining)</button></div> : null}
      </section>

      {/* 7. Related + 8. Next */}
      <section className="film-pad border-t border-black/10 py-16">
        <div className="mx-auto grid max-w-[1500px] gap-10 md:grid-cols-[1fr_1fr_1.4fr]">
          {related.map((s) => (
            <Link key={s.slug} to="/work/$slug" params={{ slug: s.slug }} className="group block">
              <p className="film-eyebrow">Related</p>
              <Photo id={s.cover} sizes="30vw" className="mt-3 w-full max-w-[260px]" />
              <p className="mt-3 mx-mono text-2xl group-hover:opacity-60">{s.name}</p>
            </Link>
          ))}
          <Link to="/work/$slug" params={{ slug: next.slug }} className="group block md:text-right">
            <p className="film-eyebrow film-eyebrow--gold">Next set</p>
            <p className="film-title mt-3 text-[clamp(2rem,5vw,4.4rem)] group-hover:opacity-60">{next.name} →</p>
          </Link>
        </div>
      </section>
      <Lightbox ids={visible.map((a) => a.id)} index={light} onClose={() => setLight(null)} onIndex={setLight} />
    </Main>
  );
}
