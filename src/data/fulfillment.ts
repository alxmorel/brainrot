import { isTeeSize, type TeeSize } from "@/data/sizes";

export function gelatoUidForSize(size: string): string | null {
  if (!isTeeSize(size)) return null;
  const raw = process.env[`GELATO_UID_${size}`];
  return raw && raw.length > 0 ? raw : null;
}

export function catalogForProduct(productId: string, size?: TeeSize) {
  if (productId !== "tee-classic") return undefined;
  return {
    provider: "gelato" as const,
    productUid: size ? gelatoUidForSize(size) : null,
  };
}
