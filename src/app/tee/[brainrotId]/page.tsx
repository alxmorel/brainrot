import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brainrots } from "@/data/brainrots";
import { isTeeSize } from "@/data/sizes";
import { isTeeColor } from "@/data/teeColors";
import { ProductPage } from "@/features/product/ProductPage";

type TeePageProps = {
  params: Promise<{ brainrotId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return brainrots.map((brainrot) => ({ brainrotId: brainrot.id }));
}

export async function generateMetadata({
  params,
}: TeePageProps): Promise<Metadata> {
  const { brainrotId } = await params;
  const brainrot = brainrots.find((item) => item.id === brainrotId);
  if (!brainrot) return { title: "Tee — Brainrototo.com" };
  return {
    title: `${brainrot.name} — Brainrototo.com`,
    description: `T-shirt bio unisexe ${brainrot.name}. SOL'S Legend, impression face avant.`,
  };
}

export default async function TeePage({ params, searchParams }: TeePageProps) {
  const { brainrotId } = await params;
  const brainrot = brainrots.find((item) => item.id === brainrotId);
  if (!brainrot) notFound();
  const query = await searchParams;
  const sizeRaw = query.size;
  const sizeVal = typeof sizeRaw === "string" ? sizeRaw : sizeRaw?.[0];
  const initialSize = sizeVal && isTeeSize(sizeVal) ? sizeVal : undefined;
  const colorRaw = query.color;
  const colorVal = typeof colorRaw === "string" ? colorRaw : colorRaw?.[0];
  const initialColor = colorVal && isTeeColor(colorVal) ? colorVal : undefined;
  return (
    <ProductPage
      brainrot={brainrot}
      initialSize={initialSize}
      initialColor={initialColor}
    />
  );
}
