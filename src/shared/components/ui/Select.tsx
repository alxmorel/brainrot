import type { SelectHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  hint,
  id,
  className,
  disabled,
  options,
  placeholder,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <label className="flex w-full flex-col gap-2">
      {label ? (
        <span className="text-xs font-bold uppercase tracking-wide text-blue">
          {label}
        </span>
      ) : null}
      <select
        id={selectId}
        disabled={disabled}
        className={cn(
          "w-full appearance-none rounded-xl border-[3px] border-ink bg-white px-4 py-3",
          "text-ink shadow-sticker-sm",
          "bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat",
          "transition-[transform,box-shadow] duration-[var(--duration-micro)]",
          "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-45",
          className,
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23111111' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        }}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <span className="text-sm text-muted">{hint}</span> : null}
    </label>
  );
}
