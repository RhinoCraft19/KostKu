import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/src/shared/auth";
import { successResponse, errorResponse } from "@/src/shared/utils/response";
import { TenantService } from "@/src/modules/tenant/tenant.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
    }

    const { roomId } = await params;
    const tenants = await TenantService.getTenantsByRoom(roomId, user.id);
    return NextResponse.json(successResponse(tenants));
  } catch (error: any) {
    if (error.message === 'Room not found or unauthorized') {
      return NextResponse.json(errorResponse(error.message), { status: 404 });
    }
    return NextResponse.json(errorResponse(error.message), { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
    }

    const { roomId } = await params;
    const body = await request.json();
    
    if (!body.name || !body.phone || !body.startDate || !body.billingCycle || !body.billingDay) {
      return NextResponse.json(errorResponse("name, phone, startDate, billingCycle, and billingDay are required"), { status: 400 });
    }

    const newTenant = await TenantService.createTenant(roomId, user.id, {
      name: body.name,
      phone: body.phone,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      billingCycle: body.billingCycle,
      billingDay: body.billingDay,
    });

    return NextResponse.json(successResponse(newTenant), { status: 201 });
  } catch (error: any) {
    if (error.message === 'Room not found or unauthorized') {
      return NextResponse.json(errorResponse(error.message), { status: 404 });
    }
    if (error.message === 'Room is not vacant' || error.message.startsWith('Invalid billing')) {
      return NextResponse.json(errorResponse(error.message), { status: 400 });
    }
    return NextResponse.json(errorResponse(error.message), { status: 500 });
  }
}
