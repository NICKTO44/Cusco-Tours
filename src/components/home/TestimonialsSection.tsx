"use client";

import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/ui/FadeIn";

const ids = ["t1", "t2", "t3"] as const;

export function TestimonialsSection() {
  const t = useTranslations("sections");
  const tt = useTranslations("testimonials");

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <h2 className="text-center font-display text-3xl font-bold text-jungle-800 md:text-4xl">
            {t("testimonials")}
          </h2>
        </FadeIn>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {ids.map((id, i) => (
            <FadeIn key={id} delay={i * 0.08}>
              <blockquote className="h-full rounded-2xl border border-earth-200 bg-white p-6 shadow-md">
                <p className="text-earth-700">&ldquo;{tt(`${id}.text`)}&rdquo;</p>
                <footer className="mt-4 text-sm font-semibold text-jungle-700">
                  — {tt(`${id}.name`)}
                </footer>
              </blockquote>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
