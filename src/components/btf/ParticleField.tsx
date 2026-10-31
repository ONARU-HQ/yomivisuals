import { useEffect, useRef } from "react";

/** Original generative piece for the Lab: a drifting field that leans toward the pointer. 2D canvas, no WebGL. */
export function ParticleField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    const COUNT = small ? 60 : 130;
    let w = 0, h = 0, raf = 0, visible = false;
    const pt = { x: -999, y: -999 };
    const ps = Array.from({ length: COUNT }, () => ({ x: Math.random(), y: Math.random(), vx: 0, vy: 0, s: Math.random() * 1.4 + 0.4, p: Math.random() * 6.28 }));
    const resize = () => {
      const r = cv.getBoundingClientRect(); const d = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height; cv.width = w * d; cv.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        const ang = Math.sin(p.x * 3 + t / 4000) + Math.cos(p.y * 3 + p.p + t / 5000);
        p.vx += Math.cos(ang) * 0.00006; p.vy += Math.sin(ang) * 0.00006;
        const dx = pt.x - p.x * w, dy = pt.y - p.y * h, d2 = dx * dx + dy * dy;
        if (d2 < 22000) { p.vx += (dx / w) * 0.0009; p.vy += (dy / h) * 0.0009; }
        p.vx *= 0.97; p.vy *= 0.97; p.x = (p.x + p.vx + 1) % 1; p.y = (p.y + p.vy + 1) % 1;
      }
      for (let i = 0; i < ps.length; i++) {
        const a = ps[i]!;
        ctx.fillStyle = "rgba(198,165,106,0.85)"; ctx.beginPath(); ctx.arc(a.x * w, a.y * h, a.s, 0, 6.283); ctx.fill();
        for (let j = i + 1; j < ps.length; j++) {
          const b = ps[j]!; const dx = (a.x - b.x) * w, dy = (a.y - b.y) * h; const dd = dx * dx + dy * dy;
          if (dd < 5200) { ctx.strokeStyle = `rgba(245,241,233,${0.13 * (1 - dd / 5200)})`; ctx.beginPath(); ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(b.x * w, b.y * h); ctx.stroke(); }
        }
      }
    };
    const loop = (t: number) => { if (visible) draw(t); raf = requestAnimationFrame(loop); };
    resize();
    draw(0);
    const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; });
    io.observe(cv);
    const ro = new ResizeObserver(() => { resize(); if (reduced) draw(0); });
    ro.observe(cv);
    const move = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); pt.x = e.clientX - r.left; pt.y = e.clientY - r.top; };
    const leave = () => { pt.x = pt.y = -999; };
    if (!reduced) { cv.addEventListener("pointermove", move); cv.addEventListener("pointerleave", leave); raf = requestAnimationFrame(loop); }
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); cv.removeEventListener("pointermove", move); cv.removeEventListener("pointerleave", leave); };
  }, []);
  return <canvas ref={ref} className={className} aria-hidden />;
}
