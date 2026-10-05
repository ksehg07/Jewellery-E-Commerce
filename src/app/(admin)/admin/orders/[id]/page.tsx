import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminOrderDetailsAction } from "../actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusForm } from "./status-form";

export default async function AdminOrderDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await requireAdmin();

  const order = await getAdminOrderDetailsAction(params.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="text-gray-500 hover:text-gray-900">
          ← Back to orders
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Order #{order.orderNumber}</h1>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            order.payment?.status === "SUCCESS"
              ? "bg-green-100 text-green-800"
              : order.payment?.status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          Payment: {order.payment?.status || "PENDING"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Order Items & Pricing Summary */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-sm text-gray-500">
                    <th className="py-2">Product</th>
                    <th className="py-2">Details</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">Qty</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items.map((item) => (
                    <tr key={item.id} className="text-sm">
                      <td className="py-4">
                        <div className="font-medium text-gray-900">{item.productName}</div>
                        <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                      </td>
                      <td className="py-4">
                        <div className="text-xs text-gray-600">
                          {item.metal} {item.purity} • {Number(item.netWeight)}g
                        </div>
                        {Number(item.metalRate) > 0 && (
                          <div className="text-xs text-gray-500">Rate: ₹{Number(item.metalRate).toLocaleString("en-IN")}/g</div>
                        )}
                        {Number(item.makingCharge) > 0 && (
                          <div className="text-xs text-gray-500">Making: ₹{Number(item.makingCharge).toLocaleString("en-IN")}</div>
                        )}
                        {Number(item.stoneCharge) > 0 && (
                          <div className="text-xs text-gray-500">Stone: ₹{Number(item.stoneCharge).toLocaleString("en-IN")}</div>
                        )}
                        {Number(item.gst) > 0 && (
                          <div className="text-xs text-gray-500">GST: ₹{Number(item.gst).toLocaleString("en-IN")}</div>
                        )}
                      </td>
                      <td className="py-4 text-right">₹{Number(item.price).toLocaleString("en-IN")}</td>
                      <td className="py-4 text-right">{item.quantity}</td>
                      <td className="py-4 text-right font-medium">₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span>₹{Number(order.shippingCharge).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total GST</span>
                <span>₹{Number(order.gst).toLocaleString("en-IN")}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{Number(order.discount).toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                <span>Final Total</span>
                <span>₹{Number(order.total).toLocaleString("en-IN")}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
              <a
                href={`/api/admin/orders/${order.id}/invoice`}
                target="_blank"
                className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Invoice
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Status */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Customer Details</h2>
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-gray-500 text-xs">Name</div>
                <div className="font-medium">{order.user.name}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs">Email</div>
                <div>{order.user.email}</div>
              </div>
              {order.user.phone && (
                <div>
                  <div className="text-gray-500 text-xs">Phone</div>
                  <div>{order.user.phone}</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
            <div className="text-sm space-y-1">
              <div className="font-medium">{order.address.recipientName}</div>
              <div>{order.address.addressLine1}</div>
              {order.address.addressLine2 && <div>{order.address.addressLine2}</div>}
              <div>
                {order.address.city}, {order.address.state} {order.address.postalCode}
              </div>
              <div>{order.address.country}</div>
              <div className="pt-2 text-gray-500">Phone: {order.address.phone}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Order Status</h2>
            <StatusForm orderId={order.id} currentStatus={order.status} />
          </div>

          {order.payment && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Payment Details</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-500 text-xs">Method</div>
                  <div>Razorpay</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Razorpay Order ID</div>
                  <div className="font-mono text-xs break-all">{order.payment.gatewayOrderId}</div>
                </div>
                {order.payment.gatewayPaymentId && (
                  <div>
                    <div className="text-gray-500 text-xs">Razorpay Payment ID</div>
                    <div className="font-mono text-xs break-all">{order.payment.gatewayPaymentId}</div>
                  </div>
                )}
                {order.payment.paidAt && (
                  <div>
                    <div className="text-gray-500 text-xs">Paid At</div>
                    <div>{order.payment.paidAt.toLocaleString()}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
