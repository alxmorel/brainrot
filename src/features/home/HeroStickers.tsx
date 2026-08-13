import { cn } from "@/shared/utils/cn";

export function StickerLabel({
  children,
  tone = "yellow",
  className,
}: {
  children: string;
  tone?: "yellow" | "pink" | "cyan" | "purple" | "white" | "lime";
  className?: string;
}) {
  const tones = {
    yellow: "bg-acid-yellow text-ink",
    pink: "bg-hot-pink text-white",
    cyan: "bg-electric-cyan text-ink",
    purple: "bg-ultraviolet text-white",
    white: "bg-white text-ink",
    lime: "bg-acid-green text-ink",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border-[3px] border-ink px-2.5 py-1",
        "font-display text-[0.7rem] font-bold uppercase tracking-tight shadow-sticker-sm",
        "sm:text-xs",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ArrowDoodle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 80 50"
      className={cn("h-10 w-16 text-ink", className)}
      fill="none"
    >
      <path
        d="M8 28c18-18 38-22 58-8"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M55 12l18 12-20 6"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ScribbleNote({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-display text-sm font-bold uppercase tracking-tight text-ink",
        "rotate-[-8deg] underline decoration-wavy decoration-hot-pink decoration-2",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Jagged black paint stroke behind a brand word. */
export function PaintMark({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-block px-2 py-1", className)}>
      <span
        aria-hidden
        className="absolute inset-x-0 inset-y-[0.12em] -z-0 bg-ink"
        style={{
          clipPath:
            "polygon(1% 22%, 12% 8%, 28% 16%, 46% 6%, 64% 14%, 82% 5%, 98% 18%, 99% 78%, 86% 94%, 68% 86%, 48% 96%, 28% 88%, 10% 96%, 2% 74%)",
        }}
      />
      <span className="relative z-10 bg-gradient-to-r from-hot-pink via-[#ff4d9a] to-ultraviolet bg-clip-text text-transparent">
        {children}
      </span>
    </span>
  );
}

export function StarBurst({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 40"
      className={cn("h-8 w-8", className)}
      fill="#3155FF"
      stroke="#0a0a0a"
      strokeWidth="2.5"
    >
      <path d="M20 2l3.8 11.4L36 14.2l-9 7.2 2.8 11.6L20 26.4 10.2 33l2.8-11.6-9-7.2 12.2-.8L20 2z" />
    </svg>
  );
}

export function MotionLines({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 60 40"
      className={cn("h-8 w-12 text-ink", className)}
      fill="none"
    >
      <path d="M4 8h28M8 20h36M12 32h24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
