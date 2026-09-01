"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AccountMe } from "@/models";

type AccountContextValue = {
  me: AccountMe | null;
  loaded: boolean;
  refresh: () => Promise<void>;
};

const AccountContext = createContext<AccountContextValue>({
  me: null,
  loaded: false,
  refresh: async () => undefined,
});

export function AccountProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<AccountMe | null>(null);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/account/me");
    const json: unknown = await response.json().catch(() => null);
    if (
      json &&
      typeof json === "object" &&
      "ok" in json &&
      (json as { ok: unknown }).ok &&
      "user" in json
    ) {
      const user = (json as { user: AccountMe | null }).user;
      setMe(user);
    } else {
      setMe(null);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <AccountContext.Provider value={{ me, loaded, refresh }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  return useContext(AccountContext);
}
