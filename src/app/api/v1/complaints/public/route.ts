import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/src/shared/utils/response';
import { ComplaintService } from '@/src/modules/complaint/complaint.service';

/**
 * POST /api/v1/complaints/public
 * Public endpoint — NO authentication required.
 * Body: { complaintToken, roomNumber, tenantName, title, description }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { complaintToken, roomNumber, tenantName, title, description } = body;

    if (!complaintToken || !roomNumber || !tenantName || !title || !description) {
      return NextResponse.json(
        errorResponse('complaintToken, roomNumber, tenantName, title, and description are required'),
        { status: 400 }
      );
    }

    const complaint = await ComplaintService.createComplaint(complaintToken, {
      roomNumber,
      tenantName,
      title,
      description,
    });

    return NextResponse.json(successResponse(complaint), { status: 201 });
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), { status: 500 });
  }
}
