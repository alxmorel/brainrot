import Image from "next/image";
import { cn } from "@/shared/utils/cn";

/** In-flow on mobile; oversized and bottom-anchored from sm. */
export function HeroModels({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none relative z-10 mx-auto flex h-[34vh] w-full items-end justify-center",
        "sm:absolute sm:bottom-0 sm:right-0 sm:mx-0 sm:h-[58dvh] sm:w-[68%] sm:justify-end",
        "lg:h-[82dvh] lg:w-[62%]",
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
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 62vw"
        className="h-full w-auto max-w-none origin-bottom object-contain object-bottom sm:scale-[1.08] sm:object-right lg:scale-[1.12]"
      />
    </div>
  );
}
