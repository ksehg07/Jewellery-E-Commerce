import { NextRequest, NextResponse } from "next/server";
import { getRazorpayClient } from "@/lib/razorpay";
import { getSession } from "@/lib/auth/session";
import { createInternalOrder, createPendingPayment } from "@/services/order.service";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to continue." },
        { status: 401 }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const { cartItems, shippingDetails, notes } = body || {};

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty or invalid" },
        { status: 400 }
      );
    }

    if (!shippingDetails) {
      return NextResponse.json(
        { error: "Shipping details are required" },
        { status: 400 }
      );
    }

    let internalOrder;
    try {
      internalOrder = await createInternalOrder(session.user.id, cartItems, shippingDetails);
    } catch (err: any) {
      return NextResponse.json(
        { error: err.message || "Failed to create internal order" },
        { status: 400 }
      );
    }

    const authoritativeAmountInPaise = Math.round(Number(internalOrder.total) * 100);

    let razorpay;
    try {
      razorpay = getRazorpayClient();
    } catch (configError: any) {
      return NextResponse.json(
        { error: configError.message || "Razorpay configuration error" },
        { status: 500 }
      );
    }

    const orderOptions = {
      amount: authoritativeAmountInPaise,
      currency: "INR",
      receipt: internalOrder.orderNumber,
      notes: typeof notes === "object" && notes !== null ? notes : {},
    };

    const order = await razorpay.orders.create(orderOptions);

    await createPendingPayment(internalOrder.id, order.id, Number(internalOrder.total));

    return NextResponse.json(
      {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        internal_order_id: internalOrder.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Razorpay create-order error:", error);

    if (
      error?.statusCode === 401 ||
      error?.status === 401 ||
      (error?.error?.code === "BAD_REQUEST_ERROR" &&
        typeof error?.error?.description === "string" &&
        error.error.description.toLowerCase().includes("auth"))
    ) {
      return NextResponse.json(
        {
          error:
            error?.error?.description ||
            "Razorpay authentication failed. Please verify API credentials.",
        },
        { status: 401 }
      );
    }

    const errorMessage =
      error?.error?.description ||
      error?.message ||
      "Failed to create Razorpay order";

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
