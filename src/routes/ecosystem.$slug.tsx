import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowUpRight, Check, Paperclip } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DIVISIONS, divisionSlug, divisionBySlug, CREATOR_ROLES } from "@/lib/ecosystem";
import { Container, PageHero, Eyebrow, Field, inputClass, Button, ButtonLink } from "@/components/site/ui";

export const Route = createFileRoute("/ecosystem/$slug")({
  loader: ({ params }) => {
    const division = divisionBySlug(params.slug);
    if (!division) throw notFound();
    return { division };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Division unavailable — Yomi Visuals" }, { name: "robots", content: "noindex" }] };
    }
    const d = loaderData.division;
    const title = `${d.name} — ${d.tagline} | Yomi Visuals`;
    const description = d.body;
    const url = `https://yomivisuals.lovable.app/ecosystem/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: DivisionPage,
});

function DivisionPage() {
  const { division } = Route.useLoaderData();
  const isNetwork = divisionSlug(division.name) === "yv-creators-network";
  const others = DIVISIONS.filter((d) => d.name !== division.name);

  return (
    <>
      <PageHero eyebrow={`Division ${division.code}`} title={division.name} body={division.tagline} />

      <Container className="py-10 md:py-16">
        <p className="text-serif max-w-3xl text-[clamp(1.15rem,3vw,1.7rem)] leading-[1.45] normal-case text-subtle">
          {division.body}
        </p>

        {division.status === "building" ? (
          <p className="mt-8 inline-block border border-border px-3.5 py-2 text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            In development
          </p>
        ) : null}

        <div className="mt-12">
          <Eyebrow>Capabilities</Eyebrow>
          <ul className="mt-6 grid gap-px border border-border bg-border sm:grid-cols-2 md:grid-cols-3">
            {division.services.map((s) => (
              <li key={s} className="bg-background px-5 py-5 text-[13.5px] text-subtle">
                {s}
              </li>
            ))}
          </ul>
        </div>

        {division.href ? (
          <a
            href={division.href}
            target="_blank"
            rel="noreferrer"
            className="tap mt-10 inline-flex items-center gap-2 border border-border-strong px-6 py-4 text-[12px] uppercase tracking-[0.16em] transition-colors hover:text-gold"
          >
            Visit {division.href.replace("https://", "")}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        ) : null}
      </Container>

      {isNetwork ? <CreatorApplication /> : null}

      {/* Sibling divisions */}
      <section className="border-t border-border">
        <Container className="py-12 md:py-20">
          <Eyebrow>Elsewhere in the ecosystem</Eyebrow>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {others.map((d) => (
              <li key={d.name}>
                <Link
                  to="/ecosystem/$slug"
                  params={{ slug: divisionSlug(d.name) }}
                  className="tap flex items-center justify-between gap-6 py-5"
                >
                  <span className="min-w-0">
                    <span className="text-headline block text-[clamp(1.05rem,3vw,1.4rem)]">{d.name}</span>
                    <span className="mt-1 block text-[12.5px] text-muted-foreground">{d.tagline}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/start-a-project">Start a project</ButtonLink>
            <Link
              to="/ecosystem"
              className="tap inline-flex items-center justify-center gap-2 border border-border-strong px-6 py-3.5 text-[12px] uppercase tracking-[0.16em]"
            >
              Full ecosystem
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

const MAX_FILE_MB = 10;

function CreatorApplication() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    if (!name || !email.includes("@")) {
      setError("Please enter your name and a valid email address.");
      return;
    }
    setSending(true);
    setError(null);

    let portfolio_file: string | null = null;
    if (file) {
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        setSending(false);
        setError(`Uploads must be under ${MAX_FILE_MB}MB. Your application is still here.`);
        return;
      }
      const safe = file.name.replace(/[^a-z0-9.]+/gi, "-").toLowerCase();
      const path = `${crypto.randomUUID()}-${safe}`;
      const { error: upErr } = await supabase.storage.from("references").upload(path, file, { upsert: false });
      if (upErr) {
        setSending(false);
        setError("We couldn't upload that file. Your application is still here — try again or submit without it.");
        return;
      }
      portfolio_file = path;
    }

    const message = [
      ["Role", String(fd.get("role") ?? "")],
      ["Location", String(fd.get("location") ?? "")],
      ["Experience", String(fd.get("experience") ?? "")],
      ["Specialities", String(fd.get("specialities") ?? "")],
      ["Portfolio", String(fd.get("portfolio") ?? "")],
      ["Instagram", String(fd.get("instagram") ?? "")],
      ["Upload", portfolio_file ?? ""],
    ]
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    const { error: dbError } = await supabase.from("leads").insert({
      name,
      email,
      phone: String(fd.get("phone") ?? "").trim() || null,
      service: "Creators Network Application",
      message,
      source: "creators-network",
    });
    setSending(false);
    if (dbError) {
      setError("We couldn't send your application. Your information is still here — please try again.");
      return;
    }
    setDone(true);
  }

  return (
    <section id="join" className="border-t border-border">
      <Container className="py-12 md:py-20">
        <Eyebrow>Create With Us</Eyebrow>
        <h2 className="text-display mt-4 max-w-3xl text-[clamp(1.7rem,5vw,3rem)]">Join the network.</h2>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-subtle">
          YV works with a curated network of creative professionals, assembled per project. Tell us what you do and
          where to see your work.
        </p>

        <ul className="mt-8 flex flex-wrap gap-2">
          {CREATOR_ROLES.map((r) => (
            <li key={r} className="border border-border px-3.5 py-2 text-[12.5px] text-muted-foreground">
              {r}
            </li>
          ))}
        </ul>

        {done ? (
          <div className="mt-12 border border-border p-8 text-center md:p-12">
            <div className="mx-auto grid h-14 w-14 place-items-center border border-border-strong">
              <Check className="h-6 w-6" aria-hidden />
            </div>
            <h3 className="text-display mt-6 text-[clamp(1.5rem,4vw,2.4rem)]">Application received.</h3>
            <p className="mt-3 text-[14px] text-muted-foreground">
              We review every application. If there's a fit, we'll reach out when the right production comes up.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-12 max-w-2xl space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name">
                <input name="name" required autoComplete="name" className={inputClass} />
              </Field>
              <Field label="Role">
                <select name="role" className={inputClass} defaultValue="">
                  <option value="">Select a role</option>
                  {CREATOR_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Email">
                <input name="email" type="email" required inputMode="email" autoComplete="email" className={inputClass} />
              </Field>
              <Field label="Phone">
                <input name="phone" type="tel" inputMode="tel" autoComplete="tel" className={inputClass} />
              </Field>
              <Field label="Location">
                <input name="location" className={inputClass} placeholder="Lagos, Nigeria" />
              </Field>
              <Field label="Instagram">
                <input name="instagram" className={inputClass} placeholder="@handle" />
              </Field>
            </div>
            <Field label="Portfolio URL">
              <input name="portfolio" type="url" className={inputClass} placeholder="https://" />
            </Field>
            <Field label="Experience">
              <textarea name="experience" rows={3} className={inputClass} placeholder="Years working, notable productions or clients." />
            </Field>
            <Field label="Specialities">
              <input name="specialities" className={inputClass} placeholder="Fashion, campaign, motion, retouching…" />
            </Field>
            <Field label="Upload" hint={`Optional — image or PDF up to ${MAX_FILE_MB}MB.`}>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="tap flex w-full items-center justify-center gap-2 border border-dashed border-border-strong bg-elevated px-4 py-6 text-[13px] text-subtle"
              >
                <Paperclip className="h-4 w-4" />
                {file ? file.name : "Attach work sample"}
              </button>
            </Field>
            {error ? (
              <p role="alert" className="border border-destructive/40 px-4 py-3 text-[13px] text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={sending} className="w-full py-4">
              {sending ? "Sending application…" : "Join the network"}
            </Button>
          </form>
        )}
      </Container>
    </section>
  );
}
