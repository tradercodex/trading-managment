-- CreateEnum
CREATE TYPE "InvestorEntityType" AS ENUM ('INDIVIDUAL', 'LLC', 'CORPORATION', 'TRUST', 'PARTNERSHIP');

-- CreateEnum
CREATE TYPE "FormStatus" AS ENUM ('SUBMITTED', 'PENDING', 'NOT_REQUIRED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "W8Status" AS ENUM ('W8BEN_SUBMITTED', 'W8BENE_SUBMITTED', 'PENDING', 'NOT_REQUIRED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "FatcaClassification" AS ENUM ('US_PERSON', 'NON_US_INDIVIDUAL', 'PFFI', 'NPFFI', 'EXEMPT');

-- CreateEnum
CREATE TYPE "SecurityType" AS ENUM ('EQUITY', 'FUTURE', 'OPTION', 'CRYPTO', 'BOND', 'CASH', 'OTHER');

-- CreateTable
CREATE TABLE "Investor" (
    "id" TEXT NOT NULL,
    "investorId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "entityType" "InvestorEntityType" NOT NULL,
    "ssnTin" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Investor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestorKyc" (
    "id" TEXT NOT NULL,
    "investorId" TEXT NOT NULL,
    "primaryAddress" TEXT NOT NULL,
    "mailingAddress" TEXT,
    "cityStateZip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "citizenship" TEXT NOT NULL,
    "taxResidency" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "InvestorKyc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestorTax" (
    "id" TEXT NOT NULL,
    "investorId" TEXT NOT NULL,
    "tinSsnEin" TEXT,
    "w9Status" "FormStatus",
    "w8Status" "W8Status",
    "fatca" "FatcaClassification",
    "backupWithholding" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "InvestorTax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Security" (
    "id" TEXT NOT NULL,
    "smId" TEXT NOT NULL,
    "type" "SecurityType" NOT NULL,
    "ticker" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "assetClass" TEXT NOT NULL,
    "exchange" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "multiplier" DECIMAL(20,8) NOT NULL DEFAULT 1,
    "valuationSource" TEXT,
    "valuationSourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Security_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketPrice" (
    "id" TEXT NOT NULL,
    "securityId" TEXT,
    "ticker" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "assetClass" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "price" DECIMAL(28,10) NOT NULL,
    "priceDate" TIMESTAMP(3) NOT NULL,
    "source" TEXT,
    "sourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MarketPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeRate" (
    "id" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "symbol" TEXT,
    "rate" DECIMAL(28,10) NOT NULL,
    "rateDate" TIMESTAMP(3) NOT NULL,
    "source" TEXT,
    "sourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Investor_investorId_key" ON "Investor"("investorId");
CREATE UNIQUE INDEX "Investor_email_key" ON "Investor"("email");
CREATE INDEX "Investor_fullName_idx" ON "Investor"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "InvestorKyc_investorId_key" ON "InvestorKyc"("investorId");

-- CreateIndex
CREATE UNIQUE INDEX "InvestorTax_investorId_key" ON "InvestorTax"("investorId");

-- CreateIndex
CREATE UNIQUE INDEX "Security_smId_key" ON "Security"("smId");
CREATE UNIQUE INDEX "Security_ticker_currency_key" ON "Security"("ticker", "currency");
CREATE INDEX "Security_ticker_idx" ON "Security"("ticker");

-- CreateIndex
CREATE UNIQUE INDEX "MarketPrice_ticker_priceDate_currency_key" ON "MarketPrice"("ticker", "priceDate", "currency");
CREATE INDEX "MarketPrice_ticker_idx" ON "MarketPrice"("ticker");
CREATE INDEX "MarketPrice_priceDate_idx" ON "MarketPrice"("priceDate");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeRate_currency_rateDate_key" ON "ExchangeRate"("currency", "rateDate");
CREATE INDEX "ExchangeRate_currency_idx" ON "ExchangeRate"("currency");
CREATE INDEX "ExchangeRate_rateDate_idx" ON "ExchangeRate"("rateDate");

-- AddForeignKey
ALTER TABLE "InvestorKyc" ADD CONSTRAINT "InvestorKyc_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestorTax" ADD CONSTRAINT "InvestorTax_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPrice" ADD CONSTRAINT "MarketPrice_securityId_fkey" FOREIGN KEY ("securityId") REFERENCES "Security"("id") ON DELETE SET NULL ON UPDATE CASCADE;
