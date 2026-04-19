# 🏠 KostKu - Brainstorming & Project Specification

**Aplikasi Manajemen Kost Berbasis Web**
*Untuk Pemilik, Admin, dan Penghuni di Indonesia*

---

## 📋 Executive Summary

KostKu adalah aplikasi web untuk manajemen kost yang menghubungkan pemilik kost, admin, dan penghuni dalam satu platform terintegrasi.

### Target Market
- **Indonesia** (primary market)
- **Pemilik kost** dengan 5-10 kamar per lokasi
- **Multi-property support** (satu pemilik bisa punya banyak kost)
- **Penghuni** yang ingin kemudahan pembayaran online

### MVP Timeline
**4 Minggu (1 Bulan)**

---

## 🎯 User Roles & Akses

| Role | Deskripsi | Akses Utama |
|------|-----------|-------------|
| **Super Admin** | Tim KostKu | Verifikasi pemilik, kelola platform |
| **Owner (Pemilik)** | Pemilik kost | Kelola multiple kost, laporan keuangan, assign admin |
| **Admin** | Orang yang dipekerjakan pemilik | Kelola kost spesifik, konfirmasi pembayaran |
| **Tenant (Penghuni)** | Penghuni kost | Bayar kos, lihat tagihan, lapor maintenance |

---

## 💰 Business Model

### Freemium Structure
```
🆓 FREE TIER
├── Maksimal 2 kamar per pemilik
├── Fitur dasar manajemen
└── Pembayaran online dengan komisi

⭐ PREMIUM TIER (Coming Soon)
├── Unlimited kamar
├── Multiple admin
├── Advanced reporting
├── Priority support
└── White-label option
```

### Revenue Stream
- **Komisi 2%** dari setiap transaksi pembayaran online
- **Subscription** untuk upgrade ke premium (post-MVP)

---

## 🏗️ Technical Architecture

### Core Stack
```
┌─────────────────────────────────────┐
│         FRONTEND LAYER              │
├─────────────────────────────────────┤
│  • Next.js 14 (App Router)          │
│  • React 18 + TypeScript            │
│  • TailwindCSS + shadcn/ui          │
│  • React Query (TanStack Query)     │
│  • Zustand (State Management)       │
│  • next-intl (i18n ID/EN)           │
└─────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────┐
│          BACKEND LAYER              │
├─────────────────────────────────────┤
│  • Next.js API Routes               │
│  • Supabase Auth                    │
│  • Prisma ORM                       │
│  • Midtrans SDK (Payment)           │
│  • Resend (Email)                   │
└─────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────┐
│         DATABASE LAYER              │
├─────────────────────────────────────┤
│  • Supabase PostgreSQL              │
│  • Supabase Storage (Files)         │
│  • Redis (Optional - cache)           │
└─────────────────────────────────────┘
```

### Environment Configuration
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Midtrans (Sandbox)
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false

# Resend Email
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@kostku.id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📊 Feature Matrix

### 🔴 MUST HAVE (MVP)
| Fitur | Priority | Estimasi | Status |
|-------|----------|----------|--------|
| Authentication & RBAC | 🔴 Critical | 2 hari | ⬜ |
| Multi-language (ID/EN) | 🔴 Critical | 1 hari | ⬜ |
| Kost Management (CRUD) | 🔴 Critical | 2 hari | ⬜ |
| Room Management | 🔴 Critical | 2 hari | ⬜ |
| Tenant Management | 🔴 Critical | 2 hari | ⬜ |
| Payment Online (Midtrans) | 🔴 Critical | 3 hari | ⬜ |
| Upload Bukti Transfer | 🔴 Critical | 1 hari | ⬜ |
| Dashboard Owner/Admin | 🔴 Critical | 2 hari | ⬜ |
| Payment History | 🔴 Critical | 1 hari | ⬜ |
| Email Notifications | 🔴 Critical | 1 hari | ⬜ |

### 🟡 SHOULD HAVE (MVP Stretch)
| Fitur | Priority | Estimasi | Status |
|-------|----------|----------|--------|
| Manual Transfer Confirmation | 🟡 High | 1 hari | ⬜ |
| Basic Financial Reports | 🟡 High | 2 hari | ⬜ |
| Maintenance Request | 🟡 High | 1 hari | ⬜ |
| Announcement System | 🟡 Medium | 1 hari | ⬜ |
| Room Photos (Storage) | 🟡 Medium | 1 hari | ⬜ |

