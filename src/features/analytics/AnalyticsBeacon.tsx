"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/shared/utils/track";

export function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/ops")) return;
    track("page_view");
  }, [pathname]);

  return null;
}
