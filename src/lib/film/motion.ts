/**
 * Layer 05 — Motion. Single source of truth for the film's timing (brief Part 14).
 * CSS mirrors these as --m-* in styles.css. Essential controls never exceed `standard`.
 */
export const MOTION = {
  micro: 0.18, // hover, focus, press
  standard: 0.38, // panels, menus, filters
  editorial: 0.72, // reveals
  cinematic: 1.1, // scene transitions
} as const;

export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
} as const;

/** Mirrors the CSS gate used by .film-track: large screen AND motion welcome. */
export const FULL_MOTION_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
export const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_QUERY).matches;
}
