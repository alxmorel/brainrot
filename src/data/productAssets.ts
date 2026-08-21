import type { BrainrotColorAssets, Brainrototo } from "@/models";
import {
  defaultTeeColor,
  isTeeColor,
  teeColors,
  type TeeColorId,
} from "@/data/teeColors";

const GALLERY = [
  "person1_front.png",
  "editor_front.png",
  "person1_profile-left.png",
  "person1_profile-right.png",
  "person1_back.png",
  "person2_front.png",
] as const;

export function colorPack(
  folder: string,
  color: TeeColorId,
): BrainrotColorAssets {
  const base = `${folder}/${color}`;
  return {
    mockup: `${base}/editor_front.png`,
    gallery: GALLERY.map((file) => `${base}/${file}`),
  };
}

export function colorsForBrainrot(brainrot: Brainrototo): TeeColorId[] {
  if (!brainrot.colors) return [defaultTeeColor];
  return teeColors
    .map((color) => color.id)
    .filter((id) => Boolean(brainrot.colors?.[id]));
}

export function mockupFor(
  brainrot: Brainrototo | null,
  color: string,
): string | undefined {
  if (!brainrot) return undefined;
  const id = isTeeColor(color) ? color : defaultTeeColor;
  return brainrot.colors?.[id]?.mockup ?? brainrot.mockup;
}

export function galleryFor(brainrot: Brainrototo, color: string): string[] {
  const id = isTeeColor(color) ? color : defaultTeeColor;
  const pack = brainrot.colors?.[id];
  if (pack) return pack.gallery.length > 0 ? pack.gallery : [pack.mockup];
  if (brainrot.gallery?.length) return brainrot.gallery;
  if (brainrot.mockup) return [brainrot.mockup];
  return [];
}
