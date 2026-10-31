import { Link } from "@tanstack/react-router";
import { ASSETS, PICKS, SETS, altFor, getAsset, src } from "@/lib/film/portfolio";
import { INSTAGRAM_URL, STUDIO_URL } from "@/content/site";
import { LAYERS } from "@/components/btf/LayerLab";
import { Photo } from "@/components/btf/Photo";
import { LeadForm } from "@/components/btf/LeadForm";

const RIBBON = [
  "yv-portraits-041", "weddings-007", "studio-work-045", "brands-021", "aso-ebi-look-005", "yv-portraits-004", "lifestyle-004",
  "weddings-016", "studio-work-007", "yv-portraits-050", "brands-017", "weddings-006", "yv-portraits-015", "yv-portraits-053",
  "studio-work-045", "weddings-007", "brands-021", "yv-portraits-041", "aso-ebi-look-005", "lifestyle-004",
];

function Ribbon() {
  const n = RIBBON.length;
  return (
    <div className="rb" aria-hidden>
      {RIBBON.map((id, i) => {
        const t = i / (n - 1);
        const x = -2 + t * 106;
        const y = 12 + t * 66 + Math.sin(t * 7) * 3;
        return (
          <span
            key={i}
            className="rb-pill"
            style={{
              ["--x" as string]: `${x}%`,
              ["--y" as string]: `${y}%`,
              ["--w" as string]: "clamp(46px, 7.2vw, 104px)",
              ["--r" as string]: `${i * 24}deg`,
              backgroundImage: `url(${src(id, 800)})`,
              animationDelay: `${-(i * 0.35)}s`,
            }}
          />
        );
      })}
    </div>
  );
}

function SectionLabel({ n, title, right }: { n: string; title: string; right?: string }) {
  return (
    <div className="mx-mono flex items-baseline justify-between gap-6 text-[14px] sm:text-[16px]">
      <span>{title}</span>
      <span>{right ?? `[${n}]`}</span>
    </div>
  );
}

export function Hero() {
  const portrait = PICKS.creator;
  return (
    <section className="relative overflow-hidden bg-[#f4f4f4]" aria-label="Yomi Visuals">
      <div className="mx-dots absolute inset-0 opacity-70" aria-hidden />
      <div className="relative h-[460px] sm:h-[560px] lg:h-[680px]">
        <Ribbon />
        <aside className="absolute right-[clamp(16px,3.4vw,40px)] top-[96px] z-10 hidden w-[340px] grid-cols-[1fr_100px] gap-2 lg:grid">
          <div className="mx-card p-5">
            <p className="mx-mono text-[19px] font-bold leading-[1.05] tracking-tight">Start<br />a project</p>
            <p className="mt-3 text-[14px] leading-snug text-black/60">Tell us about the shoot, the brand or the idea.</p>
            <Link to="/collaborate" className="mx-mono mt-4 flex h-10 items-center justify-center rounded-[6px] bg-[#f4f4f4] text-[14px] font-bold hover:bg-black hover:text-white">Collaborate</Link>
          </div>
          <div className="mx-card overflow-hidden p-0"><Photo id={portrait} sizes="100px" className="h-full w-full" style={{ aspectRatio: "auto" }} /></div>
          <div className="mx-card col-span-2 flex items-center justify-between px-5 py-4 text-[12px]">
            <span className="mx-mono leading-tight">{ASSETS.length} photographs<br />{SETS.length} sets · Lagos / Accra</span>
            <Link to="/work" className="mx-mono text-[12px] font-bold underline underline-offset-4">View work</Link>
          </div>
        </aside>
      </div>
      <div className="mx-wrap relative z-10 -mt-10 pb-10 sm:-mt-16">
        <p className="mx-mono mb-3 text-[clamp(14px,1.8vw,24px)] tracking-tight">Art. Code. Imagination.</p>
        <h1 className="mx-wordmark">Yomi Visuals</h1>
      </div>
    </section>
  );
}

