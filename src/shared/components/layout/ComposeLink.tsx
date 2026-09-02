"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { track } from "@/shared/utils/track";

export function scrollToHomeHash(hash: string) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(hash)?.scrollIntoView({
    behavior: reduced ? "instant" : "smooth",
  });
  const next = `/#${hash}`;
  if (`${window.location.pathname}${window.location.hash}` !== next) {
    window.history.replaceState(null, "", next);
  }
  window.dispatchEvent(new Event("hashchange"));
}

export function HomeHashLink({
  hash,
  children,
  className,
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent,
  onNavigate,
}: {
  hash: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-current"?: "page" | undefined;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onNavigate?.();
    if (pathname !== "/") return;
    event.preventDefault();
    scrollToHomeHash(hash);
  }

  return (
    <Link
      href={`/#${hash}`}
      className={className}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}

export function ComposeLink({
  children,
  className,
  cta,
  source,
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent,
}: {
  children: ReactNode;
  className?: string;
  cta?: "composer" | "bande";
  source?: string;
  "aria-label"?: string;
  "aria-current"?: "page" | undefined;
}) {
  return (
    <HomeHashLink
      hash="compose"
      className={className}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      onNavigate={
        cta
          ? () =>
              track(cta === "composer" ? "cta_composer" : "cta_bande", {
                ...(source ? { source } : {}),
              })
          : undefined
      }
    >
      {children}
    </HomeHashLink>
  );
}
