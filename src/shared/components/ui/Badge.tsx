import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import type { Rarity } from "@/models";

export type BadgeTone =
  | "pink"
  | "cyan"
  | "green"
  | "orange"
  | "violet"
  | "yellow"
  | "blue"
  | "holo";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  rarity?: Rarity;
  children: ReactNode;
}

const toneClass: Record<BadgeTone, string> = {
  pink: "bg-hot-pink text-white",
  cyan: "bg-electric-cyan text-ink",
  green: "bg-acid-green text-ink",
  orange: "bg-fluoro-orange text-white",
  violet: "bg-ultraviolet text-white",
  yellow: "bg-acid-yellow text-ink",
  blue: "bg-blue text-white",
  holo: "bg-holo animate-holo text-ink",
};

const rarityTone: Record<Rarity, BadgeTone> = {
  common: "cyan",
  rare: "blue",
  epic: "pink",
  legendary: "holo",
};

export function Badge({
  tone,
  rarity,
  className,
  children,
  ...props
}: BadgeProps) {
  const resolvedTone = tone ?? (rarity ? rarityTone[rarity] : "pink");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border-[3px] border-ink px-3 py-1 shadow-sticker-sm",
        "font-display text-[0.75rem] font-bold uppercase tracking-tight",
        toneClass[resolvedTone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
