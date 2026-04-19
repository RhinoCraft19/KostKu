# Issue: Reorganisasi Layout System - Modular & Reusable

**Priority:** High  
**Estimated Time:** 3-4 jam  
**Status:** To Do  
**Labels:** `frontend`, `refactor`, `layout`, `architecture`

---

## 📋 Overview

Reorganisasi layout system KostKu dari pendekatan Next.js Route Groups `(auth)`, `(dashboard)` menjadi **komponen layout terpisah** di folder `components/layouts/`. Tujuannya agar layout lebih modular, reusable, dan mudah dipakai oleh developer junior atau AI model untuk membuat halaman baru.

**Masalah Saat Ini:**
- Layout tersebar di folder route groups `(auth)/layout.tsx`, `(dashboard)/layout.tsx`
- Sulit di-reuse karena terikat ke folder structure Next.js
- Tidak fleksibel — layout hanya bisa dipakai oleh route di dalam folder yang sama
- Junior programmer perlu pahami Next.js routing convention dulu sebelum bisa bikin layout baru

**Solusi:**
- Pindahkan semua layout ke `components/layouts/` sebagai komponen React terpisah
- Setiap layout punya props yang jelas dan mudah dipahami
- Layout bisa dipakai di halaman mana saja dengan import sederhana
- Navigation items bisa di-customize per role melalui props

---

## 🗂️ Struktur Folder Baru

```
app/
├── page.tsx                          # Redirect ke /id (default locale)
├── layout.tsx                        # Root layout (html, body, font)
├── not-found.tsx
├── manifest.ts
├── robots.ts
├── sitemap.ts
├── globals.css
│
└── [locale]/
    ├── layout.tsx                    # Locale layout (NextIntlClientProvider + Providers)
    ├── loading.tsx                   # Global loading spinner
    ├── error.tsx                     # Global error boundary
    ├── page.tsx                      # Landing page → pakai LayoutLanding
    │
    ├── (auth)/
    │   ├── login/page.tsx            # → pakai LayoutAuth
    │   ├── register/page.tsx         # → pakai LayoutAuth
    │   ├── forgot-password/page.tsx  # → pakai LayoutAuth
    │   └── reset-password/page.tsx   # → pakai LayoutAuth
    │
    ├── owner/
    │   ├── dashboard/page.tsx        # → pakai LayoutOwner
    │   ├── kosts/page.tsx            # → pakai LayoutOwner
    │   ├── tenants/page.tsx          # → pakai LayoutOwner
    │   ├── payments/page.tsx         # → pakai LayoutOwner
    │   ├── reports/page.tsx          # → pakai LayoutOwner
    │   └── settings/page.tsx          # → pakai LayoutOwner
    │
    ├── admin/
    │   ├── dashboard/page.tsx        # → pakai LayoutAdmin
    │   ├── tenants/page.tsx          # → pakai LayoutAdmin
    │   ├── payments/page.tsx         # → pakai LayoutAdmin
    │   ├── maintenance/page.tsx      # → pakai LayoutAdmin
    │   └── announcements/page.tsx    # → pakai LayoutAdmin
    │
    └── tenant/
        ├── dashboard/page.tsx        # → pakai LayoutTenant
        ├── payments/page.tsx         # → pakai LayoutTenant
        ├── history/page.tsx          # → pakai LayoutTenant
        └── maintenance/page.tsx      # → pakai LayoutTenant

components/
├── layouts/                          # 🔥 FOLDER LAYOUTS (BARU)
│   ├── layout-auth.tsx               # Layout untuk halaman auth (login, register, dll)
│   ├── layout-dashboard.tsx          # Base layout dashboard (sidebar + header + content)
│   ├── layout-landing.tsx            # Layout untuk landing page (header + hero + footer)
│   ├── layout-owner.tsx              # Layout khusus owner (extend LayoutDashboard)
│   ├── layout-admin.tsx              # Layout khusus admin (extend LayoutDashboard)
│   ├── layout-tenant.tsx             # Layout khusus tenant (extend LayoutDashboard)
│   └── index.ts                      # Export semua layouts
│
├── ui/                               # shadcn components (sudah ada)
├── shared/                           # Shared components (sudah ada)
└── providers/                        # Providers (sudah ada)
```

