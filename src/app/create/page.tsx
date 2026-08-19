import { GeneratorStudio } from "@/features/generator/GeneratorStudio";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crée ton Brainrot — Brainrot.com",
  description: "Choisis tes traits, pick une illu, porte-la sur un tee.",
};

export default function CreatePage() {
  return <GeneratorStudio />;
}
