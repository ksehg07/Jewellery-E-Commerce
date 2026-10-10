import { z } from "zod";
import {
  PricingStrategy,
  MetalType,
  MetalPurity,
  MakingChargeType,
  ProductAudience,
} from "@/generated/prisma/client";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  sku: z.string().min(2, "SKU is required"),
  categoryId: z.string().min(1, "Category is required"),
  audience: z.nativeEnum(ProductAudience),
  
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),

  pricingStrategy: z.nativeEnum(PricingStrategy),
  
  gstPercentage: z.coerce.number().min(0).max(100).default(3),
  
  // Fixed pricing
  fixedPrice: z.coerce.number().min(0).optional().nullable(),
  
  // Metal based pricing
  metal: z.nativeEnum(MetalType),
  purity: z.nativeEnum(MetalPurity),
  netWeight: z.coerce.number().min(0),
  
  makingChargeType: z.nativeEnum(MakingChargeType),
  makingChargeValue: z.coerce.number().min(0),
  stoneCharge: z.coerce.number().min(0).optional().nullable(),
  wastagePercentage: z.coerce.number().min(0).optional().nullable(),

  // Images 
  images: z.array(z.object({
    url: z.string().url("Must be a valid URL"),
    publicId: z.string().nullable().optional()
  })).optional(),
}).superRefine((data, ctx) => {
  if (data.pricingStrategy === PricingStrategy.FIXED) {
    if (data.fixedPrice === null || data.fixedPrice === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Fixed price is required for fixed pricing strategy",
        path: ["fixedPrice"],
      });
    }
  } else if (data.pricingStrategy === PricingStrategy.METAL_BASED) {
    if (!data.netWeight || data.netWeight <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Net weight is required for metal based pricing",
        path: ["netWeight"],
      });
    }
  }
});

export type ProductFormValues = z.infer<typeof productSchema>;
