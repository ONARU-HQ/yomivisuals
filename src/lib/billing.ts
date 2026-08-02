import { supabase } from "@/integrations/supabase/client";

export function formatMoney(amount: number | string | null | undefined, currency = "NGN") {
  const value = Number(amount ?? 0);
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString()}`;
  }
}

export const stageLabels: Record<string, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  in_production: "In production",
  delivered: "Delivered",
};

export const stageOrder = ["requested", "confirmed", "in_production", "delivered"];

/** Fetches the branded PDF receipt from the server and saves it locally. */
export async function downloadReceipt(invoiceId: string, invoiceNumber: string) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const res = await fetch(`/api/receipt/${invoiceId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    throw new Error(`Receipt unavailable (${res.status})`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Yomi-Visuals-Receipt-${invoiceNumber}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
