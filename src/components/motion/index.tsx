/**
 * YV Motion components — the only place motion behaviour is implemented.
 * All values come from src/lib/motion.ts tokens.
 */
import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import {
  DISTANCE,
  DURATION,
  SCALE,
  STAGGER,
  transition,
  useInView,
  usePointerDevice,
  useReducedMotion,
  useScrollOffset,
  type DurationToken,
} from "@/lib/motion";

/* ───────────────────────── Reveal ───────────────────────── */

export type RevealVariant = "fade" | "up" | "scale" | "clip";

/**
 * Scroll reveal. Container appears, content settles. Reduced motion keeps the
 * element visible with no transform.
 */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  duration = "cinematic",
  distance = DISTANCE.md,
  className = "",
  as: Tag = "div",
  once = true,
}: {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: DurationToken | number;
  distance?: number;
  className?: string;
  as?: ElementType;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ once });

  const hidden: CSSProperties =
    variant === "fade"
      ? { opacity: 0 }
      : variant === "scale"
        ? { opacity: 0, transform: `scale(${SCALE.revealFrom})` }
        : variant === "clip"
          ? { opacity: 0, clipPath: "inset(0 0 100% 0)" }
          : { opacity: 0, transform: `translate3d(0, ${distance}px, 0)` };

  const shown: CSSProperties = {
    opacity: 1,
    transform: "none",
    clipPath: variant === "clip" ? "inset(0 0 0% 0)" : undefined,
  };

  const style: CSSProperties = reduced
    ? { opacity: 1 }
    : {
        ...(inView ? shown : hidden),
        transition: transition(
          variant === "clip" ? ["opacity", "clip-path"] : ["opacity", "transform"],
          duration,
          "out",
          delay,
        ),
        willChange: inView ? undefined : "opacity, transform",
      };

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

/**
 * Section entrance: label → headline → body → CTA, using the canonical stagger.
 * Children are revealed in order; pass at most four or five.
 */
export function RevealGroup({
  children,
  className = "",
  step = STAGGER.step,
  variant = "up",
}: {
  children: ReactNode[];
  className?: string;
  step?: number;
  variant?: RevealVariant;
}) {
  const items = children.filter(Boolean);
  return (
    <div className={className}>
      {items.map((child, i) => (
        <Reveal key={i} variant={variant} delay={i * step}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}

/* ───────────────────────── Media reveal ───────────────────────── */

/** Image that reveals through a mask, then settles from a subtle scale. */
export function RevealImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  priority = false,
  placeholder,
  style,
  cursor = "view",
  ...rest
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  placeholder?: string | null;
  style?: CSSProperties;
  cursor?: "view" | "open" | "play" | "drag" | "none";
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "className" | "style" | "placeholder">) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const on = reduced || inView || priority;

  return (
    <div
      ref={ref}
      data-cursor={cursor === "none" ? undefined : cursor}
      className={`relative overflow-hidden bg-elevated ${className}`}
      style={{
        ...(placeholder ? { backgroundImage: `url(${placeholder})`, backgroundSize: "cover" } : null),
        ...style,
      }}
    >
      <img
        {...rest}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        style={
          reduced
            ? undefined
            : {
                opacity: on ? 1 : 0,
                clipPath: on ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
                transform: on ? "scale(1)" : `scale(${SCALE.revealFrom})`,
                transition: transition(["opacity", "clip-path", "transform"], "dramatic", "out"),
              }
        }
      />
    </div>
  );
}

/* ───────────────────────── Filter / content swap ───────────────────────── */

/**
 * Cross-fades content when `swapKey` changes — used by the work filters so the
 * grid never hard-refreshes. Total interaction stays inside 300–500ms.
 */
export function SwapFade({
  swapKey,
  children,
  className = "",
}: {
  swapKey: string;
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(children);
  const [visible, setVisible] = useState(true);
  const keyRef = useRef(swapKey);

  useEffect(() => {
    if (keyRef.current === swapKey) {
      setShown(children);
      return;
    }
    keyRef.current = swapKey;
    if (reduced) {
      setShown(children);
      return;
    }
    setVisible(false);
    const id = window.setTimeout(() => {
      setShown(children);
      setVisible(true);
    }, DURATION.fast);
    return () => window.clearTimeout(id);
  }, [swapKey, children, reduced]);

  return (
    <div
      className={className}
      style={
        reduced
          ? undefined
          : {
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translate3d(0, 8px, 0)",
              transition: transition(["opacity", "transform"], "fast", "inOut"),
            }
      }
    >
      {shown}
    </div>
  );
}

/* ───────────────────────── Route transitions ───────────────────────── */

/**
 * Outgoing page fades, incoming page settles. Navigation stays stable and the
 * transition never blocks interaction.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [key, setKey] = useState(pathname);
  const [entered, setEntered] = useState(true);

  useEffect(() => {
    if (reduced) {
      setKey(pathname);
      return;
    }
    setEntered(false);
    setKey(pathname);
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, [pathname, reduced]);

  return (
    <div
      key={key}
      style={
        reduced
          ? undefined
          : {
              opacity: entered ? 1 : 0,
              transform: entered ? "none" : "translate3d(0, 10px, 0)",
              transition: transition(["opacity", "transform"], "cinematic", "out"),
            }
      }
    >
      {children}
    </div>
  );
}

/**
 * Brand-consistent route loading state: a hairline progress line plus the YV
 * wordmark. Never a blank screen, never a dominating spinner.
 */
export function RouteProgress() {
  const routerLoading = useRouterState({ select: (s) => s.status === "pending" || s.isLoading });
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  // Server render is always idle so hydration matches; loading is a client concern.
  const isLoading = mounted && routerLoading;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isLoading) {
      const id = window.setTimeout(() => setVisible(true), 180);
      return () => window.clearTimeout(id);
    }
    setVisible(false);
  }, [isLoading]);

  return (
    <div aria-live="polite" aria-busy={isLoading} className="pointer-events-none fixed inset-x-0 top-0 z-[70]">
      <div
        className="h-px origin-left bg-gold"
        style={{
          transform: `scaleX(${visible ? 0.85 : isLoading ? 0.2 : 1})`,
          opacity: isLoading ? 1 : 0,
          transition: `transform ${visible ? DURATION.dramatic : DURATION.fast}ms cubic-bezier(0.16,1,0.3,1), opacity ${DURATION.standard}ms ease-out`,
        }}
      />
      <span
        className="absolute right-4 top-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:right-10"
        style={{ opacity: visible ? 1 : 0, transition: `opacity ${DURATION.standard}ms ease-out` }}
      >
        {visible ? "YV" : ""}
      </span>
    </div>
  );
}

