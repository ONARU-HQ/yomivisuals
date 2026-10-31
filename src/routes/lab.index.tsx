import { createFileRoute, Link } from "@tanstack/react-router";
import { EXPERIMENTS } from "@/content/lab";
import { PageHead, Main } from "@/components/btf/PageHead";
import { ParticleField } from "@/components/btf/ParticleField";
import { seo } from "@/lib/film/seo";

export const Route = createFileRoute("/lab/")({
  head: () => seo({ title: "The Laboratory | Yomi Visuals", description: "An evolving lab for creative coding, interactive experiences and digital experiments.", path: "/lab" }),
  component: Lab,
});

function Lab() {
  return (
    <Main>
      <div className="relative overflow-hidden">
        <ParticleField className="absolute inset-0 h-full w-full opacity-70" />
        <div className="relative"><PageHead eyebrow="The laboratory" title="What exists beyond the frame?">
          A home for experiments: interactive websites, motion, generative graphics, 3D environments and prototypes. Only finished, working experiments are listed. New ones appear here when they are ready.
        </PageHead></div>
      </div>
      <section className="film-pad mx-auto max-w-[1500px] pb-24" aria-label="Experiments">
        <ul className="grid gap-px bg-white/10 md:grid-cols-2">
          {EXPERIMENTS.map((e) => (
            <li key={e.slug} className="bg-[var(--film-ink)]">
              <Link to="/lab/$slug" params={{ slug: e.slug }} className="group block p-8 transition-colors hover:bg-[var(--film-ink-2)] md:p-12">
                <p className="text-index">EXPERIMENT {e.n} · {e.status.toUpperCase()}</p>
                <h2 className="font-serif text-[clamp(2rem,4vw,3.4rem)] italic group-hover:text-[var(--film-gold)]">{e.title}</h2>
                <p className="mt-3 max-w-md text-[15px] text-[var(--film-muted)]">{e.concept}</p>
                <p className="mt-6 text-[11.5px] uppercase tracking-[0.18em] text-[var(--film-paper)]/60">{e.tech}</p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-[13px] text-[var(--film-muted)]">More experiments will be added as they are finished.</p>
      </section>
    </Main>
  );
}
