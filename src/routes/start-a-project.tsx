import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Paperclip, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SwapFade } from "@/components/motion";
import { ACTION_LABELS, type ActionState } from "@/lib/motion";
import { Container, PageHero, Field, inputClass, Button, Eyebrow } from "@/components/site/ui";
import {
  BUDGET_OPTIONS,
  CAPABILITIES,
  OBJECTIVES,
  PROJECT_TYPES,
  TIMELINE_OPTIONS,
  classifyCategory,
  classifySize,
  classifyWorkflow,
  objectiveLabel,
  recommendScope,
  summarise,
  typeLabel,
  type BriefInput,
} from "@/lib/project-engine";

export const Route = createFileRoute("/start-a-project")({
  validateSearch: (search: Record<string, unknown>): { type?: string } =>
    typeof search.type === "string" ? { type: search.type } : {},
  head: () => ({
    meta: [
      { title: "Start a Project — Yomi Visuals" },
      {
        name: "description",
        content:
          "Tell Yomi Visuals what you want to make. Seven questions, a recommended production scope, and a project ID — campaigns, commercials, film, photography and content from Lagos.",
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
const DRAFT_KEY = "yv-project-brief-draft";

const STEPS = [
  "What are you making?",
  "What should it achieve?",
  "Tell us about the brand.",
  "Here's what we'd put on it.",
  "When do you need it?",
  "What's the scale?",
  "How do we reach you?",
  "Review your brief.",
] as const;

const EMPTY: BriefInput = {
  types: [],
  objective: "",
  detail: "",
  brand: "",
  industry: "",
  website: "",
  instagram: "",
  scope: [],
  timeline: "",
  productionDate: "",
  budget: "",
  location: "",
  name: "",
  company: "",
  role: "",
  email: "",
  phone: "",
};

function Chip({
  active,
  onClick,
  children,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`press rounded-sm border px-4 py-3 text-left text-[13.5px] transition-colors duration-[var(--motion-fast)] ${
        active ? "border-gold bg-elevated text-foreground" : "border-border text-subtle hover:border-border-strong"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function StartProjectPage() {
  const { type: presetType } = Route.useSearch();
  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState<BriefInput>(EMPTY);
  const [scopeTouched, setScopeTouched] = useState(false);
  const [showAllScope, setShowAllScope] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<ActionState>("idle");
  const [projectId, setProjectId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof BriefInput>(key: K, value: BriefInput[K]) =>
    setBrief((b) => ({ ...b, [key]: value }));

  // Restore an abandoned brief, then preselect from ?type=
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) setBrief((b) => ({ ...b, ...(JSON.parse(raw) as Partial<BriefInput>) }));
    } catch {
      /* ignore malformed drafts */
    }
    if (presetType && PROJECT_TYPES.some((t) => t.key === presetType)) {
      setBrief((b) => (b.types.includes(presetType) ? b : { ...b, types: [...b.types, presetType] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state === "success") return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(brief));
    } catch {
      /* storage unavailable */
    }
  }, [brief, state]);

  const recommended = useMemo(() => recommendScope(brief.types, brief.objective), [brief.types, brief.objective]);
  const scope = scopeTouched ? brief.scope : recommended;

  const size = classifySize(brief.budget);
  const category = classifyCategory(brief.types);
  const workflow = classifyWorkflow(size, category, brief.timeline);

  function toggleType(key: string) {
    setBrief((b) => {
      const has = b.types.includes(key);
      const types = has ? b.types.filter((t) => t !== key) : [...b.types.filter((t) => t !== "not-sure"), key];
      return { ...b, types: key === "not-sure" && !has ? ["not-sure"] : types };
    });
    setError(null);
  }

  function toggleScope(item: string) {
    const current = scope;
    setScopeTouched(true);
    set("scope", current.includes(item) ? current.filter((s) => s !== item) : [...current, item]);
  }

  function pickFile(f: File | null) {
    if (!f) return setFile(null);
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Reference files must be under ${MAX_FILE_MB}MB.`);
      return;
    }
    setError(null);
    setFile(f);
  }

  function validate(current: number): string | null {
    if (current === 0 && brief.types.length === 0) return "Pick at least one — or choose “Not sure yet”.";
    if (current === 1 && !brief.objective) return "Choose the outcome closest to yours.";
    if (current === 4 && !brief.timeline) return "Let us know roughly when.";
    if (current === 5 && !brief.budget) return "A range is enough — it shapes the crew, not the idea.";
    if (current === 6) {
      if (!brief.name.trim()) return "Please tell us your name.";
      if (!brief.email.includes("@")) return "Please enter a valid email address.";
    }
    return null;
  }

  function next() {
    const problem = validate(step);
    if (problem) return setError(problem);
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
    setState("submitting");
    setError(null);

    let reference_file: string | null = null;
    if (file) {
      setState("processing");
      const safe = file.name.replace(/[^a-z0-9.]+/gi, "-").toLowerCase();
      const path = `${crypto.randomUUID()}-${safe}`;
      const { error: upErr } = await supabase.storage.from("references").upload(path, file, { upsert: false });
      if (upErr) {
        setState("error");
        setError("The reference file couldn't be uploaded. Try a smaller file, or send the brief without one.");
        return;
      }
      reference_file = path;
    }

    const payload = { ...brief, scope };
    const { data: session } = await supabase.auth.getUser();

    const { data, error: dbError } = await (supabase as any)
      .from("project_briefs")
      .insert({
        project_types: brief.types,
        objective: [objectiveLabel(brief.objective), brief.detail].filter(Boolean).join(" — "),
        brand: brief.brand || null,
        industry: brief.industry || null,
        website: brief.website || null,
        instagram: brief.instagram || null,
        capabilities: scope,
        recommended,
        timeline: brief.timeline || null,
        production_date: brief.productionDate || null,
        budget: brief.budget || null,
        location: brief.location || null,
        name: brief.name.trim(),
        company: brief.company.trim() || null,
        role: brief.role.trim() || null,
        email: brief.email.trim().toLowerCase(),
        phone: brief.phone.trim() || null,
        category,
        size,
        workflow,
        summary: summarise(payload),
        reference_file,
        source: "website",
        user_id: session?.user?.id ?? null,
      })
      .select("project_id")
      .single();

    if (dbError) {
      setState("error");
      setError("Something went wrong sending your brief. Please email hello@yomivisuals.com.");
      return;
    }

    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    setProjectId(data?.project_id ?? null);
    setState("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (state === "success") {
    return (
      <Container className="py-20 md:py-32">
        <div className="mx-auto max-w-2xl">
          <div className="grid h-12 w-12 place-items-center rounded-sm border border-gold/50 text-gold">
            <Check className="h-5 w-5" />
          </div>
          <h1 className="text-display mt-8 text-[clamp(2rem,7vw,3.6rem)]">Brief received.</h1>
          {projectId ? (
            <p className="mt-6 text-[15px] text-subtle">
              Your project reference is{" "}
              <span className="font-medium tracking-[0.08em] text-gold">{projectId}</span>. Quote it in any email and
              we'll find your brief instantly.
            </p>
          ) : null}
          <div className="mt-8 rounded-sm border border-border p-6">
            <Eyebrow>What happens next</Eyebrow>
            <ol className="mt-5 space-y-4 text-[14px] leading-relaxed text-subtle">
              <li>
                <span className="text-gold">01</span> — A producer reviews the brief and confirms the scope, usually
                within one working day.
              </li>
              <li>
                <span className="text-gold">02</span> — We schedule a short discovery call to pressure-test the idea.
              </li>
              <li>
                <span className="text-gold">03</span> — You receive a written proposal, crew plan and timeline.
              </li>
            </ol>
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/work"
              className="press inline-flex items-center justify-center gap-2 rounded-sm border border-border-strong px-7 py-4 text-[12px] uppercase tracking-[0.16em]"
            >
              View selected work <ArrowUpRight className="h-4 w-4 text-gold" />
            </Link>
            <Link
              to="/how-we-work"
              className="press inline-flex items-center justify-center gap-2 rounded-sm border border-border px-7 py-4 text-[12px] uppercase tracking-[0.16em]"
            >
              How we work
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <>
      <PageHero
        eyebrow="Start a Project"
        title="Tell us what you want to make."
        body="Seven questions. We'll come back with a scope, a crew and a timeline — no pricing is sent automatically."
      />

      <Container className="pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="sticky top-0 z-10 -mx-5 bg-background/90 px-5 py-4 backdrop-blur-sm md:mx-0 md:px-0">
            <div className="flex items-center justify-between text-[11.5px] uppercase tracking-[0.16em] text-muted-foreground">
              <span>
                Step {step + 1} / {STEPS.length}
              </span>
              <span>{category !== "other" ? typeLabel(category) : "Project brief"}</span>
            </div>
            <div className="mt-3 h-px w-full bg-border">
              <div
                className="h-px bg-gold transition-[width] duration-[var(--motion-standard)] ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <SwapFade swapKey={String(step)}>
            <div className="pt-10">
              <h2 className="text-display text-[clamp(1.6rem,5.5vw,2.6rem)]">{STEPS[step]}</h2>

              {step === 0 ? (
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {PROJECT_TYPES.map((t) => (
                    <Chip key={t.key} active={brief.types.includes(t.key)} onClick={() => toggleType(t.key)}>
                      <span className="block font-medium text-foreground">{t.label}</span>
                      <span className="mt-1 block text-[12.5px] text-muted-foreground">{t.body}</span>
                    </Chip>
                  ))}
                </div>
              ) : null}

              {step === 1 ? (
                <div className="mt-8 space-y-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {OBJECTIVES.map((o) => (
                      <Chip key={o.key} active={brief.objective === o.key} onClick={() => set("objective", o.key)}>
                        {o.label}
                      </Chip>
                    ))}
                  </div>
                  <Field label="In your own words" hint="Optional — the more context, the sharper the response.">
                    <textarea
                      rows={4}
                      value={brief.detail}
                      onChange={(e) => set("detail", e.target.value)}
                      className={inputClass}
                      placeholder="What are you launching, and what should people feel when they see it?"
                    />
                  </Field>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <Field label="Brand or company">
                    <input value={brief.brand} onChange={(e) => set("brand", e.target.value)} className={inputClass} placeholder="Brand name" />
                  </Field>
                  <Field label="Industry">
                    <input value={brief.industry} onChange={(e) => set("industry", e.target.value)} className={inputClass} placeholder="Fashion, fintech, hospitality…" />
                  </Field>
                  <Field label="Website">
                    <input value={brief.website} onChange={(e) => set("website", e.target.value)} className={inputClass} placeholder="yourbrand.com" />
                  </Field>
                  <Field label="Instagram">
                    <input value={brief.instagram} onChange={(e) => set("instagram", e.target.value)} className={inputClass} placeholder="@yourbrand" />
                  </Field>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="mt-8">
                  <p className="max-w-xl text-[14.5px] leading-relaxed text-subtle">
                    Based on what you're making and what it needs to achieve, this is the scope we'd recommend. Remove
                    anything you don't need, or add more.
                  </p>
                  <div className="mt-7 grid gap-2 sm:grid-cols-2">
                    {(showAllScope ? [...CAPABILITIES] : Array.from(new Set([...recommended, ...scope]))).map((c) => (
                      <Chip key={c} active={scope.includes(c)} onClick={() => toggleScope(c)}>
                        <span className="flex items-center justify-between gap-3">
                          {c}
                          {scope.includes(c) ? <Check className="h-3.5 w-3.5 text-gold" /> : <Plus className="h-3.5 w-3.5 text-muted-foreground" />}
                        </span>
                      </Chip>
                    ))}
                  </div>
                  {!showAllScope ? (
                    <button
                      type="button"
                      onClick={() => setShowAllScope(true)}
                      className="link-underline mt-6 text-[13px] text-subtle"
                    >
                      Add something else
                    </button>
                  ) : null}
                </div>
              ) : null}

              {step === 4 ? (
                <div className="mt-8 space-y-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {TIMELINE_OPTIONS.map((t) => (
                      <Chip key={t} active={brief.timeline === t} onClick={() => set("timeline", t)}>
                        {t}
                      </Chip>
                    ))}
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Target production date" hint="Optional">
                      <input
                        type="date"
                        value={brief.productionDate}
                        onChange={(e) => set("productionDate", e.target.value)}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Location" hint="Optional">
                      <input value={brief.location} onChange={(e) => set("location", e.target.value)} className={inputClass} placeholder="Lagos, Abuja, remote…" />
                    </Field>
                  </div>
                </div>
              ) : null}

              {step === 5 ? (
                <div className="mt-8 space-y-6">
                  <p className="max-w-xl text-[14.5px] leading-relaxed text-subtle">
                    A range is enough. It tells us the size of the crew and the production, not the quality of the idea.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {BUDGET_OPTIONS.map((b) => (
                      <Chip key={b} active={brief.budget === b} onClick={() => set("budget", b)}>
                        {b}
                      </Chip>
                    ))}
                  </div>
                </div>
              ) : null}

              {step === 6 ? (
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <Field label="Name">
                    <input value={brief.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" className={inputClass} placeholder="Your name" />
                  </Field>
                  <Field label="Company">
                    <input value={brief.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" className={inputClass} placeholder="Company or agency" />
                  </Field>
                  <Field label="Role">
                    <input value={brief.role} onChange={(e) => set("role", e.target.value)} className={inputClass} placeholder="Marketing lead, founder…" />
                  </Field>
                  <Field label="Email">
                    <input
                      type="email"
                      value={brief.email}
                      onChange={(e) => set("email", e.target.value)}
                      autoComplete="email"
                      inputMode="email"
                      className={inputClass}
                      placeholder="you@company.com"
                    />
                  </Field>
                  <Field label="Phone / WhatsApp">
                    <input value={brief.phone} onChange={(e) => set("phone", e.target.value)} type="tel" inputMode="tel" className={inputClass} placeholder="+234 …" />
                  </Field>
                </div>
              ) : null}

              {step === 7 ? (
                <div className="mt-8 space-y-8">
                  <div className="rounded-sm border border-border p-6">
                    <Eyebrow>Your brief</Eyebrow>
                    <dl className="mt-5 space-y-4 text-[14px]">
                      <Row label="Making">{brief.types.map(typeLabel).join(", ") || "—"}</Row>
                      <Row label="Objective">{brief.objective ? objectiveLabel(brief.objective) : "—"}</Row>
                      {brief.detail ? <Row label="Notes">{brief.detail}</Row> : null}
                      <Row label="Brand">{[brief.brand, brief.industry].filter(Boolean).join(" · ") || "—"}</Row>
                      <Row label="Scope">{scope.join(", ") || "—"}</Row>
                      <Row label="Timeline">
                        {[brief.timeline, brief.productionDate, brief.location].filter(Boolean).join(" · ") || "—"}
                      </Row>
                      <Row label="Budget">{brief.budget || "—"}</Row>
                      <Row label="Contact">
                        {[brief.name, brief.company, brief.email, brief.phone].filter(Boolean).join(" · ")}
                      </Row>
                    </dl>
                  </div>

                  <Field label="References" hint={`Optional — image or PDF, up to ${MAX_FILE_MB}MB.`}>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                    />
                    {file ? (
                      <div className="flex items-center justify-between gap-3 rounded-sm border border-border bg-surface px-4 py-3.5">
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
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-border"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex w-full items-center justify-center gap-2 rounded-sm border border-dashed border-border-strong px-4 py-6 text-[13px] text-subtle transition-colors hover:bg-surface"
                      >
                        <Paperclip className="h-4 w-4" /> Attach a reference
                      </button>
                    )}
                  </Field>
                </div>
              ) : null}

              {error ? (
                <p role="alert" className="mt-6 text-[13px] text-destructive">
                  {error}
                </p>
              ) : null}

              <div className="mt-10 flex items-center gap-3">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={back}
                    className="press inline-flex items-center gap-2 rounded-sm border border-border px-5 py-4 text-[12px] uppercase tracking-[0.16em] text-subtle"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                ) : null}

                {step < STEPS.length - 1 ? (
                  <Button onClick={next} className="flex-1 sm:flex-none">
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={submit}
                    disabled={state === "submitting" || state === "processing"}
                    className="flex-1 sm:flex-none"
                  >
                    {ACTION_LABELS[state] ?? "Send project brief"} <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <p className="mt-6 text-[12px] text-muted-foreground">
                We reply within one working day. Nothing is charged and no pricing is sent until we've spoken.
              </p>
            </div>
          </SwapFade>
        </div>
      </Container>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-4">
      <dt className="text-[11.5px] uppercase tracking-[0.16em] text-muted-foreground">{label}</dt>
      <dd className="text-subtle">{children}</dd>
    </div>
  );
}
