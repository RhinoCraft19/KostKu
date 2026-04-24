import prisma from '@/src/shared/db';
import { ForbiddenError } from '@/src/shared/errors';

/**
 * Tier limits config.
 * - FREE  : max 1 property, max 10 rooms
 * - PRO   : max 5 properties, max 50 rooms
 * - MULTI : unlimited
 */
const TIER_LIMITS: Record<string, { maxProperties: number; maxRooms: number }> = {
  FREE: { maxProperties: 1, maxRooms: 10 },
  PRO: { maxProperties: 5, maxRooms: 50 },
  MULTI: { maxProperties: Infinity, maxRooms: Infinity },
};

/**
 * Ensure the user has not exceeded their subscription limit for properties.
 * Call this before creating a new Property.
 */
export async function checkPropertyTierLimit(userId: string): Promise<void> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  const tier = subscription?.tier ?? 'FREE';
  const limit = TIER_LIMITS[tier] ?? TIER_LIMITS['FREE'];

  const currentCount = await prisma.property.count({
    where: { ownerId: userId, deletedAt: null },
  });

  if (currentCount >= limit.maxProperties) {
    throw new ForbiddenError(
      `Paket ${tier} hanya mendukung maksimal ${limit.maxProperties} properti. Upgrade untuk menambah lebih banyak.`
    );
  }
}

/**
 * Ensure the user has not exceeded their subscription limit for rooms
 * within a given property.
 * Call this before creating a new Room.
 */
export async function checkRoomTierLimit(
  userId: string,
  propertyId: string
): Promise<void> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  const tier = subscription?.tier ?? 'FREE';
  const limit = TIER_LIMITS[tier] ?? TIER_LIMITS['FREE'];

  // Count rooms across ALL properties of this owner
  const currentCount = await prisma.room.count({
    where: {
      property: { ownerId: userId },
      deletedAt: null,
    },
  });

  if (currentCount >= limit.maxRooms) {
    throw new ForbiddenError(
      `Paket ${tier} hanya mendukung maksimal ${limit.maxRooms} kamar total. Upgrade untuk menambah lebih banyak.`
    );
  }
}

export const SubscriptionService = {
  /** Get the current user's subscription */
  async getSubscription(userId: string) {
    return prisma.subscription.findUnique({ where: { userId } });
  },

  /** Ensure a subscription row exists (auto-provision FREE tier). */
  async ensureSubscription(userId: string) {
    return prisma.subscription.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        tier: 'FREE',
        status: 'ACTIVE',
      },
    });
  },
};
