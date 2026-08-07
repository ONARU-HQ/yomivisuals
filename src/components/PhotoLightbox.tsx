import { useCallback, useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { focalStyle, type PortfolioImage } from "@/lib/portfolio";

export function PhotoLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: PortfolioImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const touchX = useRef<number | null>(null);
  const open = index !== null;

  const next = useCallback(() => {
    if (index === null) return;
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  const prev = useCallback(() => {
    if (index === null) return;
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, next, prev, onClose]);

  if (!open) return null;
  const img = images[index];
  if (!img) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-background/98"
      role="dialog"
      aria-modal="true"
      aria-label={img.title}
      onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX ?? null;
        if (start === null || end === null) return;
        if (Math.abs(end - start) > 50) (end < start ? next : prev)();
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium tracking-tight">{img.title}</p>
          <p className="text-[11.5px] uppercase tracking-[0.16em] text-muted-foreground">{img.category}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 rounded-full border border-border p-2 transition-colors hover:bg-elevated"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-3">
        <img
          key={img.id}
          src={img.url}
          alt={img.title}
          style={focalStyle(img)}
          className="max-h-full max-w-full rounded-[10px] object-contain"
        />
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-3 hidden rounded-full border border-border bg-background/70 p-3 transition-colors hover:bg-elevated sm:block"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-3 hidden rounded-full border border-border bg-background/70 p-3 transition-colors hover:bg-elevated sm:block"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-3 text-[12px] text-muted-foreground">
        <span>
          {index + 1} / {images.length}
        </span>
        <span className="truncate">{img.tags.slice(0, 3).join(" · ")}</span>
      </div>
    </div>
  );
}
