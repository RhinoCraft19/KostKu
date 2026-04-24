import prisma from '@/src/shared/db';

export const TenantService = {
  async createTenant(roomId: string, ownerId: string, data: { name: string; phone: string; startDate: Date; endDate?: Date; billingCycle: string; billingDay: number }) {
    // Validate room exists, belongs to owner, and is VACANT
    const room = await prisma.room.findFirst({
      where: { id: roomId, deletedAt: null },
      include: { property: true },
    });

    if (!room || room.property.ownerId !== ownerId || room.property.deletedAt !== null) {
      throw new Error('Room not found or unauthorized');
    }

    if (room.status !== 'VACANT') {
      throw new Error('Room is not vacant');
    }

    if (data.billingCycle !== 'MONTHLY') {
      throw new Error('Invalid billing cycle');
    }

    if (data.billingDay < 1 || data.billingDay > 31) {
      throw new Error('Invalid billing day, must be 1-31');
    }

    return prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          ...data,
          roomId,
        },
      });

      await tx.room.update({
        where: { id: roomId },
        data: { status: 'OCCUPIED' },
      });

      return tenant;
    });
  },

  async getTenantsByRoom(roomId: string, ownerId: string) {
    const room = await prisma.room.findFirst({
      where: { id: roomId, deletedAt: null },
      include: { property: true },
    });

    if (!room || room.property.ownerId !== ownerId || room.property.deletedAt !== null) {
      throw new Error('Room not found or unauthorized');
    }

    return prisma.tenant.findMany({
      where: {
        roomId,
        isActive: true,
      },
    });
  },

  async getTenantById(tenantId: string, ownerId: string) {
    const tenant = await prisma.tenant.findFirst({
      where: { id: tenantId, isActive: true },
      include: { room: { include: { property: true } } },
    });

    if (!tenant || tenant.room.property.ownerId !== ownerId || tenant.room.property.deletedAt !== null) {
      return null;
    }

    return tenant;
  },

  async updateTenant(tenantId: string, ownerId: string, data: { name?: string; phone?: string; endDate?: Date; isActive?: boolean }) {
    const tenant = await this.getTenantById(tenantId, ownerId);
    if (!tenant) {
      throw new Error('Tenant not found or unauthorized');
    }

    return prisma.$transaction(async (tx) => {
      const updatedTenant = await tx.tenant.update({
        where: { id: tenantId },
        data,
      });

      // If tenant becomes inactive, make room vacant
      if (data.isActive === false) {
        await tx.room.update({
          where: { id: tenant.roomId },
          data: { status: 'VACANT' },
        });
      }

      return updatedTenant;
    });
  },
};
