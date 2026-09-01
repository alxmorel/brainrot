import {
  applyCheckoutDiscounts,
  cartQty,
  cartSubtotalCents,
  cashbackCentsForQty,
  welcomeValueCents,
} from "@/data/pricing";
import { getShopSettings } from "@/server/shop-settings";
import { isWelcomeActive } from "@/server/users-repo";
import { typedCodeMatchesWelcome } from "@/server/welcome-code";
import type { User } from "@prisma/client";

export type CheckoutQuote = {
  unitCents: number;
  qty: number;
  subtotalCents: number;
  welcomeAppliedCents: number;
  creditAppliedCents: number;
  discountCents: number;
  totalCents: number;
  cashbackPreviewCents: number;
  welcomeCode: string | null;
  userId: string | null;
};

export async function quoteCheckout(opts: {
  items: { quantity: number }[];
  sessionUser: User | null;
  typedCode: string | null;
}): Promise<CheckoutQuote> {
  const shop = await getShopSettings();
  const qty = cartQty(opts.items);
  const subtotalCents = cartSubtotalCents(opts.items, shop.teePriceCents);
  const sessionUser = opts.sessionUser;
  let welcomeCents = 0;
  let welcomeCode: string | null = null;

  const codeOk =
    !!opts.typedCode &&
    shop.welcomeLive &&
    typedCodeMatchesWelcome(
      opts.typedCode,
      sessionUser?.welcomeCode,
      shop.welcomeCode,
    );
  const accountOk = shop.welcomeRequiresAccount
    ? !!sessionUser && isWelcomeActive(sessionUser)
    : !sessionUser || isWelcomeActive(sessionUser);

  if (codeOk && accountOk) {
    welcomeCents = welcomeValueCents(subtotalCents, shop);
    welcomeCode = shop.welcomeCode;
  }

  const creditCents = sessionUser?.creditCents ?? 0;
  const applied = applyCheckoutDiscounts(
    subtotalCents,
    welcomeCents,
    creditCents,
  );

  return {
    unitCents: shop.teePriceCents,
    qty,
    subtotalCents,
    ...applied,
    cashbackPreviewCents: sessionUser
      ? cashbackCentsForQty(qty, shop)
      : 0,
    welcomeCode: applied.welcomeAppliedCents > 0 ? welcomeCode : null,
    userId: sessionUser?.id ?? null,
  };
}
