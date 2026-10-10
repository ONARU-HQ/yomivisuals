import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button, Field, inputClass } from "@/components/site/ui";

export const Route = createFileRoute("/_authenticated/admin/inbox")({
  head: () => ({ meta: [{ title: "Enquiry Inbox — Yomi Visuals" }, { name: "description", content: "Review Yomi Visuals bookings, enquiries and subscribers." }, { property: "og:title", content: "Enquiry Inbox — Yomi Visuals" }, { property: "og:description", content: "Review Yomi Visuals bookings, enquiries and subscribers." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: AdminInbox,
});

const bookingStatuses = ["pending", "confirmed", "completed", "cancelled"];
const bookingStages = ["requested", "confirmed", "in_production", "delivered"];
const leadStatuses = ["new", "contacted", "qualified", "won", "lost"];

type Tab = "bookings" | "leads" | "subscribers";

function useRows(table: string) {
  return useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as any[];
    },
  });
}

function AdminInbox() {
  const [tab, setTab] = useState<Tab>("bookings");
  const [selected, setSelected] = useState<any | null>(null);
  const [query, setQuery] = useState("");
  const rows = useRows(tab);
  const queryClient = useQueryClient();

  const save = useMutation({
    mutationFn: async (patch: Record<string, unknown>) => {
      const { error } = await (supabase as any).from(tab).update(patch).eq("id", selected.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: (_d, patch) => {
      queryClient.invalidateQueries({ queryKey: ["admin", tab] });
      setSelected((s: any) => ({ ...s, ...patch }));
    },
  });

  const filtered = (rows.data ?? []).filter((r) =>
    query
      ? JSON.stringify(r).toLowerCase().includes(query.toLowerCase())
      : true,
  );

  return (
    <div>
      <p className="text-eyebrow">Inbox</p>
      <h1 className="text-display mt-3 text-[clamp(1.8rem,4vw,2.6rem)]">Enquiries &amp; bookings.</h1>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {(["bookings", "leads", "subscribers"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setSelected(null);
            }}
            className={`rounded-full border px-4 py-2 text-[12.5px] capitalize transition-colors ${
              tab === t ? "border-border-strong bg-elevated text-foreground" : "border-border text-subtle"
            }`}
          >
            {t}
          </button>
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className={`${inputClass} ml-auto max-w-xs`}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="panel overflow-hidden">
          <ul className="divide-y divide-border">
            {filtered.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => setSelected(r)}
                  className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-elevated ${
                    selected?.id === r.id ? "bg-elevated" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-[14px]">{r.name ?? r.email}</p>
                    <p className="truncate text-[12px] text-muted-foreground">
                      {r.service ?? r.source ?? r.email} · {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {r.status ? (
                    <span className="shrink-0 rounded-full border border-border px-3 py-1 text-[11px] capitalize text-subtle">
                      {r.status}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
            {filtered.length === 0 ? (
              <li className="px-5 py-10 text-center text-[13px] text-muted-foreground">Nothing here yet.</li>
            ) : null}
          </ul>
        </div>

        <div className="panel h-fit p-6">
          {!selected ? (
            <p className="text-[13px] text-muted-foreground">Select a record to review and update it.</p>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-eyebrow">{tab.slice(0, -1)}</p>
                <h2 className="text-display mt-2 text-2xl">{selected.name ?? selected.email}</h2>
                {selected.reference ? (
                  <p className="mt-1 text-[12px] text-muted-foreground">Ref {selected.reference}</p>
                ) : null}
              </div>

              <dl className="space-y-2 text-[13px]">
                {[
                  ["Email", selected.email],
                  ["Phone", selected.phone],
                  ["Company", selected.company],
                  ["Service", selected.service],
                  ["Budget", selected.budget],
                  ["Preferred", [selected.preferred_date, selected.preferred_time].filter(Boolean).join(" · ")],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={String(k)} className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="text-right text-foreground">{String(v)}</dd>
                    </div>
                  ))}
              </dl>

              {selected.message ? (
                <p className="rounded-[10px] border border-border bg-elevated p-4 text-[13px] leading-relaxed text-subtle">
                  {selected.message}
                </p>
              ) : null}

              {tab !== "subscribers" ? (
                <>
                  <Field label="Status">
                    <select
                      className={inputClass}
                      value={selected.status ?? ""}
                      onChange={(e) => save.mutate({ status: e.target.value })}
                    >
                      {(tab === "bookings" ? bookingStatuses : leadStatuses).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {tab === "bookings" ? (
                    <>
                      <Field label="Production stage">
                        <select
                          className={inputClass}
                          value={selected.stage ?? "requested"}
                          onChange={(e) => save.mutate({ stage: e.target.value })}
                        >
                          {bookingStages.map((s) => (
                            <option key={s} value={s}>
                              {s.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Quoted amount (NGN)">
                        <input
                          type="number"
                          className={inputClass}
                          defaultValue={selected.amount ?? ""}
                          onBlur={(e) => save.mutate({ amount: e.target.value ? Number(e.target.value) : null })}
                        />
                      </Field>
                    </>
                  ) : null}

                  <Field label="Internal notes">
                    <textarea
                      rows={4}
                      className={inputClass}
                      defaultValue={selected.notes ?? ""}
                      onBlur={(e) => save.mutate({ notes: e.target.value })}
                    />
                  </Field>
                </>
              ) : null}

              <div className="flex gap-2">
                <a href={`mailto:${selected.email}`} className="w-full">
                  <Button className="w-full" type="button">
                    Reply by email
                  </Button>
                </a>
              </div>
              {save.isPending ? <p className="text-[12px] text-muted-foreground">Saving…</p> : null}
              {save.isError ? <p className="text-[12px] text-destructive">{(save.error as Error).message}</p> : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
