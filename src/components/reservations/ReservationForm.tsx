"use client";

import { TOURS } from "@/data/tours";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Turnstile } from "@marsidev/react-turnstile";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PRIVATE_ROUTES, VEHICLES, getMobilityPrice } from "@/data/mobility";
import { getTourTotalUsd } from "@/lib/pricing";
import type { WizardReservationValues } from "@/types";
import { SITE, whatsappHref } from "@/data/site";
import { useRouter } from "@/i18n/routing";

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const TOTAL_STEPS = 3;

const defaultValues: WizardReservationValues = {
  serviceType: "",
  fullName: "",
  email: "",
  phone: "",
  tourSlug: "",
  tourDate: "",
  adults: 2,
  children: 0,
  hotelPickup: "",
  pickupTimeApprox: "",
  tourNotes: "",
  routeId: "",
  vehicleId: VEHICLES[0]?.id ?? "geely-shaniao",
  mobilityDateTime: "",
  pickupPoint: "",
  destinationPoint: "",
  passengers: 1,
  luggage: 0,
  mobilityNotes: "",
};

function getSanityRoutePrice(route: any, vehicleId: string): number | null {
  if (!route) return null;
  if (vehicleId === "geely-shaniao") return route.priceGeely ?? null;
  if (vehicleId === "staria-sbc") return route.priceStaria ?? null;
  if (vehicleId === "renault-master") return route.priceRenault ?? null;
  if (vehicleId === "sprinter") return route.priceSprinter ?? null;
  return null;
}

type Props = {
  sanityTours?: any[];
  sanityRoutes?: any[] | null;
  locale?: string;
};

