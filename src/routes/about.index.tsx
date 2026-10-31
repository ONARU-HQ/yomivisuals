import { createFileRoute, Link } from "@tanstack/react-router";
import { BIO, STUDIO_URL } from "@/content/site";
import { PICKS } from "@/lib/film/portfolio";
import { Photo } from "@/components/btf/Photo";
import { PageHead, Main } from "@/components/btf/PageHead";
import { seo } from "@/lib/film/seo";

export const Route = createFileRoute("/about/")({
  head: () => seo({ title: "About Yomi Onalaru | Yomi Visuals", description: "Yomi Onalaru is a photographer, creative director and builder exploring where art and technology meet.", path: "/about", image: "/portfolio/yv-portraits-053-1600.webp" }),
  component: About,
});

const CHAPTERS = [
  { n: "01", name: "Origins", img: "weddings-005", text: ["Yomi Onalaru is the creative behind Yomi Visuals, working across photography, creative direction and building.", BIO.degree + "."] },
  { n: "02", name: "The Art", img: "yv-portraits-004", text: ["Photography, filmmaking and visual storytelling are the foundation: light, composition and emotion, one frame at a time.", "Commercial photography and video work lives at YV Studios Africa."] },
  { n: "03", name: "The Builder", img: "brands-021", text: ["Building businesses and creative projects has meant thinking in systems as well as images: how things are made, booked, delivered and kept running."] },
  { n: "04", name: "The Evolution", img: "studio-work-045", text: ["Software development returned through experimentation and AI-assisted building, practical, hands-on and still learning.", "The Lab is where that experimentation is shown honestly, including what is unfinished."] },
  { n: "05", name: "The Future", img: "lifestyle-004", text: ["The ambition is to build meaningful creative and technological experiences, and to keep photography at the centre of them."] },
] as const;

function About() {
  return (
    <Main>
      <PageHead eyebrow="The creator" title="A short visual documentary.">
        Five chapters. Facts only: nothing here is dressed up.
      </PageHead>
      {CHAPTERS.map((c, i) => (
        <section key={c.n} className="film-pad border-t border-black/10 py-16 md:py-28" aria-labelledby={`ch-${c.n}`}>
          <div className={`mx-auto grid max-w-[1400px] items-center gap-10 md:grid-cols-2 md:gap-20 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <Photo id={c.img} sizes="(min-width:768px) 40vw, 90vw" className="mx-auto w-full max-w-[460px]" />
            <div>
              <p className="text-index">CHAPTER {c.n}</p>
              <h2 id={`ch-${c.n}`} className="film-title mt-4 text-[clamp(2rem,4.6vw,4.4rem)]">{c.name}</h2>
              <div className="mt-6 max-w-lg space-y-4 text-[16px] leading-relaxed text-[var(--film-paper)]/85">{c.text.map((t) => <p key={t}>{t}</p>)}</div>
            </div>
          </div>
        </section>
      ))}
      <section className="film-pad border-t border-black/10 py-20 text-center">
        <p className="mx-auto max-w-xl mx-mono text-3xl">Photography and studio bookings are handled at YV Studios Africa.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={STUDIO_URL} target="_blank" rel="noopener noreferrer" className="film-btn film-btn--solid">YV Studios Africa ↗</a>
          <Link to="/collaborate" className="film-btn film-btn--line">Collaborate</Link>
        </div>
      </section>
    </Main>
  );
}

// PICKS referenced to keep curation in one place if About imagery is changed.
void PICKS;
