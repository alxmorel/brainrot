import { GeneratorStudio } from "@/features/generator/GeneratorStudio";
import { isTeeSize } from "@/data/sizes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collection — Brainrototo.com",
  description:
    "Parcours les Brainrototo, compose un combo et porte-le sur un tee.",
};

export default async function CreatePage({
  searchParams,
}: PageProps<"/create">) {
  const params = await searchParams;
  const raw = params.brainrot;
  const initialBrainrotId = typeof raw === "string" ? raw : raw?.[0];
  const sizeRaw = params.size;
  const sizeVal = typeof sizeRaw === "string" ? sizeRaw : sizeRaw?.[0];
  const initialSize = sizeVal && isTeeSize(sizeVal) ? sizeVal : undefined;

  return (
    <GeneratorStudio
      initialBrainrotId={initialBrainrotId}
      initialSize={initialSize}
    />
  );
}
