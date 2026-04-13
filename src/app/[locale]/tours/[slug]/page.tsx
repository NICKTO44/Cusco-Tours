import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { getTourBySlug, getTours } from "@/lib/queries";
import { TOURS } from "@/data/tours";
import { getTourBySlug as getLocalTour } from "@/data/tours";
import { BookingButtons } from "@/components/booking/BookingButtons";
import { FadeIn } from "@/components/ui/FadeIn";
import { GalleryLightbox } from "@/components/tours/GalleryLightbox";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const base = "https://cuscomasccatour.com";

  let tour: any = await getTourBySlug(slug);
  if (!tour) tour = getLocalTour(slug);
  if (!tour) return {};

  const t = await getTranslations("tours");
  const name = tour.name ?? t(`items.${tour.slug}.name`);
  const desc =
    tour.descriptionEn && locale === "en"
      ? tour.descriptionEn
      : tour.description ?? t(`items.${tour.slug}.long`);
  const image =
    tour.image ??
    "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&q=80";

  return {
    title: `${name} | Mascca Tours Cusco`,
    description: desc?.slice(0, 160),
    alternates: { canonical: `${base}/${locale}/tours/${slug}` },
    openGraph: {
      title: `${name} | Mascca Tours Cusco`,
      description: desc?.slice(0, 160),
      images: [{ url: image, width: 1200, height: 630, alt: name }],
    },
  };
}

export async function generateStaticParams() {
  const tours = await getTours();
  const allTours = tours?.length > 0 ? tours : TOURS;
  return allTours.map((t: any) => ({ slug: t.slug }));
}

export default async function TourDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let tour: any = await getTourBySlug(slug);
  const fromSanity = !!tour;

  if (!tour) tour = getLocalTour(slug);
  if (!tour) notFound();

  const t = await getTranslations("tours");

  const name = fromSanity ? tour.name : t(`items.${tour.slug}.name`);

  const longDesc = fromSanity
    ? (locale === "en" ? tour.descriptionEn : tour.description) ?? ""
    : t(`items.${tour.slug}.long`);

  const includes = fromSanity
    ? (tour.includes ?? []).join(", ")
    : t(`items.${tour.slug}.includes`);

  const duration = fromSanity
    ? `${tour.durationHours} ${t("hours", { count: tour.durationHours ?? 0 })}`
    : tour.durationLabelKey === "fullDay"
    ? t("fullDay")
    : t("hours", { count: tour.durationHours ?? 0 });

  const imageUrl =
    tour.image ??
    "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&q=80";

  const gallery: string[] = fromSanity ? (tour.gallery ?? []) : [];

  return (
    <article className="bg-earth-50 pb-20 pt-8 md:pt-12">
      <div className="mx-auto max-w-4xl px-4">

        {/* ── Imagen principal ── */}
        <FadeIn>
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={imageUrl}
              alt={name}
              fill
              priority
              className="object-cover"
              sizes="(max-width:896px) 100vw, 896px"
              quality={90}
            />
            {/*
              Gradiente solo en la parte inferior para leer el texto,
              sin el overlay marrón que cubría toda la imagen.
            */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6">
              <p className="text-sm font-medium text-gold-300">{duration}</p>
              <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
                {name}
              </h1>
              <p className="mt-2 text-xl font-semibold text-gold-400">
                ${tour.priceUsd} USD
              </p>
              <p className="mt-1 text-sm text-gold-200/90">
                {t("pricePerPersonGroup")}
              </p>
            </div>
          </div>
        </FadeIn>

        {/* ── Incluye + Descripción ── */}
        <FadeIn delay={0.08} className="mt-10">
          <h2 className="font-display text-xl font-semibold text-jungle-800">
            {t("includes")}
          </h2>
          <p className="mt-2 text-earth-700">{includes}</p>

          <div className="mt-6 space-y-4">
            {longDesc
              .split("\n")
              .map((line: string) => line.trim())
              .filter((line: string) => line.length > 0)
              .map((line: string, i: number) => (
                <p key={i} className="text-lg leading-relaxed text-earth-800">
                  {line}
                </p>
              ))}
          </div>
        </FadeIn>

        {/* ── Galería con lightbox ── */}
        {gallery.length > 0 && (
          <FadeIn delay={0.14} className="mt-12">
            <h2 className="font-display text-xl font-semibold text-jungle-800">
              Galería
            </h2>
            <GalleryLightbox images={gallery} tourName={name} />
          </FadeIn>
        )}

        {/* ── Botón reservar — siempre al final, posición fija ── */}
        <FadeIn delay={0.2} className="mt-12">
          <BookingButtons serviceLabel={name} />
        </FadeIn>

      </div>
    </article>
  );
}