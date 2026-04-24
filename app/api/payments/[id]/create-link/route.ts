// app/api/payments/[id]/create-link/route.ts
// Creates a Midtrans Snap payment link for an Invoice.
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { snap } from "@/lib/midtrans";
import { logger } from "@/src/shared/logger";
import type { MidtransSnapResponse } from "@/types/midtrans";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // 1. Fetch the invoice with full tenant + room + property info
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        tenant: {
          include: {
            room: {
              include: {
                property: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // 2. Generate a unique order ID
    const orderId = `KOSTOS-INV-${invoice.id}-${Date.now()}`;

    // 3. Create a Midtrans Snap transaction
    const transaction = await (snap.createTransaction as (params: unknown) => Promise<MidtransSnapResponse>)({
      transaction_details: {
        order_id: orderId,
        gross_amount: invoice.amount,
      },
      customer_details: {
        first_name: invoice.tenant.name,
        phone: invoice.tenant.phone,
      },
      item_details: [
        {
          id: invoice.id,
          price: invoice.amount,
          quantity: 1,
          name: `Sewa ${invoice.tenant.room.property.name} - Kamar ${invoice.tenant.room.roomNumber}`,
        },
      ],
    });

    // 4. Record a PENDING PaymentTransaction in the database
    await prisma.paymentTransaction.create({
      data: {
        invoiceId: invoice.id,
        amount: invoice.amount,
        method: "MIDTRANS",
        status: "PENDING",
        externalId: orderId,
      },
    });

    logger.info({ invoiceId: invoice.id, orderId }, "Payment link created successfully");
    return NextResponse.json({ paymentUrl: transaction.redirect_url });
  } catch (error) {
    logger.error({ error }, "Midtrans Create Transaction Error");
    return NextResponse.json(
      { error: "Failed to create payment link" },
      { status: 500 },
    );
  }
}
