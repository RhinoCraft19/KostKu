"use client";

import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LayoutAuthProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showLogo?: boolean;
  footer?: ReactNode;
}

export function LayoutAuth({
  children,
  title,
  description = "KostKu",
  showLogo = true,
  footer,
}: LayoutAuthProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {showLogo && (
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary">KostKu</h1>
            <p className="text-muted-foreground">
              Manajemen Kost Terbaik
            </p>
          </div>
        )}

        <Card>
          {title && (
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          )}
          <CardContent>{children}</CardContent>
        </Card>

        {footer && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}