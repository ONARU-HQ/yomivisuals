import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Monitor, Smartphone, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/site/ui";
import { templates, templateGroups, type TemplateOverrides } from "@/lib/comms/templates";
import { WATERMARK_OPACITY_RANGE } from "@/lib/comms/brand";
import type { DocumentKind } from "@/lib/comms/documents.server";

export const Route = createFileRoute("/_authenticated/admin/communications")({
  head: () => ({
    meta: [{ title: "Communications — Yomi Visuals" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminCommunications,
});

const documentKinds: DocumentKind[] = ["invoice", "quote", "proposal", "contract"];

function AdminCommunications() {
  const [activeKey, setActiveKey] = useState(templates[0]!.key);
  const [device, setDevice] = useState<"mobile" | "desktop">("desktop");
  const [overrides, setOverrides] = useState<TemplateOverrides>({});
  const [opacity, setOpacity] = useState(WATERMARK_OPACITY_RANGE.default);
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [docKind, setDocKind] = useState<DocumentKind | null>(null);
  const [docError, setDocError] = useState<string | null>(null);
  const [docLoading, setDocLoading] = useState(false);

  const template = useMemo(() => templates.find((t) => t.key === activeKey)!, [activeKey]);

  const html = useMemo(
    () => template.render(template.sample, { ...overrides, watermarkOpacity: opacity }),
    [template, overrides, opacity],
  );

  useEffect(() => setOverrides({}), [activeKey]);
  useEffect(() => () => { if (docUrl) URL.revokeObjectURL(docUrl); }, [docUrl]);

  async function previewDocument(kind: DocumentKind) {
    setDocLoading(true);
    setDocError(null);
    try {
      const { data } = await supabase.auth.getSession();
      const res = await fetch(`/api/documents/${kind}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(data.session?.access_token ? { Authorization: `Bearer ${data.session.access_token}` } : {}),
        },
        body: JSON.stringify({ sample: true, watermarkOpacity: opacity }),
      });
      if (!res.ok) throw new Error(`Preview unavailable (${res.status})`);
      const blob = await res.blob();
      if (docUrl) URL.revokeObjectURL(docUrl);
      setDocUrl(URL.createObjectURL(blob));
      setDocKind(kind);
    } catch (e) {
      setDocError((e as Error).message);
    } finally {
      setDocLoading(false);
    }
  }

  return (
    <div>
      <p className="text-eyebrow">Communication system</p>
      <h1 className="text-display mt-3 text-[clamp(1.8rem,4vw,2.6rem)]">Emails &amp; documents.</h1>
      <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
        Every YV communication is generated from one locked design system — official mark, watermark,
        typography, status language and footer. Edit the words; the brand structure stays intact.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          {templateGroups.map((group) => (
            <div key={group} className="mb-6">
              <p className="text-eyebrow mb-2">{group}</p>
              <div className="flex flex-col gap-0.5">
                {templates
                  .filter((t) => t.group === group)
                  .map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setActiveKey(t.key)}
                      className={`rounded-[10px] px-3 py-2 text-left text-[13px] transition-colors ${
                        t.key === activeKey ? "bg-elevated text-foreground" : "text-subtle hover:text-foreground"
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
              </div>
            </div>
          ))}

          <p className="text-eyebrow mb-2">Documents</p>
          <div className="flex flex-col gap-0.5">
            {documentKinds.map((k) => (
              <button
                key={k}
                onClick={() => previewDocument(k)}
                className={`flex items-center gap-2 rounded-[10px] px-3 py-2 text-left text-[13px] capitalize transition-colors ${
                  docKind === k ? "bg-elevated text-foreground" : "text-subtle hover:text-foreground"
                }`}
              >
                <FileText className="h-3.5 w-3.5" /> {k}
              </button>
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Event</p>
                <p className="mt-1 font-mono text-[13px]">{template.key}</p>
              </div>
              <div className="flex gap-1 rounded-full border border-border p-1">
                {(["mobile", "desktop"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDevice(d)}
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] capitalize ${
                      device === d ? "bg-elevated text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {d === "mobile" ? <Smartphone className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Subject</span>
                <input
                  className="mt-2 w-full rounded-[8px] border border-border bg-transparent px-3 py-2.5 text-[13.5px]"
                  value={overrides.subject ?? template.subject(template.sample)}
                  onChange={(e) => setOverrides((o) => ({ ...o, subject: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">CTA label</span>
                <input
                  className="mt-2 w-full rounded-[8px] border border-border bg-transparent px-3 py-2.5 text-[13.5px]"
                  value={overrides.ctaLabel ?? template.ctaLabel}
                  onChange={(e) => setOverrides((o) => ({ ...o, ctaLabel: e.target.value }))}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Body copy</span>
                <textarea
                  rows={3}
                  placeholder="Leave blank to use the default copy"
                  className="mt-2 w-full rounded-[8px] border border-border bg-transparent px-3 py-2.5 text-[13.5px]"
                  value={overrides.body ?? ""}
                  onChange={(e) => setOverrides((o) => ({ ...o, body: e.target.value || undefined }))}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Watermark opacity — {Math.round(opacity * 100)}%
                </span>
                <input
                  type="range"
                  min={WATERMARK_OPACITY_RANGE.min * 100}
                  max={WATERMARK_OPACITY_RANGE.max * 100}
                  value={opacity * 100}
                  onChange={(e) => setOpacity(Number(e.target.value) / 100)}
                  className="mt-3 w-full accent-foreground"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const w = window.open("", "_blank");
                  w?.document.write(html);
                  w?.document.close();
                }}
              >
                Open in new tab
              </Button>
              <Button type="button" variant="outline" onClick={() => setOverrides({})}>
                Reset copy
              </Button>
            </div>
          </div>

          <div className="mt-6 flex justify-center rounded-[12px] border border-border bg-elevated p-4">
            <iframe
              title="Email preview"
              srcDoc={html}
              className="h-[820px] rounded-[8px] border border-border bg-white"
              style={{ width: device === "mobile" ? 390 : "100%", maxWidth: device === "mobile" ? 390 : 760 }}
            />
          </div>

          {docLoading ? <p className="mt-6 text-[13px] text-muted-foreground">Generating document…</p> : null}
          {docError ? <p className="mt-6 text-[13px] text-destructive">{docError}</p> : null}
          {docUrl ? (
            <div className="mt-6">
              <p className="text-eyebrow mb-3 capitalize">{docKind} preview</p>
              <iframe title="Document preview" src={docUrl} className="h-[900px] w-full rounded-[8px] border border-border bg-white" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
