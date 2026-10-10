import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma/client";
import { getCategories } from "@/features/products/queries/get-categories";
import { ProductForm } from "@/components/admin/product-form";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteProductAction } from "../../actions";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { sortOrder: "asc" }
      },
      variants: {
        where: { isActive: true },
        orderBy: { sku: "asc" }
      }
    }
  });

  if (!product) {
    notFound();
  }

  // Serialize Prisma Decimals for Client Component
  const serializedProduct = { ...product };
  const decimalFields = [
    "fixedPrice", "netWeight", "makingChargeValue", 
    "additionalCharges", "stoneCharge", "wastagePercentage", "gstPercentage"
  ] as const;
  
  for (const field of decimalFields) {
    if (serializedProduct[field] !== null && serializedProduct[field] !== undefined) {
      serializedProduct[field] = serializedProduct[field].toString() as any;
    }
  }

  if (serializedProduct.variants) {
    serializedProduct.variants = serializedProduct.variants.map((v: any) => {
      const sv = { ...v };
      const vDecimalFields = ["weight", "fixedPrice", "makingChargeValue", "additionalCharges", "stoneCharges", "priceAdjustment"] as const;
      for (const field of vDecimalFields) {
        if (sv[field] !== null && sv[field] !== undefined) {
          sv[field] = sv[field].toString();
        }
      }
      return sv;
    });
  }

  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-medium">Edit Product</h1>
          <p className="text-muted-foreground mt-1">Update product details and pricing.</p>
        </div>
        <form action={async () => {
          "use server";
          await deleteProductAction(id);
        }}>
          <Button variant="destructive" size="sm" type="submit">
            <Trash2 className="mr-2 size-4" /> Delete Product
          </Button>
        </form>
      </div>

      <ProductForm initialData={serializedProduct} categories={categories} />
    </div>
  );
}
