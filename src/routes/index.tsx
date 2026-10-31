import { createFileRoute } from "@tanstack/react-router";
import { Hero, About, Showreel, Sets, Featured, Numbers, HowItWorks, Journal, Start } from "@/components/mx/Home";
import { seo } from "@/lib/film/seo";

export const Route = createFileRoute("/")({
  head: () => seo({ title: "Yomi Visuals | Art. Code. Imagination.", description: "Yomi Visuals is the creative identity of photographer and creative director Yomi Onalaru, working across Lagos and Accra.", path: "/", image: "/portfolio/yv-portraits-041-1600.webp" }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Showreel />
      <Sets />
      <Featured />
      <Numbers />
      <HowItWorks />
      <Journal />
      <Start />
    </>
  );
}