### 🟢 NICE TO HAVE (Post-MVP)
- Advanced analytics & reporting
- Mobile app (React Native/Expo)
- Chat system
- Review & rating
- IoT integration (smart lock, etc)
- WhatsApp API integration

---

## 🗄️ Database Schema (Prisma)

```prisma
// User & Authentication
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String
  phone         String?
  role          Role      // SUPER_ADMIN, OWNER, ADMIN, TENANT
  status        Status    // ACTIVE, INACTIVE, PENDING
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  ownedKosts    Kost[]    @relation("KostOwner")
  adminKosts    Kost[]    @relation("KostAdmins")
  tenantProfile Tenant?
}

model Kost {
  id            String    @id @default(uuid())
  name          String
  address       String
  city          String
  province      String
  description   String?
  rules         String?
  ownerId       String
  owner         User      @relation("KostOwner", fields: [ownerId], references: [id])
  admins        User[]    @relation("KostAdmins")
  rooms         Room[]
  payments      Payment[]
  expenses      Expense[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Room {
  id            String    @id @default(uuid())
  number        String
  type          RoomType  // STANDARD, DELUXE, VIP
  price         Decimal   @db.Decimal(10, 2)
  facilities    String[]  // AC, WIFI, TV, etc
  photos        String[]  // URLs to Supabase Storage
  description   String?
  status        RoomStatus // AVAILABLE, OCCUPIED, MAINTENANCE
  kostId        String
  kost          Kost      @relation(fields: [kostId], references: [id])
  tenant        Tenant?
  maintenanceReqs MaintenanceRequest[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Tenant {
  id            String    @id @default(uuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id])
  roomId        String    @unique
  room          Room      @relation(fields: [roomId], references: [id])
  kostId        String
  emergencyContact String?
  emergencyPhone String?
  startDate     DateTime
  endDate       DateTime
  deposit       Decimal?  @db.Decimal(10, 2)
  depositStatus DepositStatus // HELD, RETURNED, DEDUCTED
  status        TenantStatus // ACTIVE, EXPIRED, PENDING, TERMINATED
  payments      Payment[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Payment {
  id              String    @id @default(uuid())
  tenantId        String
  tenant          Tenant    @relation(fields: [tenantId], references: [id])
  kostId          String
  kost            Kost      @relation(fields: [kostId], references: [id])
  amount          Decimal   @db.Decimal(10, 2)
  adminFee        Decimal?  @db.Decimal(10, 2) // Biaya admin
  commission      Decimal?  @db.Decimal(10, 2) // Komisi KostKu
  totalAmount     Decimal   @db.Decimal(10, 2)
  type            PaymentType // RENT, DEPOSIT, DEPOSIT_RETURN, FINE, UTILITY
  method          PaymentMethod // MIDTRANS, MANUAL_TRANSFER, CASH
  status          PaymentStatus // PENDING, PAID, FAILED, CANCELLED, EXPIRED, REFUNDED
  dueDate         DateTime
  paidAt          DateTime?
  periodStart     DateTime? // Periode sewa mulai
  periodEnd       DateTime? // Periode sewa selesai
  proofUrl        String?   // Bukti transfer (manual)
  proofUploadedAt DateTime?
  midtransOrderId String?   // Order ID Midtrans
  midtransResponse Json?     // Response dari Midtrans
  notes           String?
  confirmedBy     String?   // Admin yang konfirmasi
  confirmedAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Expense {
  id          String    @id @default(uuid())
  kostId      String
  kost        Kost      @relation(fields: [kostId], references: [id])
  category    ExpenseCategory // MAINTENANCE, ELECTRICITY, WATER, INTERNET, SALARY, OTHER
  amount      Decimal   @db.Decimal(10, 2)
  description String?
  date        DateTime
  receiptUrl  String?   // URL foto struk
  createdBy   String
  createdAt   DateTime  @default(now())
}

model MaintenanceRequest {
  id          String    @id @default(uuid())
  tenantId    String
  roomId      String
  room        Room      @relation(fields: [roomId], references: [id])
  title       String
  description String
  category    MaintCategory // PLUMBING, ELECTRICAL, FURNITURE, APPLIANCE, CLEANING, OTHER
  priority    Priority  // LOW, MEDIUM, HIGH, URGENT
  status      MaintStatus // PENDING, IN_PROGRESS, DONE, CANCELLED
  images      String[]  // URLs foto kerusakan
  resolvedAt  DateTime?
  resolvedBy  String?
  notes       String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Announcement {
  id          String    @id @default(uuid())
  kostId      String
  kost        Kost      @relation(fields: [kostId], references: [id])
  title       String
  content     String
  type        AnnounceType // GENERAL, PAYMENT, MAINTENANCE, EMERGENCY
  targetRoles Role[]    // Ditujukan untuk role apa saja
  sentAt      DateTime  @default(now())
  sentBy      String
  createdAt   DateTime  @default(now())
}

// Enums
enum Role {
  SUPER_ADMIN
  OWNER
  ADMIN
  TENANT
}

enum Status {
  ACTIVE
  INACTIVE
  PENDING
  SUSPENDED
}

enum RoomType {
  STANDARD
  DELUXE
  VIP
}

enum RoomStatus {
  AVAILABLE
  OCCUPIED
  MAINTENANCE
  RESERVED
}

enum TenantStatus {
  PENDING
  ACTIVE
  EXPIRED
  TERMINATED
}

enum DepositStatus {
  HELD
  RETURNED
  DEDUCTED
  PARTIAL_RETURNED
}

enum PaymentType {
  RENT
  DEPOSIT
  DEPOSIT_RETURN
  FINE
  UTILITY_ELECTRICITY
  UTILITY_WATER
  UTILITY_INTERNET
  OTHER
}

enum PaymentMethod {
  MIDTRANS
  MANUAL_TRANSFER
  CASH
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  CANCELLED
  EXPIRED
  REFUNDED
  WAITING_CONFIRMATION
}

enum ExpenseCategory {
  MAINTENANCE
  ELECTRICITY
  WATER
  INTERNET
  CLEANING
  SECURITY
  SALARY
  TAX
  OTHER
}

enum MaintCategory {
  PLUMBING
  ELECTRICAL
  FURNITURE
  APPLIANCE
  CLEANING
  SECURITY
  OTHER
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum MaintStatus {
  PENDING
  IN_PROGRESS
  DONE
  CANCELLED
}

enum AnnounceType {
  GENERAL
  PAYMENT
  MAINTENANCE
  EMERGENCY
}
```

