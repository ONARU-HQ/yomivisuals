import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, Check, MapPin, Upload, Copy, CheckCircle2, Printer, Calendar, Clock,
} from "lucide-react";
import { services as SERVICES, formatNaira } from "@/lib/services-data";
import type { Package, Service } from "@/lib/services-data";

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
          "Reserve your Yomi Visuals commission in nine calm steps. Choose a service, pick a package, upload your payment proof — receipt generated instantly.",
      },
      { property: "og:title", content: "Book a Session — Yomi Visuals" },
      { property: "og:description", content: "Nine calm steps to reserve your commission." },
      { property: "og:url", content: "https://yomivisuals.lovable.app/book" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/book" }],
  }),
  component: BookPage,
});

const BANK = {
  bank: "Moniepoint MFB",
  account: "6346870672",
  name: "Yomi Visuals Studio",
};

const STEPS = [
  "Service",
  "Package",
  "Date",
  "Time",
  "Location",
  "Details",
  "Delivery",
  "Payment",
  "Confirm",
] as const;

const DELIVERY_TIERS = [
  { id: "standard", name: "Standard", detail: "10 business days", fee: 0 },
  { id: "priority", name: "Priority", detail: "5 business days", fee: 80000 },
  { id: "rush", name: "Rush", detail: "48 hours", fee: 180000 },
  { id: "same-day", name: "Same Day", detail: "Delivered day of", fee: 320000 },
] as const;

type State = {
  serviceSlug?: string;
  packageId?: string;
  date?: string;
  time?: string;
  location?: string;
  address?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  requests?: string;
  delivery?: string;
  paymentRef?: string;
  proofName?: string;
  proofDataUrl?: string;
  confirmed?: boolean;
  bookingId?: string;
};

const LS_KEY = "yv:booking:v1";

