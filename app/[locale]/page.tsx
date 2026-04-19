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
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">KostKu</span>
          </div>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <Link href="/login">
              <Button variant="ghost">{t("auth.login")}</Button>
            </Link>
            <Link href="/register">
              <Button>{t("landing.getStarted")}</Button>
            </Link>
          </div>
        </div>
      </header>

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

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-8">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            <span className="font-semibold">KostKu</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2026 KostKu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}