---

## 🎨 User Flows

### 1️⃣ Owner (Pemilik) Flow
```
┌─────────────────────────────────────────────────────────────┐
│  REGISTER → Verify Email → Create Kost → Add Rooms          │
│      ↓                                                         │
│  Invite Admin (opsional) → Dashboard Overview                  │
│      ↓                                                         │
│  Monitor Occupancy → Track Payments → View Reports             │
│      ↓                                                         │
│  Manage Tenants → Handle Maintenance → Broadcast Announcement │
└─────────────────────────────────────────────────────────────┘
```

**Key Actions:**
- ✅ Create & manage multiple kost properties
- ✅ Add unlimited rooms (Freemium: max 2 untuk trial)
- ✅ Assign admins to specific kosts
- ✅ View financial reports & analytics
- ✅ Confirm manual transfer payments
- ✅ Broadcast announcements to tenants

### 2️⃣ Admin Flow
```
┌─────────────────────────────────────────────────────────────┐
│  LOGIN (Owner invitation / Direct register)                   │
│      ↓                                                         │
│  Access Assigned Kost → Manage Rooms                         │
│      ↓                                                         │
│  Add/Edit Tenants → Process Payments                         │
│      ↓                                                         │
│  Handle Maintenance Requests → Send Announcements              │
└─────────────────────────────────────────────────────────────┘
```

**Key Actions:**
- ✅ Manage kost yang di-assign oleh owner
- ✅ CRUD tenants & room assignments
- ✅ Konfirmasi pembayaran manual
- ✅ Handle maintenance requests
- ✅ Kirim pengumuman ke tenants

