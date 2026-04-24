import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import prisma from '@/src/shared/db';
import { errorResponse, successResponse } from '@/src/shared/utils/response';

/**
 * POST /api/v1/payments/webhook
 * Receives Midtrans payment notifications.
 * NO auth session required — Midtrans calls this endpoint directly.
 * Security: verified via SHA-512 signature from Midtrans.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── 1. Verify Midtrans signature ───────────────────────────────────────
    const { order_id, status_code, gross_amount, signature_key } = body;

    const expectedSignature = createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`)
      .digest('hex');

    if (signature_key !== expectedSignature) {
      return NextResponse.json(errorResponse('Invalid signature'), { status: 403 });
    }

    // ── 2. Determine final payment status ──────────────────────────────────
    const transactionStatus: string = body.transaction_status;
    const fraudStatus: string = body.fraud_status;

    let newPaymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED' = 'PENDING';

    if (transactionStatus === 'capture') {
      newPaymentStatus = fraudStatus === 'accept' ? 'SUCCESS' : 'FAILED';
    } else if (transactionStatus === 'settlement') {
      newPaymentStatus = 'SUCCESS';
    } else if (
      ['cancel', 'deny', 'expire', 'failure'].includes(transactionStatus)
    ) {
      newPaymentStatus = 'FAILED';
    }

    // ── 3. Find the PaymentTransaction record by externalId (orderId) ──────
    const paymentTransaction = await prisma.paymentTransaction.findFirst({
      where: { externalId: order_id },
    });

    if (!paymentTransaction) {
      // Log but return 200 so Midtrans doesn't retry indefinitely
      console.warn(`[Webhook] PaymentTransaction not found for orderId: ${order_id}`);
      return NextResponse.json(successResponse({ received: true }));
    }

    // ── 4. Update PaymentTransaction status ────────────────────────────────
    await prisma.paymentTransaction.update({
      where: { id: paymentTransaction.id },
      data: { status: newPaymentStatus },
    });

    // ── 5. If SUCCESS, mark the related Invoice as PAID ────────────────────
    if (newPaymentStatus === 'SUCCESS') {
      await prisma.invoice.update({
        where: { id: paymentTransaction.invoiceId },
        data: { status: 'PAID' },
      });
    }

    return NextResponse.json(successResponse({ received: true, status: newPaymentStatus }));
  } catch (error: any) {
    console.error('[Webhook Error]', error);
    return NextResponse.json(errorResponse(error.message), { status: 500 });
  }
}