export function ReservationForm({ sanityTours, sanityRoutes, locale }: Props) {
  const t = useTranslations("reservations");
  const tt = useTranslations("tours");
  const tm = useTranslations("mobility");
  const tp = useTranslations("paypal");
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<WizardReservationValues>({
    mode: "onChange",
    defaultValues,
  });

  const serviceType = watch("serviceType");
  const tourSlug = watch("tourSlug");
  const tourDate = watch("tourDate");
  const adults = watch("adults");
  const children = watch("children");
  const hotelPickup = watch("hotelPickup");
  const pickupTimeApprox = watch("pickupTimeApprox");
  const tourNotes = watch("tourNotes");
  const routeId = watch("routeId");
  const vehicleId = watch("vehicleId");
  const mobilityDateTime = watch("mobilityDateTime");
  const pickupPoint = watch("pickupPoint");
  const destinationPoint = watch("destinationPoint");
  const passengers = watch("passengers");
  const luggage = watch("luggage");
  const mobilityNotes = watch("mobilityNotes");
  const fullName = watch("fullName");
  const email = watch("email");
  const phone = watch("phone");

  const selectedSanityRoute = sanityRoutes?.find(
    (r: any) => r.nameEs === routeId
  ) ?? null;

  const estimatedUsd = useMemo(() => {
    if (serviceType === "tour" && tourSlug) {
      const sanityTour = sanityTours?.find((t: any) => t.slug === tourSlug);
      const price = sanityTour?.priceUsd;
      return getTourTotalUsd(tourSlug, adults ?? 0, children ?? 0, price);
    }
    if (serviceType === "mobility" && routeId && vehicleId) {
      const sanityRoute = sanityRoutes?.find((r: any) => r.nameEs === routeId);
      if (sanityRoute) return getSanityRoutePrice(sanityRoute, vehicleId);
      return getMobilityPrice(routeId, vehicleId);
    }
    return null;
  }, [serviceType, tourSlug, adults, children, routeId, vehicleId, sanityTours, sanityRoutes]);

  const paypalAmount =
    estimatedUsd != null && estimatedUsd > 0
      ? estimatedUsd.toFixed(2)
      : "50.00";

  const selectedTour = sanityTours?.find((t: any) => t.slug === tourSlug);
  const tourName = selectedTour?.name ?? (tourSlug ? (() => { try { return tt(`items.${tourSlug}.name`); } catch { return tourSlug; } })() : "");
  const routeName = selectedSanityRoute?.nameEs ?? (routeId ? (() => { try { return tm(`routes.${routeId}.name`); } catch { return routeId; } })() : "");
  const vehicleName = vehicleId ? (() => { try { return tm(`vehicles.${vehicleId}.name`); } catch { return vehicleId; } })() : "";

  const paypalDescription =
    serviceType === "tour"
      ? `Mascca — Tour ${tourName} — ${fullName || ""}`.slice(0, 120)
      : `Mascca — ${routeName} — ${vehicleName} — ${fullName || ""}`.slice(0, 120);

  const step3Valid =
    !!fullName?.trim() &&
    !!email?.trim() &&
    !!phone?.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const canPay =
    step3Valid &&
    estimatedUsd != null &&
    estimatedUsd > 0 &&
    (turnstileSiteKey ? !!turnstileToken : true) &&
    !!paypalClientId;

  const goNext = async () => {
    if (step === 0) {
      const ok = await trigger("serviceType");
      if (ok) setStep(1);
      return;
    }
    if (step === 1) {
      if (serviceType === "tour") {
        const ok = await trigger(["tourSlug", "tourDate", "adults", "children", "hotelPickup", "pickupTimeApprox"]);
        if (ok) setStep(2);
        return;
      }
      if (serviceType === "mobility") {
        const ok = await trigger(["routeId", "vehicleId", "mobilityDateTime", "pickupPoint", "destinationPoint", "passengers", "luggage"]);
        if (ok) setStep(2);
      }
    }
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const sendEmail = async (values: WizardReservationValues, serviceName: string, totalUsd: number | null, paidWithPaypal = false) => {
    try {
      const people = values.serviceType === "tour"
        ? `${values.adults} adultos, ${values.children} niños`
        : `${values.passengers} pasajeros`;
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: values.fullName,
          clientEmail: values.email,
          clientPhone: values.phone,
          serviceType: values.serviceType,
          serviceName,
          date: values.tourDate || values.mobilityDateTime || null,
          people,
          hotel: values.hotelPickup || null,
          pickupTime: values.pickupTimeApprox || null,
          totalUsd,
          notes: values.tourNotes || values.mobilityNotes || null,
          paidWithPaypal,
        }),
      });
    } catch (e) {
      console.error("Email error:", e);
    }
  };

  const openWhatsApp = handleSubmit(async (values) => {
    const lines: string[] = [
      `*${SITE.name}*`,
      `${t("fullName")}: ${values.fullName}`,
      `${t("email")}: ${values.email}`,
      `${t("phone")}: ${values.phone}`,
      "",
    ];
    let serviceName = "";
    let totalUsd: number | null = null;
    if (values.serviceType === "tour") {
      const sanityTour = sanityTours?.find((t: any) => t.slug === values.tourSlug);
      const name = sanityTour?.name ?? values.tourSlug;
      const price = sanityTour?.priceUsd;
      const total = getTourTotalUsd(values.tourSlug, values.adults, values.children, price);
      serviceName = name;
      totalUsd = total;
      lines.push(`*Tour*`);
      lines.push(`Tour: ${name}`);
      lines.push(`Fecha: ${values.tourDate || "—"}`);
      lines.push(`Adultos: ${values.adults} · Niños: ${values.children}`);
      lines.push(`Hotel recogida: ${values.hotelPickup || "—"}`);
      lines.push(`Hora aprox: ${values.pickupTimeApprox || "—"}`);
      if (values.tourNotes?.trim()) lines.push(`Notas: ${values.tourNotes}`);
      lines.push(`Total estimado: ${total != null ? `$${total}` : "—"}`);
    } else if (values.serviceType === "mobility") {
      const sanityRoute = sanityRoutes?.find((r: any) => r.nameEs === values.routeId);
      const rName = sanityRoute?.nameEs ?? values.routeId;
      const price = sanityRoute ? getSanityRoutePrice(sanityRoute, values.vehicleId) : getMobilityPrice(values.routeId, values.vehicleId);
      serviceName = rName;
      totalUsd = price;
      lines.push(`*Movilidad Privada*`);
      lines.push(`Ruta: ${rName}`);
      lines.push(`Vehículo: ${values.vehicleId}`);
      lines.push(`Fecha y hora: ${values.mobilityDateTime || "—"}`);
      lines.push(`Punto recogida: ${values.pickupPoint || "—"}`);
      lines.push(`Destino: ${values.destinationPoint || "—"}`);
      lines.push(`Pasajeros: ${values.passengers} · Maletas: ${values.luggage}`);
      if (values.mobilityNotes?.trim()) lines.push(`Notas: ${values.mobilityNotes}`);
      lines.push(`Total estimado: ${price != null ? `$${price}` : "—"}`);
    }
    await sendEmail(values, serviceName, totalUsd, false);
    window.open(whatsappHref(lines.join("\n")), "_blank", "noopener,noreferrer");
    router.push("/gracias");
  });

  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const stepTitle = step === 0 ? t("step1Title") : step === 1 ? t("step2Title") : t("step3Title");

  return (
    <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
      <div className="lg:col-span-3">
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between gap-4 text-sm font-medium text-earth-600">
            <span>{t("stepLabel", { current: step + 1, total: TOTAL_STEPS })}</span>
            <span className="text-jungle-700">{stepTitle}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-earth-200">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-jungle-500 to-gold-500"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        <h2 className="font-display text-2xl font-bold text-jungle-800">
          {t("formTitle")}
        </h2>

        <form className="mt-6" onSubmit={(e) => e.preventDefault()} noValidate>
          <input
            type="hidden"
            {...register("serviceType", {
              validate: (v) => v === "tour" || v === "mobility" ? true : t("errors.selectServiceType"),
            })}
          />

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }} className="grid gap-4 sm:grid-cols-2">
                <button type="button" onClick={() => { setValue("serviceType", "tour", { shouldValidate: true }); setValue("routeId", ""); }}
                  className={`relative overflow-hidden rounded-2xl border-2 p-8 text-left shadow-sm transition-all hover:border-jungle-400 hover:shadow-md ${serviceType === "tour" ? "border-jungle-600 bg-jungle-50/80 ring-2 ring-jungle-500/30" : "border-earth-200 bg-white"}`}>
                  <span className="text-3xl" aria-hidden>🗺️</span>
                  <p className="mt-4 font-display text-xl font-bold text-earth-900">{t("pickTour")}</p>
                  <p className="mt-2 text-sm text-earth-600">{tt("pageDesc")}</p>
                </button>
                <button type="button" onClick={() => { setValue("serviceType", "mobility", { shouldValidate: true }); setValue("tourSlug", ""); }}
                  className={`relative overflow-hidden rounded-2xl border-2 p-8 text-left shadow-sm transition-all hover:border-jungle-400 hover:shadow-md ${serviceType === "mobility" ? "border-jungle-600 bg-jungle-50/80 ring-2 ring-jungle-500/30" : "border-earth-200 bg-white"}`}>
                  <span className="text-3xl" aria-hidden>🚐</span>
                  <p className="mt-4 font-display text-xl font-bold text-earth-900">{t("pickMobility")}</p>
                  <p className="mt-2 text-sm text-earth-600">{tm("title")}</p>
                </button>
                {errors.serviceType && <p className="sm:col-span-2 text-sm text-red-600">{t("errors.selectServiceType")}</p>}
              </motion.div>
            )}

            {step === 1 && serviceType === "tour" && (
              <motion.div key="s1tour" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-earth-800">{t("selectTour")}</label>
                  <select className="mt-1 w-full rounded-lg border border-earth-200 bg-white px-3 py-2.5 outline-none ring-jungle-500/30 focus:ring-2"
                    {...register("tourSlug", { required: t("errors.required") })}>
                    <option value="">{t("selectService")}</option>
                    {(sanityTours ?? TOURS).map((x: any) => (
                      <option key={x.slug} value={x.slug}>
                        {x.name ?? x.slug} — ${x.priceUsd} {tt("pricePerPersonGroup")}
                      </option>
                    ))}
                  </select>
                  {errors.tourSlug && <p className="mt-1 text-sm text-red-600">{errors.tourSlug.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-800">{t("tourDate")}</label>
                  <input type="date" className="mt-1 w-full rounded-lg border border-earth-200 px-3 py-2.5 outline-none ring-jungle-500/30 focus:ring-2"
                    {...register("tourDate", { required: t("errors.required") })} />
                  {errors.tourDate && <p className="mt-1 text-sm text-red-600">{errors.tourDate.message}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-earth-800">{t("adults")}</label>
                    <input type="number" min={1} className="mt-1 w-full rounded-lg border border-earth-200 px-3 py-2.5 outline-none ring-jungle-500/30 focus:ring-2"
                      {...register("adults", { required: t("errors.required"), min: { value: 1, message: t("errors.minAdults") }, valueAsNumber: true })} />
                    {errors.adults && <p className="mt-1 text-sm text-red-600">{errors.adults.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-earth-800">{t("children")}</label>
                    <input type="number" min={0} className="mt-1 w-full rounded-lg border border-earth-200 px-3 py-2.5 outline-none ring-jungle-500/30 focus:ring-2"
                      {...register("children", { min: { value: 0, message: t("errors.required") }, valueAsNumber: true })} />
                    {errors.children && <p className="mt-1 text-sm text-red-600">{errors.children.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-800">{t("hotelPickup")}</label>
                  <input className="mt-1 w-full rounded-lg border border-earth-200 px-3 py-2.5 outline-none ring-jungle-500/30 focus:ring-2"
                    {...register("hotelPickup", { required: t("errors.required") })} />
                  {errors.hotelPickup && <p className="mt-1 text-sm text-red-600">{errors.hotelPickup.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-800">{t("pickupTimeApprox")}</label>
                  <input type="time" className="mt-1 w-full rounded-lg border border-earth-200 px-3 py-2.5 outline-none ring-jungle-500/30 focus:ring-2"
                    {...register("pickupTimeApprox", { required: t("errors.required") })} />
                  {errors.pickupTimeApprox && <p className="mt-1 text-sm text-red-600">{errors.pickupTimeApprox.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-800">{t("tourNotes")}</label>
                  <textarea rows={3} className="mt-1 w-full rounded-lg border border-earth-200 px-3 py-2.5 outline-none ring-jungle-500/30 focus:ring-2" {...register("tourNotes")} />
                </div>
              </motion.div>
            )}

            {step === 1 && serviceType === "mobility" && (
              <motion.div key="s1mob" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-earth-800">{t("selectRoute")}</label>
                  <select className="mt-1 w-full rounded-lg border border-earth-200 bg-white px-3 py-2.5 outline-none ring-jungle-500/30 focus:ring-2"
                    {...register("routeId", { required: t("errors.required") })}>
                    <option value="">{t("selectService")}</option>
                    {sanityRoutes
                      ? sanityRoutes.map((r: any) => (
                          <option key={r.nameEs} value={r.nameEs}>
                            {r.nameEs}
                          </option>
                        ))
                      : PRIVATE_ROUTES.map((r: any) => (
                          <option key={r.id} value={r.id}>
                            {(() => { try { return tm(`routes.${r.id}.name`); } catch { return r.id; } })()}
                          </option>
                        ))}
                  </select>
                  {errors.routeId && <p className="mt-1 text-sm text-red-600">{errors.routeId.message}</p>}
                </div>

                <div>
                  <p className="text-sm font-medium text-earth-800">{t("vehiclePreferred")}</p>
                  <input type="hidden" {...register("vehicleId", { required: t("errors.selectVehicle") })} />
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {VEHICLES.map((v) => {
                      const sanityRoute = sanityRoutes?.find((r: any) => r.nameEs === routeId) ?? null;
                      const price = sanityRoute
                        ? getSanityRoutePrice(sanityRoute, v.id)
                        : (routeId ? getMobilityPrice(routeId, v.id) : null);
                      const selected = vehicleId === v.id;
                      return (
                        <button key={v.id} type="button" onClick={() => setValue("vehicleId", v.id, { shouldValidate: true })}
                          className={`overflow-hidden rounded-xl border-2 text-left transition-all hover:shadow-md ${selected ? "border-jungle-600 ring-2 ring-jungle-500/25" : "border-earth-200"}`}>
                          <div className="relative aspect-[16/10] w-full bg-earth-100">
                            <Image src={v.image} alt={v.id} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                          </div>
                          <div className="p-3">
                            <p className="font-semibold text-earth-900">{(() => { try { return tm(`vehicles.${v.id}.name`); } catch { return v.id; } })()}</p>
                            <p className="mt-1 text-xs text-earth-600">{v.passengers} pax · {v.luggage} maletas</p>
                            <p className="mt-2 text-sm font-bold text-gold-600">{price != null ? `$${price} USD` : "—"}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.vehicleId && <p className="mt-1 text-sm text-red-600">{errors.vehicleId.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-800">{t("mobilityDateTime")}</label>
                  <input type="datetime-local" className="mt-1 w-full rounded-lg border border-earth-200 px-3 py-2.5 outline-none ring-jungle-500/30 focus:ring-2"
                    {...register("mobilityDateTime", { required: t("errors.required") })} />
                  {errors.mobilityDateTime && <p className="mt-1 text-sm text-red-600">{errors.mobilityDateTime.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-800">{t("pickupPoint")}</label>
                  <input className="mt-1 w-full rounded-lg border border-earth-200 px-3 py-2.5 outline-none ring-jungle-500/30 focus:ring-2"
                    {...register("pickupPoint", { required: t("errors.required") })} />
                  {errors.pickupPoint && <p className="mt-1 text-sm text-red-600">{errors.pickupPoint.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-800">{t("destinationPoint")}</label>
                  <input className="mt-1 w-full rounded-lg border border-earth-200 px-3 py-2.5 outline-none ring-jungle-500/30 focus:ring-2"
                    {...register("destinationPoint", { required: t("errors.required") })} />
                  {errors.destinationPoint && <p className="mt-1 text-sm text-red-600">{errors.destinationPoint.message}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-earth-800">{t("passengers")}</label>
                    <input type="number" min={1} className="mt-1 w-full rounded-lg border border-earth-200 px-3 py-2.5 outline-none ring-jungle-500/30 focus:ring-2"
                      {...register("passengers", { required: t("errors.required"), min: { value: 1, message: t("errors.minPassengers") }, valueAsNumber: true })} />
                    {errors.passengers && <p className="mt-1 text-sm text-red-600">{errors.passengers.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-earth-800">{t("luggage")}</label>
                    <input type="number" min={0} className="mt-1 w-full rounded-lg border border-earth-200 px-3 py-2.5 outline-none ring-jungle-500/30 focus:ring-2"
                      {...register("luggage", { min: { value: 0, message: t("errors.required") }, valueAsNumber: true })} />
                    {errors.luggage && <p className="mt-1 text-sm text-red-600">{errors.luggage.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-800">{t("mobilityNotes")}</label>
                  <textarea rows={3} className="mt-1 w-full rounded-lg border border-earth-200 px-3 py-2.5 outline-none ring-jungle-500/30 focus:ring-2" {...register("mobilityNotes")} />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-earth-800">{t("fullName")}</label>
                  <input className="mt-1 w-full rounded-lg border border-earth-200 px-3 py-2.5 outline-none ring-jungle-500/30 focus:ring-2"
                    {...register("fullName", { required: t("errors.required") })} />
                  {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-800">{t("email")}</label>
                  <input type="email" className="mt-1 w-full rounded-lg border border-earth-200 px-3 py-2.5 outline-none ring-jungle-500/30 focus:ring-2"
                    {...register("email", { required: t("errors.required"), pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t("errors.email") } })} />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-800">{t("phone")}</label>
                  <input className="mt-1 w-full rounded-lg border border-earth-200 px-3 py-2.5 outline-none ring-jungle-500/30 focus:ring-2"
                    {...register("phone", { required: t("errors.required") })} />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                </div>
                {turnstileSiteKey ? (
                  <div>
                    <p className="mb-2 text-sm font-medium text-earth-800">{t("turnstile")}</p>
                    <Turnstile siteKey={turnstileSiteKey} onSuccess={setTurnstileToken} onExpire={() => setTurnstileToken(null)} />
                  </div>
                ) : null}
                <p className="text-xs text-earth-500">{t("successRedirect")}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {step > 0 && (
              <button type="button" onClick={goBack} className="rounded-full border-2 border-earth-300 px-6 py-2.5 text-sm font-semibold text-earth-800 transition hover:bg-earth-100">
                {t("back")}
              </button>
            )}
            {step < 2 && (
              <button type="button" onClick={goNext} className="rounded-full bg-jungle-600 px-8 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-jungle-700">
                {t("next")}
              </button>
            )}
          </div>
        </form>
      </div>

      <aside className="lg:col-span-2">
        <motion.div layout className="sticky top-24 rounded-2xl border border-earth-200 bg-gradient-to-b from-earth-50 to-white p-6 shadow-inner">
          <h3 className="font-display text-lg font-semibold text-jungle-800">{t("summary")}</h3>
          <ul className="mt-4 space-y-2 text-sm text-earth-700">
            {serviceType === "tour" && (
              <>
                <li><span className="font-medium text-earth-900">{t("selectTour")}: </span>{tourName || "—"}</li>
                <li><span className="font-medium text-earth-900">{t("tourDate")}: </span>{tourDate || "—"}</li>
                <li>{t("adults")}: {adults ?? 0} · {t("children")}: {children ?? 0}</li>
                <li>{t("hotelPickup")}: {hotelPickup || "—"}</li>
                <li>{t("pickupTimeApprox")}: {pickupTimeApprox || "—"}</li>
                {tourNotes?.trim() ? <li>{t("tourNotes")}: {tourNotes}</li> : null}
              </>
            )}
            {serviceType === "mobility" && (
              <>
                <li><span className="font-medium text-earth-900">{t("selectRoute")}: </span>{routeName || "—"}</li>
                <li><span className="font-medium text-earth-900">{t("vehiclePreferred")}: </span>{vehicleName || "—"}</li>
                <li>{t("mobilityDateTime")}: {mobilityDateTime || "—"}</li>
                <li>{t("pickupPoint")}: {pickupPoint || "—"}</li>
                <li>{t("destinationPoint")}: {destinationPoint || "—"}</li>
                <li>{t("passengers")}: {passengers ?? 0} · {t("luggage")}: {luggage ?? 0}</li>
                {mobilityNotes?.trim() ? <li>{t("mobilityNotes")}: {mobilityNotes}</li> : null}
              </>
            )}
            {!serviceType && <li className="text-earth-500">{t("errors.selectServiceType")}</li>}
          </ul>

          <div className="mt-6 border-t border-earth-200 pt-6">
            <p className="text-xs text-earth-500">{t("perGroupNote")}</p>
            <p className="mt-2 font-display text-2xl font-bold text-gold-600">
              {estimatedUsd != null ? `$${estimatedUsd}` : "—"}{" "}
              <span className="text-sm font-normal text-earth-600">USD</span>
            </p>
            <p className="mt-1 text-xs text-earth-500">{t("paypalHint")}</p>
          </div>

          <div className="mt-8 space-y-4">
            <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openWhatsApp} disabled={!step3Valid}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-sm font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50">
              <span aria-hidden>💬</span>
              {t("whatsapp")}
            </motion.button>

            {!paypalClientId ? (
              <p className="text-sm text-earth-600">{tp("disabled")}</p>
            ) : step < 2 ? (
              <p className="text-sm text-earth-500">{t("stepLabel", { current: step + 1, total: TOTAL_STEPS })}</p>
            ) : !step3Valid ? (
              <p className="text-sm text-amber-800">{t("errors.required")}</p>
            ) : turnstileSiteKey && !turnstileToken ? (
              <p className="text-sm text-amber-800">{t("errors.turnstile")}</p>
            ) : estimatedUsd == null || estimatedUsd <= 0 ? (
              <p className="text-sm text-amber-800">{t("errors.required")}</p>
            ) : (
              <div className="min-h-[120px]">
                <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "USD", intent: "capture" }}>
                  <PayPalButtons
                    style={{ layout: "vertical", shape: "rect", label: "pay" }}
                    disabled={!canPay}
                    forceReRender={[paypalAmount, paypalDescription, canPay]}
                    createOrder={(_, actions) => actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [{ description: paypalDescription, amount: { currency_code: "USD", value: paypalAmount } }],
                    })}
                    onApprove={(data, actions) =>
                      actions.order!.capture().then(async () => {
                        const values: WizardReservationValues = {
                          fullName, email, phone, serviceType, tourSlug, tourDate,
                          adults, children, hotelPickup, pickupTimeApprox, tourNotes,
                          routeId, vehicleId, mobilityDateTime, pickupPoint,
                          destinationPoint, passengers, luggage, mobilityNotes,
                        };

                        const serviceName = serviceType === "tour" ? tourName : routeName;

                        // 1. Enviar email con paidWithPaypal=true
                        await sendEmail(values, serviceName, estimatedUsd, true);

                        // 2. Reportar venta a Google Analytics
                        if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
                          (window as any).gtag("event", "purchase", {
                            transaction_id: data.orderID,
                            value: estimatedUsd,
                            currency: "USD",
                            items: [{
                              item_id: serviceType === "tour" ? tourSlug : routeId,
                              item_name: serviceName,
                              item_category: serviceType === "tour" ? "Tour" : "Movilidad",
                              price: estimatedUsd,
                              quantity: 1,
                            }],
                          });
                        }

                        // 3. Abrir WhatsApp
                        const lines: string[] = [
                          `*${SITE.name} — Pago confirmado por PayPal ✅*`,
                          `Nombre: ${fullName}`,
                          `Email: ${email}`,
                          `Teléfono: ${phone}`,
                          "",
                        ];
                        if (serviceType === "tour") {
                          lines.push(`*Tour*`);
                          lines.push(`Tour: ${tourName}`);
                          lines.push(`Fecha: ${tourDate || "—"}`);
                          lines.push(`Adultos: ${adults} · Niños: ${children}`);
                          lines.push(`Hotel recogida: ${hotelPickup || "—"}`);
                          lines.push(`Hora aprox: ${pickupTimeApprox || "—"}`);
                          if (tourNotes?.trim()) lines.push(`Notas: ${tourNotes}`);
                        } else {
                          lines.push(`*Movilidad Privada*`);
                          lines.push(`Ruta: ${routeName}`);
                          lines.push(`Vehículo: ${vehicleName}`);
                          lines.push(`Fecha y hora: ${mobilityDateTime || "—"}`);
                          lines.push(`Recogida: ${pickupPoint || "—"}`);
                          lines.push(`Destino: ${destinationPoint || "—"}`);
                          lines.push(`Pasajeros: ${passengers} · Maletas: ${luggage}`);
                          if (mobilityNotes?.trim()) lines.push(`Notas: ${mobilityNotes}`);
                        }
                        lines.push("");
                        lines.push(`💰 Total pagado: $${paypalAmount} USD`);
                        window.open(whatsappHref(lines.join("\n")), "_blank", "noopener,noreferrer");

                        // 4. Redirigir a página de gracias
                        router.push("/gracias");
                      })
                    }
                  />
                </PayPalScriptProvider>
                <p className="mt-2 text-xs text-earth-500">{tp("clientNote")}</p>
              </div>
            )}
          </div>
        </motion.div>
      </aside>
    </div>
  );
}