import { SITE_ORIGIN } from "./brand";
import {
  cta,
  divider,
  eyebrow,
  headline,
  heroImage,
  lineItems,
  meta,
  paragraph,
  renderEmail,
  secondaryLink,
  statusBadge,
  summaryCard,
} from "./email";

/**
 * Every YV communication is a template bound to a lifecycle event.
 * Editable content lives in `overrides`; the branded structure stays locked.
 */

export type CommsEvent =
  | "BRIEF_RECEIVED"
  | "PROJECT_CREATED"
  | "PROJECT_QUALIFIED"
  | "PROJECT_ASSIGNED"
  | "PROJECT_STATUS_CHANGED"
  | "PROPOSAL_SENT"
  | "PROPOSAL_REMINDER"
  | "PROPOSAL_APPROVED"
  | "QUOTE_CREATED"
  | "QUOTE_ACCEPTED"
  | "INVOICE_CREATED"
  | "INVOICE_REMINDER"
  | "PAYMENT_RECEIVED"
  | "CONTRACT_SENT"
  | "CONTRACT_SIGNED"
  | "PRODUCTION_STARTED"
  | "PRODUCTION_REMINDER"
  | "REVIEW_REQUESTED"
  | "REVISION_REQUESTED"
  | "PROJECT_DELIVERED"
  | "PROJECT_COMPLETED"
  | "PROJECT_FOLLOW_UP";

export type TemplateData = Record<string, any>;

export type CommsTemplate = {
  key: CommsEvent;
  group: string;
  name: string;
  subject: (d: TemplateData) => string;
  ctaLabel: string;
  render: (d: TemplateData, overrides?: TemplateOverrides) => string;
  sample: TemplateData;
};

export type TemplateOverrides = {
  subject?: string;
  headline?: string;
  body?: string;
  ctaLabel?: string;
  watermarkOpacity?: number;
};

const link = (path: string) => `${SITE_ORIGIN}${path}`;
const projectLink = (d: TemplateData) => d.projectUrl ?? link("/portal");

function shell(
  d: TemplateData,
  o: TemplateOverrides | undefined,
  opts: {
    preheader: string;
    eyebrow: string;
    headline: string;
    body: string;
    blocks?: string;
    ctaLabel: string;
    ctaHref: string;
    secondary?: [string, string];
    hero?: boolean;
    footerNote?: string;
  },
) {
  return renderEmail({
    preheader: opts.preheader,
    watermarkOpacity: o?.watermarkOpacity,
    footerNote: opts.footerNote,
    body: [
      opts.hero && d.heroImage ? heroImage(d.heroImage, d.project ?? "Yomi Visuals project") : "",
      eyebrow(opts.eyebrow),
      headline(o?.headline ?? opts.headline),
      paragraph(o?.body ?? opts.body),
      opts.blocks ?? "",
      cta(o?.ctaLabel ?? opts.ctaLabel, opts.ctaHref),
      opts.secondary ? secondaryLink(opts.secondary[0], opts.secondary[1]) : "",
    ]
      .filter(Boolean)
      .join(""),
  });
}

const projectRows = (d: TemplateData) =>
  summaryCard([
    { label: "Project", value: d.project },
    { label: "Client", value: d.client },
    { label: "Project type", value: d.projectType },
    { label: "Status", value: d.status ? statusBadge(d.status) : "" },
    { label: "Timeline", value: d.timeline },
    { label: "Project ID", value: d.projectId },
  ]);

const baseSample: TemplateData = {
  project: "Valora Hairs — Spring Campaign",
  client: "Valora Hairs",
  projectType: "Campaign production",
  timeline: "4 weeks",
  projectId: "YV-2026-1042",
  status: "REVIEWING",
};