### 3️⃣ Tenant (Penghuni) Flow
```
┌─────────────────────────────────────────────────────────────┐
│  REGISTER / Get Invitation → Complete Profile                │
│      ↓                                                         │
│  Dashboard → View Current Bill → Payment Options              │
│      ↓                                                         │
│  ┌─────────────────┐    ┌─────────────────┐                  │
│  │  MIDTRANS PAY   │    │ MANUAL TRANSFER │                  │
│  │  (Online)       │    │ (Upload Bukti)  │                  │
│  │                 │    │                 │                  │
│  │  Select Method →│    │ Upload Proof →  │                  │
│  │  Pay → Success  │    │ Wait Confirm    │                  │
│  └─────────────────┘    └─────────────────┘                  │
│      ↓                                                         │
│  Payment History → Download Receipt → Report Maintenance       │
│      ↓                                                         │
│  View Announcements → Check Room Details                       │
└─────────────────────────────────────────────────────────────┘
```

**Key Actions:**
- ✅ Lihat tagihan bulanan
- ✅ Bayar via Midtrans (multiple payment methods)
- ✅ Upload bukti transfer untuk konfirmasi manual
- ✅ Lihat riwayat pembayaran & download kwitansi
- ✅ Laporkan kerusakan/maintenance
- ✅ Lihat pengumuman dari pengelola

---

## 💳 Payment Flow Detail

### A. Midtrans Payment Flow
```
Tenant View Bill
      ↓
Click "Pay Now"
      ↓
Backend: Create Payment Record (PENDING)
      ↓
Generate Midtrans Snap Token
      ↓
Redirect to Midtrans Payment Page
      ↓
┌──────────────────────────────────────┐
│  Payment Success                     │
│  ↓                                   │
│  Midtrans Callback → Update DB       │
│  ↓                                   │
│  Send Email Receipt                  │
│  ↓                                   │
│  Redirect to Success Page            │
└──────────────────────────────────────┘
         OR
┌──────────────────────────────────────┐
│  Payment Failed/Expired              │
│  ↓                                   │
│  Update Status → Allow Retry          │
│  ↓                                   │
│  Send Reminder Email                  │
└──────────────────────────────────────┘
```

### B. Manual Transfer Flow
```
Tenant View Bill
      ↓
Select "Manual Transfer"
      ↓
See Bank Details & Upload Form
      ↓
Upload Transfer Proof (Image)
      ↓
Backend: Save Proof, Status = WAITING_CONFIRMATION
      ↓
Send Email to Admin (New Payment Proof)
      ↓
┌──────────────────────────────────────┐
│  Admin Dashboard                      │
│  ↓                                   │
│  See Pending Confirmations            │
│  ↓                                   │
│  Review Proof → Approve/Reject        │
│  ↓                                   │
│  If Approved: Status = PAID          │
│  ↓                                   │
│  Send Email Receipt to Tenant         │
└──────────────────────────────────────┘
```

---

## 📅 Development Timeline

### Week 1: Foundation & Auth (Days 1-7)
**Goals: Project setup, auth, database, i18n**

| Day | Task | Deliverable |
|-----|------|-------------|
| 1 | Initialize Next.js 14 project with TypeScript | Project structure ready |
| 2 | Setup TailwindCSS + shadcn/ui components | UI kit ready |
| 3 | Setup Supabase project + Prisma schema | Database connected |
| 4 | Setup i18n (next-intl) with ID/EN | Bilingual support |
| 5 | Implement authentication (login/register) | Auth pages working |
| 6 | RBAC middleware & protected routes | Role-based access |
| 7 | Testing & bug fixes | Auth system stable |

**Week 1 Deliverable:** Authentication system berfungsi, bisa login sebagai semua role

---

### Week 2: Core Management (Days 8-14)
**Goals: Kost, Room, Tenant management**

| Day | Task | Deliverable |
|-----|------|-------------|
| 8 | Kost CRUD (Owner only) | Create & manage kost |
| 9 | Room CRUD + types & facilities | Room management |
| 10 | Room assignment logic | Assign tenant to room |
| 11 | Tenant CRUD + kontrak | Tenant management |
| 12 | Tenant invitation system | Email invitation |
| 13 | Owner/Admin dashboard (basic) | Dashboard UI |
| 14 | Supabase Storage setup | File upload ready |

**Week 2 Deliverable:** Owner bisa kelola kost lengkap dengan rooms & tenants

---

### Week 3: Payment System (Days 15-21)
**Goals: Midtrans integration & notifications**

