/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId]` on the table `UserCart` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserCart_productId_idx";

-- DropIndex
DROP INDEX "UserCart_userId_idx";

-- CreateIndex
CREATE INDEX "Shopping_status_idx" ON "Shopping"("status");

-- CreateIndex
CREATE UNIQUE INDEX "UserCart_userId_productId_key" ON "UserCart"("userId", "productId");
