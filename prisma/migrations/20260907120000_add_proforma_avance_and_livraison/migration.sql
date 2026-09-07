-- AlterTable
ALTER TABLE "Proforma" ADD COLUMN     "avance_active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "avance_montant" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "livraison_a" TEXT NOT NULL DEFAULT '';