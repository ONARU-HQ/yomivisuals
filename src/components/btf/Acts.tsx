import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { BIO, STUDIO_URL } from "@/content/site";
import { PICKS } from "@/lib/film/portfolio";
import { useFilmScroll } from "@/hooks/use-film-scroll";
import { Photo } from "./Photo";
import { ParticleField } from "./ParticleField";

/** Act IV — Scene 04: The Creator. */
export function Creator() {
  const sec = useRef<HTMLElement>(null);
  useFilmScroll((gsap) => {
    gsap.fromTo(".win", { clipPath: "inset(26% 22% 26% 22%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: sec.current, start: "top 85%", end: "top 20%", scrub: 0.6 } });
    gsap.from(".bio-line", { opacity: 0, y: 24, stagger: 0.18, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".bio-list", start: "top 75%" } });
  });
  return (
    <section ref={sec} className="relative bg-[var(--film-ink)] py-24 text-[var(--film-paper)] md:py-36" aria-labelledby="act4-title">
      <div className="film-pad mx-auto grid max-w-[1500px] items-center gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-20">
        <div className="win mx-auto w-full max-w-[520px]">
          <Photo id={PICKS.creator} sizes="(min-width:768px) 40vw, 90vw" className="w-full" alt="Black and white studio portrait from the Yomi Visuals archive" />
          <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[var(--film-muted)]">From the archive</p>
        </div>
        <div>
          <p className="film-eyebrow film-eyebrow--gold">Act IV · The mind</p>
          <h2 id="act4-title" className="film-title mt-4 text-[clamp(2.2rem,5.6vw,5.4rem)]">Behind the frame.</h2>
          <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-[var(--film-paper)]/85">
            Yomi Onalaru is the photographer and creative director behind Yomi Visuals, working at the meeting point of image-making, business and software.
          </p>
          <ol className="bio-list mt-9 space-y-0 border-t border-white/10">
            <li className="bio-line grid grid-cols-[84px_1fr] gap-4 border-b border-white/10 py-4 text-[14.5px]"><span className="text-index">2021</span><span>{BIO.degree}</span></li>
            {BIO.lines.map((l, i) => (
              <li key={l} className="bio-line grid grid-cols-[84px_1fr] gap-4 border-b border-white/10 py-4 text-[14.5px]"><span className="text-index">{["Craft", "Build", "Now", "Next"][i]}</span><span>{l}</span></li>
            ))}
          </ol>
          <Link to="/about" className="film-btn film-btn--solid mt-10">Discover my story</Link>
        </div>
      </div>
    </section>
  );
}

/** Act V — Scene 05: The Creative Laboratory. */
export function LabAct() {
  return (
    <section className="relative overflow-hidden bg-[var(--film-ink)] text-[var(--film-paper)]" aria-labelledby="act5-title">
      <ParticleField className="absolute inset-0 h-full w-full" />
      <div className="film-pad relative mx-auto max-w-[1500px] py-28 md:py-44">
        <p className="film-eyebrow film-eyebrow--gold">Act V · The unknown</p>
        <h2 id="act5-title" className="film-title mt-4 max-w-4xl text-[clamp(2.2rem,6vw,5.8rem)]">What exists beyond the frame?</h2>
        <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-[var(--film-paper)]/80">
          An evolving laboratory for creative coding, interactive experiences, digital experiments, and emerging ideas.
        </p>
        <ul className="mt-12 grid max-w-3xl gap-px bg-white/15 md:grid-cols-2">
          {[
            { to: "layers", n: "001", t: "Layers", d: "Pull a photograph apart into composition, light, colour and atmosphere." },
            { to: "gallery-walk", n: "002", t: "Gallery walk", d: "The archive as a 3D room, driven by scroll." },
          ].map((x) => (
            <li key={x.n} className="bg-[#090909]/90">
              <Link to="/lab/$slug" params={{ slug: x.to }} className="block p-6 transition-colors hover:bg-[var(--film-ink-2)]">
                <span className="text-index">EXPERIMENT {x.n} · WORKING PROTOTYPE</span>
                <span className="mt-3 block font-serif text-3xl italic">{x.t}</span>
                <span className="mt-2 block text-[13.5px] text-[var(--film-muted)]">{x.d}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/lab" className="film-btn film-btn--solid mt-10">Enter the lab</Link>
      </div>
    </section>
  );
}

/** Act VI — Scene 06: Creativity Meets Purpose. */
export function Connection() {
  const sec = useRef<HTMLElement>(null);
  useFilmScroll((gsap) => {
    gsap.fromTo(sec.current, { backgroundColor: "#090909" }, { backgroundColor: "#2a2016", ease: "none", scrollTrigger: { trigger: sec.current, start: "top 80%", end: "center center", scrub: true } });
    gsap.from(".reveal-line > span", { yPercent: 110, duration: 1.1, stagger: 0.14, ease: "power3.out", scrollTrigger: { trigger: sec.current, start: "top 55%" } });
  });
  return (
    <section ref={sec} className="bg-[#1f1811] py-32 text-[var(--film-paper)] md:py-48" aria-labelledby="act6-title">
      <div className="film-pad mx-auto max-w-[1300px] text-center">
        <p className="film-eyebrow film-eyebrow--gold">Act VI · The connection</p>
        <h2 id="act6-title" className="film-title mx-auto mt-6 text-[clamp(2.4rem,7vw,7rem)]">
          <span className="reveal-line block overflow-hidden"><span className="block">Great ideas</span></span>
          <span className="reveal-line block overflow-hidden"><span className="block">deserve to exist.</span></span>
        </h2>
        <p className="mx-auto mt-8 max-w-lg text-[16px] leading-relaxed text-[var(--film-paper)]/80">
          An invitation to explore new ideas, meaningful collaborations, and experiences worth creating.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/collaborate" className="film-btn film-btn--solid">Collaborate</Link>
          <a href={STUDIO_URL} target="_blank" rel="noopener noreferrer" className="film-btn film-btn--line">Explore YV Studios ↗<span className="sr-only"> (opens in a new tab)</span></a>
        </div>
      </div>
    </section>
  );
}

/** Epilogue — Scene 07: The Final Frame. */
export function Finale() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % PICKS.finale.length), 3400);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="bg-[var(--film-ink)] py-24 text-[var(--film-paper)] md:py-36" aria-labelledby="act7-title">
      <div className="film-pad mx-auto grid max-w-[1400px] items-center gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="relative mx-auto aspect-[2/3] w-full max-w-[440px] border border-white/15 p-2.5">
          <div className="relative h-full w-full overflow-hidden">
            {PICKS.finale.map((id, k) => (
              <div key={id} className="absolute inset-0 transition-opacity duration-[1100ms]" style={{ opacity: k === i ? 1 : 0 }} aria-hidden={k !== i}>
                <Photo id={id} sizes="(min-width:768px) 36vw, 90vw" className="h-full w-full" style={{ aspectRatio: "auto" }} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="film-eyebrow film-eyebrow--gold">Epilogue · The invitation</p>
          <h2 id="act7-title" className="film-title mt-4 text-[clamp(2.2rem,5.6vw,5.4rem)]">The next frame is yet to be created.</h2>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/work" className="film-btn film-btn--solid">Explore work</Link>
            <Link to="/lab" className="film-btn film-btn--line">Enter the lab</Link>
            <Link to="/contact" className="film-btn film-btn--line">Get in touch</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
