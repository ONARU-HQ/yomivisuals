import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Eye, ImagePlus, Plus, Star, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button, Field, inputClass } from "@/components/site/ui";
import {
  CASE_SECTIONS,
  CREDIT_ROLES,
  MEDIA_LAYOUTS,
  VISIBILITIES,
  WORK_CATEGORIES,
  WORK_SERVICES,
  slugify,
  workAdminQuery,
  type ProjectMedia,
  type WorkProject,
} from "@/lib/work";

export const Route = createFileRoute("/_authenticated/admin/work")({
  head: () => ({ meta: [{ title: "Work — Yomi Visuals Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminWork,
});

const projects = () => (supabase as any).from("projects");
const mediaTable = () => (supabase as any).from("project_media");

type Tab = "all" | "featured" | "drafts" | "archived";

function AdminWork() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery(workAdminQuery);
  const [tab, setTab] = useState<Tab>("all");
  const [editing, setEditing] = useState<WorkProject | null>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "work"] });
    qc.invalidateQueries({ queryKey: ["work"] });
  };

  const save = useMutation({
    mutationFn: async (row: Partial<WorkProject>) => {
      const { id, ...patch } = row as any;
      if (id) {
        const { error } = await projects().update(patch).eq("id", id);
        if (error) throw new Error(error.message);
        return id as string;
      }
      const { data, error } = await projects().insert(patch).select("*").single();
      if (error) throw new Error(error.message);
      return data.id as string;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Project saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await projects().delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      invalidate();
      setEditing(null);
      toast.success("Project deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const visible = useMemo(() => {
    if (tab === "featured") return rows.filter((r) => r.featured);
    if (tab === "drafts") return rows.filter((r) => !r.published);
    if (tab === "archived") return rows.filter((r) => r.visibility === "private");
    return rows;
  }, [rows, tab]);

  const stats = {
    total: rows.length,
    published: rows.filter((r) => r.published && r.visibility !== "private").length,
    featured: rows.filter((r) => r.featured).length,
    drafts: rows.filter((r) => !r.published).length,
  };

  function newProject() {
    setEditing({
      id: "",
      slug: "",
      title: "",
      client: "",
      industry: "",
      category: "Campaigns",
      categories: [],
      project_type: "",
      location: "Lagos, Nigeria",
      project_date: null,
      year: new Date().getFullYear(),
      services: [],
      description: "",
      challenge: null,
      solution: null,
      results: null,
      idea: "",
      approach: "",
      production: "",
      outcome: "",
      cover_image: "",
      hero_video: "",
      images: [],
      videos: [],
      credits: {},
      sections: {},
      seo_title: "",
      seo_description: "",
      og_image: "",
      featured: false,
      featured_order: 0,
      published: false,
      visibility: "public",
      sort_order: rows.length + 1,
    } as WorkProject);
  }

  return (
    <div>
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-eyebrow">Portfolio</p>
          <h1 className="text-display mt-2 text-3xl">Work</h1>
          <p className="mt-2 text-[13px] text-muted-foreground">
            {stats.total} projects · {stats.published} live · {stats.featured} featured · {stats.drafts} drafts
          </p>
        </div>
        <Button onClick={newProject}>
          <Plus className="h-4 w-4" /> New project
        </Button>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", "featured", "drafts", "archived"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-2 text-[12px] capitalize ${
              tab === t ? "border-transparent bg-elevated text-foreground" : "border-border text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-10 text-[13px] text-muted-foreground">Loading projects…</p>
      ) : (
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {visible.map((p) => (
            <li key={p.id} className="flex items-center gap-4 py-3">
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-[6px] border border-border bg-elevated">
                {p.cover_image ? <img src={p.cover_image} alt="" className="h-full w-full object-cover" /> : null}
              </div>
              <button type="button" onClick={() => setEditing(p)} className="min-w-0 flex-1 text-left">
                <p className="truncate text-[14px]">{p.title || "Untitled"}</p>
                <p className="truncate text-[12px] text-muted-foreground">
                  {p.client || "—"} · {p.category} · {p.year ?? "—"} · {p.visibility}
                  {p.published ? "" : " · draft"}
                </p>
              </button>
              <button
                type="button"
                aria-label="Toggle featured"
                onClick={() => save.mutate({ id: p.id, featured: !p.featured } as any)}
                className={`grid h-9 w-9 place-items-center rounded-[8px] border border-border ${p.featured ? "text-gold" : "text-muted-foreground"}`}
              >
                <Star className="h-4 w-4" />
              </button>
              <Link
                to="/work/$slug"
                params={{ slug: p.slug }}
                aria-label="Preview case study"
                className="grid h-9 w-9 place-items-center rounded-[8px] border border-border text-muted-foreground"
              >
                <Eye className="h-4 w-4" />
              </Link>
            </li>
          ))}
          {visible.length === 0 ? <li className="py-10 text-[13px] text-muted-foreground">Nothing here yet.</li> : null}
        </ul>
      )}

      {editing ? (
        <ProjectDrawer
          project={editing}
          onClose={() => setEditing(null)}
          onSave={async (row) => {
            const id = await save.mutateAsync(row);
            setEditing((cur) => (cur ? ({ ...cur, ...row, id } as WorkProject) : cur));
          }}
          onDelete={(id) => remove.mutate(id)}
        />
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Project drawer — details, sections, credits, media                   */
/* ------------------------------------------------------------------ */

function ProjectDrawer({
  project,
  onClose,
  onSave,
  onDelete,
}: {
  project: WorkProject;
  onClose: () => void;
  onSave: (row: Partial<WorkProject>) => Promise<void>;
  onDelete: (id: string) => void;
}) {
  const [row, setRow] = useState<WorkProject>(project);
  const set = (patch: Partial<WorkProject>) => setRow((r) => ({ ...r, ...patch }));

  const list = (v: string) => v.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-background/70 backdrop-blur">
      <div className="h-full w-full max-w-3xl overflow-y-auto border-l border-border bg-background p-5 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-eyebrow">{row.id ? "Edit project" : "New project"}</p>
            <h2 className="text-display mt-2 text-2xl">{row.title || "Untitled"}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-10 w-10 place-items-center border border-border">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Project title">
            <input
              className={inputClass}
              value={row.title}
              onChange={(e) => set({ title: e.target.value, slug: row.slug || slugify(e.target.value) })}
            />
          </Field>
          <Field label="Slug">
            <input className={inputClass} value={row.slug} onChange={(e) => set({ slug: slugify(e.target.value) })} />
          </Field>
          <Field label="Client / brand">
            <input className={inputClass} value={row.client ?? ""} onChange={(e) => set({ client: e.target.value })} />
          </Field>
          <Field label="Year">
            <input
              type="number"
              className={inputClass}
              value={row.year ?? ""}
              onChange={(e) => set({ year: e.target.value ? Number(e.target.value) : null })}
            />
          </Field>
          <Field label="Primary category">
            <select className={inputClass} value={row.category} onChange={(e) => set({ category: e.target.value })}>
              {WORK_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.key}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Additional categories (comma separated)">
            <input
              className={inputClass}
              value={(row.categories ?? []).join(", ")}
              onChange={(e) => set({ categories: list(e.target.value) })}
            />
          </Field>
          <Field label="Project type">
            <input className={inputClass} value={row.project_type ?? ""} onChange={(e) => set({ project_type: e.target.value })} />
          </Field>
          <Field label="Location">
            <input className={inputClass} value={row.location ?? ""} onChange={(e) => set({ location: e.target.value })} />
          </Field>
          <Field label="Services (comma separated)" hint={WORK_SERVICES.join(", ")}>
            <input
              className={inputClass}
              value={(row.services ?? []).join(", ")}
              onChange={(e) => set({ services: list(e.target.value) })}
            />
          </Field>
          <Field label="Cover image URL">
            <input className={inputClass} value={row.cover_image ?? ""} onChange={(e) => set({ cover_image: e.target.value })} />
          </Field>
          <Field label="Hero video (YouTube, Vimeo or MP4)">
            <input className={inputClass} value={row.hero_video ?? ""} onChange={(e) => set({ hero_video: e.target.value })} />
          </Field>
        </div>

        <h3 className="text-eyebrow mt-8">Case study sections</h3>
        <div className="mt-3 grid gap-4">
          {CASE_SECTIONS.map((s) => (
            <div key={s.key}>
              <label className="flex items-center gap-3 text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={(row.sections ?? {})[s.key] !== false}
                  onChange={(e) => set({ sections: { ...(row.sections ?? {}), [s.key]: e.target.checked } })}
                />
                {s.label}
              </label>
              <textarea
                rows={3}
                className={`${inputClass} mt-2`}
                value={((row as any)[s.field] as string) ?? ""}
                onChange={(e) => set({ [s.field]: e.target.value } as any)}
              />
            </div>
          ))}
        </div>

        <h3 className="text-eyebrow mt-8">Credits</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {CREDIT_ROLES.map((role) => (
            <Field key={role} label={role}>
              <input
                className={inputClass}
                value={(row.credits ?? {})[role] ?? ""}
                onChange={(e) => {
                  const credits = { ...(row.credits ?? {}) };
                  if (e.target.value) credits[role] = e.target.value;
                  else delete credits[role];
                  set({ credits });
                }}
              />
            </Field>
          ))}
        </div>

        <h3 className="text-eyebrow mt-8">Publishing</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <Field label="Visibility">
            <select className={inputClass} value={row.visibility} onChange={(e) => set({ visibility: e.target.value as any })}>
              {VISIBILITIES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Featured order">
            <input
              type="number"
              className={inputClass}
              value={row.featured_order}
              onChange={(e) => set({ featured_order: Number(e.target.value) })}
            />
          </Field>
          <Field label="Sort order">
            <input
              type="number"
              className={inputClass}
              value={row.sort_order}
              onChange={(e) => set({ sort_order: Number(e.target.value) })}
            />
          </Field>
          <div className="flex items-end gap-6">
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" checked={row.featured} onChange={(e) => set({ featured: e.target.checked })} /> Featured
            </label>
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" checked={row.published} onChange={(e) => set({ published: e.target.checked })} /> Published
            </label>
          </div>
          <Field label="SEO title">
            <input className={inputClass} value={row.seo_title ?? ""} onChange={(e) => set({ seo_title: e.target.value })} />
          </Field>
          <Field label="SEO description">
            <input className={inputClass} value={row.seo_description ?? ""} onChange={(e) => set({ seo_description: e.target.value })} />
          </Field>
        </div>

        <div className="sticky bottom-0 mt-8 flex flex-wrap gap-3 border-t border-border bg-background py-4">
          <Button onClick={() => onSave(row)}>Save</Button>
          {row.id ? (
            <>
              <Link
                to="/work/$slug"
                params={{ slug: row.slug }}
                className="inline-flex items-center gap-2 rounded-[10px] border border-border px-5 py-3 text-[13px]"
              >
                <Eye className="h-4 w-4" /> Preview
              </Link>
              <button
                type="button"
                onClick={() => onDelete(row.id)}
                className="ml-auto inline-flex items-center gap-2 rounded-[10px] border border-border px-5 py-3 text-[13px] text-destructive"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </>
          ) : null}
        </div>

        {row.id ? <MediaManager projectId={row.id} onCover={(url) => onSave({ id: row.id, cover_image: url })} /> : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Media manager                                                        */
/* ------------------------------------------------------------------ */

function MediaManager({ projectId, onCover }: { projectId: string; onCover: (url: string) => void }) {
  const qc = useQueryClient();
  const key = ["work", "media", projectId];
  const { data: items = [] } = useQuery({
    queryKey: key,
    queryFn: async (): Promise<ProjectMedia[]> => {
      const { data, error } = await mediaTable().select("*").eq("project_id", projectId).order("sort_order");
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
  const [bulk, setBulk] = useState("");
  const [uploading, setUploading] = useState(false);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: key });
    qc.invalidateQueries({ queryKey: ["work"] });
  };

  const add = useMutation({
    mutationFn: async (rows: Partial<ProjectMedia>[]) => {
      const { error } = await mediaTable().insert(rows);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      invalidate();
      setBulk("");
      toast.success("Media added");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<ProjectMedia> }) => {
      const { error } = await mediaTable().update(patch).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await mediaTable().delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const rows: Partial<ProjectMedia>[] = [];
      for (const [i, file] of Array.from(files).entries()) {
        const path = `${projectId}/${Date.now()}-${slugify(file.name)}`;
        const { error } = await supabase.storage.from("media").upload(path, file, { upsert: true });
        if (error) throw new Error(error.message);
        const { data } = supabase.storage.from("media").getPublicUrl(path);
        rows.push({
          project_id: projectId,
          type: file.type.startsWith("video") ? "video" : "image",
          url: data.publicUrl,
          filename: file.name,
          alt: file.name.replace(/\.[a-z0-9]+$/i, ""),
          layout: "half",
          sort_order: items.length + i + 1,
        });
      }
      await add.mutateAsync(rows);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  function move(item: ProjectMedia, dir: -1 | 1) {
    const idx = items.findIndex((i) => i.id === item.id);
    const swap = items[idx + dir];
    if (!swap) return;
    update.mutate({ id: item.id, patch: { sort_order: swap.sort_order } });
    update.mutate({ id: swap.id, patch: { sort_order: item.sort_order } });
  }

  return (
    <section className="mt-10 border-t border-border pt-8">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-eyebrow">Media ({items.length})</h3>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-border px-4 py-2.5 text-[13px]">
          <ImagePlus className="h-4 w-4" />
          {uploading ? "Uploading…" : "Upload"}
          <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => upload(e.target.files)} />
        </label>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className={inputClass}
          placeholder="Paste image or video URLs, one per line"
          value={bulk}
          onChange={(e) => setBulk(e.target.value)}
        />
        <Button
          variant="outline"
          onClick={() =>
            add.mutate(
              bulk
                .split(/[\n,]/)
                .map((s) => s.trim())
                .filter(Boolean)
                .map((url, i) => ({
                  project_id: projectId,
                  type: /youtube|vimeo|\.mp4($|\?)/i.test(url) ? "video" : "image",
                  url,
                  layout: "half",
                  sort_order: items.length + i + 1,
                })) as Partial<ProjectMedia>[],
            )
          }
        >
          Add
        </Button>
      </div>

      <ul className="mt-5 space-y-3">
        {items.map((m) => (
          <li key={m.id} className="grid gap-3 rounded-[10px] border border-border p-3 md:grid-cols-[80px_1fr_auto]">
            <div className="h-16 w-20 overflow-hidden rounded-[6px] border border-border bg-elevated">
              {m.type === "image" ? <img src={m.url} alt="" className="h-full w-full object-cover" /> : null}
            </div>
            <div className="grid gap-2">
              <input
                className={inputClass}
                placeholder="Alt text"
                defaultValue={m.alt ?? ""}
                onBlur={(e) => update.mutate({ id: m.id, patch: { alt: e.target.value } })}
              />
              <input
                className={inputClass}
                placeholder="Caption"
                defaultValue={m.caption ?? ""}
                onBlur={(e) => update.mutate({ id: m.id, patch: { caption: e.target.value } })}
              />
              <select
                className={inputClass}
                value={m.layout}
                onChange={(e) => update.mutate({ id: m.id, patch: { layout: e.target.value as any } })}
              >
                {MEDIA_LAYOUTS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-row gap-2 md:flex-col">
              <button type="button" aria-label="Move up" onClick={() => move(m, -1)} className="grid h-9 w-9 place-items-center border border-border">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button type="button" aria-label="Move down" onClick={() => move(m, 1)} className="grid h-9 w-9 place-items-center border border-border">
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Set as cover"
                onClick={() => onCover(m.url)}
                className="grid h-9 w-9 place-items-center border border-border text-gold"
              >
                <Star className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Delete media"
                onClick={() => remove.mutate(m.id)}
                className="grid h-9 w-9 place-items-center border border-border text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
