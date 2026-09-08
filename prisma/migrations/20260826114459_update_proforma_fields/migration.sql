/*
  Warnings:

  - You are about to drop the column `dimension` on the `ProformaItem` table. All the data in the column will be lost.
  - You are about to drop the column `max_loading` on the `ProformaItem` table. All the data in the column will be lost.
  - You are about to drop the column `pressure` on the `ProformaItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Proforma" ADD COLUMN     "cif" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "conditions_paiement" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "delai_livraison" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "ProformaItem" DROP COLUMN "dimension",
DROP COLUMN "max_loading",
DROP COLUMN "pressure";
