/*
  Warnings:

  - Added the required column `Shippingaddress` to the `Shopping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Shopping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobile` to the `Shopping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment` to the `Shopping` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'UPI', 'COMPLETED', 'DEBIT', 'CREDIT');

-- DropForeignKey
ALTER TABLE "ColorSection" DROP CONSTRAINT "ColorSection_productId_fkey";

-- AlterTable
ALTER TABLE "Shopping" ADD COLUMN     "Billingaddress" TEXT NOT NULL DEFAULT '69 Maliwada Street, Autoville, 7th Floor Mumbai 69420',
ADD COLUMN     "Shippingaddress" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "mobile" TEXT NOT NULL,
ADD COLUMN     "payment" "PaymentMode" NOT NULL;

-- CreateTable
CREATE TABLE "UserSaved" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSaved_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" TEXT NOT NULL,
    "ratting" INTEGER NOT NULL,
    "review" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserSaved_userId_idx" ON "UserSaved"("userId");

-- CreateIndex
CREATE INDEX "UserSaved_productId_idx" ON "UserSaved"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSaved_userId_productId_key" ON "UserSaved"("userId", "productId");

-- CreateIndex
CREATE INDEX "Reviews_productId_idx" ON "Reviews"("productId");

-- CreateIndex
CREATE INDEX "Reviews_userId_idx" ON "Reviews"("userId");

-- AddForeignKey
ALTER TABLE "ColorSection" ADD CONSTRAINT "ColorSection_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSaved" ADD CONSTRAINT "UserSaved_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSaved" ADD CONSTRAINT "UserSaved_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
