import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { studioSpacesQuery, imageFor } from "@/lib/cms";
import { Container, PageHero, ButtonLink } from "@/components/site/ui";

export const Route = createFileRoute("/studio")({
  loader: ({ context }) => context.queryClient.ensureQueryData(studioSpacesQuery),
  head: () => ({
    meta: [
      { title: "YV Studios — Studio Rental in Lagos | Yomi Visuals" },
      { name: "description", content: "Cyclorama, daylight and set spaces available hourly or daily at YV Studios, Lagos. Lighting, backdrops and crew access included." },
      { property: "og:title", content: "YV Studios — Studio Rental in Lagos" },
      { property: "og:description", content: "Rent a professional photography and film studio in Lagos by the hour or day." },
      { property: "og:url", content: "https://yomivisuals.lovable.app/studio" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/studio" }],
  }),
  component: StudioPage,
});

function StudioPage() {
  const { data: spaces } = useSuspenseQuery(studioSpacesQuery);
  return (
    <>
      <PageHero eyebrow="YV Studios" title="A room built for good light." body="Three configurable spaces in Lagos, available to our clients and to external productions.">
        <ButtonLink to="/start-a-project">Check availability</ButtonLink>
      </PageHero>
      <Container className="py-14 md:py-20">
        <div className="space-y-6">
          {spaces.map((s, i) => (
            <div key={s.id} className="grid gap-8 overflow-hidden rounded-sm border border-border md:grid-cols-2">
              <div className="image-reveal overflow-hidden">
                <img src={s.images?.[0] ?? imageFor(s.name, i)} alt={s.name} loading="lazy" className="h-full min-h-[260px] w-full object-cover" />
              </div>
              <div className="p-8 md:p-10">
                <h2 className="text-display text-[clamp(1.5rem,3.4vw,2.2rem)]">{s.name}</h2>
                <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">{s.description}</p>
                <p className="mt-6 text-[15px]">{s.price} · {s.size}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.amenities.map((a) => (
                    <li key={a} className="rounded-sm border border-border px-3 py-1.5 text-[12.5px] text-subtle">{a}</li>
                  ))}
                </ul>
                <div className="mt-8"><ButtonLink to="/start-a-project" variant="outline">Book this space</ButtonLink></div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
