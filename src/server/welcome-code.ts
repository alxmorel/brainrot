import { DEFAULT_SHOP } from "@/models/shop";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateWelcomeCode(prefix = DEFAULT_SHOP.welcomeCode) {
  let suffix = "";
  for (let i = 0; i < 4; i += 1) {
    suffix += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `${prefix}-${suffix}`;
}

export function normalizeWelcomeCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

export function typedCodeMatchesWelcome(
  typed: string,
  personalCode?: string | null,
  campaignCode = DEFAULT_SHOP.welcomeCode,
) {
  const code = normalizeWelcomeCode(typed);
  if (!code) return false;
  if (code === normalizeWelcomeCode(campaignCode)) return true;
  if (personalCode && code === normalizeWelcomeCode(personalCode)) return true;
  return false;
}
