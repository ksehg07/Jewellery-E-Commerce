import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma/client";
import { generateInvoicePDF } from "@/services/invoice.service";
import { sendEmail } from "@/lib/email/send-email";
import { orderConfirmationEmailTemplate } from "@/lib/email/templates";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in to continue." },
        { status: 401 }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body || {};

    const resolvedOrderId = (razorpay_order_id || "").trim();
    const resolvedPaymentId = (razorpay_payment_id || "").trim();
    const resolvedSignature = (razorpay_signature || "").trim();

    if (!resolvedOrderId || !resolvedPaymentId || !resolvedSignature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields.",
        },
        { status: 400 }
      );
    }

    // Verify HMAC-SHA256 signature
    let isValid = false;
    try {
      isValid = verifyPaymentSignature({
        orderId: resolvedOrderId,
        paymentId: resolvedPaymentId,
        signature: resolvedSignature,
      });
    } catch (err: any) {
      console.error("Signature verification error:", err);
      return NextResponse.json(
        { success: false, error: err.message || "Verification failed" },
        { status: 500 }
      );
    }

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification failed: Signature mismatch",
        },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { gatewayOrderId: resolvedOrderId },
      include: {
        order: {
          include: {
            user: true,
            items: true,
            address: true
          }
        }
      }
    });

    if (!payment || !payment.order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (payment.status === "SUCCESS") {
      return NextResponse.json({ success: true, message: "Payment already verified", order_id: resolvedOrderId, payment_id: resolvedPaymentId }, { status: 200 });
    }

    if (payment.order.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized order verification" }, { status: 403 });
    }

    // Mark as SUCCESS and CONFIRMED atomically
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          gatewayPaymentId: resolvedPaymentId,
          gatewaySignature: resolvedSignature,
          status: "SUCCESS",
          paidAt: new Date(),
        },
      });
      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          status: "CONFIRMED",
        },
      });
    });

    try {
      const pdfBuffer = await generateInvoicePDF(payment.order);
      const emailContent = orderConfirmationEmailTemplate({
        orderNumber: payment.order.orderNumber,
        customerName: payment.order.address.recipientName,
        totalAmount: payment.order.total.toString()
      });

      await sendEmail({
        to: payment.order.user.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
        attachments: [
          {
            filename: `Invoice-${payment.order.orderNumber}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf"
          }
        ]
      });
    } catch (emailError: any) {
      console.error("Failed to generate/send invoice email:", emailError);
      // DO NOT ROLLBACK PAYMENT IF EMAIL FAILS!
    }

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified successfully",
        order_id: resolvedOrderId,
        payment_id: resolvedPaymentId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Razorpay verify-payment error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error during verification",
      },
      { status: 500 }
    );
  }
}
