import { cn } from "@/shared/utils/cn";

const promises = [
  {
    title: "Design original et fun",
    subtitle: "100% Brainrototo",
    icon: "tee" as const,
  },
  {
    title: "Pour les 10-16 ans",
    subtitle: "Style, confort et bonne vibe",
    icon: "bolt" as const,
  },
  {
    title: "Qualité top confort max",
    subtitle: "Tissus doux et imprimés résistants",
    icon: "shield" as const,
  },
  {
    title: "Fais rire. Sois toi.",
    subtitle: "Exprime ton style sans prise de tête",
    icon: "smile" as const,
  },
];

function PromiseIcon({ icon }: { icon: (typeof promises)[number]["icon"] }) {
  const size = "h-11 w-11 shrink-0 sm:h-12 sm:w-12 lg:h-14 lg:w-14";

  if (icon === "tee") {
    return (
      <svg viewBox="0 0 64 64" className={size} aria-hidden>
        <path
          d="M18 18 8 24l6 10 6-4v22h24V30l6 4 6-10-10-6c-2 4-6 7-12 7s-10-3-12-7z"
          fill="#FF2FB3"
          stroke="#0a0a0a"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="28" cy="34" r="2.2" fill="#0a0a0a" />
        <circle cx="36" cy="34" r="2.2" fill="#0a0a0a" />
        <path
          d="M27 40c2.5 3 7.5 3 10 0"
          fill="none"
          stroke="#0a0a0a"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === "bolt") {
    return (
      <svg viewBox="0 0 64 64" className={size} aria-hidden>
        <path
          d="M34 6 16 36h14l-4 22 24-34H34l6-18z"
          fill="#7CFF00"
          stroke="#0a0a0a"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "shield") {
    return (
      <svg viewBox="0 0 64 64" className={size} aria-hidden>
        <path
          d="M32 6 52 14v18c0 14-8 24-20 30C20 56 12 46 12 32V14l20-8z"
          fill="#3155FF"
          stroke="#0a0a0a"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="m24 32 6 6 12-14"
          fill="none"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" className={size} aria-hidden>
      <circle cx="32" cy="32" r="22" fill="#DFFF00" stroke="#0a0a0a" strokeWidth="3" />
      <circle cx="24" cy="28" r="3.2" fill="#0a0a0a" />
      <circle cx="40" cy="28" r="3.2" fill="#0a0a0a" />
      <path
        d="M22 38c3.5 6 16.5 6 20 0"
        fill="none"
        stroke="#0a0a0a"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Compact promises strip — max 900px, no border frame, large icons. */
export function PromisesBar({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "pointer-events-auto absolute bottom-2 z-40 left-1/2 w-full max-w-[900px] -translate-x-1/2 px-3",
        "sm:bottom-3 lg:bottom-4",
        className,
      )}
    >
      <ul className="grid grid-cols-2 rounded-2xl bg-white px-2 py-3 md:grid-cols-4 sm:px-3 sm:py-3.5">
        {promises.map((promise, index) => (
          <li
            key={promise.title}
            className={cn(
              "flex min-w-0 items-center gap-2.5 px-2.5 sm:gap-3 sm:px-3.5",
              index % 2 === 1 && "border-l border-ink/15",
              index >= 2 && "border-t border-ink/15 pt-3 md:border-t-0 md:pt-0",
              index > 0 && "md:border-l md:border-t-0 md:border-ink/15 md:pt-0",
            )}
          >
            <PromiseIcon icon={promise.icon} />
            <div className="min-w-0">
              <p className="font-display text-[0.85rem] font-bold uppercase leading-[1.05] tracking-[-0.03em] text-ink sm:text-[0.95rem] lg:text-[1.05rem]">
                {promise.title}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs font-medium leading-snug text-ink/55 sm:text-sm">
                {promise.subtitle}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
