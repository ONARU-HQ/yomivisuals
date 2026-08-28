/**
 * YV Project Engine — single source of truth for the project acquisition flow.
 * Taxonomy, recommendation rules, classification, routing and summaries all live here
 * so the public brief form and the internal pipeline read from the same logic.
 */

export type ProjectSize = "small" | "medium" | "large" | "enterprise";
export type Workflow = "fast_track" | "standard" | "full_production";

/** What a client is trying to make. Used on the homepage entry grid and step 1. */
export const PROJECT_TYPES = [
  { key: "campaign", label: "Brand Campaign", body: "A concept, a production and a rollout across channels." },
  { key: "commercial", label: "Commercial", body: "A directed advert for broadcast, social or digital." },
  { key: "brand-film", label: "Brand Film", body: "Story-led film built around what the brand stands for." },
  { key: "photography", label: "Photography", body: "Campaign, editorial, corporate or lifestyle stills." },
  { key: "product", label: "Product Shoot", body: "Studio product, packaging and e-commerce imagery." },
  { key: "fashion", label: "Fashion", body: "Lookbooks, collections, editorial and campaign fashion." },
  { key: "social", label: "Social Content", body: "Ongoing content built for feed, reels and paid social." },
  { key: "event", label: "Event / Experience", body: "Coverage and content capture for live moments." },
  { key: "studio", label: "Studio Production", body: "A production run inside a controlled studio space." },
  { key: "not-sure", label: "Not sure yet", body: "You know the goal, not the format. We'll shape it." },
] as const;

export type ProjectTypeKey = (typeof PROJECT_TYPES)[number]["key"];

export const typeLabel = (key: string) => PROJECT_TYPES.find((t) => t.key === key)?.label ?? key;

/** Objective-led entry — what the work has to achieve. */
export const OBJECTIVES = [
  { key: "launch", label: "Launch something new" },
  { key: "reposition", label: "Reposition the brand" },
  { key: "sell", label: "Sell a product" },
  { key: "awareness", label: "Build awareness" },
  { key: "content", label: "Keep content consistent" },
  { key: "document", label: "Document a moment" },
  { key: "exploring", label: "Still exploring" },
] as const;

export const objectiveLabel = (key: string) => OBJECTIVES.find((o) => o.key === key)?.label ?? key;

/** Everything YV can put on a project. Recommendations are drawn from this list. */
export const CAPABILITIES = [
  "Creative Direction",
  "Concept Development",
  "Campaign Strategy",
  "Art Direction",
  "Photography",
  "Film Production",
  "Direction",
  "Cinematography",
  "Product Photography",
  "Styling & Wardrobe",
  "Set Design",
  "Casting & Talent",
  "Hair & Makeup",
  "Location Scouting",
  "Studio Production",
  "Retouching",
  "Video Editing",
  "Colour Grading",
  "Motion Design",
  "Sound & Music",
  "Copywriting",
  "Social Cutdowns",
  "Campaign Rollout",
] as const;

const TYPE_SCOPE: Record<string, string[]> = {
  campaign: [
    "Campaign Strategy",
    "Concept Development",
    "Creative Direction",
    "Art Direction",
    "Photography",
    "Film Production",
    "Styling & Wardrobe",
    "Casting & Talent",
    "Retouching",
    "Campaign Rollout",
  ],
  commercial: [
    "Concept Development",
    "Direction",
    "Cinematography",
    "Film Production",
    "Casting & Talent",
    "Set Design",
    "Video Editing",
    "Colour Grading",
    "Sound & Music",
  ],
  "brand-film": [
    "Concept Development",
    "Creative Direction",
    "Direction",
    "Cinematography",
    "Video Editing",
    "Colour Grading",
    "Sound & Music",
    "Copywriting",
  ],
  photography: ["Creative Direction", "Photography", "Art Direction", "Location Scouting", "Retouching"],
  product: ["Product Photography", "Art Direction", "Set Design", "Studio Production", "Retouching"],
  fashion: [
    "Creative Direction",
    "Photography",
    "Styling & Wardrobe",
    "Hair & Makeup",
    "Casting & Talent",
    "Set Design",
    "Retouching",
  ],
  social: ["Concept Development", "Photography", "Film Production", "Video Editing", "Social Cutdowns", "Motion Design"],
  event: ["Photography", "Film Production", "Video Editing", "Social Cutdowns"],
  studio: ["Studio Production", "Photography", "Set Design", "Art Direction", "Retouching"],
  "not-sure": ["Concept Development", "Creative Direction", "Photography", "Film Production"],
};

