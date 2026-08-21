import { isTeeSize, teeSizes, type TeeSize } from "@/data/sizes";

/**
 * Unisex Organic T-shirt — SOL'S Legend 03981, blanc, print face (gpr_4-0).
 * UID fourni : …_gsi_xs_gco_white_gpr_4-0_sols_03981
 * XXL Gelato = 2xl. Override possible via GELATO_UID_XS, GELATO_UID_S, …
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
const UID_TAIL = "gco_white_gpr_4-0_sols_03981";

export const gelatoTee = {
  productId: "tee-classic",
  provider: "gelato" as const,
  catalogName: "T-shirt bio unisexe",
  brand: "SOL'S Legend",
  sku: "03981",
  color: "white",
  colorLabel: "Blanc",
  fit: "Coupe unisexe",
  fabric: "100 % coton biologique peigné (in conversion)",
  weight: "175 g/m²",
  neck: "Col rond côtelé, tape de nuque",
  print: "Impression face avant",
  care: "Lavage 30 °C, pas de sèche-linge",
} as const;

export function gelatoUidForSize(size: string): string | null {
  if (!isTeeSize(size)) return null;
  const fromEnv = process.env[`GELATO_UID_${size}`];
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  return `${UID_HEAD}_gsi_${GSI[size]}_${UID_TAIL}`;
}

export function catalogForProduct(productId: string, size?: TeeSize) {
  if (productId !== gelatoTee.productId) return undefined;
  return {
    provider: gelatoTee.provider,
    productUid: size ? gelatoUidForSize(size) : null,
  };
}

export function sellableTeeSizes(): TeeSize[] {
  return teeSizes.filter((size) => Boolean(gelatoUidForSize(size)));
}
