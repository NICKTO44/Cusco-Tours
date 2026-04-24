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
  return {
    title: isEs ? "Cusco Mascca Tours | Tours y Taxi VIP en Cusco, Perú" : "Cusco Mascca Tours | Tours & VIP Taxi in Cusco, Peru",
    description: isEs
      ? "Agencia de tours en Cusco: Machu Picchu, Montaña de Colores, Valle Sagrado y taxi VIP aeropuerto. Mejor tarifa garantizada. Reservas 24/7."
      : "Travel agency in Cusco: Machu Picchu, Rainbow Mountain, Sacred Valley & VIP airport taxi. Best rates guaranteed. Book 24/7.",
    alternates: {
      canonical: locale === "es" ? base : `${base}/en`,
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
      {/* <TestimonialsSection /> */}
      <FaqTeaserSection />
      <FinalCtaSection />
    </>
  );
}