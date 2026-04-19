# Epic: Profesional Design System & Responsive Layout

## Deskripsi
Implementasi Design System yang terstandardisasi dan layout yang sepenuhnya mobile-responsive. Prioritas implementasi akan menggunakan pendekatan *Mobile-First*, di mana UI dirancang dan dioptimalkan dari layar terkecil terlebih dahulu dan berkembang hingga layar berukuran besar.

---

## 🎨 Spesifikasi Design System

### 1. Sistem Breakpoints (Mobile-First)
Standar yang mengatur titik perubahan tata letak layout aplikasi.

| Device | Range Lebar | Deskripsi |
| --- | --- | --- |
| **Mobile** | `0px - 599px` | Portrait smartphone. |
| **Tablet** | `600px - 1023px` | Tablet atau smartphone landscape. |
| **Desktop** | `1024px - 1439px` | Laptop atau monitor standar. |
| **Wide** | `1440px+` | Monitor besar/Ultra-wide. |

### 2. Responsive Grid System
Fleksibilitas konten dengan komposisi standar industri.
- **Columns**: Sistem layout `12-column` grid.
- **Gutters**: Jarak antar kolom standar `16px` (Mobile) dan `24px` (Desktop).
- **Margins**: Jarak aman (padding pinggir layar) dinamis disesuaikan per breakpoint layar.

### 3. Tipografi Fluid
Mengoptimalkan ukuran dan kenyamanan membaca pengguna di setiap layar.
- Menggunakan satuan relatif (`rem` atau `em`).
- **Scale**: Major Third atau Perfect Fourth.
- **Line Height**: `$1.5 \times$` ukuran font (khususnya untuk teks bacaan/panjang).
- **Relasi Resolusi**: 
  - H1: Mobile `32px` -> Desktop `48px`.
  - Body: Mobile `14px` -> Desktop `16px`.

### 4. Sistem Spacing (Jarak)
Menggunakan *8-Pt Grid System* untuk menjaga ritme visual yang konsisten.
- Skala interval: `8px, 16px, 24px, 32px, 40px, 64px`.
- Mengontrol **Padding** (jarak dalam) dan **Margin** (jarak luar elemen).

### 5. Komponen UI Adaptif
Bentuk dan behavior komponen berubah sesuai *real estate* layar.
- **Navigation**: Menggunakan Hamburger Menu (Mobile/Tablet), dan Horizontal Menu List (Desktop).
- **Cards**: Menggunakan Stacked Layout (Card menyusun secara vertikal) di Mobile, dan Side-by-side (Grid horizontal) di Desktop.
- **Buttons**: Ukuran Full Width (`100%`) agar akses ketukan mudah di Mobile, dan lebar Auto mengikuti teks di Desktop.

### 6. Prinsip Gambar & Media
- **Aspect Ratio**: Pengaturan rasio tetap visual media (`16:9` atau `4:3`) agar gambar proporsional dan tidak terjadi distorsi.
- **Responsive Images**: Gambar adaptif mengandalkan atribut `srcset` dengan rule `max-width: 100%`.

---

## 🛠 Tahapan Implementasi

Dokumen ini ditujukan sebagai panduan step-by-step implementasi *actionable* bagi tim developer maupun *AI code agent*.

### Tahap 1: Setup Folder Struktur Design System & Variable CSS/Token
1. **Aturan Path**: Gunakan folder `design-system/` yang sudah disiapkan untuk menyimpan rules styling.
2. **Definisi CSS Variables**:
   Buat file terpisah (contoh `design-system/colors.css`, `design-system/typography.css`, dsb.) untuk mendeklarasikan *Design Tokens*.
   - *Contoh format definisi variabel `colors.css`:*
     ```css
     :root {
       /* Identitas Brand Utama */
       --primary-color: #YOUR_HEX;
       
       /* Warna Element Spesifik (contoh) */
       --login-color: #00FF00; /* Hijau */
       
       /* Base Surface & Text */
       --text-color: #1a1a1a;
       --background-color: #ffffff;
     }
     ```
   - *Contoh format definisi variabel `spacing.css`:*
     ```css
     :root {
       --spacing-1: 0.5rem;   /* 8px */
       --spacing-2: 1rem;     /* 16px */
       --spacing-3: 1.5rem;   /* 24px */
       --spacing-4: 2rem;     /* 32px */
     }
     ```
3. **Koneksi Variables**: Import semua token modular ini ke file global stylesheet utama aplikasi (contoh: `app/globals.css` atau entry styling Next.js utama). Jika menggunakan *TailwindCSS*, daftarkan variable/color tersebut ke dalam *theme config* di file `tailwind.config.ts`.

### Tahap 2: Registrasi Fluid Typography & Standard Spacing
1. Buat rule base CSS untuk font sizing. Lebih disarankan menggunakan CSS `clamp()` untuk otomatisasi interpolasi antara desktop & mobile (Cth: `font-size: clamp(14px, 2vw, 16px)`).
2. Terapkan reset *Line-Height* base pada konfigurasi body.
3. Integrasikan scale margin dan padding memakai referensi CSS Variables yang dibuat di Tahap 1.

### Tahap 3: Merangkai Responsive Grid & Breakpoints 
1. Daftarkan dan config media query breakpoints (Cth `min-width: 600px`, `min-width: 1024px`).
2. Rangkai root framework container 12-kolom:
   ```css
   .grid-system {
     display: grid;
     grid-template-columns: repeat(12, 1fr);
     gap: 16px; /* Gutter Mobile */
   }
   @media (min-width: 1024px) {
     .grid-system { gap: 24px; /* Gutter Desktop */ }
   }
   ```
   *(Bila memakai Tailwind, gunakan helper flexibilitas konfigurasi default bawaan Tailwind disesuaikan params spesifik viewport ini).*

### Tahap 4: Merancang & Refactor Komponen UI Base
1. **Komponen Header (Navigation)**:
   - Buat file Navigation component.
   - Set logik render menu berupa hidden list pada resolusi $<600px$ dengan tombol trigger (Hamburger icon).
   - Munculkan layout list secara `flex-row` pada `@media(min-width: 1024px)`.
2. **Komponen Buttons**:
   - Refactor dan pastikan class default button menggunakan `width: 100%`.
   - Gunakan utility breakpoint di desktop (contoh Tailwind: `lg:w-auto`) agar lebar otomatis disesuaikan secara dinamis.
3. **Card Lists**: 
   - Refactor mapping list data ke dalam bentuk layout Stack (cth `flex-col`) untuk base Mobile, dan transisikan menjadi Column Grid di resolusi layar lebih besar.

### Tahap 5: Optimasi Assets Media Root
1. Tambahkan ke Global Reset:
   ```css
   img, video, canvas, svg {
     display: block;
     max-width: 100%;
     height: auto;
   }
   ```
2. Tetapkan constraint pembungkus media via class wrapper aspect-ratio untuk mencegah *layout-shift* ketika page masih memuat respon dari *backend/bucket*.

---

*Note: Kerjakan implementasi PR ini file per file untuk menghindari konflik.*
