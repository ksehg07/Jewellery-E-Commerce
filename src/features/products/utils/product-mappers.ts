import type { Prisma } from "@/generated/prisma/client";
import { calculatePrice } from "@/services/pricing.service";

import type {
  StorefrontProduct,
  StorefrontProductVariant,
} from "../types/product";

export const productInclude = {
  category: true,
  images: {
    orderBy: {
      sortOrder: "asc",
    },
  },
  variants: {
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      inventory: true,
    },
  },
  inventory: true,
} satisfies Prisma.ProductInclude;

export type ProductQueryResult = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

function toNumber(value: Prisma.Decimal | number | null | undefined) {
  return value === null || value === undefined ? null : Number(value);
}

function getInventoryQuantity(
  inventory: ProductQueryResult["inventory"],
) {
  return inventory.reduce(
    (quantity, item) => quantity + item.quantity,
    0,
  );
}


async function mapVariant(
  variant: ProductQueryResult["variants"][number],
  product: ProductQueryResult,
): Promise<StorefrontProductVariant> {
  let price = 0;
  try {
    const priceResult = await calculatePrice({
      pricingStrategy: variant.pricingStrategy || product.pricingStrategy,
      fixedPrice: variant.fixedPrice !== null ? Number(variant.fixedPrice) : (product.fixedPrice !== null ? Number(product.fixedPrice) : null),
      metal: product.metal,
      purity: product.purity,
      netWeight: variant.weight !== null ? Number(variant.weight) : Number(product.netWeight),
      makingChargeType: variant.makingChargeType || product.makingChargeType,
      makingChargeValue: variant.makingChargeValue !== null ? Number(variant.makingChargeValue) : Number(product.makingChargeValue),
      wastagePercentage: Number(product.wastagePercentage || 0),
      stoneCharge: variant.stoneCharges !== null ? Number(variant.stoneCharges) : Number(product.stoneCharge || 0),
      variantPriceAdjustment: variant.priceAdjustment !== null ? Number(variant.priceAdjustment) : 0,
        gstPercentage: Number(product.gstPercentage || 3)
    });
    price = priceResult.finalPrice;
  } catch (err) {
    console.error("Pricing error for variant", variant.id, err);
    // fallback if Metals.Dev fails or missing info
    price = 0;
  }

  return {
    id: variant.id,
    name: variant.name,
    value: variant.value,
    price,
    weight: toNumber(variant.weight),
    inStock: getInventoryQuantity(variant.inventory) > 0,
  };
}

export async function mapProduct(
  product: ProductQueryResult,
): Promise<StorefrontProduct> {
  const images = product.images.map((image) => image.imageUrl);
  
  let productPrice = 0;
  try {
    const priceResult = await calculatePrice({
      pricingStrategy: product.pricingStrategy,
      fixedPrice: product.fixedPrice !== null ? Number(product.fixedPrice) : null,
      metal: product.metal,
      purity: product.purity,
      netWeight: Number(product.netWeight),
      makingChargeType: product.makingChargeType,
      makingChargeValue: Number(product.makingChargeValue),
      wastagePercentage: Number(product.wastagePercentage || 0),
      stoneCharge: Number(product.stoneCharge || 0),
      variantPriceAdjustment: 0,
        gstPercentage: Number(product.gstPercentage || 3)
    });
    productPrice = priceResult.finalPrice;
  } catch (err) {
    console.error("Pricing error for product", product.id, err);
  }

  const variants = await Promise.all(
    product.variants.map((variant) => mapVariant(variant, product))
  );
  
  const productStock = getInventoryQuantity(product.inventory);
  const inStock = variants.length > 0
    ? variants.some((variant) => variant.inStock)
    : productStock > 0;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: productPrice,
    image: images[0] ?? "/images/products/product-1.jpg",
    images,
    category: product.category.name,
    categorySlug: product.category.slug,
    audience: product.audience,
    material: product.metal,
    purity: product.purity,
    weight: Number(product.netWeight),
    badge: product.isFeatured ? "Featured" : undefined,
    shortDescription: product.shortDescription ?? undefined,
    description: product.description ?? undefined,
    variants,
    inStock,
    isFeatured: product.isFeatured,
    createdAt: product.createdAt.toISOString(),
  };
}

export async function mapProducts(
  products: ProductQueryResult[],
): Promise<StorefrontProduct[]> {
  return Promise.all(products.map(mapProduct));
}
