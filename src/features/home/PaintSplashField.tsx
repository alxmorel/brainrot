import { cn } from "@/shared/utils/cn";

/** Sharp, irregular paint / ink splashes - homepage campaign only. No blur-dominant look. */
export function PaintSplashField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <svg
        className="absolute -left-[8%] -top-[6%] h-[70%] w-[75%] max-w-none"
        viewBox="0 0 800 700"
        fill="none"
      >
        <path
          fill="var(--br-yellow)"
          d="M120 80c90-60 210-70 320-30 95 35 170 40 250 10 20-8 48 12 36 34-40 72-30 150 18 210 35 45 20 95-30 110-70 22-150 8-210 55-55 42-130 55-190 20-75-42-95-130-70-205 18-55-8-120 20-165 22-35 55-55 90-70 18-8 38 20 22 41-28 38-12 95 35 110 48 16 55-40 28-78-12-18 5-42 25-32z"
        />
        <circle cx="520" cy="95" r="14" fill="var(--br-yellow)" />
        <circle cx="560" cy="130" r="8" fill="var(--br-yellow)" />
        <circle cx="490" cy="160" r="6" fill="var(--br-orange)" />
        <path
          fill="var(--br-orange)"
          d="M90 220c40-25 95-15 120 20 18 26-10 55-40 48-35-8-70 18-55 52 12 28-22 48-48 32-40-24-55-90-20-130 8-10 28-8 43-22z"
        />
      </svg>

      <svg
        className="absolute -right-[12%] top-[-4%] h-[58%] w-[62%]"
        viewBox="0 0 700 600"
        fill="none"
      >
        <path
          fill="var(--br-pink)"
          d="M180 60c110-45 250-20 340 70 55 55 95 70 150 45 28-12 55 18 38 45-55 90-20 185 55 250 22 20-5 58-35 48-95-32-185 10-260 55-70 42-165 30-210-25-55-68-40-170 15-235 30-35 55-85 40-130-8-24 20-48 45-35 38 20 55-35 28-70-15-20 5-48 30-38z"
        />
        <circle cx="560" cy="210" r="16" fill="var(--br-pink)" />
        <circle cx="600" cy="250" r="9" fill="var(--br-pink)" />
        <circle cx="530" cy="280" r="7" fill="var(--br-purple)" />
        <path
          fill="var(--br-purple)"
          opacity="0.95"
          d="M420 40c55-10 95 35 70 80-18 32-70 28-75-8-4-28 20-55 5-72z"
        />
      </svg>

      <svg
        className="absolute -bottom-[18%] -left-[10%] h-[65%] w-[70%]"
        viewBox="0 0 780 650"
        fill="none"
      >
        <path
          fill="var(--br-purple)"
          d="M80 220c95-80 240-95 350-40 85 42 170 35 245-10 30-18 62 14 45 45-50 95 5 190 80 250 18 14-8 48-32 40-110-35-210 25-310 40-95 15-195-25-245-100-42-62-35-155 20-210 28-28 50-75 35-115-10-28 25-52 50-35 40 28 70-25 40-60-18-22 8-55 38-42z"
        />
        <circle cx="170" cy="480" r="18" fill="var(--br-purple)" />
        <circle cx="220" cy="520" r="10" fill="var(--br-blue)" />
        <circle cx="140" cy="540" r="7" fill="var(--br-pink)" />
        <path
          fill="var(--br-blue)"
          d="M40 360c48-30 110-10 125 40 10 35-30 55-58 40-40-22-70 5-55 45 10 28-25 45-48 28C-20 470-15 390 40 360z"
        />
      </svg>

      <svg
        className="absolute -bottom-[8%] -right-[8%] h-[55%] w-[58%]"
        viewBox="0 0 680 560"
        fill="none"
      >
        <path
          fill="var(--br-blue)"
          d="M90 180c85-70 220-85 320-30 70 38 150 20 210-25 25-18 58 10 42 40-45 85 15 170 85 225 16 12-10 42-32 34-95-35-185 20-275 35-90 15-185-30-230-105-35-58-25-145 25-195 28-28 48-80 30-120-12-26 22-50 48-32 35 24 65-30 35-62-16-18 10-48 38-35z"
        />
        <circle cx="520" cy="360" r="15" fill="var(--br-cyan)" />
        <circle cx="560" cy="400" r="8" fill="var(--br-blue)" />
        <path
          fill="var(--br-cyan)"
          d="M280 420c55-35 120 5 105 65-12 45-75 40-95-5-15-35 15-70-10-90z"
        />
        <path
          fill="var(--br-lime)"
          d="M430 120c40-28 95-5 90 42-4 35-55 40-72 8-14-28 5-55-18-70z"
        />
      </svg>

      <svg
        className="absolute left-[38%] top-[28%] h-[28%] w-[30%] opacity-90"
        viewBox="0 0 400 320"
        fill="none"
      >
        <path
          fill="var(--br-cyan)"
          d="M40 140c45-70 150-95 230-45 55 35 95 20 120-15 12-16 38-2 30 18-28 70 20 130 85 165 8 4-2 22-14 18-70-22-135 25-200 18-70-8-130-55-145-120-8-32 20-70 45-55 28 18 48-35 22-58z"
        />
        <circle cx="300" cy="70" r="10" fill="var(--br-cyan)" />
        <circle cx="330" cy="100" r="6" fill="var(--br-lime)" />
      </svg>

      <svg
        className="absolute left-[10%] top-[55%] h-[22%] w-[28%] -rotate-12"
        viewBox="0 0 320 180"
        fill="none"
      >
        <path
          fill="var(--br-orange)"
          d="M10 90c40-55 120-80 190-45 40 20 80 10 100-20 14-20 42-8 34 16-25 70 30 100 70 120-70 15-130-20-190-10-55 8-110 5-140-35-18-24 5-55 36-45 25 8 40-30 18-48z"
        />
        <circle cx="260" cy="40" r="9" fill="var(--br-orange)" />
        <circle cx="285" cy="65" r="5" fill="var(--br-yellow)" />
        <circle cx="240" cy="70" r="4" fill="var(--br-pink)" />
      </svg>

      <svg
        className="absolute right-[22%] top-[62%] h-14 w-24 rotate-[25deg]"
        viewBox="0 0 120 50"
        fill="var(--br-lime)"
      >
        <path d="M4 28c20-22 48-30 78-12 8 5 6 18-4 16-22-4-40 14-62 8-14-4-22-8-12-12z" />
        <circle cx="100" cy="14" r="6" />
        <circle cx="112" cy="28" r="4" />
      </svg>
    </div>
  );
}
