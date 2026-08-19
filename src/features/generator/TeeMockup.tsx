import Image from "next/image";
import type { Brainrot, Product } from "@/models";

import { cn } from "@/shared/utils/cn";

export function TeeMockup({
  product,
  brainrot,
  className,
}: {
  product: Product;
  brainrot: Brainrot | null;
  className?: string;
}) {
  return (
    <div className={cn("relative mx-auto w-full max-w-[22rem]", className)}>
      <Image
        src={product.baseImage}
        alt={product.name}
        width={400}
        height={480}
        className="h-auto w-full"
      />
      <div className="absolute left-[31%] top-[30%] flex h-[32%] w-[38%] items-center justify-center">
        {brainrot ? (
          <Image
            src={brainrot.image}
            alt=""
            width={220}
            height={220}
            className="h-full w-full object-contain drop-shadow-[3px_3px_0_rgba(10,10,10,0.25)]"
          />
        ) : (
          <span className="rotate-[-6deg] rounded-md border-[3px] border-dashed border-ink/40 bg-white/80 px-2 py-1 text-center font-display text-[0.65rem] font-bold uppercase leading-tight text-ink/50">
            Choisis un Brainrot
          </span>
        )}
      </div>
    </div>
  );
}
