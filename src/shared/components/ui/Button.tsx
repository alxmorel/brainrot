"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "holo" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  "aria-label"?: string;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-hot-pink text-white border-ink shadow-sticker hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-sticker-sm focus-visible:ring-hot-pink",
  secondary:
    "bg-electric-cyan text-ink border-ink shadow-sticker hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-sticker-sm focus-visible:ring-electric-cyan",
  ghost:
    "bg-white text-ink border-ink shadow-sticker-sm hover:bg-acid-yellow focus-visible:ring-ink",
  holo: "bg-holo animate-holo text-ink border-ink shadow-sticker focus-visible:ring-ultraviolet",
  danger:
    "bg-fluoro-orange text-white border-ink shadow-sticker hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-sticker-sm focus-visible:ring-fluoro-orange",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs tracking-tight",
  md: "px-6 py-3 text-sm tracking-tight",
  lg: "px-8 py-4 text-base tracking-tight",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  type = "button",
  onClick,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      whileTap={reducedMotion || disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-pill border-[3px] font-display font-bold uppercase",
        "transition-[transform,box-shadow,background-color] duration-[var(--duration-button)] ease-[var(--ease-out)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
    >
      {children}
    </motion.button>
  );
}