| Day | Task | Deliverable |
|-----|------|-------------|
| 15 | Midtrans Snap integration | Payment gateway connected |
| 16 | Payment flow (create → pay → callback) | End-to-end payment |
| 17 | Manual transfer upload flow | Bukti transfer upload |
| 18 | Admin payment confirmation | Konfirmasi admin |
| 19 | Payment history & receipt | Riwayat & kwitansi |
| 20 | Resend email integration | Email service ready |
| 21 | Email templates & cron job | Notifikasi otomatis |

**Week 3 Deliverable:** Pembayaran online berfungsi lengkap dengan notifikasi

---

### Week 4: Polish & Launch (Days 22-28)
**Goals: Reports, maintenance, deployment**

| Day | Task | Deliverable |
|-----|------|-------------|
| 22 | Financial reports (basic) | Laporan keuangan |
| 23 | Maintenance request system | Maintenance flow |
| 24 | Announcement/broadcast | Pengumuman system |
| 25 | Responsive design testing | Mobile-friendly |
| 26 | Bug fixes & optimization | Performance optimized |
| 27 | Deployment to Vercel | Live on production |
| 28 | Documentation & user guide | Documentation ready |

**Week 4 Deliverable:** MVP ready for beta testing!

---

## 📁 Project Structure

```
kostku/
├── app/                          # App Router
│   ├── (auth)/                   # Auth group (no sidebar)
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   │
│   ├── (dashboard)/              # Dashboard group (with sidebar)
│   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   ├── page.tsx              # Role-based redirect
│   │   │
│   │   ├── owner/                # Owner routes
│   │   │   ├── dashboard/
│   │   │   ├── kosts/
│   │   │   │   ├── page.tsx      # List kosts
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx  # Kost detail
│   │   │   │   │   ├── rooms/
│   │   │   │   │   ├── tenants/
│   │   │   │   │   └── payments/
│   │   │   │   └── create/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   │
│   │   ├── admin/                # Admin routes
│   │   │   ├── dashboard/
│   │   │   ├── kosts/
│   │   │   ├── tenants/
│   │   │   ├── payments/
│   │   │   │   └── pending/      # Konfirmasi manual
│   │   │   ├── maintenance/
│   │   │   └── announcements/
│   │   │
│   │   └── tenant/               # Tenant routes
│   │       ├── dashboard/
│   │       ├── payments/
│   │       │   └── [id]/         # Payment detail
│   │       ├── history/          # Riwayat pembayaran
│   │       ├── maintenance/
│   │       └── announcements/
│   │
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/    # NextAuth routes
│   │   ├── kosts/
│   │   │   ├── route.ts          # CRUD kosts
│   │   │   └── [id]/
│   │   ├── rooms/
│   │   ├── tenants/
│   │   ├── payments/
│   │   │   ├── route.ts
│   │   │   └── midtrans/
│   │   │       ├── token.ts     # Generate snap token
│   │   │       └── callback.ts  # Handle callback
│   │   ├── maintenance/
│   │   ├── announcements/
│   │   ├── reports/
│   │   └── upload/
│   │
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page (public)
│   ├── globals.css
│   └── loading.tsx
│
├── components/                    # React Components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── ...
│   │
│   ├── layouts/                  # Layout components
│   │   ├── dashboard-sidebar.tsx
│   │   ├── dashboard-header.tsx
│   │   └── mobile-nav.tsx
│   │
│   ├── forms/                    # Form components
│   │   ├── kost-form.tsx
│   │   ├── room-form.tsx
│   │   ├── tenant-form.tsx
│   │   ├── payment-form.tsx
│   │   └── maintenance-form.tsx
│   │
│   ├── tables/                   # Data table components
│   │   ├── kosts-table.tsx
│   │   ├── rooms-table.tsx
│   │   ├── tenants-table.tsx
│   │   ├── payments-table.tsx
│   │   └── data-table.tsx        # Reusable table
│   │
│   ├── charts/                   # Chart components
│   │   ├── occupancy-chart.tsx
│   │   ├── revenue-chart.tsx
│   │   └── stats-cards.tsx
│   │
│   ├── modals/                   # Modal components
│   │   ├── confirm-modal.tsx
│   │   ├── payment-modal.tsx
│   │   └── upload-modal.tsx
│   │
│   └── shared/                   # Shared components
│       ├── breadcrumb.tsx
│       ├── pagination.tsx
│       ├── search-filter.tsx
│       └── locale-switcher.tsx
│
├── lib/                          # Utilities & Config
│   ├── prisma.ts                 # Prisma client
│   ├── supabase/
│   │   ├── client.ts             # Supabase browser client
│   │   ├── server.ts             # Supabase server client
│   │   └── admin.ts              # Supabase admin client
│   ├── midtrans.ts               # Midtrans configuration
│   ├── resend.ts                 # Resend email config
│   ├── auth.ts                   # Auth helpers
│   ├── utils.ts                  # General utilities
│   ├── constants.ts              # App constants
│   └── validations/              # Zod schemas
│       ├── kost.ts
│       ├── room.ts
│       ├── tenant.ts
│       └── payment.ts
│
├── hooks/                        # Custom React hooks
│   ├── use-auth.ts
│   ├── use-user.ts
│   ├── use-kosts.ts
│   ├── use-rooms.ts
│   ├── use-tenants.ts
│   ├── use-payments.ts
│   ├── use-maintenance.ts
│   └── use-locale.ts
│
├── stores/                       # Zustand stores
│   ├── auth-store.ts
│   ├── kost-store.ts
│   └── ui-store.ts
│
├── types/                        # TypeScript types
│   ├── auth.ts
│   ├── kost.ts
│   ├── room.ts
│   ├── tenant.ts
│   ├── payment.ts
│   ├── maintenance.ts
│   └── index.ts
│
├── i18n/                         # Internationalization
│   ├── config.ts
│   ├── locales.ts
│   └── messages/
│       ├── id.json               # Bahasa Indonesia
│       └── en.json               # English
│
├── prisma/
│   └── schema.prisma             # Database schema
│
├── public/                       # Static assets
│   ├── images/
│   │   ├── logo.svg
│   │   ├── logo-white.svg
│   │   └── placeholder-room.jpg
│   ├── favicon.ico
│   └── manifest.json
│
├── emails/                       # Email templates
│   ├── welcome.tsx
│   ├── payment-reminder.tsx
│   ├── payment-receipt.tsx
│   └── maintenance-notification.tsx
│
├── middleware.ts                 # Next.js middleware (auth, i18n)
├── next.config.js               # Next.js config
├── tailwind.config.ts           # Tailwind config
├── tsconfig.json                # TypeScript config
├── package.json
└── .env.local                   # Environment variables
```

