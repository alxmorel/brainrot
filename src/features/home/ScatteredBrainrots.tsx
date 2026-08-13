import Image from "next/image";
import { cn } from "@/shared/utils/cn";

/** Decorative brainrots placed to fill voids and bridge text/models. */
export function ScatteredBrainrots({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 z-20", className)}
    >
      <div className="absolute bottom-[16%] left-[-2%] w-[50vw] max-w-[170px] rotate-[-12deg] sm:bottom-[13%] sm:left-[1%] sm:max-w-[160px] lg:bottom-[2%] lg:left-[2%] lg:max-w-[200px]">
        <Image
          src="/assets/brainrots/banana-croc.png"
          alt=""
          width={400}
          height={400}
          className="h-auto w-full drop-shadow-[5px_5px_0_rgba(10,10,10,0.28)]"
        />
      </div>

      <div className="absolute right-[0%] top-[9%] w-[52vw] max-w-[170px] rotate-[10deg] sm:right-[0%] sm:top-[10%] sm:max-w-[150px] lg:right-[0%] lg:top-[7%] lg:max-w-[190px]">
        <Image
          src="/assets/brainrots/lemon-sloth.png"
          alt=""
          width={400}
          height={400}
          className="h-auto w-full drop-shadow-[5px_5px_0_rgba(10,10,10,0.28)]"
        />
      </div>

      <div className="absolute bottom-[25%] right-[0%] w-[35vw] max-w-[200px] rotate-[5deg] sm:block lg:bottom-[20%] lg:right-[0%] lg:max-w-[230px]">
        <Image
          src="/assets/brainrots/elephant-cactus.png"
          alt=""
          width={400}
          height={400}
          className="h-auto w-full drop-shadow-[5px_5px_0_rgba(10,10,10,0.28)]"
        />
      </div>
    </div>
  );
}
