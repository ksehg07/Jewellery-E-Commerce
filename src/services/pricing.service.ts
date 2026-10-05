import { PricingStrategy, MakingChargeType, MetalType, MetalPurity } from "@/generated/prisma/client";
import { getMetalRate } from "@/lib/metals-dev";

// Purity to fraction mapping. e.g. 22K is 22/24. 
export const PURITY_MULTIPLIER: Record<MetalPurity, number> = {
  K24: 24 / 24,
  K22: 22 / 24,
  K18: 18 / 24,
  K14: 14 / 24,
  SILVER925: 0.925,
  OTHER: 1, // Fallback
};

export interface PricingInput {
  pricingStrategy: PricingStrategy | null;
  fixedPrice: number | null;
  metal: MetalType;
  purity: MetalPurity;
  netWeight: number;
  makingChargeType: MakingChargeType;
  makingChargeValue: number;
  wastagePercentage: number;
  stoneCharge: number;
  variantPriceAdjustment?: number;
  gstPercentage?: number; // Added GST Percentage
}

export interface PricingResult {
  metalValue: number;
  makingCharge: number;
  stoneCharge: number;
  variantPriceAdjustment: number;
  subtotal: number;
  gst: number;
  finalPrice: number;
  liveMetalRatePerGram: number;
}

export async function calculatePrice(input: PricingInput): Promise<PricingResult> {
  const strategy = input.pricingStrategy || PricingStrategy.FIXED;
  const gstRate = (input.gstPercentage ?? 3) / 100;

  const result: PricingResult = {
    metalValue: 0,
    makingCharge: 0,
    stoneCharge: 0,
    variantPriceAdjustment: 0,
    subtotal: 0,
    gst: 0,
    finalPrice: 0,
    liveMetalRatePerGram: 0
  };

  if (strategy === PricingStrategy.FIXED) {
    let subtotal = input.fixedPrice ?? 0;
    if (input.variantPriceAdjustment) {
      result.variantPriceAdjustment = input.variantPriceAdjustment;
      subtotal += input.variantPriceAdjustment;
    }
    
    subtotal = Math.max(0, subtotal);
    result.subtotal = subtotal;

    const gst = subtotal * gstRate;
    result.gst = gst;
    
    result.finalPrice = subtotal + gst;
    return result;
  }

  if (strategy === PricingStrategy.METAL_BASED) {
    const liveMetalRatePerGram = await getMetalRate(input.metal);
    result.liveMetalRatePerGram = liveMetalRatePerGram;

    const purityMultiplier = PURITY_MULTIPLIER[input.purity] ?? 1;

    // Metal Value = Net Metal Weight × Live Metal Rate × Purity Factor
    // Wastage DOES NOT increase the metal weight/value per client formula
    const metalValue = input.netWeight * liveMetalRatePerGram * purityMultiplier;
    result.metalValue = metalValue;

    // Calculate Making Charges
    let makingCharge = 0;
    if (input.makingChargeType === MakingChargeType.FIXED) {
      makingCharge = input.makingChargeValue;
    } else if (input.makingChargeType === MakingChargeType.PER_GRAM) {
      makingCharge = input.makingChargeValue * input.netWeight; 
    } else if (input.makingChargeType === MakingChargeType.PERCENTAGE) {
      makingCharge = (input.makingChargeValue / 100) * metalValue;
    }
    result.makingCharge = makingCharge;

    // Add Stone charges
    const stoneCharge = input.stoneCharge || 0;
    result.stoneCharge = stoneCharge;

    let subtotal = metalValue + makingCharge + stoneCharge;
    
    // Variant adjustment (preserve existing behavior of adding as a fixed amount)
    if (input.variantPriceAdjustment) {
      result.variantPriceAdjustment = input.variantPriceAdjustment;
      subtotal += input.variantPriceAdjustment;
    }

    result.subtotal = subtotal;

    // Calculate GST dynamically from the product's configured gstPercentage
    const gst = subtotal * gstRate;
    result.gst = gst;

    // Final Product Price
    result.finalPrice = Math.max(0, subtotal + gst);

    return result;
  }

  throw new Error("Unsupported pricing strategy.");
}
