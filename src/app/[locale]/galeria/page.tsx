export const revalidate = 60

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { GALLERY_IMAGES } from "@/data/gallery";
import { getGallery } from "@/lib/queries";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const base = "https://cuscomasccatour.com";
  const isEs = locale === "es";
  return {
    title: isEs
      ? "Galería de Fotos — Cusco, Machu Picchu | Mascca Tours"
      : "Photo Gallery — Cusco, Machu Picchu | Mascca Tours",
    description: isEs
      ? "Fotos reales de nuestros tours: Machu Picchu, Montaña de Colores, Valle Sagrado y Cusco. Descubre lo que te espera."
      : "Real photos from our tours: Machu Picchu, Rainbow Mountain, Sacred Valley and Cusco. See what awaits you.",
    alternates: { canonical: `${base}/${locale}/galeria` },
  };
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sanityImages = await getGallery();
  const useSanity = sanityImages && sanityImages.length > 0;

  const images = useSanity
    ? sanityImages.map((img: any) => ({
        src: img.image,
        title: img.title,
        category: img.category,
      }))
    : GALLERY_IMAGES.map((img) => ({ src: img.src }));

  return (
    <div className="min-h-screen bg-earth-50">
      <div className="mx-auto max-w-6xl px-4 pt-4 pb-12">
        <GalleryGrid images={images} />
      </div>
    </div>
  );
}