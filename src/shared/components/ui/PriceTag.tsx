"use client";

import { formatEur } from "@/data/pricing";
import { useShop } from "@/features/shop/ShopProvider";
import { cn } from "@/shared/utils/cn";

export function PriceTag({
  className,
  suffix = " TTC",
}: {
  className?: string;
  suffix?: string;
}) {
  const shop = useShop();
  const showCompare = shop.teeCompareAtCents > shop.teePriceCents;

  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-1.5", className)}>
      {showCompare ? (
        <span className="text-ink/40 line-through">
          {formatEur(shop.teeCompareAtCents)}
        </span>
      ) : null}
      <span>
        {formatEur(shop.teePriceCents)}
        {suffix}
      </span>
    </span>
  );
}
