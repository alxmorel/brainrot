import { formatEur } from "@/data/pricing";
import { cn } from "@/shared/utils/cn";

export function UnusedCredit({
  cents,
  compact = false,
  className,
}: {
  cents: number;
  compact?: boolean;
  className?: string;
}) {
  if (cents <= 0) return null;
  return (
    <p
      className={cn(
        "font-display font-bold uppercase leading-tight text-red",
        compact ? "text-[0.6rem] sm:text-[0.65rem]" : "text-sm",
        className,
      )}
    >
      {formatEur(cents)} de crédit inutilisé
    </p>
  );
}
