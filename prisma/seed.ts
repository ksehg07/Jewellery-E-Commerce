import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { catalogueCategories } from "./seed/catalogue";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  // ----------------------------------------------------
  // 1. Seed Categories (Upsert all 29 categories)
  // ----------------------------------------------------
  console.log("📂 Seeding 29 categories...");
  const categoryMap = new Map<string, string>();

  for (const cat of catalogueCategories) {
    // Map category images if available
    let imagePath: string | undefined = undefined;
    if (["rings", "earrings", "bracelets", "necklaces"].includes(cat.slug)) {
      imagePath = `/images/categories/${cat.slug}.jpg`;
    }

    const savedCategory = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: imagePath,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: imagePath,
      },
    });

    categoryMap.set(savedCategory.slug, savedCategory.id);
  }

  console.log(`✅ Seeded ${categoryMap.size} categories.`);

  // ----------------------------------------------------
  // 2. Seed Initial Products with Images & Stock
  // ----------------------------------------------------
  console.log("💍 Seeding products...");

  const initialProducts = [
    {
      name: "Eternal Solitaire Gold Ring",
      slug: "eternal-solitaire-gold-ring",
      sku: "RNG-GLD-001",
      shortDescription: "A classic 22K yellow gold solitaire ring with refined detailing.",
      description: "Handcrafted in pure 22K gold, this timeless solitaire ring balances modern luxury with heritage craftsmanship.",
      categorySlug: "rings",
      metal: "GOLD" as const,
      purity: "K22" as const,
      netWeight: 4.5,
      makingChargeType: "FIXED" as const,
      makingChargeValue: 1200,
      fixedPrice: 38500,
      pricingStrategy: "FIXED" as const,
      audience: "WOMEN" as const,
      isFeatured: true,
      image: "/images/products/product-1.jpg",
    },
    {
      name: "Royal Heritage Chandbali Earrings",
      slug: "royal-heritage-chandbali-earrings",
      sku: "EAR-GLD-002",
      shortDescription: "Exquisite 22K gold drop earrings designed for celebratory moments.",
      description: "Featuring intricate filigree work and delicate finish, these earrings evoke traditional royal grandeur.",
      categorySlug: "earrings",
      metal: "GOLD" as const,
      purity: "K22" as const,
      netWeight: 8.2,
      makingChargeType: "FIXED" as const,
      makingChargeValue: 2500,
      fixedPrice: 68900,
      pricingStrategy: "FIXED" as const,
      audience: "WOMEN" as const,
      isFeatured: true,
      image: "/images/products/product-2.jpg",
    },
    {
      name: "Artisan Solid Silver Glass",
      slug: "artisan-solid-silver-glass",
      sku: "SLV-GLS-003",
      shortDescription: "Pure 925 sterling silver drinking tumbler.",
      description: "Crafted in heavy 925 sterling silver, perfect for traditional rituals, health benefits, and premium gifting.",
      categorySlug: "silver-glass",
      metal: "SILVER" as const,
      purity: "SILVER925" as const,
      netWeight: 120.0,
      makingChargeType: "FIXED" as const,
      makingChargeValue: 800,
      fixedPrice: 12500,
      pricingStrategy: "FIXED" as const,
      audience: "GENERAL" as const,
      isFeatured: true,
      image: "/images/products/product-3.jpg",
    },
    {
      name: "Classic Minimalist Gold Bracelet",
      slug: "classic-minimalist-gold-bracelet",
      sku: "BRC-GLD-004",
      shortDescription: "Sleek 18K gold chain bracelet for daily elegance.",
      description: "Understated and luxurious, crafted for everyday wear with a secure hallmark lock.",
      categorySlug: "bracelets",
      metal: "GOLD" as const,
      purity: "K18" as const,
      netWeight: 6.0,
      makingChargeType: "FIXED" as const,
      makingChargeValue: 1500,
      fixedPrice: 42000,
      pricingStrategy: "FIXED" as const,
      audience: "WOMEN" as const,
      isFeatured: true,
      image: "/images/products/product-4.jpg",
    },
    {
      name: "Sacred Silver Puja Diya",
      slug: "sacred-silver-puja-diya",
      sku: "SLV-DYA-005",
      shortDescription: "Traditional sterling silver engraved diya.",
      description: "A consecrated piece of pure silverware designed for home shrines and festive rituals.",
      categorySlug: "silver-diya",
      metal: "SILVER" as const,
      purity: "SILVER925" as const,
      netWeight: 45.0,
      makingChargeType: "FIXED" as const,
      makingChargeValue: 500,
      fixedPrice: 5800,
      pricingStrategy: "FIXED" as const,
      audience: "GENERAL" as const,
      isFeatured: false,
      image: "/images/products/product-1.jpg",
    },
    {
      name: "Men's Imperial Gold Kada",
      slug: "mens-imperial-gold-kada",
      sku: "KAD-GLD-006",
      shortDescription: "Heavy 22K solid yellow gold kada for men.",
      description: "A commanding symbol of strength and heritage, finished with a subtle satin polish.",
      categorySlug: "kada",
      metal: "GOLD" as const,
      purity: "K22" as const,
      netWeight: 24.5,
      makingChargeType: "FIXED" as const,
      makingChargeValue: 4500,
      fixedPrice: 195000,
      pricingStrategy: "FIXED" as const,
      audience: "MEN" as const,
      isFeatured: true,
      image: "/images/products/product-2.jpg",
    },
    {
      name: "Sterling Silver Floral Anklet (Payal)",
      slug: "sterling-silver-floral-anklet",
      sku: "ANK-SLV-007",
      shortDescription: "Handmade 925 silver payal with delicate chime bells.",
      description: "Traditional Indian silver payal crafted with intricate floral motifs and durable clasp.",
      categorySlug: "anklets",
      metal: "SILVER" as const,
      purity: "SILVER925" as const,
      netWeight: 35.0,
      makingChargeType: "FIXED" as const,
      makingChargeValue: 600,
      fixedPrice: 4200,
      pricingStrategy: "FIXED" as const,
      audience: "WOMEN" as const,
      isFeatured: false,
      image: "/images/products/product-3.jpg",
    },
  ];

  for (const item of initialProducts) {
    const categoryId = categoryMap.get(item.categorySlug);

    if (!categoryId) {
      console.warn(`Category ${item.categorySlug} not found. Skipping ${item.name}`);
      continue;
    }

    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        sku: item.sku,
        shortDescription: item.shortDescription,
        description: item.description,
        categoryId: categoryId,
        metal: item.metal,
        purity: item.purity,
        netWeight: item.netWeight,
        makingChargeType: item.makingChargeType,
        makingChargeValue: item.makingChargeValue,
        fixedPrice: item.fixedPrice,
        pricingStrategy: item.pricingStrategy,
        audience: item.audience,
        isFeatured: item.isFeatured,
        isActive: true,
      },
      create: {
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        shortDescription: item.shortDescription,
        description: item.description,
        categoryId: categoryId,
        metal: item.metal,
        purity: item.purity,
        netWeight: item.netWeight,
        makingChargeType: item.makingChargeType,
        makingChargeValue: item.makingChargeValue,
        fixedPrice: item.fixedPrice,
        pricingStrategy: item.pricingStrategy,
        audience: item.audience,
        isFeatured: item.isFeatured,
        isActive: true,
        images: {
          create: [
            {
              imageUrl: item.image,
              altText: item.name,
              isPrimary: true,
              sortOrder: 0,
            },
          ],
        },
        inventory: {
          create: {
            quantity: 15,
            lowStockThreshold: 3,
          },
        },
      },
    });
  }

  console.log(`✅ Seeded ${initialProducts.length} sample products with images & stock.`);
  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });