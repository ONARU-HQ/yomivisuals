/**
 * YV Motion System — single source of truth for duration, easing, distance,
 * opacity, scale and reduced-motion behaviour.
 *
 * Motion exists for four reasons only: ORIENT, RESPOND, REVEAL, TRANSITION.
 * If an animation does none of those four things, it does not belong here.
 */
import { useEffect, useRef, useState } from "react";

/* ───────────────────────── Tokens ───────────────────────── */

export const DURATION = {
  micro: 130,
  fast: 220,
  standard: 380,
  cinematic: 640,
  dramatic: 1000,
} as const;

export type DurationToken = keyof typeof DURATION;

export const EASE = {
  /** Entrances — decelerate into place. */
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** Transitions between two states. */
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  /** Exits — accelerate away. */
  in: "cubic-bezier(0.55, 0, 1, 0.45)",
} as const;

export type EaseToken = keyof typeof EASE;

/** Translate distances used by reveals (px). */
export const DISTANCE = { sm: 12, md: 24, lg: 40 } as const;

/** Scale values. Never dramatic. */
export const SCALE = {
  press: 0.97,
  hoverImage: 1.03,
  hoverImageSubtle: 1.02,
  revealFrom: 1.03,
} as const;

/** Section entrance stagger, in ms. Label → headline → body → CTA. */
export const STAGGER = { label: 0, headline: 80, body: 150, action: 220, step: 70 } as const;

/** Build a CSS transition string from tokens. */
export function transition(
  properties: string | string[] = "opacity, transform",
  duration: DurationToken | number = "standard",
  ease: EaseToken = "out",
  delay = 0,
) {
  const ms = typeof duration === "number" ? duration : DURATION[duration];
  const props = Array.isArray(properties) ? properties : properties.split(",").map((p) => p.trim());
  return props.map((p) => `${p} ${ms}ms ${EASE[ease]} ${delay}ms`).join(", ");
}

/* ───────────────────────── Reduced motion ───────────────────────── */

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** SSR-safe reduced-motion subscription. Defaults to `false` before hydration. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => setReduced(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/** True only on real pointer devices (hover + fine pointer). */
export function usePointerDevice() {
  const [pointer, setPointer] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setPointer(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);
  return pointer;
}

/* ───────────────────────── Viewport observation ───────────────────────── */

/**
 * IntersectionObserver-backed in-view flag. No scroll listeners, no layout reads.
 * With reduced motion the element is reported in view immediately.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  once = true,
  margin = "0px 0px -10% 0px",
  amount = 0,
}: { once?: boolean; margin?: string; amount?: number } = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin: margin, threshold: amount },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, margin, amount]);

  return { ref, inView } as const;
}

/**
 * Throttled (rAF) window scroll offset in px. Used for hero settle and nav
 * compaction only — never for per-element parallax maths.
 */
export function useScrollOffset(max = 600) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      setOffset(Math.min(window.scrollY, max));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [max]);

  return offset;
}

/* ───────────────────────── Interaction state ───────────────────────── */

/**
 * The canonical async action state machine used by every form and submit
 * button: idle → submitting → processing → success | error.
 */
export type ActionState = "idle" | "submitting" | "processing" | "success" | "error";

export const ACTION_LABELS: Record<ActionState, string | null> = {
  idle: null,
  submitting: "Sending…",
  processing: "Processing…",
  success: "Sent",
  error: "Try again",
};
