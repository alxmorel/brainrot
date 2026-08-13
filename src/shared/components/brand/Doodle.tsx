import { cn } from "@/shared/utils/cn";

type DoodleKind = "star" | "bolt" | "smile" | "burst";

export function Doodle({
  kind = "star",
  className,
}: {
  kind?: DoodleKind;
  className?: string;
}) {
  const common = cn("pointer-events-none absolute text-ink", className);

  if (kind === "bolt") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className={cn(common, "h-8 w-8")}
        fill="currentColor"
      >
        <path d="M13 2 4 14h7l-1 8 10-14h-7l0-6z" stroke="#0a0a0a" strokeWidth="1.5" />
      </svg>
    );
  }

  if (kind === "smile") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 48 48"
        className={cn(common, "h-10 w-10")}
        fill="none"
      >
        <circle cx="24" cy="24" r="18" fill="#DFFF00" stroke="#0a0a0a" strokeWidth="3" />
        <circle cx="17" cy="20" r="2.5" fill="#0a0a0a" />
        <circle cx="31" cy="20" r="2.5" fill="#0a0a0a" />
        <path
          d="M15 28c2.5 4 6 6 9 6s6.5-2 9-6"
          stroke="#0a0a0a"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (kind === "burst") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 40 40"
        className={cn(common, "h-9 w-9")}
        fill="#FF2FB3"
        stroke="#0a0a0a"
        strokeWidth="2"
      >
        <path d="M20 2l3 12 12 3-12 3-3 12-3-12-12-3 12-3 3-12z" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 40 40"
      className={cn(common, "h-8 w-8")}
      fill="#3155FF"
      stroke="#0a0a0a"
      strokeWidth="2.5"
    >
      <path d="M20 3l4.2 11.2L36 15l-9 7.4L29.5 34 20 27.2 10.5 34l2.5-11.6L4 15l11.8-.8L20 3z" />
    </svg>
  );
}
