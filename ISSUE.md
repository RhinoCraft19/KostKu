# Issue: Setup Next.js 16 Frontend Project

## 📋 Overview
Setup project frontend KostKu menggunakan **Next.js 16** dengan App Router, TypeScript, dan semua dependency **latest version** (Updated via Context7 - April 2026).

**Priority:** High  
**Estimated Time:** 1-2 hari  
**Status:** To Do

---

## 🎯 Goals
- [ ] Initialize Next.js 16 project dengan TypeScript
- [ ] Setup TailwindCSS 4 dan shadcn/ui components v4 (latest)
- [ ] Konfigurasi struktur folder sesuai best practice
- [ ] Install semua dependency **latest version**
- [ ] Setup environment variables template
- [ ] Konfigurasi i18n (next-intl v3) untuk ID/EN
- [ ] Setup basic layout dan halaman awal

---

## 📁 Deliverables

### 1. Project Initialization
```bash
# Inisialisasi project dengan shadcn template (Next.js 16 + Tailwind 4)
npx shadcn@latest init --yes --template next --base-color slate

# Atau manual installation dengan versi terbaru:
npm install next@latest react@latest react-dom@latest
```

**Checklist:**
- [ ] Project name: `kostku`
- [ ] **Next.js 16.x** (latest - April 2026)
- [ ] **React 19.x** (latest)
- [ ] **TypeScript 5.8+** (enabled)
- [ ] **Tailwind CSS 4.x** (enabled)
- [ ] **ESLint 9.x** (enabled)
- [ ] App Router: enabled
- [ ] Turbopack: enabled (dev mode - default di Next.js 16)
- [ ] src directory: disabled (gunakan root)
- [ ] Import alias: `@/*`

### 2. Install shadcn/ui Components (Latest)
Install components yang dibutuhkan untuk MVP:

```bash
npx shadcn@latest add \
  button \
  card \
  input \
  label \
  select \
  table \
  dialog \
  dropdown-menu \
  avatar \
  badge \
  toast \
  sonner \
  sheet \
  tabs \
  textarea \
  calendar \
  popover \
  command \
  checkbox \
  radio-group \
  separator \
  skeleton \
  progress \
  alert \
  alert-dialog
```

**Checklist:**
- [ ] Button, Card, Input, Label (basic UI)
- [ ] Table, Dialog, Dropdown (data display)
- [ ] Toast/Sonner (notifications)
- [ ] Calendar, Date Picker (booking/payment dates)
- [ ] Form components (checkbox, radio, select)
- [ ] Loading states (skeleton, progress)
- [ ] Feedback (alert, alert-dialog)

### 3. Install Core Dependencies (Latest Versions via Context7)

```bash
# State Management (Zustand v5.0+ - latest)
npm install zustand@latest

# Data Fetching (TanStack Query v5.66+ - latest)
npm install @tanstack/react-query@latest @tanstack/react-query-devtools@latest

# Forms & Validation (React Hook Form v7.54+ + Zod v3.24+)
npm install react-hook-form@latest @hookform/resolvers@latest zod@latest

# Internationalization (next-intl v4 - support Next.js 16)
npm install next-intl@latest

# Icons (Lucide React v0.475+)
npm install lucide-react@latest

# Date Handling (date-fns v4)
npm install date-fns@latest

# Classname Utilities (latest)
npm install clsx@latest tailwind-merge@latest

# Dashboard Charts (Recharts v2.15+)
npm install recharts@latest

# Additional utilities
npm install server-only@latest
```

**Checklist:**
- [ ] Zustand v5.0+ (latest stable)
- [ ] TanStack Query v5.66+ (server state)
- [ ] React Hook Form v7.54+ + Zod v3.24+ (forms)
- [ ] next-intl v4 (support Next.js 16)
- [ ] lucide-react v0.475+ (icons)
- [ ] date-fns v4 (date formatting)
- [ ] clsx v2.1+ + tailwind-merge v3.0+ (utilities)
- [ ] recharts v2.15+ (charts)

### 4. Install Dev Dependencies (Latest)

```bash
# Type definitions (TypeScript 5.8+)
npm install -D typescript@latest @types/node@22 @types/react@latest @types/react-dom@latest

# Utilities
npm install -D prettier@3.5 prettier-plugin-tailwindcss@latest

# ESLint config (Next.js 16 + ESLint 9)
npm install -D eslint@9 eslint-config-next@latest
```

**Checklist:**
- [ ] TypeScript 5.8+ + type definitions
- [ ] Prettier v3.5 + Tailwind v4 plugin
- [ ] ESLint 9.x + Next.js 16 config

