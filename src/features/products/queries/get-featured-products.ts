import "server-only";

import { prisma } from "@/lib/prisma/client";

import type { StorefrontProduct } from "../types/product";
import {
  mapProducts,
  productInclude,
} from "../utils/product-mappers";

export async function getFeaturedProducts(
  limit = 4,
): Promise<StorefrontProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: productInclude,
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return mapProducts(products);
}
