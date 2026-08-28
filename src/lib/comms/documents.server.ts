import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import { brand, brandAssets, clampWatermarkOpacity } from "./brand";

/**
 * Premium A4 document system: invoice, quote, proposal, contract.
 * Print-safe, generous whitespace, subtle official YV watermark.
 */

export type DocumentKind = "invoice" | "quote" | "proposal" | "contract";

export type DocumentSpec = {
  kind: DocumentKind;
  number?: string;
  date?: string;
  dueDate?: string;
  client?: { name?: string; company?: string; email?: string };
  project?: { title?: string; id?: string; timeline?: string };
  items?: { label: string; description?: string; amount: string }[];
  totals?: { label: string; value: string }[];
  sections?: { title: string; body: string }[];
  paymentInstructions?: string[];
  terms?: string;
  watermarkOpacity?: number;
};

const A4 = { w: 595.28, h: 841.89 };
const M = 56;
const ink = rgb(0.04, 0.04, 0.04);
const grey = rgb(0.47, 0.47, 0.47);
const line = rgb(0.89, 0.885, 0.87);
const gold = rgb(0.776, 0.631, 0.357);

const titles: Record<DocumentKind, string> = {
  invoice: "INVOICE",
  quote: "PROJECT QUOTE",
  proposal: "PROJECT PROPOSAL",
  contract: "AGREEMENT",
};

