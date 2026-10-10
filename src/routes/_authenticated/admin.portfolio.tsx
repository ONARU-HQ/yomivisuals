import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Eye, EyeOff, Star, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button, Field, inputClass } from "@/components/site/ui";
import { IMAGE_PROJECT_TYPES, MARKETING_USES, imageProjectType } from "@/lib/image-library";
import {
  PORTFOLIO_CATEGORIES,
  PRIORITIES,
  portfolioAdminQuery,
  focalStyle,
  type PortfolioImage,
} from "@/lib/portfolio";

export const Route = createFileRoute("/_authenticated/admin/portfolio")({
  head: () => ({ meta: [{ title: "Image Library Management — Yomi Visuals" }, { name: "description", content: "Manage project-type groups and marketing-use assignments in the Yomi Visuals image library." }, { property: "og:title", content: "Image Library Management — Yomi Visuals" }, { property: "og:description", content: "Manage image groups and marketing assignments." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: AdminPortfolio,
});

const table = () => (supabase as any).from("portfolio_images");

function AdminPortfolio() {
  const qc = useQueryClient();
  const { data: images = [], isLoading } = useQuery(portfolioAdminQuery);
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<PortfolioImage | null>(null);
  const [adding, setAdding] = useState(false);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "portfolio_images"] });
    qc.invalidateQueries({ queryKey: ["portfolio_images"] });
  };

  const update = useMutation({
    mutationFn: async ({ ids, patch }: { ids: string[]; patch: Record<string, unknown> }) => {
      const { error } = await table().update(patch).in("id", ids);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      invalidate();
      toast.success("Library updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await table().delete().in("id", ids);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      invalidate();
      setSelected([]);
      toast.success("Removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const create = useMutation({
    mutationFn: async (row: Record<string, unknown>) => {
      const { error } = await table().insert(row);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      invalidate();
      setAdding(false);
      toast.success("Image added");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const visible = useMemo(
    () => (category === "All" ? images : images.filter((i) => imageProjectType(i) === category)),
    [images, category],
  );

  const stats = useMemo(
    () => ({
      total: images.length,
      hero: images.filter((i) => i.hero).length,
      featured: images.filter((i) => i.featured).length,
      hidden: images.filter((i) => !i.active).length,
    }),
    [images],
  );

  function move(img: PortfolioImage, dir: -1 | 1) {
    const ordered = [...images].sort((a, b) => a.sort_order - b.sort_order);
    const idx = ordered.findIndex((i) => i.id === img.id);
    const swap = ordered[idx + dir];
    if (!swap) return;
    update.mutate({ ids: [img.id], patch: { sort_order: swap.sort_order } });
    update.mutate({ ids: [swap.id], patch: { sort_order: img.sort_order } });
  }

  const bulk = (patch: Record<string, unknown>) => {
    if (!selected.length) return toast.error("Select images first");
    update.mutate({ ids: selected, patch });
  };

  return (
    <div>
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-eyebrow">Media</p>
          <h1 className="text-display mt-2 text-3xl">Image library</h1>
          <p className="mt-2 text-[13px] text-muted-foreground">
            {stats.total} images · {stats.hero} in hero · {stats.featured} featured · {stats.hidden} hidden
          </p>
        </div>
        <Button variant="outline" onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4" /> Add image
        </Button>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        {["All", ...IMAGE_PROJECT_TYPES].map((c) => (
          <Button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-3.5 py-1.5 text-[12px] transition-colors ${
              c === category ? "border-border-strong bg-elevated" : "border-border text-muted-foreground"
            }`}
          >
            {c}
          </Button>
        ))}
      </div>

      {selected.length ? (
        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-[12px] border border-border bg-elevated p-3 text-[12.5px]">
          <span className="mr-1 text-muted-foreground">{selected.length} selected</span>
          <select
            className="rounded-full border border-border bg-background px-3 py-1.5"
            defaultValue=""
            onChange={(e) => e.target.value && bulk({ project_type: e.target.value })}
          >
            <option value="">Set project type…</option>
            {IMAGE_PROJECT_TYPES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select aria-label="Assign marketing use" className={inputClass + " max-w-56"} defaultValue="" onChange={e => {
            if (!e.target.value) return;
            const use = e.target.value;
            for (const image of images.filter(i => selected.includes(i.id))) update.mutate({ ids: [image.id], patch: { marketing_uses: Array.from(new Set([...(image.marketing_uses ?? []), use])) } });
          }}><option value="">Add marketing use…</option>{MARKETING_USES.map(use => <option key={use}>{use}</option>)}</select>
          <select
            className="rounded-full border border-border bg-background px-3 py-1.5"
            defaultValue=""
            onChange={(e) => e.target.value && bulk({ priority: e.target.value, featured: e.target.value !== "standard" })}
          >
            <option value="">Set priority…</option>
            {PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <button className="rounded-full border border-border px-3 py-1.5" onClick={() => bulk({ homepage: true })}>
            Show on homepage
          </button>
          <button className="rounded-full border border-border px-3 py-1.5" onClick={() => bulk({ homepage: false })}>
            Remove from homepage
          </button>
          <button className="rounded-full border border-border px-3 py-1.5" onClick={() => bulk({ active: false })}>
            Hide
          </button>
          <button className="rounded-full border border-border px-3 py-1.5" onClick={() => bulk({ active: true })}>
            Show
          </button>
          <button
            className="rounded-full border border-border px-3 py-1.5 text-destructive"
            onClick={() => confirm(`Delete ${selected.length} image(s)?`) && remove.mutate(selected)}
          >
            Delete
          </button>
          <button className="ml-auto text-muted-foreground" onClick={() => setSelected([])}>
            Clear
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <p className="py-20 text-center text-[13px] text-muted-foreground">Loading library…</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {visible.map((img) => {
            const isSel = selected.includes(img.id);
            return (
              <div
                key={img.id}
                className={`overflow-hidden rounded-[12px] border bg-elevated ${
                  isSel ? "border-foreground" : "border-border"
                } ${img.active ? "" : "opacity-50"}`}
              >
                <button
                  className="relative block aspect-[3/4] w-full"
                  onClick={() =>
                    setSelected((s) => (isSel ? s.filter((x) => x !== img.id) : [...s, img.id]))
                  }
                >
                  <img
                    src={img.thumb_url ?? img.url}
                    alt={img.title}
                    loading="lazy"
                    style={focalStyle(img)}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-2 top-2 flex gap-1">
                    {img.hero ? <Tag>Hero {img.hero_order}</Tag> : null}
                    {img.homepage ? <Tag>Home</Tag> : null}
                    {img.priority !== "standard" ? <Tag>{img.priority}</Tag> : null}
                  </span>
                  {isSel ? <span className="absolute inset-0 ring-2 ring-inset ring-foreground" /> : null}
                </button>
                <div className="p-3">
                  <p className="truncate text-[12.5px] font-medium tracking-tight">{imageProjectType(img)} · {images.indexOf(img) + 1}</p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {img.orientation} · {(img.marketing_uses ?? []).join(", ") || "No marketing use assigned"}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-1">
                    <IconBtn label="Move up" onClick={() => move(img, -1)}>
                      <ArrowUp className="h-3.5 w-3.5" />
                    </IconBtn>
                    <IconBtn label="Move down" onClick={() => move(img, 1)}>
                      <ArrowDown className="h-3.5 w-3.5" />
                    </IconBtn>
                    <IconBtn
                      label="Toggle featured"
                      onClick={() =>
                        update.mutate({
                          ids: [img.id],
                          patch: { featured: !img.featured, priority: img.featured ? "standard" : "featured" },
                        })
                      }
                    >
                      <Star className={`h-3.5 w-3.5 ${img.featured ? "fill-current" : ""}`} />
                    </IconBtn>
                    <IconBtn
                      label="Toggle visibility"
                      onClick={() => update.mutate({ ids: [img.id], patch: { active: !img.active } })}
                    >
                      {img.active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </IconBtn>
                    <IconBtn
                      label="Delete"
                      onClick={() => confirm("Delete this image?") && remove.mutate([img.id])}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </IconBtn>
                    <button
                      onClick={() => setEditing(img)}
                      className="ml-auto text-[11.5px] text-subtle underline-offset-4 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing ? (
        <EditPanel
          img={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            update.mutate({ ids: [editing.id], patch });
            setEditing(null);
          }}
        />
      ) : null}

      {adding ? (
        <AddPanel
          onClose={() => setAdding(false)}
          onSave={(row) =>
            create.mutate({ ...row, sort_order: (images.at(-1)?.sort_order ?? 0) + 1 })
          }
        />
      ) : null}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-background/85 px-2 py-0.5 text-[10px] uppercase tracking-[0.1em]">{children}</span>
  );
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className="rounded-[8px] border border-border p-1.5 text-subtle transition-colors hover:bg-background hover:text-foreground"
    >
      {children}
    </button>
  );
}

function Panel({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-background/70" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto border-l border-border bg-background p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-medium tracking-tight">{title}</h2>
          <button onClick={onClose} className="text-[12.5px] text-muted-foreground">
            Close
          </button>
        </div>
        <div className="mt-6 space-y-4">{children}</div>
      </div>
    </div>
  );
}

function EditPanel({
  img,
  onClose,
  onSave,
}: {
  img: PortfolioImage;
  onClose: () => void;
  onSave: (patch: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState({
    title: img.title,
    category: img.category,
    project_type: imageProjectType(img),
    marketing_uses: img.marketing_uses ?? [],
    tags: img.tags.join(", "),
    priority: img.priority,
    hero: img.hero,
    hero_order: img.hero_order,
    homepage: img.homepage,
    in_portfolio: img.in_portfolio,
    active: img.active,
    focal_x: img.focal_x,
    focal_y: img.focal_y,
    url: img.url,
  });
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Panel title="Edit image" onClose={onClose}>
      <img
        src={img.thumb_url ?? img.url}
        alt={img.title}
        style={{ objectPosition: `${form.focal_x * 100}% ${form.focal_y * 100}%` }}
        className="h-56 w-full rounded-[10px] object-cover"
      />
      <Field label="Title">
        <input className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} />
      </Field>
      <Field label="Project type"><select className={inputClass} value={form.project_type} onChange={e => set("project_type", e.target.value)}>{IMAGE_PROJECT_TYPES.map(type => <option key={type}>{type}</option>)}</select></Field>
      <fieldset className="space-y-3"><legend className="mb-3 text-sm">Marketing uses</legend>{MARKETING_USES.map(use => <label key={use} className="flex items-center gap-3 text-sm"><input type="checkbox" checked={form.marketing_uses.includes(use)} onChange={e => set("marketing_uses", e.target.checked ? [...form.marketing_uses, use] : form.marketing_uses.filter(u => u !== use))} />{use}</label>)}<p className="text-xs text-muted-foreground">Usage assignments do not confirm licensing or model releases.</p></fieldset>
      <Field label="Category">
        <select className={inputClass} value={form.category} onChange={(e) => set("category", e.target.value)}>
          {PORTFOLIO_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Field>
      <Field label="Tags" hint="Comma separated">
        <input className={inputClass} value={form.tags} onChange={(e) => set("tags", e.target.value)} />
      </Field>
      <Field label="Priority">
        <select className={inputClass} value={form.priority} onChange={(e) => set("priority", e.target.value)}>
          {PRIORITIES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label={`Focal X (${Math.round(form.focal_x * 100)}%)`}>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={form.focal_x}
            onChange={(e) => set("focal_x", Number(e.target.value))}
            className="w-full"
          />
        </Field>
        <Field label={`Focal Y (${Math.round(form.focal_y * 100)}%)`}>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={form.focal_y}
            onChange={(e) => set("focal_y", Number(e.target.value))}
            className="w-full"
          />
        </Field>
      </div>
      <Field label="Hero order" hint="Only used when hero is on">
        <input
          type="number"
          className={inputClass}
          value={form.hero_order}
          onChange={(e) => set("hero_order", Number(e.target.value))}
        />
      </Field>
      <div className="space-y-2.5">
        {(
          [
            ["hero", "Use in homepage hero"],
            ["homepage", "Show on homepage grid"],
            ["in_portfolio", "Show in image library"],
            ["active", "Visible on site"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2.5 text-[13px]">
            <input
              type="checkbox"
              checked={Boolean(form[key])}
              onChange={(e) => set(key, e.target.checked)}
              className="h-4 w-4 accent-white"
            />
            {label}
          </label>
        ))}
      </div>
      <Button
        className="w-full"
        onClick={() =>
          onSave({
            ...form,
            featured: form.priority !== "standard",
            tags: form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          })
        }
      >
        Save changes
      </Button>
    </Panel>
  );
}

function AddPanel({ onClose, onSave }: { onClose: () => void; onSave: (row: Record<string, unknown>) => void }) {
  const [form, setForm] = useState({ url: "", title: "", category: "Portraits", project_type: "Portraits", tags: "" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <Panel title="Add image" onClose={onClose}>
      <Field label="Project type"><select className={inputClass} value={form.project_type} onChange={e => set("project_type", e.target.value)}>{IMAGE_PROJECT_TYPES.map(type => <option key={type}>{type}</option>)}</select></Field>
      <p className="text-[12.5px] text-muted-foreground">
        Paste the URL of an image you've uploaded to your media host. It will appear in the archive immediately.
      </p>
      <Field label="Image URL">
        <input className={inputClass} value={form.url} onChange={(e) => set("url", e.target.value)} />
      </Field>
      <Field label="Title">
        <input className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} />
      </Field>
      <Field label="Category">
        <select className={inputClass} value={form.category} onChange={(e) => set("category", e.target.value)}>
          {PORTFOLIO_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Field>
      <Field label="Tags" hint="Comma separated">
        <input className={inputClass} value={form.tags} onChange={(e) => set("tags", e.target.value)} />
      </Field>
      {form.url ? <img src={form.url} alt="" className="h-48 w-full rounded-[10px] object-cover" /> : null}
      <Button
        className="w-full"
        disabled={!form.url}
        onClick={() =>
          onSave({
            url: form.url,
            thumb_url: form.url,
            title: form.title || "Untitled",
            category: form.category,
            project_type: form.project_type,
            tags: form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          })
        }
      >
        Add to library
      </Button>
    </Panel>
  );
}
