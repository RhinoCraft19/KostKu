import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/src/shared/auth';
import { successResponse, errorResponse } from '@/src/shared/utils/response';
import { BillingService } from '@/src/modules/billing/billing.service';

/**
 * GET /api/v1/billing/invoices?tenantId=xxx
 * Returns all invoices for a specific tenant (owner-authenticated).
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    if (!tenantId) {
      return NextResponse.json(errorResponse('tenantId is required'), { status: 400 });
    }

    const invoices = await BillingService.getInvoicesByTenant(tenantId);
    return NextResponse.json(successResponse(invoices));
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), { status: 500 });
  }
}
