import { useTranslations } from "next-intl";
import { LayoutOwner } from "@/components/layouts";

export default function OwnerReportsPage() {
  const t = useTranslations();

  return (
    <LayoutOwner userName="John Doe" userEmail="john@example.com">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("navigation.reports")}
        </h1>
        <p className="text-muted-foreground">View financial reports and analytics</p>
        {/* TODO: Reports and analytics */}
      </div>
    </LayoutOwner>
  );
}