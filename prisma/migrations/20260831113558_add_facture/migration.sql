-- CreateTable
CREATE TABLE "Facture" (
    "id" SERIAL NOT NULL,
    "facture_num" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "client_code" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_address" TEXT,
    "client_province" TEXT NOT NULL,
    "client_nif" TEXT,
    "client_stat" TEXT,
    "client_rcs" TEXT,
    "client_contact" TEXT,
    "client_phone" TEXT,
    "client_mail" TEXT,
    "votre_reference" TEXT,
    "monnaie" TEXT NOT NULL,
    "tva_active" BOOLEAN NOT NULL DEFAULT false,
    "tva_rate" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "date_paiement" TIMESTAMP(3),
    "livraison" TEXT NOT NULL DEFAULT '',
    "paiement" TEXT NOT NULL DEFAULT '',
    "proforma_id" INTEGER,
    "sous_total" DOUBLE PRECISION NOT NULL,
    "remise" DOUBLE PRECISION NOT NULL,
    "montant_net" DOUBLE PRECISION NOT NULL,
    "montant_tva" DOUBLE PRECISION NOT NULL,
    "montant_total" DOUBLE PRECISION NOT NULL,
    "montant_en_lettres" TEXT NOT NULL,
    "pdf_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactureItem" (
    "id" SERIAL NOT NULL,
    "facture_id" INTEGER NOT NULL,
    "designation" TEXT NOT NULL,
    "uom" TEXT,
    "quantite" DOUBLE PRECISION NOT NULL,
    "prix_unitaire" DOUBLE PRECISION NOT NULL,
    "remise_pct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "montant_net" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FactureItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Facture_facture_num_key" ON "Facture"("facture_num");

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_proforma_id_fkey" FOREIGN KEY ("proforma_id") REFERENCES "Proforma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactureItem" ADD CONSTRAINT "FactureItem_facture_id_fkey" FOREIGN KEY ("facture_id") REFERENCES "Facture"("id") ON DELETE CASCADE ON UPDATE CASCADE;
