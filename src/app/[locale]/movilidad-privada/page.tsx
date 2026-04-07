export const revalidate = 60

import { setRequestLocale } from "next-intl/server";
import { getLocale, getTranslations } from "next-intl/server";
import {
  MOBILITY_INTRO,
  PRIVATE_ROUTES,
  VEHICLES,
  getMinPriceForRoute,
} from "@/data/mobility";
import { getMobilityRoutes } from "@/lib/queries";
import { BookingButtons } from "@/components/booking/BookingButtons";
import { FadeIn } from "@/components/ui/FadeIn";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const base = "https://cuscomasccatour.com";
  const isEs = locale === "es";
  return {
    title: isEs ? "Taxi VIP y Movilidad Privada en Cusco | Mascca Tours" : "VIP Taxi & Private Transfer Cusco | Mascca Tours",
    description: isEs
      ? "Servicio de taxi VIP y movilidad privada en Cusco: aeropuerto, Valle Sagrado, Ollantaytambo y más. Flota propia, 24/7, sin cargos ocultos."
      : "VIP taxi and private transfers in Cusco: airport, Sacred Valley, Ollantaytambo and more. Own fleet, 24/7, no hidden fees.",
    alternates: { canonical: `${base}/${locale}/movilidad-privada` },
  };
}
export default async function MobilityPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("mobility");
  const activeLocale = await getLocale();
  const intro = activeLocale === "en" ? MOBILITY_INTRO.en : MOBILITY_INTRO.es;

  const sanityRoutes = await getMobilityRoutes();
  const useSanity = sanityRoutes && sanityRoutes.length > 0;

  return (
    <div className="bg-earth-50 py-14 md:py-20">
      <div className="mx-auto max-w-4xl px-4">
        <FadeIn>
          <span className="inline-block rounded-full bg-jungle-600/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-jungle-700">
            {t("badge")}
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold text-jungle-800 md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-earth-700">{intro}</p>
        </FadeIn>

     {/* FLOTA DE VEHÍCULOS */}
<div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
  {[
    { src: "/auto1.jpg", label: "Geely", pax: "6 pax" },
    { src: "/auto2.jpg", label: "Staria", pax: "10 pax" },
    { src: "/auto3.jpg", label: "Renault", pax: "15 pax" },
    { src: "/auto4.webp", label: "Sprinter", pax: "20 pax" },
  ].map((v) => (
    <div key={v.label} className="flex flex-col items-center rounded-2xl border border-earth-200 bg-white p-4 shadow-sm">
      <img
        src={v.src}
        alt={v.label}
        className="h-28 w-full object-contain"
      />
      <p className="mt-3 font-display font-semibold text-earth-900">{v.label}</p>
      <p className="text-xs text-earth-500">{v.pax}</p>
    </div>
  ))}
</div>

        <div className="mt-12 space-y-6">
          {useSanity
            ? sanityRoutes.map((route: any, i: number) => {
                const prices = [
                  route.priceGeely,
                  route.priceStaria,
                  route.priceRenault,
                  route.priceSprinter,
                ].filter(Boolean);
                const min = prices.length > 0 ? Math.min(...prices) : null;
                const name = activeLocale === "en"
                  ? (route.nameEn || route.nameEs)
                  : route.nameEs;
                const desc = activeLocale === "en"
                  ? (route.descEn || route.descEs)
                  : route.descEs;

                return (
                  <FadeIn key={route.routeId} delay={i * 0.05}>
                    <div className="rounded-2xl border border-earth-200 bg-white p-6 shadow-md">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="font-display text-xl font-semibold text-earth-900">
                            {name}
                          </h2>
                          {desc && (
                            <p className="mt-2 text-earth-600">{desc}</p>
                          )}
                        </div>
                        <p className="shrink-0 text-lg font-bold text-gold-600">
                          {min != null ? t("fromUsd", { amount: min }) : "—"}
                        </p>
                      </div>
                      <div className="mt-6 overflow-x-auto rounded-xl border border-earth-100 bg-earth-50/80">
                        <table className="w-full min-w-[520px] text-sm">
                          <thead>
                            <tr className="border-b border-earth-200 text-left text-earth-600">
                              <th className="px-3 py-2 font-semibold">{t("vehicleColumn")}</th>
                              <th className="px-3 py-2 font-semibold">Geely (6 pax)</th>
                              <th className="px-3 py-2 font-semibold">Staria (10 pax)</th>
                              <th className="px-3 py-2 font-semibold">Renault (15 pax)</th>
                              <th className="px-3 py-2 font-semibold">Sprinter (19 pax)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-3 py-2 text-earth-500">{t("priceUsd")}</td>
                              <td className="px-3 py-2 font-semibold text-earth-900">${route.priceGeely ?? "—"}</td>
                              <td className="px-3 py-2 font-semibold text-earth-900">${route.priceStaria ?? "—"}</td>
                              <td className="px-3 py-2 font-semibold text-earth-900">${route.priceRenault ?? "—"}</td>
                              <td className="px-3 py-2 font-semibold text-earth-900">${route.priceSprinter ?? "—"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-6 border-t border-earth-100 pt-6">
                        <BookingButtons serviceLabel={name} />
                      </div>
                    </div>
                  </FadeIn>
                );
              })
            : PRIVATE_ROUTES.map((route, i) => {
                const min = getMinPriceForRoute(route.id);
                return (
                  <FadeIn key={route.id} delay={i * 0.05}>
                    <div className="rounded-2xl border border-earth-200 bg-white p-6 shadow-md">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="font-display text-xl font-semibold text-earth-900">
                            {t(`routes.${route.id}.name`)}
                          </h2>
                          <p className="mt-2 text-earth-600">
                            {t(`routes.${route.id}.desc`)}
                          </p>
                        </div>
                        <p className="shrink-0 text-lg font-bold text-gold-600">
                          {min != null ? t("fromUsd", { amount: min }) : "—"}
                        </p>
                      </div>
                      <div className="mt-6 overflow-x-auto rounded-xl border border-earth-100 bg-earth-50/80">
                        <table className="w-full min-w-[520px] text-sm">
                          <thead>
                            <tr className="border-b border-earth-200 text-left text-earth-600">
                              <th className="px-3 py-2 font-semibold">{t("vehicleColumn")}</th>
                              {VEHICLES.map((v) => (
                                <th key={v.id} className="px-3 py-2 font-semibold">
                                  {t(`vehicles.${v.id}.short`)}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-3 py-2 text-earth-500">{t("priceUsd")}</td>
                              {VEHICLES.map((v) => (
                                <td key={v.id} className="px-3 py-2 font-semibold text-earth-900">
                                  ${route.pricesUsd[v.id] ?? "—"}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-6 border-t border-earth-100 pt-6">
                        <BookingButtons serviceLabel={t(`routes.${route.id}.name`)} />
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
        </div>
      </div>
    </div>
  );
}