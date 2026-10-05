import "server-only";

import { prisma } from "@/lib/prisma/client";

import type { StorefrontProduct } from "../types/product";
import {
  mapProducts,
  productInclude,
} from "../utils/product-mappers";

export async function getNewArrivals(
  limit = 8,
): Promise<StorefrontProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: productInclude,
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return await mapProducts(products);
}
