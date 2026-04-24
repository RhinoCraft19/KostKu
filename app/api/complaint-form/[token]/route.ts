import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createComplaintSchema } from "@/lib/validations/complaint.schema";
import { logger } from "@/src/shared/logger";

// POST /api/complaint-form/[token]
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();

    // Zod validation
    const result = createComplaintSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: result.error.format() },
        { status: 400 }
      );
    }

    // Only destructure fields that exist in the Complaint schema
    const { tenantName, roomNumber, description } = result.data;

    // Lookup property by complaint token
    const property = await prisma.property.findUnique({
      where: { complaintToken: token },
      select: { id: true, ownerId: true }
    });

    if (!property) {
      return NextResponse.json(
        { error: "Token tidak valid atau properti tidak ditemukan." },
        { status: 404 }
      );
    }

    // TIER GUARD CHECK — complaint feature only for PRO/MULTI
    const subscription = await prisma.subscription.findUnique({
      where: { userId: property.ownerId },
      select: { tier: true }
    });

    const tier = subscription?.tier ?? "FREE";
    if (tier === "FREE") {
      logger.warn({ ownerId: property.ownerId, tier }, "Complaint feature not available for FREE tier");
      return NextResponse.json(
        {
          error: "Layanan Keluhan Dinonaktifkan",
          details: "Pemilik properti perlu melakukan upgrade paket untuk mengaktifkan fitur ini."
        },
        { status: 403 }
      );
    }

    // (Optional) Verify roomNumber exists in this property
    const room = await prisma.room.findFirst({
      where: { propertyId: property.id, roomNumber },
      select: { id: true }
    });

    // Insert complaint — only fields that exist in schema
    const newComplaint = await prisma.complaint.create({
      data: {
        propertyId: property.id,
        roomId: room ? room.id : null,
        tenantName,
        roomNumber,
        title: `Laporan dari Kamar ${roomNumber}`,  // title is required in schema
        description,
        status: "OPEN"
      }
    });

    logger.info({ complaintId: newComplaint.id, propertyId: property.id }, "Complaint created successfully");
    return NextResponse.json({ success: true, complaint: newComplaint }, { status: 201 });
  } catch (error) {
    logger.error({ error }, "Error creating complaint");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
