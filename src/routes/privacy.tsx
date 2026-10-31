import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHero } from "@/components/site/ui";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Yomi Visuals" },
      { name: "description", content: "How Yomi Visuals collects, uses and protects the information you share through this website." },
      { property: "og:title", content: "Privacy Policy — Yomi Visuals" },
      { property: "og:description", content: "Our approach to data, enquiries and marketing consent." },
      { property: "og:url", content: "https://yomivisuals.com/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.com/privacy" }],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <Container className="py-14">
        <div className="mx-auto max-w-2xl space-y-5 text-[15px] leading-relaxed text-subtle">
          <p>This page is maintained by Yomi Visuals to explain how we handle information submitted through this website.</p>
          <h2 className="text-display pt-4 text-xl text-foreground">What we collect</h2>
          <p>When you submit an enquiry, consultation request or newsletter signup we store the details you provide: name, email, phone, company, service interest, budget range and your message.</p>
          <h2 className="text-display pt-4 text-xl text-foreground">How we use it</h2>
          <p>We use it only to respond to your enquiry, prepare proposals and — where you opted in — send occasional studio updates. We do not sell your data.</p>
          <h2 className="text-display pt-4 text-xl text-foreground">Retention and requests</h2>
          <p>Enquiry records are kept while the relationship is active. To access, correct or delete your data, email hello@yomivisuals.com and we will action it.</p>
        </div>
      </Container>
    </>
  ),
});
