export const revalidate = 60

import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getTours } from "@/lib/queries";
import { TOURS } from "@/data/tours";
import { TourCard } from "@/components/tours/TourCard";
import { FadeIn } from "@/components/ui/FadeIn";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const base = "https://cuscomasccatour.com";
  const isEs = locale === "es";
  return {
    title: isEs ? "Tours en Cusco | Machu Picchu, Valle Sagrado y más" : "Cusco Tours | Machu Picchu, Sacred Valley & More",
    description: isEs
      ? "Explora los mejores tours en Cusco: Machu Picchu, Montaña de Colores, Valle Sagrado, City Tour y más. Guías bilingües y transporte incluido."
      : "Explore the best tours in Cusco: Machu Picchu, Rainbow Mountain, Sacred Valley, City Tour and more. Bilingual guides and transport included.",
    alternates: { canonical: `${base}/${locale}/tours` },
  };
}

export default async function ToursPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tours");

  let tours = await getTours();
  if (!tours || tours.length === 0) {
    tours = TOURS;
  }

  return (
    <div className="bg-earth-50 py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <h1 className="font-display text-4xl font-bold text-jungle-800 md:text-5xl">
            {t("pageTitle")}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-earth-700">{t("pageDesc")}</p>
        </FadeIn>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour: any) => (
            <FadeIn key={tour.slug}>
              <TourCard tour={tour} />
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
