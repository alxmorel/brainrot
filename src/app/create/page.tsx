import { brand } from "@/data/brand";
import { isTeeSize } from "@/data/sizes";
import { isTeeColor } from "@/data/teeColors";
import { GeneratorStudio } from "@/features/generator/GeneratorStudio";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: brand.seo.collectionTitle,
  description: brand.seo.collectionDescription,
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
  const colorRaw = params.color;
  const colorVal = typeof colorRaw === "string" ? colorRaw : colorRaw?.[0];
  const initialColor = colorVal && isTeeColor(colorVal) ? colorVal : undefined;

  return (
    <GeneratorStudio
      initialBrainrotId={initialBrainrotId}
      initialSize={initialSize}
      initialColor={initialColor}
    />
  );
}
