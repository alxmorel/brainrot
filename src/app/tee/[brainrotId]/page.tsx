import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brainrots } from "@/data/brainrots";
import { isTeeSize } from "@/data/sizes";
import { isTeeColor } from "@/data/teeColors";
import { ProductPage } from "@/features/product/ProductPage";
import { getBestSellerBrainrots } from "@/server/bestsellers";

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
  if (!brainrot) return { title: "Tee" };
  const description = `Porte ${brainrot.name}. Un Brainrototo original, imprimé sur tee bio.`;
  const path = `/tee/${brainrot.id}`;
  return {
    title: brainrot.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${brainrot.name} - Brainrototo`,
      description,
      url: path,
      images: [{ url: brainrot.image, alt: `${brainrot.name} - Brainrototo` }],
    },
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
  const gang = await getBestSellerBrainrots();
  return (
    <ProductPage
      brainrot={brainrot}
      gang={gang}
      initialSize={initialSize}
      initialColor={initialColor}
    />
  );
}
