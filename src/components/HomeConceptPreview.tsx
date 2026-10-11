import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { Button, ButtonLink } from "@/components/site/ui";
import { ContactLinks } from "@/components/ContactLinks";
import { focalStyle, type PortfolioImage } from "@/lib/portfolio";
import { HOME_CONCEPTS, HERO_INTERVAL, photoLabel, type HomeConceptId } from "@/lib/home-concepts";
import type { Service } from "@/lib/cms";

export function HomeConceptPreview({ concept, photos, services, compact = false }: { concept: HomeConceptId; photos: PortfolioImage[]; services: Service[]; compact?: boolean }) {
  const [frame, setFrame] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (paused || compact || media.matches || photos.length < 2) return;
    const timer = window.setInterval(() => { if (!document.hidden) setFrame(n => (n + 1) % Math.min(photos.length, 6)); }, HERO_INTERVAL);
    return () => window.clearInterval(timer);
  }, [paused, compact, photos.length]);
  const image = photos[frame % (photos.length || 1)];
  const definition = HOME_CONCEPTS.find(c => c.id === concept);
  const next = (delta: number) => setFrame(n => (n + delta + Math.min(photos.length, 6)) % Math.min(photos.length, 6));
  const photo = (img: PortfolioImage | undefined, className = "aspect-[4/5] w-full object-cover") => img ? <img src={img.url} alt={`${photoLabel(img)} by Yomi Visuals`} style={focalStyle(img)} className={className} loading="lazy" decoding="async" /> : null;
  const actions = <div className="mt-7 flex flex-wrap gap-3"><ButtonLink to="/start-a-project">Start a Project</ButtonLink to="/work" variant="outline">View Work</ButtonLink></div>;
  const heading = <><p className="text-eyebrow text-gold">Creative agency / Lagos, Nigeria</p><h2 className={`text-display mt-5 ${compact ? "text-3xl" : "text-4xl md:text-6xl"}`}>Yomi Visuals.<br />We make ideas real.</h2><p className="mt-5 max-w-lg text-[15px] leading-relaxed text-subtle">Creative direction, photography, film and content production for individuals, businesses and ambitious brands.</p>{actions}</>;
  const work = <section className="border-t border-border px-5 py-12 md:px-10 md:py-16"><p className="text-eyebrow">Selected imagery</p><h3 className="text-display mt-4 text-2xl md:text-4xl">Work that speaks for itself.</h3><div className={`mt-8 grid gap-4 ${concept === "archive" ? "grid-cols-2 md:grid-cols-3" : "md:grid-cols-2"}`}>
    {photos.slice(0, 6).map((img, i) => <figure key={img.id} className={concept === "editorial" && i % 2 ? "md:mt-14" : ""}>{photo(img, `${concept === "archive" ? "aspect-square" : i % 2 ? "aspect-[4/5]" : "aspect-[5/4]"} w-full object-cover`)}<figcaption className="mt-3 flex justify-between text-[12px] text-muted-foreground"><span>{photoLabel(img)}</span><span>0{i + 1}</span></figcaption></figure>)}
  </div><div className="mt-8"><ButtonLink to="/work" variant="outline">Explore Work</ButtonLink></div></section>;
  const capabilities = <section className="border-t border-border px-5 py-12 md:px-10 md:py-16"><p className="text-eyebrow">From idea to final frame</p><h3 className="text-display mt-4 text-2xl md:text-4xl">The thinking. The making.<br />The finished work.</h3><div className="mt-8 divide-y divide-border border-t border-border">{services.map((service, i) => <div key={service.id} className="py-6"><div className="flex items-baseline gap-5"><span className="text-index">0{i + 1}</span><h4 className="text-xl">{service.title}</h4></div><p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{service.excerpt}</p><div className="mt-4"><ButtonLink to="/services/$slug" params={{ slug: service.slug }} variant="ghost">Explore service</ButtonLink></div></div>)}</div></section>;
  const journey = <section className="border-t border-border px-5 py-12 md:px-10 md:py-16"><p className="text-eyebrow">Our approach</p><div className={concept === "narrative" ? "mt-8 space-y-12" : "mt-8 grid gap-8 sm:grid-cols-2"}>{["Idea", "Creative", "Production", "Delivery"].map((step, i) => <div key={step}>{concept === "narrative" && photo(photos[i], "mb-6 aspect-[16/9] w-full object-cover")}<p className="text-index">0{i + 1}</p><h3 className="text-display mt-3 text-3xl">{step}.</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{["Understand the brief and the audience.", "Develop the direction and plan the visual story.", "Bring the idea to life with the right team.", "Finish and prepare the assets for their intended channels."][i]}</p></div>)}</div></section>;
  return <article aria-label={definition?.name} className="overflow-hidden bg-background text-foreground">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-5 text-[11px] uppercase md:px-10"><span className="font-semibold">Yomi Visuals</span><span className="text-muted-foreground">Work / Services / About / Ecosystem</span></div>
    {concept === "editorial" ? <header className="px-5 pt-10 md:px-10"><p className="text-eyebrow">Independent creative agency</p><h2 className={`text-display mt-4 ${compact ? "text-4xl" : "text-5xl md:text-7xl"}`}>YOMI<br />VISUALS.</h2><div className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr]">{photo(image, "aspect-[4/5] w-full object-cover")}<div className="py-4"><h3 className="text-display text-3xl">We make<br />ideas real.</h3><p className="mt-5 text-sm leading-relaxed text-subtle">Creative direction, campaigns and production, from Lagos.</p>{actions}</div></div></header> :
    <header className={`relative isolate flex flex-col justify-end overflow-hidden ${concept === "archive" ? "min-h-[380px]" : compact ? "min-h-[460px]" : "min-h-[620px]"}`}>
      {concept === "mosaic" ? <div className="absolute inset-0 -z-20 grid grid-cols-2 gap-1 md:grid-cols-3">{photos.slice(0, 6).map(img => <div key={img.id} className="min-h-0 overflow-hidden">{photo(img, "h-full w-full object-cover")}</div>)}</div> : <div className="absolute inset-0 -z-20">{photo(image, "h-full w-full object-cover")}</div>}
      <div className="absolute inset-0 -z-10 bg-background/65" />
      <div className={`px-5 py-12 md:px-10 ${concept === "mosaic" ? "mx-auto text-center" : ""}`}>{heading}</div>
      {concept === "cinema" && photos.length > 1 && !compact && <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3 md:px-10" aria-label="Photo rotation"><span className="text-[12px]">{String(frame + 1).padStart(2, "0")} / {Math.min(6, photos.length)} · {image && photoLabel(image)}</span><div className="flex gap-1"><Button variant="ghost" aria-label="Previous photo" onClick={() => next(-1)}><ArrowLeft className="h-4 w-4" /></Button><Button variant="ghost" aria-label={paused ? "Play photo rotation" : "Pause photo rotation"} onClick={() => setPaused(p => !p)}>{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}</Button><Button variant="ghost" aria-label="Next photo" onClick={() => next(1)}><ArrowRight className="h-4 w-4" /></Button></div></div>}
    </header>}
    {!compact && <>{concept === "narrative" ? <>{journey}{work}{capabilities}</> : concept === "cinema" ? <>{capabilities}{work}{journey}</> : <>{work}{capabilities}{journey}</>}
      <section className="border-t border-border px-5 py-16 md:px-10"><p className="text-eyebrow">Start a conversation</p><h3 className="text-display mt-5 text-3xl md:text-5xl">Let's make<br />your next idea real.</h3>{actions}<div className="mt-10"><ContactLinks /></div></section>
    </>}
  </article>;
}