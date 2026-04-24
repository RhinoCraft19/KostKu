export type RoomStatus = "VACANT" | "OCCUPIED" | "MAINTENANCE";
export type PaymentStatus = "UNPAID" | "PARTIAL" | "PAID";
export type ComplaintStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";
export type SubscriptionTier = "FREE" | "PRO" | "MULTI";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  createdAt: string;
}

export interface Property {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  city?: string | null;
  totalRooms: number;
  complaintToken: string;
  createdAt: string;
}

export interface Room {
  id: string;
  propertyId: string;
  roomNumber: string;
  type: string;
  price: number;
  facilities: string[];
  photoUrl?: string | null;
  status: RoomStatus;
  createdAt: string;
  property?: Property;
  tenant?: Tenant | null;
}

export interface Tenant {
  id: string;
  roomId: string;
  name: string;
  phone: string;
  idNumber: string;
  idPhotoUrl?: string | null;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  createdAt: string;
  room?: Room;
}

export interface Payment {
  id: string;
  tenantId: string;
  tenantName: string;
  roomNumber: string;
  amount: number;
  amountPaid: number;
  dueDate: string;
  paidDate?: string | null;
  status: PaymentStatus;
  paymentProofUrl?: string | null;
  midtransPaymentUrl?: string | null;
  month: number;
  year: number;
  propertyId: string;
  createdAt: string;
  tenant?: Tenant;
}

export interface MarkPaidInput {
  paymentId: string;
  paidDate: string;
  paymentProofUrl?: string;
}

export interface PaymentFilter {
  month: number;
  year: number;
  status?: PaymentStatus | "ALL";
}

export type ComplaintCategory = "KEBOCORAN" | "LISTRIK" | "FASILITAS" | "LAINNYA";

export interface Complaint {
  id: string;
  tenantName: string;
  roomNumber: string;
  category: ComplaintCategory;
  description: string;
  photoUrl: string | null;
  status: ComplaintStatus;
  createdAt: string;
  propertyId: string;
}

export interface ComplaintFilter {
  status?: ComplaintStatus | "ALL";
}

export interface CreateComplaintInput {
  tenantName: string;
  roomNumber: string;
  category: ComplaintCategory;
  description: string;
  photoUrl?: string;
}