---

## 🎯 Cara Pakai Layout Baru

### Sebelum (Route Groups — Sulit):
```tsx
// Harus buat layout.tsx di setiap route group
// File: app/[locale]/(auth)/layout.tsx
// File: app/[locale]/(dashboard)/layout.tsx
// Tidak bisa reuse layout di tempat lain
```

### Sesudah (Komponen Layout — Mudah):
```tsx
// Import layout dan wrap children — selesai!
import { LayoutAuth } from "@/components/layouts";
import { LayoutOwner } from "@/components/layouts";
import { LayoutTenant } from "@/components/layouts";

// Di halaman login
export default function LoginPage() {
  return (
    <LayoutAuth title="Masuk" description="Masuk ke akun KostKu Anda">
      <LoginForm />
    </LayoutAuth>
  );
}

// Di halaman dashboard owner
export default function OwnerDashboardPage() {
  return (
    <LayoutOwner userName="John" userEmail="john@example.com">
      <DashboardContent />
    </LayoutOwner>
  );
}
```

---

## 📁 Detail Implementasi Setiap Layout

### 1. `components/layouts/layout-auth.tsx`

**Deskripsi:** Layout sederhana center-aligned untuk halaman auth. Full screen dengan card di tengah.

**Props:**
| Prop | Type | Default | Deskripsi |
|------|------|---------|-----------|
| `children` | `ReactNode` | — | Konten form (required) |
| `title` | `string` | — | Judul halaman (contoh: "Masuk", "Daftar") |
| `description` | `string` | `"KostKu"` | Deskripsi di bawah judul |
| `showLogo` | `boolean` | `true` | Tampilkan logo KostKu di atas |
| `footer` | `ReactNode` | `undefined` | Footer di bawah card (contoh: link "Belum punya akun?") |

**Struktur:**
```
┌──────────────────────────────────┐
│                                  │
│          [Logo KostKu]          │  ← showLogo=true
│                                  │
│        ┌──────────────┐          │
│        │   Card Title  │          │  ← title prop
│        │  Description  │          │  ← description prop
│        │               │          │
│        │   {children}  │          │  ← form content
│        │               │          │
│        └──────────────┘          │
│                                  │
│          {footer}                │  ← footer prop
│                                  │
└──────────────────────────────────┘
```

**Kode:**
```tsx
"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LayoutAuthProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showLogo?: boolean;
  footer?: ReactNode;
}

export function LayoutAuth({
  children,
  title,
  description = "KostKu",
  showLogo = true,
  footer,
}: LayoutAuthProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {showLogo && (
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary">KostKu</h1>
            <p className="text-muted-foreground">Manajemen Kost Terbaik</p>
          </div>
        )}

        <Card>
          {title && (
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          )}
          <CardContent>{children}</CardContent>
        </Card>

        {footer && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### 2. `components/layouts/layout-dashboard.tsx`

**Deskripsi:** Base layout dashboard dengan sidebar, header, dan main content area. Ini adalah layout utama yang di-extend oleh LayoutOwner, LayoutAdmin, dan LayoutTenant.

**Props:**
| Prop | Type | Default | Deskripsi |
|------|------|---------|-----------|
| `children` | `ReactNode` | — | Konten halaman (required) |
| `navItems` | `NavItem[]` | — | Daftar navigasi sidebar (required) |
| `userRole` | `"owner" \| "admin" \| "tenant"` | — | Role user untuk badge (required) |
| `userName` | `string` | `"User"` | Nama user untuk avatar |
| `userEmail` | `string` | `""` | Email user untuk dropdown |

**Tipe `NavItem`:**
```ts
interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;   // key i18n, contoh: "navigation.dashboard"
  href: string;    // route path, contoh: "/owner/dashboard"
}
```

**Struktur:**
```
┌──────────┬─────────────────────────────────┐
│          │  [☰ Mobile]  🔔 [Avatar ▼]    │ ← Header
│  [Logo]  ├─────────────────────────────────┤
│  KostKu  │                                 │
│  [owner] │                                 │
│          │                                 │
│  Nav 1   │         {children}             │ ← Main Content
│  Nav 2   │                                 │
│  Nav 3   │                                 │
│  Nav 4   │                                 │
│  Nav 5   │                                 │
│          │                                 │
│ [Locale] │                                 │ ← Locale Switcher
└──────────┴─────────────────────────────────┘
     ↑ Sidebar (desktop only, mobile = Sheet)
