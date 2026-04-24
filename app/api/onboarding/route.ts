import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { logger } from "@/src/shared/logger";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, address, city } = body;

    if (!name || !address) {
      return NextResponse.json({ error: "Name and address are required" }, { status: 400 });
    }

    // Generate complaint token
    const { randomUUID } = await import("crypto");
    const complaintToken = randomUUID();

    // Use Prisma transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Sync User to Prisma
      const dbUser = await tx.user.upsert({
        where: { email: user.email! },
        update: {
          name: user.user_metadata.full_name || user.email!.split("@")[0],
        },
        create: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata.full_name || user.email!.split("@")[0],
        },
      });

      // 2. Initialize FREE Subscription
      await tx.subscription.upsert({
        where: { userId: dbUser.id },
        update: {},
        create: {
          userId: dbUser.id,
          tier: "FREE",
          status: "ACTIVE",
        },
      });

      // 3. Create First Property
      const property = await tx.property.create({
        data: {
          ownerId: dbUser.id,
          name,
          address,
          city,
          complaintToken,
        },
      });

      return { dbUser, property };
    });

    logger.info({
      userId: result.dbUser.id,
      propertyId: result.property.id
    }, "Onboarding completed successfully");

    return NextResponse.json({ success: true, propertyId: result.property.id });
  } catch (error) {
    logger.error({ error, userId: user.id }, "Onboarding failed");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
