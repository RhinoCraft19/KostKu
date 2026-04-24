// app/api/rooms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { checkRoomTierLimit } from "@/src/modules/subscription/subscription.service";
import { logger } from "@/src/shared/logger";

// GET /api/rooms?propertyId=xxx
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");

  if (!propertyId) {
    return NextResponse.json({ error: "propertyId is required" }, { status: 400 });
  }

  try {
    const rooms = await prisma.room.findMany({
      where: {
        propertyId,
        deletedAt: null,
        property: { ownerId: user.id } // Security check
      },
      include: {
        tenants: {
          where: { isActive: true },
          take: 1,
        }
      },
      orderBy: { roomNumber: 'asc' }
    });

    return NextResponse.json(rooms);
  } catch (error) {
    logger.error({ error, userId: user.id, propertyId }, "Error fetching rooms");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/rooms
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { propertyId, roomNumber, price } = body;

    if (!propertyId || !roomNumber || !price) {
      return NextResponse.json({ error: "propertyId, roomNumber, dan price wajib diisi" }, { status: 400 });
    }

    // 1. TIER GUARD CHECK
    try {
      await checkRoomTierLimit(user.id, propertyId);
    } catch (tierError: unknown) {
      const msg = tierError instanceof Error ? tierError.message : "Upgrade required";
      logger.warn({ userId: user.id, error: msg }, "Room tier limit reached");
      return NextResponse.json({ error: msg }, { status: 403 });
    }

    // 2. Validate property ownership
    const property = await prisma.property.findFirst({
      where: { id: propertyId, ownerId: user.id, deletedAt: null }
    });

    if (!property) {
      return NextResponse.json({ error: "Properti tidak ditemukan atau akses ditolak" }, { status: 404 });
    }

    // 3. Create room — only fields that exist in schema
    const room = await prisma.room.create({
      data: {
        propertyId,
        roomNumber,
        price: parseInt(price),
        status: "VACANT"
      }
    });

    logger.info({ userId: user.id, roomId: room.id, propertyId }, "Room created successfully");
    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    logger.error({ error, userId: user.id }, "Error creating room");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