export const templates: CommsTemplate[] = [
  {
    key: "BRIEF_RECEIVED",
    group: "Client acquisition",
    name: "Project brief received",
    ctaLabel: "VIEW PROJECT",
    subject: () => "We received your YV project brief.",
    sample: baseSample,
    render: (d, o) =>
      shell(d, o, {
        preheader: "Your idea is with us — we’re reviewing the brief.",
        eyebrow: "Project received",
        headline: "YOUR IDEA IS WITH US.",
        body: "We’ve received your project brief and our team will review the details before coming back with the next steps.",
        blocks: projectRows(d),
        ctaLabel: "VIEW PROJECT",
        ctaHref: projectLink(d),
      }),
  },
  {
    key: "PROJECT_CREATED",
    group: "Project",
    name: "Project created",
    ctaLabel: "VIEW PROJECT",
    subject: (d) => `Your project is open — ${d.projectId ?? "Yomi Visuals"}`,
    sample: { ...baseSample, status: "NEW" },
    render: (d, o) =>
      shell(d, o, {
        preheader: "Your project has been created inside the YV studio.",
        eyebrow: "Project created",
        headline: "IT’S ON THE BOARD.",
        body: "Your project now has a home inside our studio system. You’ll be able to follow every stage from here.",
        blocks: projectRows(d),
        ctaLabel: "VIEW PROJECT",
        ctaHref: projectLink(d),
      }),
  },
  {
    key: "PROJECT_ASSIGNED",
    group: "Project",
    name: "Project assigned",
    ctaLabel: "VIEW PROJECT",
    subject: (d) => `Your YV producer is assigned — ${d.projectId ?? ""}`.trim(),
    sample: { ...baseSample, producer: "Yomi Onalaru", status: "REVIEWING" },
    render: (d, o) =>
      shell(d, o, {
        preheader: "A producer is now leading your project.",
        eyebrow: "Team assigned",
        headline: "YOU HAVE A PRODUCER.",
        body: "A dedicated producer is now leading your project end to end — from creative direction through delivery.",
        blocks:
          summaryCard([
            { label: "Project", value: d.project },
            { label: "Producer", value: d.producer },
            { label: "Project ID", value: d.projectId },
          ]) + "",
        ctaLabel: "VIEW PROJECT",
        ctaHref: projectLink(d),
      }),
  },
  {
    key: "PROJECT_STATUS_CHANGED",
    group: "Project",
    name: "Project status changed",
    ctaLabel: "VIEW PROJECT",
    subject: (d) => `Project update — ${d.project ?? "Yomi Visuals"}`,
    sample: { ...baseSample, status: "IN PRODUCTION", previousStatus: "QUALIFIED" },
    render: (d, o) =>
      shell(d, o, {
        preheader: "There’s movement on your project.",
        eyebrow: "Status update",
        headline: "SOMETHING MOVED.",
        body: "Your project has moved to a new stage. Here’s exactly where it stands right now.",
        blocks: projectRows(d),
        ctaLabel: "VIEW PROJECT",
        ctaHref: projectLink(d),
      }),
  },
  {
    key: "PROJECT_QUALIFIED",
    group: "Project",
    name: "Project qualified",
    ctaLabel: "VIEW PROJECT",
    subject: () => "Your YV project is ready for the next step.",
    sample: {
      ...baseSample,
      status: "QUALIFIED",
      scope: "Concept, production, post",
      capabilities: "Campaign film, stills, motion cutdowns",
    },
    render: (d, o) =>
      shell(d, o, {
        preheader: "We’ve scoped your project — here’s what we recommend.",
        eyebrow: "Qualified",
        headline: "LET’S BUILD IT.",
        body: "We’ve reviewed your brief and shaped a recommended scope. Nothing is locked — this is the starting point for our conversation.",
        blocks: summaryCard([
          { label: "Project", value: d.project },
          { label: "Scope", value: d.scope },
          { label: "Recommended", value: d.capabilities },
          { label: "Timeline", value: d.timeline },
          { label: "Project ID", value: d.projectId },
        ]),
        ctaLabel: "VIEW PROJECT",
        ctaHref: projectLink(d),
      }),
  },
  {
    key: "PROPOSAL_SENT",
    group: "Proposal",
    name: "Proposal ready",
    ctaLabel: "REVIEW PROPOSAL",
    subject: () => "Your YV proposal is ready.",
    sample: {
      ...baseSample,
      status: "PROPOSAL",
      scope: "Concept, production, post",
      investment: "₦4,800,000",
      documentUrl: "#",
    },
    render: (d, o) =>
      shell(d, o, {
        preheader: "Your proposal is ready to review.",
        eyebrow: "Proposal",
        headline: "LET’S MAKE IT REAL.",
        body: "We’ve prepared a proposal based on your project brief. It covers the idea, the production plan and the investment.",
        blocks: summaryCard([
          { label: "Project", value: d.project },
          { label: "Scope", value: d.scope },
          { label: "Estimated timeline", value: d.timeline },
          { label: "Investment", value: d.investment },
        ]),
        ctaLabel: "REVIEW PROPOSAL",
        ctaHref: d.proposalUrl ?? projectLink(d),
        secondary: ["Download PDF", d.documentUrl ?? "#"],
        hero: true,
      }),
  },
  {
    key: "PROPOSAL_REMINDER",
    group: "Proposal",
    name: "Proposal reminder",
    ctaLabel: "VIEW PROPOSAL",
    subject: (d) => `Your proposal for ${d.project ?? "your project"} is still open.`,
    sample: { ...baseSample, status: "PROPOSAL", investment: "₦4,800,000" },
    render: (d, o) =>
      shell(d, o, {
        preheader: "No rush — your proposal is still available.",
        eyebrow: "Reminder",
        headline: "STILL THINKING IT OVER?",
        body: `Your YV proposal for ${d.project ?? "your project"} is still available whenever you’re ready. Happy to walk through it together.`,
        blocks: summaryCard([
          { label: "Project", value: d.project },
          { label: "Investment", value: d.investment },
          { label: "Project ID", value: d.projectId },
        ]),
        ctaLabel: "VIEW PROPOSAL",
        ctaHref: d.proposalUrl ?? projectLink(d),
      }),
  },
  {
    key: "PROPOSAL_APPROVED",
    group: "Proposal",
    name: "Proposal approved",
    ctaLabel: "VIEW PROJECT",
    subject: () => "Proposal approved — Yomi Visuals",
    sample: { ...baseSample, status: "APPROVED", approvedBy: "Tolu A.", date: "12 March 2026" },
    render: (d, o) =>
      shell(d, o, {
        preheader: "Proposal approved. We’re moving.",
        eyebrow: "Approved",
        headline: "GREEN LIGHT.",
        body: "Your proposal has been approved. We’ll follow up with the agreement and production schedule.",
        blocks: summaryCard([
          { label: "Project", value: d.project },
          { label: "Approved by", value: d.approvedBy },
          { label: "Date", value: d.date },
        ]),
        ctaLabel: "VIEW PROJECT",
        ctaHref: projectLink(d),
      }),
  },
  {
    key: "QUOTE_CREATED",
    group: "Quote",
    name: "Quote ready",
    ctaLabel: "VIEW QUOTE",
    subject: () => "Your YV project quote is ready.",
    sample: {
      ...baseSample,
      quoteNumber: "YV-Q-0184",
      items: [
        { label: "Creative direction & pre-production", amount: "₦900,000" },
        { label: "Production day (1)", amount: "₦2,400,000" },
        { label: "Post-production & delivery", amount: "₦1,100,000" },
      ],
      totals: [
        { label: "Subtotal", value: "₦4,400,000" },
        { label: "VAT (7.5%)", value: "₦330,000" },
        { label: "Total", value: "₦4,730,000" },
      ],
    },
    render: (d, o) =>
      shell(d, o, {
        preheader: "Your scope and investment are ready.",
        eyebrow: "Quote",
        headline: "YOUR PROJECT SCOPE IS READY.",
        body: "Here’s the scope, deliverables and investment for your project.",
        blocks:
          lineItems(d.items ?? [], d.totals ?? []) +
          summaryCard([
            { label: "Quote number", value: d.quoteNumber },
            { label: "Timeline", value: d.timeline },
            { label: "Project ID", value: d.projectId },
          ], "Details"),
        ctaLabel: "VIEW QUOTE",
        ctaHref: d.quoteUrl ?? projectLink(d),
        secondary: ["Download PDF", d.documentUrl ?? "#"],
      }),
  },
  {
    key: "QUOTE_ACCEPTED",
    group: "Quote",
    name: "Quote accepted",
    ctaLabel: "VIEW PROJECT",
    subject: () => "Quote accepted — Yomi Visuals",
    sample: { ...baseSample, quoteNumber: "YV-Q-0184", status: "APPROVED" },
    render: (d, o) =>
      shell(d, o, {
        preheader: "Quote accepted — thank you.",
        eyebrow: "Accepted",
        headline: "LOCKED IN.",
        body: "Thank you — your quote has been accepted and recorded. Next we’ll issue the agreement and schedule production.",
        blocks: summaryCard([
          { label: "Project", value: d.project },
          { label: "Quote number", value: d.quoteNumber },
          { label: "Project ID", value: d.projectId },
        ]),
        ctaLabel: "VIEW PROJECT",
        ctaHref: projectLink(d),
      }),
  },
  {
    key: "INVOICE_CREATED",
    group: "Invoice",
    name: "Invoice issued",
    ctaLabel: "VIEW & PAY INVOICE",
    subject: (d) => `Invoice ${d.invoiceNumber ?? ""} from Yomi Visuals`.replace("  ", " "),
    sample: {
      ...baseSample,
      status: "UNPAID",
      invoiceNumber: "YV-INV-0421",
      issueDate: "12 March 2026",
      dueDate: "26 March 2026",
      items: [
        { label: "Campaign production — 50% deposit", amount: "₦2,200,000" },
      ],
      totals: [
        { label: "Subtotal", value: "₦2,200,000" },
        { label: "VAT (7.5%)", value: "₦165,000" },
        { label: "Total due", value: "₦2,365,000" },
      ],
    },
    render: (d, o) =>
      shell(d, o, {
        preheader: `Invoice ${d.invoiceNumber ?? ""} — due ${d.dueDate ?? "on receipt"}`,
        eyebrow: "Invoice",
        headline: `INVOICE ${d.invoiceNumber ?? ""}`.trim(),
        body: "Here is your invoice. You can view, download and pay it securely from your client portal.",
        blocks:
          summaryCard(
            [
              { label: "Invoice number", value: d.invoiceNumber },
              { label: "Issue date", value: d.issueDate },
              { label: "Due date", value: d.dueDate },
              { label: "Client", value: d.client },
              { label: "Project", value: d.project },
              { label: "Payment status", value: d.status ? statusBadge(d.status) : "" },
            ],
            "Invoice details",
          ) +
          lineItems(d.items ?? [], d.totals ?? []) +
          divider(),
        ctaLabel: "VIEW & PAY INVOICE",
        ctaHref: d.invoiceUrl ?? link("/portal/invoices"),
        secondary: ["Download PDF receipt copy", d.documentUrl ?? "#"],
        footerNote:
          "Payment details are never sent by email. Always pay through the secure link in your client portal.",
      }),
  },
  {
    key: "INVOICE_REMINDER",
    group: "Invoice",
    name: "Payment reminder",
    ctaLabel: "VIEW INVOICE",
    subject: (d) => `A quick reminder — invoice ${d.invoiceNumber ?? ""}`.trim(),
    sample: { ...baseSample, invoiceNumber: "YV-INV-0421", dueDate: "26 March 2026", amount: "₦2,365,000", status: "UNPAID" },
    render: (d, o) =>
      shell(d, o, {
        preheader: `Invoice ${d.invoiceNumber ?? ""} is due ${d.dueDate ?? "soon"}.`,
        eyebrow: "Reminder",
        headline: "A QUICK REMINDER.",
        body: `Invoice ${d.invoiceNumber ?? ""} is due ${d.dueDate ?? "shortly"}. If it’s already on its way, please ignore this note.`,
        blocks: summaryCard([
          { label: "Invoice", value: d.invoiceNumber },
          { label: "Amount", value: d.amount },
          { label: "Due date", value: d.dueDate },
          { label: "Status", value: d.status ? statusBadge(d.status) : "" },
        ], "Invoice"),
        ctaLabel: "VIEW INVOICE",
        ctaHref: d.invoiceUrl ?? link("/portal/invoices"),
      }),
  },
  {
    key: "PAYMENT_RECEIVED",
    group: "Invoice",
    name: "Payment received",
    ctaLabel: "VIEW PROJECT",
    subject: () => "Payment received — Yomi Visuals",
    sample: {
      ...baseSample,
      status: "PAID",
      amount: "₦2,365,000",
      paymentDate: "13 March 2026",
      reference: "YV-INV-0421",
    },
    render: (d, o) =>
      shell(d, o, {
        preheader: "Thank you — your payment has been recorded.",
        eyebrow: "Payment received",
        headline: "PAYMENT RECEIVED.",
        body: "Thank you. Your payment has been received and recorded against your project.",
        blocks: summaryCard([
          { label: "Project", value: d.project },
          { label: "Amount", value: d.amount },
          { label: "Payment date", value: d.paymentDate },
          { label: "Reference", value: d.reference },
          { label: "Status", value: statusBadge("PAID") },
        ], "Receipt"),
        ctaLabel: "VIEW PROJECT",
        ctaHref: projectLink(d),
        secondary: ["Download receipt (PDF)", d.documentUrl ?? "#"],
      }),
  },
  {
    key: "CONTRACT_SENT",
    group: "Contract",
    name: "Contract ready",
    ctaLabel: "REVIEW AGREEMENT",
    subject: () => "Your YV agreement is ready.",
    sample: { ...baseSample, agreementType: "Production services agreement", date: "12 March 2026" },
    render: (d, o) =>
      shell(d, o, {
        preheader: "Your agreement is ready to review and sign.",
        eyebrow: "Agreement",
        headline: "READY WHEN YOU ARE.",
        body: "Your agreement is ready for review. Take your time — reach out if anything needs clarifying before signing.",
        blocks: summaryCard([
          { label: "Project", value: d.project },
          { label: "Client", value: d.client },
          { label: "Agreement type", value: d.agreementType },
          { label: "Date", value: d.date },
        ], "Agreement"),
        ctaLabel: "REVIEW AGREEMENT",
        ctaHref: d.contractUrl ?? projectLink(d),
        secondary: ["Download PDF", d.documentUrl ?? "#"],
      }),
  },
  {
    key: "CONTRACT_SIGNED",
    group: "Contract",
    name: "Contract signed",
    ctaLabel: "VIEW PROJECT",
    subject: () => "Agreement signed — Yomi Visuals",
    sample: { ...baseSample, signedDate: "13 March 2026", status: "APPROVED" },
    render: (d, o) =>
      shell(d, o, {
        preheader: "The agreement is complete.",
        eyebrow: "Signed",
        headline: "WE’RE OFFICIALLY ON.",
        body: "The agreement has been completed successfully. A copy is stored in your client portal.",
        blocks: summaryCard([
          { label: "Project", value: d.project },
          { label: "Client", value: d.client },
          { label: "Signed date", value: d.signedDate },
        ], "Agreement"),
        ctaLabel: "VIEW PROJECT",
        ctaHref: projectLink(d),
      }),
  },
  {
    key: "PRODUCTION_STARTED",
    group: "Production",
    name: "Production scheduled",
    ctaLabel: "VIEW PROJECT",
    subject: () => "Production has started — Yomi Visuals",
    sample: {
      ...baseSample,
      status: "IN PRODUCTION",
      productionDate: "02 April 2026",
      team: "Yomi Onalaru, Ada N., Ife K.",
      location: "YV Studios, Lagos",
    },
    render: (d, o) =>
      shell(d, o, {
        preheader: "Cameras up — production has started.",
        eyebrow: "Production",
        headline: "WE’RE MAKING IT REAL.",
        body: "Production is underway. Here are the details for your records.",
        blocks: summaryCard([
          { label: "Project", value: d.project },
          { label: "Production date", value: d.productionDate },
          { label: "Creative team", value: d.team },
          { label: "Location", value: d.location },
          { label: "Status", value: statusBadge("IN PRODUCTION") },
        ], "Production"),
        ctaLabel: "VIEW PROJECT",
        ctaHref: projectLink(d),
        hero: true,
      }),
  },
  {
    key: "PRODUCTION_REMINDER",
    group: "Production",
    name: "Production reminder",
    ctaLabel: "VIEW PROJECT",
    subject: (d) => `Production day — ${d.productionDate ?? "coming up"}`,
    sample: { ...baseSample, productionDate: "02 April 2026", location: "YV Studios, Lagos", callTime: "8:00am" },
    render: (d, o) =>
      shell(d, o, {
        preheader: "Production day is close.",
        eyebrow: "Reminder",
        headline: "ALMOST SHOWTIME.",
        body: "A short reminder ahead of your production day. Everything you need is below.",
        blocks: summaryCard([
          { label: "Project", value: d.project },
          { label: "Date", value: d.productionDate },
          { label: "Call time", value: d.callTime },
          { label: "Location", value: d.location },
        ], "Call sheet"),
        ctaLabel: "VIEW PROJECT",
        ctaHref: projectLink(d),
      }),
  },
  {
    key: "REVIEW_REQUESTED",
    group: "Review",
    name: "Approval requested",
    ctaLabel: "REVIEW & APPROVE",
    subject: () => "Your YV project is ready for review.",
    sample: { ...baseSample, status: "IN REVIEW", version: "V2", deliverables: "1× hero film, 12× stills" },
    render: (d, o) =>
      shell(d, o, {
        preheader: "Your review is needed to keep things moving.",
        eyebrow: "Review",
        headline: "YOUR REVIEW IS NEEDED.",
        body: "A new version is ready for your review. Approve it or send notes — both take a minute.",
        blocks: summaryCard([
          { label: "Project", value: d.project },
          { label: "Version", value: d.version },
          { label: "Deliverables", value: d.deliverables },
          { label: "Status", value: statusBadge("IN REVIEW") },
        ], "For review"),
        ctaLabel: "REVIEW & APPROVE",
        ctaHref: d.reviewUrl ?? projectLink(d),
        secondary: ["Request changes", d.revisionUrl ?? projectLink(d)],
      }),
  },
  {
    key: "REVISION_REQUESTED",
    group: "Review",
    name: "Revision request received",
    ctaLabel: "VIEW PROJECT",
    subject: () => "Revision request received — Yomi Visuals",
    sample: { ...baseSample, version: "V2", notes: "Warmer grade on the opening sequence; tighten the 15s cut." },
    render: (d, o) =>
      shell(d, o, {
        preheader: "We’ve got your notes.",
        eyebrow: "Revisions",
        headline: "WE’VE GOT YOUR NOTES.",
        body: "Thanks for the notes — we’re on it. We’ll share the updated version as soon as it’s ready.",
        blocks: summaryCard([
          { label: "Project", value: d.project },
          { label: "Version", value: d.version },
          { label: "Requested changes", value: d.notes },
        ], "Revision"),
        ctaLabel: "VIEW PROJECT",
        ctaHref: projectLink(d),
      }),
  },
  {
    key: "PROJECT_DELIVERED",
    group: "Delivery",
    name: "Project delivered",
    ctaLabel: "VIEW DELIVERABLES",
    subject: () => "Your YV project is ready.",
    sample: {
      ...baseSample,
      status: "DELIVERED",
      deliverables: "1× hero film, 3× cutdowns, 40× stills",
      deliveryDate: "18 April 2026",
    },
    render: (d, o) =>
      shell(d, o, {
        preheader: "Your final files are ready.",
        eyebrow: "Delivery",
        headline: "IT’S READY.",
        body: "Your final project files are now ready. Everything is available in your client portal.",
        blocks: summaryCard([
          { label: "Project", value: d.project },
          { label: "Deliverables", value: d.deliverables },
          { label: "Delivery date", value: d.deliveryDate },
          { label: "Status", value: statusBadge("DELIVERED") },
        ], "Delivery"),
        ctaLabel: "VIEW DELIVERABLES",
        ctaHref: d.deliverablesUrl ?? link("/portal/deliverables"),
        secondary: ["Download all", d.downloadUrl ?? link("/portal/deliverables")],
        hero: true,
      }),
  },
  {
    key: "PROJECT_COMPLETED",
    group: "Delivery",
    name: "Project completed",
    ctaLabel: "VIEW PROJECT",
    subject: () => "Project completed — Yomi Visuals",
    sample: { ...baseSample, status: "COMPLETED", completedDate: "20 April 2026" },
    render: (d, o) =>
      shell(d, o, {
        preheader: "That’s a wrap.",
        eyebrow: "Completed",
        headline: "THAT’S A WRAP.",
        body: "Your project is now complete. Everything stays available in your portal — and we’d love to build the next one with you.",
        blocks: summaryCard([
          { label: "Project", value: d.project },
          { label: "Completed", value: d.completedDate },
          { label: "Status", value: statusBadge("COMPLETED") },
        ]),
        ctaLabel: "VIEW PROJECT",
        ctaHref: projectLink(d),
      }),
  },
  {
    key: "PROJECT_FOLLOW_UP",
    group: "Follow-up",
    name: "Project follow-up",
    ctaLabel: "START A PROJECT",
    subject: (d) => `How did ${d.project ?? "the project"} land?`,
    sample: baseSample,
    render: (d, o) =>
      shell(d, o, {
        preheader: "A short note after delivery.",
        eyebrow: "Follow-up",
        headline: "HOW DID IT LAND?",
        body: "It’s been a little while since we delivered. We’d love to hear how the work performed — and what’s next on your calendar.",
        blocks: summaryCard([
          { label: "Project", value: d.project },
          { label: "Project ID", value: d.projectId },
        ]),
        ctaLabel: "START A PROJECT",
        ctaHref: link("/start-a-project"),
        footerNote:
          "You’re receiving this because Yomi Visuals recently completed a project with you.",
      }),
  },
];

export const templateByKey = (key: string) => templates.find((t) => t.key === key);

export const templateGroups = Array.from(new Set(templates.map((t) => t.group)));
