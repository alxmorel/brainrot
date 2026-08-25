import { isTeeSize, teeSizes, type TeeSize } from "@/data/sizes";
import {
  defaultTeeColor,
  isTeeColor,
  teeColors,
  type TeeColorId,
} from "@/data/teeColors";

/**
 * Unisex Organic T-shirt - SOL'S Legend 03981, print face (gpr_4-0).
 * Blanc : …_gsi_xs_gco_white_gpr_4-0_sols_03981
 * Noir  : …_gco_deep-black_…  Override : GELATO_UID_M_DEEP_BLACK, …
 */
const GSI: Record<TeeSize, string> = {
  XS: "xs",
  S: "s",
  M: "m",
  L: "l",
  XL: "xl",
  XXL: "2xl",
};

const UID_HEAD =
  "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_organic";
const UID_TAIL = "gpr_4-0_sols_03981";

export const gelatoTee = {
  productId: "tee-classic",
  provider: "gelato" as const,
  catalogName: "T-shirt bio unisexe",
  brand: "SOL'S Legend",
  sku: "03981",
  color: "white",
  colorLabel: "Blanc / noir",
  fit: "Coupe unisexe",
  fabric: "100 % coton biologique peigné (in conversion)",
  weight: "175 g/m²",
  neck: "Col rond côtelé, tape de nuque",
  print: "Impression face avant",
  care: "Lavage 30 °C, pas de sèche-linge",
} as const;

function gelatoColorSlug(color: string): string {
  return teeColors.find((item) => item.id === color)?.gelato ?? "white";
}

function envUidKey(size: TeeSize, color: TeeColorId) {
  return `GELATO_UID_${size}_${color.toUpperCase().replace(/-/g, "_")}`;
}

export function gelatoUidForSize(
  size: string,
  color: string = defaultTeeColor,
): string | null {
  if (!isTeeSize(size)) return null;
  const colorId = isTeeColor(color) ? color : defaultTeeColor;
  const fromEnv = process.env[envUidKey(size, colorId)];
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  return `${UID_HEAD}_gsi_${GSI[size]}_gco_${gelatoColorSlug(colorId)}_${UID_TAIL}`;
}

export function catalogForProduct(
  productId: string,
  size?: TeeSize,
  color?: string,
) {
  if (productId !== gelatoTee.productId) return undefined;
  return {
    provider: gelatoTee.provider,
    productUid: size ? gelatoUidForSize(size, color) : null,
  };
}

export function sellableTeeSizes(): TeeSize[] {
  return teeSizes.filter((size) => Boolean(gelatoUidForSize(size)));
}
