import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/src/shared/auth';
import { successResponse, errorResponse } from '@/src/shared/utils/response';
import { ComplaintService } from '@/src/modules/complaint/complaint.service';

type RouteParams = { params: Promise<{ id: string }> };

/**
 * PATCH /api/v1/complaints/[id]
 * Body: { status: "IN_PROGRESS" | "RESOLVED" }
 * Updates complaint status (owner-authenticated).
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['IN_PROGRESS', 'RESOLVED'].includes(status)) {
      return NextResponse.json(
        errorResponse('status must be IN_PROGRESS or RESOLVED'),
        { status: 400 }
      );
    }

    const updated = await ComplaintService.updateComplaintStatus(id, user.id, status);
    return NextResponse.json(successResponse(updated));
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), { status: 500 });
  }
}
