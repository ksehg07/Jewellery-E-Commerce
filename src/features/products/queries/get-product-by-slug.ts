import "server-only";

import { prisma } from "@/lib/prisma/client";

import type { StorefrontProduct } from "../types/product";
import {
  mapProduct,
  productInclude,
} from "../utils/product-mappers";

export async function getProductBySlug(
  slug: string,
): Promise<StorefrontProduct | null> {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      isActive: true,
    },
    include: productInclude,
  });

  return product ? mapProduct(product) : null;
}