---

## 🎨 UI/UX Guidelines

### Color Palette
```css
/* Primary */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;  /* Main brand color */
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-800: #1e40af;
--primary-900: #1e3a8a;

/* Status Colors */
--success: #22c55e;      /* Green - Success/Paid */
--warning: #f59e0b;      /* Orange - Pending/Warning */
--danger: #ef4444;       /* Red - Failed/Error */
--info: #3b82f6;         /* Blue - Info */

/* Neutral */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

### Typography
```css
/* Font: Inter (Google Fonts) */
font-family: 'Inter', sans-serif;

/* Headings */
h1: 2.25rem (36px) - font-bold
h2: 1.875rem (30px) - font-bold
h3: 1.5rem (24px) - font-semibold
h4: 1.25rem (20px) - font-semibold

/* Body */
body: 1rem (16px) - font-normal
small: 0.875rem (14px) - font-normal
```

### Key Design Principles
1. **Mobile-first**: Design for mobile, scale up to desktop
2. **Role-based navigation**: Sidebar menu sesuai role user
3. **Status visibility**: Status payment/room selalu jelas dengan color coding
4. **Action-oriented**: Setiap page punya CTA yang jelas
5. **Consistent spacing**: 4px grid system (4, 8, 12, 16, 24, 32, 48, 64)

---

## 🔐 Security Considerations

### Authentication
- ✅ Supabase Auth dengan email/password
- ✅ JWT tokens dengan expiry
- ✅ Refresh token rotation
- ✅ Password reset via email

### Authorization
- ✅ RBAC middleware pada setiap API route
- ✅ Row Level Security (RLS) di Supabase
- ✅ Resource ownership verification
- ✅ Role-based UI components

### Data Protection
- ✅ Input sanitization (Zod validation)
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection (React built-in)
- ✅ CSRF protection (NextAuth.js)
- ✅ File upload validation (type & size)

### Payment Security
- ✅ Midtrans server-side integration only
- ✅ Webhook signature verification
- ✅ No sensitive data in client-side code
- ✅ HTTPS only (production)

---

## 📧 Email Templates

### 1. Welcome Email (Tenant)
**Subject:** Selamat Datang di KostKu - [Nama Kost]

```
Halo [Nama],

