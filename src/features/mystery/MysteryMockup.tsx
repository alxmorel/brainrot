import Image from "next/image";
import { defaultProduct } from "@/data/products";
import { cn } from "@/shared/utils/cn";

export function MysteryMockup({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-[5/6] h-full min-h-0 w-full",
        className,
      )}
      data-cart-fly
    >
      <Image
        src={defaultProduct.baseImage}
        alt="Mystery Tee"
        width={400}
        height={480}
        className="h-full w-full object-contain object-center"
      />
      <div className="absolute left-[26%] top-[26%] flex h-[42%] w-[48%] items-center justify-center">
        <span className="flex aspect-square w-[78%] rotate-[-8deg] items-center justify-center rounded-full border-[3px] border-ink bg-acid-yellow font-display text-[clamp(2.2rem,7vw,4.2rem)] font-bold leading-none text-ink shadow-sticker">
          ?
        </span>
      </div>
    </div>
  );
}
