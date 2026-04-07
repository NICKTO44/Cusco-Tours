"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { FadeIn } from "@/components/ui/FadeIn";
import { FaqAccordion } from "@/components/faq/FaqAccordion";

export function FaqTeaserSection() {
  const t = useTranslations("sections");
  const fq = useTranslations("faq");

  const items = [1, 2, 3].map((n) => ({
    id: `q${n}`,
    question: fq(`q${n}.q`),
    answer: fq(`q${n}.a`),
  }));

  return (
    <section className="border-t border-earth-200 bg-earth-50 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <FadeIn>
          <h2 className="text-center font-display text-3xl font-bold text-jungle-800 md:text-4xl">
            {t("faq")}
          </h2>
        </FadeIn>
        <FadeIn delay={0.08} className="mt-10">
          <FaqAccordion items={items} />
        </FadeIn>
        <FadeIn className="mt-10 text-center" delay={0.12}>
          <Link
            href="/preguntas-frecuentes"
            className="inline-flex font-semibold text-jungle-700 underline-offset-4 hover:underline"
          >
            {t("viewFaq")}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
