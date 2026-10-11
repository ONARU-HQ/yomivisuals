import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Check, Columns2, Monitor, Smartphone } from "lucide-react";
import { portfolioQuery } from "@/lib/portfolio";
import { servicesQuery } from "@/lib/cms";
import { HOME_CONCEPTS, conceptPhotos, type HomeConceptId } from "@/lib/home-concepts";
import { HomeConceptPreview } from "@/components/HomeConceptPreview";
import { Button, Field, inputClass } from "@/components/site/ui";

export const Route = createFileRoute("/_authenticated/admin/homepage")({
  loader: async ({ context }) => { await Promise.all([context.queryClient.ensureQueryData(portfolioQuery), context.queryClient.ensureQueryData(servicesQuery)]); },
  head: () => ({ meta: [
    { title: "Private Homepage Concepts — Yomi Visuals" },
    { name: "description", content: "Private staff comparison of five Yomi Visuals homepage concepts." },
    { property: "og:title", content: "Private Homepage Concepts — Yomi Visuals" },
    { property: "og:description", content: "Staff-only design review." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: HomepageConcepts,
});

function HomepageConcepts() {
  const { data: images } = useSuspenseQuery(portfolioQuery);
  const { data: services } = useSuspenseQuery(servicesQuery);
  const photos = conceptPhotos(images);
  const [active, setActive] = useState<HomeConceptId>("cinema");
  const [phone, setPhone] = useState(false);
  const [compare, setCompare] = useState(false);
  const [shortlist, setShortlist] = useState<HomeConceptId[]>(["cinema", "editorial"]);
  const [notes, setNotes] = useState("");
  const [preferred, setPreferred] = useState<HomeConceptId | null>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem("yv-homepage-review") || "null");
      if (stored && HOME_CONCEPTS.some(c => c.id === stored.preferred)) { setPreferred(stored.preferred); setNotes(String(stored.notes || "")); }
    } catch { /* corrupted local review does not prevent previews */ }
  }, []);
  function saveReview() {
    try { window.localStorage.setItem("yv-homepage-review", JSON.stringify({ preferred: active, notes })); setPreferred(active); setSaved(true); }
    catch { setSaved(false); }
  }
  return <div>
    <p className="text-eyebrow text-gold">Private / Design review</p>
    <h1 className="text-display mt-3 text-3xl md:text-4xl">Five ways to make an impression.</h1>
    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">Your public homepage stays in place. All concepts use imported Yomi Visuals photography with project-type labels, not unverified client names.</p>
    <div className="mt-8 divide-y divide-border border-y border-border">
      {HOME_CONCEPTS.map(c => <div key={c.id} className="flex items-start gap-4 py-4">
        <input type="checkbox" aria-label={`Compare ${c.name}`} checked={shortlist.includes(c.id)} onChange={e => setShortlist(s => e.target.checked ? [...s, c.id] : s.filter(id => id !== c.id))} className="mt-3 h-4 w-4 accent-primary" />
        <Button variant={active === c.id ? "solid" : "ghost"} className="justify-start text-left" onClick={() => { setActive(c.id); setCompare(false); setSaved(false); }}>{c.name}{preferred === c.id && <Check className="h-4 w-4" />}</Button>
        <p className="hidden flex-1 pt-3 text-[12px] leading-relaxed text-muted-foreground md:block">{c.description}</p>
      </div>)}
    </div>
    <div className="my-6 flex flex-wrap gap-2">
      <Button variant="outline" aria-pressed={compare} onClick={() => setCompare(c => !c)} disabled={shortlist.length < 2}><Columns2 className="h-4 w-4" />{compare ? "Single preview" : "Compare selected"}</Button>
      <Button variant={!phone ? "solid" : "outline"} aria-label="Desktop preview" onClick={() => setPhone(false)}><Monitor className="h-4 w-4" /></Button>
      <Button variant={phone ? "solid" : "outline"} aria-label="Phone preview" onClick={() => setPhone(true)}><Smartphone className="h-4 w-4" /></Button>
    </div>
    {!photos.length ? <p role="status" className="border border-border p-8 text-muted-foreground">No imported photographs available. Add original images in Media library.</p> : compare ?
      <div className="grid gap-6 xl:grid-cols-2">{HOME_CONCEPTS.filter(c => shortlist.includes(c.id)).map(c => <div key={c.id} className="min-w-0"><p className="mb-3 text-eyebrow">{c.name}</p><div className={`mx-auto border border-border ${phone ? "max-w-[390px]" : "w-full"}`}><HomeConceptPreview concept={c.id} photos={photos} services={services} compact /></div><Button className="mt-4" variant="outline" onClick={() => { setActive(c.id); setCompare(false); }}>Open full concept</Button></div>)}</div> :
      <div className={`mx-auto border border-border ${phone ? "max-w-[390px]" : "w-full"}`}><HomeConceptPreview key={active} concept={active} photos={photos} services={services} /></div>}
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="text-display text-2xl">Your preferred direction.</h2>
      <div className="mt-5 max-w-xl"><Field label="Review notes"><textarea value={notes} onChange={e => { setNotes(e.target.value); setSaved(false); }} rows={4} className={inputClass} /></Field></div>
      <Button className="mt-5" onClick={saveReview}><Check className="h-4 w-4" />Save preference — {HOME_CONCEPTS.find(c => c.id === active)?.name}</Button>
      <p role="status" className="mt-3 text-xs text-muted-foreground">{saved ? "Preference saved on this browser. Nothing has been published." : "Review notes stay on this browser only. Choosing a concept does not publish it."}</p>
    </section>
  </div>;
}