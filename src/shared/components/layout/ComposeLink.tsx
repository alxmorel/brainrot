"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { track } from "@/shared/utils/track";

function scrollToCompose() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("compose")?.scrollIntoView({
    behavior: reduced ? "instant" : "smooth",
  });
  if (window.location.hash !== "#compose") {
    window.history.replaceState(null, "", "/#compose");
  }
}

export function ComposeLink({
  children,
  className,
  cta,
  source,
}: {
  children: ReactNode;
  className?: string;
  cta?: "composer" | "bande";
  source?: string;
}) {
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (cta) {
      track(cta === "composer" ? "cta_composer" : "cta_bande", {
        ...(source ? { source } : {}),
      });
    }
    if (pathname !== "/") return;
    event.preventDefault();
    scrollToCompose();
  }

  return (
    <Link href="/#compose" className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
