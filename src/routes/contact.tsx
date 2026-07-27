import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Yomi Visuals" },
      {
        name: "description",
        content:
          "Reach the studio. WhatsApp, email, or book a call. Yomi Visuals is based in Lagos, Nigeria and available worldwide.",
      },
      { property: "og:title", content: "Contact — Yomi Visuals" },
      { property: "og:description", content: "Start a conversation with the studio." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message.length > 4) setSent(true);
  };

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32">
      <section className="mx-auto grid max-w-[1400px] gap-16 px-5 md:grid-cols-12 md:px-10">
        <div className="md:col-span-6">
          <p className="text-eyebrow mb-5">Contact</p>
          <h1 className="text-display text-4xl leading-[1] text-primary md:text-7xl">
            Tell us the <br />
            <span className="text-editorial text-gold-warm">memory</span> you want to keep.
          </h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground md:text-lg">
            We personally reply within 48 hours. For urgent inquiries, WhatsApp is fastest.
          </p>

          <div className="mt-10 space-y-3">
            <ContactRow
              icon={MessageCircle}
              label="WhatsApp"
              value="+234 800 000 0000"
              href="https://wa.me/2348000000000"
            />
            <ContactRow
              icon={Phone}
              label="Call the studio"
              value="+234 800 000 0000"
              href="tel:+2348000000000"
            />
            <ContactRow
              icon={Mail}
              label="Email"
              value="hello@yomivisuals.com"
              href="mailto:hello@yomivisuals.com"
            />
            <ContactRow
              icon={Instagram}
              label="Instagram"
              value="@yomi.visuals"
              href="https://instagram.com/yomi.visuals"
            />
            <ContactRow
              icon={MapPin}
              label="Studio"
              value="Ikoyi, Lagos · By appointment"
              href="https://maps.google.com/?q=Ikoyi+Lagos"
            />
          </div>
        </div>

        <div className="md:col-span-6">
          <div
            className="glass-card p-6 md:p-8"
            style={{ borderRadius: "16px" }}
          >
            {sent ? (
              <div className="py-16 text-center">
                <p className="text-eyebrow mb-4">Received</p>
                <p className="text-display text-3xl text-primary md:text-4xl">
                  Thank you.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Your note is with the studio. We'll write back within 48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <Field label="Your name">
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-border bg-background/40 px-5 py-4 text-sm text-primary placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
                    style={{ borderRadius: "12px" }}
                    placeholder="Adaeze Okonkwo"
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-border bg-background/40 px-5 py-4 text-sm text-primary placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
                    style={{ borderRadius: "12px" }}
                    placeholder="you@example.com"
                  />
                </Field>
                <Field label="Your story">
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-border bg-background/40 px-5 py-4 text-sm text-primary placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
                    style={{ borderRadius: "12px" }}
                    placeholder="Tell us about the memory you'd like to create..."
                  />
                </Field>
                <button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 bg-gold py-4 text-[11px] uppercase tracking-[0.22em] text-primary-foreground hover:bg-gold-warm transition-colors"
                  style={{ borderRadius: "12px" }}
                >
                  Send message <ArrowUpRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <div className="mt-24" />
      <SiteFooter />
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center justify-between gap-4 border border-border bg-card p-4 transition-colors hover:border-gold/40"
      style={{ borderRadius: "12px" }}
    >
      <div className="flex items-center gap-4">
        <div className="grid h-10 w-10 place-items-center rounded-full border border-border text-gold">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {label}
          </p>
          <p className="text-primary">{value}</p>
        </div>
      </div>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-warm" />
    </a>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
