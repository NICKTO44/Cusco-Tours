"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { whatsappHref } from "@/data/site";

type Props = {
  serviceLabel: string;
  className?: string;
};

export function BookingButtons({ serviceLabel, className = "" }: Props) {
  const t = useTranslations("whatsapp");
  const tc = useTranslations("common");
  const reservationMsg = t("reservation", { service: serviceLabel });
  const waUrl = whatsappHref(reservationMsg);

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${className}`}>
      <motion.a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center justify-center rounded-full bg-jungle-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-jungle-600/25 transition hover:bg-jungle-700"
      >
        {tc("bookWhatsapp")}
      </motion.a>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          href="/reservas"
          className="inline-flex w-full items-center justify-center rounded-full border-2 border-gold-500 bg-gold-500/10 px-6 py-3 text-center text-sm font-semibold text-earth-900 transition hover:bg-gold-500/20 sm:w-auto"
        >
          {tc("bookOnline")}
        </Link>
      </motion.div>
    </div>
  );
}
