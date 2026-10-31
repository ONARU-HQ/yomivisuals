import { createFileRoute } from "@tanstack/react-router";
import { STUDIO_URL } from "@/content/site";
import { LeadForm } from "@/components/btf/LeadForm";
import { PageHead, Main } from "@/components/btf/PageHead";
import { seo } from "@/lib/film/seo";

export const Route = createFileRoute("/collaborate")({
  head: () => seo({ title: "Collaborate | Yomi Visuals", description: "Creative direction, brand strategy, digital experiences, creative technology, speaking and advisory with Yomi Onalaru.", path: "/collaborate" }),
  component: Collaborate,
});

const AREAS = ["Creative direction", "Brand strategy", "Digital experience collaborations", "Creative technology experiments", "Speaking and partnerships", "Advisory"];

function Collaborate() {
  return (
    <Main>
      <PageHead eyebrow="Collaborate" title="Let’s create something meaningful.">
        Great ideas deserve to exist. If yours needs a creative director, a builder, or both, start here.
      </PageHead>
      <div className="film-pad mx-auto grid max-w-[1400px] gap-16 pb-24 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="film-eyebrow film-eyebrow--gold">Open to conversations about</p>
          <ul className="mt-5 divide-y divide-white/10 border-y border-black/10">{AREAS.map((a) => <li key={a} className="py-4 mx-mono text-2xl">{a}</li>)}</ul>
          <div className="mt-10 border border-[var(--film-gold)]/40 p-6">
            <p className="film-eyebrow film-eyebrow--gold">Photography, video or studio hire?</p>
            <p className="mt-3 text-[15px] text-[var(--film-paper)]/85">Those enquiries and bookings go to YV Studios Africa, where they are handled and booked directly.</p>
            <a href={STUDIO_URL} target="_blank" rel="noopener noreferrer" className="film-btn film-btn--solid mt-5">Go to YV Studios ↗<span className="sr-only"> (opens in a new tab)</span></a>
          </div>
        </div>
        <LeadForm source="collaborate" enquiries={["Creative direction", "Brand strategy", "Digital experience", "Creative technology", "Speaking / partnership", "Advisory"]} />
      </div>
    </Main>
  );
}