async function loadMark(pdf: PDFDocument): Promise<PDFImage | null> {
  try {
    const res = await fetch(brandAssets.mark);
    if (!res.ok) return null;
    return await pdf.embedPng(await res.arrayBuffer());
  } catch {
    return null;
  }
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number) {
  const out: string[] = [];
  for (const para of String(text ?? "").split("\n")) {
    let cur = "";
    for (const word of para.split(/\s+/)) {
      const next = cur ? `${cur} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) > maxWidth && cur) {
        out.push(cur);
        cur = word;
      } else cur = next;
    }
    out.push(cur);
  }
  return out;
}

/** Strips characters the standard PDF fonts cannot encode (e.g. ₦, curly quotes). */
function safe(text: unknown) {
  return String(text ?? "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u20A6/g, "NGN ")
    .replace(/[^\x20-\x7E\n]/g, "");
}

export async function generateDocument(spec: DocumentSpec): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const mark = await loadMark(pdf);
  const opacity = clampWatermarkOpacity(spec.watermarkOpacity);
  const contentW = A4.w - M * 2;

  pdf.setTitle(`${brand.name} — ${titles[spec.kind]} ${spec.number ?? ""}`.trim());
  pdf.setAuthor(brand.name);

  const pages: PDFPage[] = [];

  const addPage = () => {
    const page = pdf.addPage([A4.w, A4.h]);
    pages.push(page);
    if (mark) {
      // Watermark placement per document type — always subtle, never over critical text.
      if (spec.kind === "proposal" && pages.length === 1) {
        const size = 320;
        page.drawImage(mark, { x: (A4.w - size) / 2, y: (A4.h - size) / 2, width: size, height: size, opacity });
      } else if (spec.kind === "contract") {
        const size = 150;
        page.drawImage(mark, { x: A4.w - M - size, y: M + 20, width: size, height: size, opacity: opacity * 0.6 });
      } else {
        const size = 210;
        page.drawImage(mark, { x: A4.w - M - size, y: M + 10, width: size, height: size, opacity });
      }
    }
    return page;
  };

  let page = addPage();
  let y = A4.h - M;

  const ensure = (needed: number) => {
    if (y - needed < M + 60) {
      page = addPage();
      y = A4.h - M;
    }
  };

  const text = (
    value: string,
    opts: { size?: number; font?: PDFFont; color?: any; x?: number; gap?: number; align?: "left" | "right" } = {},
  ) => {
    const size = opts.size ?? 10.5;
    const font = opts.font ?? regular;
    const str = safe(value);
    const x =
      opts.align === "right" ? A4.w - M - font.widthOfTextAtSize(str, size) : (opts.x ?? M);
    page.drawText(str, { x, y, size, font, color: opts.color ?? ink });
    y -= opts.gap ?? size * 1.5;
  };

  const rule = (gap = 18) => {
    page.drawLine({ start: { x: M, y }, end: { x: A4.w - M, y }, thickness: 0.7, color: line });
    y -= gap;
  };

  // ── Header ────────────────────────────────────────────────
  if (mark) {
    page.drawImage(mark, { x: M, y: y - 34, width: 34, height: 34 });
  }
  page.drawText(brand.name.toUpperCase(), {
    x: M + (mark ? 46 : 0),
    y: y - 20,
    size: 11,
    font: bold,
    color: ink,
  });
  page.drawText(brand.descriptor, {
    x: M + (mark ? 46 : 0),
    y: y - 33,
    size: 9,
    font: regular,
    color: grey,
  });
  const title = titles[spec.kind];
  page.drawText(title, {
    x: A4.w - M - bold.widthOfTextAtSize(title, 22),
    y: y - 24,
    size: 22,
    font: bold,
    color: ink,
  });
  y -= 62;
  rule(24);

  // ── Meta block ────────────────────────────────────────────
  const metaPairs: [string, string][] = [
    [spec.kind === "contract" ? "AGREEMENT NO." : "DOCUMENT NO.", spec.number ?? "—"],
    ["DATE", spec.date ?? "—"],
  ];
  if (spec.dueDate) metaPairs.push(["DUE", spec.dueDate]);
  if (spec.project?.id) metaPairs.push(["PROJECT ID", spec.project.id]);

  const colW = contentW / metaPairs.length;
  metaPairs.forEach(([label, value], i) => {
    page.drawText(safe(label), { x: M + i * colW, y, size: 7.5, font: bold, color: grey });
    page.drawText(safe(value), { x: M + i * colW, y: y - 15, size: 11, font: regular, color: ink });
  });
  y -= 46;

  // ── Client + project ──────────────────────────────────────
  page.drawText("CLIENT", { x: M, y, size: 7.5, font: bold, color: grey });
  page.drawText("PROJECT", { x: M + contentW / 2, y, size: 7.5, font: bold, color: grey });
  y -= 16;
  const clientLines = [spec.client?.name, spec.client?.company, spec.client?.email].filter(Boolean) as string[];
  const projectLines = [spec.project?.title, spec.project?.timeline].filter(Boolean) as string[];
  const rows = Math.max(clientLines.length, projectLines.length, 1);
  for (let i = 0; i < rows; i++) {
    if (clientLines[i]) page.drawText(safe(clientLines[i]), { x: M, y, size: 10.5, font: i === 0 ? bold : regular, color: i === 0 ? ink : grey });
    if (projectLines[i]) page.drawText(safe(projectLines[i]), { x: M + contentW / 2, y, size: 10.5, font: i === 0 ? bold : regular, color: i === 0 ? ink : grey });
    y -= 15;
  }
  y -= 18;

  // ── Body ──────────────────────────────────────────────────
  if (spec.sections?.length) {
    spec.sections.forEach((section, idx) => {
      ensure(80);
      rule(20);
      text(`${String(idx + 1).padStart(2, "0")}`, { size: 8, font: bold, color: gold, gap: 14 });
      text(section.title.toUpperCase(), { size: 13, font: bold, gap: 18 });
      for (const l of wrap(safe(section.body), regular, 10.5, contentW)) {
        ensure(20);
        text(l, { size: 10.5, color: rgb(0.22, 0.22, 0.22), gap: 16 });
      }
      y -= 8;
    });
  }

  if (spec.items?.length) {
    ensure(90);
    rule(16);
    page.drawText("DESCRIPTION", { x: M, y, size: 7.5, font: bold, color: grey });
    const amt = "AMOUNT";
    page.drawText(amt, { x: A4.w - M - bold.widthOfTextAtSize(amt, 7.5), y, size: 7.5, font: bold, color: grey });
    y -= 16;
    rule(14);
    for (const item of spec.items) {
      ensure(50);
      page.drawText(safe(item.label), { x: M, y, size: 11, font: regular, color: ink });
      const a = safe(item.amount);
      page.drawText(a, { x: A4.w - M - regular.widthOfTextAtSize(a, 11), y, size: 11, font: regular, color: ink });
      y -= 16;
      if (item.description) {
        for (const l of wrap(safe(item.description), regular, 9.5, contentW * 0.7)) {
          page.drawText(l, { x: M, y, size: 9.5, font: regular, color: grey });
          y -= 13;
        }
      }
      y -= 8;
      rule(14);
    }
  }

  if (spec.totals?.length) {
    ensure(30 + spec.totals.length * 18);
    spec.totals.forEach((t, i) => {
      const last = i === spec.totals!.length - 1;
      const size = last ? 13 : 10.5;
      const font = last ? bold : regular;
      const color = last ? ink : grey;
      const lbl = safe(t.label);
      const val = safe(t.value);
      page.drawText(lbl, { x: A4.w - M - 230, y, size, font, color });
      page.drawText(val, { x: A4.w - M - font.widthOfTextAtSize(val, size), y, size, font, color });
      y -= last ? 24 : 18;
    });
    y -= 6;
  }

  if (spec.paymentInstructions?.length) {
    ensure(90);
    rule(18);
    text("PAYMENT INSTRUCTIONS", { size: 7.5, font: bold, color: grey, gap: 16 });
    for (const l of spec.paymentInstructions) {
      ensure(20);
      text(l, { size: 10.5, gap: 15 });
    }
    y -= 10;
  }

  if (spec.terms) {
    ensure(70);
    rule(18);
    text("TERMS", { size: 7.5, font: bold, color: grey, gap: 14 });
    for (const l of wrap(safe(spec.terms), regular, 9.5, contentW)) {
      ensure(18);
      text(l, { size: 9.5, color: grey, gap: 13 });
    }
  }

  if (spec.kind === "contract") {
    ensure(120);
    y -= 24;
    rule(26);
    const half = contentW / 2 - 16;
    [
      ["FOR YOMI VISUALS", brand.founder.name],
      ["FOR CLIENT", spec.client?.name ?? ""],
    ].forEach(([label, name], i) => {
      const x = M + i * (half + 32);
      page.drawLine({ start: { x, y: y - 34 }, end: { x: x + half, y: y - 34 }, thickness: 0.7, color: line });
      page.drawText(safe(label), { x, y: y - 48, size: 7.5, font: bold, color: grey });
      page.drawText(safe(name), { x, y: y - 62, size: 10.5, font: regular, color: ink });
      page.drawText("Date", { x: x + half - 30, y: y - 48, size: 7.5, font: bold, color: grey });
    });
    y -= 80;
  }

  // ── Footers ───────────────────────────────────────────────
  pages.forEach((p, i) => {
    const footer = `${brand.name.toUpperCase()}  ·  ${brand.descriptor}  ·  ${brand.websiteLabel}`;
    p.drawLine({ start: { x: M, y: M - 6 }, end: { x: A4.w - M, y: M - 6 }, thickness: 0.7, color: line });
    p.drawText(safe(footer), { x: M, y: M - 22, size: 7.5, font: regular, color: grey });
    const right = `${spec.number ? `${safe(spec.number)}  ·  ` : ""}Page ${i + 1} of ${pages.length}`;
    p.drawText(right, {
      x: A4.w - M - regular.widthOfTextAtSize(right, 7.5),
      y: M - 22,
      size: 7.5,
      font: regular,
      color: grey,
    });
  });

  return await pdf.save();
}

export const sampleDocument = (kind: DocumentKind): DocumentSpec => {
  const base: DocumentSpec = {
    kind,
    number: kind === "invoice" ? "YV-INV-0421" : kind === "quote" ? "YV-Q-0184" : kind === "proposal" ? "YV-P-0092" : "YV-AGR-0057",
    date: "12 March 2026",
    client: { name: "Tolu Adebayo", company: "Valora Hairs", email: "tolu@valorahairs.com" },
    project: { title: "Valora Hairs — Spring Campaign", id: "YV-2026-1042", timeline: "4 weeks" },
  };
  if (kind === "invoice")
    return {
      ...base,
      dueDate: "26 March 2026",
      items: [
        { label: "Campaign production — 50% deposit", description: "Concept, pre-production, one production day.", amount: "NGN 2,200,000" },
      ],
      totals: [
        { label: "Subtotal", value: "NGN 2,200,000" },
        { label: "VAT (7.5%)", value: "NGN 165,000" },
        { label: "Total due", value: "NGN 2,365,000" },
      ],
      paymentInstructions: [
        "Pay securely through your Yomi Visuals client portal.",
        "Transfers are confirmed within one business day of receipt.",
      ],
      terms: "Payment is due by the date above. Production dates are confirmed once the deposit is received.",
    };
  if (kind === "quote")
    return {
      ...base,
      items: [
        { label: "Creative direction & pre-production", amount: "NGN 900,000" },
        { label: "Production day (1)", description: "Crew, equipment, studio, direction.", amount: "NGN 2,400,000" },
        { label: "Post-production & delivery", amount: "NGN 1,100,000" },
      ],
      totals: [
        { label: "Subtotal", value: "NGN 4,400,000" },
        { label: "VAT (7.5%)", value: "NGN 330,000" },
        { label: "Total", value: "NGN 4,730,000" },
      ],
      terms: "Quote valid for 30 days. Scope changes are re-quoted before work begins.",
    };
  if (kind === "proposal")
    return {
      ...base,
      sections: [
        { title: "The brief", body: "Valora Hairs is launching a spring collection and needs a campaign that reads premium across film, stills and social." },
        { title: "The idea", body: "A single cinematic thread: transformation captured in motion. One narrative, cut for every placement." },
        { title: "Creative approach", body: "Editorial lighting, warm tonality, restrained motion. Product remains the hero without feeling like a catalogue." },
        { title: "Production", body: "One studio day at YV Studios, Lagos. Full crew, styling, and direction managed end to end by Yomi Visuals." },
        { title: "Deliverables", body: "1x 60s hero film, 3x cutdowns (30s/15s/6s), 40x retouched stills, motion assets for paid social." },
        { title: "Timeline", body: "Four weeks from approval: one week pre-production, one production day, two weeks post and delivery." },
        { title: "Investment", body: "NGN 4,730,000 inclusive of VAT. Staged 50% on approval, 50% on delivery." },
        { title: "Terms", body: "Usage is granted for 12 months across owned and paid digital channels. Extensions are quoted separately." },
        { title: "Next steps", body: "Approve the proposal in your client portal and we will issue the agreement and lock production dates." },
      ],
    };
  return {
    ...base,
    sections: [
      { title: "Parties", body: "This agreement is between Yomi Visuals (Creative Production Company, Lagos, Nigeria) and the client named above." },
      { title: "Scope of services", body: "Yomi Visuals will deliver the services described in the accompanying proposal and quote, as referenced by the project ID above." },
      { title: "Fees and payment", body: "Fees are as stated in the accompanying quote. Invoices are payable by their stated due date. Production dates are confirmed upon receipt of the deposit." },
      { title: "Ownership and usage", body: "Final approved deliverables are licensed to the client for the agreed usage term. Yomi Visuals retains the right to display the work in its portfolio unless otherwise agreed in writing." },
      { title: "Revisions", body: "Two rounds of revisions are included per deliverable. Additional rounds are quoted separately." },
      { title: "Cancellation", body: "Cancellation within 72 hours of a confirmed production date is subject to the deposit being retained to cover committed crew and facilities." },
      { title: "Governing law", body: "This agreement is governed by the laws of the Federal Republic of Nigeria." },
    ],
  };
};
