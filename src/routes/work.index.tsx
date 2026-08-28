import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { projectsQuery, coverFor, type Project } from "@/lib/cms";
import { Container, PageHero, Reveal, Eyebrow } from "@/components/site/ui";
import { SwapFade } from "@/components/motion";
import { STAGGER } from "@/lib/motion";

export const Route = createFileRoute("/work/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQuery),
  head: () => ({
    meta: [
      { title: "Work — Campaigns, Films & Productions | Yomi Visuals" },
      {
        name: "description",
        content:
          "The Yomi Visuals archive: campaigns, commercials, brand films, photography, fashion, product and entertainment productions for ambitious brands.",
      },
      { property: "og:title", content: "Work — Yomi Visuals" },
      { property: "og:description", content: "An archive of creative production work from Yomi Visuals, Lagos." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://yomivisuals.lovable.app/work" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/work" }],
  }),
  component: WorkArchive,
});

function categoryOf(p: Project) {
  return p.industry || p.services?.[0] || "Production";
}

function yearOf(p: Project) {
  return p.project_date ? new Date(p.project_date).getFullYear() : null;
}

function WorkArchive() {
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const [filter, setFilter] = useState("All");
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map(categoryOf).filter(Boolean)))],
    [projects],
  );

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    return projects.filter((p) => {
      const inCategory = filter === "All" || categoryOf(p) === filter;
      if (!inCategory) return false;
      if (!term) return true;
      return [p.title, p.client, categoryOf(p), String(yearOf(p) ?? ""), ...(p.services ?? [])]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term));
    });
  }, [projects, filter, q]);

  return (
    <>
      <PageHero
        eyebrow="The Archive"
        title="Work we made real."
        body="Every project started as an idea and a business problem. Filter the archive, or search by project, client, category or year."
      />

      <Container className="pb-6">
        {/* Filters + search */}
        <div className="sticky top-[60px] z-30 -mx-5 border-b border-border bg-background/95 px-5 py-3 backdrop-blur md:top-[72px] md:-mx-10 md:px-10">
          <div className="flex items-center gap-3">
            <div
              className="flex flex-1 gap-2 overflow-x-auto pb-1"
              role="group"
              aria-label="Filter work by category"
            >
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  aria-pressed={filter === c}
                  className={`tap press filter-chip shrink-0 whitespace-nowrap border px-4 py-2 text-[11.5px] uppercase tracking-[0.14em] ${
                    filter === c
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
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
        </div>
      </Container>

      <Container className="py-10 md:py-14">
        <SwapFade swapKey={`${filter}|${q.trim()}`}>
        {visible.length === 0 ? (
          <div className="border border-dashed border-border px-6 py-20 text-center">
            <Eyebrow>Nothing here yet</Eyebrow>
            <p className="text-headline mt-4 text-[clamp(1.3rem,4vw,2rem)]">Nothing matched that filter.</p>
            <p className="mt-3 text-[14px] text-muted-foreground">
              Try another category, clear the search, or view the full archive.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilter("All");
                setQ("");
              }}
              className="tap mt-8 inline-flex items-center gap-2 border border-border-strong px-6 py-3.5 text-[12px] uppercase tracking-[0.16em]"
            >
              View all work
            </button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-12 md:gap-x-6 md:gap-y-16">
            {visible.map((p, i) => {
              // Editorial rhythm: alternating spans instead of a uniform card grid.
              const span = i % 5 === 0 ? "md:col-span-12" : i % 5 === 3 ? "md:col-span-7" : i % 5 === 4 ? "md:col-span-5" : "md:col-span-6";
              const ratio = i % 5 === 0 ? "aspect-[16/9]" : i % 5 === 3 ? "aspect-[4/3]" : "aspect-[3/4] md:aspect-[4/5]";
              return (
                <Reveal key={p.id} delay={(i % 3) * STAGGER.step} className={span}>
                  <Link
                    to="/work/$slug"
                    params={{ slug: p.slug }}
                    className="group block"
                    aria-label={`${p.title} — view case study`}
                  >
                    <div data-cursor="view" className={`media-zoom overflow-hidden border border-border bg-elevated ${ratio}`}>
                      <img
                        src={coverFor(p, i)}
                        alt={p.title}
                        loading={i < 2 ? "eager" : "lazy"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="mt-4 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-eyebrow">{p.client ?? "Yomi Visuals"}</p>
                        <h2 className="text-headline mt-2 text-[clamp(1.15rem,3.4vw,1.7rem)]">{p.title}</h2>
                        <p className="mt-2 text-[12.5px] text-muted-foreground">
                          {categoryOf(p)}
                          {yearOf(p) ? ` · ${yearOf(p)}` : ""}
                        </p>
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

      {/* Search overlay */}
      {searchOpen ? (
        <div className="confirm-in fixed inset-0 z-[60] flex flex-col bg-background/98 backdrop-blur">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4 md:px-10">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search project, client, category, year"
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
                    className="tap flex items-center justify-between gap-4 py-4"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[15px]">{p.title}</span>
                      <span className="mt-1 block text-[12px] text-muted-foreground">
                        {p.client} · {categoryOf(p)}
                        {yearOf(p) ? ` · ${yearOf(p)}` : ""}
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
            {q.trim() && visible.length === 0 ? (
              <p className="py-16 text-center text-[14px] text-muted-foreground">Nothing matched “{q}”.</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
