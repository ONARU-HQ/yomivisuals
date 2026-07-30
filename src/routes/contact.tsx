import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery, servicesQuery } from "@/lib/cms";
import { Container, PageHero, Field, inputClass, Button } from "@/components/site/ui";

export const Route = createFileRoute("/contact")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(servicesQuery),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Contact Yomi Visuals — Creative Agency, Lagos" },
      { name: "description", content: "Talk to Yomi Visuals about a campaign, brand or production. Lagos-based, working across Nigeria and internationally." },
      { property: "og:title", content: "Contact Yomi Visuals" },
      { property: "og:description", content: "Get in touch with the Yomi Visuals studio in Lagos." },
      { property: "og:url", content: "https://yomivisuals.lovable.app/contact" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const { data: services } = useSuspenseQuery(servicesQuery);
  const company = settings.company ?? {};
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim() || null,
      company: String(fd.get("company") ?? "").trim() || null,
      service: String(fd.get("service") ?? "") || null,
      message: String(fd.get("message") ?? "").trim() || null,
      source: "contact",
    };
    if (!payload.name || !payload.email.includes("@")) {
      setError("Please enter your name and a valid email address.");
      return;
    }
    setSending(true);
    setError(null);
    const { error: dbError } = await supabase.from("leads").insert(payload);
    setSending(false);
    if (dbError) setError("Something went wrong. Please email us directly.");
    else setDone(true);
  }

  return (
    <>
      <PageHero eyebrow="Contact" title="Start a conversation." body="Tell us what you're working on. We answer every serious enquiry within one working day." />
      <Container className="grid gap-12 py-14 md:grid-cols-2 md:py-20">
        <div className="space-y-8">
          {[
            ["Email", company.email],
            ["Phone", company.phone],
            ["Studio", company.address],
            ["Hours", company.hours],
          ].map(([label, value]) => (
            <div key={String(label)}>
              <p className="text-eyebrow">{label as string}</p>
              <p className="mt-2 text-[15px]">{(value as string) ?? "—"}</p>
            </div>
          ))}
        </div>

        {done ? (
          <div className="panel p-8">
            <h2 className="text-display text-2xl">Message received.</h2>
            <p className="mt-3 text-[14px] text-muted-foreground">We'll be in touch within one working day.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="panel space-y-5 p-6 md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name"><input name="name" required className={inputClass} /></Field>
              <Field label="Email"><input name="email" type="email" required className={inputClass} /></Field>
              <Field label="Phone"><input name="phone" className={inputClass} /></Field>
              <Field label="Company"><input name="company" className={inputClass} /></Field>
            </div>
            <Field label="Service">
              <select name="service" className={inputClass} defaultValue="">
                <option value="">Select a service</option>
                {services.map((s) => <option key={s.id} value={s.title}>{s.title}</option>)}
              </select>
            </Field>
            <Field label="Message"><textarea name="message" rows={5} className={inputClass} /></Field>
            {error ? <p className="text-[13px] text-destructive">{error}</p> : null}
            <Button type="submit" disabled={sending} className="w-full">{sending ? "Sending…" : "Send message"}</Button>
          </form>
        )}
      </Container>
    </>
  );
}
