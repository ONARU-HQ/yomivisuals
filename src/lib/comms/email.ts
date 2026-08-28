import { brand, brandAssets, clampWatermarkOpacity, fontStack, palette, statusTones } from "./brand";

/**
 * Table-based, inline-styled email primitives.
 * Compatible with Gmail, Apple Mail, Outlook and Yahoo Mail.
 * The design system is locked here; templates only supply content.
 */

export const esc = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export type SummaryRow = { label: string; value: string };

export function eyebrow(text: string) {
  return `<p style="margin:0 0 14px;font:600 11px/1.4 ${fontStack};letter-spacing:.18em;text-transform:uppercase;color:${palette.gold};">${esc(text)}</p>`;
}

export function headline(text: string) {
  return `<h1 class="yv-h1" style="margin:0 0 16px;font:600 30px/1.12 ${fontStack};letter-spacing:-0.03em;color:${palette.ink};">${esc(text)}</h1>`;
}

export function paragraph(text: string) {
  return `<p style="margin:0 0 18px;font:400 16px/1.65 ${fontStack};color:#3A3A3A;">${esc(text)}</p>`;
}

export function meta(text: string) {
  return `<p style="margin:0 0 10px;font:400 13px/1.6 ${fontStack};color:${palette.grey};">${esc(text)}</p>`;
}

export function divider() {
  return `<div style="height:1px;line-height:1px;font-size:0;background:${palette.line};margin:28px 0;">&nbsp;</div>`;
}

export function statusBadge(status: string) {
  const tone = statusTones[status.toUpperCase()] ?? "neutral";
  const styles =
    tone === "ink"
      ? `background:${palette.ink};color:${palette.white};border:1px solid ${palette.ink};`
      : tone === "gold"
        ? `background:#FBF6EC;color:#8A6A26;border:1px solid ${palette.gold};`
        : `background:${palette.offWhite};color:#4A4A4A;border:1px solid ${palette.line};`;
  return `<span style="display:inline-block;padding:6px 12px;border-radius:4px;font:600 11px/1 ${fontStack};letter-spacing:.14em;text-transform:uppercase;${styles}">${esc(status)}</span>`;
}

