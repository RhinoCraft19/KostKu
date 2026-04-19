import { useTranslations } from "next-intl";
import { LayoutAdmin } from "@/components/layouts";

export default function AdminMaintenancePage() {
  const t = useTranslations();

  return (
    <LayoutAdmin userName="Admin" userEmail="admin@kostku.id">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("navigation.maintenance")}
        </h1>
        <p className="text-muted-foreground">Handle maintenance requests</p>
      </div>
    </LayoutAdmin>
  );
}