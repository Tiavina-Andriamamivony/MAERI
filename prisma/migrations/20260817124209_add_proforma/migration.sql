-- CreateTable
CREATE TABLE "Proforma" (
    "id" SERIAL NOT NULL,
    "pf_num" TEXT NOT NULL,
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
    "validite_offre" TIMESTAMP(3),
    "terme_paiement" INTEGER NOT NULL,
    "monnaie" TEXT NOT NULL,
    "tva_active" BOOLEAN NOT NULL DEFAULT false,
    "tva_rate" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "sous_total" DOUBLE PRECISION NOT NULL,
    "remise" DOUBLE PRECISION NOT NULL,
    "montant_net" DOUBLE PRECISION NOT NULL,
    "montant_tva" DOUBLE PRECISION NOT NULL,
    "montant_total" DOUBLE PRECISION NOT NULL,
    "montant_en_lettres" TEXT NOT NULL,
    "pdf_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proforma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProformaItem" (
    "id" SERIAL NOT NULL,
    "proforma_id" INTEGER NOT NULL,
    "designation" TEXT NOT NULL,
    "max_loading" TEXT,
    "pressure" TEXT,
    "dimension" TEXT,
    "uom" TEXT,
    "quantite" DOUBLE PRECISION NOT NULL,
    "prix_unitaire" DOUBLE PRECISION NOT NULL,
    "remise_pct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "montant_net" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ProformaItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proforma_pf_num_key" ON "Proforma"("pf_num");

-- AddForeignKey
ALTER TABLE "ProformaItem" ADD CONSTRAINT "ProformaItem_proforma_id_fkey" FOREIGN KEY ("proforma_id") REFERENCES "Proforma"("id") ON DELETE CASCADE ON UPDATE CASCADE;