Selamat! Anda telah terdaftar sebagai penghuni di:
🏠 [Nama Kost]
🚪 Kamar: [Nomor Kamar]
📅 Masa sewa: [Tanggal Mulai] - [Tanggal Selesai]

Detail login Anda:
📧 Email: [email]
🔑 Password: [password sementara]

Silakan login di [URL] dan ganti password Anda.

Tagihan pertama Anda:
💰 Rp [Jumlah] - Jatuh tempo: [Tanggal]

Terima kasih,
Tim KostKu
```

### 2. Payment Reminder
**Subject:** Pengingat Pembayaran Kost - Jatuh Tempo [Tanggal]

```
Halo [Nama],

Ini pengingat pembayaran kost Anda:

📋 Tagihan: [Periode]
💰 Total: Rp [Jumlah]
📅 Jatuh tempo: [Tanggal]
🏠 [Nama Kost] - Kamar [Nomor]

Bayar sekarang: [Link Pembayaran]

Jika sudah bayar, abaikan email ini.

Terima kasih,
[Pengelola Kost]
```

### 3. Payment Receipt
**Subject:** Kwitansi Pembayaran Kost - [Tanggal]

```
Halo [Nama],

Pembayaran Anda telah diterima:

✅ Status: LUNAS
📋 Periode: [Periode]
💰 Jumlah: Rp [Jumlah]
📅 Tanggal bayar: [Tanggal]
🆙 ID Transaksi: [ID]

Download kwitansi: [Link PDF]

Terima kasih,
[Pengelola Kost]
```

### 4. Maintenance Update
**Subject:** Update Maintenance Request - [Status]

```
Halo [Nama],

Maintenance request Anda telah diupdate:

🔧 Judul: [Judul]
📊 Status: [Status]
📝 Update: [Keterangan]

[Details tambahan jika ada]

Terima kasih,
Tim Maintenance KostKu
```

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All environment variables set in Vercel
- [ ] Database migrations applied to Supabase
- [ ] Supabase Storage buckets created
- [ ] Midtrans sandbox → production (when ready)
- [ ] Resend API key configured
- [ ] Domain configured (when ready)
- [ ] SSL certificate active
- [ ] Analytics tools setup (optional: Google Analytics)

### Testing
- [ ] Authentication flow (all roles)
- [ ] Payment flow (Midtrans sandbox)
- [ ] File upload functionality
- [ ] Email notifications
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Load testing (optional)

### Post-Deployment
- [ ] Monitoring setup (Vercel Analytics)
- [ ] Error tracking (Sentry - optional)
- [ ] Backup strategy
- [ ] Documentation updated
- [ ] User guide published

---

## 📈 Post-MVP Roadmap

### Phase 2 (Month 2-3)
- [ ] WhatsApp API integration
- [ ] Advanced reporting (PDF export)
- [ ] Expense tracking module
- [ ] Multi-currency support
- [ ] Dark mode

### Phase 3 (Month 3-6)
- [ ] Mobile app (React Native)
- [ ] Public listing (penghuni bisa cari kost)
- [ ] Booking system
- [ ] Review & rating system
- [ ] AI-powered analytics

### Phase 4 (Month 6-12)
- [ ] IoT integration (smart lock, smart meter)
- [ ] White-label solution
- [ ] Franchise management
- [ ] API for third-party integration
- [ ] International expansion

---

## 📞 Support & Resources

### Internal Documentation
- API Documentation: `/docs/api`
- Component Library: `/docs/components`
- Database Schema: `/docs/database`
- User Guide: `/docs/user-guide`

### External Resources
- **Next.js 14 Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Midtrans Docs**: https://docs.midtrans.com
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com

---

## 🤝 Team & Credits

**Project:** KostKu  
**Type:** Web Application  
**Target Market:** Indonesia  
**MVP Timeline:** 4 Weeks  

**Core Features:**
- Multi-role management (Owner, Admin, Tenant)
- Online payment (Midtrans integration)
- Manual transfer with proof upload
- Multi-language support (ID/EN)
- Responsive design
- Freemium model

---

**Last Updated:** April 2026  
**Status:** Ready for Development 🚀
