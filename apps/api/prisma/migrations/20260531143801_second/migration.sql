/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employeeId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'LOCKED');

-- CreateEnum
CREATE TYPE "RankingMethod" AS ENUM ('FIFO', 'LIFO', 'MFIFO');

-- CreateEnum
CREATE TYPE "PrimaryAssetClass" AS ENUM ('EQUITIES', 'FUTURES', 'OPTIONS', 'CRYPTOCURRENCIES', 'FIXED_INCOME');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "employeeId" TEXT,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "modules" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "username" TEXT;

-- CreateTable
CREATE TABLE "Fund" (
    "id" TEXT NOT NULL,
    "amcName" TEXT NOT NULL,
    "fundName" TEXT NOT NULL,
    "reportingCurrency" TEXT NOT NULL DEFAULT 'USD',
    "rankingMethod" "RankingMethod" NOT NULL DEFAULT 'FIFO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Custodian" (
    "id" TEXT NOT NULL,
    "fundId" TEXT,
    "fundName" TEXT NOT NULL,
    "custodianName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "reportingCurrency" TEXT NOT NULL DEFAULT 'USD',
    "apiKey" TEXT,
    "secretKey" TEXT,
    "passphrase" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Custodian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetClass" (
    "id" TEXT NOT NULL,
    "primary" "PrimaryAssetClass" NOT NULL,
    "secondary" TEXT NOT NULL,
    "valuationSource" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreDefine" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreDefine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChartOfAccount" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AccountType" NOT NULL,
    "parentCode" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChartOfAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFundAllocation" (
    "userId" TEXT NOT NULL,
    "fundId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFundAllocation_pkey" PRIMARY KEY ("userId","fundId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fund_fundName_key" ON "Fund"("fundName");

-- CreateIndex
CREATE INDEX "Custodian_fundId_idx" ON "Custodian"("fundId");

-- CreateIndex
CREATE INDEX "Custodian_accountNumber_idx" ON "Custodian"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AssetClass_primary_secondary_key" ON "AssetClass"("primary", "secondary");

-- CreateIndex
CREATE UNIQUE INDEX "PreDefine_category_code_key" ON "PreDefine"("category", "code");

-- CreateIndex
CREATE UNIQUE INDEX "ChartOfAccount_code_key" ON "ChartOfAccount"("code");

-- CreateIndex
CREATE INDEX "UserFundAllocation_fundId_idx" ON "UserFundAllocation"("fundId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeId_key" ON "User"("employeeId");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Custodian" ADD CONSTRAINT "Custodian_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "Fund"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFundAllocation" ADD CONSTRAINT "UserFundAllocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFundAllocation" ADD CONSTRAINT "UserFundAllocation_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "Fund"("id") ON DELETE CASCADE ON UPDATE CASCADE;
