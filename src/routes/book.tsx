import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowUpRight, Check, Paperclip, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Container, PageHero, Field, inputClass, Button } from "@/components/site/ui";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Start a Project — Yomi Visuals" },
      {
        name: "description",
        content:
          "Start a project with Yomi Visuals — campaign creative, brand photography, commercial content and visual production from Lagos, Nigeria.",
      },
      { property: "og:title", content: "Start a Project — Yomi Visuals" },
      { property: "og:description", content: "Tell us what you're building and where you want your brand to go." },
      { property: "og:url", content: "https://yomivisuals.lovable.app/book" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/book" }],
  }),
  component: BookPage,
});

const PROJECT_TYPES = [
  "Campaign",
  "Brand Photography",
  "Commercial Content",
  "Creative Direction",
  "Product Photography",
  "Fashion",
  "Film & Motion",
  "Other",
];

const BUDGETS = ["Under ₦500,000", "₦500,000 – ₦2M", "₦2M – ₦5M", "₦5M – ₦15M", "₦15M+", "Not sure yet"];

const MAX_FILE_MB = 10;

function BookPage() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function pickFile(f: File | null) {
    if (!f) return setFile(null);
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Reference files must be under ${MAX_FILE_MB}MB.`);
      return;
    }
    setError(null);
    setFile(f);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    if (!name || !email.includes("@")) {
      setError("Please enter your name and a valid email address.");
      return;
    }

    const brief = [
      ["What they're creating", String(fd.get("creating") ?? "").trim()],
      ["Objective", String(fd.get("objective") ?? "").trim()],
      ["Additional information", String(fd.get("additional") ?? "").trim()],
    ]
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n\n");

    setSending(true);
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
        setSending(false);
        setError("The reference file couldn't be uploaded. Try a smaller file, or send it without one.");
        return;
      }
      reference_file = path;
    }

    const { error: dbError } = await supabase.from("bookings").insert({
      name,
      email,
      phone: String(fd.get("phone") ?? "").trim() || null,
      company: String(fd.get("company") ?? "").trim() || null,
      service: String(fd.get("project_type") ?? "") || null,
      budget: String(fd.get("budget") ?? "") || null,
      preferred_date: String(fd.get("date") ?? "") || null,
      message: brief || null,
      reference_file,
    });
    setSending(false);
    if (dbError) {
      setError("Something went wrong. Please email hello@yomivisuals.com.");
      return;
    }
    setDone(true);
    window.scrollTo({ top: 0 });
  }

  if (done) {
    return (
      <Container className="flex min-h-[80svh] flex-col items-center justify-center py-32 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-sm border border-border-strong">
          <Check className="h-6 w-6" />
        </div>
        <h1 className="text-display mt-8 text-[clamp(2rem,5vw,3.2rem)]">Request received.</h1>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          We review every enquiry personally and respond within one working day. Check your inbox — and your spam
          folder, just in case.
        </p>
        <Link
          to="/portfolio"
          className="mt-10 inline-flex items-center gap-2 rounded-sm border border-border-strong px-6 py-3.5 text-[13px] font-medium"
        >
          View selected work
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Container>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Start a Project"
        title="Tell us what you're building."
        body="What you want people to feel, and where you want your brand to go. We respond within one working day."
      />

      <Container className="py-12 md:py-20">
        <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Name">
              <input name="name" required autoComplete="name" className={inputClass} placeholder="Your name" />
            </Field>
            <Field label="Company / Brand">
              <input name="company" autoComplete="organization" className={inputClass} placeholder="Brand or company" />
            </Field>
            <Field label="Email">
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                className={inputClass}
                placeholder="you@company.com"
              />
            </Field>
            <Field label="Phone">
              <input name="phone" type="tel" autoComplete="tel" inputMode="tel" className={inputClass} placeholder="+234 …" />
            </Field>
            <Field label="Project type">
              <select name="project_type" className={inputClass} defaultValue="">
                <option value="">Select a type</option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Estimated budget">
              <select name="budget" className={inputClass} defaultValue="">
                <option value="">Select a range</option>
                {BUDGETS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="What are you looking to create?">
            <textarea
              name="creating"
              rows={4}
              className={inputClass}
              placeholder="A campaign, a lookbook, launch content, a film…"
            />
          </Field>

          <Field label="What is the objective?">
            <textarea
              name="objective"
              rows={3}
              className={inputClass}
              placeholder="What should this work achieve for the brand?"
            />
          </Field>

          <Field label="Preferred project date">
            <input name="date" type="date" className={inputClass} />
          </Field>

          <Field label="Reference / inspiration" hint={`Optional — image or PDF, up to ${MAX_FILE_MB}MB.`}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />
            {file ? (
              <div className="flex items-center justify-between gap-3 rounded-sm border border-border bg-elevated px-4 py-3">
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
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border border-border"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-sm border border-dashed border-border-strong bg-elevated px-4 py-6 text-[13px] text-subtle transition-colors hover:bg-surface"
              >
                <Paperclip className="h-4 w-4" />
                Attach a reference file
              </button>
            )}
          </Field>

          <Field label="Additional information">
            <textarea
              name="additional"
              rows={3}
              className={inputClass}
              placeholder="Timelines, locations, team, anything else we should know."
            />
          </Field>

          {error ? <p className="text-[13px] text-destructive">{error}</p> : null}

          <Button type="submit" disabled={sending} className="w-full py-4 text-[14px]">
            {sending ? "Sending…" : "Send enquiry"}
          </Button>
          <p className="text-center text-[12px] text-muted-foreground">
            We reply within one working day. Proposals within five.
          </p>
        </form>
      </Container>
    </>
  );
}
