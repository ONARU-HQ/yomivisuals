import { useCallback, useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { RevealImage } from "@/components/motion";
import { videoEmbed, type ProjectMedia } from "@/lib/work";

/* ------------------------------------------------------------------ */
/* Progressive image — blur-up placeholder, never distorted            */
/* ------------------------------------------------------------------ */

export function ProgressiveImage({
  src,
  alt,
  className = "",
  eager = false,
  fit = "cover",
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  fit?: "cover" | "contain";
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  // Images restored from cache can finish before React attaches onLoad.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, [src]);
  return (
    <span className="relative block h-full w-full overflow-hidden bg-elevated">
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-elevated transition-opacity duration-[var(--motion-cinematic)] ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"} transition-opacity duration-[var(--motion-cinematic)] ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Video player — YV controls, no default browser chrome where possible */
/* ------------------------------------------------------------------ */

export function ProjectVideo({ url, poster, title }: { url: string; poster?: string | null; title: string }) {
  const embed = videoEmbed(url);
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  if (embed.kind === "iframe") {
    return (
      <div className="relative aspect-video w-full overflow-hidden border border-border bg-black">
        <iframe
          src={embed.src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden border border-border bg-black">
      <video
        ref={ref}
        src={embed.src}
        poster={poster ?? undefined}
        muted={muted}
        playsInline
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent p-3">
        <button
          type="button"
          aria-label={playing ? "Pause film" : "Play film"}
          onClick={() => (playing ? ref.current?.pause() : ref.current?.play())}
          className="tap press grid h-11 w-11 place-items-center border border-white/25 text-white"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button
          type="button"
          aria-label={muted ? "Unmute film" : "Mute film"}
          onClick={() => setMuted((m) => !m)}
          className="tap press grid h-11 w-11 place-items-center border border-white/25 text-white"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
        <button
          type="button"
          aria-label="Fullscreen"
          onClick={() => ref.current?.requestFullscreen?.()}
          className="tap press ml-auto grid h-11 w-11 place-items-center border border-white/25 text-white"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Editorial media canvas + cinematic viewer                            */
/* ------------------------------------------------------------------ */

const SPAN: Record<string, string> = {
  full: "md:col-span-12",
  half: "md:col-span-6",
  portrait: "md:col-span-5",
  text: "md:col-span-7",
};

export function MediaCanvas({ items, title }: { items: ProjectMedia[]; title: string }) {
  const images = items.filter((m) => m.type === "image");
  const [open, setOpen] = useState<number | null>(null);

  const indexOfImage = (m: ProjectMedia) => images.findIndex((i) => i.id === m.id);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  const touch = useRef<number | null>(null);

  if (!items.length) return null;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-12 md:gap-6">
        {items.map((m, i) => {
          if (m.type === "video") {
            return (
              <div key={m.id} className={`${SPAN[m.layout] ?? "md:col-span-12"}`}>
                <ProjectVideo url={m.url} title={m.alt || title} />
                {m.caption ? <p className="mt-2 text-[12px] text-muted-foreground">{m.caption}</p> : null}
              </div>
            );
          }
          const idx = indexOfImage(m);
          return (
            <figure key={m.id} className={SPAN[m.layout] ?? "md:col-span-6"}>
              <button
                type="button"
                onClick={() => setOpen(idx)}
                aria-label={`Open image ${idx + 1} of ${images.length}`}
                data-cursor="view"
                className="media-zoom block w-full overflow-hidden border border-border"
              >
                <RevealImage
                  src={m.url}
                  alt={m.alt || `${title} — image ${idx + 1}`}
                  priority={i < 2}
                  className={
                    m.layout === "portrait"
                      ? "aspect-[4/5]"
                      : m.layout === "full"
                        ? "aspect-[16/9]"
                        : "aspect-[4/3]"
                  }
                />
              </button>
              {m.caption ? (
                <figcaption className="mt-2 text-[12px] text-muted-foreground">{m.caption}</figcaption>
              ) : null}
            </figure>
          );
        })}
      </div>

      {open !== null && images[open] ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} gallery`}
          className="confirm-in fixed inset-0 z-[80] flex flex-col bg-background/98 backdrop-blur"
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touch.current === null) return;
            const dx = e.changedTouches[0].clientX - touch.current;
            if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
            touch.current = null;
          }}
        >
          <div className="flex items-center justify-between px-5 py-4 md:px-10">
            <p className="text-eyebrow">
              {String(open + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </p>
            <button
              type="button"
              onClick={close}
              aria-label="Close gallery"
              className="tap press grid h-11 w-11 place-items-center border border-border"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center px-4 pb-4 md:px-10">
            <ProgressiveImage
              key={images[open].id}
              src={images[open].url}
              alt={images[open].alt || `${title} — image ${open + 1}`}
              eager
              fit="contain"
            />
          </div>

          <div className="flex items-center justify-between gap-4 px-5 pb-6 md:px-10">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="tap press grid h-12 w-12 place-items-center border border-border"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="min-w-0 flex-1 truncate text-center text-[12.5px] text-muted-foreground">
              {images[open].caption || images[open].alt || title}
            </p>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="tap press grid h-12 w-12 place-items-center border border-border"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
