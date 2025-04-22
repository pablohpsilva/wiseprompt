/*
  Warnings:

  - You are about to drop the column `prompt` on the `prompts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "prompts" DROP COLUMN "prompt",
ADD COLUMN     "content" TEXT NOT NULL DEFAULT '';
