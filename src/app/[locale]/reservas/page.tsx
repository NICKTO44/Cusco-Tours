export const revalidate = 60

import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ReservationForm } from "@/components/reservations/ReservationForm";
import { FadeIn } from "@/components/ui/FadeIn";
import { getTours, getMobilityRoutes } from "@/lib/queries";
import { TOURS } from "@/data/tours";
import { PRIVATE_ROUTES } from "@/data/mobility";
import type { Metadata } from "next";


type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const base = "https://cuscomasccatour.com";
  const isEs = locale === "es";
  return {
    title: isEs ? "Reservas Online | Mascca Tours Cusco" : "Book Online | Mascca Tours Cusco",
    description: isEs
      ? "Reserva tu tour o movilidad privada en Cusco. Paga con PayPal o confirma por WhatsApp. Proceso rápido, seguro y sin cargos ocultos."
      : "Book your Cusco tour or private transfer online. Pay with PayPal or confirm via WhatsApp. Fast, secure, no hidden fees.",
    alternates: { canonical: `${base}/${locale}/reservas` },
  };
}
export default async function ReservationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reservations");

  let tours = await getTours();
  if (!tours || tours.length === 0) tours = TOURS;

  let sanityRoutes = await getMobilityRoutes();

  return (
    <div className="bg-earth-100/40 py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <h1 className="font-display text-4xl font-bold text-jungle-800 md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-earth-700">{t("subtitle")}</p>
        </FadeIn>
        <FadeIn delay={0.06} className="mt-12 rounded-2xl border border-earth-200 bg-white p-6 shadow-lg md:p-10">
          <ReservationForm
            sanityTours={tours}
            sanityRoutes={sanityRoutes?.length > 0 ? sanityRoutes : null}
            locale={locale}
          />
        </FadeIn>
      </div>
    </div>
  );
}
