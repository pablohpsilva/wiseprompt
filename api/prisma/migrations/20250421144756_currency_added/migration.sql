/*
  Warnings:

  - You are about to drop the column `currency` on the `prompts` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `purchases` table. All the data in the column will be lost.
  - Added the required column `currency_id` to the `prompts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency_id` to the `purchases` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CurrencyType" AS ENUM ('FIAT', 'CRYPTO');

-- AlterTable
ALTER TABLE "prompts" DROP COLUMN "currency",
ADD COLUMN     "currency_id" INTEGER NOT NULL,
ALTER COLUMN "last_tested_date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "purchases" DROP COLUMN "currency",
ADD COLUMN     "currency_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "currencies" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "type" "CurrencyType" NOT NULL DEFAULT 'FIAT',

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_key" ON "currencies"("code");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_symbol_key" ON "currencies"("symbol");

-- CreateIndex
CREATE INDEX "currencies_type_idx" ON "currencies"("type");

-- CreateIndex
CREATE INDEX "prompts_currency_id_idx" ON "prompts"("currency_id");

-- CreateIndex
CREATE INDEX "purchases_currency_id_idx" ON "purchases"("currency_id");

-- AddForeignKey
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
