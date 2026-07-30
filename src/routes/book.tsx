import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { servicesQuery } from "@/lib/cms";
import { Container, PageHero, Field, inputClass, Button } from "@/components/site/ui";

export const Route = createFileRoute("/book")({
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  head: () => ({
    meta: [
      { title: "Book a Consultation — Yomi Visuals" },
      {
        name: "description",
        content:
          "Tell us about your brand and objectives. We respond within one working day and send a proposal within five.",
      },
      { property: "og:title", content: "Book a Consultation — Yomi Visuals" },
      { property: "og:description", content: "Start a project with Yomi Visuals, a creative agency in Lagos." },
      { property: "og:url", content: "https://yomivisuals.lovable.app/book" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/book" }],
  }),
  component: BookPage,
});

const budgets = ["Under ₦500,000", "₦500,000 – ₦2M", "₦2M – ₦5M", "₦5M – ₦15M", "₦15M+"];

function BookPage() {
  const { data: services } = useSuspenseQuery(servicesQuery);
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
      budget: String(fd.get("budget") ?? "") || null,
      preferred_date: String(fd.get("date") ?? "") || null,
      preferred_time: String(fd.get("time") ?? "") || null,
      message: String(fd.get("message") ?? "").trim() || null,
    };
    if (!payload.name || !payload.email.includes("@")) {
      setError("Please enter your name and a valid email address.");
      return;
    }
    setSending(true);
    setError(null);
    const { error: dbError } = await supabase.from("bookings").insert(payload);
    setSending(false);
    if (dbError) {
      setError("Something went wrong. Please email hello@yomivisuals.com.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <Container className="flex min-h-[80svh] flex-col items-center justify-center py-32 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full border border-border-strong">
          <Check className="h-6 w-6" />
        </div>
        <h1 className="text-display mt-8 text-[clamp(2rem,5vw,3.2rem)]">Request received.</h1>
        <p className="mt-5 max-w-md text-[15px] text-muted-foreground">
          We'll confirm your consultation within one working day. Check your inbox — and your spam folder, just in case.
        </p>
        <Link
          to="/projects"
          className="mt-10 inline-flex items-center rounded-full border border-border-strong px-6 py-3.5 text-[13px] font-medium"
        >
          Explore our work
        </Link>
      </Container>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Consultation"
        title="Tell us where the brand is going."
        body="A 30-minute call to understand the objective, the audience and the timeline. No pitch theatre."
      />

      <Container className="py-14 md:py-20">
        <form onSubmit={onSubmit} className="panel mx-auto max-w-2xl space-y-5 p-6 md:p-10">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name">
              <input name="name" required className={inputClass} placeholder="Ada Obi" />
            </Field>
            <Field label="Email">
              <input name="email" type="email" required className={inputClass} placeholder="you@company.com" />
            </Field>
            <Field label="Phone">
              <input name="phone" className={inputClass} placeholder="+234 …" />
            </Field>
            <Field label="Company">
              <input name="company" className={inputClass} placeholder="Company name" />
            </Field>
            <Field label="Service">
              <select name="service" className={inputClass} defaultValue="">
                <option value="">Select a service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Budget range">
              <select name="budget" className={inputClass} defaultValue="">
                <option value="">Select a range</option>
                {budgets.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Preferred date">
              <input name="date" type="date" className={inputClass} />
            </Field>
            <Field label="Preferred time">
              <select name="time" className={inputClass} defaultValue="">
                <option value="">Select a time</option>
                {["09:00", "11:00", "13:00", "15:00", "17:00"].map((t) => (
                  <option key={t} value={t}>
                    {t} WAT
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Project brief">
            <textarea
              name="message"
              rows={5}
              className={inputClass}
              placeholder="What are you launching, and what does success look like?"
            />
          </Field>

          {error ? <p className="text-[13px] text-destructive">{error}</p> : null}

          <Button type="submit" disabled={sending} className="w-full">
            {sending ? "Sending…" : "Request consultation"}
          </Button>
          <p className="text-center text-[12px] text-muted-foreground">
            We reply within one working day. Proposals within five.
          </p>
        </form>
      </Container>
    </>
  );
}
