import { requireAdmin } from "@/lib/auth/require-admin";
import { getCategories } from "@/features/products/queries/get-categories";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-medium">Create Product</h1>
        <p className="text-muted-foreground mt-1">Add a new product to your catalogue.</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
