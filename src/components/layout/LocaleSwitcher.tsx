"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import type { Locale } from "@/types";

const locales: Locale[] = ["es", "en"];

type Props = {
  /** Light styling for use on dark / transparent navbar over hero */
  overDark?: boolean;
};

export function LocaleSwitcher({ overDark = false }: Props) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className={`flex rounded-full border p-0.5 text-xs font-semibold backdrop-blur ${
        overDark
          ? "border-white/30 bg-black/25 text-white shadow-none"
          : "border-earth-200 bg-white/80 shadow-sm"
      }`}
    >
      {locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          className={`rounded-full px-2.5 py-1 transition ${
            locale === loc
              ? overDark
                ? "bg-white text-earth-900"
                : "bg-jungle-600 text-white"
              : overDark
                ? "text-white/85 hover:text-white"
                : "text-earth-600 hover:text-earth-900"
          }`}
          aria-pressed={locale === loc}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
