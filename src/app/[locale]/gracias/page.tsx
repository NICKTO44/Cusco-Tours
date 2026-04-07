import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { FadeIn } from "@/components/ui/FadeIn";

type Props = { params: Promise<{ locale: string }> };

export default async function ThanksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("thanks");

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-b from-earth-50 to-earth-100 px-4 py-20">
      <FadeIn>
        <div className="max-w-lg rounded-2xl border border-earth-200 bg-white p-10 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-jungle-100 text-3xl">
            ✓
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-jungle-800">
            {t("title")}
          </h1>
          <p className="mt-4 text-earth-700">{t("body")}</p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-gold-500 px-8 py-3 font-semibold text-earth-900 transition hover:bg-gold-400"
          >
            {t("cta")}
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
