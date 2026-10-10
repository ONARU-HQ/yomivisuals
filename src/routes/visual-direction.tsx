import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Upload, Sparkles, Download, Square, X } from "lucide-react";
import { Button, ButtonLink, Container, Field, inputClass, PageHero } from "@/components/site/ui";
import { readBriefStream } from "@/lib/visual-brief-stream";

export const Route = createFileRoute("/visual-direction")({
  head: () => ({ meta: [{ title: "AI Visual Direction Brief — Yomi Visuals" }, { name: "description", content: "Turn a reference image and your marketing objective into a personalized creative direction brief with Yomi Visuals." }, { property: "og:title", content: "Visual Direction — Yomi Visuals" }, { property: "og:description", content: "Your inspiration, shaped into a marketing-focused creative brief." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: VisualDirection,
});

function VisualDirection() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [brand, setBrand] = useState("");
  const [goal, setGoal] = useState("");
  const [channel, setChannel] = useState("Social media");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const [thinking, setThinking] = useState("");
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const [stopped, setStopped] = useState(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    if (!file) { setPreview(""); return; }
    const url = URL.createObjectURL(file); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => () => controller.current?.abort(), []);
  function pick(f: File | undefined) {
    setError("");
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type) || f.size > 5 * 1024 * 1024 || !f.size) { setError("Choose a JPG, PNG or WebP image under 5MB."); return; }
    setFile(f);
  }
  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !consent || busy) return;
    setBusy(true); setError(""); setText(""); setThinking(""); setComplete(false); setStopped(false);
    const abort = new AbortController(); controller.current = abort;
    try {
      const form = new FormData(); form.set("image", file); form.set("brand", brand); form.set("goal", goal); form.set("channel", channel);
      const response = await fetch("/api/public/visual-brief", { method: "POST", body: form, signal: abort.signal });
      if (!response.ok) { const payload = await response.json(); throw new Error(payload.message || "The visual brief could not be generated."); }
      if (!response.body) throw new Error("No visual brief was returned.");
      await readBriefStream(response.body, event => {
        if (event.type === "text") setText(t => t + (event.text ?? ""));
        if (event.type === "thinking") setThinking(t => t + (event.text ?? ""));
        if (event.type === "done") setComplete(true);
      });
    } catch (e) { if (abort.signal.aborted) setStopped(true); else setError(e instanceof Error ? e.message : "The brief could not be generated."); }
    finally { setBusy(false); controller.current = null; }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([`${brand} — Visual direction\n${channel}\n\n${text}`], { type: "text/plain" }));
    const a = document.createElement("a"); a.href = url; a.download = "yomi-visuals-direction.txt"; a.click(); URL.revokeObjectURL(url);
  }
  return <>
    <PageHero eyebrow="Creative starting point" title="Your visual direction." body="Bring your inspiration. Make it relevant to your brand." />
    <Container className="py-12 md:py-16">
      <div className="grid gap-12 md:grid-cols-2">
        <form onSubmit={generate} className="min-w-0 space-y-6">
          <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); if (!busy) pick(e.dataTransfer.files[0]); }} className="relative overflow-hidden border border-dashed border-border bg-elevated">
            {preview ? <><img src={preview} alt="Your reference" className="h-72 w-full object-contain" /><Button type="button" variant="ghost" className="absolute right-2 top-2 px-3 py-3" aria-label="Remove reference" disabled={busy} onClick={() => setFile(null)}><X className="h-4 w-4" /></Button></> : <label className="flex min-h-64 cursor-pointer flex-col items-center justify-center gap-4 p-6 text-center"><Upload className="h-6 w-6 text-gold" /><span>Upload a reference image</span><span className="text-xs text-muted-foreground">JPG, PNG or WebP · up to 5MB</span><input aria-label="Reference image" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={busy} onChange={e => pick(e.target.files?.[0])} /></label>}
          </div>
          <Field label="Brand or project"><input required maxLength={120} disabled={busy} value={brand} onChange={e => setBrand(e.target.value)} className={inputClass} placeholder="Your brand" /></Field>
          <Field label="What should the visuals achieve?"><textarea required minLength={10} maxLength={2000} rows={4} disabled={busy} value={goal} onChange={e => setGoal(e.target.value)} className={inputClass} placeholder="A product launch, a new audience, a stronger brand presence…" /></Field>
          <Field label="Primary marketing channel"><select disabled={busy} value={channel} onChange={e => setChannel(e.target.value)} className={inputClass}>{["Social media", "Paid advertising", "Website", "Campaign", "Email"].map(c => <option key={c}>{c}</option>)}</select></Field>
          <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground"><input type="checkbox" required checked={consent} disabled={busy} onChange={e => setConsent(e.target.checked)} className="mt-1" /><span>I have permission to share this image for AI analysis. It will be sent to an AI service, not added to the public library.</span></label>
          {busy ? <Button type="button" variant="outline" onClick={() => controller.current?.abort()}><Square className="h-4 w-4" />Stop generation</Button> : <Button type="submit" disabled={!file || !consent || !brand.trim() || goal.trim().length < 10}><Sparkles className="h-4 w-4" />Generate visual brief</Button>}
          {error ? <p role="alert" className="break-words text-sm text-destructive">{error}</p> : null}
        </form>
        <section aria-label="Visual direction brief" className="min-w-0 border-t border-border pt-6 md:border-t-0 md:border-l md:pl-10 md:pt-0">
          <p className="text-eyebrow">{complete ? "Your creative brief" : stopped ? "Generation stopped — partial brief" : busy ? "Developing your direction…" : "The direction"}</p>
          {!text && !busy ? <p className="mt-8 text-lg text-muted-foreground">A creative starting point for your next campaign.</p> : null}
          {thinking ? <details className="mt-5 text-xs text-muted-foreground"><summary>Creative analysis</summary><p className="mt-3 whitespace-pre-wrap">{thinking}</p></details> : null}
          <div aria-busy={busy} className="mt-8 whitespace-pre-wrap break-words text-sm leading-7">{text}</div>
          {text && !busy ? <div className="mt-8 flex flex-wrap gap-3"><Button variant="outline" onClick={download}><Download className="h-4 w-4" />Download {complete ? "brief" : "partial brief"}</Button><ButtonLink to="/start-a-project">Start a project</ButtonLink></div> : null}
          {complete ? <p className="mt-6 text-xs text-muted-foreground">AI-generated direction, subject to creative review. Reference inspiration does not grant usage rights.</p> : null}
        </section>
      </div>
    </Container>
  </>;
}