```

**Kode:** Lihat file lengkap di bagian implementasi (Phase 2B di bawah). Komponen ini menggunakan `useTranslations()` dari next-intl dan `Link` dari `@/i18n/navigation`.

---

### 3. `components/layouts/layout-owner.tsx`

**Deskripsi:** Layout khusus role Owner. Meng-extend LayoutDashboard dengan navigation items default untuk owner.

**Props:**
| Prop | Type | Default | Deskripsi |
|------|------|---------|-----------|
| `children` | `ReactNode` | — | Konten halaman (required) |
| `userName` | `string` | `"User"` | Nama user |
| `userEmail` | `string` | `""` | Email user |

**Navigation Items Default (Owner):**
| Icon | Label Key | Route |
|------|-----------|-------|
| 🏠 | `navigation.dashboard` | `/owner/dashboard` |
| 🏢 | `navigation.kosts` | `/owner/kosts` |
| 👥 | `navigation.tenants` | `/owner/tenants` |
| 💳 | `navigation.payments` | `/owner/payments` |
| 📊 | `navigation.reports` | `/owner/reports` |
| ⚙️ | `navigation.settings` | `/owner/settings` |

**Kode:**
```tsx
import { LayoutDashboard } from "./layout-dashboard";
import { Home, Building, Users, CreditCard, BarChart3, Settings } from "lucide-react";

const ownerNavItems = [
  { icon: Home, label: "navigation.dashboard", href: "/owner/dashboard" },
  { icon: Building, label: "navigation.kosts", href: "/owner/kosts" },
  { icon: Users, label: "navigation.tenants", href: "/owner/tenants" },
  { icon: CreditCard, label: "navigation.payments", href: "/owner/payments" },
  { icon: BarChart3, label: "navigation.reports", href: "/owner/reports" },
  { icon: Settings, label: "navigation.settings", href: "/owner/settings" },
];

interface LayoutOwnerProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
}

export function LayoutOwner({ children, userName, userEmail }: LayoutOwnerProps) {
  return (
    <LayoutDashboard
      navItems={ownerNavItems}
      userRole="owner"
      userName={userName}
      userEmail={userEmail}
    >
      {children}
    </LayoutDashboard>
  );
}
```

---

### 4. `components/layouts/layout-admin.tsx`

**Deskripsi:** Layout khusus role Admin. Sama seperti LayoutOwner tapi dengan navigation items yang berbeda.

**Navigation Items Default (Admin):**
| Icon | Label Key | Route |
|------|-----------|-------|
| 🏠 | `navigation.dashboard` | `/admin/dashboard` |
| 👥 | `navigation.tenants` | `/admin/tenants` |
| 💳 | `navigation.payments` | `/admin/payments` |
| 🔧 | `navigation.maintenance` | `/admin/maintenance` |
| 📢 | `navigation.announcements` | `/admin/announcements` |

**Kode:** Struktur sama dengan `layout-owner.tsx`, hanya berbeda `navItems` dan `userRole="admin"`.

---

### 5. `components/layouts/layout-tenant.tsx`

**Deskripsi:** Layout khusus role Tenant. Sidebar lebih sederhana karena tenant punya akses lebih sedikit.

**Navigation Items Default (Tenant):**
| Icon | Label Key | Route |
|------|-----------|-------|
| 🏠 | `navigation.dashboard` | `/tenant/dashboard` |
| 💳 | `navigation.payments` | `/tenant/payments` |
| 📋 | `navigation.history` | `/tenant/history` |
| 🔧 | `navigation.maintenance` | `/tenant/maintenance` |

**Kode:** Struktur sama dengan `layout-owner.tsx`, hanya berbeda `navItems` dan `userRole="tenant"`.

---

### 6. `components/layouts/layout-landing.tsx`

**Deskripsi:** Layout untuk landing page/public page. Memiliki header dengan logo, locale switcher, dan auth buttons, lalu footer.

**Props:**
| Prop | Type | Default | Deskripsi |
|------|------|---------|-----------|
| `children` | `ReactNode` | — | Konten halaman (required) |
| `showAuthButtons` | `boolean` | `true` | Tampilkan tombol Login/Register di header |

**Struktur:**
```
┌──────────────────────────────────────────┐
│  [🏠 KostKu]      [🌐 ID/EN] [Login] [Daftar] │ ← Header (sticky)
├──────────────────────────────────────────┤
│                                          │
│              {children}                  │ ← Main Content
│                                          │
├──────────────────────────────────────────┤
│  [🏠 KostKu]           © 2026 KostKu   │ ← Footer
└──────────────────────────────────────────┘
```

**Kode:**
```tsx
"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import { Home } from "lucide-react";

