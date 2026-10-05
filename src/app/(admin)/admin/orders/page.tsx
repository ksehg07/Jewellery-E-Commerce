import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminOrdersAction } from "./actions";
import Link from "next/link";

export default async function AdminOrdersPage(props: {
  searchParams: Promise<{ page?: string; search?: string; paymentStatus?: string; orderStatus?: string }>;
}) {
  const searchParams = await props.searchParams;
  await requireAdmin();

  const page = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";
  const paymentStatus = searchParams.paymentStatus || "ALL";
  const orderStatus = searchParams.orderStatus || "ALL";

  const { orders, totalPages, totalOrders } = await getAdminOrdersAction({
    page,
    search,
    paymentStatus,
    orderStatus,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <div className="text-sm text-gray-500">Total: {totalOrders} orders</div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        {/* Filters */}
        <form className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Search</label>
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Order #, email, name"
              className="border border-gray-300 rounded px-3 py-2 text-sm w-64"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Payment Status</label>
            <select
              name="paymentStatus"
              defaultValue={paymentStatus}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Order Status</label>
            <select
              name="orderStatus"
              defaultValue={orderStatus}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="RETURNED">Returned</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
          >
            Filter
          </button>
          
          {(search || paymentStatus !== "ALL" || orderStatus !== "ALL") && (
            <Link
              href="/admin/orders"
              className="text-gray-600 px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              Clear
            </Link>
          )}
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 font-semibold text-gray-900">Order #</th>
                <th className="py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="py-3 px-4 font-semibold text-gray-900">Customer</th>
                <th className="py-3 px-4 font-semibold text-gray-900">Items</th>
                <th className="py-3 px-4 font-semibold text-gray-900">Total</th>
                <th className="py-3 px-4 font-semibold text-gray-900">Payment</th>
                <th className="py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="py-3 px-4 font-semibold text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    {search ? "No orders match your search." : "No orders found."}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-blue-600">
                      <Link href={`/admin/orders/${order.id}`}>#{order.orderNumber}</Link>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {order.createdAt.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium">{order.user.name}</div>
                      <div className="text-xs text-gray-500">{order.user.email}</div>
                    </td>
                    <td className="py-3 px-4 text-sm">{order._count.items}</td>
                    <td className="py-3 px-4 font-medium">₹{Number(order.total).toLocaleString("en-IN")}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          order.payment?.status === "SUCCESS"
                            ? "bg-green-100 text-green-800"
                            : order.payment?.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.payment?.status || "PENDING"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/orders?page=${Math.max(1, page - 1)}&search=${search}&paymentStatus=${paymentStatus}&orderStatus=${orderStatus}`}
                className={`px-3 py-1 border rounded text-sm ${
                  page === 1 ? "text-gray-400 border-gray-200 pointer-events-none" : "hover:bg-gray-50"
                }`}
              >
                Previous
              </Link>
              <Link
                href={`/admin/orders?page=${Math.min(totalPages, page + 1)}&search=${search}&paymentStatus=${paymentStatus}&orderStatus=${orderStatus}`}
                className={`px-3 py-1 border rounded text-sm ${
                  page === totalPages ? "text-gray-400 border-gray-200 pointer-events-none" : "hover:bg-gray-50"
                }`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
