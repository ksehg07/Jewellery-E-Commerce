import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting pricing migration...");
  
  const products = await prisma.product.findMany({
    include: { variants: true }
  });

  let migrated = 0;
  let skipped = 0;

  for (const product of products) {
    if (product.pricingStrategy === 'METAL_BASED') {
      continue;
    }

    // Check if valid for METAL_BASED
    let isValid = true;
    let reason = "";

    if (!product.metal || product.metal === 'OTHER') {
      isValid = false;
      reason = "Missing valid metal type";
    }

    if (!product.netWeight || Number(product.netWeight) <= 0) {
      isValid = false;
      reason = "Missing or invalid net weight";
    }

    if (!product.purity) {
      isValid = false;
      reason = "Missing purity";
    }

    if (isValid) {
      await prisma.product.update({
        where: { id: product.id },
        data: { pricingStrategy: 'METAL_BASED' }
      });
      console.log(`Migrated Product: ${product.name} (${product.sku})`);
      migrated++;
    } else {
      console.log(`Skipping Product: ${product.name} (${product.sku}) - Reason: ${reason}`);
      skipped++;
    }
  }

  console.log(`Migration Complete. Migrated: ${migrated}, Skipped: ${skipped}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
