import prisma from "@/lib/prisma";

export type ActionType = "ADD_ROOM" | "USE_COMPLAINT" | "ADD_PROPERTY";

/**
 * Pengecekan limitasi paket berlangganan (Tier Guard)
 * @param userId ID user dari session
 * @param action Jenis aksi yang ingin dilakukan
 * @throws Error jika limit tercapai atau fitur tidak tersedia
 */
export const checkTierLimit = async (userId: string, action: ActionType) => {
  // 1. Ambil data langganan user
  const sub = await prisma.subscription.findUnique({ 
    where: { userId },
    select: { tier: true }
  });
  const tier = sub?.tier ?? "FREE";

  // 2. Proteksi limitasi kamar untuk paket FREE (Max 5)
  if (action === "ADD_ROOM" && tier === "FREE") {
    const count = await prisma.room.count({
      where: { property: { ownerId: userId } }
    });
    if (count >= 5) {
      throw new Error("UPGRADE_REQUIRED: Limit kamar (Max 5) telah tercapai untuk paket FREE.");
    }
  }

  // 3. Proteksi fitur komplain (Hanya PRO & MULTI)
  if (action === "USE_COMPLAINT" && tier === "FREE") {
    throw new Error("UPGRADE_REQUIRED: Fitur pelaporan keluhan hanya tersedia untuk paket PRO atau MULTI.");
  }

  // 4. Proteksi kepemilikan lebih dari 1 properti (Hanya MULTI)
  if (action === "ADD_PROPERTY" && tier !== "MULTI") {
    const count = await prisma.property.count({ where: { ownerId: userId } });
    if (count >= 1) {
      throw new Error("UPGRADE_REQUIRED: Limit properti tercapai. Silakan upgrade ke tier MULTI untuk manajemen multi-properti.");
    }
  }
};
