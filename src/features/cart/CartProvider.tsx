"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultTeeColor, isTeeColor } from "@/data/teeColors";
import { track } from "@/shared/utils/track";
import type { CartItem } from "@/models";

const STORAGE_KEY = "brainrot-cart-v3";

type CartContextValue = {
  items: CartItem[];
  count: number;
  addItem: (
    brainrotId: string,
    productId: string,
    size: string,
    color?: string,
  ) => void;
  setQuantity: (id: string, quantity: number) => void;
  setSize: (id: string, size: string) => void;
  setColor: (id: string, color: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function lineId(
  brainrotId: string,
  productId: string,
  size: string,
  color: string,
) {
  return `${brainrotId}__${productId}__${size}__${color}`;
}

function readStored(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is CartItem => {
      if (!item || typeof item !== "object") return false;
      const row = item as CartItem;
      return (
        typeof row.id === "string" &&
        typeof row.brainrotId === "string" &&
        typeof row.productId === "string" &&
        typeof row.size === "string" &&
        typeof row.quantity === "number"
      );
    }).map((row) => ({
      ...row,
      color:
        typeof row.color === "string" && isTeeColor(row.color)
          ? row.color
          : defaultTeeColor,
    }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback(
    (
      brainrotId: string,
      productId: string,
      size: string,
      color: string = defaultTeeColor,
    ) => {
      const id = lineId(brainrotId, productId, size, color);
      setItems((prev) => {
        const existing = prev.find((item) => item.id === id);
        if (existing) {
          return prev.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
          );
        }
        return [
          ...prev,
          { id, brainrotId, productId, size, color, quantity: 1 },
        ];
      });
      track("add_to_cart", { brainrotId, productId, size, color });
    },
    [],
  );

  const setQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }, []);

  function remapLine(
    prev: CartItem[],
    id: string,
    patch: Partial<Pick<CartItem, "size" | "color">>,
  ) {
    const current = prev.find((item) => item.id === id);
    if (!current) return prev;
    const size = patch.size ?? current.size;
    const color = patch.color ?? current.color;
    if (size === current.size && color === current.color) return prev;
    const nextId = lineId(current.brainrotId, current.productId, size, color);
    const rest = prev.filter((item) => item.id !== id);
    const existing = rest.find((item) => item.id === nextId);
    if (existing) {
      return rest.map((item) =>
        item.id === nextId
          ? { ...item, quantity: item.quantity + current.quantity }
          : item,
      );
    }
    return [...rest, { ...current, id: nextId, size, color }];
  }

  const setSize = useCallback((id: string, size: string) => {
    setItems((prev) => remapLine(prev, id, { size }));
  }, []);

  const setColor = useCallback((id: string, color: string) => {
    setItems((prev) => remapLine(prev, id, { color }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    track("remove_from_cart", { id });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem,
      setQuantity,
      setSize,
      setColor,
      removeItem,
      clearCart,
    }),
    [items, addItem, setQuantity, setSize, setColor, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
