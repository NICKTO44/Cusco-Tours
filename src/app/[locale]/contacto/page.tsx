import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { SITE, whatsappHref } from "@/data/site";
import { FadeIn } from "@/components/ui/FadeIn";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const base = "https://cuscomasccatour.com";
  const isEs = locale === "es";
  return {
    title: isEs ? "Contacto | Mascca Tours Cusco" : "Contact | Mascca Tours Cusco",
    description: isEs
      ? "Contáctanos por WhatsApp o correo para planear tu viaje a Cusco. Respondemos todos los días, incluso fines de semana."
      : "Contact us via WhatsApp or email to plan your Cusco trip. We reply every day, including weekends.",
    alternates: { canonical: `${base}/${locale}/contacto` },
  };
}
export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tw = await getTranslations("whatsapp");
  const waUrl = whatsappHref(tw("welcome"));

  return (
    <div className="bg-earth-50 py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <h1 className="font-display text-4xl font-bold text-jungle-800 md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-earth-700">{t("subtitle")}</p>
        </FadeIn>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <FadeIn delay={0.06}>
            <div className="rounded-2xl border border-earth-200 bg-white p-8 shadow-md">
              <h2 className="font-display text-xl font-semibold text-jungle-800">
                {SITE.name}
              </h2>
              <p className="mt-4 text-earth-700">{t("address")}</p>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-earth-900">{t("phoneLabel")}</dt>
                  <dd className="mt-1">
                    <a
                      href={waUrl}
                      className="text-jungle-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {SITE.whatsappDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-earth-900">{t("emailLabel")}</dt>
                  <dd className="mt-1 text-earth-600">
                    <a
                      href={`mailto:${SITE.email}`}
                      className="text-jungle-600 hover:underline"
                    >
                      {SITE.email}
                    </a>
                  </dd>
                </div>
              </dl>
              <p className="mt-6 text-sm text-earth-500">{t("hours")}</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="overflow-hidden rounded-2xl border border-earth-200 shadow-md">
              <p className="bg-jungle-800 px-4 py-2 text-sm font-medium text-white">
                {t("mapTitle")}
              </p>
              <iframe
  title="Cusco map"
  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1500.0!2d-71.941713!3d-13.532510!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDMxJzU3LjAiUyA3McKwNTYnMzAuMiJX!5e0!3m2!1ses!2spe!4v1"
  width="100%"
  height="360"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  className="min-h-[320px] w-full bg-earth-200"
/>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
