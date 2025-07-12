/*
  Warnings:

  - You are about to drop the column `productId` on the `Items` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Items" DROP CONSTRAINT "Items_productId_fkey";

-- DropIndex
DROP INDEX "Items_productId_idx";

-- AlterTable
ALTER TABLE "Items" DROP COLUMN "productId";
