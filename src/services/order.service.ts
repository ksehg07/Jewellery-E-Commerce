import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@/generated/prisma/client";
import { calculatePrice } from "./pricing.service";

export async function createInternalOrder(
  userId: string,
  cartItems: { productId: string; variantId?: string | null; quantity: number }[],
  shippingDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }
) {
  const productIds = Array.from(new Set(cartItems.map((c) => c.productId)));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { variants: true },
  });

  if (products.length === 0) {
    throw new Error("Products not found.");
  }

  let subtotal = 0;
  const orderItemsData: Prisma.OrderItemCreateManyOrderInput[] = [];

  for (const item of cartItems) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      throw new Error(`Product ${item.productId} not found.`);
    }

    let netWeight = Number(product.netWeight);
    let makingCharge = Number(product.makingChargeValue);
    let makingChargeType = product.makingChargeType;
    let stoneCharge = Number(product.stoneCharge || 0);
    let sku = product.sku;
    let fixedPrice = product.fixedPrice !== null ? Number(product.fixedPrice) : null;
    let pricingStrategy = product.pricingStrategy;
    let variantPriceAdjustment = 0;

    if (item.variantId) {
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant) {
        throw new Error(`Variant ${item.variantId} not found.`);
      }
      sku = variant.sku;
      if (variant.weight !== null) netWeight = Number(variant.weight);
      if (variant.pricingStrategy) pricingStrategy = variant.pricingStrategy;
      if (variant.fixedPrice !== null) fixedPrice = Number(variant.fixedPrice);
      if (variant.makingChargeType) makingChargeType = variant.makingChargeType;
      if (variant.makingChargeValue !== null) makingCharge = Number(variant.makingChargeValue);
      if (variant.stoneCharges !== null) stoneCharge = Number(variant.stoneCharges);
      if (variant.priceAdjustment !== null) variantPriceAdjustment = Number(variant.priceAdjustment);
    }

    const pricingResult = await calculatePrice({
      pricingStrategy,
      fixedPrice,
      metal: product.metal,
      purity: product.purity,
      netWeight,
      makingChargeType,
      makingChargeValue: makingCharge,
      wastagePercentage: Number(product.wastagePercentage || 0),
      stoneCharge,
      variantPriceAdjustment
    });

    let finalPrice = pricingResult.finalPrice;
    // fallback for testing / price-on-request to allow checkout
    if (finalPrice <= 0) {
      finalPrice = 1;
    }

    subtotal += finalPrice * item.quantity;

    orderItemsData.push({
      productId: product.id,
      variantId: item.variantId || null,
      productName: product.name,
      sku: sku,
      metal: product.metal,
      purity: product.purity,
      netWeight,
      metalRate: pricingResult.liveMetalRatePerGram,
      makingCharge: pricingResult.makingCharge,
      stoneCharge: pricingResult.stoneCharge,
      gst: pricingResult.gst,
      price: finalPrice,
      quantity: item.quantity,
    });
  }

  const shippingCharge = 0;
  const discount = 0;
  const gst = 0;
  const total = subtotal + shippingCharge + gst - discount;

  return prisma.$transaction(async (tx) => {
    const address = await tx.address.create({
      data: {
        userId,
        recipientName: `${shippingDetails.firstName} ${shippingDetails.lastName}`.trim(),
        phone: shippingDetails.phone,
        addressLine1: shippingDetails.addressLine1,
        addressLine2: shippingDetails.addressLine2 || "",
        city: shippingDetails.city,
        state: shippingDetails.state,
        postalCode: shippingDetails.postalCode,
        country: shippingDetails.country || "India",
      },
    });

    const orderNumber = `ORD-${Date.now()}`;
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId,
        addressId: address.id,
        subtotal,
        discount,
        shippingCharge,
        gst,
        total,
        status: "PENDING",
        items: {
          createMany: {
            data: orderItemsData,
          },
        },
      },
      include: {
        items: true,
        address: true,
        user: true,
      },
    });

    return order;
  });
}

export async function createPendingPayment(
  orderId: string,
  gatewayOrderId: string,
  amount: number
) {
  return prisma.payment.create({
    data: {
      orderId,
      gateway: "RAZORPAY",
      gatewayOrderId,
      amount,
      status: "PENDING",
    },
  });
}
