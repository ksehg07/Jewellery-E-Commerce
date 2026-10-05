import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma/client";
import { generateInvoicePDF } from "@/services/invoice.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        address: true,
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const pdfBuffer = await generateInvoicePDF(order);

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Invoice-${order.orderNumber}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Invoice generation error:", error);
    // Explicitly return a 401/403 if requireAdmin fails (it usually throws or redirects)
    return NextResponse.json({ error: "Unauthorized or server error" }, { status: 500 });
  }
}