/** Reusable project summary card — shared by emails and documents. */
export function summaryCard(rows: SummaryRow[], title = "Project summary") {
  const body = rows
    .filter((r) => r.value)
    .map(
      (r) => `<tr>
        <td style="padding:10px 0;font:400 12px/1.4 ${fontStack};letter-spacing:.12em;text-transform:uppercase;color:${palette.grey};width:42%;vertical-align:top;">${esc(r.label)}</td>
        <td style="padding:10px 0;font:500 15px/1.5 ${fontStack};color:${palette.ink};text-align:right;">${r.value.startsWith("<span") ? r.value : esc(r.value)}</td>
      </tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${palette.line};border-radius:6px;background:${palette.white};margin:0 0 28px;">
    <tr><td style="padding:22px 24px 6px;">
      <p style="margin:0 0 6px;font:600 11px/1.4 ${fontStack};letter-spacing:.18em;text-transform:uppercase;color:${palette.grey};">${esc(title)}</p>
    </td></tr>
    <tr><td style="padding:0 24px 18px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${body}</table>
    </td></tr>
  </table>`;
}

/** Line-item table used by invoice and quote emails. */
export function lineItems(items: { label: string; amount: string }[], totals: SummaryRow[]) {
  const rows = items
    .map(
      (i) => `<tr>
      <td style="padding:12px 0;border-bottom:1px solid ${palette.line};font:400 15px/1.5 ${fontStack};color:${palette.ink};">${esc(i.label)}</td>
      <td style="padding:12px 0;border-bottom:1px solid ${palette.line};font:400 15px/1.5 ${fontStack};color:${palette.ink};text-align:right;white-space:nowrap;">${esc(i.amount)}</td>
    </tr>`,
    )
    .join("");
  const totalRows = totals
    .map(
      (t, idx) => `<tr>
      <td style="padding:${idx === totals.length - 1 ? "14px 0 0" : "10px 0 0"};font:${idx === totals.length - 1 ? "600 17px" : "400 14px"}/1.5 ${fontStack};color:${idx === totals.length - 1 ? palette.ink : palette.grey};">${esc(t.label)}</td>
      <td style="padding:${idx === totals.length - 1 ? "14px 0 0" : "10px 0 0"};font:${idx === totals.length - 1 ? "600 17px" : "400 14px"}/1.5 ${fontStack};color:${idx === totals.length - 1 ? palette.ink : palette.grey};text-align:right;white-space:nowrap;">${esc(t.value)}</td>
    </tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">${rows}${totalRows}</table>`;
}

/** Primary CTA — dark, 48px tall, full width on mobile. */
export function cta(label: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" class="yv-cta" style="margin:0 0 14px;">
    <tr><td align="center" bgcolor="${palette.ink}" style="border-radius:4px;">
      <a href="${esc(href)}" style="display:block;padding:15px 30px;min-height:18px;font:600 14px/1.2 ${fontStack};letter-spacing:.04em;color:${palette.white};text-decoration:none;">${esc(label)}&nbsp;&rarr;</a>
    </td></tr>
  </table>`;
}

export function secondaryLink(label: string, href: string) {
  return `<p style="margin:0 0 4px;font:500 14px/1.5 ${fontStack};"><a href="${esc(href)}" style="color:${palette.ink};text-decoration:underline;text-underline-offset:3px;">${esc(label)}</a></p>`;
}

/** Optional cinematic hero image with a safe fallback colour. */
export function heroImage(src: string, alt: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
    <tr><td bgcolor="${palette.ink}" style="border-radius:6px;overflow:hidden;line-height:0;">
      <img src="${esc(src)}" alt="${esc(alt)}" width="592" style="display:block;width:100%;max-width:592px;height:auto;border:0;background:${palette.ink};" />
    </td></tr>
  </table>`;
}

function signature() {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 6px;">
    <tr>
      <td style="padding-right:14px;vertical-align:middle;">
        <img src="${brandAssets.mark}" alt="${brand.shortName}" width="34" height="34" style="display:block;width:34px;height:34px;border:0;" />
      </td>
      <td style="vertical-align:middle;">
        <p style="margin:0;font:600 14px/1.4 ${fontStack};color:${palette.ink};">${brand.founder.name}</p>
        <p style="margin:0;font:400 13px/1.4 ${fontStack};color:${palette.grey};">${brand.founder.role}, ${brand.name}</p>
      </td>
    </tr>
  </table>`;
}

function footer(note: string, opacity: number) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:0 24px;">
      <div style="height:1px;line-height:1px;font-size:0;background:${palette.line};margin:0 0 22px;">&nbsp;</div>
      <img src="${brandAssets.mark}" alt="${brand.shortName}" width="28" height="28" style="display:block;width:28px;height:28px;border:0;margin:0 0 12px;" />
      <p style="margin:0;font:600 13px/1.5 ${fontStack};letter-spacing:.04em;color:${palette.ink};">${brand.name.toUpperCase()}</p>
      <p style="margin:0 0 10px;font:400 13px/1.6 ${fontStack};color:${palette.grey};">${brand.descriptor}<br />${brand.location}</p>
      <p style="margin:0 0 18px;font:400 13px/1.6 ${fontStack};color:${palette.grey};">
        <a href="${brand.website}" style="color:${palette.ink};text-decoration:none;">${brand.websiteLabel}</a>
        &nbsp;&middot;&nbsp;<a href="mailto:${brand.email}" style="color:${palette.ink};text-decoration:none;">${brand.email}</a>
        &nbsp;&middot;&nbsp;<a href="${brand.instagram}" style="color:${palette.ink};text-decoration:none;">${brand.instagramLabel}</a>
      </p>
      <p style="margin:0 0 26px;font:400 12px/1.6 ${fontStack};color:#9A9A9A;">${esc(note)}</p>
    </td></tr>
    <tr><td align="center" style="padding:0 0 10px;">
      <img src="${brandAssets.mark}" alt="" width="220" style="display:block;width:220px;max-width:60%;height:auto;border:0;opacity:${opacity};" />
    </td></tr>
  </table>`;
}

export type EmailShell = {
  preheader: string;
  body: string;
  footerNote?: string;
  watermarkOpacity?: number;
};

/** Wraps content in the locked YV email canvas (640px, off-white, watermarked). */
export function renderEmail({ preheader, body, footerNote, watermarkOpacity }: EmailShell) {
  const opacity = clampWatermarkOpacity(watermarkOpacity);
  const note =
    footerNote ??
    "You’re receiving this email because you have an active project or relationship with Yomi Visuals.";

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light only" />
<title>${brand.name}</title>
<style>
  @media only screen and (max-width:620px){
    .yv-shell{width:100% !important;}
    .yv-pad{padding-left:20px !important;padding-right:20px !important;}
    .yv-cta{width:100% !important;}
    .yv-cta td{width:100% !important;}
    .yv-cta a{display:block !important;text-align:center !important;}
    .yv-h1{font-size:26px !important;}
  }
  @media (prefers-color-scheme:dark){
    .yv-bg{background:#0A0A0A !important;}
    .yv-card{background:#111111 !important;}
    .yv-h1,.yv-ink{color:#F5F5F2 !important;}
  }
</style>
</head>
<body class="yv-bg" style="margin:0;padding:0;background:${palette.offWhite};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="yv-bg" style="background:${palette.offWhite};">
  <tr><td align="center" style="padding:32px 12px;">
    <table role="presentation" class="yv-shell" width="640" cellpadding="0" cellspacing="0" style="width:640px;max-width:640px;">
      <tr><td class="yv-pad" style="padding:0 24px 26px;">
        <img src="${brandAssets.mark}" alt="${brand.name}" width="40" height="40" style="display:block;width:40px;height:40px;border:0;" />
      </td></tr>
      <tr><td>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="yv-card" style="background:${palette.white};border:1px solid ${palette.line};border-radius:8px;">
          <tr><td class="yv-pad" style="padding:38px 24px 34px;">${body}</td></tr>
        </table>
      </td></tr>
      <tr><td class="yv-pad" style="padding:30px 0 0;">${signature()}</td></tr>
      <tr><td style="padding:26px 0 0;">${footer(note, opacity)}</td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}
