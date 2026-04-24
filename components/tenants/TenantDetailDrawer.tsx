"use client";

import { Tenant } from "@/types";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Phone, 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Home,
  Download,
  X
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";

interface TenantDetailDrawerProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TenantDetailDrawer({
  tenant,
  isOpen,
  onClose,
}: TenantDetailDrawerProps) {
  if (!tenant) return null;

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-w-2xl mx-auto">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-2xl font-bold">Detail Penghuni</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </div>
            <DrawerDescription>
              Informasi lengkap mengenai tenant di Kamar {tenant.room?.roomNumber}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
            {/* Header Info */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                {tenant.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{tenant.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Home className="h-3 w-3" /> Kamar {tenant.room?.roomNumber} • {tenant.room?.type}
                </p>
              </div>
            </div>

            <Separator />

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                  <Phone className="h-3 w-3" /> Nomor Telepon
                </p>
                <p className="text-sm font-semibold">{tenant.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                  <CreditCard className="h-3 w-3" /> Nomor Identitas (KTP)
                </p>
                <p className="text-sm font-semibold">{tenant.idNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                  <Calendar className="h-3 w-3" /> Tanggal Masuk
                </p>
                <p className="text-sm font-semibold">
                  {format(new Date(tenant.startDate), "dd MMMM yyyy", { locale: id })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                  <DollarSign className="h-3 w-3" /> Biaya Sewa Bulanan
                </p>
                <p className="text-sm font-semibold text-primary">
                  Rp {tenant.monthlyRent.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <Separator />

            {/* ID Photo (KTP) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Foto Identitas (KTP)
                </p>
                {tenant.idPhotoUrl && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs gap-1" 
                    onClick={() => window.open(tenant.idPhotoUrl!, '_blank', 'noopener,noreferrer')}
                  >
                    <Download className="h-3 w-3" /> Lihat Full
                  </Button>
                )}
              </div>
              
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-dashed flex items-center justify-center">
                {tenant.idPhotoUrl ? (
                  <Image
                    src={tenant.idPhotoUrl}
                    alt={`KTP ${tenant.name}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <CreditCard className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-xs text-muted-foreground italic">Foto KTP belum diunggah</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DrawerFooter className="flex-row gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Tutup
            </Button>
            <Button className="flex-1" onClick={() => window.open(`https://wa.me/${tenant.phone.replace(/^0/, '62')}`, '_blank')}>
              Hubungi via WA
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
