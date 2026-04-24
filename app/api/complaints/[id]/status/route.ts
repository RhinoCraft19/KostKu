import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { updateComplaintStatusSchema } from "@/lib/validations/complaint.schema";
import { logger } from "@/src/shared/logger";

// PATCH /api/complaints/[id]/status
// Body: { status: "IN_PROGRESS" | "RESOLVED" }
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Zod validation
    const result = updateComplaintStatusSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid status payload", details: result.error.format() },
        { status: 400 }
      );
    }

    const { status } = result.data;

    // Verify user owns the property linked to this complaint
    const existingComplaint = await prisma.complaint.findUnique({
      where: { id },
      include: { property: { select: { ownerId: true } } }
    });

    if (!existingComplaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    if (existingComplaint.property.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update the status — resolvedAt does NOT exist in schema, skip it
    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedComplaint);
  } catch (error) {
    logger.error({ error, userId: session.user.id, complaintId: id }, "Error updating complaint status");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
