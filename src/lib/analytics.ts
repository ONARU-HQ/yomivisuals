/** Lightweight, dependency-free event tracking for YV commercial funnels. */

export type YvEvent =
  | "HERO_LOADED"
  | "VIDEO_PLAY"
  | "VIDEO_SOUND_ON"
  | "VIDEO_SOUND_OFF"
  | "VIDEO_COMPLETE"
  | "VIDEO_FALLBACK"
  | "START_PROJECT"
  | "VIEW_WORK";

type Payload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    yvEvents?: { event: YvEvent; payload: Payload; at: number }[];
  }
}

/** Fire-and-forget. Safe on the server and when no analytics provider exists. */
export function track(event: YvEvent, payload: Payload = {}) {
  if (typeof window === "undefined") return;
  const entry = { event, payload, at: Date.now() };
  window.yvEvents = [...(window.yvEvents ?? []).slice(-99), entry];
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...payload });
}
