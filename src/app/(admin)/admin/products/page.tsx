import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma/client";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculatePrice } from "@/services/pricing.service";

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate live prices for display
  const productsWithPrices = await Promise.all(
    products.map(async (p) => {
      let finalPrice = 0;
      try {
        const res = await calculatePrice({
          pricingStrategy: p.pricingStrategy,
          fixedPrice: p.fixedPrice !== null ? Number(p.fixedPrice) : null,
          metal: p.metal,
          purity: p.purity,
          netWeight: Number(p.netWeight),
          makingChargeType: p.makingChargeType,
          makingChargeValue: Number(p.makingChargeValue),
          wastagePercentage: Number(p.wastagePercentage || 0),
          stoneCharge: Number(p.stoneCharge || 0),
          variantPriceAdjustment: 0,
        });
        finalPrice = res.finalPrice;
      } catch (e) {
        console.error("Pricing error for list", p.id, e);
      }
      return { ...p, calculatedPrice: finalPrice };
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-medium">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 size-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-card text-card-foreground">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">SKU</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Strategy</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productsWithPrices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-muted-foreground">
                    No products found. Create one to get started.
                  </td>
                </tr>
              ) : (
                productsWithPrices.map((product) => (
                  <tr key={product.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4">{product.sku}</td>
                    <td className="p-4">{product.category?.name || "-"}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                        {product.pricingStrategy}
                      </span>
                    </td>
                    <td className="p-4">₹{product.calculatedPrice.toFixed(2)}</td>
                    <td className="p-4">
                      {product.isActive ? (
                        <span className="text-green-600 font-medium">Active</span>
                      ) : (
                        <span className="text-muted-foreground">Draft</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Edit className="size-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
