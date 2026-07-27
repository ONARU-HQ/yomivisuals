import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, MapPin } from "lucide-react";

import portrait1 from "@/assets/portrait-1.jpg";
import wedding1 from "@/assets/wedding-1.jpg";
import fashion1 from "@/assets/fashion-1.jpg";
import brand1 from "@/assets/brand-1.jpg";
import family1 from "@/assets/family-1.jpg";
import maternity1 from "@/assets/maternity-1.jpg";

type BookSearch = { exp?: string };

export const Route = createFileRoute("/book")({
  validateSearch: (s: Record<string, unknown>): BookSearch => ({
    exp: typeof s.exp === "string" ? s.exp : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book a Session — Yomi Visuals" },
      {
        name: "description",
        content:
          "Reserve a portrait, wedding, fashion or brand experience with Yomi Visuals. A calm, considered booking flow.",
      },
      { property: "og:title", content: "Book a Session — Yomi Visuals" },
      { property: "og:description", content: "Reserve your session in a few gentle steps." },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  component: BookPage,
});

const experiences = [
  { id: "portrait", name: "Portrait", from: 450000, image: portrait1 },
  { id: "wedding", name: "Wedding", from: 2400000, image: wedding1 },
  { id: "fashion", name: "Fashion", from: 1500000, image: fashion1 },
  { id: "brand", name: "Brand", from: 1200000, image: brand1 },
  { id: "family", name: "Family", from: 650000, image: family1 },
  { id: "maternity", name: "Maternity", from: 520000, image: maternity1 },
];

const packages = [
  { id: "essential", name: "Essential", price: 1, desc: "The core session, 40 memories, one location.", features: ["3 hour session", "40 retouched memories", "Private online gallery"] },
  { id: "signature", name: "Signature", price: 1.6, desc: "Extended time, more locations, print box.", features: ["5 hour session", "80 retouched memories", "Second location", "Print box (10 prints)"] },
  { id: "atelier", name: "Atelier", price: 2.4, desc: "Full studio treatment for heirloom memory.", features: ["Full day", "150+ retouched memories", "Wardrobe & makeup", "Museum-grade heirloom box"] },
];

const times = ["09:00", "11:00", "13:00", "15:00", "17:00"];
const steps = ["Experience", "Package", "Date", "Time", "Location", "Story", "Confirm"];

function formatNaira(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

function BookPage() {
  const { exp: initial } = Route.useSearch();
  const [step, setStep] = useState(0);
  const [exp, setExp] = useState<string | null>(initial ?? null);
  const [pack, setPack] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [story, setStory] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const experience = useMemo(() => experiences.find((e) => e.id === exp), [exp]);
  const packageObj = useMemo(() => packages.find((p) => p.id === pack), [pack]);
  const totalPrice = experience && packageObj ? Math.round(experience.from * packageObj.price) : 0;
  const deposit = Math.round(totalPrice * 0.3);

  // Simple calendar (next 21 days)
  const days = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 21 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() + i + 2);
      return d;
    });
  }, []);

  const canNext =
    (step === 0 && !!exp) ||
    (step === 1 && !!pack) ||
    (step === 2 && !!date) ||
    (step === 3 && !!time) ||
    (step === 4 && location.trim().length > 2) ||
    (step === 5 && story.trim().length > 5) ||
    step === 6;

  const next = () => {
    if (step === 6) {
      setConfirmed(true);
      return;
    }
    if (canNext) setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background pt-28 md:pt-36">
        <div className="mx-auto max-w-2xl px-5 pb-24 text-center md:px-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold bg-gold/10 text-gold">
            <Check className="h-6 w-6" strokeWidth={2} />
          </div>
          <p className="text-eyebrow mt-8">Reserved</p>
          <h1 className="mt-4 text-display text-4xl leading-[1.02] text-primary md:text-6xl">
            Your session is <br />
            <span className="text-editorial text-gold-warm">held for you.</span>
          </h1>
          <p className="mt-6 text-muted-foreground">
            We'll be in touch within 48 hours to confirm the final details. Follow the journey behind
            each memory on{" "}
            <a href="https://instagram.com/yomi.visuals" className="text-gold underline-offset-4 hover:underline">
              @yomi.visuals
            </a>
            .
          </p>

          <div
            className="glass-card mt-10 space-y-3 p-6 text-left"
            style={{ borderRadius: "16px" }}
          >
            <SummaryRow label="Experience" value={experience?.name ?? ""} />
            <SummaryRow label="Package" value={packageObj?.name ?? ""} />
            <SummaryRow label="Date" value={date ? new Date(date).toDateString() : ""} />
            <SummaryRow label="Time" value={time ?? ""} />
            <SummaryRow label="Location" value={location} />
            <SummaryRow label="Total" value={formatNaira(totalPrice)} highlight />
          </div>

          <Link
            to="/"
            className="mt-10 inline-flex items-center gap-2 border border-border px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-primary hover:border-gold"
            style={{ borderRadius: "12px" }}
          >
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32">
      <div className="mx-auto max-w-2xl px-5 pb-40 md:px-10">
        {/* Progress */}
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>
            Step {step + 1} of {steps.length}
          </span>
          <span className="text-gold">{steps[step]}</span>
        </div>
        <div className="mt-3 h-[2px] w-full overflow-hidden bg-border">
          <div
            className="h-full bg-gold transition-[width] duration-700"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="mt-10 fade-up" key={step}>
          {step === 0 && (
            <StepShell
              eyebrow="Choose an experience"
              title="What memory are we creating?"
            >
              <div className="grid grid-cols-2 gap-3">
                {experiences.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => setExp(e.id)}
                    className={`group relative overflow-hidden text-left transition-all duration-500 ${
                      exp === e.id ? "ring-2 ring-gold" : "ring-1 ring-border"
                    }`}
                    style={{ borderRadius: "14px" }}
                  >
                    <div className="relative aspect-[3/4]">
                      <img src={e.image} alt={e.name} loading="lazy" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="text-display text-lg text-primary">{e.name}</p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gold-warm">
                          from {formatNaira(e.from)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {step === 1 && (
            <StepShell eyebrow="Choose a package" title="How deeply should we go?">
              <div className="space-y-3">
                {packages.map((p) => {
                  const price = experience ? Math.round(experience.from * p.price) : 0;
                  const selected = pack === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPack(p.id)}
                      className={`w-full text-left transition-all duration-500 ${
                        selected ? "border-gold bg-gold/5" : "border-border bg-card"
                      } border p-5`}
                      style={{ borderRadius: "14px" }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.22em] text-gold">{p.name}</p>
                          <h3 className="mt-1 text-display text-xl text-primary">{formatNaira(price)}</h3>
                          <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                        </div>
                        <div
                          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors ${
                            selected ? "border-gold bg-gold text-primary-foreground" : "border-border"
                          }`}
                        >
                          {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                        </div>
                      </div>
                      <ul className="mt-4 grid grid-cols-1 gap-1.5 text-xs text-muted-foreground">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-center gap-2">
                            <span className="h-1 w-1 rounded-full bg-gold" /> {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </StepShell>
          )}

          {step === 2 && (
            <StepShell eyebrow="Choose a date" title="When shall we meet?">
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                {days.map((d) => {
                  const key = d.toISOString();
                  const selected = date === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setDate(key)}
                      className={`flex flex-col items-center rounded-xl border py-3 transition-all ${
                        selected ? "border-gold bg-gold/10 text-primary" : "border-border text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-[0.2em]">
                        {d.toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <span className="mt-1 text-lg text-display">
                        {d.getDate()}
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.18em]">
                        {d.toLocaleDateString("en-US", { month: "short" })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </StepShell>
          )}

          {step === 3 && (
            <StepShell eyebrow="Choose a time" title="What hour suits you?">
              <div className="grid grid-cols-3 gap-3">
                {times.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    className={`rounded-xl border py-4 text-center transition-all ${
                      time === t
                        ? "border-gold bg-gold/10 text-primary"
                        : "border-border text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <span className="text-display text-lg">{t}</span>
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {step === 4 && (
            <StepShell eyebrow="Location" title="Where should we meet?">
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-gold" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Studio, Ikoyi · or a specific address"
                  className="w-full border border-border bg-card py-4 pl-11 pr-5 text-sm text-primary placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
                  style={{ borderRadius: "14px" }}
                />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Not sure yet? Write "studio" and we'll suggest a space that fits the memory.
              </p>
            </StepShell>
          )}

          {step === 5 && (
            <StepShell eyebrow="Your story" title="Tell us about the memory.">
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={6}
                placeholder="Who is this for? What should we capture? What matters most about this moment?"
                className="w-full border border-border bg-card p-5 text-sm text-primary placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
                style={{ borderRadius: "14px" }}
              />
            </StepShell>
          )}

          {step === 6 && (
            <StepShell eyebrow="Confirm" title="A final look, then we hold your date.">
              <div
                className="glass-card space-y-3 p-6"
                style={{ borderRadius: "16px" }}
              >
                <SummaryRow label="Experience" value={experience?.name ?? ""} />
                <SummaryRow label="Package" value={packageObj?.name ?? ""} />
                <SummaryRow
                  label="When"
                  value={`${date ? new Date(date).toDateString() : ""} · ${time ?? ""}`}
                />
                <SummaryRow label="Location" value={location} />
                <div className="mt-4 border-t border-border pt-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Session total</span>
                    <span className="text-primary">{formatNaira(totalPrice)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[0.22em] text-gold">
                      Deposit (30%)
                    </span>
                    <span className="text-display text-2xl text-primary">
                      {formatNaira(deposit)}
                    </span>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    Deposit is due to reserve your date. The balance is invoiced the day before your session.
                    Payment step is prepared for the next release.
                  </p>
                </div>
              </div>
            </StepShell>
          )}
        </div>
      </div>

      {/* Sticky footer nav */}
      <div
        className="fixed inset-x-0 bottom-16 z-30 border-t border-border md:bottom-0"
        style={{
          background: "rgba(5,5,5,0.9)",
          backdropFilter: "saturate(180%) blur(20px)",
        }}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-5 py-4 md:px-10">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground disabled:opacity-30"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!canNext}
            className="inline-flex items-center gap-2 bg-gold px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition-all duration-500 hover:bg-gold-warm disabled:cursor-not-allowed disabled:opacity-40"
            style={{ borderRadius: "12px" }}
          >
            {step === 6 ? "Reserve session" : "Continue"}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StepShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-eyebrow mb-4">{eyebrow}</p>
      <h1 className="text-display text-3xl leading-[1.05] text-primary md:text-5xl">{title}</h1>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </span>
      <span className={`text-right text-sm ${highlight ? "text-gold-warm text-lg" : "text-primary"}`}>
        {value || "—"}
      </span>
    </div>
  );
}
