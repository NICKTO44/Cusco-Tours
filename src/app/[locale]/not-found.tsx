"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function NotFound() {
  const t = useTranslations("metadata");

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="font-display text-4xl font-bold text-jungle-800">404</h1>
      <p className="mt-4 text-earth-600">{t("description")}</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-jungle-600 px-6 py-3 font-semibold text-white hover:bg-jungle-700"
      >
        Home
      </Link>
    </div>
  );
}
