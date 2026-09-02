import { brand } from "@/data/brand";
import { brainrots } from "@/data/brainrots";
import type { Brainrototo } from "@/models";

export const MYSTERY_PRODUCT_ID = "tee-mystery";
export const MYSTERY_CART_ID = "mystery";

export function isMysteryProductId(productId: string) {
  return productId === MYSTERY_PRODUCT_ID;
}

export function isMysteryCartItem(item: {
  brainrotId?: string;
  productId?: string;
}) {
  return (
    item.productId === MYSTERY_PRODUCT_ID ||
    item.brainrotId === MYSTERY_CART_ID
  );
}

export function mysteryPool(): Brainrototo[] {
  return brainrots;
}

export function customerLineName(item: {
  productId: string;
  brainrotId: string;
}) {
  if (isMysteryProductId(item.productId)) return brand.mystery.name;
  return (
    brainrots.find((brainrot) => brainrot.id === item.brainrotId)?.name ??
    item.brainrotId
  );
}

export function opsLineName(item: { productId: string; brainrotId: string }) {
  const name =
    brainrots.find((brainrot) => brainrot.id === item.brainrotId)?.name ??
    item.brainrotId;
  if (isMysteryProductId(item.productId)) return `Mystery · ${name}`;
  return name;
}
