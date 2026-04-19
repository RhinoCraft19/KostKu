import { useTranslations } from "next-intl";
import { LayoutAdmin } from "@/components/layouts";

export default function AdminTenantsPage() {
  const t = useTranslations();

  return (
    <LayoutAdmin userName="Admin" userEmail="admin@kostku.id">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("navigation.tenants")}
        </h1>
        <p className="text-muted-foreground">Manage tenants</p>
      </div>
    </LayoutAdmin>
  );
}