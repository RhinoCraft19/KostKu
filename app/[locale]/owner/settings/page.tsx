import { useTranslations } from "next-intl";
import { LayoutOwner } from "@/components/layouts";

export default function OwnerSettingsPage() {
  const t = useTranslations();

  return (
    <LayoutOwner userName="John Doe" userEmail="john@example.com">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("navigation.settings")}
        </h1>
        <p className="text-muted-foreground">Manage your account settings</p>
        {/* TODO: Settings form */}
      </div>
    </LayoutOwner>
  );
}