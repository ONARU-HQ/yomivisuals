import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PIPELINE_STAGES, SIZE_LABEL, WORKFLOW_LABEL, stageLabel, typeLabel } from "@/lib/project-engine";

export const Route = createFileRoute("/_authenticated/admin/pipeline")({
  head: () => ({ meta: [{ title: "Pipeline — Yomi Visuals" }, { name: "robots", content: "noindex" }] }),
  component: PipelinePage,
});

type Brief = {
  id: string;
  project_id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  project_types: string[];
  capabilities: string[];
  objective: string | null;
  summary: string | null;
  category: string;
  size: keyof typeof SIZE_LABEL;
  workflow: keyof typeof WORKFLOW_LABEL;
  stage: string;
  budget: string | null;
  timeline: string | null;
  production_date: string | null;
  location: string | null;
  brand: string | null;
  industry: string | null;
  website: string | null;
  instagram: string | null;
  internal_notes: string | null;
  created_at: string;
};

function PipelinePage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const briefs = useQuery({
    queryKey: ["project-briefs"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("project_briefs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as Brief[];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      const { error } = await (supabase as any).from("project_briefs").update(patch).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["project-briefs"] }),
  });

  const rows = useMemo(
    () => (briefs.data ?? []).filter((b) => filter === "all" || b.stage === filter),
    [briefs.data, filter],
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const b of briefs.data ?? []) map[b.stage] = (map[b.stage] ?? 0) + 1;
    return map;
  }, [briefs.data]);

  return (
    <div>
      <p className="text-eyebrow">Project engine</p>
      <h1 className="text-display mt-3 text-[clamp(2rem,5vw,3rem)]">Pipeline.</h1>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`shrink-0 rounded-full border px-4 py-2 text-[12.5px] ${filter === "all" ? "border-gold text-foreground" : "border-border text-subtle"}`}
        >
          All ({briefs.data?.length ?? 0})
        </button>
        {PIPELINE_STAGES.map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`shrink-0 rounded-full border px-4 py-2 text-[12.5px] ${filter === s.key ? "border-gold text-foreground" : "border-border text-subtle"}`}
          >
            {s.label} ({counts[s.key] ?? 0})
          </button>
        ))}
      </div>

      {briefs.isLoading ? <p className="mt-10 text-[13px] text-muted-foreground">Loading briefs…</p> : null}
      {!briefs.isLoading && rows.length === 0 ? (
        <p className="mt-10 text-[13px] text-muted-foreground">No briefs in this stage yet.</p>
      ) : null}

      <div className="mt-6 space-y-3">
        {rows.map((b) => {
          const open = openId === b.id;
          return (
            <div key={b.id} className="panel p-5">
              <button
                onClick={() => setOpenId(open ? null : b.id)}
                className="flex w-full items-start justify-between gap-4 text-left"
              >
                <div className="min-w-0">
                  <p className="text-[11.5px] uppercase tracking-[0.16em] text-gold">{b.project_id}</p>
                  <p className="mt-1.5 truncate text-[15px] text-foreground">
                    {b.company || b.brand || b.name}
                    <span className="text-muted-foreground"> — {(b.project_types ?? []).map(typeLabel).join(", ")}</span>
                  </p>
                  <p className="mt-1 truncate text-[12.5px] text-muted-foreground">
                    {[SIZE_LABEL[b.size], WORKFLOW_LABEL[b.workflow], b.budget, b.timeline].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-border px-3 py-1 text-[11px] text-subtle">
                  {stageLabel(b.stage)}
                </span>
              </button>

              {open ? (
                <div className="mt-6 space-y-5 border-t border-border pt-5 text-[13.5px]">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Detail label="Contact">
                      {b.name}
                      {b.company ? `, ${b.company}` : ""}
                      <br />
                      <a href={`mailto:${b.email}`} className="link-underline">
                        {b.email}
                      </a>
                      {b.phone ? <> · {b.phone}</> : null}
                    </Detail>
                    <Detail label="Brand">
                      {[b.brand, b.industry, b.website, b.instagram].filter(Boolean).join(" · ") || "—"}
                    </Detail>
                    <Detail label="Objective">{b.objective || "—"}</Detail>
                    <Detail label="Schedule">
                      {[b.timeline, b.production_date, b.location].filter(Boolean).join(" · ") || "—"}
                    </Detail>
                    <Detail label="Scope">{(b.capabilities ?? []).join(", ") || "—"}</Detail>
                    <Detail label="Received">{new Date(b.created_at).toLocaleString()}</Detail>
                  </div>

                  {b.summary ? (
                    <div>
                      <p className="text-eyebrow">Summary</p>
                      <p className="mt-2 whitespace-pre-line text-subtle">{b.summary}</p>
                    </div>
                  ) : null}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-eyebrow">Stage</span>
                      <select
                        value={b.stage}
                        onChange={(e) => update.mutate({ id: b.id, patch: { stage: e.target.value } })}
                        className="mt-2 w-full rounded-sm border border-border bg-surface px-3 py-2.5 text-[13px]"
                      >
                        {PIPELINE_STAGES.map((s) => (
                          <option key={s.key} value={s.key}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-eyebrow">Internal notes</span>
                      <textarea
                        defaultValue={b.internal_notes ?? ""}
                        onBlur={(e) => {
                          if (e.target.value !== (b.internal_notes ?? ""))
                            update.mutate({ id: b.id, patch: { internal_notes: e.target.value } });
                        }}
                        rows={3}
                        className="mt-2 w-full rounded-sm border border-border bg-surface px-3 py-2.5 text-[13px]"
                        placeholder="Producer notes, call outcomes, next action…"
                      />
                    </label>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-eyebrow">{label}</p>
      <p className="mt-2 text-subtle">{children}</p>
    </div>
  );
}
