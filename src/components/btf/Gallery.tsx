import { Link, useNavigate } from "@tanstack/react-router";
import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { PICKS, SETS, altFor, getAsset, getSet } from "@/lib/film/portfolio";
import { Photo } from "./Photo";

const GalleryScene = lazy(() => import("./GalleryScene"));

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}

function Carousel() {
  return (
    <ul className="gallery-carousel film-pad" aria-label="Selected work">
      {PICKS.gallery.map((id) => {
        const a = getAsset(id); const set = getSet(a.set)!;
        return (
          <li key={id}>
            <Link to="/work/$slug" params={{ slug: set.slug }} className="block" aria-label={`${set.name}: open set`}>
              <Photo id={id} sizes="(min-width:768px) 40vw, 78vw" className="w-full" />
              <span className="mt-3 flex items-baseline justify-between text-[11px] uppercase tracking-[0.2em] text-[var(--film-muted)]"><span>{set.name}</span><span>Open ↗</span></span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Act III — Scene 03: Selected Work (The Worlds). */
export function Gallery() {
  const track = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [mode, setMode] = useState<"pending" | "3d" | "carousel">("pending");
  const [inView, setInView] = useState(false);
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const big = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches;
    setMode(big && hasWebGL() ? "3d" : "carousel");
  }, []);

  useEffect(() => {
    if (mode !== "3d" || !track.current) return;
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), { rootMargin: "200px" });
    io.observe(track.current);
    let kill: (() => void) | undefined; let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const st = ScrollTrigger.create({ trigger: track.current, start: "top top", end: "bottom bottom", onUpdate: (s) => { progress.current = s.progress; } });
      kill = () => st.kill();
    })();
    return () => { cancelled = true; io.disconnect(); kill?.(); };
  }, [mode]);

  const cur = getSet(getAsset(PICKS.gallery[idx]!).set)!;

  return (
    <section id="act-3" ref={track} className={`${mode === "3d" ? "film-track film-track--gallery" : ""} bg-[var(--film-ink)] text-[var(--film-paper)]`} aria-labelledby="act3-title">
      <div className={mode === "3d" ? "film-stage" : "py-20 md:py-28"}>
        {mode === "3d" ? (
          <Boundary fallback={null}>
            <Suspense fallback={null}>
              <div className="absolute inset-0">
                <GalleryScene
                  progress={progress}
                  active={inView}
                  onOpen={(slug) => navigate({ to: "/work/$slug", params: { slug } })}
                  onIndex={setIdx}
                  onLost={() => setMode("carousel")}
                />
              </div>
            </Suspense>
          </Boundary>
        ) : null}

        {mode === "3d" ? <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-[46%] bg-gradient-to-r from-[#090909] via-[#090909]/70 to-transparent" aria-hidden /> : null}
        <div className={`film-pad ${mode === "3d" ? "pointer-events-none absolute left-0 top-24 z-10 max-w-xl" : ""}`}>
          <p className="film-eyebrow film-eyebrow--gold">Act III · The worlds</p>
          <h2 id="act3-title" className="film-title mt-4 text-[clamp(2rem,4.6vw,4.2rem)]">Selected work</h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--film-muted)]">
            {mode === "3d" ? "Scroll to walk the gallery. Select any frame to open its set." : "Frames from the archive, grouped by their original sets."}
          </p>
        </div>

        {mode === "3d" ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 film-pad pb-8" aria-live="polite">
            <div className="pointer-events-auto inline-flex items-center gap-5 border border-white/15 bg-[#090909]/80 px-5 py-4 backdrop-blur">
              <div>
                <p className="film-eyebrow">Now showing</p>
                <p className="font-serif text-2xl italic">{cur.name}</p>
              </div>
              <Link to="/work/$slug" params={{ slug: cur.slug }} className="film-btn film-btn--solid !min-h-[44px]">Open set</Link>
            </div>
          </div>
        ) : null}

        {mode === "carousel" ? <div className="mt-10"><Carousel /></div> : null}
      </div>

      {/* Accessible HTML equivalent, always present. */}
      <div className="film-pad pb-20 pt-6 md:pt-10">
        <h3 className="film-eyebrow">The archive by set</h3>
        <ul className="mt-5 grid gap-px bg-white/10 md:grid-cols-3">
          {SETS.map((s) => (
            <li key={s.slug} className="bg-[var(--film-ink)]">
              <Link to="/work/$slug" params={{ slug: s.slug }} className="group block p-6 transition-colors hover:bg-[var(--film-ink-2)]">
                <span className="flex items-baseline justify-between"><span className="font-serif text-2xl italic">{s.name}</span><span className="text-[11px] tracking-[0.2em] text-[var(--film-gold)]">{String(s.count).padStart(2, "0")}</span></span>
                <span className="mt-2 block text-[13px] leading-relaxed text-[var(--film-muted)]">{s.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
