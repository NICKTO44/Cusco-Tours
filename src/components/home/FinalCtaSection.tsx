"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { whatsappHref } from "@/data/site";

export function FinalCtaSection() {
  const t = useTranslations("sections");
  const tw = useTranslations("whatsapp");
  const href = whatsappHref(tw("welcome"));

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-jungle-700 via-jungle-600 to-earth-900 py-20 text-center text-white md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-gold-500 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-jungle-400 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-2xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl font-bold md:text-4xl"
        >
          {t("finalCta")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="mt-4 text-lg text-earth-100"
        >
          {t("finalCtaDesc")}
        </motion.p>
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="mt-10 inline-flex rounded-full bg-gold-500 px-10 py-4 text-lg font-semibold text-earth-900 shadow-lg"
        >
          WhatsApp
        </motion.a>
      </div>
    </section>
  );
}
