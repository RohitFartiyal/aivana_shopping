/*
  Warnings:

  - Added the required column `brand` to the `Items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount` to the `Items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Items" ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "discount" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
