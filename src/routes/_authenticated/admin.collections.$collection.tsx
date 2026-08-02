import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { collectionByKey, emptyRecord, slugify, type FieldDef } from "@/lib/admin-config";
import { Button, Field, inputClass } from "@/components/site/ui";

export const Route = createFileRoute("/_authenticated/admin/collections/$collection")({
  component: CollectionEditor,
});

function FieldInput({
  def,
  value,
  onChange,
}: {
  def: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (def.type === "boolean") {
    return (
      <label className="flex items-center gap-3 rounded-[10px] border border-input bg-elevated px-4 py-3">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
        <span className="text-[13px]">{def.label}</span>
      </label>
    );
  }

  const wrapped = (node: React.ReactNode) => (
    <Field label={def.label} hint={def.help}>
      {node}
    </Field>
  );

  if (def.type === "textarea" || def.type === "richtext") {
    return wrapped(
      <textarea
        rows={def.type === "richtext" ? 10 : 4}
        className={inputClass}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />,
    );
  }

  if (def.type === "array") {
    const list = Array.isArray(value) ? (value as string[]) : [];
    return wrapped(
      <div className="space-y-2">
        {list.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={inputClass}
              value={item}
              onChange={(e) => {
                const next = [...list];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              onClick={() => onChange(list.filter((_, idx) => idx !== i))}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] border border-border text-muted-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...list, ""])}
          className="inline-flex items-center gap-1.5 text-[12.5px] text-subtle hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> Add item
        </button>
      </div>,
    );
  }

  if (def.type === "json") {
    return wrapped(
      <textarea
        rows={8}
        spellCheck={false}
        className={`${inputClass} font-mono text-[12px]`}
        defaultValue={JSON.stringify(value ?? [], null, 2)}
        onBlur={(e) => {
          try {
            onChange(JSON.parse(e.target.value || "[]"));
          } catch {
            /* keep last valid value */
          }
        }}
      />,
    );
  }

  if (def.type === "image") {
    return wrapped(
      <div className="space-y-3">
        <input
          className={inputClass}
          placeholder="https://…"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
        {value ? (
          <img src={value as string} alt="" className="h-28 w-full rounded-[10px] border border-border object-cover" />
        ) : null}
      </div>,
    );
  }

  return wrapped(
    <input
      type={def.type === "number" ? "number" : def.type === "date" ? "date" : "text"}
      className={inputClass}
      value={(value as string | number) ?? ""}
      onChange={(e) => onChange(def.type === "number" ? Number(e.target.value) : e.target.value)}
    />,
  );
}

function CollectionEditor() {
  const { collection } = Route.useParams();
  const def = collectionByKey[collection];
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Record<string, any> | null>(null);
  const [query, setQuery] = useState("");

  const list = useQuery({
    queryKey: ["admin", def?.table],
    enabled: !!def,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from(def.table)
        .select("*")
        .order(def.orderBy, { ascending: def.ascending ?? false });
      if (error) throw new Error(error.message);
      return (data ?? []) as any[];
    },
  });

  const save = useMutation({
    mutationFn: async (record: Record<string, any>) => {
      const payload: Record<string, any> = {};
      for (const f of def.fields) payload[f.name] = record[f.name] === "" ? null : record[f.name];
      if (payload["slug"] === null && record["title"]) payload["slug"] = slugify(String(record["title"]));
      if (record["id"]) {
        const { error } = await (supabase as any).from(def.table).update(payload).eq("id", record["id"]);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await (supabase as any).from(def.table).insert(payload);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", def.table] });
      queryClient.invalidateQueries();
      setDraft(null);
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from(def.table).delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", def.table] });
      setDraft(null);
    },
  });

  const rows = useMemo(
    () =>
      (list.data ?? []).filter((r) =>
        query ? JSON.stringify(r).toLowerCase().includes(query.toLowerCase()) : true,
      ),
    [list.data, query],
  );

  if (!def) {
    return <p className="text-[14px] text-muted-foreground">Unknown collection.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-eyebrow">Content</p>
          <h1 className="text-display mt-3 text-[clamp(1.8rem,4vw,2.6rem)]">{def.label}</h1>
          <p className="mt-3 max-w-lg text-[13.5px] text-muted-foreground">{def.description}</p>
        </div>
        <Button type="button" onClick={() => setDraft(emptyRecord(def))}>
          New {def.singular.toLowerCase()}
        </Button>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search ${def.label.toLowerCase()}…`}
        className={`${inputClass} mt-8 max-w-sm`}
      />

      <div className="panel mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-border">
              {def.columns.map((c) => (
                <th key={c.name} className="px-5 py-3.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {c.label}
                </th>
              ))}
              {def.statusField ? (
                <th className="px-5 py-3.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Status</th>
              ) : null}
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.id} className="transition-colors hover:bg-elevated">
                {def.columns.map((c) => (
                  <td key={c.name} className="max-w-[280px] truncate px-5 py-4 text-[13.5px]">
                    {String(r[c.name] ?? "—")}
                  </td>
                ))}
                {def.statusField ? (
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] ${
                        r[def.statusField]
                          ? "border-border-strong text-foreground"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {r[def.statusField] ? "Published" : "Draft"}
                    </span>
                  </td>
                ) : null}
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => setDraft({ ...emptyRecord(def), ...r })}
                    className="text-[12.5px] link-underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={def.columns.length + 2} className="px-5 py-12 text-center text-[13px] text-muted-foreground">
                  Nothing here yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {draft ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={() => setDraft(null)}>
          <div
            className="h-full w-full max-w-2xl overflow-y-auto border-l border-border bg-background p-6 md:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-eyebrow">{draft["id"] ? "Editing" : "New"}</p>
                <h2 className="text-display mt-2 text-2xl">
                  {String(draft[def.titleField] || def.singular)}
                </h2>
              </div>
              <button onClick={() => setDraft(null)} className="grid h-10 w-10 place-items-center rounded-full border border-border">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {def.fields.map((f) => (
                <div key={f.name} className={f.full ? "sm:col-span-2" : ""}>
                  <FieldInput
                    def={f}
                    value={draft[f.name]}
                    onChange={(v) => setDraft((d) => ({ ...(d as any), [f.name]: v }))}
                  />
                </div>
              ))}
            </div>

            {save.isError ? <p className="mt-5 text-[13px] text-destructive">{(save.error as Error).message}</p> : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <Button type="button" disabled={save.isPending} onClick={() => save.mutate(draft)}>
                {save.isPending ? "Saving…" : "Save"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setDraft(null)}>
                Cancel
              </Button>
              {draft["id"] ? (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Delete this record permanently?")) remove.mutate(draft["id"]);
                  }}
                  className="ml-auto text-[12.5px] text-destructive"
                >
                  Delete
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
