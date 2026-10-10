import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Button, ButtonLink, Container, PageHero } from "@/components/site/ui";
import { portfolioQuery } from "@/lib/portfolio";
import { imageProjectType, IMAGE_PROJECT_TYPES, uniqueImages } from "@/lib/image-library";
import { PhotoLightbox } from "@/components/PhotoLightbox";

export const Route = createFileRoute("/image-library")({
  loader: ({ context }) => context.queryClient.ensureQueryData(portfolioQuery),
  head: () => ({ meta: [{ title: "Image Library — Yomi Visuals Marketing & Production" }, { name: "description", content: "Explore Yomi Visuals imagery by project type, from fashion and portraits to commercial content." }, { property: "og:title", content: "Image Library — Yomi Visuals" }, { property: "og:description", content: "Visual inspiration organized by project type." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: ImageLibrary,
});
function ImageLibrary() {
  const { data } = useSuspenseQuery(portfolioQuery);
  const [category, setCategory] = useState("All");
  const [index, setIndex] = useState<number | null>(null);
  const images = useMemo(() => uniqueImages(data.filter(i => i.in_portfolio)), [data]);
  const visible = images.filter(i => category === "All" || imageProjectType(i) === category);
  const grouped = category === "All" ? IMAGE_PROJECT_TYPES.filter(type => visible.some(i => imageProjectType(i) === type)) : [category];
  const lightboxImages = visible.map(i => ({ ...i, title: `${imageProjectType(i)} — Visual ${images.indexOf(i) + 1}`, category: imageProjectType(i), tags: i.marketing_uses ?? [] }));
  return <>
    <PageHero eyebrow="YV / Visual library" title="Images with possibility." body="Fashion, people and commercial storytelling. Different formats. New creative possibilities."><div className="flex flex-wrap gap-3"><ButtonLink to="/visual-direction">Create a visual brief</ButtonLink><ButtonLink to="/work" variant="outline">Case studies</ButtonLink></div></PageHero>
    <Container className="py-8">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Project types">{["All", ...IMAGE_PROJECT_TYPES.filter(t => images.some(i => imageProjectType(i) === t))].map(t => <Button key={t} variant={category === t ? "solid" : "outline"} className="px-4 py-3" aria-pressed={category === t} onClick={() => { setCategory(t); setIndex(null); }}>{t}</Button>)}</div>
      <p className="mt-5 text-xs text-muted-foreground">{visible.length} images</p>
      {grouped.map(type => <section key={type} className="py-8"><h2 className="mb-6 border-t border-border pt-6 text-lg">{type}</h2><div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{visible.filter(i => imageProjectType(i) === type).map(i => <Button key={i.id} variant="ghost" className="group relative block aspect-[3/4] overflow-hidden !p-0" onClick={() => setIndex(visible.indexOf(i))} aria-label={`Open ${type} image ${images.indexOf(i) + 1}`}><img src={i.thumb_url ?? i.url} alt={`${type} visual ${images.indexOf(i) + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-[var(--motion-standard)] group-hover:scale-[1.02]" /></Button>)}</div></section>)}
      {!visible.length ? <p className="py-16 text-muted-foreground">No images in this selection yet.</p> : null}
      <div className="border-t border-border py-10"><p className="max-w-xl text-sm text-muted-foreground">Planning social content, an ad campaign or a brand launch? Our team can adapt a visual direction for your channels. Usage clearance is confirmed per project.</p><ButtonLink to="/start-a-project" className="mt-6">Discuss your campaign</ButtonLink></div>
    </Container>
    <PhotoLightbox images={lightboxImages} index={index} onIndexChange={setIndex} onClose={() => setIndex(null)} />
  </>;
}