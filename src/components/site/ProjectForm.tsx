import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check, Paperclip, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Field, inputClass } from "@/components/site/ui";

export const PROJECT_TYPES = [
  "Campaign",
  "Commercial",
  "Brand Film",
  "Photography",
  "Content",
  "Creative Direction",
  "Production",
  "Something Else",
];

export const BUDGETS = ["Under ₦500,000", "₦500,000 – ₦2M", "₦2M – ₦5M", "₦5M – ₦15M", "₦15M+", "Not sure yet"];

export const TIMELINES = ["As soon as possible", "In 2–4 weeks", "In 1–3 months", "Later this year", "Still planning"];

const MAX_FILE_MB = 10;

/** Shared project enquiry form — used on /book and in the homepage invitation section. */
export function ProjectForm({ source = "website" }: { source?: string }) {
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
      ["Project brief", String(fd.get("brief") ?? "").trim()],
      ["Timeline", String(fd.get("timeline") ?? "").trim()],
      ["Location", String(fd.get("location") ?? "").trim()],
      ["Source", source],
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
      message: brief || null,
      reference_file,
    });
    setSending(false);
    if (dbError) {
      setError("Something went wrong. Please email hello@yomivisuals.com.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="border border-border p-8 md:p-14">
        <div className="grid h-12 w-12 place-items-center border border-gold/50 text-gold">
          <Check className="h-5 w-5" />
        </div>
        <h3 className="text-headline mt-8 text-[clamp(1.7rem,5vw,2.6rem)]">
          Received. <span className="text-serif normal-case text-gold">Thank you.</span>
        </h3>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          We read every enquiry personally and respond within one working day.
        </p>
        <Link
          to="/projects"
          className="mt-8 inline-flex items-center gap-2 border border-border-strong px-6 py-4 text-[12px] uppercase tracking-[0.16em]"
        >
          View selected work
          <ArrowUpRight className="h-4 w-4 text-gold" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name">
          <input name="name" required autoComplete="name" className={inputClass} placeholder="Your name" />
        </Field>
        <Field label="Company">
          <input name="company" autoComplete="organization" className={inputClass} placeholder="Brand, company or agency" />
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
        <Field label="Budget range">
          <select name="budget" className={inputClass} defaultValue="">
            <option value="">Select a range</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Timeline">
          <select name="timeline" className={inputClass} defaultValue="">
            <option value="">Select a timeline</option>
            {TIMELINES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Location">
          <input name="location" className={inputClass} placeholder="Lagos, Abuja, remote…" />
        </Field>
      </div>

      <Field label="Project brief">
        <textarea
          name="brief"
          rows={5}
          className={inputClass}
          placeholder="What are you trying to build, and what should it achieve?"
        />
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
          <div className="flex items-center justify-between gap-3 border border-border bg-surface px-4 py-3.5">
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
              className="grid h-9 w-9 shrink-0 place-items-center border border-border"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 border border-dashed border-border-strong px-4 py-6 text-[13px] text-subtle transition-colors hover:bg-surface"
          >
            <Paperclip className="h-4 w-4" />
            Attach a reference file
          </button>
        )}
      </Field>

      {error ? (
        <p role="alert" className="text-[13px] text-destructive">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={sending}
        className="group inline-flex w-full items-center justify-between gap-3 bg-primary px-7 py-5 text-[12px] uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40 sm:w-auto"
      >
        {sending ? "Sending…" : "Start the conversation"}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
      <p className="text-[12px] text-muted-foreground">We reply within one working day. Proposals within five.</p>
    </form>
  );
}
