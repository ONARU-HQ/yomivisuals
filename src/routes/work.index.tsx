import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { Container, PageHero, Reveal, Eyebrow, ButtonLink } from "@/components/site/ui";
import { SwapFade } from "@/components/motion";
import { ProgressiveImage } from "@/components/work/MediaCanvas";
import { STAGGER } from "@/lib/motion";
import {
  WORK_CATEGORIES,
  WORK_SERVICES,
  categoryForContext,
  curate,
  gridSlot,
  matchesSearch,
  tagsOf,
  workCover,
  workQuery,
  workYear,
} from "@/lib/work";

export const Route = createFileRoute("/work/")({
  validateSearch: (search: Record<string, unknown>): { service?: string; category?: string } => ({
    ...(typeof search.service === "string" ? { service: search.service } : {}),
    ...(typeof search.category === "string" ? { category: search.category } : {}),
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(workQuery),
  head: () => ({
    meta: [
      { title: "Selected Work — Campaigns, Film & Photography | Yomi Visuals" },
      {
        name: "description",
        content:
          "A selection of campaigns, films, photography and visual productions created by Yomi Visuals for ambitious brands.",
      },
      { property: "og:title", content: "Selected Work — Yomi Visuals" },
      {
        property: "og:description",
        content: "Campaigns, films, photography and visual productions created by Yomi Visuals.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://yomivisuals.lovable.app/work" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/work" }],
  }),
  component: WorkArchive,
});

function WorkArchive() {
  const { data: projects } = useSuspenseQuery(workQuery);
  const { service, category } = Route.useSearch();

  const contextCategory = category ?? categoryForContext(service);
  const [filter, setFilter] = useState(contextCategory);
  const [year, setYear] = useState("All");
  const [serviceFilter, setServiceFilter] = useState(service && WORK_SERVICES.includes(service as any) ? service : "All");
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => setFilter(contextCategory), [contextCategory]);
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const categories = useMemo(() => {
    const used = new Set(projects.flatMap(tagsOf));
    return ["All", ...WORK_CATEGORIES.map((c) => c.key).filter((c) => used.has(c))];
  }, [projects]);

  const years = useMemo(() => {
    const set = new Set(projects.map(workYear).filter(Boolean) as number[]);
    return ["All", ...Array.from(set).sort((a, b) => b - a).map(String)];
  }, [projects]);

  const services = useMemo(() => {
    const used = new Set(projects.flatMap((p) => p.services ?? []));
    return ["All", ...WORK_SERVICES.filter((s) => used.has(s))];
  }, [projects]);

  const visible = useMemo(() => {
    const term = q.trim();
    return curate(
      projects.filter((p) => {
        if (filter !== "All" && !tagsOf(p).includes(filter)) return false;
        if (year !== "All" && String(workYear(p) ?? "") !== year) return false;
        if (serviceFilter !== "All" && !(p.services ?? []).includes(serviceFilter)) return false;
        return matchesSearch(p, term);
      }),
    );
  }, [projects, filter, year, serviceFilter, q]);

  const reset = () => {
    setFilter("All");
    setYear("All");
    setServiceFilter("All");
    setQ("");
  };

  const chip = (active: boolean) =>
    `tap press filter-chip shrink-0 whitespace-nowrap border px-4 py-2 text-[11.5px] uppercase tracking-[0.14em] ${
      active ? "border-transparent bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"
    }`;

  return (
    <>
      <PageHero
        eyebrow="The Archive"
        title="Selected work."
        body="A selection of campaigns, films, photography and visual productions created by Yomi Visuals."
      ><div className="flex flex-wrap gap-3"><ButtonLink to="/image-library" variant="outline">Image library</ButtonLink><ButtonLink to="/visual-direction" variant="outline">Create a visual brief</ButtonLink></div></PageHero>

      <Container className="pb-6">
        <div className="sticky top-[60px] z-30 -mx-5 space-y-2 border-b border-border bg-background/95 px-5 py-3 backdrop-blur md:top-[72px] md:-mx-10 md:px-10">
          <div className="flex items-center gap-3">
            <div className="flex flex-1 gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter work by category">
              {categories.map((c) => (
                <button key={c} type="button" onClick={() => setFilter(c)} aria-pressed={filter === c} className={chip(filter === c)}>
                  {c}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search the work archive"
              className="tap press grid h-11 w-11 shrink-0 place-items-center border border-border text-foreground transition-colors duration-[var(--motion-fast)] hover:border-border-strong"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {services.length > 1
              ? services.map((s) => (
                  <button
                    key={`s-${s}`}
                    type="button"
                    onClick={() => setServiceFilter(s)}
                    aria-pressed={serviceFilter === s}
                    className={`tap press shrink-0 whitespace-nowrap border-b px-1 py-1.5 text-[11.5px] uppercase tracking-[0.12em] ${
                      serviceFilter === s ? "border-gold text-foreground" : "border-transparent text-muted-foreground"
                    }`}
                  >
                    {s === "All" ? "All services" : s}
                  </button>
                ))
              : null}
            {years.length > 1
              ? years.map((y) => (
                  <button
                    key={`y-${y}`}
                    type="button"
                    onClick={() => setYear(y)}
                    aria-pressed={year === y}
                    className={`tap press shrink-0 whitespace-nowrap border-b px-1 py-1.5 text-[11.5px] uppercase tracking-[0.12em] ${
                      year === y ? "border-gold text-foreground" : "border-transparent text-muted-foreground"
                    }`}
                  >
                    {y === "All" ? "All years" : y}
                  </button>
                ))
              : null}
          </div>
        </div>
      </Container>

      <Container className="py-10 md:py-14">
        <SwapFade swapKey={`${filter}|${year}|${serviceFilter}|${q.trim()}`}>
          {projects.length === 0 ? (
            <div className="border border-dashed border-border px-6 py-20 text-center">
              <Eyebrow>The archive</Eyebrow>
              <p className="text-headline mt-4 text-[clamp(1.4rem,4vw,2.2rem)]">New work is coming.</p>
              <p className="mt-3 text-[14px] text-muted-foreground">We're currently preparing the next selection.</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="border border-dashed border-border px-6 py-20 text-center">
              <Eyebrow>Nothing here yet</Eyebrow>
              <p className="text-headline mt-4 text-[clamp(1.3rem,4vw,2rem)]">Nothing matched that filter.</p>
              <p className="mt-3 text-[14px] text-muted-foreground">Try another category, or view the full archive.</p>
              <button
                type="button"
                onClick={reset}
                className="tap mt-8 inline-flex items-center gap-2 border border-border-strong px-6 py-3.5 text-[12px] uppercase tracking-[0.16em]"
              >
                View all work
              </button>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-12 md:gap-x-6 md:gap-y-16">
              {visible.map((p, i) => {
                const slot = gridSlot(p, i);
                return (
                  <Reveal key={p.id} delay={(i % 3) * STAGGER.step} className={slot.span}>
                    <Link
                      to="/work/$slug"
                      params={{ slug: p.slug }}
                      className="group block"
                      aria-label={`${p.title} — view case study`}
                    >
                      <div data-cursor="view" className={`media-zoom overflow-hidden border border-border bg-elevated ${slot.ratio}`}>
                        <ProgressiveImage src={workCover(p, i)} alt={p.title} eager={i < 2} />
                      </div>
                      <div className="mt-4 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-eyebrow">{p.client ?? "Yomi Visuals"}</p>
                          <h2 className={`text-headline mt-2 ${slot.large ? "text-[clamp(1.5rem,5vw,2.6rem)]" : "text-[clamp(1.15rem,3.4vw,1.7rem)]"}`}>
                            {p.title}
                          </h2>
                          <p className="mt-2 text-[12.5px] text-muted-foreground">
                            {tagsOf(p).join(" / ")}
                            {workYear(p) ? ` · ${workYear(p)}` : ""}
                          </p>
                          {p.services?.length ? (
                            <p className="mt-1 text-[12px] text-subtle opacity-0 transition-opacity duration-[var(--motion-fast)] group-hover:opacity-100 md:opacity-60">
                              {p.services.slice(0, 3).join(" / ")}
                            </p>
                          ) : null}
                        </div>
                        <ArrowUpRight className="arrow-nudge-diagonal mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-colors duration-[var(--motion-fast)] group-hover:text-gold" />
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </SwapFade>
      </Container>

      {searchOpen ? (
        <div className="confirm-in fixed inset-0 z-[60] flex flex-col bg-background/98 backdrop-blur">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4 md:px-10">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search project, client, category, service, year"
              aria-label="Search the work archive"
              className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="tap grid h-11 w-11 shrink-0 place-items-center border border-border"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6 md:px-10">
            <p className="text-eyebrow">
              {q.trim() ? `${visible.length} result${visible.length === 1 ? "" : "s"}` : "Recent work"}
            </p>
            <ul className="mt-5 divide-y divide-border">
              {visible.slice(0, 12).map((p) => (
                <li key={p.id}>
                  <Link
                    to="/work/$slug"
                    params={{ slug: p.slug }}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-4 py-4"
                  >
                    <div className="h-14 w-20 shrink-0 overflow-hidden border border-border">
                      <ProgressiveImage src={workCover(p)} alt="" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[14px]">{p.title}</p>
                      <p className="truncate text-[12px] text-muted-foreground">
                        {p.client ?? "Yomi Visuals"} · {tagsOf(p)[0]}
                        {workYear(p) ? ` · ${workYear(p)}` : ""}
                      </p>
                    </div>
                    <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
