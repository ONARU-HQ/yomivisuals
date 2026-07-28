import portrait1 from "@/assets/portrait-1.jpg";
import wedding1 from "@/assets/wedding-1.jpg";
import fashion1 from "@/assets/fashion-1.jpg";
import commercial1 from "@/assets/commercial-1.jpg";
import corporate1 from "@/assets/corporate-1.jpg";
import event1 from "@/assets/event-1.jpg";

export type Package = {
  id: string;
  name: string;
  price: number; // NGN
  duration: string;
  includes: string[];
};

export type Service = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  cover: string;
  gallery: string[];
  packages: Package[];
  extras: { label: string; price: string }[];
  timeline: { step: string; detail: string }[];
  faqs: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "portrait",
    name: "Portrait Experience",
    tagline: "One person. One story. One sitting.",
    description:
      "A private, directed portrait sitting in the studio or on location. From pre-session direction to final delivery, every detail is considered.",
    cover: portrait1,
    gallery: [portrait1, portrait1, portrait1],
    packages: [
      {
        id: "essential",
        name: "Essential Sitting",
        price: 150000,
        duration: "2 hours",
        includes: [
          "Studio session",
          "3 professionally edited images",
          "Creative direction",
          "Posing guidance",
          "Online gallery",
          "24-hour preview selection",
        ],
      },
      {
        id: "signature",
        name: "Signature Sitting",
        price: 350000,
        duration: "3 hours",
        includes: [
          "Studio or on-location",
          "10 professionally edited images",
          "Two wardrobe changes",
          "Online gallery",
          "Print box (5 prints)",
        ],
      },
      {
        id: "atelier",
        name: "Atelier Sitting",
        price: 650000,
        duration: "Half day",
        includes: [
          "Studio + on-location",
          "25 professionally edited images",
          "Full wardrobe direction",
          "Museum-grade heirloom box",
          "Behind-the-scenes video",
        ],
      },
    ],
    extras: [
      { label: "Extra edited image", price: "₦15,000 each" },
      { label: "Rush delivery (48h)", price: "₦40,000" },
      { label: "Same-day delivery", price: "₦120,000" },
      { label: "Fine art prints (A2)", price: "from ₦45,000" },
      { label: "Framing", price: "from ₦80,000" },
      { label: "Makeup", price: "from ₦60,000" },
      { label: "Hair", price: "from ₦45,000" },
      { label: "Styling", price: "from ₦120,000" },
      { label: "Behind-the-scenes video", price: "₦180,000" },
    ],
    timeline: [
      { step: "Reserve", detail: "30% deposit holds your date." },
      { step: "Direction call", detail: "We plan wardrobe, mood, and location together." },
      { step: "The sitting", detail: "Considered, unhurried, directed with care." },
      { step: "Preview", detail: "24-hour selection window from a private gallery." },
      { step: "Delivery", detail: "Retouched memories delivered in 10 business days." },
    ],
    faqs: [
      { q: "How far in advance should I book?", a: "Portraits should be reserved 2–4 weeks ahead. We accept a limited number of sittings per month." },
      { q: "Do you travel?", a: "Yes — across Nigeria and internationally by arrangement. Travel is quoted separately." },
      { q: "How does payment work?", a: "A 30% deposit reserves your date. The balance is due the day before the session, via bank transfer." },
      { q: "How quickly will I receive my images?", a: "Standard delivery is 10 business days. Rush (48h) and same-day options are available for an additional fee." },
    ],
  },
  {
    slug: "wedding",
    name: "Wedding Experience",
    tagline: "The day, as it truly felt.",
    description:
      "Documentary and editorial coverage of your ceremony, delivered as a museum-grade memory collection. Full-day coverage with two photographers.",
    cover: wedding1,
    gallery: [wedding1, wedding1, wedding1],
    packages: [
      {
        id: "intimate",
        name: "Intimate",
        price: 1200000,
        duration: "6 hours",
        includes: ["One photographer", "Ceremony coverage", "300+ retouched memories", "Private online gallery"],
      },
      {
        id: "signature",
        name: "Signature",
        price: 2400000,
        duration: "Full day",
        includes: [
          "Two photographers",
          "Full ceremony & reception",
          "600+ retouched memories",
          "Museum-grade print box",
          "Second photographer",
          "Private online gallery",
        ],
      },
      {
        id: "cinema",
        name: "Cinema",
        price: 4800000,
        duration: "Full day + film",
        includes: [
          "Two photographers + film crew",
          "Cinematic wedding film (5–8 min)",
          "1000+ retouched memories",
          "Drone coverage",
          "Heirloom album",
        ],
      },
    ],
    extras: [
      { label: "Drone coverage", price: "₦250,000" },
      { label: "Second photographer", price: "₦400,000" },
      { label: "Wedding film add-on", price: "from ₦1,500,000" },
      { label: "Engagement session", price: "₦450,000" },
      { label: "Heirloom album", price: "from ₦380,000" },
    ],
    timeline: [
      { step: "Consultation", detail: "We meet, understand the day, plan the coverage." },
      { step: "Reserve", detail: "30% deposit holds your date." },
      { step: "Pre-wedding call", detail: "Timeline and shot direction finalized." },
      { step: "The day", detail: "Full documentary coverage, editorial where it counts." },
      { step: "Delivery", detail: "Full memory collection in 4 weeks." },
    ],
    faqs: [
      { q: "How far in advance should we book?", a: "Weddings should be reserved 3–9 months ahead. Peak dates fill first." },
      { q: "Do you travel?", a: "Yes. Travel and accommodation are quoted separately." },
      { q: "When will we receive our images?", a: "4 weeks for the full collection. A preview gallery of 40 frames is delivered within 5 days." },
      { q: "Can we add a wedding film?", a: "Yes. Our Cinema package includes it, or you can add it to any other tier." },
    ],
  },
  {
    slug: "commercial",
    name: "Commercial",
    tagline: "Product as still life. Brand as story.",
    description:
      "Brand campaigns, product photography, corporate portraits and advertising for restaurants, hotels, architecture, construction and industrial.",
    cover: commercial1,
    gallery: [commercial1, commercial1, commercial1],
    packages: [
      {
        id: "day",
        name: "Half Day",
        price: 600000,
        duration: "4 hours",
        includes: ["Concept moodboard", "Studio or on-location", "15 retouched frames", "Web & print delivery"],
      },
      {
        id: "campaign",
        name: "Campaign Day",
        price: 1200000,
        duration: "Full day",
        includes: ["Concept moodboard", "Studio + set design", "40 retouched frames", "Product & lifestyle frames", "Licensing consultation"],
      },
      {
        id: "brand-suite",
        name: "Brand Suite",
        price: 3200000,
        duration: "2–3 days",
        includes: ["Full campaign direction", "Multi-location", "100+ retouched frames", "Behind-the-scenes video", "Licensing package"],
      },
    ],
    extras: [
      { label: "Extended licensing", price: "from ₦400,000" },
      { label: "Behind-the-scenes film", price: "from ₦450,000" },
      { label: "Set design", price: "on request" },
      { label: "Model casting", price: "on request" },
    ],
    timeline: [
      { step: "Brief", detail: "We define the deliverables, audience and mood." },
      { step: "Moodboard", detail: "Direction is agreed before shoot day." },
      { step: "Production", detail: "Studio or location, with our full lighting team." },
      { step: "Delivery", detail: "Retouched frames in 10–15 business days, licensed for your use." },
    ],
    faqs: [
      { q: "Do you cover architecture and industrial?", a: "Yes — including hospitality, real estate, construction and manufacturing." },
      { q: "How is licensing handled?", a: "Standard delivery includes web + print for your brand. Extended licensing (paid ads, OOH, resale) is quoted separately." },
      { q: "Can you produce the whole campaign?", a: "Yes. Creative direction, casting, set design, styling and post are all available." },
    ],
  },
  {
    slug: "events",
    name: "Events",
    tagline: "The room, remembered.",
    description:
      "Corporate events, birthdays, conferences, concerts, awards, social events, church, government and NGO coverage — documented in a cinematic hand.",
    cover: event1,
    gallery: [event1, event1, event1],
    packages: [
      {
        id: "essential",
        name: "Essential",
        price: 350000,
        duration: "3 hours",
        includes: ["One photographer", "150+ edited images", "Online gallery", "72-hour preview"],
      },
      {
        id: "signature",
        name: "Signature",
        price: 750000,
        duration: "6 hours",
        includes: ["Two photographers", "400+ edited images", "Highlight reel (2 min)", "Same-week preview"],
      },
      {
        id: "flagship",
        name: "Flagship",
        price: 1500000,
        duration: "Full day",
        includes: ["Full team", "800+ edited images", "Cinematic highlight film", "Live-share gallery"],
      },
    ],
    extras: [
      { label: "Live photo booth", price: "₦180,000" },
      { label: "Cinematic film add-on", price: "from ₦450,000" },
      { label: "Same-day highlight", price: "₦250,000" },
      { label: "Additional photographer", price: "₦150,000" },
    ],
    timeline: [
      { step: "Consultation", detail: "We understand the run-of-show, VIPs, and coverage priorities." },
      { step: "Coverage", detail: "Discreet, editorial documentation of the room and the moments." },
      { step: "Preview", detail: "Same-week preview gallery." },
      { step: "Delivery", detail: "Full edited collection in 2 weeks." },
    ],
    faqs: [
      { q: "Do you cover church and government events?", a: "Yes — including services, official visits and formal state events." },
      { q: "Can you deliver same-day?", a: "Yes, add same-day highlight; a curated selection is delivered within hours of wrap." },
    ],
  },
  {
    slug: "fashion",
    name: "Fashion",
    tagline: "Editorial with intention.",
    description:
      "Lookbooks, campaigns, model tests, editorials and designer campaigns — approached as short cinematic essays.",
    cover: fashion1,
    gallery: [fashion1, fashion1, fashion1],
    packages: [
      {
        id: "test",
        name: "Model Test",
        price: 400000,
        duration: "4 hours",
        includes: ["Studio session", "10 retouched frames", "Two looks", "Digital delivery"],
      },
      {
        id: "lookbook",
        name: "Lookbook",
        price: 1200000,
        duration: "1 day",
        includes: ["Studio + location", "30 retouched frames", "Creative direction", "Multiple looks"],
      },
      {
        id: "campaign",
        name: "Designer Campaign",
        price: 3800000,
        duration: "1–2 days",
        includes: ["Full creative direction", "Location scout", "50+ retouched frames", "Behind-the-scenes film", "Licensing package"],
      },
    ],
    extras: [
      { label: "Casting", price: "on request" },
      { label: "Stylist", price: "from ₦250,000" },
      { label: "Hair & Makeup", price: "from ₦180,000" },
      { label: "Behind-the-scenes film", price: "from ₦450,000" },
    ],
    timeline: [
      { step: "Concept", detail: "Moodboard and direction agreed with the designer." },
      { step: "Pre-production", detail: "Casting, styling, location — all in place before shoot day." },
      { step: "Production", detail: "Focused, quiet, precise on set." },
      { step: "Delivery", detail: "Retouched frames delivered in 10–14 days." },
    ],
    faqs: [
      { q: "Do you handle the full production?", a: "Yes. Casting, styling, hair, makeup and location can all be produced end-to-end." },
      { q: "Do you shoot for international designers?", a: "Yes, we work with houses in and outside Nigeria." },
    ],
  },
  {
    slug: "corporate",
    name: "Corporate Portraits",
    tagline: "The face of the business.",
    description:
      "Executive portraits, team imagery and headshots — cinematic, considered, and consistent across your entire organization.",
    cover: corporate1,
    gallery: [corporate1, corporate1, corporate1],
    packages: [
      {
        id: "solo",
        name: "Executive Portrait",
        price: 250000,
        duration: "1 hour",
        includes: ["Studio session", "5 retouched frames", "Two wardrobe changes"],
      },
      {
        id: "team",
        name: "Team Day",
        price: 800000,
        duration: "Half day",
        includes: ["Up to 15 people", "5 frames per person", "On-site or studio", "Consistent styling"],
      },
      {
        id: "org",
        name: "Full Organization",
        price: 2200000,
        duration: "1–2 days",
        includes: ["Up to 60 people", "Executive + team imagery", "Office lifestyle frames", "Brand guidelines document"],
      },
    ],
    extras: [
      { label: "Additional person (team)", price: "₦25,000 each" },
      { label: "Rush delivery (48h)", price: "₦80,000" },
      { label: "On-site hair & makeup", price: "from ₦120,000" },
    ],
    timeline: [
      { step: "Reserve", detail: "30% deposit holds your date." },
      { step: "Direction", detail: "Wardrobe, backdrop and tone agreed with your team." },
      { step: "The day", detail: "Efficient, considered, no one waits long." },
      { step: "Delivery", detail: "Retouched frames in 7 business days." },
    ],
    faqs: [
      { q: "Can you come to our office?", a: "Yes — we bring a full mobile studio to your premises." },
      { q: "How consistent are the results?", a: "We maintain identical lighting and framing across every subject for a coherent team gallery." },
    ],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function formatNaira(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}
