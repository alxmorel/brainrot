"use client";

import { Button } from "@/shared/components/ui";

const OPTIONS = [7, 30, 90] as const;

export function OpsPeriodToggle({
  days,
  onChange,
}: {
  days: number;
  onChange: (days: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((value) => (
        <Button
          key={value}
          size="sm"
          variant={days === value ? "primary" : "ghost"}
          onClick={() => onChange(value)}
        >
          {value}j
        </Button>
      ))}
    </div>
  );
}

export function formatOpsDay(ymd: string) {
  const [year, month, day] = ymd.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

export function formatOpsRange(from: string, to: string, days: number) {
  return `${formatOpsDay(from)} → ${formatOpsDay(to)} · ${days} j · Paris`;
}
