// app/api/payments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { logger } from "@/src/shared/logger";

// GET /api/payments?month=2026-04&status=UNPAID
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month"); // format: "2026-04"
  const status = searchParams.get("status"); // "UNPAID" | "PARTIAL" | "PAID"

  // Build date range filter from month param
  let dateFilter = {};
  if (month) {
    const [year, m] = month.split("-").map(Number);
    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 0, 23, 59, 59);
    dateFilter = { dueDate: { gte: start, lte: end } };
  }

  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        ...dateFilter,
        ...(status && status !== "ALL" ? { status: status as "UNPAID" | "PARTIAL" | "PAID" } : {}),
        tenant: {
          room: { property: { ownerId: user.id } }
        }
      },
      include: {
        tenant: {
          include: {
            room: { select: { roomNumber: true, propertyId: true } }
          }
        },
        paymentTransactions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { dueDate: "asc" }
    });

    return NextResponse.json(invoices);
  } catch (error) {
    logger.error({ error, userId: user.id }, "Error fetching payments");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
