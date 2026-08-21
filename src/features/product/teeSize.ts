"use client";

import { useCallback, useEffect, useState } from "react";
import { isTeeSize, type TeeSize } from "@/data/sizes";

const STORAGE_KEY = "brainrot-tee-size";

function readStored(): TeeSize | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw && isTeeSize(raw) ? raw : null;
  } catch {
    return null;
  }
}

function writeStored(size: TeeSize) {
  try {
    sessionStorage.setItem(STORAGE_KEY, size);
  } catch {
    /* ignore */
  }
}

export function useTeeSize(initial?: TeeSize | null) {
  const [size, setSizeState] = useState<TeeSize>(initial ?? "M");

  useEffect(() => {
    if (initial) {
      setSizeState(initial);
      writeStored(initial);
      return;
    }
    const stored = readStored();
    if (stored) setSizeState(stored);
  }, [initial]);

  const setSize = useCallback((value: TeeSize) => {
    setSizeState(value);
    writeStored(value);
  }, []);

  return [size, setSize] as const;
}

export function teePageHref(brainrotId: string, size: TeeSize) {
  return `/tee/${brainrotId}?size=${size}`;
}

export function createPageHref(brainrotId: string | null, size: TeeSize) {
  const params = new URLSearchParams();
  if (brainrotId) params.set("brainrot", brainrotId);
  params.set("size", size);
  return `/create?${params.toString()}`;
}
