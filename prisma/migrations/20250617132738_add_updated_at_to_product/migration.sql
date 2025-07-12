/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserCart` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserCart_userId_productId_key";

-- CreateIndex
CREATE UNIQUE INDEX "UserCart_userId_key" ON "UserCart"("userId");