export function About() {
  const a = getAsset("studio-work-045");
  return (
    <section className="mx-wrap bg-[#f4f4f4] py-24 md:py-32" aria-label="About">
      <div className="mx-mono mb-8 flex items-start justify-between text-[16px]"><span>[01]</span><Link to="/about" className="[writing-mode:vertical-rl]">[More about]</Link></div>
      <h2 className="mx-h1 max-w-[1100px] text-[clamp(1.6rem,4.3vw,3.4rem)] [text-indent:12%]">From image to idea to build: creative direction at the meeting point of photography, business and software.</h2>
      <div className="mt-16 grid gap-8 md:grid-cols-[1fr_1fr] lg:grid-cols-[0.9fr_1fr_0.8fr]">
        <Photo id="studio-work-045" sizes="(min-width:1024px) 30vw, 90vw" className="w-full rounded-[10px]" style={{ aspectRatio: String(a.ratio) }} />
        <p className="max-w-[460px] text-[15px] leading-[1.7] text-black/70">Yomi Visuals is the creative identity of Yomi Onalaru: photographer and creative director working across Lagos and Accra. The work lives in six sets, from portraits and weddings to studio concepts and brand imagery, and it keeps asking how images, systems and stories fit together.</p>
        <div className="mx-mono text-[13px]">
          <p className="font-bold">Focus</p>
          <ul className="mt-5 space-y-3 text-black/60">
            <li>Portraits</li><li>Weddings</li><li>Studio concepts</li><li>Brand imagery</li><li>Creative direction</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Showreel() {
  const id = PICKS.hero; const a = getAsset(id);
  return (
    <section className="mx-wrap bg-[#f4f4f4] pb-24" aria-label="Featured frame">
      <Link to="/work/$slug" params={{ slug: "yv-portraits" }} className="group relative block overflow-hidden rounded-[10px]">
        <Photo id={id} sizes="100vw" className="w-full" style={{ aspectRatio: "16 / 9" }} imgClassName="transition-transform duration-700 group-hover:scale-[1.02]" alt={altFor(a)} />
        <span className="mx-mono absolute bottom-6 left-6 rounded-[6px] bg-white px-4 py-2 text-[14px] font-bold">View YV Portraits →</span>
      </Link>
    </section>
  );
}

export function Sets() {
  return (
    <section className="mx-wrap bg-[#f4f4f4] pb-28" aria-label="Sets">
      <SectionLabel n="02" title="Sets" />
      <ul className="mt-10 grid gap-3">
        {SETS.map((s, i) => (
          <li key={s.slug}>
            <Link to="/work/$slug" params={{ slug: s.slug }} className={`mx-row mx-card relative flex min-h-[96px] flex-col justify-center gap-2 px-6 py-5 md:flex-row md:items-center md:gap-8 md:px-10 ${i % 2 ? "md:flex-row-reverse md:text-right" : ""}`}>
              <span className="mx-mono text-[clamp(1.6rem,4.4vw,3.9rem)] leading-none tracking-tight">{s.name}</span>
              <span className="mx-row-tag mx-mono max-w-[300px] text-[11px] leading-snug text-black/55">{s.count} photographs. {s.blurb}</span>
              <span className={`mx-thumb pointer-events-none absolute top-1/2 hidden h-[140px] w-[100px] -translate-y-1/2 overflow-hidden rounded-[8px] md:block ${i % 2 ? "left-[22%]" : "right-[22%]"}`}>
                <Photo id={s.cover} sizes="100px" className="h-full w-full" style={{ aspectRatio: "auto" }} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Featured() {
  const ids = ["weddings-007", "brands-021", "aso-ebi-look-005", "yv-portraits-004", "lifestyle-004", "weddings-016", "studio-work-007", "yv-portraits-050"];
  return (
    <section className="mx-wrap bg-[#f4f4f4] pb-28" aria-label="Featured work">
      <div className="mx-mono flex items-baseline justify-between text-[14px] sm:text-[16px]"><span>[03]</span><span>Featured work</span><Link to="/work" className="font-bold underline underline-offset-4">View all</Link></div>
      <ul className="mt-10 columns-2 gap-3 md:columns-3 lg:columns-4 [&>li]:mb-3 [&>li]:break-inside-avoid">
        {ids.map((id) => {
          const a = getAsset(id);
          return (
            <li key={id} className="mx-card p-2">
              <Link to="/work/$slug" params={{ slug: a.set }} className="group block">
                <Photo id={id} sizes="(min-width:1024px) 22vw, 46vw" className="w-full rounded-[6px]" imgClassName="transition-transform duration-500 group-hover:scale-[1.03]" />
                <span className="mx-mono mt-2 block px-1 text-[11px]">{SETS.find((s) => s.slug === a.set)?.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function Numbers() {
  const items = [
    { v: String(ASSETS.length), l: "Photographs in the archive" },
    { v: String(SETS.length), l: "Sets of work" },
    { v: "2", l: "Cities: Lagos & Accra" },
  ];
  return (
    <section className="mx-wrap bg-[#f4f4f4] pb-28" aria-label="In numbers">
      <ul className="grid gap-3 sm:grid-cols-3">
        {items.map((m) => (
          <li key={m.l} className="mx-card p-8">
            <p className="mx-mono text-[clamp(3rem,7vw,5.5rem)] leading-none tracking-tight">{m.v}</p>
            <p className="mx-mono mt-4 text-[13px] text-black/60">{m.l}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="bg-[#1a1a1a] py-24 text-white md:py-32" aria-label="The four layers">
      <div className="mx-wrap">
        <div className="mx-mono flex justify-between text-[16px]"><span>The four layers</span><span>[04]</span></div>
        <ol className="mt-20 grid gap-20 md:grid-cols-2 md:gap-y-28">
          {LAYERS.map((l, i) => (
            <li key={l.key} className={i % 2 ? "md:mt-40" : ""}>
              <p className="mx-mono text-[13px] text-white/60">[00{i + 1}]</p>
              <h3 className="mx-h1 mt-4 text-[clamp(2.4rem,6vw,5.2rem)]">{l.label}</h3>
              <p className="mt-6 max-w-[440px] text-[14.5px] leading-[1.7] text-white/65">{l.text}</p>
            </li>
          ))}
        </ol>
        <Link to="/lab/$slug" params={{ slug: "layers" }} className="mx-mono mt-24 inline-flex h-12 items-center rounded-[6px] bg-white px-7 text-[14px] font-bold text-black hover:bg-[#f4f4f4]">Open the layer lab →</Link>
      </div>
    </section>
  );
}

export function Journal() {
  return (
    <section className="mx-wrap bg-[#f4f4f4] py-24" aria-label="Journal">
      <div className="mx-mono flex items-baseline justify-between text-[14px] sm:text-[16px]"><span>[05]</span><span>Journal</span><Link to="/journal" className="font-bold underline underline-offset-4">Open</Link></div>
      <div className="mx-card mt-10 grid gap-8 p-8 md:grid-cols-[1fr_1.2fr] md:p-12">
        <h2 className="mx-h1 text-[clamp(1.8rem,4vw,3.2rem)]">Notes on seeing, building and making.</h2>
        <p className="max-w-[460px] self-end text-[15px] leading-[1.7] text-black/65">The journal is for writing that is actually finished: process, lessons from shoots, and experiments in design and code. Nothing is published until it is ready, so this space is intentionally quiet for now.</p>
      </div>
    </section>
  );
}

export function Start() {
  return (
    <section className="mx-wrap bg-[#f4f4f4] pb-28" aria-label="Start a project" id="start">
      <div className="mx-mono mb-10 flex justify-between text-[14px] sm:text-[16px]"><span>Start a project</span><span>[06]</span></div>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="mx-h1 text-[clamp(2.4rem,6vw,5rem)]">Great ideas deserve to exist.</h2>
          <p className="mt-6 max-w-[420px] text-[15px] leading-[1.7] text-black/65">Photography, creative direction, brand imagery or something that does not have a name yet. Tell us what you are making.</p>
          <p className="mx-mono mt-8 text-[13px]"><a className="underline underline-offset-4" href={STUDIO_URL} target="_blank" rel="noopener noreferrer">YV Studios Africa ↗</a> &nbsp; <a className="underline underline-offset-4" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram ↗</a></p>
        </div>
        <div className="mx-card p-6 md:p-10">
          <LeadForm source="contact" enquiries={["Photography", "Creative direction", "Brand imagery", "Something else"]} />
        </div>
      </div>
    </section>
  );
}
