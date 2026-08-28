import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { projectQuery, projectsQuery, coverFor, imageFor } from "@/lib/cms";
import { Container, Eyebrow, ButtonLink } from "@/components/site/ui";

export const Route = createFileRoute("/work/$slug")({
  loader: async ({ context, params }) => {
    const project = await context.queryClient.ensureQueryData(projectQuery(params.slug));
    if (!project) throw notFound();
    await context.queryClient.ensureQueryData(projectsQuery);
    return { project };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Project unavailable — Yomi Visuals" }, { name: "robots", content: "noindex" }],
      };
    }
    const p = loaderData.project;
    const title = p.seo_title || `${p.title} — ${p.client ?? "Yomi Visuals"}`;
    const description =
      p.seo_description || p.description || `A creative production case study by Yomi Visuals for ${p.client ?? "an ambitious brand"}.`;
    const url = `https://yomivisuals.lovable.app/work/${params.slug}`;
    const image = p.og_image || p.cover_image || undefined;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image?.startsWith("https://")
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: p.title,
            description,
            creator: { "@type": "Organization", name: "Yomi Visuals" },
          }),
        },
      ],
    };
  },
  component: CaseStudy,
});

function CaseStudy() {
  const { slug } = Route.useParams();
  const { data: project } = useSuspenseQuery(projectQuery(slug));
  const { data: all } = useSuspenseQuery(projectsQuery);
  if (!project) return null;

  const index = all.findIndex((p) => p.slug === slug);
  const next = all[(index + 1) % all.length];
  const year = project.project_date ? new Date(project.project_date).getFullYear() : null;
  const gallery = project.images?.length ? project.images : [0, 1, 2, 3].map((i) => imageFor(project.slug, i + 1));
  const credits: Record<string, string> =
    project.credits && typeof project.credits === "object" && !Array.isArray(project.credits)
      ? (project.credits as Record<string, string>)
      : {};

  const chapters = [
    ["The Brief", project.description],
    ["The Idea", project.challenge],
    ["The Direction", project.solution],
    ["The Production", project.results],
  ].filter(([, body]) => Boolean(body)) as [string, string][];

  return (
    <article>
      {/* Hero */}
      <header className="relative h-[68svh] min-h-[440px] w-full overflow-hidden md:h-[86svh]">
        <img
          src={coverFor(project)}
          alt={`${project.title} — hero image`}
          className="h-full w-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
        <Container className="absolute inset-x-0 bottom-0 pb-12 md:pb-20">
          <Eyebrow>{project.client ?? "Yomi Visuals"}</Eyebrow>
          <h1 className="text-display mt-4 max-w-4xl text-[clamp(2.1rem,7vw,5rem)]">{project.title}</h1>
        </Container>
      </header>

      {/* Metadata */}
      <Container className="py-10 md:py-16">
        <dl className="grid grid-cols-2 gap-8 border-b border-border pb-10 md:grid-cols-4">
          {[
            ["Client", project.client ?? "—"],
            ["Category", project.industry ?? "Production"],
            ["Year", year ? String(year) : "—"],
            ["Location", project.location ?? "Lagos, Nigeria"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-eyebrow">{label}</dt>
              <dd className="mt-2.5 text-[15px]">{value}</dd>
            </div>
          ))}
        </dl>

        {/* Chapters */}
        <div className="divide-y divide-border">
          {chapters.map(([label, body]) => (
            <section key={label} className="grid gap-5 py-10 md:grid-cols-[1fr_1.7fr] md:gap-16 md:py-14">
              <h2 className="text-eyebrow md:pt-2">{label}</h2>
              <p className="text-serif text-[clamp(1.05rem,2.6vw,1.5rem)] leading-[1.5] normal-case text-subtle">
                {body}
              </p>
            </section>
          ))}
        </div>
      </Container>

      {/* The work */}
      <section aria-label="The work" className="border-t border-border">
        <Container className="py-12 md:py-20">
          <Eyebrow>The Work</Eyebrow>
          <div className="mt-8 grid gap-4 md:grid-cols-12 md:gap-6">
            {gallery.map((src, i) => (
              <figure
                key={i}
                className={`overflow-hidden border border-border ${i % 3 === 0 ? "md:col-span-12" : "md:col-span-6"}`}
              >
                <img
                  src={src}
                  alt={`${project.title} — image ${i + 1}`}
                  loading="lazy"
                  className="w-full object-cover"
                />
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* Deliverables + credits */}
      <section className="border-t border-border">
        <Container className="grid gap-12 py-12 md:grid-cols-2 md:gap-16 md:py-20">
          <div>
            <Eyebrow>The Deliverables</Eyebrow>
            <ul className="mt-6 flex flex-wrap gap-2">
              {(project.services?.length ? project.services : ["Photography", "Film", "Social", "Campaign assets"]).map(
                (s) => (
                  <li key={s} className="border border-border px-3.5 py-2 text-[12.5px] text-muted-foreground">
                    {s}
                  </li>
                ),
              )}
            </ul>
          </div>
          <div>
            <Eyebrow>Credits</Eyebrow>
            <dl className="mt-6 divide-y divide-border">
              {(Object.keys(credits).length
                ? Object.entries(credits)
                : ([
                    ["Creative Direction", "Yomi Visuals"],
                    ["Production", "YV Production"],
                    ["Post-Production", "YV Production"],
                  ] as [string, string][])
              ).map(([role, who]) => (
                <div key={role} className="flex items-baseline justify-between gap-6 py-3">
                  <dt className="text-[12.5px] uppercase tracking-[0.14em] text-muted-foreground">{role}</dt>
                  <dd className="text-right text-[13.5px]">{String(who)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* Next project */}
      {next && next.slug !== slug ? (
        <section className="border-t border-border">
          <Link to="/work/$slug" params={{ slug: next.slug }} className="image-reveal group block">
            <div className="relative h-[52svh] min-h-[340px] w-full overflow-hidden">
              <img
                src={coverFor(next, 2)}
                alt={next.title}
                loading="lazy"
                className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <Container className="absolute inset-x-0 bottom-0 pb-10 md:pb-14">
                <Eyebrow>Next Project</Eyebrow>
                <h2 className="text-display mt-3 flex flex-wrap items-center gap-3 text-[clamp(1.6rem,5vw,3rem)]">
                  {next.title}
                  <ArrowUpRight className="h-6 w-6 text-gold" />
                </h2>
              </Container>
            </div>
          </Link>
        </section>
      ) : null}

      <Container className="flex flex-col gap-4 py-14 sm:flex-row sm:items-center md:py-20">
        <ButtonLink to="/start-a-project">Start a project</ButtonLink>
        <Link
          to="/work"
          className="tap inline-flex items-center justify-center gap-2 border border-border-strong px-6 py-3.5 text-[12px] uppercase tracking-[0.16em]"
        >
          View all work
        </Link>
      </Container>
    </article>
  );
}
