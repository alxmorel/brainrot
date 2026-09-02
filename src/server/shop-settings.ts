import { prisma } from "@/server/db";
import {
  DEFAULT_SHOP,
  withWelcomeLive,
  type ShopPublicSettings,
  type WelcomeKind,
} from "@/models/shop";
import { normalizeWelcomeCode } from "@/server/welcome-code";
import type { ShopSettings } from "@prisma/client";

export type ShopSettingsInput = {
  teePriceCents: number;
  teeCompareAtCents: number;
  mysteryTeePriceCents: number;
  welcomeEnabled: boolean;
  welcomeCode: string;
  welcomeKind: WelcomeKind;
  welcomePercent: number;
  welcomeAmountCents: number;
  welcomeRequiresAccount: boolean;
  welcomeTtlDays: number;
  welcomeStartsAt: string | null;
  welcomeEndsAt: string | null;
  cashbackEnabled: boolean;
  cashbackPerExtraTeeCents: number;
  cashbackMinQty: number;
};

function toPublic(row: ShopSettings): ShopPublicSettings {
  return withWelcomeLive({
    teePriceCents: row.teePriceCents,
    teeCompareAtCents: row.teeCompareAtCents,
    mysteryTeePriceCents: row.mysteryTeePriceCents,
    welcomeEnabled: row.welcomeEnabled,
    welcomeCode: row.welcomeCode,
    welcomeKind: row.welcomeKind === "amount" ? "amount" : "percent",
    welcomePercent: row.welcomePercent,
    welcomeAmountCents: row.welcomeAmountCents,
    welcomeRequiresAccount: row.welcomeRequiresAccount,
    welcomeTtlDays: row.welcomeTtlDays,
    welcomeStartsAt: row.welcomeStartsAt?.toISOString() ?? null,
    welcomeEndsAt: row.welcomeEndsAt?.toISOString() ?? null,
    cashbackEnabled: row.cashbackEnabled,
    cashbackPerExtraTeeCents: row.cashbackPerExtraTeeCents,
    cashbackMinQty: row.cashbackMinQty,
  });
}

function parseDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function parseShopSettingsInput(
  body: unknown,
): { ok: true; data: ShopSettingsInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Requête invalide." };
  }
  const record = body as Record<string, unknown>;
  const int = (key: string, min: number, max: number) => {
    const raw = record[key];
    const n = typeof raw === "number" ? raw : Number(raw);
    if (!Number.isInteger(n) || n < min || n > max) return null;
    return n;
  };
  const bool = (key: string) => Boolean(record[key]);

  const teePriceCents = int("teePriceCents", 50, 100000);
  const teeCompareAtCents = int("teeCompareAtCents", 0, 100000);
  const mysteryTeePriceCents = int("mysteryTeePriceCents", 50, 100000);
  const welcomePercent = int("welcomePercent", 1, 100);
  const welcomeAmountCents = int("welcomeAmountCents", 0, 100000);
  const welcomeTtlDays = int("welcomeTtlDays", 1, 365);
  const cashbackPerExtraTeeCents = int("cashbackPerExtraTeeCents", 0, 100000);
  const cashbackMinQty = int("cashbackMinQty", 1, 20);
  const welcomeKind =
    record.welcomeKind === "amount" ? "amount" : record.welcomeKind === "percent"
      ? "percent"
      : null;
  const welcomeCode =
    typeof record.welcomeCode === "string"
      ? normalizeWelcomeCode(record.welcomeCode)
      : "";

  if (
    teePriceCents === null ||
    teeCompareAtCents === null ||
    mysteryTeePriceCents === null ||
    welcomePercent === null ||
    welcomeAmountCents === null ||
    welcomeTtlDays === null ||
    cashbackPerExtraTeeCents === null ||
    cashbackMinQty === null ||
    !welcomeKind
  ) {
    return { ok: false, error: "Valeurs hors limites." };
  }
  if (!/^[A-Z0-9-]{3,24}$/.test(welcomeCode)) {
    return { ok: false, error: "Code : 3–24 caractères (A–Z, 0–9, tiret)." };
  }

  const welcomeStartsAt =
    typeof record.welcomeStartsAt === "string" && record.welcomeStartsAt
      ? record.welcomeStartsAt
      : null;
  const welcomeEndsAt =
    typeof record.welcomeEndsAt === "string" && record.welcomeEndsAt
      ? record.welcomeEndsAt
      : null;
  if (welcomeStartsAt && !parseDate(welcomeStartsAt)) {
    return { ok: false, error: "Date de début invalide." };
  }
  if (welcomeEndsAt && !parseDate(welcomeEndsAt)) {
    return { ok: false, error: "Date de fin invalide." };
  }

  return {
    ok: true,
    data: {
      teePriceCents,
      teeCompareAtCents,
      mysteryTeePriceCents,
      welcomeEnabled: bool("welcomeEnabled"),
      welcomeCode,
      welcomeKind,
      welcomePercent,
      welcomeAmountCents,
      welcomeRequiresAccount: bool("welcomeRequiresAccount"),
      welcomeTtlDays,
      welcomeStartsAt,
      welcomeEndsAt,
      cashbackEnabled: bool("cashbackEnabled"),
      cashbackPerExtraTeeCents,
      cashbackMinQty,
    },
  };
}

export async function getShopSettings(): Promise<ShopPublicSettings> {
  try {
    const row = await prisma.shopSettings.upsert({
      where: { id: "default" },
      create: { id: "default" },
      update: {},
    });
    return toPublic(row);
  } catch (error) {
    console.error("[shop] lecture settings:", error);
    return DEFAULT_SHOP;
  }
}

export async function updateShopSettings(input: ShopSettingsInput) {
  const { welcomeStartsAt, welcomeEndsAt, ...rest } = input;
  const dates = {
    welcomeStartsAt: parseDate(welcomeStartsAt),
    welcomeEndsAt: parseDate(welcomeEndsAt),
  };
  const row = await prisma.shopSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      ...rest,
      ...dates,
    },
    update: {
      ...rest,
      ...dates,
    },
  });
  return toPublic(row);
}
