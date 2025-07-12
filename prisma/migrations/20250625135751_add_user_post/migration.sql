/*
  Warnings:

  - The values [COMPLETED,CANCELLED,NOT_RECIVED] on the enum `ShoppingStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ShoppingStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'DEVLIVERED', 'CANCELED');
ALTER TABLE "Shopping" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Shopping" ALTER COLUMN "status" TYPE "ShoppingStatus_new" USING ("status"::text::"ShoppingStatus_new");
ALTER TYPE "ShoppingStatus" RENAME TO "ShoppingStatus_old";
ALTER TYPE "ShoppingStatus_new" RENAME TO "ShoppingStatus";
DROP TYPE "ShoppingStatus_old";
ALTER TABLE "Shopping" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