### 5. Project Structure Setup

Buat folder structure berikut:

```
app/
├── (auth)/
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   └── reset-password/
├── (dashboard)/
│   ├── owner/
│   ├── admin/
│   └── tenant/
├── api/
├── layout.tsx
├── page.tsx
├── globals.css
└── not-found.tsx

components/
├── ui/                    # shadcn components (auto-generated)
├── layouts/               # Dashboard layouts
├── forms/                 # Form components
├── tables/                # Data tables
├── charts/                # Dashboard charts
└── shared/                # Shared utilities

lib/
├── utils.ts               # Utility functions
├── constants.ts           # App constants
└── validations/           # Zod schemas

hooks/                     # Custom React hooks
stores/                    # Zustand stores
types/                     # TypeScript types
i18n/                      # Internationalization
├── messages/
│   ├── id.json
│   └── en.json
├── config.ts
└── request.ts             # next-intl server config

public/
├── images/
├── fonts/                 # Jika pakai local fonts
└── manifest.json
```

**Checklist:**
- [ ] Create folder structure
- [ ] Add .gitkeep atau placeholder files

### 6. Configuration Files (Next.js 16 + Tailwind 4)

#### Create `next.config.ts` (TypeScript config):
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 default menggunakan Turbopack untuk dev
  turbopack: {
    // Konfigurasi Turbopack jika diperlukan
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
    ],
  },
  // Experimental features Next.js 16
  experimental: {
    // ppr: true, // Partial Prerendering (now stable in 16)
    // dynamicIO: true, // Dynamic IO (stable in 16)
  },
};

export default nextConfig;
```

#### Create `tailwind.config.ts` (Tailwind CSS 4):
```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom colors untuk KostKu brand
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
```

#### Create `.env.local` template:
```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=KostKu

# Supabase (to be filled later)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Midtrans (to be filled later)
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
MIDTRANS_SERVER_KEY=
MIDTRANS_IS_PRODUCTION=false

# Resend Email (to be filled later)
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@kostku.id

# Note: Use NEXT_PUBLIC_ only for client-side variables
```

#### Create `.prettierrc`:
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

#### Create `tsconfig.json` (Next.js 15 optimized):
Pastikan tsconfig.json sudah include:
- `"target": "ES2017"` atau lebih tinggi
- `"lib": ["dom", "dom.iterable", "esnext"]`
- `"module": "esnext"`
- `"moduleResolution": "bundler"`
- `"jsx": "preserve"`

**Checklist:**
- [ ] Create next.config.ts (Next.js 15 + TypeScript)
- [ ] Update tailwind.config.ts (brand colors)
- [ ] Create .env.local template
- [ ] Create .prettierrc
- [ ] Verify tsconfig.json (Next.js 15 compatible)

### 7. i18n Setup (next-intl v4 + Next.js 16)

#### Create `i18n/config.ts`:
```typescript
export const locales = ['id', 'en'] as const
export const defaultLocale = 'id' as const
export type Locale = (typeof locales)[number]
```

#### Create `i18n/request.ts` (next-intl v4 pattern for Next.js 16):
```typescript
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from './config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale is valid
  if (!locales.includes(locale as Locale)) notFound();
 
  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'Asia/Jakarta',
    now: new Date(),
  };
});
```

#### Create `i18n/messages/id.json`:
```json
{
  "metadata": {
    "title": "KostKu - Manajemen Kost",
    "description": "Aplikasi manajemen kost terbaik di Indonesia"
  },
  "navigation": {
    "dashboard": "Dashboard",
    "kosts": "Kost",
    "rooms": "Kamar",
    "tenants": "Penghuni",
    "payments": "Pembayaran",
    "reports": "Laporan",
    "settings": "Pengaturan",
    "logout": "Keluar"
  },
  "auth": {
    "login": "Masuk",
    "register": "Daftar",
    "email": "Email",
    "password": "Password",
    "forgotPassword": "Lupa Password?",
    "noAccount": "Belum punya akun?",
    "hasAccount": "Sudah punya akun?"
  },
  "common": {
    "save": "Simpan",
    "cancel": "Batal",
    "delete": "Hapus",
    "edit": "Edit",
    "create": "Buat",
    "search": "Cari",
    "loading": "Memuat...",
    "error": "Terjadi kesalahan",
    "success": "Berhasil",
    "confirm": "Konfirmasi"
  }
}
```

#### Create `i18n/messages/en.json`:
```json
{
  "metadata": {
    "title": "KostKu - Kost Management",
    "description": "The best boarding house management app in Indonesia"
  },
  "navigation": {
    "dashboard": "Dashboard",
    "kosts": "Kost",
    "rooms": "Rooms",
    "tenants": "Tenants",
    "payments": "Payments",
    "reports": "Reports",
    "settings": "Settings",
    "logout": "Logout"
  },
  "auth": {
    "login": "Login",
    "register": "Register",
    "email": "Email",
    "password": "Password",
    "forgotPassword": "Forgot Password?",
    "noAccount": "Don't have an account?",
    "hasAccount": "Already have an account?"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "search": "Search",
    "loading": "Loading...",
    "error": "An error occurred",
    "success": "Success",
    "confirm": "Confirm"
  }
}
```

#### Create `middleware.ts` (root level - Next.js 16 pattern):
```typescript
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n/config'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: true,
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)']
}
```

**Checklist:**
- [ ] Create i18n config
- [ ] Create request.ts (next-intl v4 pattern)
- [ ] Create ID messages
- [ ] Create EN messages
- [ ] Setup middleware.ts (Next.js 16 compatible)
- [ ] Update root layout untuk next-intl v4

### 8. Base Layout & Global Styles (Next.js 16)

#### Update `app/globals.css`:
Pastikan sudah include:
- Tailwind directives (v4 format dengan `@import "tailwindcss"`)
- CSS variables untuk theming
- Dark mode support

#### Update `app/layout.tsx` (Next.js 16 + next-intl v4):
```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "KostKu - Manajemen Kost",
  description: "Aplikasi manajemen kost terbaik di Indonesia",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  if (!locales.includes(locale as Locale)) notFound();

  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

