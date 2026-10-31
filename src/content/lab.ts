/** Layer 01 — Lab experiments. Only experiments that exist and work are listed. */
export type Experiment = {
  slug: string;
  n: string;
  title: string;
  tech: string;
  status: string;
  concept: string;
  idea: string;
  problem: string;
  creative: string;
  engineering: string;
  result: string;
  learned: string;
};

export const EXPERIMENTS: Experiment[] = [
  {
    slug: "layers",
    n: "001",
    title: "Layers",
    tech: "React · CSS blend modes",
    status: "Working prototype",
    concept: "Pull a photograph apart into composition, light, colour and atmosphere.",
    idea: "A photograph feels finished, so its decisions are hard to see. Layers separates one frame into four of them (composition, light, colour and atmosphere) so a visitor can look at each choice on its own.",
    problem: "Showing how an image is made usually needs original before-and-after files. Those are not available here, so the experiment has to explain without pretending.",
    creative: "The overlays are explicitly illustrative. Composition is a rule-of-thirds grid with a focal marker, light isolates the key source, colour shows a palette sampled from the photograph itself, atmosphere adds falloff and grain.",
    engineering: "Four absolutely positioned layers over one image. The tab control is a keyboard-operable tablist, and without motion the same content is shown flat.",
    result: "A working interaction, live on this page.",
    learned: "Overlays that only change opacity stay smooth on any phone. A palette sampled from the pixels is more honest than one picked by eye.",
  },
];

export const getExperiment = (slug: string) => EXPERIMENTS.find((e) => e.slug === slug);
