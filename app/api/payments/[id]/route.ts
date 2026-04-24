// app/api/payments/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { logger } from "@/src/shared/logger";

// PATCH /api/payments/[id] — mark invoice status (PAID / PARTIAL)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = body;

    if (!["UNPAID", "PARTIAL", "PAID"].includes(status)) {
      return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
    }

    // Verify ownership via join chain
    const existing = await prisma.invoice.findFirst({
      where: {
        id,
        tenant: { room: { property: { ownerId: user.id } } }
      }
    });

    if (!existing) {
      return NextResponse.json({ error: "Invoice tidak ditemukan atau akses ditolak" }, { status: 404 });
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updated);
  } catch (error) {
    logger.error({ error, userId: user.id, invoiceId: id }, "Error updating payment");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET /api/payments/[id] — get single invoice detail
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        tenant: { room: { property: { ownerId: user.id } } }
      },
      include: {
        tenant: {
          include: {
            room: { include: { property: { select: { name: true } } } }
          }
        },
        paymentTransactions: { orderBy: { createdAt: "desc" } }
      }
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    logger.error({ error, userId: user.id, invoiceId: id }, "Error fetching invoice");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
