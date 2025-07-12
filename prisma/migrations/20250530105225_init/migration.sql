/*
  Warnings:

  - Added the required column `image` to the `UserCart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserCart" ADD COLUMN     "image" TEXT NOT NULL;
