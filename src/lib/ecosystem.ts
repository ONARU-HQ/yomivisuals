/** YV master brand architecture — single source of truth for divisions & pillars. */

export type Division = {
  code: string;
  name: string;
  tagline: string;
  body: string;
  services: string[];
  /** External site, if the division lives on its own domain. */
  href?: string;
  status?: "live" | "building";
};

export const DIVISIONS: Division[] = [
  {
    code: "01",
    name: "YV Creative",
    tagline: "We develop the idea.",
    body: "Creative direction, campaign concepts and the strategy that decides what the work should say before anyone picks up a camera.",
    services: [
      "Creative Direction",
      "Campaign Concepts",
      "Art Direction",
      "Brand Storytelling",
      "Creative Strategy",
      "Visual Concepts",
      "Campaign Development",
      "Creative Consulting",
    ],
    status: "live",
  },
  {
    code: "02",
    name: "YV Production",
    tagline: "We make it happen.",
    body: "The production arm responsible for making the idea real — crew, kit, locations, direction and post, held to one standard.",
    services: [
      "Commercials",
      "Brand Films",
      "Campaign Production",
      "Photography",
      "Videography",
      "Fashion Production",
      "Product Production",
      "Corporate Production",
      "Event Production",
      "Social Content Production",
      "Post Production",
    ],
    status: "live",
  },
  {
    code: "03",
    name: "YV Campaigns",
    tagline: "Brief to final campaign.",
    body: "Bring us a business problem, not a service request. We build the campaign end to end and stay accountable for the outcome.",
    services: [
      "Brief",
      "Strategy",
      "Concept",
      "Creative Direction",
      "Pre-Production",
      "Production",
      "Post-Production",
      "Delivery",
    ],
    status: "live",
  },
  {
    code: "04",
    name: "YV Studios",
    tagline: "The production environment.",
    body: "Our physical studio and content house — a controlled space for brand shoots, creator sessions, video production and live productions.",
    services: [
      "Studio Rental",
      "Content House",
      "Production Space",
      "Creative Sessions",
      "Brand Shoots",
      "Video Production",
      "Creator Sessions",
      "Events & Productions",
    ],
    href: "https://www.yvstudios.ng",
    status: "live",
  },
  {
    code: "05",
    name: "YV Entertainment",
    tagline: "Media & entertainment production.",
    body: "Artist campaigns, music visuals, shows and original productions for the culture side of the business.",
    services: [
      "Music Visuals",
      "Artist Campaigns",
      "Entertainment Content",
      "Music Videos",
      "Interviews",
      "Shows",
      "Original Productions",
      "Documentary Projects",
    ],
    status: "building",
  },
  {
    code: "06",
    name: "YV Management",
    tagline: "Creative talent & production management.",
    body: "Representation and coordination for creators, plus the staffing layer that puts the right people on the right campaign.",
    services: [
      "Talent Management",
      "Creator Management",
      "Production Coordination",
      "Creative Partnerships",
      "Brand Collaborations",
      "Campaign Staffing",
    ],
    status: "building",
  },
  {
    code: "07",
    name: "YV Creators Network",
    tagline: "The team behind every production.",
    body: "A curated network of specialists assembled per project. We own the direction, the standard and the relationship — the network gives us range.",
    services: [
      "Photographers",
      "Directors",
      "Videographers",
      "Editors",
      "Stylists",
      "Makeup Artists",
      "Models",
      "Set Designers",
      "Producers",
      "Writers",
      "Animators",
      "Motion Designers",
      "Sound Professionals",
    ],
    status: "building",
  },
  {
    code: "08",
    name: "YV Shortlets",
    tagline: "Hospitality within the ecosystem.",
    body: "Accommodation connected to the YV ecosystem — separate from the creative-production offering, useful for productions and visiting crews.",
    services: ["Shortlet Apartments", "Production Stays", "Location Hosting"],
    status: "building",
  },
];

/** Future divisions — architecture is modular, these slot in without a rebuild. */
export const FUTURE_DIVISIONS = [
  "YV Films",
  "YV Design",
  "YV Music",
  "YV Events",
  "YV Originals",
  "YV Talent",
  "YV Digital",
  "YV Productions",
];

