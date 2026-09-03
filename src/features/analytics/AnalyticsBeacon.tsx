"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { CONSENT_EVENT, hasAnalyticsConsent, track } from "@/shared/utils/track";

const MAX_MS = 2 * 60 * 60 * 1000;

function watchPath(pathname: string) {
  track("page_view");
  if (pathname === "/" && window.location.hash === "#compose") {
    track("view_create");
  }

  let accumulated = 0;
  let sliceStart = Date.now();
  let sent = false;

  function pause() {
    accumulated += Date.now() - sliceStart;
  }

  function resume() {
    sliceStart = Date.now();
  }

  function onVis() {
    if (document.visibilityState === "hidden") pause();
    else resume();
  }

  function leave() {
    if (sent) return;
    sent = true;
    if (document.visibilityState === "visible") pause();
    const durationMs = Math.max(0, Math.min(accumulated, MAX_MS));
    track("page_leave", { durationMs });
  }

  document.addEventListener("visibilitychange", onVis);
  window.addEventListener("pagehide", leave);

  return () => {
    document.removeEventListener("visibilitychange", onVis);
    window.removeEventListener("pagehide", leave);
    leave();
  };
}

export function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/ops")) return;
    let stop: (() => void) | undefined;

    function start() {
      if (!hasAnalyticsConsent() || stop) return;
      stop = watchPath(pathname);
    }

    start();
    window.addEventListener(CONSENT_EVENT, start);
    return () => {
      window.removeEventListener(CONSENT_EVENT, start);
      stop?.();
    };
  }, [pathname]);

  return null;
}
