import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ASSETS, SETS, altFor, src, srcSet } from "@/lib/film/portfolio";
import { PageHead, Main } from "@/components/btf/PageHead";
import { Lightbox } from "@/components/btf/Lightbox";
import { seo } from "@/lib/film/seo";

export const Route = createFileRoute("/work/")({
  head: () => seo({ title: "The Archive | Yomi Visuals", description: "Photography by Yomi Visuals: portraits, weddings, brand work, studio sessions, aso-ebi looks and lifestyle.", path: "/work", image: "/portfolio/studio-work-045-1600.webp" }),
  component: Archive,
});

const PAGE = 36;

function Archive() {
  const [set, setSet] = useState<string>("all");
  const [shown, setShown] = useState(PAGE);
  const [light, setLight] = useState<number | null>(null);
  const list = useMemo(() => (set === "all" ? ASSETS : ASSETS.filter((a) => a.set === set)), [set]);
  const visible = list.slice(0, shown);
  const ids = visible.map((a) => a.id);

  return (
    <Main>
      <PageHead eyebrow="The archive" title="Work">
        Every frame sits in its original Pixieset set. Filter by set, open a frame to see the whole image, or step into a set for the full sequence.
      </PageHead>
      <div className="film-pad sticky top-16 z-20 border-y border-black/10 bg-[#f4f4f4]/90 py-3 backdrop-blur">
        <div role="group" aria-label="Filter by set" className="mx-auto flex max-w-[1500px] gap-2 overflow-x-auto">
          {[{ slug: "all", name: "All", count: ASSETS.length }, ...SETS].map((s) => (
            <button key={s.slug} aria-pressed={set === s.slug} onClick={() => { setSet(s.slug); setShown(PAGE); }}
              className={`min-h-[44px] shrink-0 border px-4 text-[11.5px] uppercase tracking-[0.16em] transition-colors ${set === s.slug ? "border-[var(--film-gold)] bg-[var(--film-gold)] text-[var(--film-ink)]" : "border-black/20 hover:border-[var(--film-gold)]"}`}>
              {s.name} <span className="opacity-60">{s.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="film-pad mx-auto max-w-[1600px] py-10">
        <p className="mb-6 text-[12px] text-[var(--film-muted)]" aria-live="polite">Showing {visible.length} of {list.length} frames{set !== "all" ? <> · <Link to="/work/$slug" params={{ slug: set }} className="underline hover:opacity-60">Open the full set</Link></> : null}</p>
        <ul className="columns-2 gap-3 md:columns-3 md:gap-4 xl:columns-4">
          {visible.map((a, i) => (
            <li key={a.id} className="mb-3 break-inside-avoid md:mb-4">
              <button onClick={() => setLight(i)} className="group relative block w-full overflow-hidden text-left" style={{ aspectRatio: String(a.ratio), backgroundImage: `url(${a.blur})`, backgroundSize: "cover" }} aria-label={`Open ${altFor(a)}`}>
                <img src={src(a.id, 800)} srcSet={srcSet(a.id)} sizes="(min-width:1280px) 24vw, (min-width:768px) 32vw, 48vw" width={a.w} height={a.h} alt={altFor(a)} loading={i < 8 ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover transition-transform duration-[var(--m-editorial)] ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03]" />
              </button>
            </li>
          ))}
        </ul>
        {shown < list.length ? <div className="mt-10 text-center"><button onClick={() => setShown((n) => n + PAGE)} className="film-btn film-btn--line">Load more frames</button></div> : null}
      </div>
      <Lightbox ids={ids} index={light} onClose={() => setLight(null)} onIndex={setLight} />
    </Main>
  );
}
