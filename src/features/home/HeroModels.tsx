import Image from "next/image";
import { cn } from "@/shared/utils/cn";

/** In-flow on mobile; oversized and bottom-anchored from sm. */
export function HeroModels({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none relative z-10 mx-auto flex h-[34vh] w-full items-end justify-center",
        "sm:absolute sm:bottom-0 sm:right-0 sm:mx-0 sm:h-[58dvh] sm:w-[68%]",
        "lg:h-[82dvh] lg:w-[62%]",
        "xl:w-[58%]",
        className,
      )}
    >
      <div className="flex h-full w-auto items-end justify-center">
        <Image
          src="/assets/products/lemon_sloth/person1_profile-left.png"
          alt=""
          width={900}
          height={900}
          priority
          sizes="(max-width: 640px) 55vw, (max-width: 1024px) 40vw, 32vw"
          className="relative z-10 h-full w-auto max-w-none origin-bottom object-contain object-bottom mix-blend-multiply -mr-[32%]"
        />
        <Image
          src="/assets/products/banacrocodilo_bambino/deep-black/person2_front.png"
          alt="Deux jeunes avec des tees Banacrocodilo Bambino"
          width={900}
          height={900}
          priority
          sizes="(max-width: 640px) 55vw, (max-width: 1024px) 40vw, 32vw"
          className="relative z-20 h-full w-auto max-w-none origin-bottom object-contain object-bottom sm:scale-[0.90] lg:scale-[0.95]"
        />
      </div>
    </div>
  );
}
