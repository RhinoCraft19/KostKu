import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  Crown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch subscription and usage
  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id }
  });

  const tier = subscription?.tier || "FREE";
  
  const roomCount = await prisma.room.count({
    where: { property: { ownerId: user.id } }
  });

  const propertyCount = await prisma.property.count({
    where: { ownerId: user.id }
  });

  // Define limits based on tier
  const tierLimits: Record<string, { rooms: number; properties: number; name: string }> = {
    FREE: { rooms: 5, properties: 1, name: "FREE" },
    PRO: { rooms: 50, properties: 1, name: "PRO" },
    MULTI: { rooms: 999, properties: 999, name: "MULTI" }
  };
  const limits = tierLimits[tier] || { rooms: 5, properties: 1, name: "FREE" };

  const roomProgress = Math.min((roomCount / limits.rooms) * 100, 100);
  
  // WhatsApp Upgrade Link
  const waNumber = "6281234567890"; // Admin Number
  const waText = encodeURIComponent(`Halo Admin KostOS, akun saya dengan email ${user.email} tertarik untuk melakukan upgrade ke paket berlangganan PRO.`);
  const upgradeLink = `https://wa.me/${waNumber}?text=${waText}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Pengaturan & Akun" 
        description="Kelola paket berlangganan, batasan penggunaan, dan profil Anda."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Billing & Subscription Card */}
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-lg">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Paket Langganan
                </CardTitle>
                <CardDescription>Status akun dan penagihan saat ini</CardDescription>
              </div>
              <Badge variant={tier === "FREE" ? "outline" : "default"} className="px-4 py-1 text-sm font-bold">
                {tier}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-8 space-y-8">
            {/* Usage Progress */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Kapasitas Kamar
                  </span>
                  <span className="text-muted-foreground font-bold">{roomCount} / {limits.rooms === 999 ? "∞" : limits.rooms} Kamar</span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000 ease-out" 
                    style={{ width: `${roomProgress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Batas Properti
                  </span>
                  <span className="text-muted-foreground font-bold">{propertyCount} / {limits.properties === 999 ? "∞" : limits.properties} Properti</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-6 rounded-2xl border border-dashed flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h4 className="font-bold flex items-center gap-2 justify-center md:justify-start">
                  <Zap className="w-5 h-5 text-warning fill-warning" />
                  Ingin fitur lebih lengkap?
                </h4>
                <p className="text-sm text-muted-foreground max-w-md">
                  Dapatkan kapasitas hingga 50 kamar, fitur Tiket Keluhan, dan Pengingat WA Otomatis dengan paket PRO.
                </p>
              </div>
              <a href={upgradeLink} target="_blank" rel="noopener noreferrer">
                <Button className="h-12 px-8 rounded-xl shadow-lg shadow-primary/20">
                  Upgrade ke PRO
                  <Crown className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Plan Comparison Sidebar */}
        <div className="space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Detail Tier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border bg-card">
                <h5 className="font-bold text-sm mb-3">Keuntungan Paket {tier}:</h5>
                <ul className="space-y-2">
                  <li className="text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-success" />
                    Manajemen Properti
                  </li>
                  <li className="text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-success" />
                    Dashboard Analytics Dasar
                  </li>
                  {tier !== "FREE" && (
                    <>
                      <li className="text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-success" />
                        Sistem Tiket Keluhan
                      </li>
                      <li className="text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-success" />
                        Midtrans Integration
                      </li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="p-4 rounded-xl border bg-muted/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Tagihan akan otomatis diperbarui setiap bulan. Anda bisa membatalkan langganan kapan saja melalui admin support.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Butuh Bantuan?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90 mb-4">
                Tim support kami siap membantu Anda 24/7 untuk kendala teknis atau pertanyaan seputar billing.
              </p>
              <a 
                href="https://wa.me/6281234567890" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full h-10 px-4 py-2 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                Hubungi Support
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
