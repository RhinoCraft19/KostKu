import { useTranslations } from "next-intl";
import { LayoutTenant } from "@/components/layouts";

export default function TenantMaintenancePage() {
  const t = useTranslations();

  return (
    <LayoutTenant userName="Tenant" userEmail="tenant@example.com">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("navigation.maintenance")}
        </h1>
        <p className="text-muted-foreground">Report and track maintenance issues</p>
      </div>
    </LayoutTenant>
  );
}