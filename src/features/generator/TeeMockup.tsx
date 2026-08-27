import Image from "next/image";
import type { Brainrototo, Product } from "@/models";
import { mockupFor } from "@/data/productAssets";
import { defaultTeeColor } from "@/data/teeColors";

import { cn } from "@/shared/utils/cn";

export function TeeMockup({
  product,
  brainrot,
  color = defaultTeeColor,
  className,
  emptyLabel = "Compose ton combo puis génère",
}: {
  product: Product;
  brainrot: Brainrototo | null;
  color?: string;
  className?: string;
  emptyLabel?: string;
}) {
  const mockup = mockupFor(brainrot, color);
  if (mockup && brainrot) {
    return (
      <div
        className={cn(
          "relative mx-auto flex h-full min-h-0 w-full items-center justify-center",
          className,
        )}
      >
        <Image
          src={mockup}
          alt={brainrot.name}
          width={800}
          height={800}
          className="max-h-full w-auto max-w-full object-contain object-center"
          sizes="(max-width: 1024px) 80vw, 30rem"
          priority
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative mx-auto aspect-[5/6] h-full min-h-0 w-full",
        className,
      )}
    >
      <Image
        src={product.baseImage}
        alt={product.name}
        width={400}
        height={480}
        className="h-full w-full object-contain object-center"
      />
      <div className="absolute left-[26%] top-[26%] flex h-[42%] w-[48%] items-center justify-center">
        {brainrot ? (
          <Image
            src={brainrot.image}
            alt=""
            width={220}
            height={220}
            className="h-full w-full object-contain drop-shadow-[3px_3px_0_rgba(10,10,10,0.25)]"
          />
        ) : emptyLabel ? (
          <span className="rotate-[-6deg] rounded-md border-[3px] border-dashed border-ink/40 bg-white/80 px-2 py-1 text-center font-display text-[0.65rem] font-bold uppercase leading-tight text-ink/50 sm:text-xs lg:px-3 lg:py-2 lg:text-sm xl:text-base">
            {emptyLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
