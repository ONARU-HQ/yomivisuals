import type { CSSProperties } from "react";
import { altFor, getAsset, src, srcSet } from "@/lib/film/portfolio";

type Props = {
  id: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** "cover" crops using the asset's focal point; "contain" shows the whole frame. */
  fit?: "cover" | "contain";
  style?: CSSProperties;
  alt?: string;
};

/** Layer 03 — a portfolio photograph. Keeps aspect ratio, shows a blur placeholder, never crops unless asked. */
export function Photo({ id, sizes = "100vw", priority, className = "", imgClassName = "", fit = "cover", style, alt }: Props) {
  const a = getAsset(id);
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundImage: `url(${a.blur})`, backgroundSize: "cover", aspectRatio: className.includes("h-") ? undefined : String(a.ratio), ...style }}
    >
      <img
        src={src(id, 1600)}
        srcSet={srcSet(id)}
        sizes={sizes}
        width={a.w}
        height={a.h}
        alt={alt ?? altFor(a)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : {})}
        className={`h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"} ${imgClassName}`}
        style={{ objectPosition: `${a.focal[0] * 100}% ${a.focal[1] * 100}%` }}
      />
    </div>
  );
}
