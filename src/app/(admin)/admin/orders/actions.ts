"use server";

import { prisma } from "@/lib/prisma/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { OrderStatus, PaymentStatus, Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";

export async function getAdminOrdersAction({
  page = 1,
  limit = 20,
  search = "",
  paymentStatus,
  orderStatus,
}: {
  page?: number;
  limit?: number;
  search?: string;
  paymentStatus?: string;
  orderStatus?: string;
}) {
  await requireAdmin();

  const skip = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {};

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      {
        user: {
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { name: { contains: search, mode: "insensitive" } },
          ],
        },
      },
    ];
  }

  if (paymentStatus && paymentStatus !== "ALL") {
    where.payment = { status: paymentStatus as PaymentStatus };
  }

  if (orderStatus && orderStatus !== "ALL") {
    where.status = orderStatus as OrderStatus;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
        payment: { select: { status: true } },
        _count: { select: { items: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    totalOrders: total,
  };
}

export async function getAdminOrderDetailsAction(id: string) {
  await requireAdmin();

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      address: true,
      items: {
        include: {
          product: {
            select: {
              name: true,
            },
          },
        },
      },
      payment: true,
    },
  });

  return order;
}

export async function updateOrderStatusAction(id: string, newStatus: OrderStatus) {
  await requireAdmin();

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath(`/admin/orders`);
    revalidatePath(`/admin/orders/${id}`);

    return { success: true, order };
  } catch (error: any) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}
