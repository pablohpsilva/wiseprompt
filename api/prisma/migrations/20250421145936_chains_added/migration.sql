-- CreateTable
CREATE TABLE "network_chains" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "rpc_url" TEXT,
    "explorer_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "network_chains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currency_network_chains" (
    "currency_id" INTEGER NOT NULL,
    "network_chain_id" INTEGER NOT NULL,
    "contract_address" TEXT,

    CONSTRAINT "currency_network_chains_pkey" PRIMARY KEY ("currency_id","network_chain_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "network_chains_name_key" ON "network_chains"("name");

-- CreateIndex
CREATE UNIQUE INDEX "network_chains_chain_id_key" ON "network_chains"("chain_id");

-- CreateIndex
CREATE INDEX "currency_network_chains_contract_address_idx" ON "currency_network_chains"("contract_address");

-- AddForeignKey
ALTER TABLE "currency_network_chains" ADD CONSTRAINT "currency_network_chains_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "currency_network_chains" ADD CONSTRAINT "currency_network_chains_network_chain_id_fkey" FOREIGN KEY ("network_chain_id") REFERENCES "network_chains"("id") ON DELETE CASCADE ON UPDATE CASCADE;
