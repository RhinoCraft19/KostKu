import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/src/shared/auth';
import { successResponse, errorResponse } from '@/src/shared/utils/response';
import { ComplaintService } from '@/src/modules/complaint/complaint.service';

/**
 * GET /api/v1/complaints
 * Lists all complaints for properties owned by the authenticated user.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    const complaints = await ComplaintService.getComplaintsByOwner(user.id);
    return NextResponse.json(successResponse(complaints));
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), { status: 500 });
  }
}
