import markAsset from "@/assets/yv-mark-ink.png.asset.json";
import markLightAsset from "@/assets/yv-mark.png.asset.json";
import watermarkAsset from "@/assets/yv-watermark.png.asset.json";

/**
 * Single source of truth for every Yomi Visuals communication surface:
 * emails, PDF documents and portal notifications.
 */

export const SITE_ORIGIN = "https://yomivisuals.lovable.app";

const absolute = (url: string) => (url.startsWith("http") ? url : `${SITE_ORIGIN}${url}`);

/** Official, uploaded brand assets. Never redrawn, recolored or distorted. */
export const brandAssets = {
  /** YV mark for light surfaces (dark Y, gold V) — headers, signatures, documents. */
  mark: absolute(markAsset.url),
  /** YV mark for dark surfaces (white Y, gold V). */
  markOnDark: absolute(markLightAsset.url),
  /** Official YV watermark (dark plate) — for dark surfaces. */
  watermark: absolute(watermarkAsset.url),
};

export const brand = {
  name: "Yomi Visuals",
  shortName: "YV",
  descriptor: "Creative Production Company",
  location: "Lagos, Nigeria",
  website: SITE_ORIGIN,
  websiteLabel: "yomivisuals.com",
  email: "hello@yomivisuals.com",
  instagram: "https://instagram.com/yomivisuals",
  instagramLabel: "@yomivisuals",
  founder: { name: "Yomi Onalaru", role: "Founder & Creative Producer" },
};

/** Email-safe palette. Mirrors the website tokens. */
export const palette = {
  ink: "#0A0A0A",
  inkSoft: "#111111",
  offWhite: "#F5F5F2",
  white: "#FFFFFF",
  gold: "#C6A15B",
  grey: "#777777",
  line: "#E4E2DC",
};

export const fontStack =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

/** Watermark opacity is admin-controllable within a safe, subtle range. */
export const WATERMARK_OPACITY_RANGE = { min: 0.03, max: 0.12, default: 0.07 };

export function clampWatermarkOpacity(value: number | null | undefined) {
  const v = Number.isFinite(Number(value)) ? Number(value) : WATERMARK_OPACITY_RANGE.default;
  return Math.min(WATERMARK_OPACITY_RANGE.max, Math.max(WATERMARK_OPACITY_RANGE.min, v));
}

/** Status vocabulary — neutral, with gold reserved for live/attention states. */
export const statusTones: Record<string, "neutral" | "gold" | "ink"> = {
  NEW: "neutral",
  REVIEWING: "neutral",
  QUALIFIED: "gold",
  PROPOSAL: "gold",
  APPROVED: "ink",
  "IN PRODUCTION": "gold",
  "IN REVIEW": "neutral",
  DELIVERED: "ink",
  COMPLETED: "ink",
  PAID: "ink",
  UNPAID: "neutral",
  OVERDUE: "gold",
};
