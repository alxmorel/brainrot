"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { CONSENT_EVENT, hasAnalyticsConsent, track } from "@/shared/utils/track";

export function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    function ping() {
      if (pathname.startsWith("/ops")) return;
      if (!hasAnalyticsConsent()) return;
      track("page_view");
      if (pathname === "/" && window.location.hash === "#compose") {
        track("view_create");
      }
    }
    ping();
    window.addEventListener(CONSENT_EVENT, ping);
    return () => window.removeEventListener(CONSENT_EVENT, ping);
  }, [pathname]);

  return null;
}
