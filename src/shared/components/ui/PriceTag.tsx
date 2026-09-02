"use client";

import { formatEur } from "@/data/pricing";
import { useShop } from "@/features/shop/ShopProvider";
import { cn } from "@/shared/utils/cn";

export function PriceTag({
  className,
  suffix = " TTC",
  cents,
  compareCents,
}: {
  className?: string;
  suffix?: string;
  cents?: number;
  compareCents?: number;
}) {
  const shop = useShop();
  const paid = cents ?? shop.teePriceCents;
  const compare =
    compareCents ?? (cents == null ? shop.teeCompareAtCents : 0);
  const showCompare = compare > paid;

  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-1.5", className)}>
      {showCompare ? (
        <span className="text-ink/40 line-through">
          {formatEur(compare)}
        </span>
      ) : null}
      <span>
        {formatEur(paid)}
        {suffix}
      </span>
    </span>
  );
}
