"use client";

import { useState } from "react";
import { updateOrderStatusAction } from "../actions";
import { OrderStatus } from "@/generated/prisma/client";

export function StatusForm({ orderId, currentStatus }: { orderId: string; currentStatus: OrderStatus }) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    const res = await updateOrderStatusAction(orderId, status);
    setLoading(false);
    if (!res.success) {
      alert("Failed to update status");
    }
  }

  return (
    <div className="space-y-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as OrderStatus)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
      >
        <option value="PENDING">Pending</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="PROCESSING">Processing</option>
        <option value="SHIPPED">Shipped</option>
        <option value="DELIVERED">Delivered</option>
        <option value="CANCELLED">Cancelled</option>
        <option value="RETURNED">Returned</option>
        <option value="REFUNDED">Refunded</option>
      </select>
      
      {status !== currentStatus && (
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Update Status"}
        </button>
      )}
    </div>
  );
}
