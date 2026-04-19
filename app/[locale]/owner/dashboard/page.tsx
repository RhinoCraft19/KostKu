import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, Users, CreditCard, BarChart3 } from "lucide-react";
import { LayoutOwner } from "@/components/layouts";

export default function OwnerDashboardPage() {
  const t = useTranslations();

  const stats = [
    { icon: Home, title: "Total Kost", value: "0", description: "Properties" },
    { icon: Users, title: t("navigation.tenants"), value: "0", description: "Active" },
    { icon: CreditCard, title: t("navigation.payments"), value: "Rp 0", description: "This month" },
    { icon: BarChart3, title: "Occupancy", value: "0%", description: "Rate" },
  ];

  return (
    <LayoutOwner userName="John Doe" userEmail="john@example.com">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("navigation.dashboard")}
          </h1>
          <p className="text-muted-foreground">Welcome to KostKu</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <CardDescription>{stat.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </LayoutOwner>
  );
}