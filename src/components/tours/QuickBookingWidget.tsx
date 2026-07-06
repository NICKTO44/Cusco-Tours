"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { getTourTotalUsd } from "@/lib/pricing";
import { whatsappHref, SITE } from "@/data/site";

type Props = {
  tourSlug: string;
  tourName: string;
  priceUsd: number;
  locale: string;
};

export function QuickBookingWidget({ tourSlug, tourName, priceUsd, locale }: Props) {
  const t = useTranslations("reservations");
  const tc = useTranslations("common");
  const router = useRouter();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [hotel, setHotel] = useState("");

  const total = useMemo(
    () => getTourTotalUsd(tourSlug, adults, children, priceUsd),
    [tourSlug, adults, children, priceUsd]
  );

  const today = new Date().toISOString().split("T")[0];
  const isEs = locale !== "en";

  const goToCheckout = () => {
    const params = new URLSearchParams({
      tourSlug,
      ...(date ? { date } : {}),
      ...(time ? { time } : {}),
      adults: String(adults),
      children: String(children),
      ...(hotel ? { hotel } : {}),
    });
    router.push(`/reservas?${params.toString()}`);
  };

  const openWhatsApp = () => {
    const lines = [
      `*${SITE.name}*`,
      `Tour: ${tourName}`,
      `${t("tourDate")}: ${date || "—"}`,
      `${t("pickupTimeApprox")}: ${time || "—"}`,
      `${t("adults")}: ${adults} · ${t("children")}: ${children}`,
      `${t("hotelPickup")}: ${hotel || "—"}`,
      `${isEs ? "Total estimado" : "Estimated total"}: ${total != null ? `$${total} USD` : "—"}`,
    ];
    window.open(whatsappHref(lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  const inputClasses =
    "mt-1.5 w-full rounded-xl border border-earth-200 bg-white px-4 py-3 text-sm outline-none ring-jungle-500/30 focus:border-jungle-400 focus:ring-2 transition";
  const labelClasses = "flex items-center gap-1.5 text-sm font-semibold text-earth-800";

  return (
    <div className="bg-white px-5 py-5 space-y-5 border-b border-stone-100">
      <div>
        <label className={labelClasses}>
          <span aria-hidden>📅</span> {t("tourDate")}
        </label>
        <input
          type="date"
          min={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>
          <span aria-hidden>🕐</span> {t("pickupTimeApprox")}
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className={inputClasses}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClasses}>
            <span aria-hidden>👤</span> {t("adults")}
          </label>
          <p className="text-[11px] text-jungle-600 font-medium mt-0.5">12+ años</p>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={adults}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              const n = digits === "" ? 1 : parseInt(digits, 10);
              setAdults(Math.max(1, n));
            }}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>
            <span aria-hidden>🧒</span> {t("children")}
          </label>
          <p className="text-[11px] text-jungle-600 font-medium mt-0.5">2-11 años</p>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={children}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              const n = digits === "" ? 0 : parseInt(digits, 10);
              setChildren(Math.max(0, n));
            }}
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>
          <span aria-hidden>🏨</span> {t("hotelPickup")}
        </label>
        <input
          type="text"
          value={hotel}
          onChange={(e) => setHotel(e.target.value)}
          placeholder={isEs ? "Escriba el nombre de su hotel" : "Enter your hotel name"}
          className={inputClasses}
        />
      </div>

     {/* Caja de total — más discreta */}
     <div className="rounded-lg border border-gold-200 bg-gold-50/60 px-4 py-2.5 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-earth-500">
          {isEs ? "Total a pagar" : "Total to pay"}
        </p>
        <p className="font-display text-lg font-bold text-earth-900">
          ${total ?? 0}
          <span className="ml-1 text-xs font-normal text-earth-500">USD</span>
        </p>
      </div>

      <div className="space-y-1.5 pt-1">
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={goToCheckout}
          className="w-full rounded-lg bg-jungle-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-jungle-700"
        >
          {tc("bookOnline")}
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={openWhatsApp}
          className="w-full rounded-lg border border-jungle-300 bg-white px-5 py-2.5 text-xs font-semibold text-jungle-700 transition hover:bg-jungle-50"
        >
          {tc("bookWhatsapp")}
        </motion.button>
      </div>
    </div>
  );
}