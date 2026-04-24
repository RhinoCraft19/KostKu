"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { UserPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TenantTable } from "@/components/tenants/TenantTable";
import { TenantForm } from "@/components/tenants/TenantForm";
import { TenantDetailDrawer } from "@/components/tenants/TenantDetailDrawer";
import { useTenants } from "@/hooks/useTenants";
import { useAppStore } from "@/store/useAppStore";
import { Tenant } from "@/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

export default function TenantsPage() {
  const activePropertyId = useAppStore((state) => state.activePropertyId);
  const { data: tenants, isLoading } = useTenants(activePropertyId);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const filteredTenants = tenants?.filter((t) => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.room?.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Daftar Tenant" 
        description="Kelola informasi penghuni, masa sewa, dan dokumen identitas."
        action={
          <Button onClick={() => setIsFormOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Tambah Tenant
          </Button>
        }
      />

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Cari nama atau nomor kamar..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredTenants.length > 0 ? (
        <TenantTable 
          tenants={filteredTenants} 
          onViewDetails={setSelectedTenant} 
        />
      ) : (
        <EmptyState
          icon={UserPlus}
          title="Tenant tidak ditemukan"
          description={
            searchQuery 
              ? `Tidak ada hasil untuk pencarian "${searchQuery}".` 
              : "Belum ada tenant yang terdaftar. Mulai dengan mendaftarkan tenant pertama Anda."
          }
          action={!searchQuery ? {
            label: "Daftarkan Tenant",
            onClick: () => setIsFormOpen(true)
          } : undefined}
        />
      )}

      <TenantForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
      />

      <TenantDetailDrawer
        tenant={selectedTenant}
        isOpen={!!selectedTenant}
        onClose={() => setSelectedTenant(null)}
      />
    </div>
  );
}
