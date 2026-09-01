"use client";

import { ShopProvider } from "@/features/shop/ShopProvider";
import { CartProvider } from "@/features/cart/CartProvider";
import { AccountProvider } from "@/features/account/AccountProvider";
import { AnalyticsBeacon } from "@/features/analytics/AnalyticsBeacon";
import { CookieBanner } from "@/features/analytics/CookieBanner";
import { WelcomeOverlay } from "@/features/account/WelcomeOverlay";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ShopProvider>
      <AccountProvider>
        <CartProvider>
          <AnalyticsBeacon />
          <WelcomeOverlay />
          <CookieBanner />
          {children}
        </CartProvider>
      </AccountProvider>
    </ShopProvider>
  );
}
