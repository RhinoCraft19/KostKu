import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/src/shared/auth";
import { successResponse, errorResponse } from "@/src/shared/utils/response";
import { TenantService } from "@/src/modules/tenant/tenant.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
    }

    const { id } = await params;
    const tenant = await TenantService.getTenantById(id, user.id);
    
    if (!tenant) {
      return NextResponse.json(errorResponse("Tenant not found"), { status: 404 });
    }

    return NextResponse.json(successResponse(tenant));
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null;

    const updatedTenant = await TenantService.updateTenant(id, user.id, updateData);
    return NextResponse.json(successResponse(updatedTenant));
  } catch (error: any) {
    if (error.message === 'Tenant not found or unauthorized') {
      return NextResponse.json(errorResponse(error.message), { status: 404 });
    }
    return NextResponse.json(errorResponse(error.message), { status: 500 });
  }
}
