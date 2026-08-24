import { cn } from "@/shared/utils/cn";

const steps = [
  { id: "cart", label: "Panier" },
  { id: "pay", label: "Paiement" },
  { id: "done", label: "Confirmation" },
] as const;

export type CheckoutStep = (typeof steps)[number]["id"];

export function CheckoutProgress({ step }: { step: CheckoutStep }) {
  const activeIndex = steps.findIndex((item) => item.id === step);

  return (
    <nav
      aria-label="Étapes de commande"
      className="flex flex-wrap items-center gap-2 text-[0.65rem] font-bold uppercase tracking-wide sm:text-xs"
    >
      {steps.map((item, index) => {
        const done = index < activeIndex;
        const current = index === activeIndex;
        return (
          <div key={item.id} className="flex items-center gap-2">
            {index > 0 ? (
              <span aria-hidden className="text-ink/25">
                →
              </span>
            ) : null}
            <span
              className={cn(
                "rounded-pill border-[3px] px-2.5 py-1",
                current
                  ? "border-ink bg-hot-pink text-white shadow-sticker-sm"
                  : done
                    ? "border-ink bg-acid-yellow text-ink"
                    : "border-ink/25 bg-white text-ink/45",
              )}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
}
