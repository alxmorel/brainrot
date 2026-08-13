import { cn } from "@/shared/utils/cn";

export function GrainOverlay({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("noise-overlay absolute inset-0 z-[1]", className)}
    />
  );
}
