# 🚀 Panduan Deployment KostOS

Ikuti langkah-langkah berikut untuk meng-deploy aplikasi KostOS ke production.

## 1. Persiapan GitHub
- Pastikan semua perubahan kode sudah di-commit.
- Push kode ke repository GitHub Anda:
  ```bash
  git add .
  git commit -m "Final polish and security"
  git push origin main
  ```

## 2. Deployment ke Vercel
1. Buka [Vercel Dashboard](https://vercel.com/dashboard).
2. Klik **"Add New"** > **"Project"**.
3. Import repository dari GitHub.
4. Di bagian **Environment Variables**, masukkan semua variabel berikut dari file `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL project Supabase Anda.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon Key project Supabase Anda.
   - `SUPABASE_SERVICE_ROLE_KEY`: Service Role Key dari Supabase (untuk server-side operations).
   - `DATABASE_URL`: URL koneksi database PostgreSQL (bisa didapat dari Supabase > Settings > Database).
   - `DIRECT_URL`: Direct connection URL untuk Prisma migrations.
   - `MIDTRANS_SERVER_KEY`: Server Key dari Midtrans Dashboard.
   - `MIDTRANS_CLIENT_KEY`: Client Key dari Midtrans Dashboard.
   - `MIDTRANS_ENV`: Set ke `production` untuk production deployment.
   - `CRON_SECRET`: Secret key untuk billing cron job (generate random string).
   - `UPSTASH_REDIS_REST_URL`: (Optional) Upstash Redis URL untuk rate limiting.
   - `UPSTASH_REDIS_REST_TOKEN`: (Optional) Upstash Redis token.
   - `SENTRY_DSN`: (Optional) Sentry DSN untuk error tracking.
   - `SENTRY_ORG`: (Optional) Sentry organization name.
   - `SENTRY_PROJECT`: (Optional) Sentry project name.
5. Klik **Deploy**.

## 3. Konfigurasi Keamanan (RLS)
Sangat penting untuk mengaktifkan Row Level Security agar data antar pemilik kos tidak bocor.
1. Buka **Supabase Dashboard** > **SQL Editor**.
2. Buka file `supabase-rls.sql` di root proyek ini.
3. Copy semua isinya dan Paste ke SQL Editor Supabase.
4. Klik **Run**.

## 4. Automasi Tagihan Bulanan (Cron Job)
Aplikasi menggunakan Edge Function untuk membuat tagihan otomatis setiap bulan.
1. Deploy function ke Supabase:
   ```bash
   npx supabase functions deploy generate-monthly-bills
   ```
2. Set jadwal (Cron) melalui Supabase Dashboard:
   - Buka **Supabase Dashboard** > **Edge Functions** > **Cron**.
   - Tambahkan jadwal baru.
   - Name: `monthly-billing`
   - Schedule: `0 0 1 * *` (Setiap tanggal 1 pukul 00:00).
   - Function: `generate-monthly-bills`.

## 5. Webhook Midtrans
Agar status pembayaran terupdate otomatis:
1. Buka **Midtrans Dashboard** > **Settings** > **Configuration**.
2. Isi **Payment Notification URL** dengan:
   `https://[DOMAIN_ANDA_DI_VERCEL].vercel.app/api/webhooks/midtrans`

---
Selamat! Aplikasi KostOS Anda sekarang sudah live.
