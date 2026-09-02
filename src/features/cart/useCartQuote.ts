"use client";

import { useMemo } from "react";
import {
  applyCheckoutDiscounts,
  cartQty,
  cartSubtotalCents,
  cashbackCentsForQty,
  welcomeValueCents,
} from "@/data/pricing";
import { useAccount } from "@/features/account/AccountProvider";
import { useShop } from "@/features/shop/ShopProvider";
import type { CartItem } from "@/models";

function normalizeCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

export function useCartQuote(items: CartItem[], appliedCode: string | null) {
  const { me } = useAccount();
  const shop = useShop();
  const subtotalCents = useMemo(
    () => cartSubtotalCents(items, shop),
    [items, shop],
  );
  const qty = useMemo(() => cartQty(items), [items]);
  const typed = normalizeCode(appliedCode ?? "");
  const matches = Boolean(
    typed &&
      (typed === normalizeCode(shop.welcomeCode) ||
        (me?.welcomeCode && typed === normalizeCode(me.welcomeCode))),
  );
  const accountOk = shop.welcomeRequiresAccount
    ? !!me && !!me.welcomeValid
    : !me || me.welcomeValid;
  const welcomeCents =
    matches && shop.welcomeLive && accountOk
      ? welcomeValueCents(subtotalCents, shop)
      : 0;
  const creditCents = me?.creditCents ?? 0;
  const applied = applyCheckoutDiscounts(
    subtotalCents,
    welcomeCents,
    creditCents,
  );

  return {
    me,
    shop,
    qty,
    subtotalCents,
    welcomeCode: applied.welcomeAppliedCents > 0 ? shop.welcomeCode : null,
    cashbackPreviewCents: me ? cashbackCentsForQty(qty, shop) : 0,
    guestCashbackCents: me ? 0 : cashbackCentsForQty(qty, shop),
    ...applied,
  };
}
