import type { ReactNode } from "react";

/** Inner-page opening: eyebrow, experience name, optional body. Clears the fixed nav. */
export function PageHead({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="film-pad bg-[var(--film-ink)] pb-12 pt-36 text-[var(--film-paper)] md:pb-16 md:pt-48">
      <div className="mx-auto max-w-[1500px]">
        <p className="film-eyebrow film-eyebrow--gold">{eyebrow}</p>
        <h1 className="film-title mt-5 max-w-5xl text-[clamp(2.4rem,7vw,6.8rem)]">{title}</h1>
        {children ? <div className="mt-7 max-w-xl text-[16px] leading-relaxed text-[var(--film-paper)]/80">{children}</div> : null}
      </div>
    </header>
  );
}

export function Main({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-[var(--film-ink)] text-[var(--film-paper)] ${className}`}>{children}</div>;
}
