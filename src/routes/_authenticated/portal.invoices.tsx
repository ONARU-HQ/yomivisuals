import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatMoney, downloadReceipt } from "@/lib/billing";

export const Route = createFileRoute("/_authenticated/portal/invoices")({
  head: () => ({ meta: [{ title: "My Invoices — Yomi Visuals" }, { name: "description", content: "Review your Yomi Visuals invoices and download receipts." }, { property: "og:title", content: "My Invoices — Yomi Visuals" }, { property: "og:description", content: "Review your Yomi Visuals invoices and download receipts." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: PortalInvoices,
});

function PortalInvoices() {
  const [error, setError] = useState<string | null>(null);
  const invoices = useQuery({
    queryKey: ["portal", "invoices"],
    queryFn: async () => {
      const { data, error: err } = await supabase.from("invoices").select("*").order("issued_at", { ascending: false });
      if (err) throw new Error(err.message);
      return data ?? [];
    },
  });

  if (invoices.isLoading) return <p className="text-[13px] text-muted-foreground">Loading invoices…</p>;
  if (!invoices.data?.length)
    return <div className="panel p-10 text-center text-[14px] text-muted-foreground">No invoices yet.</div>;

  return (
    <div className="panel overflow-x-auto">
      {error ? <p className="px-5 pt-4 text-[12.5px] text-destructive">{error}</p> : null}
      <table className="w-full min-w-[600px] text-left">
        <thead>
          <tr className="border-b border-border">
            {["Invoice", "Description", "Amount", "Status", ""].map((h) => (
              <th key={h} className="px-5 py-3.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {invoices.data.map((inv: any) => (
            <tr key={inv.id}>
              <td className="px-5 py-4 text-[13.5px]">
                {inv.number}
                <span className="block text-[12px] text-muted-foreground">Issued {inv.issued_at}</span>
              </td>
              <td className="px-5 py-4 text-[13.5px]">{inv.description ?? "—"}</td>
              <td className="px-5 py-4 text-[13.5px]">{formatMoney(inv.amount, inv.currency)}</td>
              <td className="px-5 py-4">
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] capitalize ${
                    inv.status === "paid" ? "border-border-strong text-foreground" : "border-border text-muted-foreground"
                  }`}
                >
                  {inv.status}
                </span>
              </td>
              <td className="px-5 py-4 text-right">
                {inv.status === "paid" ? (
                  <button
                    onClick={() => downloadReceipt(inv.id, inv.number).catch((e) => setError(e.message))}
                    className="text-[12.5px] link-underline"
                  >
                    Download receipt
                  </button>
                ) : (
                  <span className="text-[12.5px] text-muted-foreground">Due {inv.due_at ?? "on confirmation"}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
