import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

/** Black marker / brush stroke behind a brand word - reference hero highlight. */
export function MarkHighlight({
  children,
  className,
  rotate = -2,
}: {
  children: ReactNode;
  className?: string;
  rotate?: number;
}) {
  return (
    <span
      className={cn(
        "relative inline-block px-3 py-1 font-display font-bold",
        className,
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 inset-y-1 -z-0 rounded-[1.1rem] bg-ink"
        style={{
          clipPath:
            "polygon(2% 18%, 8% 8%, 22% 14%, 38% 6%, 55% 12%, 72% 5%, 88% 14%, 98% 22%, 96% 78%, 88% 90%, 70% 84%, 52% 94%, 34% 86%, 18% 92%, 6% 80%, 3% 55%)",
        }}
      />
      <span className="relative z-10 bg-gradient-to-r from-hot-pink via-ultraviolet to-blue bg-clip-text text-transparent">
        {children}
      </span>
    </span>
  );
}
