import type { Metadata } from "next";
import { HomeCampaign } from "@/features/home/HomeCampaign";
import { brand } from "@/data/brand";
import { isTeeSize } from "@/data/sizes";
import { isTeeColor } from "@/data/teeColors";
import { getBestSellerBrainrots } from "@/server/bestsellers";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: brand.seo.title },
  description: brand.seo.description,
  alternates: { canonical: "/" },
};

export default async function HomePage({
  searchParams,
}: PageProps<"/">) {
  const bestsellers = await getBestSellerBrainrots();
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
    <HomeCampaign
      bestsellers={bestsellers}
      initialBrainrotId={initialBrainrotId}
      initialSize={initialSize}
      initialColor={initialColor}
    />
  );
}
