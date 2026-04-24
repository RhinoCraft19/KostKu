import prisma from '@/src/shared/db';

export const ComplaintService = {
  /**
   * Create a new complaint (PUBLIC — no auth required).
   * The caller must provide the complaintToken to identify the property.
   */
  async createComplaint(
    complaintToken: string,
    data: {
      roomNumber: string;
      tenantName: string;
      title: string;
      description: string;
    }
  ) {
    // Find property by its unique complaintToken
    const property = await prisma.property.findUnique({
      where: { complaintToken },
    });

    if (!property) {
      throw new Error('Property not found — invalid complaint token');
    }

    // Optionally resolve roomId from roomNumber
    const room = await prisma.room.findFirst({
      where: {
        propertyId: property.id,
        roomNumber: data.roomNumber,
        deletedAt: null,
      },
    });

    return prisma.complaint.create({
      data: {
        propertyId: property.id,
        roomId: room?.id ?? null,
        roomNumber: data.roomNumber,
        tenantName: data.tenantName,
        title: data.title,
        description: data.description,
        status: 'OPEN',
      },
    });
  },

  /**
   * Get all complaints for properties owned by the given user.
   * Owner-authenticated route.
   */
  async getComplaintsByOwner(ownerId: string) {
    return prisma.complaint.findMany({
      where: {
        property: { ownerId },
      },
      include: { property: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Update complaint status (owner only).
   * Valid transitions: OPEN → IN_PROGRESS → RESOLVED
   */
  async updateComplaintStatus(
    complaintId: string,
    ownerId: string,
    status: 'IN_PROGRESS' | 'RESOLVED'
  ) {
    // Ownership check via the related property
    const complaint = await prisma.complaint.findFirst({
      where: {
        id: complaintId,
        property: { ownerId },
      },
    });

    if (!complaint) {
      throw new Error('Complaint not found or unauthorized');
    }

    return prisma.complaint.update({
      where: { id: complaintId },
      data: { status },
    });
  },
};
