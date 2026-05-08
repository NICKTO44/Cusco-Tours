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

  const QUESTION_IDS = [
    "q1", "q2", "q3",           // logistics
    "q4", "q5", "q6", "q7",    // tours
    "q8", "q9", "q10",          // booking
    "q11", "q12",               // health
    "q13", "q14",               // trust
  ];

  const items = QUESTION_IDS.map((id) => ({
    id,
    category: fq(`${id}.category`),
    question: fq(`${id}.q`),
    answer: fq(`${id}.a`),
  }));

  const categories = [
    { key: "logistics", label: fq("categories.logistics"), icon: "" },
    { key: "tours",     label: fq("categories.tours"),     icon: "" },
    { key: "booking",   label: fq("categories.booking"),   icon: "" },
    { key: "health",    label: fq("categories.health"),    icon: "" },
    { key: "trust",     label: fq("categories.trust"),     icon: "" },
  ];

  // FAQPage schema — generates Google rich results (expandable answers in search)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="bg-earth-50 py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <FadeIn>
            <h1 className="font-display text-4xl font-bold text-jungle-800 md:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg text-earth-700">{t("subtitle")}</p>
          </FadeIn>

          <FadeIn delay={0.08} className="mt-12">
            <FaqAccordion items={items} categories={categories} />
          </FadeIn>

          {/* Bottom CTA — visible after reading all FAQs */}
          <FadeIn delay={0.16}>
            <div className="mt-14 rounded-2xl bg-jungle-800 px-6 py-8 text-center">
              <p className="font-display text-xl font-semibold text-earth-50">
                {t("ctaTitle")}
              </p>
              <p className="mt-2 text-sm text-earth-300">{t("ctaSubtitle")}</p>
              <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <a
                  href="https://wa.me/51927591622"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-jungle-900 transition hover:bg-gold-400"
                >
                  {t("ctaWhatsapp")}
                </a>
                <a
                  href="/reservas"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-earth-100 ring-1 ring-white/20 transition hover:bg-white/20"
                >
                  {t("ctaBook")}
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </>
  );
}