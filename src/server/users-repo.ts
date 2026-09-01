import { DEFAULT_SHOP, type ShopPublicSettings } from "@/models/shop";
import { formatWelcomeOffer } from "@/data/pricing";
import { prisma } from "@/server/db";
import { hashPassword, verifyPassword } from "@/server/password";
import { getShopSettings } from "@/server/shop-settings";
import { generateWelcomeCode } from "@/server/welcome-code";
import type { User } from "@prisma/client";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isWelcomeActive(user: {
  welcomeExpiresAt: Date;
  welcomeRedeemedAt: Date | null;
}) {
  return !user.welcomeRedeemedAt && user.welcomeExpiresAt.getTime() > Date.now();
}

export function toAccountMe(
  user: User,
  shop: ShopPublicSettings = DEFAULT_SHOP,
) {
  const welcomeValid = isWelcomeActive(user) && shop.welcomeLive;
  return {
    id: user.id,
    email: user.email,
    creditCents: user.creditCents,
    welcomeCode: welcomeValid ? shop.welcomeCode : null,
    welcomeValid,
    welcomeExpiresAt: welcomeValid ? user.welcomeExpiresAt.toISOString() : null,
    welcomeDiscountCents: 0,
    welcomeOffer: welcomeValid ? formatWelcomeOffer(shop) : null,
  };
}

export async function accountMeOf(user: User) {
  return toAccountMe(user, await getShopSettings());
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: normalizeEmail(email) } });
}

async function uniqueWelcomeCode(prefix: string) {
  for (let i = 0; i < 12; i += 1) {
    const welcomeCode = generateWelcomeCode(prefix);
    const existing = await prisma.user.findUnique({ where: { welcomeCode } });
    if (!existing) return welcomeCode;
  }
  throw new Error("Impossible de générer un code welcome.");
}

export async function createUser(email: string, password: string) {
  const shop = await getShopSettings();
  const welcomeCode = await uniqueWelcomeCode(shop.welcomeCode);
  const welcomeExpiresAt = new Date(
    Date.now() + shop.welcomeTtlDays * 24 * 60 * 60 * 1000,
  );
  return prisma.user.create({
    data: {
      email: normalizeEmail(email),
      passwordHash: await hashPassword(password),
      welcomeCode,
      welcomeExpiresAt,
    },
  });
}

export async function authenticateUser(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  return ok ? user : null;
}
