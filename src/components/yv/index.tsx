/**
 * YV Design System — mobile-first component library.
 * Every component is token-driven; no hardcoded colours.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Minus, Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Reveal as MotionReveal, type RevealVariant as MotionRevealVariant } from "@/components/motion";
import { STAGGER } from "@/lib/motion";

/* ───────────────────────── Brand ───────────────────────── */

export function YVLogo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <span className={`font-medium uppercase leading-none tracking-[0.22em] ${className}`}>
      {compact ? "YV" : "Yomi Visuals"}
    </span>
  );
}

/* ───────────────────────── Layout ───────────────────────── */

export function Canvas({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1440px] px-4 md:px-8 lg:px-14 ${className}`}>{children}</div>
  );
}

export function Stack({
  children,
  size = "md",
  className = "",
  id,
}: {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  id?: string;
}) {
  const pad = {
    sm: "py-10 md:py-14",
    md: "py-14 md:py-24 lg:py-28",
    lg: "py-20 md:py-32 lg:py-40",
  }[size];
  return (
    <section id={id} className={`${pad} ${className}`}>
      <Canvas>{children}</Canvas>
    </section>
  );
}

/* ───────────────────────── Typography ───────────────────────── */

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`type-micro font-medium text-gold ${className}`}>
      <span aria-hidden className="mr-2">
        —
      </span>
      {children}
    </p>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  body,
  action,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between md:gap-10">
      <div className="max-w-2xl">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="type-display-m mt-4">{title}</h2>
        {body ? <p className="type-body mt-4 max-w-xl text-muted-foreground">{body}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ───────────────────────── Buttons ───────────────────────── */

type Variant = "primary" | "secondary" | "text";

const base =
  "tap press group inline-flex items-center justify-center gap-2.5 rounded-sm text-[13px] font-medium uppercase tracking-[0.14em] transition-all duration-[var(--motion-standard)] ease-[cubic-bezier(0.16,1,0.3,1)] disabled:cursor-not-allowed disabled:opacity-40";

const variantClass: Record<Variant, string> = {
  primary: "bg-primary px-6 py-4 text-primary-foreground hover:opacity-90",
  secondary: "border border-border-strong px-6 py-4 text-foreground hover:bg-elevated",
  text: "px-0 py-2 text-foreground hover:text-gold",
};

export function Button({
  children,
  variant = "primary",
  arrow = true,
  className = "",
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest} className={`${base} ${variantClass[variant]} ${className}`}>
      {children}
      {arrow ? (
        <ArrowRight className="arrow-nudge h-4 w-4" />
      ) : null}
    </button>
  );
}

export function ButtonLink({
  to,
  params,
  href,
  children,
  variant = "primary",
  arrow = true,
  className = "",
}: {
  to?: any;
  params?: any;
  href?: string;
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
}) {
  const cls = `${base} ${variantClass[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow ? (
        <ArrowUpRight className="arrow-nudge-diagonal h-4 w-4" />
      ) : null}
    </>
  );
  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={to} params={params} className={cls}>
      {inner}
    </Link>
  );
}

export function TextLink({ to, params, children }: { to: any; params?: any; children: ReactNode }) {
  return (
    <Link
      to={to}
      params={params}
      className="group inline-flex items-center gap-2 py-2 text-[12.5px] font-medium uppercase tracking-[0.14em] text-foreground"
    >
      <span className="link-underline">{children}</span>
      <ArrowRight className="h-4 w-4 text-gold transition-transform duration-[var(--motion-fast)] group-hover:translate-x-1" />
    </Link>
  );
}

/* ───────────────────────── Motion ───────────────────────── */

/** Delegates to the centralized YV motion system. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  variant = "up",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: MotionRevealVariant;
}) {
  return (
    <MotionReveal delay={delay} className={className} variant={variant}>
      {children}
    </MotionReveal>
  );
}

/* ───────────────────────── Media ───────────────────────── */

export type Ratio = "cinematic" | "landscape" | "portrait" | "tall" | "square";

const ratioClass: Record<Ratio, string> = {
  cinematic: "aspect-video",
  landscape: "aspect-[3/2]",
  portrait: "aspect-[4/5]",
  tall: "aspect-[3/4]",
  square: "aspect-square",
};

export function ImageBlock({
  src,
  alt,
  ratio = "landscape",
  variant = "editorial",
  position,
  placeholder,
  priority = false,
  caption,
  className = "",
}: {
  src: string;
  alt: string;
  ratio?: Ratio;
  variant?: "editorial" | "full-bleed";
  position?: string;
  placeholder?: string | null;
  priority?: boolean;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={variant === "full-bleed" ? `full-bleed ${className}` : className}>
      <div
        className={`media-zoom relative overflow-hidden bg-elevated ${ratioClass[ratio]} ${
          variant === "editorial" ? "rounded-sm border border-border" : ""
        }`}
        style={placeholder ? { backgroundImage: `url(${placeholder})`, backgroundSize: "cover" } : undefined}
      >
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          style={position ? { objectPosition: position } : undefined}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      {caption ? <figcaption className="type-small mt-3 text-muted-foreground">{caption}</figcaption> : null}
    </figure>
  );
}

