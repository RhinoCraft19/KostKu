import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/src/shared/auth';
import { successResponse, errorResponse } from '@/src/shared/utils/response';
import { PaymentService } from '@/src/modules/payment/payment.service';

/**
 * POST /api/v1/payments/initiate
 * Body: { invoiceId: string }
 * Creates a Midtrans Snap payment session for the given invoice.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    const body = await request.json();
    if (!body.invoiceId) {
      return NextResponse.json(errorResponse('invoiceId is required'), { status: 400 });
    }

    const result = await PaymentService.initiatePayment(body.invoiceId);
    return NextResponse.json(successResponse(result), { status: 201 });
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), { status: 500 });
  }
}
