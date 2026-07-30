import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHero } from "@/components/site/ui";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Yomi Visuals" },
      { name: "description", content: "The terms that apply to enquiries, bookings and engagements with Yomi Visuals." },
      { property: "og:title", content: "Terms of Service — Yomi Visuals" },
      { property: "og:description", content: "Engagement, booking and usage terms for Yomi Visuals clients." },
      { property: "og:url", content: "https://yomivisuals.lovable.app/terms" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/terms" }],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" />
      <Container className="py-14">
        <div className="mx-auto max-w-2xl space-y-5 text-[15px] leading-relaxed text-subtle">
          <p>These terms apply to enquiries and bookings made through this website. Project-specific terms are set out in the signed proposal or statement of work.</p>
          <h2 className="text-display pt-4 text-xl text-foreground">Enquiries and bookings</h2>
          <p>A consultation request is not a confirmed engagement. Work begins once a proposal is accepted and any agreed deposit is received.</p>
          <h2 className="text-display pt-4 text-xl text-foreground">Intellectual property</h2>
          <p>Usage rights for delivered assets are defined per project. Yomi Visuals retains the right to display work in its portfolio unless an embargo is agreed in writing.</p>
          <h2 className="text-display pt-4 text-xl text-foreground">Contact</h2>
          <p>Questions about these terms: hello@yomivisuals.com.</p>
        </div>
      </Container>
    </>
  ),
});
