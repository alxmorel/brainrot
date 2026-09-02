"use client";

import { useMemo, useState } from "react";
import { MYSTERY_CART_ID, MYSTERY_PRODUCT_ID } from "@/data/mystery";
import type { TeeSize } from "@/data/sizes";
import { defaultTeeColor, teeColorIds, type TeeColorId } from "@/data/teeColors";
import { useCart } from "@/features/cart/CartProvider";
import { flyToCart } from "@/features/cart/flyToCart";
import { useCheckoutPay } from "@/features/cart/useCheckoutPay";
import { useTeeColor, useTeeSize } from "@/features/product/teeSize";
import type { CartItem } from "@/models";

export function useMysteryBuy(
  initialSize?: TeeSize,
  initialColor?: TeeColorId,
) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [size, setSize] = useTeeSize(initialSize);
  const [color, setColor] = useTeeColor(initialColor);
  const resolvedColor = teeColorIds.includes(color) ? color : defaultTeeColor;
  const item = useMemo<CartItem>(
    () => ({
      id: `${MYSTERY_CART_ID}__${MYSTERY_PRODUCT_ID}__${size}__${resolvedColor}`,
      brainrotId: MYSTERY_CART_ID,
      productId: MYSTERY_PRODUCT_ID,
      size,
      color: resolvedColor,
      quantity: 1,
    }),
    [size, resolvedColor],
  );
  const { pay, pending, error } = useCheckoutPay([item], null);

  function add(event?: { currentTarget: EventTarget }) {
    addItem(MYSTERY_CART_ID, MYSTERY_PRODUCT_ID, size, resolvedColor);
    flyToCart(event?.currentTarget ?? null);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  return {
    size,
    setSize,
    color: resolvedColor,
    setColor,
    pending,
    error,
    justAdded,
    add,
    buy: () => void pay(true),
  };
}
