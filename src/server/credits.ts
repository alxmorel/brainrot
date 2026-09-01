import { cashbackCentsForQty } from "@/data/pricing";
import { prisma } from "@/server/db";
import { getShopSettings } from "@/server/shop-settings";

export async function settleOrderCredits(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) return;

  if (order.welcomeAppliedCents > 0 && order.userId) {
    await prisma.user.updateMany({
      where: { id: order.userId, welcomeRedeemedAt: null },
      data: { welcomeRedeemedAt: new Date() },
    });
  }

  if (!order.userId) return;

  const userId = order.userId;

  if (order.creditAppliedCents > 0) {
    const already = await prisma.creditLedger.findFirst({
      where: { orderId, userId, kind: "spend" },
    });
    if (!already) {
      const spend = order.creditAppliedCents;
      await prisma.$transaction([
        prisma.creditLedger.create({
          data: {
            userId,
            orderId,
            kind: "spend",
            amountCents: -spend,
          },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { creditCents: { decrement: spend } },
        }),
      ]);
      await prisma.user.updateMany({
        where: { id: userId, creditCents: { lt: 0 } },
        data: { creditCents: 0 },
      });
    }
  }

  if (order.cashbackGrantedCents > 0) return;

  const qty = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const shop = await getShopSettings();
  const cashback = cashbackCentsForQty(qty, shop);
  if (cashback <= 0) return;

  const alreadyCashback = await prisma.creditLedger.findFirst({
    where: { orderId, userId, kind: "cashback" },
  });
  if (alreadyCashback) return;

  await prisma.$transaction([
    prisma.creditLedger.create({
      data: {
        userId,
        orderId,
        kind: "cashback",
        amountCents: cashback,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { creditCents: { increment: cashback } },
    }),
    prisma.order.update({
      where: { id: orderId },
      data: { cashbackGrantedCents: cashback },
    }),
  ]);
}
