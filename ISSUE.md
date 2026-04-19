# Issue: Setup Next.js 14 Frontend Project

## 📋 Overview
Setup project frontend KostKu menggunakan Next.js 14 dengan App Router, TypeScript, dan semua dependency yang dibutuhkan.

**Priority:** High  
**Estimated Time:** 1-2 hari  
**Status:** To Do

---

## 🎯 Goals
- [ ] Initialize Next.js 14 project dengan TypeScript
- [ ] Setup TailwindCSS dan shadcn/ui components
- [ ] Konfigurasi struktur folder sesuai best practice
- [ ] Install semua dependency yang diperlukan
- [ ] Setup environment variables template
- [ ] Konfigurasi i18n (next-intl) untuk ID/EN
- [ ] Setup basic layout dan halaman awal

---

## 📁 Deliverables

### 1. Project Initialization
```bash
# Inisialisasi project dengan shadcn template
npx shadcn@latest init --yes --template next --base-color slate
```

**Checklist:**
- [ ] Project name: `kostku`
- [ ] TypeScript: enabled
- [ ] ESLint: enabled
- [ ] Tailwind CSS: enabled
- [ ] App Router: enabled
- [ ] src directory: disabled (gunakan root)
- [ ] Import alias: `@/*`

### 2. Install shadcn/ui Components
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

### 3. Install Core Dependencies

```bash
# State Management
npm install zustand

# Data Fetching
npm install @tanstack/react-query @tanstack/react-query-devtools

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# Internationalization
npm install next-intl

# Icons
npm install lucide-react

# Date Handling
npm install date-fns

# Classname Utilities
npm install clsx tailwind-merge

# Additional Utilities
npm install recharts
```

**Checklist:**
- [ ] Zustand (state management)
- [ ] TanStack Query (server state)
- [ ] React Hook Form + Zod (forms)
- [ ] next-intl (i18n)
- [ ] lucide-react (icons)
- [ ] date-fns (date formatting)
- [ ] clsx + tailwind-merge (classname utilities)
- [ ] recharts (dashboard charts)

### 4. Install Dev Dependencies

```bash
# Type definitions
npm install -D @types/node @types/react @types/react-dom

# Utilities
npm install -D prettier prettier-plugin-tailwindcss
```

**Checklist:**
- [ ] Type definitions
- [ ] Prettier + Tailwind plugin

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
└── globals.css

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
└── config.ts
```

**Checklist:**
- [ ] Create folder structure
- [ ] Add .gitkeep atau placeholder files

### 6. Configuration Files

#### Update `next.config.js`:
```javascript
const nextConfig = {
  experimental: {
    // Enable if needed
    // serverActions: true,
  },
  images: {
    domains: ['localhost'],
    // Add Supabase storage domain when ready
    // domains: ['localhost', '*.supabase.co'],
  },
  // i18n config handled by next-intl
}

module.exports = nextConfig
```

#### Update `tailwind.config.ts`:
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

# Midtrans (to be filled later)
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=

# Note: Server-side env vars will be added in backend setup
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

**Checklist:**
- [ ] Update next.config.js
- [ ] Update tailwind.config.ts (tambah brand colors)
- [ ] Create .env.local template
- [ ] Create .prettierrc
- [ ] Update tsconfig.json jika diperlukan

### 7. i18n Setup (next-intl)

#### Create `i18n/config.ts`:
```typescript
export const locales = ['id', 'en'] as const
export const defaultLocale = 'id' as const
export type Locale = (typeof locales)[number]
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

#### Create `middleware.ts` (root level):
```typescript
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n/config'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
})

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
```

**Checklist:**
- [ ] Create i18n config
- [ ] Create ID messages
- [ ] Create EN messages
- [ ] Setup middleware.ts
- [ ] Update root layout untuk next-intl

### 8. Base Layout & Global Styles

#### Update `app/globals.css`:
Pastikan sudah include:
- Tailwind directives
- CSS variables untuk theming
- Dark mode support (optional)

#### Update `app/layout.tsx`:
- Setup next-intl Provider
- Setup metadata
- Setup font (Inter dari Google Fonts)
- Tambahkan Toaster untuk notifikasi

#### Create `lib/utils.ts` (if not exists):
Pastikan sudah ada cn() utility untuk className merging.

**Checklist:**
- [ ] Verify globals.css
- [ ] Update layout.tsx dengan i18n support
- [ ] Add Inter font
- [ ] Add Toaster component

### 9. Placeholder Pages

#### Create `app/page.tsx` (Landing Page):
- Hero section placeholder
- Features overview placeholder
- CTA buttons (Login/Register)
- Simple responsive design

#### Create `app/(auth)/login/page.tsx`:
- Login form placeholder
- Email & password fields
- Link to register
- Basic validation

#### Create `app/(auth)/register/page.tsx`:
- Registration form placeholder
- Role selection (Owner/Admin/Tenant)
- Basic fields

#### Create `app/(dashboard)/layout.tsx`:
- Dashboard layout with sidebar placeholder
- Header with user menu
- Main content area
- Responsive mobile menu

#### Create `app/(dashboard)/page.tsx`:
- Role-based redirect logic placeholder
- Dashboard home content

**Checklist:**
- [ ] Landing page
- [ ] Login page
- [ ] Register page
- [ ] Dashboard layout
- [ ] Dashboard home

### 10. Shared Components Setup

#### Create `components/shared/locale-switcher.tsx`:
Dropdown untuk ganti bahasa (ID/EN)

#### Create `components/layouts/dashboard-sidebar.tsx`:
Sidebar navigation placeholder dengan menu items

#### Create `components/layouts/dashboard-header.tsx`:
Header dengan logo, user menu, notifications placeholder

**Checklist:**
- [ ] Locale switcher component
- [ ] Dashboard sidebar
- [ ] Dashboard header
- [ ] Mobile navigation drawer

---

## ✅ Acceptance Criteria

Project dianggap complete jika:

- [ ] `npm run dev` berjalan tanpa error
- [ ] Halaman landing accessible di `/`
- [ ] Halaman login accessible di `/login`
- [ ] Halaman register accessible di `/register`
- [ ] Switch bahasa ID/EN berfungsi
- [ ] Dashboard layout render dengan sidebar dan header
- [ ] Responsive design berfungsi (mobile & desktop)
- [ ] Semua shadcn components bisa di-import tanpa error
- [ ] Tidak ada TypeScript errors
- [ ] ESLint tidak ada critical errors

---

## 📚 References

- Next.js 14 App Router: https://nextjs.org/docs/app
- shadcn/ui: https://ui.shadcn.com/docs
- next-intl: https://next-intl-docs.vercel.app/docs/next-13
- Tailwind CSS: https://tailwindcss.com/docs
- Zustand: https://docs.pmnd.rs/zustand/getting-started/introduction
- TanStack Query: https://tanstack.com/query/latest

---

## 🚀 Next Steps After Completion

1. **Week 1 Day 3-7:** Implementasi Authentication dengan Supabase
2. **Week 2:** Core Management Features (Kost, Room, Tenant)
3. **Week 3:** Payment Integration (Midtrans)
4. **Week 4:** Polish & Deployment

---

**Notes for Developer:**
- Pastikan Node.js version >= 18
- Gunakan npm atau yarn secara konsisten
- Jika ada error saat install shadcn components, cek dokumentasi terbaru
- Untuk placeholder images, gunakan placeholder.com atau picsum.photos
- Fokus pada struktur dan setup, konten detail akan diimplementasikan di issue berikutnya
