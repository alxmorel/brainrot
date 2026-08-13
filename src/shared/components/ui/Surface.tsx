import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export type SurfaceVariant =
  | "solid"
  | "glass"
  | "holo"
  | "pop"
  | "acid"
  | "paper"
  | "sticker";

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SurfaceVariant;
  padded?: boolean;
  children: ReactNode;
}

const variantClass: Record<SurfaceVariant, string> = {
  solid: "bg-white border-[3px] border-ink shadow-sticker-sm",
  paper: "bg-ink-soft border-[3px] border-ink shadow-sticker-sm",
  glass:
    "bg-white/80 border-[3px] border-ink backdrop-blur-md shadow-sticker-sm",
  holo: "border-holo shadow-sticker",
  pop: "bg-electric-cyan border-[3px] border-ink shadow-sticker",
  acid: "bg-acid-yellow border-[3px] border-ink shadow-sticker",
  sticker: "bg-white border-[3px] border-ink shadow-sticker rotate-[-1.5deg]",
};

export function Surface({
  variant = "solid",
  padded = true,
  className,
  children,
  ...props
}: SurfaceProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        padded && "p-5 sm:p-6",
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
