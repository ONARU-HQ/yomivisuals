import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Download, Heart, Lock, Share2, X } from "lucide-react";

import portrait1 from "@/assets/portrait-1.jpg";
import wedding1 from "@/assets/wedding-1.jpg";
import fashion1 from "@/assets/fashion-1.jpg";
import maternity1 from "@/assets/maternity-1.jpg";
import family1 from "@/assets/family-1.jpg";
import brand1 from "@/assets/brand-1.jpg";
import heroWedding from "@/assets/hero-wedding.jpg";
import aboutPortrait from "@/assets/about-portrait.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Client Gallery — Yomi Visuals" },
      {
        name: "description",
        content:
          "Enter your private memory collection. Client galleries are password protected.",
      },
      { property: "og:title", content: "Client Gallery — Yomi Visuals" },
      {
        property: "og:description",
        content: "A private collection of your memories.",
      },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

const galleryImages = [
  { src: heroWedding, alt: "Cathedral moment" },
  { src: wedding1, alt: "Rooftop embrace" },
  { src: portrait1, alt: "Studio portrait" },
  { src: fashion1, alt: "Editorial silhouette" },
  { src: maternity1, alt: "Golden light" },
  { src: family1, alt: "Small hands" },
  { src: brand1, alt: "Still life" },
  { src: aboutPortrait, alt: "The craftsman" },
];

function GalleryPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFav = (i: number) => {
    setFavorites((prev) => {
      const n = new Set(prev);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length >= 4) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!unlocked) {
    return (
      <div className="relative min-h-screen bg-background pt-24 md:pt-32">
        <div className="absolute inset-0 -z-10">
          <img src={heroWedding} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/70 to-background" />
        </div>
        <div className="mx-auto max-w-md px-5 pb-24 pt-8 text-center md:px-10">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
            <Lock className="h-5 w-5" />
          </div>
          <p className="text-eyebrow mt-8">Private Gallery</p>
          <h1 className="mt-4 text-display text-4xl leading-[1] text-primary md:text-5xl">
            Enter your <br />
            <span className="text-editorial text-gold-warm">memory collection.</span>
          </h1>
          <p className="mt-5 text-sm text-muted-foreground">
            Your gallery is protected by a private password we shared when your memories were delivered.
          </p>

          <form onSubmit={submit} className="mt-10 space-y-4 text-left">
            <div>
              <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Gallery name
              </label>
              <input
                type="text"
                placeholder="e.g. adaeze-tolu-2025"
                className="mt-2 w-full border border-border bg-card px-5 py-4 text-sm text-primary placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
                style={{ borderRadius: "12px" }}
                defaultValue="adaeze-tolu-2025"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full border border-border bg-card px-5 py-4 text-sm text-primary placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
                style={{ borderRadius: "12px" }}
              />
              {error && (
                <p className="mt-2 text-xs text-destructive">
                  Password must be at least 4 characters. (Demo — any value works.)
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-gold py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-primary-foreground hover:bg-gold-warm transition-colors"
              style={{ borderRadius: "12px" }}
            >
              Enter Gallery
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32">
      <section className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-eyebrow mb-3">Delivered · March 2025</p>
            <h1 className="text-display text-3xl leading-[1.02] text-primary md:text-5xl">
              Adaeze & Tolu <br />
              <span className="text-editorial text-gold-warm">— a cathedral of light.</span>
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">
              {galleryImages.length} memories · {favorites.size} favorited
            </p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:border-gold hover:text-primary">
              <Download className="h-3.5 w-3.5" /> Download all
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:border-gold hover:text-primary">
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-3">
          {galleryImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightbox(i)}
              className="group relative block aspect-[3/4] overflow-hidden"
              style={{ borderRadius: "10px" }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFav(i);
                }}
                className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/70 backdrop-blur-md"
              >
                <Heart
                  className={`h-3.5 w-3.5 ${favorites.has(i) ? "fill-gold text-gold" : "text-primary"}`}
                />
              </button>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-5 py-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <span>
                {lightbox + 1} / {galleryImages.length}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleFav(lightbox)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border"
                >
                  <Heart
                    className={`h-4 w-4 ${favorites.has(lightbox) ? "fill-gold text-gold" : "text-primary"}`}
                  />
                </button>
                <button className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary">
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setLightbox(null)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center px-5 pb-10">
              <img
                src={galleryImages[lightbox].src}
                alt={galleryImages[lightbox].alt}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
