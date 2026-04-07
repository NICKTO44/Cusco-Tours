import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { FadeIn } from "@/components/ui/FadeIn";

type Props = { params: Promise<{ locale: string }> };

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faqPage");
  const fq = await getTranslations("faq");

  const items = [1, 2, 3, 4].map((n) => ({
    id: `q${n}`,
    question: fq(`q${n}.q`),
    answer: fq(`q${n}.a`),
  }));

  return (
    <div className="bg-earth-50 py-14 md:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <FadeIn>
          <h1 className="font-display text-4xl font-bold text-jungle-800 md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-earth-700">{t("subtitle")}</p>
        </FadeIn>
        <FadeIn delay={0.08} className="mt-12">
          <FaqAccordion items={items} />
        </FadeIn>
      </div>
    </div>
  );
}
