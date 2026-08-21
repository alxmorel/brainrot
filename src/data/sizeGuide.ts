import type { TeeSize } from "@/data/sizes";
import { gelatoTee } from "@/data/fulfillment";

/** Chart officiel SOL'S Legend 03981 — longueur (A) / 1/2 poitrine (B), ±2 cm. */
export const sizeGuideRows: Record<
  TeeSize,
  { length: number; halfChest: number }
> = {
  XS: { length: 67, halfChest: 48 },
  S: { length: 70, halfChest: 50 },
  M: { length: 72, halfChest: 53 },
  L: { length: 74, halfChest: 56 },
  XL: { length: 76, halfChest: 59 },
  XXL: { length: 78, halfChest: 62 },
};

export const sizeGuideMeta = {
  productId: gelatoTee.productId,
  title: `${gelatoTee.brand} ${gelatoTee.sku}`,
  fit: gelatoTee.fit,
  unit: "cm" as const,
  tolerance: "±2 cm",
  hint: "Mesure un tee qui te va : longueur d’épaule à ourlet, 1/2 poitrine d’aisselle à aisselle. Entre deux tailles, prends la plus grande.",
};