#### Create `app/not-found.tsx`:
Global not-found page untuk handle 404.

#### Create `lib/utils.ts` (if not exists):
Pastikan sudah ada cn() utility untuk className merging.

**Checklist:**
- [ ] Verify globals.css (Tailwind v4 format)
- [ ] Update layout.tsx (Next.js 15 + next-intl v3 pattern)
- [ ] Add Inter font (Next.js 15 font optimization)
- [ ] Add not-found.tsx
- [ ] Verify lib/utils.ts

### 9. Placeholder Pages (Next.js 16 App Router)

#### Create `app/page.tsx` (Landing Page):
- Hero section placeholder
- Features overview placeholder
- CTA buttons (Login/Register)
- Simple responsive design
- Metadata export untuk SEO

#### Create `app/(auth)/login/page.tsx`:
- Login form placeholder
- Email & password fields
- Link to register
- Basic validation dengan React Hook Form + Zod
- Metadata untuk page title

#### Create `app/(auth)/register/page.tsx`:
- Registration form placeholder
- Role selection (Owner/Admin/Tenant)
- Basic fields
- Metadata untuk page title

#### Create `app/(dashboard)/layout.tsx`:
- Dashboard layout with sidebar placeholder
- Header with user menu
- Main content area
- Responsive mobile menu
- Error boundary wrapper

#### Create `app/(dashboard)/page.tsx`:
- Role-based redirect logic placeholder
- Dashboard home content
- Metadata dinamis berdasarkan role

#### Create `app/[locale]/page.tsx` (jika menggunakan i18n routing):
Root page yang handle locale routing.

**Checklist:**
- [ ] Landing page dengan metadata (Next.js 16 pattern)
- [ ] Login page dengan metadata
- [ ] Register page dengan metadata
- [ ] Dashboard layout
- [ ] Dashboard home dengan role-based content
- [ ] Error boundaries (Next.js 16 Error Boundaries)

### 10. Shared Components Setup

#### Create `components/shared/locale-switcher.tsx`:
Dropdown untuk ganti bahasa (ID/EN) dengan next-intl v3.

#### Create `components/layouts/dashboard-sidebar.tsx`:
Sidebar navigation placeholder dengan menu items.
- Responsive design
- Collapsible pada mobile
- Active state management

#### Create `components/layouts/dashboard-header.tsx`:
Header dengan logo, user menu, notifications placeholder.
- Mobile menu toggle
- User dropdown
- Notification badge placeholder

#### Create `components/providers/index.tsx`:
Combined providers component:
- TanStack Query Provider
- NextIntlClientProvider
- Zustand provider (jika diperlukan)

**Checklist:**
- [ ] Locale switcher component
- [ ] Dashboard sidebar (responsive)
- [ ] Dashboard header
- [ ] Mobile navigation drawer
- [ ] Providers wrapper

