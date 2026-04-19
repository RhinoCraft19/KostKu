export const APP_NAME = "KostKu";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const ROLES = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  TENANT: "TENANT",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROOM_TYPES = {
  STANDARD: "STANDARD",
  DELUXE: "DELUXE",
  VIP: "VIP",
} as const;

export const PAYMENT_METHODS = {
  MIDTRANS: "MIDTRANS",
  MANUAL_TRANSFER: "MANUAL_TRANSFER",
  CASH: "CASH",
} as const;

export const FREE_TIER_ROOM_LIMIT = 2;
export const COMMISSION_RATE = 0.02;