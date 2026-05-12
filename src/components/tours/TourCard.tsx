"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { BookingButtons } from "@/components/booking/BookingButtons";

type Props = { tour: any };

export function TourCard({ tour }: Props) {
  const t = useTranslations("tours");

  let name = tour.name;
  if (!name) {
    try { name = t(`items.${tour.slug}.name`); } catch { name = tour.slug; }
  }

  const duration = tour.durationHours
    ? t("hours", { count: tour.durationHours })
    : t("fullDay");

  // Máximo 3 items visibles, el resto se indica con el conteo
  const includesArray: string[] = tour.includes?.length
    ? tour.includes
    : tour.includesText
      ? [tour.includesText]
      : [];

  const MAX_ITEMS = 3;
  const visibleIncludes = includesArray.slice(0, MAX_ITEMS);
  const hiddenCount = includesArray.length - MAX_ITEMS;

  const imageUrl = tour.image ?? "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80";

  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-earth-200 bg-white shadow-md shadow-earth-900/5 transition-shadow hover:shadow-xl hover:shadow-jungle-600/10"
    >
      {/* Imagen — altura fija siempre */}
      <Link href={`/tours/${tour.slug}`} className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-900/60 to-transparent opacity-80" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 text-white">
          <span className="font-display text-lg font-semibold leading-tight md:text-xl">
            {name}
          </span>
          <span className="shrink-0 rounded-full bg-gold-500/95 px-2.5 py-1 text-[10px] font-bold leading-tight text-earth-900 sm:text-xs">
            ${tour.priceUsd} · {t("pricePerPersonGroup")}
          </span>
        </div>
      </Link>

      {/* Contenido — altura fija para uniformidad */}
      <div className="flex flex-col gap-3 p-4 md:p-5" style={{ minHeight: "180px" }}>

        {/* Duración */}
        <p className="text-sm font-medium text-jungle-700">{duration}</p>

        {/* Includes truncados */}
        {visibleIncludes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleIncludes.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-jungle-50 border border-jungle-100 px-2.5 py-0.5 text-[11px] text-jungle-700 leading-tight"
              >
                <svg className="w-3 h-3 shrink-0 text-jungle-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                {/* Truncar texto largo individualmente */}
                <span className="max-w-[140px] truncate">{item}</span>
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-earth-100 px-2.5 py-0.5 text-[11px] text-earth-500 font-medium">
                +{hiddenCount} {t("includes").toLowerCase()}
              </span>
            )}
          </div>
        )}

        {/* Acciones — siempre al fondo */}
        <div className="mt-auto flex flex-col gap-2">
          <Link
            href={`/tours/${tour.slug}`}
            className="text-sm font-semibold text-jungle-600 underline-offset-4 hover:underline"
          >
            {t("detail")}
          </Link>
          <BookingButtons serviceLabel={name} />
        </div>

      </div>
    </motion.article>
  );
}