export const PILLARS = [
  {
    code: "Creative",
    title: "We develop the idea.",
    body: "Strategy, concept and creative direction. The thinking that gives a campaign a reason to exist.",
    items: DIVISIONS[0].services,
  },
  {
    code: "Production",
    title: "We make it happen.",
    body: "Full production capability across film, photography, content and post — crewed to the demands of the idea.",
    items: DIVISIONS[1].services,
  },
  {
    code: "Campaigns",
    title: "Brief to final campaign.",
    body: "End-to-end campaign ownership. One team accountable from the first conversation to the last deliverable.",
    items: DIVISIONS[2].services,
  },
];

export const PROCESS_STAGES = [
  { code: "01", title: "Discover", body: "Understand the brand, the problem and the objective before proposing anything." },
  { code: "02", title: "Define", body: "Build the creative direction and the strategy the work will be measured against." },
  { code: "03", title: "Concept", body: "Develop the central idea — the thing the campaign is actually about." },
  { code: "04", title: "Produce", body: "Assemble the right creative and production team for this specific project." },
  { code: "05", title: "Create", body: "Execute photography, film, design, content and campaign assets on location or in studio." },
  { code: "06", title: "Deliver", body: "Post-production, approvals and final delivery in every format the campaign needs." },
  { code: "07", title: "Scale", body: "Repurpose the campaign across channels so one production keeps working for months." },
];

export const TEAM_STRUCTURE = [
  { group: "Founders / Leadership", body: "Creative vision, client relationships and final quality control." },
  { group: "Creative", body: "Creative direction, concept development and art direction." },
  { group: "Production", body: "Producers and coordinators running schedules, crew, budgets and logistics." },
  { group: "Photo", body: "Photographers and assistants across campaign, fashion, product and corporate." },
  { group: "Video", body: "Directors, DOPs, camera and lighting teams." },
  { group: "Post-Production", body: "Editors, colourists, retouchers and motion designers." },
  { group: "Art Department", body: "Set design, props, build and on-set art direction." },
  { group: "Styling", body: "Wardrobe, styling, grooming and makeup." },
  { group: "Talent", body: "Casting, models and talent coordination." },
  { group: "Operations", body: "Scheduling, equipment, studio and delivery systems." },
  { group: "Client Services", body: "Briefs, approvals, reporting and the client relationship." },
];

export const PROJECT_TYPE_OPTIONS = [
  "Brand Campaign",
  "Commercial",
  "Brand Film",
  "Photography",
  "Video",
  "Product",
  "Fashion",
  "Entertainment",
  "Social Content",
  "Studio Production",
  "Other",
];

/** URL slug for a division, e.g. "YV Creators Network" -> "yv-creators-network". */
export const divisionSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const divisionBySlug = (slug: string) => DIVISIONS.find((d) => divisionSlug(d.name) === slug);

/** Work archive categories. */
export const WORK_CATEGORIES = [
  "All",
  "Campaigns",
  "Commercials",
  "Film",
  "Photography",
  "Fashion",
  "Product",
  "Entertainment",
  "Documentary",
];

export const CREATOR_ROLES = [
  "Photographer",
  "Director",
  "Filmmaker",
  "Editor",
  "Stylist",
  "Makeup Artist",
  "Model",
  "Designer",
  "Producer",
  "Writer",
  "Set Designer",
  "Motion Designer",
];

export const ENQUIRY_TYPES = [
  "General enquiry",
  "Production enquiry",
  "Studio enquiry",
  "Creator collaboration",
  "Partnership",
];

export const BUDGET_RANGES = [
  "Under ₦500,000",
  "₦500,000 – ₦2M",
  "₦2M – ₦5M",
  "₦5M – ₦15M",
  "₦15M+",
  "Not sure yet",
];

export const TIMELINES = [
  "As soon as possible",
  "Within 2 weeks",
  "This month",
  "Next 1–3 months",
  "Later this year",
  "Still planning",
];
