"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_SHOP, type ShopPublicSettings } from "@/models/shop";

const ShopContext = createContext<ShopPublicSettings>(DEFAULT_SHOP);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [shop, setShop] = useState<ShopPublicSettings>(DEFAULT_SHOP);

  useEffect(() => {
    void fetch("/api/shop/settings")
      .then((response) => response.json())
      .then((json: unknown) => {
        if (
          json &&
          typeof json === "object" &&
          "ok" in json &&
          (json as { ok: unknown }).ok &&
          "settings" in json
        ) {
          setShop((json as { settings: ShopPublicSettings }).settings);
        }
      })
      .catch(() => undefined);
  }, []);

  return <ShopContext.Provider value={shop}>{children}</ShopContext.Provider>;
}

export function useShop() {
  return useContext(ShopContext);
}
