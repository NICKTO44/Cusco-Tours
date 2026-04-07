"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { FadeIn } from "@/components/ui/FadeIn";
import {
  MOBILITY_INTRO,
  PRIVATE_ROUTES,
  getMinPriceForRoute,
} from "@/data/mobility";

export function MobilityTeaserSection() {
  const t = useTranslations("mobility");
  const ts = useTranslations("sections");
  const locale = useLocale();
  const preview = PRIVATE_ROUTES.slice(0, 3);
  const intro = locale === "en" ? MOBILITY_INTRO.en : MOBILITY_INTRO.es;

  return (
    <section className="pt-4 pb-16 md:pt-6 md:pb-24">
      <div className="mx-auto max-w-6xl px-4">

        {/* IMAGEN FLOTA */}
        <FadeIn>
          <div className="relative mb-12 overflow-hidden rounded-2xl">
            <img
              src="/cars.jpg"
              alt="Flota de vehículos Mascca Tours"
              className="h-56 w-full object-cover object-center md:h-72"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </FadeIn>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <FadeIn>
            <span className="inline-block rounded-full bg-jungle-600/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-jungle-700">
              {t("badge")}
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-jungle-800 md:text-4xl">
              {ts("privateMobility")}
            </h2>
            <p className="mt-3 text-earth-700">{ts("privateMobilityDesc")}</p>
            <p className="mt-4 text-sm leading-relaxed text-earth-600">{intro}</p>
            <Link
              href="/movilidad-privada"
              className="mt-8 inline-flex rounded-full bg-jungle-600 px-8 py-3 font-semibold text-white shadow-lg shadow-jungle-600/25 transition hover:bg-jungle-700"
            >
              {t("title")}
            </Link>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="rounded-2xl border border-earth-200 bg-white p-6 shadow-lg">
              <h3 className="font-display text-lg font-semibold text-earth-900">
                {t("routesTitle")}
              </h3>
              <ul className="mt-4 space-y-4">
                {preview.map((r) => {
                  const min = getMinPriceForRoute(r.id);
                  return (
                    <li
                      key={r.id}
                      className="flex items-center justify-between border-b border-earth-100 pb-3 last:border-0"
                    >
                      <span className="text-sm font-medium text-earth-800">
                        {t(`routes.${r.id}.name`)}
                      </span>
                      <span className="text-sm font-bold text-gold-600">
                        {min != null ? t("fromUsd", { amount: min }) : "—"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}