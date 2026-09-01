export type WelcomeKind = "percent" | "amount";

export type ShopPublicSettings = {
  teePriceCents: number;
  teeCompareAtCents: number;
  welcomeEnabled: boolean;
  welcomeCode: string;
  welcomeKind: WelcomeKind;
  welcomePercent: number;
  welcomeAmountCents: number;
  welcomeRequiresAccount: boolean;
  welcomeTtlDays: number;
  welcomeStartsAt: string | null;
  welcomeEndsAt: string | null;
  welcomeLive: boolean;
  cashbackEnabled: boolean;
  cashbackPerExtraTeeCents: number;
  cashbackMinQty: number;
};

export const DEFAULT_SHOP: ShopPublicSettings = {
  teePriceCents: 1499,
  teeCompareAtCents: 1799,
  welcomeEnabled: true,
  welcomeCode: "BAMBINO",
  welcomeKind: "percent",
  welcomePercent: 10,
  welcomeAmountCents: 200,
  welcomeRequiresAccount: true,
  welcomeTtlDays: 7,
  welcomeStartsAt: null,
  welcomeEndsAt: null,
  welcomeLive: true,
  cashbackEnabled: true,
  cashbackPerExtraTeeCents: 200,
  cashbackMinQty: 2,
};

export function isCampaignWindowOpen(
  settings: Pick<
    ShopPublicSettings,
    "welcomeEnabled" | "welcomeStartsAt" | "welcomeEndsAt"
  >,
  now = Date.now(),
) {
  if (!settings.welcomeEnabled) return false;
  if (
    settings.welcomeStartsAt &&
    new Date(settings.welcomeStartsAt).getTime() > now
  ) {
    return false;
  }
  if (settings.welcomeEndsAt && new Date(settings.welcomeEndsAt).getTime() < now) {
    return false;
  }
  return true;
}

export function withWelcomeLive(
  settings: Omit<ShopPublicSettings, "welcomeLive">,
): ShopPublicSettings {
  return { ...settings, welcomeLive: isCampaignWindowOpen(settings) };
}
