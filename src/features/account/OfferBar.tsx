"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "@/features/account/AccountProvider";
import { useShop } from "@/features/shop/ShopProvider";
import { formatWelcomeOffer } from "@/data/pricing";

export function OfferBar() {
  const pathname = usePathname();
  const { me, loaded } = useAccount();
  const shop = useShop();

  if (!loaded) return null;
  if (pathname.startsWith("/ops")) return null;
  if (!shop.welcomeLive) return null;
  if (me && !me.welcomeValid) return null;

  const href =
    me || !shop.welcomeRequiresAccount
      ? "/cart#promo"
      : "/compte/inscription?next=/cart";

  return (
    <Link
      href={href}
      className="flex items-center justify-center gap-x-2 border-b-[3px] border-ink bg-acid-yellow px-3 py-1.5 text-center"
    >
      <span className="font-display text-[0.65rem] font-bold uppercase leading-tight tracking-tight text-ink sm:text-xs">
        {formatWelcomeOffer(shop)} offerts · code{" "}
        <span className="underline decoration-2 underline-offset-2">
          {shop.welcomeCode}
        </span>
        {me || !shop.welcomeRequiresAccount
          ? " · à entrer au paiement"
          : " · crée un compte"}
      </span>
    </Link>
  );
}
