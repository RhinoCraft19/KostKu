// app/(dashboard)/rooms/[id]/page.tsx
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RoomStatus, InvoiceStatus } from "@prisma/client";

export async function generateMetadata() {
  return { title: "Detail Kamar | KostOS" };
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch room with property name + active tenant + tenant's recent invoices
  const room = await prisma.room.findFirst({
    where: { id, property: { ownerId: user.id }, deletedAt: null },
    include: {
      property: { select: { name: true } },
      tenants: {
        where: { isActive: true },
        take: 1,
        include: {
          invoices: {
            orderBy: { dueDate: "desc" },
            take: 6,
          },
        },
      },
    },
  });

  if (!room) return notFound();

  // Active tenant is the first in tenants array (if any)
  const activeTenant = room.tenants[0] ?? null;

  const statusColors: Record<RoomStatus, string> = {
    VACANT: "bg-green-100 text-green-700",
    OCCUPIED: "bg-blue-100 text-blue-700",
    MAINTENANCE: "bg-yellow-100 text-yellow-700",
  };

  const formatIDR = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/rooms">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <PageHeader
          title={`Kamar ${room.roomNumber}`}
          description={`Properti: ${room.property.name}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Room Info */}
        <Card>
          <CardHeader>
            <CardTitle>Info Kamar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[room.status]}`}>
                {room.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nomor Kamar</span>
              <span className="font-medium">{room.roomNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Harga Sewa</span>
              <span className="font-medium">{formatIDR(room.price)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Tenant Info */}
        <Card>
          <CardHeader>
            <CardTitle>Tenant Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            {activeTenant ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nama</span>
                  <span className="font-medium">{activeTenant.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">No. HP</span>
                  <span className="font-medium">{activeTenant.phone}</span>
                </div>
                {activeTenant.endDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kontrak Sampai</span>
                    <span className="font-medium">
                      {new Date(activeTenant.endDate).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tanggal Tagihan</span>
                  <span className="font-medium">Setiap tgl {activeTenant.billingDay}</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Kamar sedang kosong.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invoice History */}
      {activeTenant && activeTenant.invoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Tagihan (6 Terakhir)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeTenant.invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 rounded-lg border text-sm"
                >
                  <span>
                    {new Date(invoice.dueDate).toLocaleDateString("id-ID", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="font-medium">{formatIDR(invoice.amount)}</span>
                  <Badge variant={invoice.status === InvoiceStatus.PAID ? "default" : "destructive"}>
                    {invoice.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
