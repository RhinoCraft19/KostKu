# 📋 KostOS — Project Summary & Manual Testing Guide

> Dokumen ini berisi **panduan setup environment**, **daftar lengkap endpoint**, dan **skenario testing manual**
> yang harus dilakukan sebelum dianggap production-ready.

---

## 📌 BAGIAN 1 — Setup Environment (WAJIB DILAKUKAN DULU)

### 1.1 Buka file `.env.local` dan isi semua nilai yang masih placeholder

File: `kostos/.env.local`

```env
# ─────────────────────────────────────────────────────
# SUPABASE (SUDAH TERISI — tidak perlu diubah)
# ─────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://nasxjhmddvbguhchxfrl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...  ← sudah ada, jangan diubah

# ─────────────────────────────────────────────────────
# DATABASE (WAJIB DIISI)
# ─────────────────────────────────────────────────────
DATABASE_URL=postgresql://postgres.nasxjhmddvbguhchxfrl:[YOUR-DB-PASSWORD]@aws-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.nasxjhmddvbguhchxfrl:[YOUR-DB-PASSWORD]@aws-ap-northeast-2.pooler.supabase.com:5432/postgres
```

**Cara mendapatkan DB Password:**
1. Buka [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Pilih project `nasxjhmddvbguhchxfrl`
3. Masuk ke **Settings → Database → Connection string**
4. Copy password, lalu ganti `[YOUR-DB-PASSWORD]` di kedua URL di atas

---

```env
# ─────────────────────────────────────────────────────
# SUPABASE SERVICE ROLE KEY (WAJIB DIISI)
# ─────────────────────────────────────────────────────
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SUPABASE-SERVICE-ROLE-KEY]
```

**Cara mendapatkan:**
1. Buka **Supabase Dashboard → Settings → API**
2. Copy nilai dari **Service role key** (bukan anon key)
3. ⚠️ JANGAN share key ini — hanya untuk server-side

---

```env
# ─────────────────────────────────────────────────────
# MIDTRANS (WAJIB DIISI untuk test payment)
# ─────────────────────────────────────────────────────
MIDTRANS_ENV=sandbox        ← biarkan "sandbox" untuk testing
MIDTRANS_SERVER_KEY=[YOUR-MIDTRANS-SERVER-KEY]
MIDTRANS_CLIENT_KEY=[YOUR-MIDTRANS-CLIENT-KEY]
```

**Cara mendapatkan:**
1. Daftar / login di [https://dashboard.midtrans.com](https://dashboard.midtrans.com)
2. Pastikan mode **Sandbox** aktif (toggle di kiri atas)
3. Masuk ke **Settings → Access Keys**
4. Copy **Server Key** dan **Client Key** (format: `SB-Mid-server-xxxx` dan `SB-Mid-client-xxxx`)

---

```env
# ─────────────────────────────────────────────────────
# UPSTASH REDIS (OPSIONAL — untuk caching)
# Tanpa ini, caching dinonaktifkan tapi app tetap berjalan
# ─────────────────────────────────────────────────────
UPSTASH_REDIS_REST_URL=[YOUR-UPSTASH-REST-URL]
UPSTASH_REDIS_REST_TOKEN=[YOUR-UPSTASH-REST-TOKEN]
```

**Cara mendapatkan:**
1. Daftar / login di [https://console.upstash.com](https://console.upstash.com)
2. Buat database baru → pilih region **Asia Pacific (Singapore)**
3. Copy **REST URL** dan **REST Token** dari detail database

---

```env
# ─────────────────────────────────────────────────────
# SENTRY (OPSIONAL — untuk error tracking)
# Kosongkan untuk skip sentry, app tetap berjalan
# ─────────────────────────────────────────────────────
SENTRY_DSN=[YOUR-SENTRY-DSN]          # atau kosongkan: SENTRY_DSN=
SENTRY_ORG=[YOUR-SENTRY-ORG]          # atau kosongkan
SENTRY_PROJECT=[YOUR-SENTRY-PROJECT]  # atau kosongkan
```

---

```env
# ─────────────────────────────────────────────────────
# CRON SECRET (WAJIB untuk test billing generation)
# ─────────────────────────────────────────────────────
CRON_SECRET=kostos-test-secret-12345   ← ganti dengan string random apapun
```

---

### 1.2 Jalankan Prisma Migration

Setelah `.env.local` terisi, jalankan perintah berikut di terminal (dalam folder `kostos/`):

```bash
# Push schema ke database (pertama kali setup)
npx prisma db push

# Generate Prisma Client
npx prisma generate

# (Opsional) Buka Prisma Studio untuk lihat data
npx prisma studio
```

> ⚠️ Jika `npx prisma db push` error "password authentication failed", berarti password di `DATABASE_URL` salah.

---

### 1.3 Jalankan Development Server

```bash
npm run dev
```

App akan berjalan di: **http://localhost:3000**

---

## 📌 BAGIAN 2 — Struktur URL Aplikasi

| URL | Deskripsi |
|-----|-----------|
| `http://localhost:3000/` | Landing page |
| `http://localhost:3000/login` | Halaman login |
| `http://localhost:3000/register` | Halaman register |
| `http://localhost:3000/onboarding` | Setup properti pertama (setelah register) |
| `http://localhost:3000/dashboard` | Dashboard utama |
| `http://localhost:3000/rooms` | Daftar kamar |
| `http://localhost:3000/rooms/[id]` | Detail kamar + riwayat tagihan |
| `http://localhost:3000/tenants` | Daftar tenant |
| `http://localhost:3000/payments` | Daftar tagihan / pembayaran |
| `http://localhost:3000/complaints` | Dashboard komplain |
| `http://localhost:3000/settings` | Pengaturan akun & billing |
| `http://localhost:3000/complaint/[token]` | Form komplain publik (tanpa login) |

---

## 📌 BAGIAN 3 — Manual Testing Scenarios

### ✅ TEST 1: Register & Onboarding

**Tujuan:** Memastikan user baru bisa daftar dan setup properti pertama.

**Langkah:**
1. Buka `http://localhost:3000/register`
2. Isi email dan password → klik **Daftar**
3. Cek email untuk verifikasi (jika Supabase email confirmation aktif)
4. Setelah login, pastikan redirect ke `/onboarding`
5. Isi:
   - **Nama Properti:** `Kost Melati`
   - **Alamat:** `Jl. Kenanga No. 5`
   - **Kota:** `Bandung`
6. Klik **Simpan**

**Ekspektasi:**
- ✅ User tersimpan di tabel `User` Prisma
- ✅ Subscription `FREE` otomatis dibuat
- ✅ Properti pertama tersimpan dengan `complaintToken` UUID
- ✅ Redirect ke `/dashboard`

**Cara verifikasi di database:**
```bash
npx prisma studio
# Buka tabel: User, Subscription, Property
```

---

### ✅ TEST 2: Tambah Properti (Tier Guard FREE)

**Tujuan:** Memastikan user FREE tidak bisa tambah lebih dari 1 properti.

**Langkah:**
1. Login dengan akun FREE (baru daftar)
2. Masuk ke `/dashboard` atau API `POST /api/properties`
3. Coba tambah properti kedua

**Ekspektasi:**
- ✅ Request pertama → sukses (properti ke-1)
- ❌ Request kedua → HTTP 403 dengan pesan:
  ```json
  { "error": "Paket FREE hanya mendukung maksimal 1 properti. Upgrade untuk menambah lebih banyak." }
  ```

---

### ✅ TEST 3: Tambah Kamar

**Tujuan:** Memastikan kamar bisa ditambahkan ke properti.

**Langkah:**
1. Login dan masuk ke `/rooms`
2. Klik **Tambah Kamar**
3. Isi:
   - **Nomor Kamar:** `A-01`
   - **Harga Sewa:** `750000`
4. Klik **Simpan**

**Ekspektasi:**
- ✅ Kamar tersimpan dengan status `VACANT`
- ✅ Muncul di daftar kamar

**Test batas FREE (max 10 kamar):**
- Coba tambah kamar ke-11 → harus HTTP 403

---

### ✅ TEST 4: Tambah Tenant

**Tujuan:** Memastikan tenant bisa ditambahkan ke kamar.

**Langkah:**
1. Masuk ke `/tenants` → klik **Tambah Tenant**
2. Isi:
   - **Nama:** `Budi Santoso`
   - **No HP:** `081234567890`
   - **Kamar:** pilih `A-01`
   - **Tanggal Mulai:** hari ini
   - **Tanggal Tagihan:** `1` (billing setiap tgl 1)
3. Klik **Simpan**

**Ekspektasi:**
- ✅ Tenant tersimpan, status kamar berubah ke `OCCUPIED`
- ✅ `isActive: true` di database

---

### ✅ TEST 5: Generate Invoice (Billing)

**Tujuan:** Memastikan sistem bisa generate tagihan bulanan.

**Cara test via curl / Postman:**

```bash
curl -X POST http://localhost:3000/api/v1/billing/generate \
  -H "Content-Type: application/json" \
  -H "x-cron-secret: kostos-test-secret-12345"
```

> Ganti `kostos-test-secret-12345` dengan nilai `CRON_SECRET` di `.env.local`

**Ekspektasi:**
```json
{
  "success": true,
  "data": [...],
  "meta": { "generated": 1 }
}
```

- ✅ Invoice baru muncul di tabel `Invoice` dengan status `UNPAID`
- ✅ `dueDate` sesuai dengan `billingDay` tenant

**Jika `generated: 0`:**
- Berarti tidak ada tenant yang jatuh tempo hari ini
- Ubah `billingDay` tenant ke hari ini di Prisma Studio, lalu coba lagi

---

### ✅ TEST 6: Lihat Tagihan di Dashboard

**Langkah:**
1. Buka `http://localhost:3000/payments`
2. Pastikan tagihan yang di-generate di TEST 5 muncul

**Ekspektasi:**
- ✅ Summary cards menampilkan: Total Tagihan, Sudah Dibayar, Belum Bayar
- ✅ Daftar tagihan muncul dengan status `UNPAID`

---

### ✅ TEST 7: Buat Link Pembayaran Midtrans

**Tujuan:** Memastikan integrasi Midtrans berfungsi untuk generate payment link.

> ⚠️ Pastikan `MIDTRANS_SERVER_KEY` dan `MIDTRANS_CLIENT_KEY` sudah diisi di `.env.local`

**Cara test:**
1. Ambil `id` invoice dari Prisma Studio (atau dari response TEST 5)
2. Panggil API:

```bash
curl -X POST http://localhost:3000/api/payments/[INVOICE_ID]/create-link \
  -H "Content-Type: application/json"
```

Ganti `[INVOICE_ID]` dengan ID invoice asli, contoh:
```bash
curl -X POST http://localhost:3000/api/payments/clxyz123abc/create-link
```

**Ekspektasi:**
```json
{ "paymentUrl": "https://app.sandbox.midtrans.com/snap/v3/redirection/xxxx" }
```

- ✅ URL Midtrans Snap muncul
- ✅ `PaymentTransaction` baru tersimpan di database dengan status `PENDING`

---

### ✅ TEST 8: Simulasi Webhook Midtrans

**Tujuan:** Memastikan webhook handler memproses notifikasi Midtrans dengan benar.

**Cara test (simulasi manual):**

1. Ambil nilai `MIDTRANS_SERVER_KEY` dari `.env.local`
2. Ambil `orderId` dari field `externalId` di tabel `PaymentTransaction`
3. Hitung signature:

```bash
# Di PowerShell:
$orderId = "KOSTOS-INV-[invoice_id]-[timestamp]"
$statusCode = "200"
$grossAmount = "750000.00"
$serverKey = "[YOUR-MIDTRANS-SERVER-KEY]"
$str = "${orderId}${statusCode}${grossAmount}${serverKey}"
$sha = [System.Security.Cryptography.SHA512]::Create()
$bytes = [System.Text.Encoding]::UTF8.GetBytes($str)
$hash = $sha.ComputeHash($bytes)
[System.BitConverter]::ToString($hash).Replace("-","").ToLower()
```

4. Kirim webhook simulasi:

```bash
curl -X POST http://localhost:3000/api/webhooks/midtrans \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "KOSTOS-INV-[invoice_id]-[timestamp]",
    "status_code": "200",
    "gross_amount": "750000.00",
    "transaction_status": "settlement",
    "signature_key": "[HASH_DARI_LANGKAH_3]"
  }'
```

**Ekspektasi:**
```json
{ "ok": true }
```

- ✅ `PaymentTransaction.status` berubah → `SUCCESS`
- ✅ `Invoice.status` berubah → `PAID`

---

### ✅ TEST 9: Form Komplain Publik

**Tujuan:** Memastikan tenant bisa submit komplain tanpa login.

**Langkah:**
1. Ambil `complaintToken` dari tabel `Property` di Prisma Studio
2. Buka: `http://localhost:3000/complaint/[COMPLAINT_TOKEN]`
3. Isi form:
   - **Nama Penghuni:** `Budi Santoso`
   - **Nomor Kamar:** `A-01`
   - **Deskripsi:** `AC kamar tidak berfungsi dengan baik`
4. Klik **Kirim**

**Ekspektasi:**
- ✅ Muncul pesan sukses
- ✅ Komplain tersimpan di tabel `Complaint` dengan status `OPEN`

> ⚠️ **Jika muncul error 403 "Layanan Keluhan Dinonaktifkan":**
> Fitur komplain hanya untuk tier PRO/MULTI.
> Cara bypass untuk testing:
> ```bash
> # Di Prisma Studio, ubah Subscription.tier dari FREE ke PRO
> # Atau lewat Prisma Studio → tabel Subscription → edit tier
> ```

---

### ✅ TEST 10: Kelola Status Komplain (Dashboard)

**Tujuan:** Memastikan owner bisa update status komplain.

**Langkah:**
1. Login sebagai owner
2. Buka `http://localhost:3000/complaints`
3. Pilih komplain dari TEST 9
4. Ubah status ke `IN_PROGRESS` lalu `RESOLVED`

**Atau via API:**
```bash
curl -X PATCH http://localhost:3000/api/complaints/[COMPLAINT_ID]/status \
  -H "Content-Type: application/json" \
  -H "Cookie: [SESSION_COOKIE]" \
  -d '{ "status": "RESOLVED" }'
```

**Ekspektasi:**
- ✅ Status berubah di database dan UI

---

### ✅ TEST 11: Detail Kamar + Riwayat Tagihan

**Langkah:**
1. Buka `http://localhost:3000/rooms`
2. Klik pada kamar yang sudah ada tenant (dari TEST 3-4)
3. Pastikan halaman `/rooms/[id]` terbuka

**Ekspektasi:**
- ✅ Info kamar: nomor kamar, harga, status
- ✅ Info tenant aktif: nama, no HP, tanggal kontrak
- ✅ Riwayat tagihan (jika ada) muncul dengan status PAID/UNPAID

---

### ✅ TEST 12: Tier Limits via Backend API (v1)

**Tujuan:** Memastikan backend API v1 juga enforce tier limit.

```bash
# Test tambah properti via backend API (butuh auth cookie)
curl -X POST http://localhost:3000/api/v1/properties \
  -H "Content-Type: application/json" \
  -H "Cookie: [SESSION_COOKIE]" \
  -d '{ "name": "Kost Mawar", "address": "Jl. Mawar No. 1", "city": "Jakarta" }'
```

**Ekspektasi (user FREE sudah punya 1 properti):**
```json
{ "success": false, "error": "Paket FREE hanya mendukung maksimal 1 properti..." }
```

---

## 📌 BAGIAN 4 — Cara Mendapatkan Session Cookie untuk Testing

Beberapa API butuh autentikasi. Berikut cara mendapatkan cookie:

1. Login di browser ke `http://localhost:3000/login`
2. Buka **DevTools (F12) → Application → Cookies → localhost**
3. Copy nilai cookie `sb-nasxjhmddvbguhchxfrl-auth-token`
4. Gunakan di curl:

```bash
-H "Cookie: sb-nasxjhmddvbguhchxfrl-auth-token=[VALUE]"
```

Atau gunakan **Postman** yang lebih mudah:
1. Login di browser dulu
2. Di Postman, gunakan "Import Cookies" atau set cookie manual di tab **Cookies**

---

## 📌 BAGIAN 5 — Daftar Lengkap API Endpoints

### 🔵 Frontend / Legacy API (tanpa prefix)

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET` | `/api/properties` | List properti user | ✅ |
| `POST` | `/api/properties` | Buat properti baru | ✅ |
| `GET` | `/api/rooms?propertyId=xxx` | List kamar | ✅ |
| `POST` | `/api/rooms` | Buat kamar baru | ✅ |
| `GET` | `/api/payments?month=2026-04` | List invoice bulan ini | ✅ |
| `PATCH` | `/api/payments/[id]` | Update status invoice | ✅ |
| `GET` | `/api/payments/[id]` | Detail invoice | ✅ |
| `POST` | `/api/payments/[id]/create-link` | Buat link Midtrans | ✅ |
| `POST` | `/api/complaint-form/[token]` | Submit komplain publik | ❌ (publik) |
| `PATCH` | `/api/complaints/[id]/status` | Update status komplain | ✅ |
| `POST` | `/api/onboarding` | Setup user + properti pertama | ✅ |
| `POST` | `/api/webhooks/midtrans` | Terima notif Midtrans | ❌ (Midtrans) |

### 🟢 Backend API v1 (Clean Architecture)

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET` | `/api/v1/properties` | List properti | ✅ |
| `POST` | `/api/v1/properties` | Buat properti (dengan tier guard) | ✅ |
| `GET` | `/api/v1/properties/[id]` | Detail properti | ✅ |
| `PATCH` | `/api/v1/properties/[id]` | Update properti | ✅ |
| `DELETE` | `/api/v1/properties/[id]` | Soft delete properti | ✅ |
| `GET` | `/api/v1/rooms?propertyId=xxx` | List kamar | ✅ |
| `POST` | `/api/v1/rooms` | Buat kamar | ✅ |
| `GET` | `/api/v1/tenants?propertyId=xxx` | List tenant | ✅ |
| `POST` | `/api/v1/tenants` | Tambah tenant | ✅ |
| `GET` | `/api/v1/billing/invoices?tenantId=xxx` | List invoice tenant | ✅ |
| `POST` | `/api/v1/billing/generate` | Generate invoice hari ini | 🔑 (CRON_SECRET) |
| `POST` | `/api/v1/payments/initiate` | Buat transaksi Midtrans | ✅ |
| `POST` | `/api/v1/payments/webhook` | Webhook Midtrans (v1) | ❌ (Midtrans) |
| `GET` | `/api/v1/complaints?propertyId=xxx` | List komplain | ✅ |
| `PATCH` | `/api/v1/complaints/[id]` | Update status komplain | ✅ |

---

## 📌 BAGIAN 6 — Subscription Tier Limits

| Fitur | FREE | PRO | MULTI |
|-------|------|-----|-------|
| Jumlah Properti | 1 | 5 | Unlimited |
| Jumlah Kamar (total) | 10 | 50 | Unlimited |
| Fitur Komplain | ❌ | ✅ | ✅ |

**Cara upgrade tier untuk testing (via Prisma Studio):**
1. Buka `npx prisma studio`
2. Tabel `Subscription` → cari user → ubah `tier` ke `PRO` atau `MULTI`
3. Klik **Save 1 change**

---

## 📌 BAGIAN 7 — Troubleshooting Umum

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `Invalid supabaseUrl` | `.env.local` tidak terbaca | Restart `npm run dev` setelah edit `.env.local` |
| `password authentication failed` | Password database salah | Cek dan update `[YOUR-DB-PASSWORD]` di `DATABASE_URL` |
| `prisma.payment is not a function` | Model `payment` tidak ada di schema | Gunakan `prisma.invoice` — sudah difix |
| `cannot find module @sentry/nextjs` | Sentry belum terinstall | Sudah diinstall — jalankan `npm install` lagi jika masih error |
| `Tier guard 403` | User FREE melebihi batas | Upgrade tier di Prisma Studio |
| `Generated: 0` saat billing | Tidak ada tenant jatuh tempo hari ini | Ubah `billingDay` ke hari ini di Prisma Studio |
| `Invalid signature` di webhook | `MIDTRANS_SERVER_KEY` salah | Pastikan key yang dipakai sesuai mode (sandbox/production) |

---

## 📌 BAGIAN 8 — Checklist Sebelum Testing

Centang semua sebelum mulai test:

- [ ] `.env.local` — `DATABASE_URL` sudah diisi dengan password asli
- [ ] `.env.local` — `DIRECT_URL` sudah diisi dengan password asli
- [ ] `.env.local` — `SUPABASE_SERVICE_ROLE_KEY` sudah diisi
- [ ] `.env.local` — `MIDTRANS_SERVER_KEY` dan `MIDTRANS_CLIENT_KEY` sudah diisi (mode sandbox)
- [ ] `.env.local` — `CRON_SECRET` sudah diisi (bebas, misal: `kostos-dev-secret`)
- [ ] `npx prisma db push` sudah dijalankan → tidak ada error
- [ ] `npx prisma generate` sudah dijalankan
- [ ] `npm run dev` berjalan di `http://localhost:3000`
- [ ] Bisa buka halaman landing page tanpa error

---

*Dokumen ini dibuat otomatis berdasarkan audit codebase KostOS.*
*Last updated: 2026-04-24*
