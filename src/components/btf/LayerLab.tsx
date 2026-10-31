import { useRef, useState } from "react";
import { PICKS, getAsset } from "@/lib/film/portfolio";
import { Photo } from "./Photo";
import { useFilmScroll } from "@/hooks/use-film-scroll";

/** Sampled from the photograph itself (studio-work-045), not invented. */
const PALETTE = ["#350304", "#5a0405", "#840e09", "#5a302a", "#2d2525", "#0e0202"];

const LAYERS = [
  {
    key: "composition",
    label: "Composition",
    text: "Where the eye lands first and where it travels next. Placing the subject on a third and leaving the dark to breathe is what turns a pose into a picture.",
  },
  {
    key: "light",
    label: "Light",
    text: "One hard source from above carves the figure out of the dark. Light decides what is revealed and what is withheld, and so decides the mood.",
  },
  {
    key: "colour",
    label: "Colour",
    text: "A narrow palette (deep reds, near-black, a trace of warm skin) keeps the image singular. Colour here is restraint, not variety.",
  },
  {
    key: "atmosphere",
    label: "Atmosphere",
    text: "Depth falloff, haze and grain make a flat file feel like a place you could stand in. It is the quiet layer that carries the feeling.",
  },
] as const;

type Key = (typeof LAYERS)[number]["key"];

/** Act II — Scene 02: Beyond the Photograph. Isolated feature (also Lab experiment 001). */
export function LayerLab({ standalone = false }: { standalone?: boolean }) {
  const track = useRef<HTMLElement>(null);
  const [active, setActive] = useState<Key>("composition");
  const a = getAsset(PICKS.layers);
  const current = LAYERS.find((l) => l.key === active)!;

  useFilmScroll((gsap) => {
    if (standalone) return;
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: track.current, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
    });
    // Separate into spatial layers → camera pushes through → recombine.
    tl.to(".ly-light", { x: -46, y: -30, duration: 0.3 }, 0)
      .to(".ly-colour", { x: 30, y: 18, duration: 0.3 }, 0)
      .to(".ly-atmos", { x: 58, y: 44, duration: 0.3 }, 0)
      .to(".ly-grid", { x: -22, y: 30, duration: 0.3 }, 0)
      .to(".ly-edge", { opacity: 1, duration: 0.2 }, 0.05)
      .to(".ly-stack", { scale: 1.1, duration: 0.4 }, 0.3)
      .to([".ly-light", ".ly-colour", ".ly-atmos", ".ly-grid"], { x: 0, y: 0, duration: 0.25 }, 0.72)
      .to(".ly-edge", { opacity: 0, duration: 0.2 }, 0.78)
      .to(".ly-stack", { scale: 1, duration: 0.25 }, 0.76);
  });

  const body = (
    <div className="layerlab mx-auto grid w-full max-w-[1500px] items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(320px,440px)] md:gap-14">
      <div className="ly-viewport mx-auto" style={{ aspectRatio: String(a.ratio) }}>
        <div className="ly-stack">
          <Photo id={PICKS.layers} sizes="(min-width: 768px) 40vw, 90vw" className="h-full w-full" style={{ aspectRatio: "auto" }} />
          {/* Composition: rule of thirds + focal point */}
          <div className={`ly ly-grid ${active === "composition" ? "is-on" : ""}`} aria-hidden>
            <svg viewBox="0 0 3 4" preserveAspectRatio="none" className="h-full w-full">
              <g stroke="#C6A56A" strokeWidth="0.012" fill="none" vectorEffect="non-scaling-stroke">
                <line x1="1" y1="0" x2="1" y2="4" /><line x1="2" y1="0" x2="2" y2="4" />
                <line x1="0" y1="1.33" x2="3" y2="1.33" /><line x1="0" y1="2.66" x2="3" y2="2.66" />
              </g>
            </svg>
            <span className="ly-focal" />
          </div>
          {/* Light: darken the world, keep the key light */}
          <div className={`ly ly-light ${active === "light" ? "is-on" : ""}`} aria-hidden />
          {/* Colour: palette wash */}
          <div className={`ly ly-colour ${active === "colour" ? "is-on" : ""}`} aria-hidden />
          {/* Atmosphere: haze, vignette, grain */}
          <div className={`ly ly-atmos film-grain ${active === "atmosphere" ? "is-on" : ""}`} aria-hidden />
          <div className="ly-edge" aria-hidden />
        </div>
        <p className="ly-note">Illustrative overlays that explain each layer. These are not the original before/after files.</p>
      </div>

      <div>
        <p className="film-eyebrow film-eyebrow--gold">Act II · The vision</p>
        <h2 className="film-title mt-4 text-[clamp(2rem,4.6vw,4.2rem)]">The image is only the beginning.</h2>
        <div role="tablist" aria-label="Photograph layers" className="mt-8 grid grid-cols-2 gap-2">
          {LAYERS.map((l) => (
            <button
              key={l.key}
              role="tab"
              id={`tab-${l.key}`}
              aria-selected={active === l.key}
              aria-controls="layer-panel"
              tabIndex={active === l.key ? 0 : -1}
              onClick={() => setActive(l.key)}
              onKeyDown={(e) => {
                const i = LAYERS.findIndex((x) => x.key === active);
                if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); setActive(LAYERS[(i + 1) % 4]!.key); (document.getElementById(`tab-${LAYERS[(i + 1) % 4]!.key}`))?.focus(); }
                if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); setActive(LAYERS[(i + 3) % 4]!.key); (document.getElementById(`tab-${LAYERS[(i + 3) % 4]!.key}`))?.focus(); }
              }}
              className={`min-h-[48px] border px-4 text-[11.5px] uppercase tracking-[0.2em] transition-colors ${
                active === l.key ? "border-[var(--film-gold)] bg-[var(--film-gold)] text-[var(--film-ink)]" : "border-white/20 text-[var(--film-paper)] hover:border-[var(--film-gold)]"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div id="layer-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="mt-6 min-h-[8.5rem]">
          <p className="text-[15px] leading-relaxed text-[var(--film-paper)]/90">{current.text}</p>
          {active === "colour" ? (
            <ul className="mt-5 flex gap-2" aria-label="Colours sampled from the photograph">
              {PALETTE.map((c) => (
                <li key={c} className="h-9 w-9 border border-white/20" style={{ background: c }} title={c}><span className="sr-only">{c}</span></li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );

  if (standalone) return <div className="film-pad py-10">{body}</div>;
  return (
    <section ref={track} className="film-track film-track--layers bg-[var(--film-ink)] text-[var(--film-paper)]" aria-label="Beyond the photograph">
      <div className="film-stage flex items-center film-pad py-20 md:py-0">{body}</div>
    </section>
  );
}
