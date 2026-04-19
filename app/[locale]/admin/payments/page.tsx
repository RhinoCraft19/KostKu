import { useTranslations } from "next-intl";
import { LayoutAdmin } from "@/components/layouts";

export default function AdminPaymentsPage() {
  const t = useTranslations();

  return (
    <LayoutAdmin userName="Admin" userEmail="admin@kostku.id">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("navigation.payments")}
        </h1>
        <p className="text-muted-foreground">Manage payments and confirmations</p>
      </div>
    </LayoutAdmin>
  );
}