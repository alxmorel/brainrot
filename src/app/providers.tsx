"use client";

import { CartProvider } from "@/features/cart/CartProvider";
import { AnalyticsBeacon } from "@/features/analytics/AnalyticsBeacon";
import { CookieBanner } from "@/features/analytics/CookieBanner";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <AnalyticsBeacon />
      <CookieBanner />
      {children}
    </CartProvider>
  );
}
