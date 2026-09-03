-- AlterTable
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "deliveredEmailSentAt" TIMESTAMP(3);
