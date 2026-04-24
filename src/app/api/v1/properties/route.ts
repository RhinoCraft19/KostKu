import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/src/shared/auth";
import { successResponse, errorResponse } from "@/src/shared/utils/response";
import { PropertyService } from "@/src/modules/property/property.service";
import { getCache, setCache, invalidateCache } from "@/src/shared/cache";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
    }

    const cacheKey = `properties:${user.id}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return NextResponse.json(successResponse(cached));
    }

    const properties = await PropertyService.getPropertiesByOwner(user.id);
    await setCache(cacheKey, properties, 120); // TTL: 2 minutes
    return NextResponse.json(successResponse(properties));
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
    }

    const body = await request.json();
    if (!body.name || !body.address) {
      return NextResponse.json(errorResponse("Name and address are required"), { status: 400 });
    }

    const newProperty = await PropertyService.createProperty(user.id, {
      name: body.name,
      address: body.address,
      city: body.city,
    });

    // Invalidate cache so the next GET fetches fresh data
    await invalidateCache(`properties:${user.id}`);
    return NextResponse.json(successResponse(newProperty), { status: 201 });
  } catch (error: any) {
    return NextResponse.json(errorResponse(error.message), { status: 500 });
  }
}