export function VideoBlock({
  src,
  poster,
  ratio = "cinematic",
  label,
}: {
  src: string;
  poster?: string;
  ratio?: Ratio;
  label: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-sm border border-border bg-elevated ${ratioClass[ratio]}`}>
      <video
        src={src}
        poster={poster}
        aria-label={label}
        muted
        loop
        playsInline
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

/* ───────────────────────── Project card / grid ───────────────────────── */

export type ProjectCardData = {
  title: string;
  client?: string | null;
  category?: string | null;
  year?: string | number | null;
  image: string;
  placeholder?: string | null;
  to?: any;
  params?: any;
  ratio?: Ratio;
};

export function ProjectCard({ project, priority = false }: { project: ProjectCardData; priority?: boolean }) {
  const meta = [project.category, project.year].filter(Boolean).join(" · ");
  const inner = (
    <>
      <div
        data-cursor="view"
        className={`media-zoom relative overflow-hidden bg-elevated ${ratioClass[project.ratio ?? "landscape"]}`}
        style={
          project.placeholder ? { backgroundImage: `url(${project.placeholder})`, backgroundSize: "cover" } : undefined
        }
      >
        <img
          src={project.image}
          alt={`${project.title}${project.client ? ` — ${project.client}` : ""} by Yomi Visuals`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="type-heading-s truncate uppercase tracking-[-0.01em]">
            {project.title}
            {project.client ? <span className="text-muted-foreground"> / {project.client}</span> : null}
          </h3>
          {meta ? (
            <p className="type-small mt-1.5 text-muted-foreground transition-colors duration-[var(--motion-standard)] group-hover:text-subtle">
              {meta}
            </p>
          ) : null}
        </div>
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-[var(--motion-standard)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
      </div>
    </>
  );

  if (!project.to) return <article className="group">{inner}</article>;
  return (
    <article className="group">
      <Link to={project.to} params={project.params} className="block">
        {inner}
      </Link>
    </article>
  );
}

export function ProjectGrid({ projects }: { projects: ProjectCardData[] }) {
  if (!projects.length) {
    return <EmptyState title="No projects yet" body="We're preparing the next chapter." />;
  }
  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-x-6 md:gap-y-16">
      {projects.map((p, i) => (
        <Reveal key={`${p.title}-${i}`} delay={(i % 2) * STAGGER.step} className={i % 4 === 3 ? "md:mt-16" : ""}>
          <ProjectCard project={p} priority={i < 2} />
        </Reveal>
      ))}
    </div>
  );
}

/* ───────────────────────── Services accordion ───────────────────────── */

export type ServiceRowData = { code: string; title: string; summary: string; items: string[] };

export function ServiceAccordion({ rows }: { rows: ServiceRowData[] }) {
  const [open, setOpen] = useState<string | null>(rows[0]?.code ?? null);
  return (
    <div className="border-t border-border">
      {rows.map((row) => {
        const isOpen = open === row.code;
        return (
          <div key={row.code} className="border-b border-border">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : row.code)}
                className="tap flex w-full items-start gap-4 py-6 text-left md:gap-8 md:py-8"
              >
                <span className="text-index mt-2 shrink-0">{row.code}</span>
                <span className="min-w-0 flex-1">
                  <span className="type-heading-l block uppercase">{row.title}</span>
                  <span className="type-small mt-2 block text-muted-foreground">{row.summary}</span>
                </span>
                <span className="mt-1 shrink-0 text-gold" aria-hidden>
                  {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </span>
              </button>
            </h3>
            <div
              className="grid transition-all duration-[var(--motion-standard)] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
            >
              <div className="overflow-hidden">
                <ul className="flex flex-wrap gap-2 pb-8 md:pl-[calc(2rem+40px)]">
                  {row.items.map((i) => (
                    <li key={i} className="rounded-sm border border-border px-3.5 py-2 text-[12.5px] text-subtle">
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ───────────────────────── Process timeline ───────────────────────── */

export function ProcessTimeline({ stages }: { stages: { code: string; title: string; body: string }[] }) {
  return (
    <ol className="grid gap-px bg-border md:grid-flow-col md:auto-cols-fr">
      {stages.map((s) => (
        <li key={s.code} className="group bg-background p-5 md:p-6">
          <div className="flex items-center gap-3 md:block">
            <span className="text-index">{s.code}</span>
            <span
              className="hidden h-px w-full bg-border transition-colors duration-[var(--motion-standard)] group-hover:bg-gold md:mt-4 md:block"
              aria-hidden
            />
            <h3 className="type-heading-s uppercase md:mt-4">{s.title}</h3>
          </div>
          <p className="type-small mt-3 text-muted-foreground">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

/* ───────────────────────── Ecosystem map ───────────────────────── */

export function EcosystemMap({
  divisions,
}: {
  divisions: { code: string; name: string; tagline: string; body: string }[];
}) {
  const [active, setActive] = useState(divisions[0]?.code ?? "");
  const current = divisions.find((d) => d.code === active) ?? divisions[0];
  return (
    <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,1fr)_1fr]">
      <ul className="bg-background">
        {divisions.map((d) => (
          <li key={d.code}>
            <button
              type="button"
              onMouseEnter={() => setActive(d.code)}
              onFocus={() => setActive(d.code)}
              onClick={() => setActive(d.code)}
              aria-current={active === d.code}
              className={`tap flex w-full items-baseline gap-4 border-b border-border px-1 py-4 text-left transition-colors duration-[var(--motion-fast)] md:px-3 md:py-5 ${
                active === d.code ? "bg-elevated" : "hover:bg-elevated/60"
              }`}
            >
              <span className="text-index shrink-0">{d.code}</span>
              <span
                className={`type-heading-s uppercase transition-colors ${
                  active === d.code ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {d.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="bg-background p-6 md:p-10">
        <Eyebrow>{current?.tagline}</Eyebrow>
        <h3 className="type-display-m mt-4 uppercase">{current?.name}</h3>
        <p className="type-body mt-4 max-w-md text-muted-foreground">{current?.body}</p>
      </div>
    </div>
  );
}

/* ───────────────────────── Team ───────────────────────── */

export function TeamMember({
  name,
  role,
  image,
  alt,
}: {
  name: string;
  role: string;
  image?: string | null;
  alt?: string;
}) {
  return (
    <article className="group">
      <div className={`media-zoom relative overflow-hidden bg-elevated ${ratioClass.tall}`}>
        {image ? (
          <img
            src={image}
            alt={alt ?? `${name}, ${role} at Yomi Visuals`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="type-micro text-muted-foreground">Portrait coming soon</span>
          </div>
        )}
      </div>
      <h3 className="type-heading-s mt-4 uppercase">{name}</h3>
      <p className="type-small mt-1 text-muted-foreground">{role}</p>
    </article>
  );
}

/* ───────────────────────── Forms ───────────────────────── */

export const fieldClass =
  "w-full rounded-sm border border-input bg-surface px-4 py-4 text-[15px] text-foreground outline-none transition-colors duration-[var(--motion-fast)] placeholder:text-muted-foreground focus:border-gold";

export function Field({
  label,
  hint,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="block">
      <label htmlFor={htmlFor} className="type-micro mb-2.5 block text-subtle">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-2 text-[12px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldClass} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${fieldClass} ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${fieldClass} ${props.className ?? ""}`} />;
}

/* ───────────────────────── States ───────────────────────── */

export function LoadingState({ label = "Loading", rows = 3 }: { label?: string; rows?: number }) {
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      <span className="type-micro text-muted-foreground">{label}…</span>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className={`skeleton rounded-sm ${ratioClass.landscape}`} />
            <div className="skeleton h-4 w-2/3 rounded-sm" />
            <div className="skeleton h-3 w-1/3 rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-sm border border-dashed border-border px-6 py-14 text-center">
      <h3 className="type-heading-m uppercase">{title}</h3>
      <p className="type-body mx-auto mt-3 max-w-sm text-muted-foreground">{body}</p>
      {action ? <div className="mt-7 flex justify-center">{action}</div> : null}
    </div>
  );
}

/* ───────────────────────── CTA ───────────────────────── */

export function CTA({
  title,
  body,
  primary,
  secondary,
}: {
  title: string;
  body?: string;
  primary: { to: any; label: string };
  secondary?: { to: any; label: string };
}) {
  return (
    <section className="border-t border-border py-20 md:py-32">
      <Canvas>
        <h2 className="type-display-l max-w-4xl uppercase">{title}</h2>
        {body ? <p className="type-body-l mt-6 max-w-lg text-muted-foreground">{body}</p> : null}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to={primary.to}>{primary.label}</ButtonLink>
          {secondary ? (
            <ButtonLink to={secondary.to} variant="secondary" arrow={false}>
              {secondary.label}
            </ButtonLink>
          ) : null}
        </div>
      </Canvas>
    </section>
  );
}
