"use client";

import { formatOpsDay } from "@/features/ops/OpsPeriodToggle";
import type { OpsFunnelCounts, OpsFunnelStep } from "@/models";

export function OpsBarChart({
  points,
  formatValue = String,
  colorClass = "bg-hot-pink",
}: {
  points: { day: string; value: number }[];
  formatValue?: (value: number) => string;
  colorClass?: string;
}) {
  const max = Math.max(1, ...points.map((point) => point.value));
  const labelEvery = Math.max(1, Math.ceil(points.length / 8));

  return (
    <div>
      <div className="flex h-36 items-end gap-px sm:gap-0.5">
        {points.map((point) => {
          const pct = (point.value / max) * 100;
          return (
            <div
              key={point.day}
              className="flex min-w-0 flex-1 flex-col items-center justify-end"
              title={`${formatOpsDay(point.day)} · ${formatValue(point.value)}`}
            >
              <div
                className={`w-full rounded-t-sm border-[1.5px] border-ink ${colorClass} ${point.value > 0 ? "" : "opacity-0"}`}
                style={{ height: `${point.value > 0 ? Math.max(pct, 6) : 0}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex gap-px sm:gap-0.5 text-[0.6rem] font-bold text-ink/45">
        {points.map((point, index) => (
          <span key={point.day} className="min-w-0 flex-1 truncate text-center">
            {index === 0 ||
            index === points.length - 1 ||
            index % labelEvery === 0
              ? formatOpsDay(point.day)
              : "\u00a0"}
          </span>
        ))}
      </div>
    </div>
  );
}

export function OpsTwinChart({
  points,
  left,
  right,
}: {
  points: { day: string; left: number; right: number }[];
  left: { label: string; format?: (value: number) => string; colorClass: string };
  right: { label: string; format?: (value: number) => string; colorClass: string };
}) {
  const max = Math.max(
    1,
    ...points.flatMap((point) => [point.left, point.right]),
  );
  const labelEvery = Math.max(1, Math.ceil(points.length / 8));
  const leftFmt = left.format ?? String;
  const rightFmt = right.format ?? String;

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-3 text-[0.65rem] font-bold uppercase">
        <span className="inline-flex items-center gap-1.5">
          <span className={`inline-block h-2.5 w-2.5 border-[1.5px] border-ink ${left.colorClass}`} />
          {left.label}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className={`inline-block h-2.5 w-2.5 border-[1.5px] border-ink ${right.colorClass}`} />
          {right.label}
        </span>
      </div>
      <div className="flex h-36 items-end gap-px sm:gap-0.5">
        {points.map((point) => (
          <div
            key={point.day}
            className="flex min-w-0 flex-1 items-end justify-center gap-px"
            title={`${formatOpsDay(point.day)} · ${left.label} ${leftFmt(point.left)} · ${right.label} ${rightFmt(point.right)}`}
          >
            <div
              className={`w-full max-w-[8px] rounded-t-sm border-[1.5px] border-ink ${left.colorClass} ${point.left > 0 ? "" : "opacity-0"}`}
              style={{ height: `${point.left > 0 ? Math.max((point.left / max) * 100, 6) : 0}%` }}
            />
            <div
              className={`w-full max-w-[8px] rounded-t-sm border-[1.5px] border-ink ${right.colorClass} ${point.right > 0 ? "" : "opacity-0"}`}
              style={{ height: `${point.right > 0 ? Math.max((point.right / max) * 100, 6) : 0}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-px sm:gap-0.5 text-[0.6rem] font-bold text-ink/45">
        {points.map((point, index) => (
          <span key={point.day} className="min-w-0 flex-1 truncate text-center">
            {index === 0 ||
            index === points.length - 1 ||
            index % labelEvery === 0
              ? formatOpsDay(point.day)
              : "\u00a0"}
          </span>
        ))}
      </div>
    </div>
  );
}

const FUNNEL_STEPS: { key: OpsFunnelStep; label: string }[] = [
  { key: "page_view", label: "Visites" },
  { key: "view_create", label: "Compose" },
  { key: "add_to_cart", label: "Panier" },
  { key: "begin_checkout", label: "Checkout" },
  { key: "order_placed", label: "Commande" },
];

export function OpsFunnel({
  funnel,
  rates,
}: {
  funnel: OpsFunnelCounts;
  rates: OpsFunnelCounts;
}) {
  const max = Math.max(1, funnel.page_view);

  return (
    <ul className="space-y-2">
      {FUNNEL_STEPS.map((step) => (
        <li key={step.key}>
          <div className="flex justify-between text-sm font-bold">
            <span className="text-ink/60">{step.label}</span>
            <span>
              {funnel[step.key]}
              <span className="ml-2 text-ink/45">{rates[step.key]}%</span>
            </span>
          </div>
          <div className="mt-1 h-3 overflow-hidden rounded-pill border-[2px] border-ink bg-white">
            <div
              className="h-full bg-acid-yellow"
              style={{ width: `${(funnel[step.key] / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
