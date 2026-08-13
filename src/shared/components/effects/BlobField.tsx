import { cn } from "@/shared/utils/cn";

export type BlobTone = "pink" | "cyan" | "violet" | "green" | "orange" | "yellow";

export interface BlobProps {
  tone?: BlobTone;
  className?: string;
  animated?: boolean;
}

const toneClass: Record<BlobTone, string> = {
  pink: "bg-hot-pink/35",
  cyan: "bg-electric-cyan/35",
  violet: "bg-ultraviolet/30",
  green: "bg-acid-green/35",
  orange: "bg-fluoro-orange/30",
  yellow: "bg-acid-yellow/40",
};

export function Blob({ tone = "pink", className, animated = true }: BlobProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute blur-3xl",
        toneClass[tone],
        animated && "animate-blob",
        className,
      )}
    />
  );
}

export function BlobField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <Blob tone="pink" className="left-[-8%] top-[-6%] h-64 w-64" />
      <Blob tone="yellow" className="right-[-4%] top-[12%] h-56 w-56" />
      <Blob tone="cyan" className="bottom-[-8%] left-[18%] h-72 w-72" />
      <Blob tone="green" className="right-[14%] bottom-[6%] h-48 w-48" />
    </div>
  );
}
