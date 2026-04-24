import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Check,
  Home,
  CreditCard,
  MessageSquare,
  Zap,
  ArrowRight,
  X
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-2xl text-primary">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              K
            </div>
            <span>KostOS</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#features" className="hover:text-primary transition-colors">Fitur</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Harga</a>
            <a href="#about" className="hover:text-primary transition-colors">Tentang</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Daftar Sekarang</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-500">
                <Zap className="w-3 h-3 fill-current" />
                <span>Manajemen Kost Modern #1 di Indonesia</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                Kelola Kost Lebih <span className="text-primary">Mudah, Otomatis,</span> dan <span className="text-primary">Aman</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Tinggalkan pencatatan manual. Otomatisasi tagihan, pantau pembayaran via WhatsApp, 
                dan kelola keluhan tenant dalam satu platform terintegrasi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                    Mulai Gratis Sekarang
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-xl">
                  Lihat Demo
                </Button>
              </div>
              <div className="pt-8 flex items-center gap-8 grayscale opacity-50 overflow-hidden whitespace-nowrap">
                <div className="flex items-center gap-2 font-bold text-xl uppercase tracking-widest italic">KostMentari</div>
                <div className="flex items-center gap-2 font-bold text-xl uppercase tracking-widest italic">GriyaAmanah</div>
                <div className="flex items-center gap-2 font-bold text-xl uppercase tracking-widest italic">KostPedia</div>
                <div className="flex items-center gap-2 font-bold text-xl uppercase tracking-widest italic">OmahBagus</div>
              </div>
            </div>
          </div>
          
          {/* Background Decorations */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-0 pointer-events-none opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[128px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse delay-700" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Solusi All-in-One untuk Juragan Kost</h2>
              <p className="text-muted-foreground text-lg">
                Didesain khusus untuk pemilik kost di Indonesia dengan fitur yang relevan dan mudah digunakan.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Home className="w-6 h-6" />
                  </div>
                  <CardTitle>Manajemen Kamar & Tenant</CardTitle>
                  <CardDescription>
                    Kelola ketersediaan kamar, data tenant, hingga dokumen ID secara terpusat dan aman.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Pantau status kamar (kosong, terisi, maintenance) secara real-time dari dashboard manapun.
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <CardTitle>Tagihan & Pembayaran Otomatis</CardTitle>
                  <CardDescription>
                    Kirim pengingat tagihan via WhatsApp secara otomatis dan terima pembayaran via Midtrans.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Sistem otomatis mencatat pembayaran dan mengubah status kamar tanpa perlu input manual lagi.
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <CardTitle>Sistem Tiket Keluhan</CardTitle>
                  <CardDescription>
                    Tenant bisa melaporkan kerusakan melalui form publik tanpa perlu download aplikasi.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Pantau progres perbaikan dan berikan update kepada tenant secara profesional.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Pilih Paket Sesuai Kebutuhan Anda</h2>
              <p className="text-muted-foreground text-lg">
                Mulai dari gratis hingga fitur multi-properti untuk manajemen skala besar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* FREE */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">FREE</CardTitle>
                  <CardDescription>Cocok untuk kost kecil</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">Rp 0</span>
                    <span className="text-muted-foreground">/selamanya</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Maks. 5 Kamar</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> 1 Properti</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Manajemen Dasar</li>
                    <li className="flex items-center gap-2 text-muted-foreground/50 line-through"><X className="w-4 h-4" /> Sistem Tiket Keluhan</li>
                    <li className="flex items-center gap-2 text-muted-foreground/50 line-through"><X className="w-4 h-4" /> Integrasi Midtrans</li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Link href="/register" className="w-full">
                    <Button variant="outline" className="w-full">Pilih Paket</Button>
                  </Link>
                </div>
              </Card>

              {/* PRO */}
              <Card className="flex flex-col relative border-primary shadow-lg scale-105 z-10 bg-primary/5">
                <div className="absolute top-0 right-0 left-0 bg-primary text-primary-foreground text-center text-xs font-bold py-1 rounded-t-lg">
                  PALING POPULER
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">PRO</CardTitle>
                  <CardDescription>Untuk juragan kost serius</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">Rp 99rb</span>
                    <span className="text-muted-foreground">/bulan</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Maks. 50 Kamar</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> 1 Properti</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Sistem Tiket Keluhan</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Integrasi Midtrans</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Pengingat WA Otomatis</li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Link href="/register" className="w-full">
                    <Button className="w-full">Pilih Paket</Button>
                  </Link>
                </div>
              </Card>

              {/* MULTI */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">MULTI</CardTitle>
                  <CardDescription>Untuk manajemen skala besar</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">Rp 249rb</span>
                    <span className="text-muted-foreground">/bulan</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Kamar Tak Terbatas</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Properti Tak Terbatas</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Semua Fitur PRO</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Laporan Lanjutan</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Support Prioritas</li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Link href="/register" className="w-full">
                    <Button variant="outline" className="w-full">Pilih Paket</Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold">Siap Menjadi Juragan Kost Modern?</h2>
            <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto">
              Daftar sekarang dan rasakan kemudahan mengelola properti Anda. Gratis selamanya untuk kost kecil.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="h-14 px-10 text-lg rounded-xl shadow-xl">
                Buat Akun Sekarang - Gratis!
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 font-bold text-xl text-primary">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-xs">
                K
              </div>
              <span>KostOS</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 KostOS. Made with ❤️ in Indonesia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
