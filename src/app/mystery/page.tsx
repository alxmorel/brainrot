import type { Metadata } from "next";
import { brand } from "@/data/brand";
import { isTeeSize } from "@/data/sizes";
import { isTeeColor } from "@/data/teeColors";
import { MysteryPage } from "@/features/mystery/MysteryPage";

export const metadata: Metadata = {
  title: brand.mystery.seoTitle,
  description: brand.mystery.seoDescription,
  alternates: { canonical: "/mystery" },
  openGraph: {
    title: `${brand.mystery.name} - Brainrototo`,
    description: brand.mystery.seoDescription,
    url: "/mystery",
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const sizeRaw = query.size;
  const sizeVal = typeof sizeRaw === "string" ? sizeRaw : sizeRaw?.[0];
  const initialSize = sizeVal && isTeeSize(sizeVal) ? sizeVal : undefined;
  const colorRaw = query.color;
  const colorVal = typeof colorRaw === "string" ? colorRaw : colorRaw?.[0];
  const initialColor = colorVal && isTeeColor(colorVal) ? colorVal : undefined;
  return <MysteryPage initialSize={initialSize} initialColor={initialColor} />;
}
