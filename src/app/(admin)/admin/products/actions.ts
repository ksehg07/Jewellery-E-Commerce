"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { productSchema } from "@/lib/validations/product";
import { calculatePrice } from "@/services/pricing.service";
import cloudinary from "@/lib/cloudinary";

type ImageItem = { url: string; publicId: string | null };

export async function createProductAction(formData: FormData) {
  await requireAdmin();

  const data = Object.fromEntries(formData.entries());
  
  let images: ImageItem[] = [];
  try {
    images = JSON.parse(data.imagesData as string || "[]");
  } catch {}

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
    const product = await prisma.product.create({
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
        gstPercentage: v.gstPercentage,
        fixedPrice: v.fixedPrice || null,
        
        metal: v.metal,
        purity: v.purity,
        netWeight: v.netWeight || 0,
        makingChargeType: v.makingChargeType,
        makingChargeValue: v.makingChargeValue || 0,
        stoneCharge: v.stoneCharge || 0,
        wastagePercentage: v.wastagePercentage || 0,
        
        images: {
          create: v.images?.map((img, index) => ({
            imageUrl: img.url,
            publicId: img.publicId || null,
            isPrimary: index === 0,
            sortOrder: index,
          })) || []
        }
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true, id: product.id };
  } catch (error: unknown) {
    console.error("Failed to create product", error);
    const err = error as Error & { code?: string };
    if (err?.code === "P2002") {
      return { error: "A product with this slug or SKU already exists." };
    }
    return { error: "Failed to create product. See server logs." };
  }
}

type VariantItem = {
  id: string;
  name?: string;
  value: string;
  sku: string;
  weight?: number;
  priceAdjustment?: number;
};

export async function updateProductAction(id: string, formData: FormData) {
  await requireAdmin();

  const data = Object.fromEntries(formData.entries());
  
  let images: ImageItem[] = [];
  try {
    images = JSON.parse(data.imagesData as string || "[]");
  } catch {}

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
    let variantsData: VariantItem[] = [];
    try {
      variantsData = JSON.parse(data.variantsData as string || "[]");
    } catch {}

    // Find old images to determine which to delete from Cloudinary
    const oldImages = await prisma.productImage.findMany({
      where: { productId: id }
    });
    
    const incomingPublicIds = new Set(images.map(img => img.publicId).filter(Boolean));
    const imagesToDelete = oldImages.filter(img => img.publicId && !incomingPublicIds.has(img.publicId));

    await prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({
        where: { productId: id }
      });

      // Mark missing variants inactive
      const incomingIds = variantsData.map((variant) => variant.id).filter((vid: string) => !vid.startsWith("new_"));
      
      await tx.productVariant.updateMany({
        where: { 
          productId: id,
          id: { notIn: incomingIds.length > 0 ? incomingIds : ['dummy'] }
        },
        data: { isActive: false }
      });

      for (const variant of variantsData) {
        if (variant.id && !variant.id.startsWith("new_")) {
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
          gstPercentage: v.gstPercentage,
          fixedPrice: v.fixedPrice || null,
          
          metal: v.metal,
          purity: v.purity,
          netWeight: v.netWeight || 0,
          makingChargeType: v.makingChargeType,
          makingChargeValue: v.makingChargeValue || 0,
          stoneCharge: v.stoneCharge || 0,
          wastagePercentage: v.wastagePercentage || 0,
          
          images: {
            create: v.images?.map((img, index) => ({
              imageUrl: img.url,
              publicId: img.publicId || null,
              isPrimary: index === 0,
              sortOrder: index,
            })) || []
          }
        },
      });
    });

    // Clean up deleted images from Cloudinary (only after successful DB transaction)
    for (const img of imagesToDelete) {
      try {
        await cloudinary.uploader.destroy(img.publicId!);
      } catch (err) {
        console.error("Failed to delete Cloudinary asset:", img.publicId, err);
      }
    }

    revalidatePath("/admin/products");
    revalidatePath("/product/" + v.slug);
    revalidatePath("/shop");
    
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to update product", error);
    const err = error as Error & { code?: string };
    if (err?.code === "P2002") {
      return { error: "A product with this slug or SKU already exists." };
    }
    return { error: "Failed to update product." };
  }
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  
  try {
    const oldImages = await prisma.productImage.findMany({
      where: { productId: id }
    });

    await prisma.product.delete({
      where: { id }
    });

    // Delete associated Cloudinary images
    for (const img of oldImages) {
      if (img.publicId) {
        try {
          await cloudinary.uploader.destroy(img.publicId);
        } catch (err) {
          console.error("Failed to delete Cloudinary asset:", img.publicId, err);
        }
      }
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
  } catch (error: unknown) {
    console.error("Delete error", error);
    return { error: "Failed to delete product. It may have associated orders." };
  }
}

export async function previewPriceAction(data: Record<string, string>) {
  await requireAdmin();
  
  try {
    const result = await calculatePrice({
      pricingStrategy: data.pricingStrategy as any,
      gstPercentage: Number(data.gstPercentage || 3),
      fixedPrice: data.fixedPrice ? Number(data.fixedPrice) : null,
      metal: data.metal as any,
      purity: data.purity as any,
      netWeight: Number(data.netWeight || 0),
      makingChargeType: data.makingChargeType as any,
      makingChargeValue: Number(data.makingChargeValue || 0),
      wastagePercentage: Number(data.wastagePercentage || 0),
      stoneCharge: Number(data.stoneCharge || 0)
    });
    
    return { success: true, data: result };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "Pricing preview failed" };
  }
}
