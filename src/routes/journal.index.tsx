import { createFileRoute, Link } from "@tanstack/react-router";
import { ENTRIES, THEMES } from "@/content/journal";
import { INSTAGRAM_URL } from "@/content/site";
import { PageHead, Main } from "@/components/btf/PageHead";
import { seo } from "@/lib/film/seo";

export const Route = createFileRoute("/journal/")({
  head: () => seo({ title: "The Process | Yomi Visuals Journal", description: "A journal on creative thinking, projects and technical learning by Yomi Onalaru.", path: "/journal" }),
  component: Journal,
});

function Journal() {
  return (
    <Main>
      <PageHead eyebrow="The process" title="Journal">
        Notes on visual storytelling, creative direction and building things with code. Written by Yomi, published only when it is ready.
      </PageHead>
      <section className="film-pad mx-auto max-w-[1300px] pb-24">
        {ENTRIES.length ? (
          <ul className="grid gap-10 md:grid-cols-2">
            {ENTRIES.map((e) => (
              <li key={e.slug}><Link to="/journal/$slug" params={{ slug: e.slug }} className="group block border-t border-white/15 pt-5">
                <p className="film-eyebrow">{e.category} · {e.date}</p>
                <h2 className="mt-3 font-serif text-3xl italic group-hover:text-[var(--film-gold)]">{e.title}</h2>
                <p className="mt-3 text-[15px] text-[var(--film-muted)]">{e.excerpt}</p>
              </Link></li>
            ))}
          </ul>
        ) : (
          <div className="border border-white/10 p-8 md:p-12">
            <p className="font-serif text-[clamp(1.6rem,3.4vw,2.6rem)] italic">The first entries are being written.</p>
            <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-[var(--film-muted)]">Nothing is published here until Yomi has written it. In the meantime, the work and the experiments speak for themselves.</p>
            <p className="film-eyebrow mt-8">What the journal will cover</p>
            <ul className="mt-4 flex flex-wrap gap-2">{THEMES.map((t) => <li key={t} className="border border-white/15 px-3 py-2 text-[12px] uppercase tracking-[0.14em]">{t}</li>)}</ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link to="/lab" className="film-btn film-btn--solid">Visit the lab</Link>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="film-btn film-btn--line">Follow on Instagram ↗<span className="sr-only"> (opens in a new tab)</span></a>
            </div>
          </div>
        )}
      </section>
    </Main>
  );
}
