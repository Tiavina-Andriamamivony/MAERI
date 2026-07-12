-- CreateTable
CREATE TABLE "Client" (
    "clientId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "Address" TEXT,
    "Province" TEXT NOT NULL,
    "NIF" TEXT,
    "STAT" TEXT,
    "RCS" TEXT,
    "CF" TEXT,
    "CONTACT" TEXT,
    "PHONE" TEXT,
    "MAIL" TEXT,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("clientId")
);

-- CreateTable
CREATE TABLE "Article" (
    "Reference" TEXT NOT NULL,
    "Designation" TEXT,
    "Category" TEXT NOT NULL,
    "UOM" TEXT,
    "PurchasePrice" INTEGER,
    "SellingPrice" INTEGER,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("Reference")
);
