"use client";

import { useCallback, useEffect, useState } from "react";
import { isTeeSize, type TeeSize } from "@/data/sizes";
import {
  defaultTeeColor,
  isTeeColor,
  type TeeColorId,
} from "@/data/teeColors";

const SIZE_KEY = "brainrot-tee-size";
const COLOR_KEY = "brainrot-tee-color";

function readStoredSize(): TeeSize | null {
  try {
    const raw = sessionStorage.getItem(SIZE_KEY);
    return raw && isTeeSize(raw) ? raw : null;
  } catch {
    return null;
  }
}

function writeStoredSize(size: TeeSize) {
  try {
    sessionStorage.setItem(SIZE_KEY, size);
  } catch {
    /* ignore */
  }
}

function readStoredColor(): TeeColorId | null {
  try {
    const raw = sessionStorage.getItem(COLOR_KEY);
    return raw && isTeeColor(raw) ? raw : null;
  } catch {
    return null;
  }
}

function writeStoredColor(color: TeeColorId) {
  try {
    sessionStorage.setItem(COLOR_KEY, color);
  } catch {
    /* ignore */
  }
}

export function useTeeSize(initial?: TeeSize | null) {
  const [size, setSizeState] = useState<TeeSize>(initial ?? "M");

  useEffect(() => {
    if (initial) {
      setSizeState(initial);
      writeStoredSize(initial);
      return;
    }
    const stored = readStoredSize();
    if (stored) setSizeState(stored);
  }, [initial]);

  const setSize = useCallback((value: TeeSize) => {
    setSizeState(value);
    writeStoredSize(value);
  }, []);

  return [size, setSize] as const;
}

export function useTeeColor(initial?: TeeColorId | null) {
  const [color, setColorState] = useState<TeeColorId>(
    initial ?? defaultTeeColor,
  );

  useEffect(() => {
    if (initial) {
      setColorState(initial);
      writeStoredColor(initial);
      return;
    }
    const stored = readStoredColor();
    if (stored) setColorState(stored);
  }, [initial]);

  const setColor = useCallback((value: TeeColorId) => {
    setColorState(value);
    writeStoredColor(value);
  }, []);

  return [color, setColor] as const;
}

export function teePageHref(
  brainrotId: string,
  size: TeeSize,
  color: TeeColorId = defaultTeeColor,
) {
  return `/tee/${brainrotId}?size=${size}&color=${color}`;
}

export function createPageHref(
  brainrotId: string | null,
  size: TeeSize,
  color: TeeColorId = defaultTeeColor,
) {
  const params = new URLSearchParams();
  if (brainrotId) params.set("brainrot", brainrotId);
  params.set("size", size);
  params.set("color", color);
  return `/create?${params.toString()}`;
}
