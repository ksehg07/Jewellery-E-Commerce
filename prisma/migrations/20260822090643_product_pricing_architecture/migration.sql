/*
  Warnings:

  - Added the required column `audience` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductAudience" AS ENUM ('WOMEN', 'MEN', 'KIDS', 'GENERAL');

-- CreateEnum
CREATE TYPE "PricingStrategy" AS ENUM ('FIXED', 'METAL_BASED');

-- AlterEnum
ALTER TYPE "MakingChargeType" ADD VALUE 'PER_GRAM';

-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "additionalCharges" DECIMAL(12,2) DEFAULT 0,
ADD COLUMN     "fixedPrice" DECIMAL(12,2),
ADD COLUMN     "makingChargeType" "MakingChargeType",
ADD COLUMN     "makingChargeValue" DECIMAL(12,2),
ADD COLUMN     "pricingStrategy" "PricingStrategy",
ADD COLUMN     "stoneCharges" DECIMAL(12,2) DEFAULT 0,
ADD COLUMN     "weight" DECIMAL(10,3);

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "additionalCharges" DECIMAL(12,2) DEFAULT 0,
ADD COLUMN     "audience" "ProductAudience" NOT NULL,
ADD COLUMN     "fixedPrice" DECIMAL(12,2),
ADD COLUMN     "pricingStrategy" "PricingStrategy" NOT NULL DEFAULT 'FIXED';
