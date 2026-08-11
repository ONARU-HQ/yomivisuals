import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1320px] px-5 md:px-10 ${className}`}>{children}</div>;
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-20 md:py-32 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-eyebrow before:mr-2 before:inline-block before:content-['—']">{children}</p>;
}

export function SectionHeading({
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
    <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="text-display mt-4 text-[clamp(2rem,5vw,3.4rem)] text-foreground">{title}</h2>
        {body ? <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{body}</p> : null}
      </div>
      {action}
    </div>
  );
}

type ButtonProps = {
  children: ReactNode;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
};

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[13px] font-medium tracking-tight transition-all duration-300";

const variants = {
  solid: "bg-primary text-primary-foreground hover:opacity-90",
  outline: "border border-border-strong text-foreground hover:bg-elevated",
  ghost: "text-foreground hover:bg-elevated",
} as const;

export function ButtonLink({
  to,
  params,
  href,
  children,
  variant = "solid",
  className = "",
  arrow = true,
}: ButtonProps & { to?: any; params?: any; href?: string; arrow?: boolean }) {
  const cls = `${buttonBase} ${variants[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow ? <ArrowUpRight className="h-4 w-4" /> : null}
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

export function Button({
  children,
  variant = "solid",
  className = "",
  ...rest
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`${buttonBase} ${variants[variant]} disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

export function TextLink({ to, params, children }: { to: any; params?: any; children: ReactNode }) {
  return (
    <Link
      to={to}
      params={params}
      className="group inline-flex items-center gap-2 text-[13px] font-medium text-foreground"
    >
      <span className="link-underline">{children}</span>
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(20px)",
        transition: `opacity 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-border pt-32 pb-14 md:pt-44 md:pb-20">
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-display mt-5 max-w-4xl text-[clamp(2.4rem,7vw,5rem)]">{title}</h1>
        {body ? (
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground md:text-base">{body}</p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </header>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-medium tracking-tight text-subtle">{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-[11px] text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-[10px] border border-input bg-elevated px-4 py-3 text-[14px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-border-strong";
