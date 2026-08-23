import type { Prisma } from "@/generated/prisma/client";

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

function mapVariant(
  variant: ProductQueryResult["variants"][number],
  productPrice: number | null,
): StorefrontProductVariant {
  const fixedPrice = toNumber(variant.fixedPrice);
  const priceAdjustment = toNumber(variant.priceAdjustment);
  const price = fixedPrice ?? (
    productPrice !== null && priceAdjustment !== null
      ? productPrice + priceAdjustment
      : productPrice
  );

  return {
    id: variant.id,
    name: variant.name,
    value: variant.value,
    price,
    weight: toNumber(variant.weight),
    inStock: getInventoryQuantity(variant.inventory) > 0,
  };
}

export function mapProduct(
  product: ProductQueryResult,
): StorefrontProduct {
  const images = product.images.map((image) => image.imageUrl);
  const productPrice = toNumber(product.fixedPrice);
  const variants = product.variants.map((variant) =>
    mapVariant(variant, productPrice),
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
    weight: toNumber(product.netWeight),
    badge: product.isFeatured ? "Featured" : undefined,
    shortDescription: product.shortDescription ?? undefined,
    description: product.description ?? undefined,
    variants,
    inStock,
    isFeatured: product.isFeatured,
    createdAt: product.createdAt.toISOString(),
  };
}

export function mapProducts(
  products: ProductQueryResult[],
): StorefrontProduct[] {
  return products.map(mapProduct);
}
