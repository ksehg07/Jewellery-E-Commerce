import {
  AlertTriangle,
  ClipboardList,
  Package,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma/client";
import { UserRole } from "@/generated/prisma/client";

const metricDefinitions = [
  {
    key: "products",
    label: "Total products",
    icon: Package,
    tone: "text-accent",
  },
  {
    key: "orders",
    label: "Total orders",
    icon: ClipboardList,
    tone: "text-foreground",
  },
  {
    key: "lowStock",
    label: "Low stock",
    icon: AlertTriangle,
    tone: "text-destructive",
  },
  {
    key: "customers",
    label: "Total customers",
    icon: Users,
    tone: "text-foreground",
  },
] as const;

export default async function AdminDashboardPage() {
  const [totalProducts, totalOrders, lowStock, totalCustomers, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.inventory.count({
        where: {
          quantity: {
            lte: prisma.inventory.fields.lowStockThreshold,
          },
        },
      }),
      prisma.user.count({
        where: {
          role: UserRole.CUSTOMER,
        },
      }),
      prisma.order.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          orderNumber: true,
          total: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

  const metrics = {
    products: totalProducts,
    orders: totalOrders,
    lowStock,
    customers: totalCustomers,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">
          A clear view of the store&apos;s current activity.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricDefinitions.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.key}
              className="border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {metric.label}
                </p>
                <Icon className={`size-5 ${metric.tone}`} />
              </div>
              <p className="mt-7 font-display text-4xl">
                {metrics[metric.key].toLocaleString("en-IN")}
              </p>
            </article>
          );
        })}
      </section>

      <section className="border border-border bg-card">
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-accent">
              Activity
            </p>
            <h2 className="mt-1 font-display text-2xl">Recent orders</h2>
          </div>
          <Badge variant="outline">Live data</Badge>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-5 py-14 text-center sm:px-6">
            <p className="font-display text-2xl">No orders yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Recent customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:px-6"
              >
                <div>
                  <p className="text-sm font-medium">{order.orderNumber}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {order.user.name} · {order.user.email}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm font-medium">
                    ₹{Number(order.total).toLocaleString("en-IN")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {order.createdAt.toLocaleDateString("en-IN")}
                  </p>
                </div>
                <Badge variant="secondary">{order.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
