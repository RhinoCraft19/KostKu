import { useTranslations } from "next-intl";
import { LayoutAdmin } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, CreditCard, Wrench } from "lucide-react";

export default function AdminDashboardPage() {
  const t = useTranslations();

  const stats = [
    { icon: Home, title: "Rooms", value: "0", description: "Total" },
    { icon: Users, title: t("navigation.tenants"), value: "0", description: "Active" },
    { icon: CreditCard, title: "Pending", value: "0", description: "Payments" },
    { icon: Wrench, title: "Requests", value: "0", description: "Open" },
  ];

  return (
    <LayoutAdmin userName="Admin" userEmail="admin@kostku.id">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("navigation.dashboard")}
          </h1>
          <p className="text-muted-foreground">Admin dashboard</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
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
    </LayoutAdmin>
  );
}