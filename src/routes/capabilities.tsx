import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { portfolioQuery, rotatedFeatured } from "@/lib/portfolio";
import { Container, PageHero } from "@/components/site/ui";
import { CapabilityBlocks, SectionShell, ApproachBlock, SectorList } from "@/components/agency/sections";

export const Route = createFileRoute("/capabilities")({
  loader: ({ context }) => context.queryClient.ensureQueryData(portfolioQuery),
  head: () => ({
    meta: [
      { title: "Capabilities — Yomi Visuals Creative Agency & Production Company" },
      {
        name: "description",
        content:
          "Creative strategy, campaign development, commercials, brand films, photography, content production and post production — the full Yomi Visuals capability set.",
      },
      { property: "og:title", content: "Capabilities — Yomi Visuals" },
      {
        property: "og:description",
        content: "We think, we make, we finish. Campaign creative and production from Lagos, Nigeria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/capabilities" }],
  }),
  component: CapabilitiesPage,
});

function CapabilitiesPage() {
  const { data: photos } = useSuspenseQuery(portfolioQuery);
  const [approachImage] = rotatedFeatured(photos, 2);

  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        title="We think. We make. We finish."
        body="A single team across idea, production and finishing — so campaigns keep their intent from the first conversation to the final grade."
      />
      <Container className="py-16 md:py-24">
        <CapabilityBlocks />
      </Container>

      <SectionShell kicker="The YV Approach" index="02">
        <ApproachBlock image={approachImage} />
      </SectionShell>

      <SectionShell kicker="Who We Work With" index="03">
        <SectorList />
      </SectionShell>
    </>
  );
}
