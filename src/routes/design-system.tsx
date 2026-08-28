import { createFileRoute } from "@tanstack/react-router";
import {
  Canvas,
  Stack,
  Eyebrow,
  SectionHeader,
  Button,
  ButtonLink,
  TextLink,
  ImageBlock,
  ProjectGrid,
  ServiceAccordion,
  ProcessTimeline,
  EcosystemMap,
  TeamMember,
  Field,
  Input,
  Select,
  TextArea,
  LoadingState,
  EmptyState,
  CTA,
  YVLogo,
} from "@/components/yv";
import { DIVISIONS, PILLARS, PROCESS_STAGES } from "@/lib/ecosystem";
import portrait from "@/assets/about-portrait.jpg";
import editorial from "@/assets/editorial-1.jpg";
import commercial from "@/assets/commercial-1.jpg";

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: "Design System — Yomi Visuals" },
      { name: "description", content: "The YV interface source of truth: tokens, typography, components and motion." },
      { property: "og:title", content: "Design System — Yomi Visuals" },
      { property: "og:description", content: "Tokens, typography, components and motion for the YV platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DesignSystemPage,
});

const COLORS = [
  { name: "Black", value: "#0A0A0A" },
  { name: "Off Black", value: "#111111" },
  { name: "Charcoal", value: "#1A1A1A" },
  { name: "Dark Grey", value: "#2A2A2A" },
  { name: "Mid Grey", value: "#777777" },
  { name: "Light Grey", value: "#CFCFC9" },
  { name: "Soft Off-White", value: "#E8E8E2" },
  { name: "White", value: "#F5F5F2" },
  { name: "Pure White", value: "#FFFFFF" },
  { name: "YV Gold", value: "#C6A15B" },
];

const TYPE = [
  { cls: "type-display-xl", label: "Display XL", sample: "We make ideas real." },
  { cls: "type-display-l", label: "Display L", sample: "Built for ambitious brands." },
  { cls: "type-display-m", label: "Display M", sample: "From idea to final frame." },
  { cls: "type-heading-l", label: "Heading L", sample: "Creative without limits." },
  { cls: "type-heading-m", label: "Heading M", sample: "Make something people remember." },
  { cls: "type-heading-s", label: "Heading S", sample: "Campaign production, Lagos." },
  { cls: "type-body-l", label: "Body L", sample: "Ideas first. Production second." },
  { cls: "type-body", label: "Body", sample: "Ideas first. Production second." },
  { cls: "type-small", label: "Small", sample: "Ideas first. Production second." },
  { cls: "type-micro", label: "Micro", sample: "Creative production company" },
];

const SPACING = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, 160];

const MOTION = [
  { name: "Fast", value: "150–200ms", use: "Hover, arrows, focus" },
  { name: "Standard", value: "300–450ms", use: "Accordions, menus, state changes" },
  { name: "Cinematic", value: "600–900ms", use: "Reveals, image scale, page transitions" },
];

function Block({ title, children, id }: { title: string; children: React.ReactNode; id: string }) {
  return (
    <section id={id} className="border-t border-border py-12 md:py-20">
      <Canvas>
        <Eyebrow>{title}</Eyebrow>
        <div className="mt-8">{children}</div>
      </Canvas>
    </section>
  );
}

