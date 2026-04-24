import prisma from '@/src/shared/db';
import { RoomStatus } from '@prisma/client';

export const RoomService = {
  async createRoom(propertyId: string, ownerId: string, data: { roomNumber: string; price: number }) {
    // Validate property belongs to owner
    const property = await prisma.property.findFirst({
      where: { id: propertyId, ownerId, deletedAt: null },
    });

    if (!property) {
      throw new Error('Property not found or unauthorized');
    }

    return prisma.room.create({
      data: {
        ...data,
        propertyId,
      },
    });
  },

  async getRoomsByProperty(propertyId: string, ownerId: string) {
    // Validate property belongs to owner
    const property = await prisma.property.findFirst({
      where: { id: propertyId, ownerId, deletedAt: null },
    });

    if (!property) {
      throw new Error('Property not found or unauthorized');
    }

    return prisma.room.findMany({
      where: {
        propertyId,
        deletedAt: null,
      },
    });
  },

  async getRoomById(roomId: string, ownerId: string) {
    const room = await prisma.room.findFirst({
      where: { id: roomId, deletedAt: null },
      include: { property: true },
    });

    if (!room || room.property.ownerId !== ownerId || room.property.deletedAt !== null) {
      return null;
    }

    return room;
  },

  async updateRoom(roomId: string, ownerId: string, data: { roomNumber?: string; price?: number; status?: RoomStatus }) {
    const room = await this.getRoomById(roomId, ownerId);
    if (!room) {
      throw new Error('Room not found or unauthorized');
    }

    return prisma.room.update({
      where: { id: roomId },
      data,
    });
  },

  async deleteRoom(roomId: string, ownerId: string) {
    const room = await this.getRoomById(roomId, ownerId);
    if (!room) {
      throw new Error('Room not found or unauthorized');
    }

    return prisma.room.update({
      where: { id: roomId },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
