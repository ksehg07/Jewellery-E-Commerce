/*
  Warnings:

  - You are about to drop the column `razorpayKeyId` on the `store_settings` table. All the data in the column will be lost.
  - You are about to drop the column `razorpayKeySecret` on the `store_settings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId,variantId]` on the table `inventory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `makingCharge` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metalRate` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "inventory_productId_key";

-- DropIndex
DROP INDEX "inventory_variantId_key";

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "gst" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "makingCharge" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "metalRate" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "stoneCharge" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "store_settings" DROP COLUMN "razorpayKeyId",
DROP COLUMN "razorpayKeySecret";

-- CreateIndex
CREATE INDEX "inventory_productId_idx" ON "inventory"("productId");

-- CreateIndex
CREATE INDEX "inventory_variantId_idx" ON "inventory"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_productId_variantId_key" ON "inventory"("productId", "variantId");

-- CreateIndex
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");
