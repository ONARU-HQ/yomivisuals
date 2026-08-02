export type FieldType = "text" | "textarea" | "richtext" | "number" | "boolean" | "date" | "array" | "json" | "image";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  full?: boolean;
};

export type CollectionDef = {
  key: string;
  table: string;
  label: string;
  singular: string;
  description: string;
  orderBy: string;
  ascending?: boolean;
  titleField: string;
  subtitleField?: string;
  statusField?: string;
  columns: { name: string; label: string }[];
  fields: FieldDef[];
};

const seo: FieldDef[] = [
  { name: "seo_title", label: "SEO title", type: "text" },
  { name: "seo_description", label: "SEO description", type: "textarea", full: true },
];

export const collections: CollectionDef[] = [
  {
    key: "projects",
    table: "projects",
    label: "Case studies",
    singular: "Case study",
    description: "Client work, published to /projects.",
    orderBy: "sort_order",
    ascending: true,
    titleField: "title",
    subtitleField: "client",
    statusField: "published",
    columns: [
      { name: "title", label: "Title" },
      { name: "client", label: "Client" },
      { name: "industry", label: "Industry" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "client", label: "Client", type: "text" },
      { name: "industry", label: "Industry", type: "text" },
      { name: "location", label: "Location", type: "text" },
      { name: "project_date", label: "Project date", type: "date" },
      { name: "services", label: "Services", type: "array" },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "challenge", label: "Challenge", type: "textarea", full: true },
      { name: "solution", label: "Solution", type: "textarea", full: true },
      { name: "results", label: "Results", type: "textarea", full: true },
      { name: "cover_image", label: "Cover image", type: "image", full: true },
      { name: "images", label: "Gallery images", type: "array", full: true },
      { name: "credits", label: "Credits", type: "json", full: true },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "published", label: "Published", type: "boolean" },
      { name: "sort_order", label: "Sort order", type: "number" },
      ...seo,
    ],
  },
  {
    key: "services",
    table: "services",
    label: "Services",
    singular: "Service",
    description: "Capabilities and pricing, published to /services.",
    orderBy: "sort_order",
    ascending: true,
    titleField: "title",
    subtitleField: "excerpt",
    statusField: "published",
    columns: [
      { name: "title", label: "Title" },
      { name: "slug", label: "Slug" },
      { name: "sort_order", label: "Order" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "icon", label: "Icon key", type: "text" },
      { name: "excerpt", label: "Excerpt", type: "textarea", full: true },
      { name: "overview", label: "Overview", type: "richtext", full: true },
      { name: "hero_image", label: "Hero image", type: "image", full: true },
      { name: "process", label: "Process steps", type: "json", full: true },
      { name: "pricing", label: "Pricing tiers", type: "json", full: true },
      { name: "faqs", label: "FAQs", type: "json", full: true },
      { name: "gallery", label: "Gallery", type: "array", full: true },
      { name: "published", label: "Published", type: "boolean" },
      { name: "sort_order", label: "Sort order", type: "number" },
      ...seo,
    ],
  },
  {
    key: "articles",
    table: "articles",
    label: "Journal",
    singular: "Article",
    description: "Long-form writing, published to /articles.",
    orderBy: "created_at",
    titleField: "title",
    subtitleField: "category",
    statusField: "published",
    columns: [
      { name: "title", label: "Title" },
      { name: "category", label: "Category" },
      { name: "author", label: "Author" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "category", label: "Category", type: "text" },
      { name: "author", label: "Author", type: "text" },
      { name: "tags", label: "Tags", type: "array" },
      { name: "published_at", label: "Publish date", type: "date" },
      { name: "excerpt", label: "Excerpt", type: "textarea", full: true },
      { name: "content", label: "Content", type: "richtext", full: true },
      { name: "featured_image", label: "Featured image", type: "image", full: true },
      { name: "published", label: "Published", type: "boolean" },
      ...seo,
    ],
  },
  {
    key: "testimonials",
    table: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    description: "Client quotes used across the site.",
    orderBy: "sort_order",
    ascending: true,
    titleField: "name",
    subtitleField: "company",
    statusField: "published",
    columns: [
      { name: "name", label: "Name" },
      { name: "company", label: "Company" },
      { name: "featured", label: "Featured" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "role", label: "Role", type: "text" },
      { name: "company", label: "Company", type: "text" },
      { name: "avatar", label: "Avatar", type: "image" },
      { name: "quote", label: "Quote", type: "textarea", full: true },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "published", label: "Published", type: "boolean" },
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "faqs",
    table: "faqs",
    label: "FAQs",
    singular: "FAQ",
    description: "Questions shown on /faqs and service pages.",
    orderBy: "sort_order",
    ascending: true,
    titleField: "question",
    subtitleField: "category",
    statusField: "published",
    columns: [
      { name: "question", label: "Question" },
      { name: "category", label: "Category" },
    ],
    fields: [
      { name: "question", label: "Question", type: "text", full: true },
      { name: "answer", label: "Answer", type: "textarea", full: true },
      { name: "category", label: "Category", type: "text" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "published", label: "Published", type: "boolean" },
    ],
  },
  {
    key: "careers",
    table: "careers",
    label: "Careers",
    singular: "Role",
    description: "Open positions published to /careers.",
    orderBy: "sort_order",
    ascending: true,
    titleField: "title",
    subtitleField: "department",
    statusField: "published",
    columns: [
      { name: "title", label: "Title" },
      { name: "department", label: "Department" },
      { name: "location", label: "Location" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "department", label: "Department", type: "text" },
      { name: "location", label: "Location", type: "text" },
      { name: "employment_type", label: "Employment type", type: "text" },
      { name: "description", label: "Description", type: "richtext", full: true },
      { name: "requirements", label: "Requirements", type: "richtext", full: true },
      { name: "published", label: "Published", type: "boolean" },
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "studio_spaces",
    table: "studio_spaces",
    label: "Studio spaces",
    singular: "Space",
    description: "Rental spaces published to /studio.",
    orderBy: "sort_order",
    ascending: true,
    titleField: "name",
    subtitleField: "price",
    statusField: "published",
    columns: [
      { name: "name", label: "Name" },
      { name: "price", label: "Price" },
      { name: "size", label: "Size" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "price", label: "Price", type: "text" },
      { name: "size", label: "Size", type: "text" },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "amenities", label: "Amenities", type: "array", full: true },
      { name: "images", label: "Images", type: "array", full: true },
      { name: "published", label: "Published", type: "boolean" },
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "industries",
    table: "industries",
    label: "Industries",
    singular: "Industry",
    description: "Sectors used to filter case studies.",
    orderBy: "sort_order",
    ascending: true,
    titleField: "name",
    statusField: "published",
    columns: [{ name: "name", label: "Name" }],
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "published", label: "Published", type: "boolean" },
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "nav_links",
    table: "nav_links",
    label: "Navigation",
    singular: "Link",
    description: "Header and footer navigation entries.",
    orderBy: "sort_order",
    ascending: true,
    titleField: "label",
    subtitleField: "href",
    statusField: "published",
    columns: [
      { name: "label", label: "Label" },
      { name: "href", label: "Href" },
      { name: "location", label: "Location" },
    ],
    fields: [
      { name: "label", label: "Label", type: "text" },
      { name: "href", label: "Href", type: "text" },
      { name: "location", label: "Location", type: "text", help: "header or footer" },
      { name: "group_name", label: "Group", type: "text" },
      { name: "published", label: "Published", type: "boolean" },
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "media",
    table: "media",
    label: "Media",
    singular: "Asset",
    description: "Image and file library referenced across the site.",
    orderBy: "created_at",
    titleField: "name",
    subtitleField: "folder",
    columns: [
      { name: "name", label: "Name" },
      { name: "folder", label: "Folder" },
      { name: "mime_type", label: "Type" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "url", label: "URL", type: "image", full: true },
      { name: "folder", label: "Folder", type: "text" },
      { name: "mime_type", label: "MIME type", type: "text" },
      { name: "tags", label: "Tags", type: "array", full: true },
    ],
  },
];

export const collectionByKey = Object.fromEntries(collections.map((c) => [c.key, c]));

export function emptyRecord(def: CollectionDef): Record<string, unknown> {
  const rec: Record<string, unknown> = {};
  for (const f of def.fields) {
    if (f.type === "boolean") rec[f.name] = f.name === "published";
    else if (f.type === "array") rec[f.name] = [];
    else if (f.type === "json") rec[f.name] = [];
    else if (f.type === "number") rec[f.name] = 0;
    else rec[f.name] = "";
  }
  return rec;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
