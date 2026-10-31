import { createFileRoute } from "@tanstack/react-router";
import { INSTAGRAM_URL, STUDIO_URL } from "@/content/site";
import { LeadForm } from "@/components/btf/LeadForm";
import { PageHead, Main } from "@/components/btf/PageHead";
import { seo } from "@/lib/film/seo";

export const Route = createFileRoute("/contact")({
  head: () => seo({ title: "Contact | Yomi Visuals", description: "Get in touch with Yomi Visuals.", path: "/contact" }),
  component: Contact,
});

function Contact() {
  return (
    <Main>
      <PageHead eyebrow="The connection" title="Say hello.">A short note is enough. You will get a reply by email.</PageHead>
      <div className="film-pad mx-auto grid max-w-[1400px] gap-16 pb-24 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-8 text-[15px]">
          <div><p className="film-eyebrow">Email</p><a className="mt-2 block text-xl hover:text-[var(--film-gold)]" href="mailto:hello@yomivisuals.com">hello@yomivisuals.com</a></div>
          <div><p className="film-eyebrow">Instagram</p><a className="mt-2 block text-xl hover:text-[var(--film-gold)]" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">@yomi.visuals<span className="sr-only"> (opens in a new tab)</span></a></div>
          <div className="border border-white/15 p-6"><p className="film-eyebrow film-eyebrow--gold">Studio bookings</p><p className="mt-2 text-[14.5px] text-[var(--film-muted)]">Photography, video and studio hire are booked through YV Studios Africa.</p><a href={STUDIO_URL} target="_blank" rel="noopener noreferrer" className="film-btn film-btn--line mt-4">YV Studios ↗<span className="sr-only"> (opens in a new tab)</span></a></div>
        </div>
        <LeadForm source="contact" enquiries={["General", "Collaboration", "Press", "Something else"]} />
      </div>
    </Main>
  );
}
