/*
  Warnings:

  - You are about to drop the column `purchasePrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "purchasePrice",
DROP COLUMN "salePrice";

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "code_client" INTEGER NOT NULL,
    "client" TEXT NOT NULL,
    "adress" TEXT,
    "province" TEXT NOT NULL,
    "nif" INTEGER,
    "stat" INTEGER,
    "rcs" TEXT,
    "cf" TEXT,
    "contact" TEXT,
    "phone" TEXT,
    "mail" TEXT,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "reference" TEXT NOT NULL,
    "designation" TEXT,
    "categorie" TEXT,
    "uom" TEXT,
    "prix_achat_ttc" DOUBLE PRECISION,
    "prix_vente_ttc" DOUBLE PRECISION,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_code_client_key" ON "Client"("code_client");

-- CreateIndex
CREATE UNIQUE INDEX "Article_reference_key" ON "Article"("reference");
