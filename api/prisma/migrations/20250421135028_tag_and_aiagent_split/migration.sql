/*
  Warnings:

  - The primary key for the `prompt_tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tag` on the `prompt_tags` table. All the data in the column will be lost.
  - You are about to drop the column `tested_ai_agents` on the `prompts` table. All the data in the column will be lost.
  - Added the required column `tag_id` to the `prompt_tags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "prompt_tags" DROP CONSTRAINT "prompt_tags_pkey",
DROP COLUMN "tag",
ADD COLUMN     "tag_id" INTEGER NOT NULL,
ADD CONSTRAINT "prompt_tags_pkey" PRIMARY KEY ("prompt_id", "tag_id");

-- AlterTable
ALTER TABLE "prompts" DROP COLUMN "tested_ai_agents";

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_agents" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ai_agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_ai_agents" (
    "prompt_id" TEXT NOT NULL,
    "ai_agent_id" INTEGER NOT NULL,

    CONSTRAINT "prompt_ai_agents_pkey" PRIMARY KEY ("prompt_id","ai_agent_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ai_agents_name_key" ON "ai_agents"("name");

-- AddForeignKey
ALTER TABLE "prompt_tags" ADD CONSTRAINT "prompt_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_ai_agents" ADD CONSTRAINT "prompt_ai_agents_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_ai_agents" ADD CONSTRAINT "prompt_ai_agents_ai_agent_id_fkey" FOREIGN KEY ("ai_agent_id") REFERENCES "ai_agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
