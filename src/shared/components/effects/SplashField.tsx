import { cn } from "@/shared/utils/cn";

type SplashTone = "yellow" | "pink" | "purple" | "blue" | "cyan" | "lime";

const toneFill: Record<SplashTone, string> = {
  yellow: "var(--br-yellow)",
  pink: "var(--br-pink)",
  purple: "var(--br-purple)",
  blue: "var(--br-blue)",
  cyan: "var(--br-cyan)",
  lime: "var(--br-lime)",
};

export function SplashBlob({
  tone,
  className,
}: {
  tone: SplashTone;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute blur-[2px]", className)}
      style={{
        background: toneFill[tone],
        borderRadius: "42% 58% 63% 37% / 48% 38% 62% 52%",
        opacity: 0.78,
        filter: "blur(28px) saturate(1.15)",
      }}
    />
  );
}

/** Soft paint explosions like the Brainrototo Wear reference — not neon glow orbs. */
export function SplashField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <SplashBlob
        tone="yellow"
        className="left-[-8%] top-[8%] h-[42vw] max-h-[420px] w-[48vw] max-w-[520px]"
      />
      <SplashBlob
        tone="pink"
        className="right-[-6%] top-[-4%] h-[36vw] max-h-[380px] w-[40vw] max-w-[460px]"
      />
      <SplashBlob
        tone="purple"
        className="bottom-[-10%] left-[8%] h-[38vw] max-h-[400px] w-[44vw] max-w-[480px]"
      />
      <SplashBlob
        tone="blue"
        className="right-[6%] bottom-[4%] h-[32vw] max-h-[340px] w-[36vw] max-w-[400px]"
      />
      <SplashBlob
        tone="cyan"
        className="left-[35%] top-[42%] h-[22vw] max-h-[240px] w-[26vw] max-w-[280px] opacity-70"
      />
    </div>
  );
}
