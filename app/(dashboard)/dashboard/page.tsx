"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BedDouble, 
  Users, 
  CreditCard, 
  MessageSquare, 
  Plus, 
  ArrowUpRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { useRooms } from "@/hooks/useRooms";
import { useTenants } from "@/hooks/useTenants";
import { usePayments } from "@/hooks/usePayments";
import { useComplaints } from "@/hooks/useComplaints";
import { useAppStore } from "@/store/useAppStore";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function DashboardPage() {
  const activePropertyId = useAppStore((state) => state.activePropertyId);
  
  const { data: rooms, isLoading: isLoadingRooms } = useRooms(activePropertyId);
  const { data: tenants, isLoading: isLoadingTenants } = useTenants(activePropertyId);
  const { data: payments, isLoading: isLoadingPayments } = usePayments(activePropertyId, { month: new Date().getMonth() + 1, year: new Date().getFullYear(), status: "ALL" });
  const { data: complaints, isLoading: isLoadingComplaints } = useComplaints(activePropertyId ?? "", { status: "ALL" });

  const isLoading = isLoadingRooms || isLoadingTenants || isLoadingPayments || isLoadingComplaints;

  // Stats Calculations
  const totalRooms = rooms?.length || 0;
  const occupiedRooms = rooms?.filter(r => r.status === "OCCUPIED").length || 0;
  const vacantRooms = totalRooms - occupiedRooms;
  
  const pendingPayments = payments?.filter(p => p.status === "UNPAID") || [];
  const totalPendingAmount = pendingPayments.reduce((acc, p) => acc + p.amount, 0);
  
  const openComplaints = complaints?.filter(c => c.status === "OPEN").length || 0;

  const stats = [
    { 
      title: "Okupansi Kamar", 
      value: `${occupiedRooms}/${totalRooms}`, 
      description: `${vacantRooms} Kamar Tersedia`,
      icon: BedDouble,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    { 
      title: "Total Tenant", 
      value: tenants?.length || 0, 
      description: "Aktif & Terdaftar",
      icon: Users,
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    { 
      title: "Tagihan Pending", 
      value: `Rp ${totalPendingAmount.toLocaleString("id-ID")}`, 
      description: `${pendingPayments.length} Invoice Belum Lunas`,
      icon: CreditCard,
      color: "text-amber-500",
      bg: "bg-amber-50"
    },
    { 
      title: "Keluhan Baru", 
      value: openComplaints, 
      description: "Perlu Tindakan",
      icon: MessageSquare,
      color: "text-rose-500",
      bg: "bg-rose-50"
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Overview" description="Memuat data statistik..." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <LoadingSkeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Overview" 
        description="Selamat datang kembali! Berikut ringkasan properti Anda hari ini."
        action={
          <Link href="/rooms" className={buttonVariants()}>
            <Plus className="w-4 h-4 mr-2" />
            Kelola Kamar
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aktivitas Terakhir */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Aktivitas Terakhir</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Tenant baru dan keluhan yang masuk.</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5">
              Lihat Semua <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {tenants && tenants.length > 0 ? (
              <div className="space-y-6">
                {tenants.slice(0, 5).map((tenant) => (
                  <div key={tenant.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {tenant.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{tenant.name}</p>
                        <p className="text-xs text-muted-foreground">Check-in Kamar {tenant.room?.roomNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">{format(new Date(tenant.createdAt), "dd MMM", { locale: id })}</p>
                      <p className="text-[10px] text-muted-foreground">Baru Saja</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-medium">Belum ada aktivitas</h4>
                <p className="text-sm text-muted-foreground max-w-xs mt-1">
                  Mulai dengan menambahkan data kamar atau tenant pertama Anda.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifikasi / Alerts */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Tips Okupansi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90 leading-relaxed">
                {vacantRooms > 0 
                  ? `Ada ${vacantRooms} kamar kosong. Bagikan link pendaftaran ke media sosial untuk menarik lebih banyak tenant!`
                  : "Selamat! Kost Anda penuh terisi. Jangan lupa pantau keluhan tenant agar mereka tetap betah."}
              </p>
              <Button variant="secondary" className="w-full mt-4 bg-white/20 hover:bg-white/30 border-none text-white">
                Buat Promo
              </Button>
            </CardContent>
          </Card>

          {openComplaints > 0 && (
            <Card className="border-none shadow-sm border-l-4 border-l-rose-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-rose-500">
                  <AlertCircle className="h-4 w-4" /> Perhatian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ada <strong>{openComplaints} keluhan</strong> tenant yang belum ditangani.
                </p>
                <Link href="/complaints" className={buttonVariants({ variant: "link" }) + " px-0 h-auto text-xs text-rose-500 font-bold uppercase tracking-wider mt-2"}>Selesaikan Sekarang</Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
