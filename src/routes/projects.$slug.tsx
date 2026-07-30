import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { projectQuery, projectsQuery, coverFor, imageFor } from "@/lib/cms";
import { Container, Section, TextLink, Eyebrow, ButtonLink } from "@/components/site/ui";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ context, params }) => {
    const project = await context.queryClient.ensureQueryData(projectQuery(params.slug));
    if (!project) throw notFound();
    await context.queryClient.ensureQueryData(projectsQuery);
    return { project };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Project unavailable — Yomi Visuals" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.project;
    const title = p.seo_title || `${p.title} — Yomi Visuals`;
    const description = p.seo_description || p.description || "A Yomi Visuals case study.";
    const url = `https://yomivisuals.lovable.app/projects/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: p.title,
            about: p.industry,
            creator: { "@type": "Organization", name: "Yomi Visuals" },
            description,
          }),
        },
      ],
    };
  },
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useParams();
  const { data: project } = useSuspenseQuery(projectQuery(slug));
  const { data: all } = useSuspenseQuery(projectsQuery);
  if (!project) return null;

  const others = all.filter((p) => p.slug !== slug).slice(0, 2);
  const gallery = project.images.length ? project.images : [0, 1, 2, 3].map((i) => imageFor(project.slug, i + 1));

  return (
    <>
      <div className="relative h-[60svh] min-h-[420px] w-full overflow-hidden md:h-[76svh]">
        <img src={coverFor(project)} alt={project.title} className="h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/30" />
        <Container className="absolute inset-x-0 bottom-0 pb-12 md:pb-16">
          <Eyebrow>{project.industry} · {project.location}</Eyebrow>
          <h1 className="text-display mt-4 max-w-4xl text-[clamp(2.2rem,6.5vw,4.8rem)]">{project.title}</h1>
        </Container>
      </div>

      <Container className="py-14 md:py-20">
        <dl className="grid gap-8 border-b border-border pb-12 sm:grid-cols-3">
          <div>
            <dt className="text-eyebrow">Client</dt>
            <dd className="mt-2.5 text-[15px]">{project.client}</dd>
          </div>
          <div>
            <dt className="text-eyebrow">Services</dt>
            <dd className="mt-2.5 text-[15px]">{project.services.join(", ")}</dd>
          </div>
          <div>
            <dt className="text-eyebrow">Year</dt>
            <dd className="mt-2.5 text-[15px]">
              {project.project_date ? new Date(project.project_date).getFullYear() : "—"}
            </dd>
          </div>
        </dl>

        <div className="grid gap-12 py-14 md:grid-cols-2 md:gap-16">
          {[
            ["The Challenge", project.challenge],
            ["The Solution", project.solution],
          ].map(([label, body]) =>
            body ? (
              <div key={label as string}>
                <Eyebrow>{label as string}</Eyebrow>
                <p className="mt-4 text-[16px] leading-relaxed text-subtle">{body}</p>
              </div>
            ) : null,
          )}
        </div>

        {project.results ? (
          <div className="panel p-8 md:p-12">
            <Eyebrow>Results</Eyebrow>
            <p className="text-display mt-4 max-w-3xl text-[clamp(1.4rem,3.4vw,2.4rem)] leading-[1.15]">
              {project.results}
            </p>
          </div>
        ) : null}

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {gallery.map((src, i) => (
            <div key={i} className="overflow-hidden rounded-[14px] border border-border">
              <img src={src} alt={`${project.title} image ${i + 1}`} loading="lazy" className="w-full object-cover" />
            </div>
          ))}
        </div>
      </Container>

      <Section className="border-t border-border">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-display text-[clamp(1.6rem,4vw,2.6rem)]">Next projects</h2>
          <TextLink to="/projects">All work</TextLink>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {others.map((p, i) => (
            <Link
              key={p.id}
              to="/projects/$slug"
              params={{ slug: p.slug }}
              className="image-reveal block overflow-hidden rounded-[14px] border border-border"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img src={coverFor(p, i)} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <p className="text-[12px] text-muted-foreground">{p.client}</p>
                <h3 className="mt-1.5 text-[16px] font-medium tracking-tight">{p.title}</h3>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12">
          <ButtonLink to="/book">Start a project</ButtonLink>
        </div>
      </Section>
    </>
  );
}
