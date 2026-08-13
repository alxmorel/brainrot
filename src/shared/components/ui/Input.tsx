import type { InputHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export function Input({
  label,
  hint,
  id,
  className,
  disabled,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="flex w-full flex-col gap-2">
      {label ? (
        <span className="text-xs font-bold uppercase tracking-wide text-hot-pink">
          {label}
        </span>
      ) : null}
      <input
        id={inputId}
        disabled={disabled}
        className={cn(
          "w-full rounded-xl border-[3px] border-ink bg-white px-4 py-3",
          "text-ink placeholder:text-muted shadow-sticker-sm",
          "transition-[transform,box-shadow] duration-[var(--duration-micro)]",
          "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-45",
          className,
        )}
        {...props}
      />
      {hint ? <span className="text-sm text-muted">{hint}</span> : null}
    </label>
  );
}