### 11. Additional Next.js 16 Optimizations

#### Create `app/loading.tsx`:
Global loading UI untuk suspense boundaries.

#### Create `app/error.tsx`:
Global error boundary dengan error handling (Next.js 16 Error Boundary improvements).

#### Create `app/manifest.ts`:
Generate web app manifest dynamically.

#### Create `app/robots.ts`:
Generate robots.txt dynamically.

#### Create `app/sitemap.ts`:
Generate sitemap dynamically.

**Checklist:**
- [ ] Global loading.tsx
- [ ] Global error.tsx (Next.js 16 pattern)
- [ ] manifest.ts (PWA ready)
- [ ] robots.ts
- [ ] sitemap.ts

---

## ✅ Acceptance Criteria

Project dianggap complete jika:

- [ ] `npm run dev` berjalan tanpa error (Turbopack enabled by default)
- [ ] `npm run build` berhasil tanpa error (Next.js 16 build optimizations)
- [ ] Halaman landing accessible di `/`
- [ ] Halaman login accessible di `/login`
- [ ] Halaman register accessible di `/register`
- [ ] Switch bahasa ID/EN berfungsi (next-intl v4 + Next.js 16)
- [ ] Dashboard layout render dengan sidebar dan header
- [ ] Responsive design berfungsi (mobile & desktop)
- [ ] Semua shadcn components bisa di-import tanpa error
- [ ] Tidak ada TypeScript errors
- [ ] ESLint tidak ada critical errors
- [ ] Hot reload berfungsi dengan baik (Turbopack - faster than webpack)

---

## 📚 References (Context7 Verified)

- **Next.js 16 Documentation**: https://nextjs.org/docs (via Context7)
- **Next.js 16 Upgrade Guide**: https://nextjs.org/docs/app/building-your-application/upgrading
- **shadcn/ui v4 + Tailwind v4**: https://ui.shadcn.com/docs (via Context7 - May 2025 update)
- **Tailwind CSS 4**: https://tailwindcss.com/docs
- **next-intl v4**: https://next-intl-docs.vercel.app/docs/getting-started/app-router
- **TanStack Query v5**: https://tanstack.com/query/latest
- **Zustand v5**: https://docs.pmnd.rs/zustand/getting-started/introduction
- **React 19**: https://react.dev/blog

---

## 🚀 Next Steps After Completion

1. **Week 1 Day 3-7:** Implementasi Authentication dengan Supabase
2. **Week 2:** Core Management Features (Kost, Room, Tenant)
3. **Week 3:** Payment Integration (Midtrans)
4. **Week 4:** Polish & Deployment

---

## 📝 Notes for Developer (Context7 Verified Latest)

### Next.js 16 Key Changes (via Context7):
- **Turbopack**: Dev server menggunakan Turbopack secara default (significantly faster than webpack)
- **React 19**: Full support React 19 with new features
- **Partial Prerendering (PPR)**: Now stable in Next.js 16 (was experimental in 15)
- **Dynamic IO**: Now stable in Next.js 16 (was experimental in 15)
- **Caching**: Simplified caching model - `dynamicIO` untuk dynamic-only routes
- **Upgraded Codemod**: Use `npx @next/codemod@latest` untuk upgrade otomatis

### Tailwind CSS 4 Key Changes (via Context7):
- **CSS-first configuration**: Konfigurasi via CSS `@theme` directive
- **@theme inline**: Support inline theme customization
- **Faster build times**: Optimized untuk production builds
- **Zero JavaScript runtime**: Smaller bundle size
- **shadcn v4 support**: All components updated for Tailwind v4

### next-intl v4 Key Changes:
- **Next.js 16 optimized**: Full compatibility dengan Next.js 16 features
- **Server-first approach**: Improved server-side rendering support
- **React 19 support**: Compatible dengan React 19 features

### Important Reminders:
- Pastikan Node.js version >= 20.x (recommended untuk Next.js 16)
- Gunakan npm atau yarn secara konsisten
- Jika ada error saat install shadcn components, cek dokumentasi terbaru shadcn v4
- Untuk placeholder images, gunakan `https://placehold.co/` atau `https://picsum.photos`
- Fokus pada struktur dan setup, konten detail akan diimplementasikan di issue berikutnya
- Test `npm run build` sebelum commit untuk memastikan tidak ada error

### Performance Targets (Next.js 16):
- First Contentful Paint (FCP): < 1.0s (Turbopack advantage)
- Time to Interactive (TTI): < 2.5s
- Lighthouse Performance Score: > 95 (Next.js 16 optimizations)
