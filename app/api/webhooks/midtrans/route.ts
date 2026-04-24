// app/api/webhooks/midtrans/route.ts
// Handles Midtrans payment notification webhooks.
// Docs: https://docs.midtrans.com/reference/handling-notifications
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { logger } from '@/src/shared/logger';

// Midtrans IP whitelist (production IPs)
const MIDTRANS_IPS = [
  '103.208.23.0/24',
  '103.208.23.6',
  '103.208.23.7',
  '103.208.23.8',
  '103.127.16.0/23',
  '103.127.17.6',
];

function isValidMidtransIP(ip: string): boolean {
  // In development, allow all IPs
  if (process.env.NODE_ENV !== 'production') return true;

  // Check if IP matches any whitelisted IP/range
  return MIDTRANS_IPS.some(allowedIP => {
    if (allowedIP.includes('/')) {
      // CIDR range check (simplified)
      const [network] = allowedIP.split('/');
      return ip.startsWith(network.split('.').slice(0, 3).join('.'));
    }
    return ip === allowedIP;
  });
}

export async function POST(req: Request) {
  const startTime = Date.now();
  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                   req.headers.get('x-real-ip') ||
                   'unknown';

  try {
    const body = await req.json();

    logger.info({
      event: 'webhook_received',
      orderId: body.order_id,
      transactionStatus: body.transaction_status,
      clientIP,
    }, 'Midtrans webhook received');

    // 1. IP Whitelist Check
    if (!isValidMidtransIP(clientIP)) {
      logger.warn({
        event: 'webhook_blocked',
        clientIP,
        orderId: body.order_id,
      }, 'Webhook from unauthorized IP');
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Verify SHA-512 signature from Midtrans
    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${body.order_id}${body.status_code}${body.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`)
      .digest('hex');

    if (body.signature_key !== expectedSignature) {
      logger.error({
        event: 'webhook_invalid_signature',
        orderId: body.order_id,
        clientIP,
      }, 'Invalid webhook signature');
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 3. Idempotency check - prevent duplicate processing
    const existingTx = await prisma.paymentTransaction.findFirst({
      where: {
        externalId: body.order_id,
        status: 'SUCCESS'
      },
    });

    if (existingTx) {
      logger.info({
        event: 'webhook_duplicate',
        orderId: body.order_id,
      }, 'Webhook already processed');
      return NextResponse.json({ ok: true, message: 'Already processed' });
    }

    // 4. On successful payment (settlement or capture)
    if (body.transaction_status === 'settlement' || body.transaction_status === 'capture') {
      // Find the PaymentTransaction by externalId (orderId)
      const paymentTx = await prisma.paymentTransaction.findFirst({
        where: { externalId: body.order_id, status: { not: 'SUCCESS' } },
        include: { invoice: true },
      });

      if (paymentTx) {
        // Validate payment amount matches invoice
        const paidAmount = parseFloat(body.gross_amount);
        if (paidAmount < paymentTx.invoice.amount) {
          logger.warn({
            event: 'webhook_partial_payment',
            orderId: body.order_id,
            expected: paymentTx.invoice.amount,
            received: paidAmount,
          }, 'Partial payment detected');

          // Mark as PARTIAL instead of PAID
          await prisma.paymentTransaction.update({
            where: { id: paymentTx.id },
            data: { status: 'SUCCESS' },
          });

          await prisma.invoice.update({
            where: { id: paymentTx.invoiceId },
            data: { status: 'PARTIAL' },
          });
        } else {
          // Full payment
          await prisma.paymentTransaction.update({
            where: { id: paymentTx.id },
            data: { status: 'SUCCESS' },
          });

          await prisma.invoice.updateMany({
            where: {
              id: paymentTx.invoiceId,
              status: { not: 'PAID' },
            },
            data: { status: 'PAID' },
          });

          logger.info({
            event: 'webhook_payment_success',
            orderId: body.order_id,
            invoiceId: paymentTx.invoiceId,
            amount: paidAmount,
          }, 'Payment processed successfully');
        }
      } else {
        logger.warn({
          event: 'webhook_transaction_not_found',
          orderId: body.order_id,
        }, 'PaymentTransaction not found for order');
      }
    }

    // 5. On failed/expired payment
    if (body.transaction_status === 'expire' || body.transaction_status === 'cancel' || body.transaction_status === 'deny') {
      await prisma.paymentTransaction.updateMany({
        where: { externalId: body.order_id, status: 'PENDING' },
        data: { status: 'FAILED' },
      });

      logger.info({
        event: 'webhook_payment_failed',
        orderId: body.order_id,
        status: body.transaction_status,
      }, 'Payment failed/cancelled');
    }

    const duration = Date.now() - startTime;
    logger.info({
      event: 'webhook_processed',
      orderId: body.order_id,
      duration,
    }, 'Webhook processed successfully');

    return NextResponse.json({ ok: true });
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error({
      event: 'webhook_error',
      error: error instanceof Error ? error.message : 'Unknown error',
      clientIP,
      duration,
    }, 'Webhook processing failed');
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
