import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { Container, Eyebrow } from "@/components/site/ui";
import { MediaCanvas, ProgressiveImage, ProjectVideo } from "@/components/work/MediaCanvas";
import {
  CASE_SECTIONS,
  CATEGORY_TO_PROJECT_TYPE,
  curate,
  projectMediaQuery,
  sectionEnabled,
  tagsOf,
  workCover,
  workProjectQuery,
  workQuery,
  workYear,
  type WorkProject,
} from "@/lib/work";

export const Route = createFileRoute("/work/$slug")({
  loader: async ({ context, params }) => {
    const project = await context.queryClient.ensureQueryData(workProjectQuery(params.slug));
    if (!project || !project.published || project.visibility === "private") throw notFound();
    await Promise.all([
      context.queryClient.ensureQueryData(workQuery),
      context.queryClient.ensureQueryData(projectMediaQuery(project.id)),
    ]);
    return { project };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Project unavailable — Yomi Visuals" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.project;
    const title = p.seo_title || `${p.title} — ${p.client ?? "Yomi Visuals"}`;
    const description =
      p.seo_description ||
      p.description ||
      `A creative production case study by Yomi Visuals for ${p.client ?? "an ambitious brand"}.`;
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
        ...(p.visibility === "unlisted" ? [{ name: "robots", content: "noindex" }] : []),
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
  notFoundComponent: ProjectUnavailable,
  errorComponent: ProjectUnavailable,
  component: CaseStudy,
});

function ProjectUnavailable() {
  return (
    <Container className="grid min-h-[70svh] place-items-center py-20 text-center">
      <div>
        <Eyebrow>Work</Eyebrow>
        <h1 className="text-display mt-4 text-[clamp(1.6rem,6vw,3rem)]">This project is currently unavailable.</h1>
        <Link
          to="/work"
          className="tap mt-8 inline-flex items-center gap-2 border border-border-strong px-6 py-3.5 text-[12px] uppercase tracking-[0.16em]"
        >
          Back to work
        </Link>
      </div>
    </Container>
  );
}

function CaseStudy() {
  const { slug } = Route.useParams();
  const { data: project } = useSuspenseQuery(workProjectQuery(slug));
  const { data: all } = useSuspenseQuery(workQuery);
  const { data: media = [] } = useSuspenseQuery(projectMediaQuery(project?.id));

  if (!project) return <ProjectUnavailable />;
  const p = project as WorkProject;

  const ordered = curate(all.filter((x) => x.slug !== slug));
  const next = ordered[0];
  const year = workYear(p);

  const credits: [string, string][] = Object.entries(p.credits ?? {}).filter(([, v]) => Boolean(v)) as [string, string][];

  const chapters = CASE_SECTIONS.map((s) => {
    const body = (p as any)[s.field] as string | null;
    return sectionEnabled(p, s.key) && body ? ([s.label, body] as [string, string]) : null;
  }).filter(Boolean) as [string, string][];

  const engineType = CATEGORY_TO_PROJECT_TYPE[p.category] ?? "not-sure";

  return (
    <article>
      {/* 01 — Hero */}
      <header className="relative w-full overflow-hidden">
        {p.hero_video ? (
          <div className="bg-black pt-[60px] md:pt-[72px]">
            <ProjectVideo url={p.hero_video} poster={workCover(p)} title={p.title} />
          </div>
        ) : (
          <div className="relative h-[68svh] min-h-[440px] w-full md:h-[86svh]">
            <ProgressiveImage src={workCover(p)} alt={`${p.title} — hero image`} eager className="opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
          </div>
        )}
        <Container className={p.hero_video ? "py-8" : "absolute inset-x-0 bottom-0 pb-12 md:pb-20"}>
          <Eyebrow>{p.client ?? "Yomi Visuals"}</Eyebrow>
          <h1 className="text-display mt-4 max-w-4xl text-[clamp(2.1rem,7vw,5rem)]">{p.title}</h1>
          <p className="mt-3 text-[12.5px] uppercase tracking-[0.16em] text-muted-foreground">
            {tagsOf(p).join(" / ")}
            {year ? ` · ${year}` : ""}
          </p>
        </Container>
      </header>

      {/* 02 — Project information */}
      <Container className="py-10 md:py-16">
        <dl className="grid grid-cols-2 gap-8 border-b border-border pb-10 md:grid-cols-4">
          {[
            ["Client", p.client ?? "—"],
            ["Category", tagsOf(p).join(", ") || "Production"],
            ["Year", year ? String(year) : "—"],
            ["Location", p.location ?? "Lagos, Nigeria"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-eyebrow">{label}</dt>
              <dd className="mt-2.5 text-[15px]">{value}</dd>
            </div>
          ))}
        </dl>

        {p.services?.length ? (
          <div className="border-b border-border py-6">
            <p className="text-eyebrow">Services</p>
            <p className="mt-2.5 text-[15px]">{p.services.join(" / ")}</p>
          </div>
        ) : null}

        {/* 03–08 — Editorial chapters */}
        <div className="divide-y divide-border">
          {chapters.map(([label, body]) => (
            <section key={label} className="grid gap-5 py-10 md:grid-cols-[1fr_1.7fr] md:gap-16 md:py-14">
              <h2 className="text-eyebrow md:pt-2">{label}</h2>
              <p className="text-serif text-[clamp(1.05rem,2.6vw,1.5rem)] leading-[1.5] normal-case text-subtle">{body}</p>
            </section>
          ))}
        </div>
      </Container>

      {/* 07 — The work */}
      {media.length ? (
        <section aria-label="The work" className="border-t border-border">
          <Container className="py-12 md:py-20">
            <Eyebrow>The Work</Eyebrow>
            <div className="mt-8">
              <MediaCanvas items={media} title={p.title} />
            </div>
          </Container>
        </section>
      ) : null}

      {/* 09 — Credits */}
      {credits.length ? (
        <section className="border-t border-border">
          <Container className="py-12 md:py-20">
            <Eyebrow>Credits</Eyebrow>
            <dl className="mt-6 divide-y divide-border md:max-w-2xl">
              {credits.map(([role, who]) => (
                <div key={role} className="flex items-baseline justify-between gap-6 py-3">
                  <dt className="text-[12.5px] uppercase tracking-[0.14em] text-muted-foreground">{role}</dt>
                  <dd className="text-right text-[13.5px]">{String(who)}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      ) : null}

      {/* CTA */}
      <section className="border-t border-border">
        <Container className="py-14 md:py-20">
          <Eyebrow>Next step</Eyebrow>
          <h2 className="text-display mt-4 text-[clamp(1.8rem,6vw,3.4rem)]">Have a project like this?</h2>
          <p className="mt-3 text-[15px] text-muted-foreground">Let's build it.</p>
          <Link
            to="/start-a-project"
            search={{ type: engineType, source: `work:${p.slug}` }}
            className="tap press mt-8 inline-flex items-center gap-2 bg-primary px-7 py-4 text-[12px] uppercase tracking-[0.16em] text-primary-foreground"
          >
            Start a project <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Container>
      </section>

      {/* 10 — Next project */}
      {next ? (
        <section className="border-t border-border">
          <Link to="/work/$slug" params={{ slug: next.slug }} className="image-reveal group block">
            <div className="relative h-[52svh] min-h-[340px] w-full overflow-hidden">
              <ProgressiveImage
                src={workCover(next, 2)}
                alt={next.title}
                className="opacity-60 transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <Container className="absolute inset-x-0 bottom-0 pb-10 md:pb-14">
                <Eyebrow>Next Project</Eyebrow>
                <h2 className="text-display mt-3 flex flex-wrap items-center gap-3 text-[clamp(1.6rem,5vw,3rem)]">
                  {next.title}
                  <ArrowUpRight className="h-6 w-6 text-gold" />
                </h2>
                <p className="mt-2 text-[12.5px] uppercase tracking-[0.14em] text-muted-foreground">
                  {next.client ?? "Yomi Visuals"} · {tagsOf(next)[0]}
                </p>
              </Container>
            </div>
          </Link>
        </section>
      ) : null}

      <Container className="flex flex-col gap-4 py-14 sm:flex-row sm:items-center md:py-20">
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
