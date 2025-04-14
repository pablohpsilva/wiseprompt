-- CreateTable
CREATE TABLE "prompts" (
    "id" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tested_ai_agents" TEXT[],
    "prompt_version" TEXT NOT NULL DEFAULT '1.0.0',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_tested_date" TIMESTAMP(3),
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_tags" (
    "prompt_id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "prompt_tags_pkey" PRIMARY KEY ("prompt_id","tag")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "prompt_id" TEXT NOT NULL,
    "transaction_hash" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "prompt_id" TEXT NOT NULL,
    "rating_score" INTEGER NOT NULL,
    "rating_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preferences" (
    "wallet_address" TEXT NOT NULL,
    "theme_preference" TEXT NOT NULL DEFAULT 'light',
    "notification_settings" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "preferences_pkey" PRIMARY KEY ("wallet_address")
);

-- CreateTable
CREATE TABLE "auth_nonces" (
    "wallet_address" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_nonces_pkey" PRIMARY KEY ("wallet_address")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_used_at" TIMESTAMP(3),

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prompts_wallet_address_idx" ON "prompts"("wallet_address");

-- CreateIndex
CREATE INDEX "prompts_name_idx" ON "prompts"("name");

-- CreateIndex
CREATE INDEX "prompts_created_at_idx" ON "prompts"("created_at");

-- CreateIndex
CREATE INDEX "prompts_price_idx" ON "prompts"("price");

-- CreateIndex
CREATE INDEX "purchases_wallet_address_idx" ON "purchases"("wallet_address");

-- CreateIndex
CREATE INDEX "purchases_prompt_id_idx" ON "purchases"("prompt_id");

-- CreateIndex
CREATE INDEX "purchases_purchase_date_idx" ON "purchases"("purchase_date");

-- CreateIndex
CREATE INDEX "ratings_wallet_address_idx" ON "ratings"("wallet_address");

-- CreateIndex
CREATE INDEX "ratings_prompt_id_idx" ON "ratings"("prompt_id");

-- CreateIndex
CREATE INDEX "ratings_rating_score_idx" ON "ratings"("rating_score");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_prompt_id_wallet_address_key" ON "ratings"("prompt_id", "wallet_address");

-- CreateIndex
CREATE INDEX "auth_nonces_nonce_idx" ON "auth_nonces"("nonce");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_key" ON "api_keys"("key");

-- CreateIndex
CREATE INDEX "api_keys_key_idx" ON "api_keys"("key");

-- CreateIndex
CREATE INDEX "api_keys_wallet_address_idx" ON "api_keys"("wallet_address");

-- AddForeignKey
ALTER TABLE "prompt_tags" ADD CONSTRAINT "prompt_tags_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
