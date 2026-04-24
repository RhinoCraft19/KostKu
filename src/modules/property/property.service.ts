import prisma from '@/src/shared/db';
import { checkPropertyTierLimit } from '@/src/modules/subscription/subscription.service';

export const PropertyService = {
  async createProperty(ownerId: string, data: { name: string; address: string; city?: string }) {
    // Enforce subscription tier limit before creating
    await checkPropertyTierLimit(ownerId);

    return prisma.property.create({
      data: {
        ...data,
        ownerId,
        complaintToken: crypto.randomUUID(), // Automatically generate a unique token
      },
    });
  },

  async getPropertiesByOwner(ownerId: string) {
    return prisma.property.findMany({
      where: {
        ownerId,
        deletedAt: null,
      },
    });
  },

  async getPropertyById(propertyId: string, ownerId: string) {
    return prisma.property.findFirst({
      where: {
        id: propertyId,
        ownerId,
        deletedAt: null,
      },
    });
  },

  async updateProperty(propertyId: string, ownerId: string, data: { name?: string; address?: string; city?: string }) {
    // Check if property exists and belongs to owner
    const property = await this.getPropertyById(propertyId, ownerId);
    if (!property) {
      throw new Error('Property not found or unauthorized');
    }

    return prisma.property.update({
      where: { id: propertyId },
      data,
    });
  },

  async deleteProperty(propertyId: string, ownerId: string) {
    // Check if property exists and belongs to owner
    const property = await this.getPropertyById(propertyId, ownerId);
    if (!property) {
      throw new Error('Property not found or unauthorized');
    }

    return prisma.property.update({
      where: { id: propertyId },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
