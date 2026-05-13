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

  const title = isEs
    ? "Tours en Cusco, Perú | Machu Picchu, Montaña de Colores, Valle Sagrado"
    : "Tours in Cusco, Peru | Machu Picchu, Rainbow Mountain, Sacred Valley";

  const description = isEs
    ? "Descubre los mejores tours en Cusco: Machu Picchu, Montaña de Colores, Glaciar Quelccaya, Valle Sagrado y City Tour. Guías bilingües, transporte incluido. Desde $25 USD."
    : "Discover the best tours in Cusco: Machu Picchu, Rainbow Mountain, Quelccaya Glacier, Sacred Valley and City Tour. Bilingual guides, transport included. From $25 USD.";

  const keywords = isEs
    ? [
        "tours en Cusco",
        "tours Cusco Perú",
        "tour Machu Picchu desde Cusco",
        "Montaña de Colores tour",
        "Glaciar Quelccaya tour",
        "Valle Sagrado tour",
        "City Tour Cusco",
        "tours baratos Cusco",
        "agencia tours Cusco",
        "tours con guía bilingüe Cusco",
      ]
    : [
        "tours in Cusco Peru",
        "Cusco tour packages",
        "Machu Picchu day tour from Cusco",
        "Rainbow Mountain tour Cusco",
        "Quelccaya Glacier tour",
        "Sacred Valley tour Cusco",
        "Cusco city tour",
        "budget tours Cusco",
        "bilingual guide tours Cusco",
        "best tours Cusco Peru",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${base}/${locale}/tours`,
      languages: {
        es: `${base}/es/tours`,
        en: `${base}/en/tours`,
        "x-default": `${base}/es/tours`,
      },
    },
    openGraph: {
      type: "website",
      locale: isEs ? "es_PE" : "en_US",
      alternateLocale: isEs ? "en_US" : "es_PE",
      url: `${base}/${locale}/tours`,
      siteName: "Mascca Tours Cusco",
      title,
      description,
      images: [
        {
          url: `${base}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: isEs
            ? "Tours en Cusco Perú — Mascca Tours"
            : "Tours in Cusco Peru — Mascca Tours",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${base}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
    },
  };
}

export default async function ToursPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tours");
  const isEs = locale === "es";
  const base = "https://cuscomasccatour.com";

  let tours = await getTours();
  if (!tours || tours.length === 0) tours = TOURS;

  // Breadcrumb Schema.org — ayuda a Google a mostrar la ruta en resultados
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isEs ? "Inicio" : "Home",
        item: `${base}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isEs ? "Tours en Cusco" : "Tours in Cusco",
        item: `${base}/${locale}/tours`,
      },
    ],
  };

  // ItemList Schema.org — lista de tours para Google
  const toursListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isEs ? "Tours en Cusco, Perú" : "Tours in Cusco, Peru",
    description: isEs
      ? "Lista de tours disponibles en Cusco con Mascca Tours"
      : "List of available tours in Cusco with Mascca Tours",
    numberOfItems: tours.length,
    itemListElement: tours.map((tour: any, i: number) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tour.name,
      url: `${base}/${locale}/tours/${tour.slug}`,
    })),
  };

  return (
    <div className="bg-earth-50 py-14 md:py-20">
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toursListSchema) }}
      />

      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          {/* Eyebrow */}
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-jungle-500">
            {isEs ? "Cusco, Perú" : "Cusco, Peru"}
          </p>
          <h1 className="font-display text-4xl font-bold text-jungle-800 md:text-5xl">
            {isEs ? "Tours en Cusco" : "Tours in Cusco"}
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