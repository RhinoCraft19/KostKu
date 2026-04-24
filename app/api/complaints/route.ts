import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { ComplaintStatus } from "@prisma/client";
import { logger } from "@/src/shared/logger";

// GET /api/complaints?propertyId=xxx&status=OPEN
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");
  const statusStr = searchParams.get("status");

  if (!propertyId) {
    return NextResponse.json({ error: "propertyId is required" }, { status: 400 });
  }

  try {
    // Verifikasi bahwa user adalah owner dari property tersebut
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { ownerId: true },
    });

    if (!property || property.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: You don't have access to this property" }, { status: 403 });
    }

    // TIER GUARD CHECK (Owner side)
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      select: { tier: true }
    });

    const tier = subscription?.tier ?? "FREE";
    if (tier === "FREE") {
      logger.warn({ userId: session.user.id, tier }, "Complaint feature not available for FREE tier");
      return NextResponse.json({
        error: "Fitur pelaporan keluhan hanya tersedia untuk paket PRO atau MULTI. Silakan upgrade paket Anda."
      }, { status: 403 });
    }

    // Bangun filter status jika ada
    const whereClause: {
      propertyId: string;
      status?: ComplaintStatus;
    } = { propertyId };

    if (statusStr && statusStr !== "ALL") {
      // Validasi status
      if (['OPEN', 'IN_PROGRESS', 'RESOLVED'].includes(statusStr)) {
        whereClause.status = statusStr as ComplaintStatus;
      }
    }

    const complaints = await prisma.complaint.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(complaints);
  } catch (error) {
    logger.error({ error, userId: session.user.id, propertyId }, "Error fetching complaints");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