/** Restrained full-block loading state for suspense / data waits. */
export function BrandLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="grid min-h-[50svh] place-items-center px-5">
      <span className="yv-breathe text-[13px] uppercase tracking-[0.42em] text-muted-foreground">Yomi Visuals</span>
      <span className="sr-only">{label}</span>
    </div>
  );
}

/* ───────────────────────── Hero behaviour ───────────────────────── */

/**
 * Hero settle on scroll: headline drifts up, supporting content fades, media
 * scales very slightly. Transform/opacity only.
 */
export function useHeroScroll(range = 420) {
  const reduced = useReducedMotion();
  const offset = useScrollOffset(range);
  const p = reduced ? 0 : Math.min(offset / range, 1);
  return {
    progress: p,
    headline: { transform: `translate3d(0, ${-p * 28}px, 0)`, opacity: 1 - p * 0.25 },
    support: { transform: `translate3d(0, ${-p * 16}px, 0)`, opacity: 1 - p * 0.6 },
    media: { transform: `scale(${1 + p * 0.04})`, opacity: 1 - p * 0.15 },
    cue: { opacity: Math.max(0, 1 - p * 3) },
  } as const;
}

/** Hero scroll cue. Fades out as soon as the user starts scrolling. */
export function ScrollCue({ targetId }: { targetId?: string }) {
  const { cue } = useHeroScroll(220);
  return (
    <button
      type="button"
      onClick={() => {
        const el = targetId ? document.getElementById(targetId) : null;
        (el ?? window).scrollTo?.({ top: el ? el.getBoundingClientRect().top + window.scrollY - 60 : window.innerHeight * 0.9, behavior: "smooth" });
      }}
      className="yv-cue tap group inline-flex items-center gap-3 text-[10.5px] uppercase tracking-[0.28em] text-muted-foreground transition-colors duration-[130ms] hover:text-foreground"
      style={{ opacity: cue.opacity, transition: transition("opacity", "standard", "out") }}
      aria-label="Scroll to content"
    >
      Scroll
      <span aria-hidden className="yv-cue-arrow">
        ↓
      </span>
    </button>
  );
}

/* ───────────────────────── Cursor ───────────────────────── */

/**
 * Subtle desktop cursor layer. Reads `data-cursor` from the hovered element
 * (view / open / play / drag). Disabled for touch, tablets and reduced motion,
 * and never replaces the native cursor.
 */
export function CursorLayer() {
  const pointer = usePointerDevice();
  const reduced = useReducedMotion();
  const [label, setLabel] = useState<string | null>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pointer || reduced) return;
    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
      const el = (e.target as HTMLElement | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      setLabel(el?.dataset["cursor"] ?? null);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pointer, reduced]);

  if (!pointer || reduced) return null;

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden lg:block"
      style={{ willChange: "transform" }}
    >
      <span
        className="grid h-16 w-16 place-items-center rounded-full border border-gold/60 bg-background/40 text-[9.5px] uppercase tracking-[0.22em] text-foreground backdrop-blur-[2px]"
        style={{
          opacity: label ? 1 : 0,
          transform: `scale(${label ? 1 : 0.6})`,
          transition: transition(["opacity", "transform"], "fast", "out"),
        }}
      >
        {label ?? ""}
      </span>
    </div>
  );
}
