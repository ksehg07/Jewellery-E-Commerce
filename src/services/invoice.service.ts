import PDFDocument from "pdfkit";
import { Order, OrderItem, Address, User } from "@/generated/prisma/client";

type OrderWithDetails = Order & {
  items: OrderItem[];
  address: Address;
  user: User;
};

export async function generateInvoicePDF(order: OrderWithDetails): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Header
      doc.fontSize(20).text("INVOICE", { align: "right" });
      doc.moveDown();
      doc.fontSize(10).text("Parth Jewellers", { align: "left" });
      doc.text("support@parthjewellers.com");
      doc.moveDown();

      // Order Details
      doc.text(`Order Number: ${order.orderNumber}`);
      doc.text(`Date: ${order.createdAt.toLocaleDateString()}`);
      doc.moveDown();

      // Billing / Shipping
      doc.text("Billed To:");
      doc.text(order.address.recipientName);
      doc.text(order.address.addressLine1);
      if (order.address.addressLine2) doc.text(order.address.addressLine2);
      doc.text(`${order.address.city}, ${order.address.state} ${order.address.postalCode}`);
      doc.text(order.address.country);
      doc.moveDown(2);

      // Items Table Header
      const tableTop = doc.y;
      doc.font("Helvetica-Bold");
      doc.text("Item", 50, tableTop);
      doc.text("Qty", 350, tableTop);
      doc.text("Price", 400, tableTop);
      doc.text("Total", 480, tableTop);
      
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
      
      let y = tableTop + 25;
      doc.font("Helvetica");

      // Items
      order.items.forEach((item: OrderItem) => {
        doc.text(item.productName, 50, y);
        doc.text(item.quantity.toString(), 350, y);
        doc.text(`Rs.${Number(item.price).toFixed(2)}`, 400, y);
        doc.text(`Rs.${(Number(item.price) * item.quantity).toFixed(2)}`, 480, y);
        y += 20;
      });

      doc.moveTo(50, y).lineTo(550, y).stroke();
      y += 15;

      // Totals
      doc.font("Helvetica-Bold");
      doc.text("Subtotal:", 400, y);
      doc.text(`Rs.${Number(order.subtotal).toFixed(2)}`, 480, y);
      y += 15;
      
      if (Number(order.discount) > 0) {
        doc.text("Discount:", 400, y);
        doc.text(`-Rs.${Number(order.discount).toFixed(2)}`, 480, y);
        y += 15;
      }
      
      if (Number(order.shippingCharge) > 0) {
        doc.text("Shipping:", 400, y);
        doc.text(`Rs.${Number(order.shippingCharge).toFixed(2)}`, 480, y);
        y += 15;
      }

      doc.text("Total:", 400, y);
      doc.text(`Rs.${Number(order.total).toFixed(2)}`, 480, y);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
