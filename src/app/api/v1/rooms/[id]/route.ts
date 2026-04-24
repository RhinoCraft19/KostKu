import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/src/shared/auth";
import { successResponse, errorResponse } from "@/src/shared/utils/response";
import { RoomService } from "@/src/modules/room/room.service";

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
    const room = await RoomService.getRoomById(id, user.id);
    
    if (!room) {
      return NextResponse.json(errorResponse("Room not found"), { status: 404 });
    }

    return NextResponse.json(successResponse(room));
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

    const updatedRoom = await RoomService.updateRoom(id, user.id, body);
    return NextResponse.json(successResponse(updatedRoom));
  } catch (error: any) {
    if (error.message === 'Room not found or unauthorized') {
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
    await RoomService.deleteRoom(id, user.id);
    return NextResponse.json(successResponse({ success: true, message: "Room soft deleted" }));
  } catch (error: any) {
    if (error.message === 'Room not found or unauthorized') {
      return NextResponse.json(errorResponse(error.message), { status: 404 });
    }
    return NextResponse.json(errorResponse(error.message), { status: 500 });
  }
}
