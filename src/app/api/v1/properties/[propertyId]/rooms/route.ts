import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/src/shared/auth";
import { successResponse, errorResponse } from "@/src/shared/utils/response";
import { RoomService } from "@/src/modules/room/room.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
    }

    const { propertyId } = await params;
    const rooms = await RoomService.getRoomsByProperty(propertyId, user.id);
    return NextResponse.json(successResponse(rooms));
  } catch (error: any) {
    if (error.message === 'Property not found or unauthorized') {
      return NextResponse.json(errorResponse(error.message), { status: 404 });
    }
    return NextResponse.json(errorResponse(error.message), { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
    }

    const { propertyId } = await params;
    const body = await request.json();
    
    if (!body.roomNumber || typeof body.price !== 'number') {
      return NextResponse.json(errorResponse("roomNumber and valid price are required"), { status: 400 });
    }

    const newRoom = await RoomService.createRoom(propertyId, user.id, {
      roomNumber: body.roomNumber,
      price: body.price,
    });

    return NextResponse.json(successResponse(newRoom), { status: 201 });
  } catch (error: any) {
    if (error.message === 'Property not found or unauthorized') {
      return NextResponse.json(errorResponse(error.message), { status: 404 });
    }
    return NextResponse.json(errorResponse(error.message), { status: 500 });
  }
}
