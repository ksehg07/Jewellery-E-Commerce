const fs = require('fs');

const path = "src/app/(admin)/admin/products/actions.ts";
let content = fs.readFileSync(path, 'utf8');

// I'll rewrite the update action entirely to safely upsert variants
const targetUpdateAction = `export async function updateProductAction(id: string, formData: FormData) {`;

// Let's just write a script that replaces the updateProductAction body
const script = `
const fs = require('fs');
const path = "src/app/(admin)/admin/products/actions.ts";
let content = fs.readFileSync(path, 'utf8');

const regex = /export async function updateProductAction[\\s\\S]*?return \\{ success: true \\};\\n  \\} catch \\(error: any\\) \\{[\\s\\S]*?return \\{ error: "Failed to update product." \\};\\n  \\}\\n\\}/;

const newUpdateAction = \`export async function updateProductAction(id: string, formData: FormData) {
  await requireAdmin();

  const data = Object.fromEntries(formData.entries());
  
  const images: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("image_") && typeof value === "string" && value.trim()) {
      images.push(value.trim());
    }
  }

  const payload = {
    ...data,
    isActive: data.isActive === "on" || data.isActive === "true",
    isFeatured: data.isFeatured === "on" || data.isFeatured === "true",
    images,
  };

  const parsed = productSchema.safeParse(payload);

  if (!parsed.success) {
    return { error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }

  const v = parsed.data;

  try {
    let variantsData = [];
    try {
      variantsData = JSON.parse(data.variantsData as string || "[]");
    } catch (e) {}

    await prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({
        where: { productId: id }
      });

      // Instead of deleting variants (which breaks foreign keys on OrderItem), we mark missing ones inactive
      const incomingIds = variantsData.map((v: any) => v.id).filter((id: string) => !id.startsWith("new_"));
      
      await tx.productVariant.updateMany({
        where: { 
          productId: id,
          id: { notIn: incomingIds.length > 0 ? incomingIds : ['dummy'] }
        },
        data: { isActive: false }
      });

      for (const variant of variantsData) {
        if (variant.id && !variant.id.startsWith("new_")) {
          // Update existing
          await tx.productVariant.update({
            where: { id: variant.id },
            data: {
              name: variant.name || "Size",
              value: variant.value,
              sku: variant.sku,
              weight: variant.weight || 0,
              priceAdjustment: variant.priceAdjustment || 0,
              isActive: true
            }
          });
        } else {
          // Create new
          await tx.productVariant.create({
            data: {
              productId: id,
              name: variant.name || "Size",
              value: variant.value,
              sku: variant.sku,
              weight: variant.weight || 0,
              priceAdjustment: variant.priceAdjustment || 0,
              isActive: true
            }
          });
        }
      }

      await tx.product.update({
        where: { id },
        data: {
          name: v.name,
          slug: v.slug,
          sku: v.sku,
          categoryId: v.categoryId,
          audience: v.audience,
          description: v.description,
          shortDescription: v.shortDescription,
          isActive: v.isActive,
          isFeatured: v.isFeatured,
          
          pricingStrategy: v.pricingStrategy,
          fixedPrice: v.fixedPrice || null,
          
          metal: v.metal,
          purity: v.purity,
          netWeight: v.netWeight || 0,
          makingChargeType: v.makingChargeType,
          makingChargeValue: v.makingChargeValue || 0,
          stoneCharge: v.stoneCharge || 0,
          wastagePercentage: v.wastagePercentage || 0,
          
          images: {
            create: v.images?.map((url, index) => ({
              imageUrl: url,
              isPrimary: index === 0,
              sortOrder: index,
            })) || []
          }
        },
      });
    });

    revalidatePath("/admin/products");
    revalidatePath(\`/product/\${v.slug}\`);
    revalidatePath("/shop");
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update product", error);
    if (error?.code === "P2002") {
      return { error: "A product with this slug or SKU already exists." };
    }
    return { error: "Failed to update product." };
  }
}\`;

content = content.replace(regex, newUpdateAction);
fs.writeFileSync(path, content, 'utf8');
console.log("Updated updateProductAction");
`;

fs.writeFileSync("scripts/update-actions2.js", script, 'utf8');
