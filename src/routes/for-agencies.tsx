import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { portfolioQuery, rotatedFeatured } from "@/lib/portfolio";
import { Container, PageHero } from "@/components/site/ui";
import { AgencyPartnership, SectionShell } from "@/components/agency/sections";
import { ProjectForm } from "@/components/site/ProjectForm";

export const Route = createFileRoute("/for-agencies")({
  loader: ({ context }) => context.queryClient.ensureQueryData(portfolioQuery),
  head: () => ({
    meta: [
      { title: "For Agencies — Creative Production Partner | Yomi Visuals" },
      {
        name: "description",
        content:
          "Yomi Visuals partners with marketing, advertising, PR and digital agencies as a creative production partner for commercials, film, photography, content and post production.",
      },
      { property: "og:title", content: "For Agencies — Yomi Visuals" },
      {
        property: "og:description",
        content: "Your agency has the idea. We can make it happen — commercial production out of Lagos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/for-agencies" }],
  }),
  component: ForAgenciesPage,
});

function ForAgenciesPage() {
  const { data: photos } = useSuspenseQuery(portfolioQuery);
  const [partnerImage] = rotatedFeatured(photos, 3);

  return (
    <>
      <PageHero
        eyebrow="For Agencies"
        title="A production partner, not a vendor."
        body="We plug into agency teams as the creative production arm — protecting the idea from deck to delivery."
      />

      <Container className="py-16 md:py-24">
        <AgencyPartnership image={partnerImage} />
      </Container>

      <SectionShell kicker="Start a Conversation" index="02">
        <div className="grid gap-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-20">
          <h2 className="text-headline text-[clamp(2rem,8vw,3.4rem)]">
            Tell us about
            <br />
            <span className="text-serif normal-case text-gold">the campaign.</span>
          </h2>
          <ProjectForm source="for-agencies" />
        </div>
      </SectionShell>
    </>
  );
}
