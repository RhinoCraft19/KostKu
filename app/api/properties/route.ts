import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { checkPropertyTierLimit } from "@/src/modules/subscription/subscription.service";
import { logger } from "@/src/shared/logger";

// GET /api/properties
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const properties = await prisma.property.findMany({
      where: { ownerId: user.id, deletedAt: null },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(properties);
  } catch (error) {
    logger.error({ error, userId: user.id }, "Error fetching properties");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/properties
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, address, city } = body;

    if (!name || !address) {
      return NextResponse.json({ error: "name dan address wajib diisi" }, { status: 400 });
    }

    // 1. TIER GUARD CHECK
    try {
      await checkPropertyTierLimit(user.id);
    } catch (tierError: unknown) {
      const msg = tierError instanceof Error ? tierError.message : "Upgrade required";
      logger.warn({ userId: user.id, error: msg }, "Property tier limit reached");
      return NextResponse.json({ error: msg }, { status: 403 });
    }

    // 2. Generate complaint token
    const { randomUUID } = await import("crypto");
    const complaintToken = randomUUID();

    // 3. Create property — only fields that exist in schema
    const property = await prisma.property.create({
      data: {
        ownerId: user.id,
        name,
        address,
        city,
        complaintToken,
      }
    });

    logger.info({ userId: user.id, propertyId: property.id }, "Property created successfully");
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    logger.error({ error, userId: user.id }, "Error creating property");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
