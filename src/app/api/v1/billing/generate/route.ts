import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/src/shared/auth';
import { successResponse, errorResponse } from '@/src/shared/utils/response';
import { BillingService } from '@/src/modules/billing/billing.service';

/**
 * POST /api/v1/billing/generate
 * Internal / cron-protected endpoint to trigger daily invoice generation.
 * Protect this route with a secret header in production.
 */
export async function POST(request: NextRequest) {
  try {
    const cronSecret = request.headers.get('x-cron-secret');
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    const results = await BillingService.generateDailyInvoices();
    return NextResponse.json(
      successResponse(results, { generated: results.length }),
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), { status: 500 });
  }
}