interface LayoutLandingProps {
  children: ReactNode;
  showAuthButtons?: boolean;
}

export function LayoutLanding({ children, showAuthButtons = true }: LayoutLandingProps) {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">KostKu</span>
          </div>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            {showAuthButtons && (
              <>
                <Link href="/login">
                  <Button variant="ghost">{t("auth.login")}</Button>
                </Link>
                <Link href="/register">
                  <Button>{t("landing.getStarted")}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-8">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            <span className="font-semibold">KostKu</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2026 KostKu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
```

---

### 7. `components/layouts/index.ts`

**Central export file:**
```ts
export { LayoutAuth } from "./layout-auth";
export { LayoutDashboard } from "./layout-dashboard";
export { LayoutLanding } from "./layout-landing";
export { LayoutOwner } from "./layout-owner";
export { LayoutAdmin } from "./layout-admin";
export { LayoutTenant } from "./layout-tenant";

// Export types juga
export type { NavItem } from "./layout-dashboard";
```

---

## 📝 Tahapan Implementasi

### Phase 1: Buat Folder dan File Layout (30 menit)

**Langkah-langkah:**

1. Buat folder `components/layouts/`
   ```bash
   mkdir -p components/layouts
   ```

2. Buat file `components/layouts/layout-auth.tsx` — copy kode dari bagian Detail Implementasi di atas

3. Buat file `components/layouts/layout-dashboard.tsx` — copy kode dari Detail Implementasi. Ini yang paling penting karena jadi base untuk Owner, Admin, Tenant

4. Buat file `components/layouts/layout-owner.tsx` — extend LayoutDashboard dengan ownerNavItems

5. Buat file `components/layouts/layout-admin.tsx` — extend LayoutDashboard dengan adminNavItems

6. Buat file `components/layouts/layout-tenant.tsx` — extend LayoutDashboard dengan tenantNavItems

7. Buat file `components/layouts/layout-landing.tsx` — layout untuk landing page

8. Buat file `components/layouts/index.ts` — export semua layouts

**Checklist Phase 1:**
- [ ] Folder `components/layouts/` sudah dibuat
- [ ] `layout-auth.tsx` sudah dibuat dan bisa di-compile
- [ ] `layout-dashboard.tsx` sudah dibuat dan bisa di-compile
- [ ] `layout-owner.tsx` sudah dibuat dan bisa di-compile
- [ ] `layout-admin.tsx` sudah dibuat dan bisa di-compile
- [ ] `layout-tenant.tsx` sudah dibuat dan bisa di-compile
- [ ] `layout-landing.tsx` sudah dibuat dan bisa di-compile
- [ ] `index.ts` sudah dibuat dengan semua export

---

### Phase 2: Update Halaman yang Sudah Ada (30 menit)

**Langkah-langkah:**

1. **Update `app/[locale]/page.tsx` (Landing Page)**
   
   **Sebelum:**
   ```tsx
   // Landing page punya layout sendiri di dalam file
   export default function LandingPage() {
     return (
       <div className="min-h-screen">
         {/* Header, Hero, Features, Footer — semua inline */}
       </div>
     );
   }
   ```
   
   **Sesudah:**
   ```tsx
   import { LayoutLanding } from "@/components/layouts";
   
   export default function LandingPage() {
     return (
       <LayoutLanding>
         {/* Hero section */}
         {/* Features section */}
       </LayoutLanding>
     );
   }
   ```

2. **Update `app/[locale]/(auth)/login/page.tsx`**
   
   **Sebelum:**
   ```tsx
   // Login page punya Card dan form inline
   export default function LoginPage() {
     return (
       <div className="flex min-h-screen items-center justify-center">
         <Card>...</Card>
       </div>
     );
   }
   ```
   
   **Sesudah:**
   ```tsx
   import { LayoutAuth } from "@/components/layouts";
   import { useTranslations } from "next-intl";
   import { Link } from "@/i18n/navigation";
   import { Input } from "@/components/ui/input";
   import { Label } from "@/components/ui/label";
   import { Button } from "@/components/ui/button";

   export default function LoginPage() {
     const t = useTranslations();

     return (
       <LayoutAuth
         title={t("auth.login")}
         description="KostKu"
         footer={
           <>
             {t("auth.noAccount")}{" "}
             <Link href="/register" className="text-primary hover:underline">
               {t("auth.register")}
             </Link>
           </>
         }
       >
         <form className="space-y-4">
           <div className="space-y-2">
             <Label htmlFor="email">{t("auth.email")}</Label>
             <Input id="email" type="email" placeholder="name@example.com" />
           </div>
           <div className="space-y-2">
             <Label htmlFor="password">{t("auth.password")}</Label>
             <Input id="password" type="password" placeholder="••••••••" />
           </div>
           <Button className="w-full" type="submit">{t("auth.login")}</Button>
         </form>
       </LayoutAuth>
     );
   }
   ```

3. **Update `app/[locale]/(auth)/register/page.tsx`** — sama seperti login, wrap dengan `LayoutAuth`

4. **Update `app/[locale]/(dashboard)/page.tsx`** — ganti layout inline dengan `LayoutOwner`

5. **Hapus file `app/[locale]/(dashboard)/layout.tsx`** yang lama (layout sudah dipindah ke komponen)

**⚠️ PENTING:** Jangan hapus `app/[locale]/(auth)/layout.tsx` dulu. Ganti isinya jadi passthrough yang hanya render `{children}`:

```tsx
// app/[locale]/(auth)/layout.tsx — jadi passthrough
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <>{children}</>;
}
```

> **Kenapa masih perlu layout.tsx?** Karena Next.js App Router memerlukan layout.tsx di setiap route segment untuk provider dan locale validation. Tapi layout-nya sekarang HANYA passthrough — semua layout visual ada di komponen `components/layouts/`.

**Checklist Phase 2:**
- [ ] Landing page sudah pakai `LayoutLanding`
- [ ] Login page sudah pakai `LayoutAuth`
- [ ] Register page sudah pakai `LayoutAuth`
- [ ] Dashboard page sudah pakai `LayoutOwner`
- [ ] `(auth)/layout.tsx` diubah jadi passthrough
- [ ] `(dashboard)/layout.tsx` dihapus atau diubah jadi passthrough

---

### Phase 3: Update i18n Messages (15 menit)

Tambahkan key navigasi baru yang dibutuhkan oleh layout components:

**Update `i18n/messages/id.json`:**
```json
{
  "navigation": {
    "dashboard": "Dashboard",
    "kosts": "Kost",
    "rooms": "Kamar",
    "tenants": "Penghuni",
    "payments": "Pembayaran",
    "reports": "Laporan",
    "settings": "Pengaturan",
    "logout": "Keluar",
    "maintenance": "Perbaikan",
    "announcements": "Pengumuman",
    "history": "Riwayat"
  }
}
```

**Update `i18n/messages/en.json`:**
```json
{
  "navigation": {
    "dashboard": "Dashboard",
    "kosts": "Kost",
    "rooms": "Rooms",
    "tenants": "Tenants",
    "payments": "Payments",
    "reports": "Reports",
    "settings": "Settings",
    "logout": "Logout",
    "maintenance": "Maintenance",
    "announcements": "Announcements",
    "history": "History"
  }
}
```

**Checklist Phase 3:**
- [ ] `id.json` sudah ditambah key `maintenance`, `announcements`, `history`
- [ ] `en.json` sudah ditambah key `maintenance`, `announcements`, `history`

---

### Phase 4: Buat Halaman Placeholder Baru (30 menit)

Sekarang dengan layout components, buat halaman placeholder baru:

1. **`app/[locale]/(auth)/forgot-password/page.tsx`**
   ```tsx
   import { LayoutAuth } from "@/components/layouts";
   import { useTranslations } from "next-intl";
   import { Link } from "@/i18n/navigation";
   import { Input } from "@/components/ui/input";
   import { Label } from "@/components/ui/label";
   import { Button } from "@/components/ui/button";

   export default function ForgotPasswordPage() {
     const t = useTranslations();
     return (
       <LayoutAuth
         title="Lupa Password"
         description="Masukkan email untuk reset password"
         footer={
           <Link href="/login" className="text-primary hover:underline">
             Kembali ke halaman login
           </Link>
         }
       >
         <form className="space-y-4">
           <div className="space-y-2">
             <Label htmlFor="email">{t("auth.email")}</Label>
             <Input id="email" type="email" placeholder="name@example.com" />
           </div>
           <Button className="w-full" type="submit">Kirim Link Reset</Button>
         </form>
       </LayoutAuth>
     );
   }
   ```

2. **`app/[locale]/(auth)/reset-password/page.tsx`** — serupa dengan forgot-password

3. **Buat folder routes untuk Owner:**
   - `app/[locale]/owner/dashboard/page.tsx` → pakai `LayoutOwner`
   - `app/[locale]/owner/kosts/page.tsx` → pakai `LayoutOwner`
   - `app/[locale]/owner/tenants/page.tsx` → pakai `LayoutOwner`
   - dll.

4. **Buat folder routes untuk Admin:**
   - `app/[locale]/admin/dashboard/page.tsx` → pakai `LayoutAdmin`
   - `app/[locale]/admin/tenants/page.tsx` → pakai `LayoutAdmin`
   - dll.

5. **Buat folder routes untuk Tenant:**
   - `app/[locale]/tenant/dashboard/page.tsx` → pakai `LayoutTenant`
   - `app/[locale]/tenant/payments/page.tsx` → pakai `LayoutTenant`
   - dll.

**Contoh Owner Dashboard Page:**
```tsx
// app/[locale]/owner/dashboard/page.tsx
import { LayoutOwner } from "@/components/layouts";
import { useTranslations } from "next-intl";

export default function OwnerDashboardPage() {
  const t = useTranslations();

  return (
    <LayoutOwner userName="John Doe" userEmail="john@example.com">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("navigation.dashboard")}
        </h1>
        <p className="text-muted-foreground">Welcome to KostKu</p>
        {/* Dashboard content_placeholder */}
      </div>
    </LayoutOwner>
  );
}
```

**Checklist Phase 4:**
- [ ] `forgot-password/page.tsx` sudah dibuat
- [ ] `reset-password/page.tsx` sudah dibuat
- [ ] Owner routes sudah dibuat (dashboard, kosts, tenants, payments, reports, settings)
- [ ] Admin routes sudah dibuat (dashboard, tenants, payments, maintenance, announcements)
- [ ] Tenant routes sudah dibuat (dashboard, payments, history, maintenance)

---

### Phase 5: Testing & Verifikasi (15 menit)

1. **Build test:** Jalankan `npm run build` dan pastikan tidak ada error
2. **Dev test:** Jalankan `npm run dev` dan cek semua halaman
3. **Cek halaman berikut:**
   - `/id` — Landing page dengan LayoutLanding
   - `/id/login` — Login dengan LayoutAuth
   - `/id/register` — Register dengan LayoutAuth
   - `/id/forgot-password` — Forgot password dengan LayoutAuth
   - `/id/owner/dashboard` — Owner dashboard dengan LayoutOwner
   - `/id/admin/dashboard` — Admin dashboard dengan LayoutAdmin
   - `/id/tenant/dashboard` — Tenant dashboard dengan LayoutTenant
4. **Cek responsive:** Sidebar harus collapse ke Sheet di mobile
5. **Cek locale switcher:** Dropdown ID/EN harus berfungsi di semua layout

**Checklist Phase 5:**
- [ ] `npm run build` berhasil tanpa error
- [ ] `npm run dev` berjalan tanpa error
- [ ] Landing page accessible dan LayoutLanding berfungsi
- [ ] Login page accessible dan LayoutAuth berfungsi
- [ ] Owner dashboard accessible dan LayoutOwner berfungsi (sidebar visible)
- [ ] Admin dashboard accessible dan LayoutAdmin berfungsi
- [ ] Tenant dashboard accessible dan LayoutTenant berfungsi
- [ ] Mobile responsive — sidebar collapse ke Sheet
- [ ] Locale switcher berfungsi di semua layout
- [ ] Tidak ada TypeScript errors

---

## ✅ Acceptance Criteria

Task dianggap complete jika:

- [ ] Folder `components/layouts/` sudah dibuat dengan 6 file layout + 1 index.ts
- [ ] Setiap layout component bisa di-import dari `@/components/layouts`
- [ ] `LayoutAuth` bisa dipakai di login, register, forgot-password, reset-password
- [ ] `LayoutDashboard` punya props `navItems`, `userRole`, `userName`, `userEmail`
- [ ] `LayoutOwner` extend `LayoutDashboard` dengan owner nav items
- [ ] `LayoutAdmin` extend `LayoutDashboard` dengan admin nav items
- [ ] `LayoutTenant` extend `LayoutDashboard` dengan tenant nav items
- [ ] `LayoutLanding` punya sticky header + footer + locale switcher
- [ ] Semua halaman yang ada sudah menggunakan layout components baru
- [ ] Old layout files (route groups) sudah di-cleanup
- [ ] `npm run build` berhasil tanpa error
- [ ] `npm run dev` berjalan tanpa error
- [ ] Responsive design berfungsi (mobile sidebar → Sheet)
- [ ] Locale switcher berfungsi di semua layout

---

## 📊 Perbandingan Sebelum vs Sesudah

| Aspek | Sebelum (Route Groups) | Sesudah (Layout Components) |
|-------|------------------------|----------------------------|
| **Reusability** | Layout terikat ke folder route | Layout reusable di mana saja |
| **Flexibility** | Susah di-override | Mudah customize via props |
| **Maintenance** | Layout tersebar di folder | Semua layout di `components/layouts/` |
| **Junior Friendly** | Perlu pahami Next.js routing | Cuma import component + wrap children |
| **Testing** | Susah test layout terpisah | Layout bisa di-test individual |
| **New Page** | Perlu pahami folder structure | Import layout, wrap children, selesai |
| **Props** | Tidak bisa pass props ke layout | Bisa pass title, footer, userName, dll |

---

## 📚 References

- **Next.js 16 Layouts**: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts
- **React Component Patterns**: https://react.dev/learn/passing-props-to-a-component
- **shadcn/ui Components**: https://ui.shadcn.com/docs
- **next-intl Navigation**: https://next-intl-docs.vercel.app/docs/navigation
- **Lucide Icons**: https://lucide.dev/icons

---

## ⚠️ Catatan Penting untuk Implementor

1. **Jangan hapus file lama sebelum file baru berfungsi** — buat file layout baru dulu, test, baru update page yang pakai layout lama
2. **`LayoutDashboard` adalah BASE layout** — Owner, Admin, Tenant hanya extend ini dengan nav items yang berbeda
3. **Pastikan `useTranslations()` dipanggil di client component** — semua layout menggunakan `"use client"` directive
4. **Gunakan `Link` dari `@/i18n/navigation`** bukan dari `next/link` supaya locale routing tetap berfungsi
5. **Sidebar mobile menggunakan `Sheet`** dari shadcn/ui — di shadcn v4, `SheetTrigger` TIDAK punya prop `asChild`, langsung wrap Button sebagai children
6. **Setiap page harus wrap kontennya dengan layout component** — jangan taruh layout di `layout.tsx` route group, taruh di `page.tsx` langsung
7. **Jalankan `npm run build` setiap selesai phase** untuk memastikan tidak ada error