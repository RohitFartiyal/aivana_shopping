/*
  Warnings:

  - Added the required column `color` to the `UserCart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `UserCart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `UserCart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserCart" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL;
