import portrait1 from "@/assets/portrait-1.jpg";
import wedding1 from "@/assets/wedding-1.jpg";
import fashion1 from "@/assets/fashion-1.jpg";
import brand1 from "@/assets/brand-1.jpg";
import family1 from "@/assets/family-1.jpg";
import maternity1 from "@/assets/maternity-1.jpg";
import aboutPortrait from "@/assets/about-portrait.jpg";
import heroWedding from "@/assets/hero-wedding.jpg";
import commercial1 from "@/assets/commercial-1.jpg";
import corporate1 from "@/assets/corporate-1.jpg";
import event1 from "@/assets/event-1.jpg";
import architecture1 from "@/assets/architecture-1.jpg";
import lifestyle1 from "@/assets/lifestyle-1.jpg";
import editorial1 from "@/assets/editorial-1.jpg";

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  cover: string;
  service: string; // matching /services/$slug
  images: { src: string; alt: string; ratio: "portrait" | "landscape" | "square" | "tall" }[];
};

const R = (src: string, alt: string, ratio: Category["images"][number]["ratio"]) => ({ src, alt, ratio });

export const categories: Category[] = [
  {
    slug: "portraits",
    name: "Portraits",
    tagline: "One person. One story.",
    description: "Considered studio and location portraits, directed with the care of a painter and the eye of a filmmaker.",
    cover: portrait1,
    service: "portrait",
    images: [
      R(portrait1, "Studio portrait sitting", "portrait"),
      R(aboutPortrait, "Editorial portrait in low light", "tall"),
      R(editorial1, "Sculptural portrait", "portrait"),
      R(corporate1, "Executive portrait", "portrait"),
      R(maternity1, "Silhouette portrait", "landscape"),
      R(family1, "Intimate portrait", "square"),
      R(portrait1, "Portrait, second frame", "landscape"),
      R(editorial1, "Portrait, black gown", "tall"),
    ],
  },
  {
    slug: "weddings",
    name: "Weddings",
    tagline: "The day, as it truly felt.",
    description: "Documentary and editorial coverage of ceremonies, delivered as heirloom memory collections.",
    cover: heroWedding,
    service: "wedding",
    images: [
      R(heroWedding, "Bride in cathedral light", "tall"),
      R(wedding1, "Couple at golden hour", "landscape"),
      R(wedding1, "Rooftop vows", "portrait"),
      R(heroWedding, "Bride second frame", "square"),
      R(wedding1, "First dance", "landscape"),
      R(heroWedding, "Bride portrait", "portrait"),
    ],
  },
  {
    slug: "fashion",
    name: "Fashion",
    tagline: "Editorial with intention.",
    description: "Lookbooks, campaigns, model tests and editorials for designers who treat their collections as art.",
    cover: fashion1,
    service: "fashion",
    images: [
      R(fashion1, "House of Alára SS25", "tall"),
      R(editorial1, "Editorial fashion frame", "portrait"),
      R(fashion1, "Fashion campaign", "landscape"),
      R(editorial1, "Editorial second", "tall"),
      R(fashion1, "Lookbook frame", "square"),
      R(editorial1, "Editorial cover", "portrait"),
    ],
  },
  {
    slug: "commercial",
    name: "Commercial",
    tagline: "Brand imagery with weight.",
    description: "Product, campaign and advertising imagery for houses that refuse to look like anyone else.",
    cover: commercial1,
    service: "commercial",
    images: [
      R(commercial1, "Luxury product still life", "square"),
      R(brand1, "Brand campaign frame", "landscape"),
      R(commercial1, "Product on marble", "portrait"),
      R(brand1, "Brand campaign second", "tall"),
      R(commercial1, "Product moody light", "landscape"),
      R(brand1, "Brand still life", "square"),
    ],
  },
  {
    slug: "corporate",
    name: "Corporate",
    tagline: "The face of the business.",
    description: "Executive portraits, team imagery and headshots that carry the tone of the brand behind them.",
    cover: corporate1,
    service: "corporate",
    images: [
      R(corporate1, "Executive portrait", "portrait"),
      R(aboutPortrait, "Corporate portrait", "tall"),
      R(corporate1, "Team lead portrait", "landscape"),
      R(aboutPortrait, "Founder portrait", "portrait"),
    ],
  },
  {
    slug: "events",
    name: "Events",
    tagline: "The room, remembered.",
    description: "Corporate galas, conferences, concerts, awards and social events — documented in a cinematic hand.",
    cover: event1,
    service: "events",
    images: [
      R(event1, "Gala interior", "landscape"),
      R(event1, "Chandeliers", "tall"),
      R(event1, "Table detail", "square"),
      R(event1, "Room wide", "landscape"),
    ],
  },
  {
    slug: "products",
    name: "Products",
    tagline: "Objects, as still lifes.",
    description: "Studio product photography for e-commerce, launches and campaigns — set-designed and lit with intent.",
    cover: brand1,
    service: "commercial",
    images: [
      R(brand1, "Product still life", "square"),
      R(commercial1, "Perfume on marble", "portrait"),
      R(brand1, "Product detail", "landscape"),
      R(commercial1, "Product hero", "tall"),
    ],
  },
  {
    slug: "architecture",
    name: "Architecture",
    tagline: "Structure as portrait.",
    description: "Residential, commercial and hospitality architecture — photographed for the way it holds light.",
    cover: architecture1,
    service: "commercial",
    images: [
      R(architecture1, "Villa at dusk", "landscape"),
      R(architecture1, "Facade detail", "portrait"),
      R(architecture1, "Interior wide", "landscape"),
      R(architecture1, "Geometric shadow", "tall"),
    ],
  },
  {
    slug: "lifestyle",
    name: "Lifestyle",
    tagline: "How the brand lives.",
    description: "Lifestyle imagery for hospitality, hotels and lifestyle brands — cinematic, quiet, in situ.",
    cover: lifestyle1,
    service: "commercial",
    images: [
      R(lifestyle1, "Rooftop couple", "landscape"),
      R(lifestyle1, "Sunset portrait", "portrait"),
      R(lifestyle1, "City wide", "landscape"),
      R(family1, "Intimate lifestyle", "square"),
    ],
  },
  {
    slug: "editorial",
    name: "Editorial",
    tagline: "Stories told in frames.",
    description: "Magazine editorial commissions — narrative-driven series shot as short cinematic essays.",
    cover: editorial1,
    service: "fashion",
    images: [
      R(editorial1, "Editorial cover", "tall"),
      R(fashion1, "Editorial spread", "landscape"),
      R(editorial1, "Editorial second", "portrait"),
      R(fashion1, "Editorial third", "square"),
    ],
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
