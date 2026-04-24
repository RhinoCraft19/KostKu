import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/src/shared/auth";
import { successResponse, errorResponse } from "@/src/shared/utils/response";
import { PropertyService } from "@/src/modules/property/property.service";

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
    const property = await PropertyService.getPropertyById(id, user.id);
    
    if (!property) {
      return NextResponse.json(errorResponse("Property not found"), { status: 404 });
    }

    return NextResponse.json(successResponse(property));
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

    const updatedProperty = await PropertyService.updateProperty(id, user.id, body);
    return NextResponse.json(successResponse(updatedProperty));
  } catch (error: any) {
    if (error.message === 'Property not found or unauthorized') {
      return NextResponse.json(errorResponse(error.message), { status: 404 });
    }
    return NextResponse.json(errorResponse(error.message), { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
    }

    const { id } = await params;
    await PropertyService.deleteProperty(id, user.id);
    return NextResponse.json(successResponse({ success: true, message: "Property soft deleted" }));
  } catch (error: any) {
    if (error.message === 'Property not found or unauthorized') {
      return NextResponse.json(errorResponse(error.message), { status: 404 });
    }
    return NextResponse.json(errorResponse(error.message), { status: 500 });
  }
}
