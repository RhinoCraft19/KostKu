import prisma from '@/src/shared/db';
import { snap } from '@/src/infrastructure/midtrans/client';
import type { MidtransSnapResponse } from '@/types/midtrans';

export const PaymentService = {
  /**
   * Initiate a Midtrans Snap payment for a given invoice.
   * Creates a PaymentTransaction record with status PENDING,
   * then returns the Snap payment URL.
   */
  async initiatePayment(invoiceId: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        tenant: { include: { room: { include: { property: true } } } },
      },
    });

    if (!invoice) throw new Error('Invoice not found');
    if (invoice.status === 'PAID') throw new Error('Invoice is already paid');

    const orderId = `KOSTOS-INV-${invoice.id}-${Date.now()}`;

    // Call Midtrans Snap to create a payment page
    const snapResponse = await (snap.createTransaction as (params: unknown) => Promise<MidtransSnapResponse>)({
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
          name: `Tagihan Kos - ${invoice.tenant.room.property.name} Kamar ${invoice.tenant.room.roomNumber}`,
        },
      ],
    });

    // Persist a PENDING payment transaction record
    const transaction = await prisma.paymentTransaction.create({
      data: {
        invoiceId: invoice.id,
        amount: invoice.amount,
        method: 'MIDTRANS',
        status: 'PENDING',
        externalId: orderId,
      },
    });

    return {
      snapToken: snapResponse.token,
      snapUrl: snapResponse.redirect_url,
      orderId,
      transactionId: transaction.id,
    };
  },

  /** List all payment transactions for a given invoice */
  async getTransactionsByInvoice(invoiceId: string) {
    return prisma.paymentTransaction.findMany({
      where: { invoiceId },
      orderBy: { createdAt: 'desc' },
    });
  },
};
