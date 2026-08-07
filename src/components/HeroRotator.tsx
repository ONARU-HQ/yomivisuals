import { useEffect, useState } from "react";
import { focalStyle, type PortfolioImage } from "@/lib/portfolio";

export function HeroRotator({
  slides,
  interval = 6000,
  className = "",
}: {
  slides: PortfolioImage[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => window.clearInterval(id);
  }, [slides.length, interval]);

  if (!slides.length) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden bg-background ${className}`} aria-hidden="true">
      {slides.map((s, i) => (
        <img
          key={s.id}
          src={i === 0 ? s.url : s.url}
          srcSet={s.thumb_url ? `${s.thumb_url} 760w, ${s.url} 1600w` : undefined}
          sizes="100vw"
          alt=""
          loading={i === 0 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : "low"}
          decoding="async"
          style={{
            ...focalStyle(s),
            backgroundImage: s.blur_data ? `url(${s.blur_data})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === index ? 1 : 0,
            transform: i === index ? "scale(1.04)" : "scale(1)",
            transition: "opacity 1600ms cubic-bezier(0.4,0,0.2,1), transform 7000ms linear",
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/35" />
      <div className="absolute inset-0 bg-background/25" />
    </div>
  );
}

export function HeroProgress({
  count,
  index,
  onSelect,
}: {
  count: number;
  index: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          aria-label={`Show frame ${i + 1}`}
          onClick={() => onSelect(i)}
          className={`h-[2px] w-8 rounded-full transition-colors ${i === index ? "bg-foreground" : "bg-border-strong"}`}
        />
      ))}
    </div>
  );
}
