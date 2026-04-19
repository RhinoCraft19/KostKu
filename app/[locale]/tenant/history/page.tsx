import { useTranslations } from "next-intl";
import { LayoutTenant } from "@/components/layouts";

export default function TenantHistoryPage() {
  const t = useTranslations();

  return (
    <LayoutTenant userName="Tenant" userEmail="tenant@example.com">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("navigation.history")}
        </h1>
        <p className="text-muted-foreground">View your payment history</p>
      </div>
    </LayoutTenant>
  );
}