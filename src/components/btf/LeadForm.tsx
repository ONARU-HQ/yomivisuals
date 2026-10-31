import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const field = "mt-2 w-full min-h-[48px] border border-black/20 bg-transparent px-4 text-[15px] text-[var(--film-paper)] placeholder:text-[var(--film-muted)] focus:border-black focus:outline-none";

/**
 * Real submission into the existing `leads` table. Success is shown only if the insert succeeds.
 * Spam protection: hidden honeypot + minimum fill time. (Add a CAPTCHA/Turnstile token here when keys are configured.)
 */
export function LeadForm({ source, enquiries }: { source: "collaborate" | "contact"; enquiries: string[] }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});
  const started = useRef(Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    const enquiry = String(fd.get("enquiry") ?? enquiries[0]);
    const errs: Record<string, string> = {};
    if (!name) errs.name = "Please tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email address.";
    if (message.length < 10) errs.message = "A few words about your idea help us reply properly.";
    setFieldErr(errs);
    if (Object.keys(errs).length) return;
    // Bots fill the hidden field or submit instantly. Pretend nothing, send nothing.
    if (String(fd.get("website") ?? "") || Date.now() - started.current < 2500) { setError("Something went wrong. Please try again in a moment."); return; }
    setState("sending"); setError(null);
    const { error: dbError } = await supabase.from("leads").insert({
      name, email,
      phone: String(fd.get("phone") ?? "").trim() || null,
      company: null,
      service: enquiry,
      message: `Enquiry type: ${enquiry}\n\n${message}`,
      source,
    });
    if (dbError) { setState("idle"); setError("We couldn’t send your message. Nothing was lost: your details are still here, please try again."); return; }
    setState("done");
  }

  if (state === "done") {
    return (
      <div role="status" className="border border-[var(--film-gold)]/50 p-8">
        <p className="mx-mono text-3xl">Message received.</p>
        <p className="mt-3 text-[14.5px] text-[var(--film-muted)]">Your enquiry has been saved. You will hear back by email.</p>
      </div>
    );
  }
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6" aria-describedby={error ? "form-error" : undefined}>
      <fieldset>
        <legend className="film-eyebrow">What is this about?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {enquiries.map((q, i) => (
            <label key={q} className="cursor-pointer">
              <input type="radio" name="enquiry" value={q} defaultChecked={i === 0} className="peer sr-only" />
              <span className="inline-flex min-h-[44px] items-center border border-black/20 px-4 text-[12px] uppercase tracking-[0.14em] transition-colors peer-checked:border-black peer-checked:bg-black peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--film-gold)]">{q}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-[12px] uppercase tracking-[0.16em] text-[var(--film-muted)]">Name
          <input name="name" autoComplete="name" required aria-invalid={!!fieldErr.name} aria-describedby={fieldErr.name ? "e-name" : undefined} className={field} />
          {fieldErr.name ? <span id="e-name" role="alert" className="mt-1 block text-[12px] normal-case tracking-normal text-red-600">{fieldErr.name}</span> : null}
        </label>
        <label className="block text-[12px] uppercase tracking-[0.16em] text-[var(--film-muted)]">Email
          <input name="email" type="email" autoComplete="email" required aria-invalid={!!fieldErr.email} aria-describedby={fieldErr.email ? "e-email" : undefined} className={field} />
          {fieldErr.email ? <span id="e-email" role="alert" className="mt-1 block text-[12px] normal-case tracking-normal text-red-600">{fieldErr.email}</span> : null}
        </label>
      </div>
      <label className="block text-[12px] uppercase tracking-[0.16em] text-[var(--film-muted)]">Phone <span className="normal-case tracking-normal">(optional)</span>
        <input name="phone" type="tel" autoComplete="tel" className={field} />
      </label>
      <label className="block text-[12px] uppercase tracking-[0.16em] text-[var(--film-muted)]">Message
        <textarea name="message" rows={6} required aria-invalid={!!fieldErr.message} aria-describedby={fieldErr.message ? "e-msg" : undefined} className={`${field} py-3`} />
        {fieldErr.message ? <span id="e-msg" role="alert" className="mt-1 block text-[12px] normal-case tracking-normal text-red-600">{fieldErr.message}</span> : null}
      </label>
      <div className="absolute -left-[9999px]" aria-hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {error ? <p id="form-error" role="alert" className="border border-red-400/50 px-4 py-3 text-[13.5px] text-red-700">{error}</p> : null}
      <button type="submit" disabled={state === "sending"} className="film-btn film-btn--solid disabled:opacity-60">{state === "sending" ? "Sending…" : "Send enquiry"}</button>
      <p className="text-[12px] text-[var(--film-muted)]">Your details are stored only to reply to this enquiry. See the <a className="underline hover:opacity-60" href="/privacy">privacy policy</a>.</p>
    </form>
  );
}
