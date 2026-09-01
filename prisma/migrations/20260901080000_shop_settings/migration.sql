-- CreateTable
CREATE TABLE "ShopSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "teePriceCents" INTEGER NOT NULL DEFAULT 1499,
    "teeCompareAtCents" INTEGER NOT NULL DEFAULT 1799,
    "welcomeEnabled" BOOLEAN NOT NULL DEFAULT true,
    "welcomeCode" TEXT NOT NULL DEFAULT 'BAMBINO',
    "welcomeKind" TEXT NOT NULL DEFAULT 'percent',
    "welcomePercent" INTEGER NOT NULL DEFAULT 10,
    "welcomeAmountCents" INTEGER NOT NULL DEFAULT 200,
    "welcomeRequiresAccount" BOOLEAN NOT NULL DEFAULT true,
    "welcomeTtlDays" INTEGER NOT NULL DEFAULT 7,
    "welcomeStartsAt" TIMESTAMP(3),
    "welcomeEndsAt" TIMESTAMP(3),
    "cashbackEnabled" BOOLEAN NOT NULL DEFAULT true,
    "cashbackPerExtraTeeCents" INTEGER NOT NULL DEFAULT 200,
    "cashbackMinQty" INTEGER NOT NULL DEFAULT 2,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShopSettings_pkey" PRIMARY KEY ("id")
);
