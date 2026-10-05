import "server-only";

import { MetalType } from "@/generated/prisma/client";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface MetalsDevResponse {
  status: string;
  currency: string;
  unit: string;
  metals: {
    gold?: number;
    silver?: number;
    platinum?: number;
    palladium?: number;
  };
  timestamps: {
    metal: string;
  };
}

let cachedRates: Record<string, number> | null = null;
let cacheExpiry: number = 0;

export async function getLiveMetalRates(): Promise<Record<string, number>> {
  if (cachedRates && Date.now() < cacheExpiry) {
    return cachedRates;
  }

  const apiKey = process.env.METALS_DEV_API_KEY;
  if (!apiKey) {
    throw new Error("METALS_DEV_API_KEY is not configured.");
  }

  try {
    const response = await fetch(`https://api.metals.dev/v1/latest?api_key=${apiKey}&currency=INR&unit=g`, {
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Metals.Dev API responded with status: ${response.status}`);
    }

    const data: MetalsDevResponse = await response.json();
    
    // Validate response
    if (data.status !== "success") {
      throw new Error(`Metals.Dev API returned status: ${data.status}`);
    }
    
    if (!data.metals || typeof data.metals.gold !== "number") {
      throw new Error("Invalid response format from Metals.Dev: Missing or non-numeric gold rate");
    }

    cachedRates = {
      GOLD: data.metals.gold || 0,
      SILVER: data.metals.silver || 0,
      PLATINUM: data.metals.platinum || 0,
    };

    cacheExpiry = Date.now() + CACHE_TTL_MS;

    return cachedRates;
  } catch (error) {
    // Hide API key if somehow it leaks in error message
    const errMsg = error instanceof Error ? error.message.replace(apiKey, "HIDDEN_KEY") : String(error);
    console.error("Failed to fetch from Metals.Dev:", errMsg);
    throw new Error("Could not fetch live metal rates.");
  }
}

export async function getMetalRate(metalType: MetalType): Promise<number> {
  const rates = await getLiveMetalRates();
  
  if (metalType === "GOLD" && rates.GOLD) return rates.GOLD;
  if (metalType === "SILVER" && rates.SILVER) return rates.SILVER;
  if (metalType === "PLATINUM" && rates.PLATINUM) return rates.PLATINUM;
  
  throw new Error(`Unsupported metal type for live pricing: ${metalType}`);
}

