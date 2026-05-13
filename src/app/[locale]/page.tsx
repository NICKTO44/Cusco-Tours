export const revalidate = 60

import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedToursSection } from "@/components/home/FeaturedToursSection";
import { MobilityTeaserSection } from "@/components/home/MobilityTeaserSection";
import { WhyUsSection } from "@/components/home/WhyUsSection";
import { GalleryTeaserSection } from "@/components/home/GalleryTeaserSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FaqTeaserSection } from "@/components/home/FaqTeaserSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { getTours } from "@/lib/queries";
import { TOURS } from "@/data/tours";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const base = "https://cuscomasccatour.com";
  const isEs = locale === "es";
  const canonical = `${base}/${locale}`;

  const titleEs = "Cusco Mascca Tours | Agencia de Tours y Movilidad Privada en Cusco, Perú";
  const titleEn = "Cusco Mascca Tours | Tours & Private Transfer Agency in Cusco, Peru";

  const descEs = "Agencia de tours en Cusco: Machu Picchu, Montaña de Colores, Valle Sagrado, Glaciar Quelccaya y taxi VIP aeropuerto. Guías bilingües, flota propia. Mejor tarifa garantizada. Reservas 24/7.";
  const descEn = "Tour agency in Cusco, Peru: Machu Picchu, Rainbow Mountain, Sacred Valley, Quelccaya Glacier & VIP airport taxi. Bilingual guides, private fleet. Best rates guaranteed. Book 24/7.";

  const keywordsEs = [
    "agencia de viajes Cusco",
    "tours en Cusco Perú",
    "tour Machu Picchu desde Cusco",
    "Montaña de Colores tour Cusco",
    "Valle Sagrado tour",
    "Glaciar Quelccaya tour",
    "taxi aeropuerto Cusco",
    "movilidad privada Cusco",
    "traslado aeropuerto Cusco",
    "tours grupales Cusco",
    "guía turístico Cusco",
    "City Tour Cusco",
    "Mascca Tours",
    "agencia turismo Cusco Peru",
  ];

  const keywordsEn = [
    "Cusco tour agency",
    "tours in Cusco Peru",
    "Machu Picchu tour from Cusco",
    "Rainbow Mountain tour Cusco",
    "Sacred Valley tour",
    "Quelccaya Glacier tour",
    "Cusco airport taxi",
    "private transfer Cusco",
    "airport transfer Cusco Peru",
    "bilingual guide Cusco",
    "Cusco city tour",
    "travel agency Cusco Peru",
    "Mascca Tours Cusco",
    "group tours Cusco",
  ];

  const title = isEs ? titleEs : titleEn;
  const description = isEs ? descEs : descEn;
  const keywords = isEs ? keywordsEs : keywordsEn;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        es: `${base}/es`,
        en: `${base}/en`,
        "x-default": `${base}/es`,
      },
    },
    openGraph: {
      type: "website",
      locale: isEs ? "es_PE" : "en_US",
      alternateLocale: isEs ? "en_US" : "es_PE",
      url: canonical,
      siteName: "Cusco Mascca Tours",
      title,
      description,
      images: [
        {
          url: `${base}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: isEs
            ? "Mascca Tours Cusco — Agencia de tours y movilidad privada"
            : "Mascca Tours Cusco — Tour agency and private transfers",
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

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let tours = await getTours();
  if (!tours || tours.length === 0) tours = TOURS;

  return (
    <>
      <HeroSection />
      <FeaturedToursSection tours={tours} />
      <MobilityTeaserSection />
      <WhyUsSection />
      <GalleryTeaserSection />
      <TestimonialsSection />
      {/* <FaqTeaserSection /> */}
      {/* <FinalCtaSection /> */}
    </>
  );
}