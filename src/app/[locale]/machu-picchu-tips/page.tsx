import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";

const tipKeys = ["tickets", "hydrate", "layers", "cash"] as const;

type Props = { params: Promise<{ locale: string }> };

export default async function TipsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tips");

  return (
    <div className="bg-earth-50 py-14 md:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <FadeIn>
          <h1 className="font-display text-4xl font-bold text-jungle-800 md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-earth-700">{t("subtitle")}</p>
        </FadeIn>
        <ul className="mt-12 space-y-6">
          {tipKeys.map((key, i) => (
            <FadeIn key={key} delay={i * 0.06}>
              <li className="rounded-2xl border border-earth-200 bg-white p-6 shadow-sm">
                <h2 className="font-display text-xl font-semibold text-jungle-800">
                  {t(`items.${key}.title`)}
                </h2>
                <p className="mt-2 text-earth-700">{t(`items.${key}.body`)}</p>
              </li>
            </FadeIn>
          ))}
        </ul>
      </div>
    </div>
  );
}
