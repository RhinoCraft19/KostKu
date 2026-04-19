import { useTranslations } from "next-intl";
import { LayoutAdmin } from "@/components/layouts";

export default function AdminAnnouncementsPage() {
  const t = useTranslations();

  return (
    <LayoutAdmin userName="Admin" userEmail="admin@kostku.id">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("navigation.announcements")}
        </h1>
        <p className="text-muted-foreground">Send announcements to tenants</p>
      </div>
    </LayoutAdmin>
  );
}