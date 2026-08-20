import Image from "next/image";
import { cn } from "@/shared/utils/cn";

/** Models as primary visual mass — oversized, bottom-anchored, overlaps copy. */
export function HeroModels({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute bottom-0 z-10 flex items-end justify-center",
        "inset-x-0 h-[58dvh]",
        "sm:inset-x-auto sm:right-0 sm:h-[62dvh] sm:w-[68%] sm:justify-end",
        "lg:h-[90dvh] lg:w-[62%]",
        "xl:w-[58%]",
        className,
      )}
    >
      <Image
        src="/assets/products/hero-models.png"
        alt="Deux jeunes avec t-shirts Brainrototo personnalisables"
        width={1024}
        height={682}
        priority
        sizes="(max-width: 640px) 120vw, (max-width: 1024px) 70vw, 62vw"
        className="h-full w-auto max-w-none origin-bottom scale-[1.22] object-contain object-bottom sm:scale-[1.08] sm:object-right lg:scale-[1.12]"
      />
    </div>
  );
}
