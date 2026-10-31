import { useEffect, useRef } from "react";
import { altFor, getAsset, getSet, src } from "@/lib/film/portfolio";

/** Accessible full-image viewer built on the native <dialog> (focus trap + Esc for free). */
export function Lightbox({ ids, index, onClose, onIndex }: { ids: string[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = index !== null;
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onIndex((index! + 1) % ids.length);
      if (e.key === "ArrowLeft") onIndex((index! - 1 + ids.length) % ids.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, ids.length, onIndex]);

  const id = open ? ids[index!]! : null;
  const a = id ? getAsset(id) : null;
  return (
    <dialog
      ref={ref}
      aria-label="Photograph viewer"
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-[#090909]/96 p-0 text-[var(--film-paper)] backdrop:bg-black/80"
    >
      {a ? (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-3 md:px-8">
            <p className="text-[11.5px] uppercase tracking-[0.2em] text-[var(--film-muted)]">{getSet(a.set)?.name} · {index! + 1} / {ids.length}</p>
            <button onClick={onClose} className="min-h-[44px] min-w-[44px] text-[12px] uppercase tracking-[0.2em] hover:text-[var(--film-gold)]" aria-label="Close viewer">Close ✕</button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
            <img src={src(a.id, 1600)} alt={altFor(a)} className="max-h-full max-w-full object-contain" />
            <button onClick={() => onIndex((index! - 1 + ids.length) % ids.length)} aria-label="Previous photograph" className="absolute left-1 top-1/2 h-12 w-12 -translate-y-1/2 text-2xl hover:text-[var(--film-gold)] md:left-6">‹</button>
            <button onClick={() => onIndex((index! + 1) % ids.length)} aria-label="Next photograph" className="absolute right-1 top-1/2 h-12 w-12 -translate-y-1/2 text-2xl hover:text-[var(--film-gold)] md:right-6">›</button>
          </div>
          <div className="h-6" />
        </div>
      ) : null}
    </dialog>
  );
}
