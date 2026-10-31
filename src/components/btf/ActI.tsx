import { useRef } from "react";
import { PICKS, getAsset } from "@/lib/film/portfolio";
import { Photo } from "./Photo";
import { useFilmScroll } from "@/hooks/use-film-scroll";

const ratio = (id: string) => String(getAsset(id).ratio);

/** Act I — Scene 01: The Art of Seeing. */
export function ActI() {
  const track = useRef<HTMLElement>(null);
  const [pa, pb, pc] = PICKS.act1;

  useFilmScroll((gsap) => {
    const tl = gsap.timeline({
      defaults: { ease: "power1.inOut" },
      scrollTrigger: { trigger: track.current, start: "top top", end: "bottom bottom", scrub: 0.7, invalidateOnRefresh: true },
    });
    gsap.set(".act1-a", { yPercent: 115 });
    gsap.set(".act1-b", { opacity: 0, y: "14svh", scale: 0.82 });
    gsap.set(".act1-c", { opacity: 0, scale: 0.9 });
    gsap.set(".act1-final", { opacity: 0, scale: 0.55 });
    gsap.set(".act1-copy", { opacity: 0, y: 30 });
    // 0–25%: portrait enters from below; the opening frame dissolves into the scene.
    tl.to(".act1-backdrop", { opacity: 0, duration: 0.25 }, 0)
      .to(".act1-a", { yPercent: 0, duration: 0.25 }, 0)
      .to(".act1-copy", { opacity: 1, y: 0, duration: 0.12 }, 0.14)
      // 25–50%: editorial composition, a second photograph at another depth.
      .to(".act1-a", { x: "-4vw", scale: 0.9, duration: 0.25 }, 0.25)
      .to(".act1-copy", { opacity: 0, duration: 0.06 }, 0.25)
      .to(".act1-b", { opacity: 1, y: 0, scale: 1, duration: 0.2 }, 0.31)
      // 50–75%: the camera tracks laterally across the arrangement.
      .to(".act1-group", { x: "-40vw", duration: 0.25 }, 0.5)
      .to(".act1-c", { opacity: 1, scale: 1, duration: 0.15 }, 0.52)
      // 75–100%: everything resolves into a single framed image: the next scene's entrance.
      .to([".act1-a", ".act1-b", ".act1-c"], { opacity: 0, scale: 0.92, duration: 0.2 }, 0.76)
      .to(".act1-final", { opacity: 1, scale: 1, duration: 0.24 }, 0.76);
  });

  return (
    <section id="act-1" ref={track} className="film-track film-track--act1 bg-[var(--film-ink)] text-[var(--film-paper)]" aria-labelledby="act1-title">
      <div className="film-stage act1-stage">
        <Photo id={PICKS.hero} alt="" className="act1-backdrop only-motion" sizes="100vw" imgClassName="opacity-70" style={{ position: "absolute", inset: 0, aspectRatio: "auto" }} />

        <div className="act1-copy film-pad">
          <p className="film-eyebrow film-eyebrow--gold">Act I · The frame</p>
          <h2 id="act1-title" className="film-title mt-4 text-[clamp(2rem,5vw,4.6rem)]">Every image begins with a vision.</h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--film-muted)]">
            A study of light, composition, emotion, and the stories that exist within a frame.
          </p>
        </div>

        <div className="act1-group">
          {[pa, pb, pc].map((id, i) => (
            <figure key={id} className={`act1-fig act1-${"abc"[i]}`} style={{ aspectRatio: ratio(id) }}>
              <Photo id={id} sizes="(min-width: 768px) 30vw, 80vw" className="h-full w-full" style={{ aspectRatio: "auto" }} />
            </figure>
          ))}
        </div>

        <figure className="act1-final only-motion" style={{ aspectRatio: ratio(PICKS.layers) }}>
          <Photo id={PICKS.layers} sizes="40vw" className="h-full w-full" style={{ aspectRatio: "auto" }} />
        </figure>
      </div>
    </section>
  );
}
