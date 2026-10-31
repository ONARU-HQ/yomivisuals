/** Layer 07 — Integrations. Verified outbound destinations and facts. */
export const STUDIO_URL = "https://yvstudios.africa";
export const INSTAGRAM_URL = "https://instagram.com/yomi.visuals";
export const SITE_URL = "https://yomivisuals.com";

export const NAV = [
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/lab", label: "Lab" },
  { to: "/journal", label: "Journal" },
  { to: "/collaborate", label: "Collaborate" },
] as const;

/** Facts supplied by the creative director. Do not extend without confirmation. */
export const BIO = {
  degree: "Computer Science graduate, 2021 (Second Class Upper)",
  lines: [
    "Professional experience in photography and creative direction.",
    "Building businesses and creative projects.",
    "Rediscovering practical software development through experimentation and AI-assisted building.",
    "Exploring the space where creativity and technology meet.",
  ],
};
