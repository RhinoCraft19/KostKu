export type Role = "SUPER_ADMIN" | "OWNER" | "ADMIN" | "TENANT";

export type Status = "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED";

export type RoomType = "STANDARD" | "DELUXE" | "VIP";

export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";

export type TenantStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "TERMINATED";

export type PaymentType =
  | "RENT"
  | "DEPOSIT"
  | "DEPOSIT_RETURN"
  | "FINE"
  | "UTILITY_ELECTRICITY"
  | "UTILITY_WATER"
  | "UTILITY_INTERNET"
  | "OTHER";

export type PaymentMethod = "MIDTRANS" | "MANUAL_TRANSFER" | "CASH";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "EXPIRED"
  | "REFUNDED"
  | "WAITING_CONFIRMATION";

export type ExpenseCategory =
  | "MAINTENANCE"
  | "ELECTRICITY"
  | "WATER"
  | "INTERNET"
  | "CLEANING"
  | "SECURITY"
  | "SALARY"
  | "TAX"
  | "OTHER";

export type MaintCategory =
  | "PLUMBING"
  | "ELECTRICAL"
  | "FURNITURE"
  | "APPLIANCE"
  | "CLEANING"
  | "SECURITY"
  | "OTHER";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type MaintStatus = "PENDING" | "IN_PROGRESS" | "DONE" | "CANCELLED";

export type AnnounceType =
  | "GENERAL"
  | "PAYMENT"
  | "MAINTENANCE"
  | "EMERGENCY";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: Role;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Kost {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  price: number;
  facilities: string[];
  photos: string[];
  status: RoomStatus;
  kostId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  userId: string;
  roomId: string;
  kostId: string;
  startDate: string;
  endDate: string;
  deposit?: number;
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  kostId: string;
  amount: number;
  type: PaymentType;
  method: PaymentMethod;
  status: PaymentStatus;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  kostId: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
  date: string;
  createdBy: string;
  createdAt: string;
}

export interface MaintenanceRequest {
  id: string;
  tenantId: string;
  roomId: string;
  title: string;
  description: string;
  category: MaintCategory;
  priority: Priority;
  status: MaintStatus;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  kostId: string;
  title: string;
  content: string;
  type: AnnounceType;
  sentAt: string;
  sentBy: string;
  createdAt: string;
}