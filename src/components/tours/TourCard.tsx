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

  let includes = "";
  if (tour.includes?.length) {
    includes = tour.includes.join(", ");
  } else if (tour.slug) {
    includes = tour.includesText ?? "";
  }

  const imageUrl = tour.image ?? "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80";

  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-earth-200 bg-white shadow-md shadow-earth-900/5 transition-shadow hover:shadow-xl hover:shadow-jungle-600/10"
    >
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
      <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
        <p className="text-sm text-earth-600">
          <span className="font-medium text-jungle-700">{duration}</span>
          {includes && (
            <>
              <span className="mx-2 text-earth-300">·</span>
              <span>{t("includes")}: {includes}</span>
            </>
          )}
        </p>
        <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/tours/${tour.slug}`}
            className="text-sm font-semibold text-jungle-600 underline-offset-4 hover:underline"
          >
            {t("detail")}
          </Link>
        </div>
        <BookingButtons serviceLabel={name} />
      </div>
    </motion.article>
  );
}
