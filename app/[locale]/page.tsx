import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutLanding } from "@/components/layouts";
import {
  Home,
  CreditCard,
  BarChart3,
  Users,
} from "lucide-react";

export default function LandingPage() {
  const t = useTranslations();

  const features = [
    {
      icon: Home,
      title: t("landing.feature1Title"),
      description: t("landing.feature1Desc"),
    },
    {
      icon: CreditCard,
      title: t("landing.feature2Title"),
      description: t("landing.feature2Desc"),
    },
    {
      icon: BarChart3,
      title: t("landing.feature3Title"),
      description: t("landing.feature3Desc"),
    },
    {
      icon: Users,
      title: t("landing.feature4Title"),
      description: t("landing.feature4Desc"),
    },
  ];

  return (
    <LayoutLanding>
      {/* Hero */}
      <section className="container flex flex-col items-center justify-center gap-8 px-4 py-24 text-center md:px-8 md:py-32">
        <Badge variant="secondary" className="px-4 py-1.5 text-sm">
          Kost Management Platform
        </Badge>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          {t("landing.heroTitle")}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
          {t("landing.heroDescription")}
        </p>
        <div className="flex gap-4">
          <Link href="/register">
            <Button size="lg">{t("landing.getStarted")}</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              {t("auth.login")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container grid gap-6 px-4 pb-24 md:grid-cols-2 md:px-8 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="h-10 w-10 text-primary" />
              <CardTitle className="mt-4">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>
    </LayoutLanding>
  );
}