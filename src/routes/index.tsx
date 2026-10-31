import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/btf/Hero";
import { ActI } from "@/components/btf/ActI";
import { LayerLab } from "@/components/btf/LayerLab";
import { Gallery } from "@/components/btf/Gallery";
import { Creator, LabAct, Connection, Finale } from "@/components/btf/Acts";
import { seo } from "@/lib/film/seo";

export const Route = createFileRoute("/")({
  head: () => seo({ title: "Yomi Visuals | Beyond the Frame", description: "Yomi Visuals is the creative identity of photographer and creative director Yomi Onalaru. Art. Code. Imagination.", path: "/", image: "/portfolio/yv-portraits-041-1600.webp" }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <ActI />
      <LayerLab />
      <Gallery />
      <Creator />
      <LabAct />
      <Connection />
      <Finale />
    </>
  );
}
