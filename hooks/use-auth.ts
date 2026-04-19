"use client";

import { useTranslations } from "next-intl";

export function useAuth() {
  const t = useTranslations();
  return { t };
}