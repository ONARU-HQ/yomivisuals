import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Paperclip, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SwapFade } from "@/components/motion";
import { ACTION_LABELS, type ActionState } from "@/lib/motion";
import { Container, PageHero, Field, inputClass, Button, Eyebrow } from "@/components/site/ui";
import { PROJECT_TYPE_OPTIONS, BUDGET_RANGES, TIMELINES } from "@/lib/ecosystem";

export const Route = createFileRoute("/start-a-project")({
  head: () => ({
    meta: [
      { title: "Start a Project — Yomi Visuals" },
      {
        name: "description",
        content:
          "Send Yomi Visuals a project brief: campaign, commercial, brand film, photography, product, fashion or social content production from Lagos.",
      },
      { property: "og:title", content: "Start a Project — Yomi Visuals" },
      { property: "og:description", content: "Tell us what you want to make. We'll take it from brief to delivery." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://yomivisuals.lovable.app/start-a-project" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/start-a-project" }],
  }),
  component: StartProjectPage,
});

const MAX_FILE_MB = 10;

const STEPS = [
  "Tell us about your project.",
  "What are you trying to achieve?",
  "What are you making?",
  "When do you need it?",
  "What's the scale?",
  "How do we reach you?",
  "Add references",
  "Review your brief",
] as const;

type Brief = {
  projectType: string;
  objective: string;
  making: string;
  timeline: string;
  budget: string;
  name: string;
  company: string;
  email: string;
  phone: string;
};

const EMPTY: Brief = {
  projectType: "",
  objective: "",
  making: "",
  timeline: "",
  budget: "",
  name: "",
  company: "",
  email: "",
  phone: "",
};

function StartProjectPage() {
  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState<Brief>(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [action, setAction] = useState<ActionState>("idle");
  const sending = action === "submitting" || action === "processing";
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Brief>(key: K, value: Brief[K]) => setBrief((b) => ({ ...b, [key]: value }));

  function pickFile(f: File | null) {
    if (!f) return setFile(null);
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Reference files must be under ${MAX_FILE_MB}MB.`);
      return;
    }
    setError(null);
    setFile(f);
  }

  function next() {
    if (step === 0 && !brief.projectType) return setError("Choose a project type to continue.");
    if (step === 5 && (!brief.name.trim() || !brief.email.includes("@")))
      return setError("Please enter your name and a valid email address.");
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    setAction(file ? "processing" : "submitting");
    setError(null);

    let reference_file: string | null = null;
    if (file) {
      const safe = file.name.replace(/[^a-z0-9.]+/gi, "-").toLowerCase();
      const path = `${crypto.randomUUID()}-${safe}`;
      const { error: upErr } = await supabase.storage.from("references").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (upErr) {
        setAction("error");
        setError("The reference file couldn't be uploaded. Your brief is still here — try a smaller file, or send it without one.");
        return;
      }
      reference_file = path;
      setAction("submitting");
    }

    const message = [
      ["Objective", brief.objective],
      ["What they're making", brief.making],
    ]
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n\n");

    const { error: dbError } = await supabase.from("bookings").insert({
      name: brief.name.trim(),
      email: brief.email.trim(),
      phone: brief.phone.trim() || null,
      company: brief.company.trim() || null,
      service: brief.projectType || null,
      budget: brief.budget || null,
      preferred_date: null,
      message: [message, brief.timeline ? `Timeline: ${brief.timeline}` : ""].filter(Boolean).join("\n\n") || null,
      reference_file,
    });

    if (dbError) {
      setAction("error");
      setError("We couldn't send your brief. Your information is still here — please try again.");
      return;
    }
    setAction("success");
    setDone(true);
    window.scrollTo({ top: 0 });
  }

  if (done) {
    return (
      <Container className="confirm-in flex min-h-[80svh] flex-col items-center justify-center py-28 text-center">
        <div className="grid h-14 w-14 place-items-center border border-border-strong">
          <Check className="h-6 w-6" aria-hidden />
        </div>
        <h1 className="text-display mt-8 text-[clamp(2rem,6vw,3.4rem)]">Brief received.</h1>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Your project is now with YV. We review every brief personally and respond within one working day.
        </p>
        <Link
          to="/work"
          className="tap mt-10 inline-flex items-center gap-2 border border-border-strong px-6 py-3.5 text-[12px] uppercase tracking-[0.16em]"
        >
          View our work
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Container>
    );
  }

  const isReview = step === STEPS.length - 1;

  return (
    <>
      <PageHero eyebrow="Start a Project" title={STEPS[step]} body="Seven short steps. Nothing you enter is lost if you go back." />

      <Container className="pb-20 md:pb-28">
        <div className="mx-auto max-w-2xl">
          {/* Progress */}
          <div className="flex items-center gap-3" aria-hidden>
            {STEPS.map((_, i) => (
              <span
              key={i}
              className={`h-px flex-1 origin-left transition-all duration-[var(--motion-standard)] ease-[var(--ease-out-expo)] ${
                i <= step ? "bg-gold" : "bg-border"
              }`}
            />
            ))}
          </div>
          <p className="mt-3 text-[11.5px] uppercase tracking-[0.16em] text-muted-foreground" aria-live="polite">
            Step {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
          </p>

          <SwapFade swapKey={String(step)} className="mt-10 space-y-6">
            {step === 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {PROJECT_TYPE_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      set("projectType", t);
                      setError(null);
                    }}
                    aria-pressed={brief.projectType === t}
                    className={`tap press border px-4 py-4 text-left text-[13px] transition-colors duration-[var(--motion-fast)] ${
                      brief.projectType === t
                        ? "border-gold text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            ) : null}

            {step === 1 ? (
              <Field label="What are you trying to achieve?" hint="The business or brand outcome, not the deliverable.">
                <textarea
                  rows={7}
                  value={brief.objective}
                  onChange={(e) => set("objective", e.target.value)}
                  className={inputClass}
                  placeholder="Launch a product, reposition the brand, drive a season of content…"
                />
              </Field>
            ) : null}

            {step === 2 ? (
              <Field label="What are you making?" hint="A short description of the work itself.">
                <textarea
                  rows={6}
                  value={brief.making}
                  onChange={(e) => set("making", e.target.value)}
                  className={inputClass}
                  placeholder="A campaign shoot, a brand film, a lookbook, social content…"
                />
              </Field>
            ) : null}

            {step === 3 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {TIMELINES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("timeline", t)}
                    aria-pressed={brief.timeline === t}
                    className={`tap press border px-4 py-4 text-left text-[13px] transition-colors duration-[var(--motion-fast)] ${
                      brief.timeline === t ? "border-gold text-foreground" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            ) : null}

            {step === 4 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {BUDGET_RANGES.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => set("budget", b)}
                    aria-pressed={brief.budget === b}
                    className={`tap press border px-4 py-4 text-left text-[13px] transition-colors duration-[var(--motion-fast)] ${
                      brief.budget === b ? "border-gold text-foreground" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            ) : null}

            {step === 5 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name">
                  <input
                    value={brief.name}
                    onChange={(e) => set("name", e.target.value)}
                    autoComplete="name"
                    className={inputClass}
                    placeholder="Your name"
                  />
                </Field>
                <Field label="Company / Brand">
                  <input
                    value={brief.company}
                    onChange={(e) => set("company", e.target.value)}
                    autoComplete="organization"
                    className={inputClass}
                    placeholder="Brand or company"
                  />
                </Field>
                <Field label="Email">
                  <input
                    value={brief.email}
                    onChange={(e) => set("email", e.target.value)}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    className={inputClass}
                    placeholder="you@company.com"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    value={brief.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    className={inputClass}
                    placeholder="+234 …"
                  />
                </Field>
              </div>
            ) : null}

            {step === 6 ? (
              <Field label="References" hint={`Optional — brief, moodboard, image or PDF up to ${MAX_FILE_MB}MB.`}>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                />
                {file ? (
                  <div className="flex items-center justify-between gap-3 border border-border bg-elevated px-4 py-3">
                    <span className="flex min-w-0 items-center gap-2 text-[13px]">
                      <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{file.name}</span>
                    </span>
                    <button
                      type="button"
                      aria-label="Remove file"
                      onClick={() => {
                        setFile(null);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      className="tap grid h-11 w-11 shrink-0 place-items-center border border-border"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="tap press flex w-full items-center justify-center gap-2 border border-dashed border-border-strong bg-elevated px-4 py-8 text-[13px] text-subtle transition-colors duration-[var(--motion-fast)] hover:bg-surface"
                  >
                    <Paperclip className="h-4 w-4" />
                    Upload a brief, moodboard or reference
                  </button>
                )}
              </Field>
            ) : null}

            {isReview ? (
              <div className="border border-border">
                <div className="border-b border-border px-5 py-4">
                  <Eyebrow>Your brief</Eyebrow>
                </div>
                <dl className="divide-y divide-border">
                  {[
                    ["Project type", brief.projectType],
                    ["Objective", brief.objective],
                    ["What you're making", brief.making],
                    ["Timeline", brief.timeline],
                    ["Scale", brief.budget],
                    ["Name", brief.name],
                    ["Company", brief.company],
                    ["Email", brief.email],
                    ["Phone", brief.phone],
                    ["Reference", file?.name ?? ""],
                  ].map(([label, value]) => (
                    <div key={label} className="grid gap-1 px-5 py-4 sm:grid-cols-[160px_1fr] sm:gap-6">
                      <dt className="text-[11.5px] uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
                      <dd className="whitespace-pre-wrap text-[14px]">{value || "—"}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {error ? (
              <p role="alert" className="field-error border border-destructive/40 px-4 py-3 text-[13px] text-destructive">
                {error}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={back}
                  className="tap press inline-flex items-center justify-center gap-2 border border-border-strong px-6 py-4 text-[12px] uppercase tracking-[0.16em] transition-colors duration-[var(--motion-fast)] hover:bg-elevated"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              ) : null}
              {isReview ? (
                <Button type="button" onClick={submit} disabled={sending} className="flex-1 py-4 text-[13px]">
                  {action === "processing"
                    ? "Uploading your reference…"
                    : action === "submitting"
                      ? "Sending your brief…"
                      : action === "error"
                        ? ACTION_LABELS.error
                        : "Send project brief"}
                </Button>
              ) : (
                <button
                  type="button"
                  onClick={next}
                  className="tap press group inline-flex flex-1 items-center justify-center gap-2 bg-primary px-6 py-4 text-[12px] uppercase tracking-[0.18em] text-primary-foreground transition-opacity duration-[var(--motion-fast)] hover:opacity-90"
                >
                  Continue
                  <ArrowRight className="arrow-nudge h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
