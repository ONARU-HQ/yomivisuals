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
    tech: "React · GSAP ScrollTrigger · CSS blend modes",
    status: "Working prototype",
    concept: "Pull a photograph apart into composition, light, colour and atmosphere.",
    idea: "A photograph feels finished, so its decisions are hard to see. Layers separates one frame into four of them (composition, light, colour and atmosphere) so a visitor can look at each choice on its own.",
    problem: "Showing how an image is made usually needs original before-and-after files. Those are not available here, so the experiment has to explain without pretending.",
    creative: "The overlays are explicitly illustrative. Composition is a rule-of-thirds grid with a focal marker, light isolates the key source, colour shows a palette sampled from the photograph itself, atmosphere adds falloff and grain.",
    engineering: "Four absolutely positioned layers over one image. On large screens ScrollTrigger scrubs their offsets so they separate in depth and recombine. The tab control is a keyboard-operable tablist, and without motion the same content is shown flat.",
    result: "A working interaction, live on the homepage (Act II) and below on this page.",
    learned: "Scroll-driven transforms stay smooth when only transform and opacity change. A palette sampled from the pixels is more honest than one picked by eye.",
  },
  {
    slug: "gallery-walk",
    n: "002",
    title: "Gallery walk",
    tech: "Three.js · React Three Fiber · GSAP ScrollTrigger",
    status: "Working prototype",
    concept: "The archive as a 3D room, driven by scroll.",
    idea: "Move through the portfolio the way you move through an exhibition: one wall at a time, with the next frame already in view.",
    problem: "Virtual galleries are often slow, hard to steer, and unusable without a mouse and a strong GPU. Content must stay reachable for everyone.",
    creative: "A dark room, two walls, nine frames at varied depth, warm lights that travel with the camera. No decoration beyond the photographs.",
    engineering: "A Catmull-Rom camera path driven by scroll progress with damping. Nine 800px textures at most, pixel ratio capped at 1.5, rendering paused when offscreen, WebGL context loss handled. Below 1024px, or with reduced motion or no WebGL, it becomes a swipeable carousel plus a plain list of sets.",
    result: "Live on the homepage (Act III). Every panel opens its original set.",
    learned: "The accessible HTML version is not a fallback to apologise for; it is the part that has to be right first. Reflections and shadows were left out because they cost more than they added.",
  },
];

export const getExperiment = (slug: string) => EXPERIMENTS.find((e) => e.slug === slug);
