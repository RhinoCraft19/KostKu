"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronRight, Home, Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [propertyData, setPropertyData] = useState({
    name: "",
    address: "",
    city: "",
  });
  const router = useRouter();

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal menyimpan data");
      }

      router.push("/dashboard");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Gagal menyimpan data";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Stepper */}
        <div className="flex justify-between mb-8 px-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 relative z-10">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors border-2",
                  step === i ? "bg-primary border-primary text-primary-foreground" : 
                  step > i ? "bg-success border-success text-success-foreground" : 
                  "bg-card border-muted text-muted-foreground"
                )}
              >
                {step > i ? <Check className="w-5 h-5" /> : i}
              </div>
              <span className={cn(
                "text-xs font-medium",
                step >= i ? "text-foreground" : "text-muted-foreground"
              )}>
                {i === 1 ? "Properti" : i === 2 ? "Tier Plan" : "Selesai"}
              </span>
            </div>
          ))}
          {/* Progress Bar Background */}
          <div className="absolute top-[4.2rem] left-1/2 -translate-x-1/2 w-[60%] h-0.5 bg-muted -z-0 hidden sm:block" />
        </div>

        <Card className="shadow-xl border-none">
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-6 h-6 text-primary" />
                  Info Properti Utama
                </CardTitle>
                <CardDescription>
                  Beri tahu kami tentang properti pertama yang akan Anda kelola.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nama Properti</label>
                  <Input 
                    placeholder="Contoh: Kost Mentari" 
                    value={propertyData.name}
                    onChange={(e) => setPropertyData({...propertyData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Alamat Lengkap</label>
                  <Input 
                    placeholder="Jl. Merdeka No. 123" 
                    value={propertyData.address}
                    onChange={(e) => setPropertyData({...propertyData, address: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kota</label>
                  <Input 
                    placeholder="Jakarta Selatan" 
                    value={propertyData.city}
                    onChange={(e) => setPropertyData({...propertyData, city: e.target.value})}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto" onClick={nextStep} disabled={!propertyData.name}>
                  Lanjut
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </CardFooter>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  Pilih Paket Anda
                </CardTitle>
                <CardDescription>
                  KostOS memberikan paket GRATIS selamanya untuk pemilik kost kecil.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 border-2 border-primary bg-primary/5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-[10px] px-2 py-1 rounded font-bold">
                    AKTIF
                  </div>
                  <h3 className="text-xl font-bold mb-1">KostOS FREE</h3>
                  <div className="text-3xl font-bold mb-4">Rp 0 <span className="text-sm font-normal text-muted-foreground">/ selamanya</span></div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-success" />
                      Maksimal 5 Kamar
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-success" />
                      1 Properti
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-success" />
                      Manajemen Tenant & Kamar
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-success" />
                      Laporan Dasar
                    </li>
                  </ul>
                </div>
                <p className="mt-4 text-xs text-center text-muted-foreground italic">
                  Butuh lebih banyak kamar? Anda bisa upgrade nanti di menu Settings.
                </p>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="ghost" onClick={prevStep}>Kembali</Button>
                <Button onClick={nextStep}>
                  Pilih Paket
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </CardFooter>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center text-success">
                    <Sparkles className="w-8 h-8" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Semua Siap!</CardTitle>
                <CardDescription>
                  Akun Anda sudah dikonfigurasi. Mari mulai kelola <strong>{propertyData.name}</strong> Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <p className="text-sm text-muted-foreground">
                  Anda akan diarahkan ke dashboard utama KostOS. Anda bisa menambahkan data kamar dan tenant mulai dari sana.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full py-6 text-lg" onClick={handleComplete} disabled={loading}>
                  {loading ? "Menyiapkan Akun..." : "Masuk ke Dashboard"}
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
