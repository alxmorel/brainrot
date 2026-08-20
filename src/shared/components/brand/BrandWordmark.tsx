import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

/** Bubble logo treatment inspired by Brainrototo Wear reference. */
export function BrandWordmark({
  className,
  subtitle,
}: {
  className?: string;
  subtitle?: ReactNode;
}) {
  return (
    <div className={cn("inline-flex flex-col items-start", className)}>
      <span
        className="font-display text-[clamp(2.5rem,8vw,4.5rem)] font-bold uppercase leading-[0.85] tracking-[-0.04em] text-white"
        style={{
          WebkitTextStroke: "4px #0a0a0a",
          paintOrder: "stroke fill",
          textShadow: "5px 5px 0 #0a0a0a",
        }}
      >
        Brainrototo
      </span>
      {subtitle ? (
        <span className="font-display bg-gradient-to-r from-blue to-ultraviolet bg-clip-text text-[clamp(1.4rem,4vw,2.2rem)] font-bold uppercase tracking-[-0.03em] text-transparent">
          {subtitle}
        </span>
      ) : null}
    </div>
  );
}
