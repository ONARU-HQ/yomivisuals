/** Layer 01 — Journal. Empty on purpose: nothing is published until it is written by Yomi. */
export type Entry = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  body: string[];
};
export const ENTRIES: Entry[] = [];
export const THEMES = ["Visual storytelling", "Creative direction", "Photography", "Design", "Software engineering", "Creative coding", "Building digital products", "Lessons from experimentation"];
