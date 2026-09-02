import { DEFAULT_SHOP, type ShopPublicSettings } from "@/models/shop";

export const teePriceCents = DEFAULT_SHOP.teePriceCents;
export const teeCompareAtCents = DEFAULT_SHOP.teeCompareAtCents;
export const mysteryTeePriceCents = DEFAULT_SHOP.mysteryTeePriceCents;
export const cashbackPerExtraTeeCents = DEFAULT_SHOP.cashbackPerExtraTeeCents;
export const welcomeCodeTtlDays = DEFAULT_SHOP.welcomeTtlDays;
export const welcomeCampaignCode = DEFAULT_SHOP.welcomeCode;

export function formatEur(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export const teePriceLabel = `${formatEur(teePriceCents)} TTC`;

export const shippingNote = "Livraison comprise";

export const customProductNote = "Tee imprimé à la commande.";

export const customProductLegalNote =
  "Tee imprimé à la commande : pas de rétractation de 14 jours.";

export const mysteryLegalNote =
  "Mystery Tee : tirage définitif, ni retour ni échange.";

export function formatWelcomeOffer(shop: ShopPublicSettings) {
  if (shop.welcomeKind === "percent") return `−${shop.welcomePercent} %`;
  return formatEur(shop.welcomeAmountCents);
}

export function welcomeValueCents(
  subtotalCents: number,
  shop: ShopPublicSettings,
) {
  if (shop.welcomeKind === "percent") {
    return Math.round((subtotalCents * shop.welcomePercent) / 100);
  }
  return Math.max(0, shop.welcomeAmountCents);
}

export function cartQty(items: { quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartLineUnitCents(
  item: { productId?: string },
  shop: ShopPublicSettings = DEFAULT_SHOP,
) {
  return item.productId && item.productId === "tee-mystery"
    ? shop.mysteryTeePriceCents
    : shop.teePriceCents;
}

export function cartSubtotalCents(
  items: { quantity: number; productId?: string }[],
  shop: ShopPublicSettings = DEFAULT_SHOP,
) {
  return items.reduce(
    (sum, item) => sum + item.quantity * cartLineUnitCents(item, shop),
    0,
  );
}

export function cashbackCentsForQty(
  qty: number,
  shop: ShopPublicSettings = DEFAULT_SHOP,
) {
  if (!shop.cashbackEnabled) return 0;
  const extra = qty - (shop.cashbackMinQty - 1);
  return Math.max(0, extra) * shop.cashbackPerExtraTeeCents;
}

export function applyCheckoutDiscounts(
  subtotalCents: number,
  welcomeCents: number,
  creditCents: number,
) {
  let welcomeAppliedCents = Math.min(
    Math.max(0, welcomeCents),
    Math.max(0, subtotalCents),
  );
  const remaining = subtotalCents - welcomeAppliedCents;
  let creditAppliedCents = Math.min(Math.max(0, creditCents), remaining);
  let discountCents = welcomeAppliedCents + creditAppliedCents;
  let totalCents = subtotalCents - discountCents;

  if (totalCents < 50 && subtotalCents >= 50) {
    const cut = 50 - totalCents;
    const creditCut = Math.min(creditAppliedCents, cut);
    creditAppliedCents -= creditCut;
    welcomeAppliedCents -= Math.min(welcomeAppliedCents, cut - creditCut);
    discountCents = welcomeAppliedCents + creditAppliedCents;
    totalCents = subtotalCents - discountCents;
  }

  return {
    welcomeAppliedCents,
    creditAppliedCents,
    discountCents,
    totalCents,
  };
}
