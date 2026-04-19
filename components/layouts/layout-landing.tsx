"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import { Home } from "lucide-react";

interface LayoutLandingProps {
  children: ReactNode;
  showAuthButtons?: boolean;
}

export function LayoutLanding({ children, showAuthButtons = true }: LayoutLandingProps) {
  const t = useTranslations();

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
            {showAuthButtons && (
              <>
                <Link href="/login">
                  <Button variant="ghost">{t("auth.login")}</Button>
                </Link>
                <Link href="/register">
                  <Button>{t("landing.getStarted")}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

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