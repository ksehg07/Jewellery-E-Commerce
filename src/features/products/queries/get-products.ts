import "server-only";

import type { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma/client";

import {
  mapProducts,
  productInclude,
} from "../utils/product-mappers";
import type { StorefrontProduct } from "../types/product";

type GetProductsOptions = {
  categoryId?: string;
  collectionId?: string;
  limit?: number;
};

export async function getProducts(
  options: GetProductsOptions = {},
): Promise<StorefrontProduct[]> {
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(options.categoryId ? { categoryId: options.categoryId } : {}),
    ...(options.collectionId ? { collectionId: options.collectionId } : {}),
  };

  const products = await prisma.product.findMany({
    where,
    include: productInclude,
    orderBy: {
      createdAt: "desc",
    },
    ...(options.limit ? { take: options.limit } : {}),
  });

  return mapProducts(products);
}