function DesignSystemPage() {
  const serviceRows = PILLARS.map((p, i) => ({
    code: `0${i + 1}`,
    title: p.code,
    summary: p.title,
    items: p.items,
  }));

  return (
    <>
      <Stack size="lg">
        <Eyebrow>Design System</Eyebrow>
        <h1 className="type-display-xl mt-5 uppercase">The YV Interface</h1>
        <p className="type-body-l mt-6 max-w-xl text-muted-foreground">
          Mobile-first tokens, typography and components. This page is the single source of truth for how Yomi Visuals
          looks and behaves.
        </p>
      </Stack>

      <Block id="logo" title="01 — Brand mark">
        <div className="flex flex-wrap items-baseline gap-10">
          <YVLogo className="text-[13px]" />
          <YVLogo compact className="text-[22px]" />
        </div>
      </Block>

      <Block id="color" title="02 — Colour">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {COLORS.map((c) => (
            <li key={c.name}>
              <div className="h-20 rounded-sm border border-border" style={{ background: c.value }} />
              <p className="type-small mt-2.5">{c.name}</p>
              <p className="text-[12px] text-muted-foreground">{c.value}</p>
            </li>
          ))}
        </ul>
      </Block>

      <Block id="type" title="03 — Typography">
        <div className="space-y-8">
          {TYPE.map((t) => (
            <div key={t.label} className="border-b border-border pb-6">
              <p className="type-micro text-muted-foreground">{t.label}</p>
              <p className={`${t.cls} mt-3`}>{t.sample}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block id="spacing" title="04 — Spacing (4px base)">
        <ul className="space-y-2.5">
          {SPACING.map((s) => (
            <li key={s} className="flex items-center gap-4">
              <span className="type-small w-12 text-muted-foreground">{s}</span>
              <span className="block h-2 rounded-sm bg-gold/70" style={{ width: `${s}px` }} />
            </li>
          ))}
        </ul>
      </Block>

      <Block id="grid" title="05 — Grid (4 col mobile / 12 col desktop)">
        <div className="yv-grid">
          <div className="col-full rounded-sm border border-border p-4 text-[12px] text-muted-foreground">Full</div>
          <div className="col-half rounded-sm border border-border p-4 text-[12px] text-muted-foreground">1/2</div>
          <div className="col-half rounded-sm border border-border p-4 text-[12px] text-muted-foreground">1/2</div>
          <div className="col-two-thirds rounded-sm border border-border p-4 text-[12px] text-muted-foreground">2/3</div>
          <div className="col-third rounded-sm border border-border p-4 text-[12px] text-muted-foreground">1/3</div>
          <div className="col-quarter rounded-sm border border-border p-4 text-[12px] text-muted-foreground">1/4</div>
          <div className="col-three-quarters rounded-sm border border-border p-4 text-[12px] text-muted-foreground">
            3/4
          </div>
        </div>
      </Block>

      <Block id="buttons" title="06 — Buttons">
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink to="/start-a-project">Start a Project</ButtonLink>
          <ButtonLink to="/work" variant="secondary">
            View Work
          </ButtonLink>
          <TextLink to="/work">View Project</TextLink>
          <Button variant="primary" disabled>
            Submitting
          </Button>
        </div>
      </Block>

      <Block id="forms" title="07 — Forms">
        <form className="grid max-w-2xl gap-6 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <Field label="Name" htmlFor="ds-name">
            <Input id="ds-name" placeholder="Your name" />
          </Field>
          <Field label="Project type" htmlFor="ds-type">
            <Select id="ds-type" defaultValue="">
              <option value="">Select a type</option>
              <option>Brand Campaign</option>
              <option>Commercial</option>
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Project description" htmlFor="ds-desc" hint="Short and specific works best.">
              <TextArea id="ds-desc" rows={4} placeholder="What are you building?" />
            </Field>
          </div>
        </form>
      </Block>

      <Block id="images" title="08 — Image treatments">
        <div className="grid gap-6 md:grid-cols-3">
          <ImageBlock src={commercial} alt="Cinematic 16:9 campaign frame" ratio="cinematic" caption="Cinematic 16:9" />
          <ImageBlock src={editorial} alt="Tall editorial 3:4 frame" ratio="tall" caption="Tall editorial 3:4" />
          <ImageBlock src={portrait} alt="Portrait 4:5 frame" ratio="portrait" caption="Portrait 4:5" />
        </div>
      </Block>

      <Block id="projects" title="09 — Project cards">
        <ProjectGrid
          projects={[
            { title: "Valora", client: "Lagos", category: "Campaign", year: 2026, image: commercial },
            { title: "Rahs Luxe", client: "Lagos", category: "Fashion", year: 2026, image: editorial, ratio: "tall" },
          ]}
        />
      </Block>

      <Block id="services" title="10 — Service rows">
        <ServiceAccordion rows={serviceRows} />
      </Block>

      <Block id="process" title="11 — Process timeline">
        <ProcessTimeline stages={PROCESS_STAGES} />
      </Block>

      <Block id="ecosystem" title="12 — Ecosystem map">
        <EcosystemMap divisions={DIVISIONS} />
      </Block>

      <Block id="team" title="13 — Team">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <TeamMember name="Yomi Onalaru" role="Founder & Creative Producer" image={portrait} />
          <TeamMember name="Open role" role="Producer" />
        </div>
      </Block>

      <Block id="states" title="14 — Loading & empty states">
        <div className="space-y-12">
          <LoadingState label="Loading projects" rows={2} />
          <EmptyState title="No projects yet" body="We're preparing the next chapter." />
        </div>
      </Block>

      <Block id="motion" title="15 — Motion">
        <ul className="grid gap-px border border-border bg-border sm:grid-cols-3">
          {MOTION.map((m) => (
            <li key={m.name} className="bg-background p-6">
              <p className="type-heading-s uppercase">{m.name}</p>
              <p className="type-small mt-2 text-gold">{m.value}</p>
              <p className="type-small mt-2 text-muted-foreground">{m.use}</p>
            </li>
          ))}
        </ul>
        <p className="type-small mt-6 text-muted-foreground">
          All motion respects prefers-reduced-motion. Animation should feel like film editing, not a template.
        </p>
      </Block>

      <Block id="sections" title="16 — Section header">
        <SectionHeader
          eyebrow="Selected Work"
          title="Campaigns, films and visual stories."
          body="Reusable header used across every section of the site."
          action={<TextLink to="/work">View all</TextLink>}
        />
      </Block>

      <CTA
        title="Make something people remember."
        body="Every component above is production-ready and reusable."
        primary={{ to: "/start-a-project", label: "Start a Project" }}
        secondary={{ to: "/work", label: "View Work" }}
      />
    </>
  );
}
