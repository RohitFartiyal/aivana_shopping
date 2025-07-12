/*
  Warnings:

  - The values [UPI,COMPLETED,DEBIT,CREDIT] on the enum `PaymentMode` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `Billingaddress` on the `Shopping` table. All the data in the column will be lost.
  - You are about to drop the column `Shippingaddress` on the `Shopping` table. All the data in the column will be lost.
  - You are about to drop the column `mobile` on the `Shopping` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Shopping` table. All the data in the column will be lost.
  - Added the required column `Username` to the `Shopping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `delivery` to the `Shopping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount` to the `Shopping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Shopping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAddress` to the `Shopping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subTotal` to the `Shopping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Shopping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMode_new" AS ENUM ('CASH', 'NET_BANKING');
ALTER TABLE "Shopping" ALTER COLUMN "payment" TYPE "PaymentMode_new" USING ("payment"::text::"PaymentMode_new");
ALTER TYPE "PaymentMode" RENAME TO "PaymentMode_old";
ALTER TYPE "PaymentMode_new" RENAME TO "PaymentMode";
DROP TYPE "PaymentMode_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Shopping" DROP CONSTRAINT "Shopping_productId_fkey";

-- DropIndex
DROP INDEX "Shopping_productId_idx";

-- AlterTable
ALTER TABLE "Shopping" DROP COLUMN "Billingaddress",
DROP COLUMN "Shippingaddress",
DROP COLUMN "mobile",
DROP COLUMN "productId",
ADD COLUMN     "Username" TEXT NOT NULL,
ADD COLUMN     "billingAddress" TEXT NOT NULL DEFAULT '69 Maliwada Street, Autoville, 7th Floor Mumbai 69420',
ADD COLUMN     "delivery" INTEGER NOT NULL,
ADD COLUMN     "discount" INTEGER NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "shippingAddress" TEXT NOT NULL,
ADD COLUMN     "subTotal" INTEGER NOT NULL,
ADD COLUMN     "total" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Items" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "shoppingId" TEXT,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Items_productId_idx" ON "Items"("productId");

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "Shopping"("id") ON DELETE SET NULL ON UPDATE CASCADE;
