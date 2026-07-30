import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { projectsQuery, coverFor } from "@/lib/cms";
import { Container, PageHero, Reveal } from "@/components/site/ui";

export const Route = createFileRoute("/projects")({
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQuery),
  head: () => ({
    meta: [
      { title: "Work & Case Studies — Yomi Visuals" },
      {
        name: "description",
        content:
          "Campaigns, brand films and identities built by Yomi Visuals for fashion, corporate, hospitality and technology brands across Nigeria.",
      },
      { property: "og:title", content: "Work & Case Studies — Yomi Visuals" },
      { property: "og:description", content: "Selected creative agency case studies from Yomi Visuals, Lagos." },
      { property: "og:url", content: "https://yomivisuals.lovable.app/projects" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/projects" }],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const [filter, setFilter] = useState("All");

  const industries = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.industry).filter(Boolean) as string[]))],
    [projects],
  );
  const visible = filter === "All" ? projects : projects.filter((p) => p.industry === filter);

  return (
    <>
      <PageHero
        eyebrow="Selected Work"
        title="Case studies, not a showreel."
        body="Every project below started with a business problem. The work is what solved it."
      />

      <Container className="py-10 md:py-14">
        <div className="mb-10 flex flex-wrap gap-2">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setFilter(ind)}
              className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${
                filter === ind
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border text-subtle hover:bg-elevated"
              }`}
            >
              {ind}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {visible.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 80}>
              <Link
                to="/projects/$slug"
                params={{ slug: p.slug }}
                className="image-reveal group block overflow-hidden rounded-[14px] border border-border bg-elevated"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={coverFor(p, i)} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="flex items-start justify-between gap-4 p-6">
                  <div>
                    <p className="text-[12px] text-muted-foreground">
                      {p.client} · {p.industry}
                    </p>
                    <h2 className="mt-1.5 text-[17px] font-medium tracking-tight">{p.title}</h2>
                    <p className="mt-2 text-[13px] text-muted-foreground">{p.services.join(" · ")}</p>
                  </div>
                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
