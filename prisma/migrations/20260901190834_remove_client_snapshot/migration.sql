/*
  Warnings:

  - You are about to drop the column `client_address` on the `Facture` table. All the data in the column will be lost.
  - You are about to drop the column `client_code` on the `Facture` table. All the data in the column will be lost.
  - You are about to drop the column `client_contact` on the `Facture` table. All the data in the column will be lost.
  - You are about to drop the column `client_mail` on the `Facture` table. All the data in the column will be lost.
  - You are about to drop the column `client_name` on the `Facture` table. All the data in the column will be lost.
  - You are about to drop the column `client_nif` on the `Facture` table. All the data in the column will be lost.
  - You are about to drop the column `client_phone` on the `Facture` table. All the data in the column will be lost.
  - You are about to drop the column `client_province` on the `Facture` table. All the data in the column will be lost.
  - You are about to drop the column `client_rcs` on the `Facture` table. All the data in the column will be lost.
  - You are about to drop the column `client_stat` on the `Facture` table. All the data in the column will be lost.
  - You are about to drop the column `client_address` on the `Proforma` table. All the data in the column will be lost.
  - You are about to drop the column `client_code` on the `Proforma` table. All the data in the column will be lost.
  - You are about to drop the column `client_contact` on the `Proforma` table. All the data in the column will be lost.
  - You are about to drop the column `client_mail` on the `Proforma` table. All the data in the column will be lost.
  - You are about to drop the column `client_name` on the `Proforma` table. All the data in the column will be lost.
  - You are about to drop the column `client_nif` on the `Proforma` table. All the data in the column will be lost.
  - You are about to drop the column `client_phone` on the `Proforma` table. All the data in the column will be lost.
  - You are about to drop the column `client_province` on the `Proforma` table. All the data in the column will be lost.
  - You are about to drop the column `client_rcs` on the `Proforma` table. All the data in the column will be lost.
  - You are about to drop the column `client_stat` on the `Proforma` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Facture" DROP COLUMN "client_address",
DROP COLUMN "client_code",
DROP COLUMN "client_contact",
DROP COLUMN "client_mail",
DROP COLUMN "client_name",
DROP COLUMN "client_nif",
DROP COLUMN "client_phone",
DROP COLUMN "client_province",
DROP COLUMN "client_rcs",
DROP COLUMN "client_stat",
ADD COLUMN     "client_id" INTEGER;

-- AlterTable
ALTER TABLE "Proforma" DROP COLUMN "client_address",
DROP COLUMN "client_code",
DROP COLUMN "client_contact",
DROP COLUMN "client_mail",
DROP COLUMN "client_name",
DROP COLUMN "client_nif",
DROP COLUMN "client_phone",
DROP COLUMN "client_province",
DROP COLUMN "client_rcs",
DROP COLUMN "client_stat",
ADD COLUMN     "client_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Proforma" ADD CONSTRAINT "Proforma_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
