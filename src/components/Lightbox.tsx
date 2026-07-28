import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: { src: string; alt: string }[];
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
};

export function Lightbox({ images, index, onClose, onNav }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNav((index - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onNav((index + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onNav]);

  const img = images[index];
  if (!img) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-gold hover:text-gold"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="absolute top-5 left-5 z-10 text-[10px] uppercase tracking-[0.28em] text-white/60">
        {index + 1} / {images.length}
      </div>

      <button
        type="button"
        aria-label="Previous"
        onClick={() => onNav((index - 1 + images.length) % images.length)}
        className="absolute left-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/10 text-white/70 transition hover:border-gold hover:text-gold md:left-8"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => onNav((index + 1) % images.length)}
        className="absolute right-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/10 text-white/70 transition hover:border-gold hover:text-gold md:right-8"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="flex h-full items-center justify-center p-6 md:p-16">
        <img
          key={img.src + index}
          src={img.src}
          alt={img.alt}
          className="max-h-full max-w-full object-contain animate-in fade-in zoom-in-95 duration-500"
        />
      </div>
    </div>
  );
}