function BookPage() {
  const search = Route.useSearch();
  const [step, setStep] = useState(0);
  const [s, setS] = useState<State>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // preselect from ?exp=
  useEffect(() => {
    if (search.exp && !s.serviceSlug) {
      setS((prev) => ({ ...prev, serviceSlug: search.exp }));
    }
  }, [search.exp, s.serviceSlug]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(s));
    } catch {}
  }, [s]);

  const service: Service | undefined = useMemo(
    () => SERVICES.find((x) => x.slug === s.serviceSlug),
    [s.serviceSlug],
  );
  const pkg: Package | undefined = useMemo(
    () => service?.packages.find((p) => p.id === s.packageId),
    [service, s.packageId],
  );
  const deliveryTier = useMemo(
    () => DELIVERY_TIERS.find((d) => d.id === (s.delivery ?? "standard")),
    [s.delivery],
  );
  const total = (pkg?.price ?? 0) + (deliveryTier?.fee ?? 0);
  const deposit = Math.round(total * 0.3);

  const canNext = useMemo(() => {
    switch (step) {
      case 0: return !!s.serviceSlug;
      case 1: return !!s.packageId;
      case 2: return !!s.date;
      case 3: return !!s.time;
      case 4: return !!s.location && (s.location !== "on-location" || !!s.address);
      case 5: return !!s.clientName && !!s.clientEmail && !!s.clientPhone;
      case 6: return !!s.delivery;
      case 7: return !!s.paymentRef && !!s.proofDataUrl;
      default: return true;
    }
  }, [step, s]);

  const goNext = () => {
    if (step < STEPS.length - 1 && canNext) setStep(step + 1);
  };
  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const finalize = () => {
    const id = `YV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setS((prev) => ({ ...prev, confirmed: true, bookingId: id }));
    setStep(STEPS.length - 1);
  };

  const reset = () => {
    localStorage.removeItem(LS_KEY);
    setS({});
    setStep(0);
  };

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32">
      <section className="mx-auto max-w-[1100px] px-5 md:px-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-eyebrow mb-3">Reserve</p>
            <h1 className="text-display text-3xl leading-[1.05] text-primary md:text-5xl">
              {s.confirmed ? "You're booked." : "Book a session."}
            </h1>
          </div>
          {!s.confirmed && (
            <p className="hidden text-[10px] uppercase tracking-[0.26em] text-muted-foreground md:block">
              Step {step + 1} / {STEPS.length}
            </p>
          )}
        </div>

        {!s.confirmed && (
          <>
            {/* Progress */}
            <div className="mt-8 grid grid-cols-9 gap-1">
              {STEPS.map((label, i) => (
                <div
                  key={label}
                  className={`h-1 rounded-full transition-colors duration-500 ${
                    i <= step ? "bg-gold" : "bg-border"
                  }`}
                  title={label}
                />
              ))}
            </div>
            <p className="mt-3 text-[10px] uppercase tracking-[0.26em] text-muted-foreground md:hidden">
              Step {step + 1} / {STEPS.length} · {STEPS[step]}
            </p>
          </>
        )}
      </section>

      <section className="mx-auto mt-10 max-w-[1100px] px-5 pb-16 md:mt-14 md:px-10 md:pb-24">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <div
              className="border border-border bg-card p-6 md:p-10"
              style={{ borderRadius: "16px" }}
            >
              {step === 0 && <StepService state={s} onChange={setS} />}
              {step === 1 && service && <StepPackage service={service} state={s} onChange={setS} />}
              {step === 2 && <StepDate state={s} onChange={setS} />}
              {step === 3 && <StepTime state={s} onChange={setS} />}
              {step === 4 && <StepLocation state={s} onChange={setS} />}
              {step === 5 && <StepDetails state={s} onChange={setS} />}
              {step === 6 && <StepDelivery state={s} onChange={setS} />}
              {step === 7 && <StepPayment state={s} onChange={setS} total={total} deposit={deposit} />}
              {step === 8 && s.confirmed && (
                <StepReceipt state={s} service={service} pkg={pkg} total={total} deposit={deposit} onReset={reset} />
              )}
              {step === 8 && !s.confirmed && (
                <StepReview state={s} service={service} pkg={pkg} total={total} deposit={deposit} onConfirm={finalize} />
              )}
            </div>

            {!s.confirmed && (
              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-primary transition disabled:opacity-40 hover:enabled:border-gold hover:enabled:text-gold-warm"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canNext}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition disabled:opacity-40 hover:enabled:bg-gold-warm"
                  >
                    Continue <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={finalize}
                    disabled={!s.paymentRef || !s.proofDataUrl}
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition disabled:opacity-40 hover:enabled:bg-gold-warm"
                  >
                    Confirm booking <Check className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Summary rail */}
          <aside className="md:col-span-4">
            <div
              className="sticky top-28 border border-border bg-surface p-6 md:p-7"
              style={{ borderRadius: "16px" }}
            >
              <p className="text-eyebrow mb-4">Summary</p>
              <SummaryRow label="Service" value={service?.name ?? "—"} />
              <SummaryRow label="Package" value={pkg?.name ?? "—"} />
              <SummaryRow label="Date" value={s.date ?? "—"} />
              <SummaryRow label="Time" value={s.time ?? "—"} />
              <SummaryRow label="Delivery" value={deliveryTier?.name ?? "—"} />
              <div className="mt-5 border-t border-border pt-5">
                <SummaryRow label="Package" value={pkg ? formatNaira(pkg.price) : "—"} />
                {deliveryTier && deliveryTier.fee > 0 && (
                  <SummaryRow label="Delivery" value={formatNaira(deliveryTier.fee)} />
                )}
                <div className="mt-3 flex items-baseline justify-between">
                  <p className="text-[10px] uppercase tracking-[0.26em] text-gold">Total</p>
                  <p className="text-display text-2xl text-primary">{total ? formatNaira(total) : "—"}</p>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <p className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground">Deposit (30%)</p>
                  <p className="text-sm text-primary">{deposit ? formatNaira(deposit) : "—"}</p>
                </div>
              </div>
              <p className="mt-6 text-[10px] leading-relaxed text-muted-foreground">
                30% deposit reserves your date. Balance due the day before your session.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-2">
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      <p className="text-right text-sm text-primary">{value}</p>
    </div>
  );
}

// ===================== STEPS =====================

function StepService({ state, onChange }: { state: State; onChange: (u: State) => void }) {
  return (
    <div>
      <h2 className="text-display text-2xl text-primary md:text-3xl">Choose your service.</h2>
      <p className="mt-2 text-sm text-muted-foreground">Every discipline is bookable end-to-end.</p>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SERVICES.map((svc) => {
          const active = state.serviceSlug === svc.slug;
          const from = Math.min(...svc.packages.map((p) => p.price));
          return (
            <button
              key={svc.slug}
              type="button"
              onClick={() => onChange({ ...state, serviceSlug: svc.slug, packageId: undefined })}
              className={`group text-left overflow-hidden border transition-all duration-500 ${
                active ? "border-gold" : "border-border hover:border-gold/50"
              }`}
              style={{ borderRadius: "12px" }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={svc.cover} alt={svc.name} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.22em] text-gold-warm">from {formatNaira(from)}</p>
                    <p className="text-display text-lg text-primary">{svc.name}</p>
                  </div>
                  {active && <Check className="h-5 w-5 text-gold" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepPackage({ service, state, onChange }: { service: Service; state: State; onChange: (u: State) => void }) {
  return (
    <div>
      <h2 className="text-display text-2xl text-primary md:text-3xl">Choose your package.</h2>
      <p className="mt-2 text-sm text-muted-foreground">{service.name} · {service.packages.length} options.</p>
      <div className="mt-8 space-y-3">
        {service.packages.map((p) => {
          const active = state.packageId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange({ ...state, packageId: p.id })}
              className={`w-full text-left border p-5 transition ${
                active ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"
              }`}
              style={{ borderRadius: "12px" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-gold">{p.name}</p>
                  <p className="mt-1 text-display text-2xl text-primary md:text-3xl">{formatNaira(p.price)}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{p.duration}</p>
                  <ul className="mt-4 grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
                    {p.includes.map((inc) => (
                      <li key={inc} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {active && <div className="grid h-8 w-8 place-items-center rounded-full bg-gold text-primary-foreground"><Check className="h-4 w-4" /></div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepDate({ state, onChange }: { state: State; onChange: (u: State) => void }) {
  const today = new Date();
  const minDate = new Date(today.getTime() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  return (
    <div>
      <h2 className="text-display text-2xl text-primary md:text-3xl">Pick your date.</h2>
      <p className="mt-2 text-sm text-muted-foreground">Reserve at least 7 days ahead.</p>
      <div className="mt-8 max-w-sm">
        <label className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
          <Calendar className="h-4 w-4 text-gold" />
          <input
            type="date"
            min={minDate}
            value={state.date ?? ""}
            onChange={(e) => onChange({ ...state, date: e.target.value })}
            className="w-full bg-transparent text-primary outline-none"
          />
        </label>
      </div>
    </div>
  );
}

function StepTime({ state, onChange }: { state: State; onChange: (u: State) => void }) {
  const slots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00", "18:30"];
  return (
    <div>
      <h2 className="text-display text-2xl text-primary md:text-3xl">Choose a time.</h2>
      <p className="mt-2 text-sm text-muted-foreground">Studio time is by appointment only.</p>
      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {slots.map((t) => {
          const active = state.time === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ ...state, time: t })}
              className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm transition ${
                active ? "border-gold bg-gold/10 text-gold-warm" : "border-border text-primary hover:border-gold/50"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepLocation({ state, onChange }: { state: State; onChange: (u: State) => void }) {
  const options = [
    { id: "studio", name: "Studio", detail: "Yomi Visuals · Lekki, Lagos" },
    { id: "on-location", name: "On location", detail: "Anywhere in Lagos or beyond" },
    { id: "outside-lagos", name: "Outside Lagos", detail: "Travel quoted separately" },
  ];
  return (
    <div>
      <h2 className="text-display text-2xl text-primary md:text-3xl">Where?</h2>
      <p className="mt-2 text-sm text-muted-foreground">Choose a setting for the session.</p>
      <div className="mt-8 space-y-3">
        {options.map((o) => {
          const active = state.location === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange({ ...state, location: o.id })}
              className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
                active ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"
              }`}
            >
              <MapPin className="mt-1 h-5 w-5 text-gold" />
              <div>
                <p className="text-display text-lg text-primary">{o.name}</p>
                <p className="text-sm text-muted-foreground">{o.detail}</p>
              </div>
            </button>
          );
        })}
        {(state.location === "on-location" || state.location === "outside-lagos") && (
          <input
            type="text"
            placeholder="Address or city"
            value={state.address ?? ""}
            onChange={(e) => onChange({ ...state, address: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-primary outline-none focus:border-gold"
          />
        )}
      </div>
    </div>
  );
}

function StepDetails({ state, onChange }: { state: State; onChange: (u: State) => void }) {
  return (
    <div>
      <h2 className="text-display text-2xl text-primary md:text-3xl">Your details.</h2>
      <p className="mt-2 text-sm text-muted-foreground">So we can reach you and prepare your session.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Field label="Full name" value={state.clientName} onChange={(v) => onChange({ ...state, clientName: v })} />
        <Field label="Email" type="email" value={state.clientEmail} onChange={(v) => onChange({ ...state, clientEmail: v })} />
        <Field label="Phone" type="tel" value={state.clientPhone} onChange={(v) => onChange({ ...state, clientPhone: v })} />
      </div>
      <div className="mt-4">
        <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Special requests</label>
        <textarea
          rows={4}
          value={state.requests ?? ""}
          onChange={(e) => onChange({ ...state, requests: e.target.value })}
          placeholder="Mood, references, wardrobe notes, accessibility needs…"
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-primary outline-none focus:border-gold"
        />
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text",
}: { label: string; value?: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-primary outline-none focus:border-gold"
      />
    </label>
  );
}

function StepDelivery({ state, onChange }: { state: State; onChange: (u: State) => void }) {
  return (
    <div>
      <h2 className="text-display text-2xl text-primary md:text-3xl">Delivery speed.</h2>
      <p className="mt-2 text-sm text-muted-foreground">How soon do you need your memories?</p>
      <div className="mt-8 space-y-3">
        {DELIVERY_TIERS.map((t) => {
          const active = (state.delivery ?? "standard") === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange({ ...state, delivery: t.id })}
              className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                active ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"
              }`}
            >
              <div>
                <p className="text-display text-lg text-primary">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.detail}</p>
              </div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-gold">
                {t.fee === 0 ? "Included" : `+ ${formatNaira(t.fee)}`}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepPayment({
  state, onChange, total, deposit,
}: { state: State; onChange: (u: State) => void; total: number; deposit: number }) {
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const copy = async (v: string, k: string) => {
    try {
      await navigator.clipboard.writeText(v);
      setCopied(k);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  const onFile = (f: File) => {
    if (f.size > 5 * 1024 * 1024) {
      alert("Please upload an image under 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ ...state, proofName: f.name, proofDataUrl: String(reader.result) });
    };
    reader.readAsDataURL(f);
  };

  return (
    <div>
      <h2 className="text-display text-2xl text-primary md:text-3xl">Bank transfer.</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Transfer the deposit of <span className="text-primary">{formatNaira(deposit)}</span> to reserve your date.
        Balance of {formatNaira(total - deposit)} due before session day.
      </p>

      <div className="mt-6 rounded-2xl border border-gold/40 bg-gold/5 p-5 md:p-6">
        <p className="text-[10px] uppercase tracking-[0.26em] text-gold">Bank details</p>
        {[
          { k: "bank", label: "Bank", value: BANK.bank },
          { k: "account", label: "Account", value: BANK.account },
          { k: "name", label: "Name", value: BANK.name },
          { k: "amount", label: "Amount", value: formatNaira(deposit) },
        ].map((row) => (
          <div key={row.k} className="mt-4 flex items-center justify-between border-t border-gold/20 pt-4 first:mt-3 first:border-none first:pt-0">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{row.label}</p>
              <p className="mt-1 text-display text-lg text-primary md:text-xl">{row.value}</p>
            </div>
            <button
              type="button"
              onClick={() => copy(row.value, row.k)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-primary hover:border-gold hover:text-gold-warm"
            >
              {copied === row.k ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4">
        <Field
          label="Transaction reference"
          value={state.paymentRef}
          onChange={(v) => onChange({ ...state, paymentRef: v })}
        />

        <div>
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Upload payment proof</span>
          <label
            htmlFor="proof"
            className="mt-2 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-dashed border-border px-4 py-4 hover:border-gold"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gold/10 text-gold">
                <Upload className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-primary">
                  {state.proofName ?? "Screenshot or receipt (PNG / JPG, up to 5 MB)"}
                </p>
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {state.proofDataUrl ? "Uploaded ✓" : "Tap to select"}
                </p>
              </div>
            </div>
          </label>
          <input
            id="proof"
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
          {state.proofDataUrl && (
            <div className="mt-3 overflow-hidden rounded-xl border border-border">
              <img src={state.proofDataUrl} alt="Payment proof" className="max-h-56 w-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepReview({
  state, service, pkg, total, deposit, onConfirm,
}: {
  state: State; service?: Service; pkg?: Package; total: number; deposit: number; onConfirm: () => void;
}) {
  return (
    <div>
      <h2 className="text-display text-2xl text-primary md:text-3xl">One last look.</h2>
      <p className="mt-2 text-sm text-muted-foreground">Review your booking, then confirm.</p>

      <dl className="mt-8 grid gap-3 sm:grid-cols-2">
        <Info k="Service" v={service?.name} />
        <Info k="Package" v={pkg?.name} />
        <Info k="Date" v={state.date} />
        <Info k="Time" v={state.time} />
        <Info k="Location" v={state.location} />
        <Info k="Delivery" v={state.delivery} />
        <Info k="Name" v={state.clientName} />
        <Info k="Email" v={state.clientEmail} />
        <Info k="Phone" v={state.clientPhone} />
        <Info k="Address" v={state.address} />
        <Info k="Reference" v={state.paymentRef} />
        <Info k="Proof" v={state.proofName ? "Uploaded ✓" : "—"} />
      </dl>

      <div className="mt-6 rounded-xl border border-border bg-background p-5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-gold">Payment</p>
        <div className="mt-2 flex items-baseline justify-between">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-display text-xl text-primary">{formatNaira(total)}</p>
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <p className="text-sm text-muted-foreground">Deposit paid (30%)</p>
          <p className="text-sm text-primary">{formatNaira(deposit)}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onConfirm}
        className="mt-8 hidden w-full items-center justify-center gap-2 rounded-xl bg-gold py-4 text-[11px] uppercase tracking-[0.22em] text-primary-foreground hover:bg-gold-warm"
      >
        Confirm booking <Check className="h-4 w-4" />
      </button>
    </div>
  );
}

function Info({ k, v }: { k: string; v?: string }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{k}</p>
      <p className="mt-1 text-sm text-primary">{v || "—"}</p>
    </div>
  );
}

function StepReceipt({
  state, service, pkg, total, deposit, onReset,
}: {
  state: State; service?: Service; pkg?: Package; total: number; deposit: number; onReset: () => void;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/15 text-gold">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <h2 className="mt-6 text-display text-3xl text-primary md:text-4xl">You're booked.</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        A confirmation has been sent to <span className="text-primary">{state.clientEmail}</span>.
        Our team will reach out within 24 hours.
      </p>

      <div className="mt-10 rounded-2xl border border-gold/40 bg-gold/5 p-6 text-left md:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-gold/20 pb-4">
          <div>
            <p className="text-eyebrow">Receipt</p>
            <p className="mt-2 text-display text-xl text-primary md:text-2xl">Yomi Visuals</p>
            <p className="text-xs text-muted-foreground">Lagos, Nigeria · yomi.visuals</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.22em] text-gold">Booking</p>
            <p className="mt-1 text-display text-lg text-primary">{state.bookingId}</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <dl className="mt-4 grid gap-2 sm:grid-cols-2">
          <ReceiptRow k="Client" v={state.clientName} />
          <ReceiptRow k="Email" v={state.clientEmail} />
          <ReceiptRow k="Phone" v={state.clientPhone} />
          <ReceiptRow k="Service" v={service?.name} />
          <ReceiptRow k="Package" v={pkg?.name} />
          <ReceiptRow k="Date" v={state.date} />
          <ReceiptRow k="Time" v={state.time} />
          <ReceiptRow k="Location" v={state.location} />
        </dl>

        <div className="mt-5 border-t border-gold/20 pt-4">
          <div className="flex items-baseline justify-between">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-display text-2xl text-primary">{formatNaira(total)}</p>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-sm text-muted-foreground">Deposit paid (30%)</p>
            <p className="text-sm text-primary">{formatNaira(deposit)}</p>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-sm text-muted-foreground">Balance due</p>
            <p className="text-sm text-primary">{formatNaira(total - deposit)}</p>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-sm text-muted-foreground">Reference</p>
            <p className="text-sm text-primary">{state.paymentRef}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-primary hover:border-gold hover:text-gold-warm"
        >
          <Printer className="h-3.5 w-3.5" /> Print receipt
        </button>
        <Link
          to="/account"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-primary-foreground hover:bg-gold-warm"
        >
          Go to my account
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-primary"
        >
          Book another
        </button>
      </div>
    </div>
  );
}

function ReceiptRow({ k, v }: { k: string; v?: string }) {
  return (
    <div className="border-t border-gold/10 py-2 first:border-none">
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{k}</p>
      <p className="text-sm text-primary">{v || "—"}</p>
    </div>
  );
}
