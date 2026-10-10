import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button, Field, inputClass } from "@/components/site/ui";
import { formatMoney, downloadReceipt } from "@/lib/billing";

export const Route = createFileRoute("/_authenticated/admin/invoices")({
  head: () => ({ meta: [{ title: "Invoice Management — Yomi Visuals" }, { name: "description", content: "Manage Yomi Visuals client invoices and receipts." }, { property: "og:title", content: "Invoice Management — Yomi Visuals" }, { property: "og:description", content: "Manage Yomi Visuals client invoices and receipts." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: AdminInvoices,
});

const emptyInvoice = {
  number: "",
  client_name: "",
  client_email: "",
  description: "",
  amount: 0,
  currency: "NGN",
  status: "unpaid",
  due_at: "",
  notes: "",
  booking_id: "",
};

function AdminInvoices() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Record<string, any> | null>(null);

  const invoices = useQuery({
    queryKey: ["admin", "invoices"],
    queryFn: async () => {
      const { data, error } = await supabase.from("invoices").select("*").order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const bookings = useQuery({
    queryKey: ["admin", "bookings-lite"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, name, email, reference, service, amount, user_id")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async (record: Record<string, any>) => {
      const booking = (bookings.data ?? []).find((b: any) => b.id === record["booking_id"]);
      const payload: Record<string, any> = {
        number: record["number"] || `YV-INV-${Date.now().toString().slice(-6)}`,
        client_name: record["client_name"],
        client_email: record["client_email"],
        description: record["description"] || null,
        amount: Number(record["amount"] || 0),
        currency: record["currency"] || "NGN",
        status: record["status"],
        due_at: record["due_at"] || null,
        notes: record["notes"] || null,
        booking_id: record["booking_id"] || null,
        user_id: booking?.user_id ?? record["user_id"] ?? null,
        paid_at: record["status"] === "paid" ? (record["paid_at"] ?? new Date().toISOString()) : null,
      };
      if (record["id"]) {
        const { error } = await (supabase as any).from("invoices").update(payload).eq("id", record["id"]);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await (supabase as any).from("invoices").insert(payload);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "invoices"] });
      setDraft(null);
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-eyebrow">Billing</p>
          <h1 className="text-display mt-3 text-[clamp(1.8rem,4vw,2.6rem)]">Invoices &amp; receipts.</h1>
        </div>
        <Button type="button" onClick={() => setDraft({ ...emptyInvoice })}>
          New invoice
        </Button>
      </div>

      <div className="panel mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-border">
              {["Number", "Client", "Amount", "Status", "Due", ""].map((h) => (
                <th key={h} className="px-5 py-3.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(invoices.data ?? []).map((inv: any) => (
              <tr key={inv.id} className="transition-colors hover:bg-elevated">
                <td className="px-5 py-4 text-[13.5px]">{inv.number}</td>
                <td className="px-5 py-4 text-[13.5px]">
                  <span className="block">{inv.client_name}</span>
                  <span className="text-[12px] text-muted-foreground">{inv.client_email}</span>
                </td>
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
                <td className="px-5 py-4 text-[13px] text-muted-foreground">{inv.due_at ?? "—"}</td>
                <td className="px-5 py-4 text-right text-[12.5px]">
                  <button onClick={() => setDraft({ ...emptyInvoice, ...inv, due_at: inv.due_at ?? "" })} className="link-underline">
                    Edit
                  </button>
                  {inv.status === "paid" ? (
                    <button onClick={() => downloadReceipt(inv.id, inv.number)} className="ml-4 link-underline">
                      Receipt
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
            {invoices.data?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-[13px] text-muted-foreground">
                  No invoices yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {draft ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={() => setDraft(null)}>
          <div
            className="h-full w-full max-w-xl overflow-y-auto border-l border-border bg-background p-6 md:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-display text-2xl">{draft["id"] ? "Edit invoice" : "New invoice"}</h2>
              <button onClick={() => setDraft(null)} className="grid h-10 w-10 place-items-center rounded-full border border-border">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Linked booking" hint="Attaches the invoice to a client's portal.">
                  <select
                    className={inputClass}
                    value={draft["booking_id"] ?? ""}
                    onChange={(e) => {
                      const b = (bookings.data ?? []).find((x: any) => x.id === e.target.value);
                      setDraft((d) => ({
                        ...(d as any),
                        booking_id: e.target.value,
                        client_name: b?.name ?? d?.["client_name"],
                        client_email: b?.email ?? d?.["client_email"],
                        description: b?.service ?? d?.["description"],
                        amount: b?.amount ?? d?.["amount"],
                      }));
                    }}
                  >
                    <option value="">Not linked</option>
                    {(bookings.data ?? []).map((b: any) => (
                      <option key={b.id} value={b.id}>
                        {b.reference} — {b.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Invoice number">
                <input className={inputClass} value={draft["number"] ?? ""} onChange={(e) => setDraft((d) => ({ ...(d as any), number: e.target.value }))} placeholder="Auto if blank" />
              </Field>
              <Field label="Amount">
                <input type="number" className={inputClass} value={draft["amount"] ?? 0} onChange={(e) => setDraft((d) => ({ ...(d as any), amount: e.target.value }))} />
              </Field>
              <Field label="Client name">
                <input className={inputClass} value={draft["client_name"] ?? ""} onChange={(e) => setDraft((d) => ({ ...(d as any), client_name: e.target.value }))} />
              </Field>
              <Field label="Client email">
                <input className={inputClass} value={draft["client_email"] ?? ""} onChange={(e) => setDraft((d) => ({ ...(d as any), client_email: e.target.value }))} />
              </Field>
              <Field label="Status">
                <select className={inputClass} value={draft["status"] ?? "unpaid"} onChange={(e) => setDraft((d) => ({ ...(d as any), status: e.target.value }))}>
                  {["unpaid", "paid", "refunded", "void"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Due date">
                <input type="date" className={inputClass} value={draft["due_at"] ?? ""} onChange={(e) => setDraft((d) => ({ ...(d as any), due_at: e.target.value }))} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Description">
                  <input className={inputClass} value={draft["description"] ?? ""} onChange={(e) => setDraft((d) => ({ ...(d as any), description: e.target.value }))} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Notes">
                  <textarea rows={3} className={inputClass} value={draft["notes"] ?? ""} onChange={(e) => setDraft((d) => ({ ...(d as any), notes: e.target.value }))} />
                </Field>
              </div>
            </div>

            {save.isError ? <p className="mt-5 text-[13px] text-destructive">{(save.error as Error).message}</p> : null}

            <div className="mt-8 flex gap-3">
              <Button type="button" disabled={save.isPending} onClick={() => save.mutate(draft)}>
                {save.isPending ? "Saving…" : "Save invoice"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setDraft(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
