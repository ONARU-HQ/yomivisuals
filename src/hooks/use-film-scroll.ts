import { useEffect, type DependencyList } from "react";
import { FULL_MOTION_QUERY } from "@/lib/film/motion";

type Gsap = typeof import("gsap").gsap;
type ST = typeof import("gsap/ScrollTrigger").ScrollTrigger;

/**
 * Layer 05 — runs `setup` only when the screen is large AND motion is welcome
 * (same gate as the .film-track CSS). Everything is reverted on unmount.
 * `setup` returns nothing; create ScrollTriggers/tweens inside it.
 */
export function useFilmScroll(setup: (gsap: Gsap, ScrollTrigger: ST) => void, deps: DependencyList = []) {
  useEffect(() => {
    let revert: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        setup(gsap, ScrollTrigger);
      });
      revert = () => mm.revert();
    })();
    return () => {
      cancelled = true;
      revert?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
