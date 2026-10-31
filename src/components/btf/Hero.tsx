import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import { PICKS, getAsset } from "@/lib/film/portfolio";
import { Photo } from "./Photo";
import { useFilmScroll } from "@/hooks/use-film-scroll";

/** Prologue — Scene 00: The First Light. */
export function Hero() {
  const track = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const a = getAsset(PICKS.hero);

  // Pointer-following key light (desktop pointers only; harmless elsewhere).
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !light.current || !frame.current) return;
    const r = frame.current.getBoundingClientRect();
    light.current.style.setProperty("--lx", `${((e.clientX - r.left) / r.width) * 100}%`);
    light.current.style.setProperty("--ly", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  useFilmScroll((gsap) => {
    const f = frame.current!;
    const cover = () => Math.max(window.innerWidth / f.offsetWidth, window.innerHeight / f.offsetHeight) * 1.04;
    // Keep the face in view as the frame expands: shift the enlarged image down so its upper part fills the viewport.
    const lift = () => Math.max(0, (f.offsetHeight * cover() - window.innerHeight) / 2) * 0.72;
    const dx = () => window.innerWidth / 2 - (f.offsetLeft + f.offsetWidth / 2);
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: track.current, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
    });
    tl.to(f, { x: dx, y: lift, scale: cover }, 0)
      .to(".hero-mat", { opacity: 0 }, 0)
      .to(copy.current!, { opacity: 0, y: -80 }, 0.05)
      .to(".hero-light", { opacity: 0 }, 0.4);
  });

  return (
    <section ref={track} className="film-track film-track--hero bg-[var(--film-ink)] text-[var(--film-paper)]" aria-label="Beyond the Frame, opening">
      <div className="film-stage film-grain" onPointerMove={onMove}>
        <div className="hero-vignette" aria-hidden />
        <div className="hero-frame-wrap">
          <div ref={frame} className="hero-frame">
            <div className="hero-mat" aria-hidden />
            <Photo id={PICKS.hero} priority sizes="(min-width: 768px) 34vw, 70vw" className="hero-photo h-full w-full" style={{ aspectRatio: String(a.ratio) }} />
            <div ref={light} className="hero-light" aria-hidden />
          </div>
        </div>

        <div ref={copy} className="hero-copy film-pad">
          <p className="film-eyebrow film-eyebrow--gold">Yomi Visuals · An interactive cinematic universe</p>
          <h1 className="film-title mt-5 text-[clamp(2.6rem,9.2vw,8.5rem)]">
            Beyond
            <br />
            the frame.
          </h1>
          <p className="mt-6 font-serif text-[clamp(1.25rem,2.4vw,1.9rem)] italic text-[var(--film-paper)]/85">Art. Code. Imagination.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#act-1" className="film-btn film-btn--solid">Explore the universe</a>
            <Link to="/work" className="film-btn film-btn--line">View selected work</Link>
          </div>
        </div>
        <p className="hero-hint film-eyebrow only-motion" aria-hidden>Scroll</p>
      </div>
    </section>
  );
}