const OBJECTIVE_SCOPE: Record<string, string[]> = {
  launch: ["Campaign Strategy", "Concept Development", "Campaign Rollout"],
  reposition: ["Campaign Strategy", "Creative Direction", "Art Direction", "Copywriting"],
  sell: ["Product Photography", "Social Cutdowns", "Retouching"],
  awareness: ["Concept Development", "Film Production", "Social Cutdowns", "Campaign Rollout"],
  content: ["Social Cutdowns", "Motion Design", "Video Editing"],
  document: ["Photography", "Film Production", "Video Editing"],
  exploring: ["Concept Development", "Creative Direction"],
};

/** What YV would put on this project, in a stable, de-duplicated order. */
export function recommendScope(types: string[], objective: string): string[] {
  const picked = new Set<string>();
  for (const t of types) for (const c of TYPE_SCOPE[t] ?? []) picked.add(c);
  for (const c of OBJECTIVE_SCOPE[objective] ?? []) picked.add(c);
  if (!picked.size) for (const c of TYPE_SCOPE["not-sure"]) picked.add(c);
  return CAPABILITIES.filter((c) => picked.has(c));
}

export const TIMELINE_OPTIONS = [
  "As soon as possible",
  "Within 2 weeks",
  "This month",
  "Next 1–3 months",
  "Later this year",
  "Still planning",
];

export const BUDGET_OPTIONS = [
  "Under ₦500,000",
  "₦500,000 – ₦2M",
  "₦2M – ₦5M",
  "₦5M – ₦15M",
  "₦15M+",
  "Not sure yet",
];

/** Budget band → internal project size. */
export function classifySize(budget: string): ProjectSize {
  if (budget.includes("15M+")) return "enterprise";
  if (budget.includes("₦5M – ₦15M")) return "large";
  if (budget.includes("₦2M – ₦5M")) return "medium";
  if (budget.includes("₦500,000 – ₦2M")) return "medium";
  return "small";
}

/** Primary category of the brief — drives the internal routing. */
export function classifyCategory(types: string[]): string {
  const order: string[] = ["campaign", "commercial", "brand-film", "fashion", "product", "photography", "social", "event", "studio"];
  for (const key of order) if (types.includes(key)) return key;
  return "other";
}

/** Which internal path this brief should take. Never exposes pricing to the client. */
export function classifyWorkflow(size: ProjectSize, category: string, timeline: string): Workflow {
  const heavy = ["campaign", "commercial", "brand-film"].includes(category);
  if (size === "enterprise" || size === "large" || heavy) return "full_production";
  if (size === "small" && (timeline === "As soon as possible" || timeline === "Within 2 weeks")) return "fast_track";
  return "standard";
}

export const WORKFLOW_LABEL: Record<Workflow, string> = {
  fast_track: "Fast track",
  standard: "Standard",
  full_production: "Full production",
};

export const SIZE_LABEL: Record<ProjectSize, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
  enterprise: "Enterprise",
};

/** Pipeline the studio moves a brief through. */
export const PIPELINE_STAGES = [
  { key: "new_brief", label: "New brief" },
  { key: "reviewing", label: "Reviewing" },
  { key: "qualified", label: "Qualified" },
  { key: "discovery", label: "Discovery call" },
  { key: "proposal", label: "Proposal sent" },
  { key: "approved", label: "Approved" },
  { key: "pre_production", label: "Pre-production" },
  { key: "production", label: "Production" },
  { key: "post_production", label: "Post-production" },
  { key: "client_review", label: "Client review" },
  { key: "delivered", label: "Delivered" },
  { key: "completed", label: "Completed" },
  { key: "archived", label: "Archived" },
] as const;

export const stageLabel = (key: string) => PIPELINE_STAGES.find((s) => s.key === key)?.label ?? key;

export type BriefInput = {
  types: string[];
  objective: string;
  detail: string;
  brand: string;
  industry: string;
  website: string;
  instagram: string;
  scope: string[];
  timeline: string;
  productionDate: string;
  budget: string;
  location: string;
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
};

/** Human-readable brief summary stored on the record and shown in the admin pipeline. */
export function summarise(b: BriefInput): string {
  const types = b.types.map(typeLabel).join(", ") || "Undecided format";
  const lines = [
    `${b.company || b.brand || b.name} — ${types}.`,
    b.objective ? `Objective: ${objectiveLabel(b.objective)}.` : "",
    b.detail ? `In their words: ${b.detail}` : "",
    b.scope.length ? `Scope: ${b.scope.join(", ")}.` : "",
    [b.timeline && `Timeline: ${b.timeline}`, b.productionDate && `target ${b.productionDate}`, b.location && `in ${b.location}`]
      .filter(Boolean)
      .join(" · "),
    b.budget ? `Budget band: ${b.budget}.` : "",
  ];
  return lines.filter(Boolean).join("\n");
}
