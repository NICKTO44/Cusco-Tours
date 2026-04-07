"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/ui/FadeIn";

const keys = ["fleet", "guides", "support", "value"] as const;

const icons: Record<(typeof keys)[number], ReactNode> = {
  fleet: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
      />
    </svg>
  ),
  guides: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  support: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  value: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

export function WhyUsSection() {
  const t = useTranslations("sections");
  const tw = useTranslations("why");

  return (
    <section className="border-y border-earth-200 bg-white py-6 md:py-10">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <h2 className="text-center font-display text-3xl font-bold text-jungle-800 md:text-4xl">
            {t("whyUs")}
          </h2>
        </FadeIn>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {keys.map((key, i) => (
            <FadeIn key={key} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-earth-100 bg-earth-50/80 p-6 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/20 text-jungle-700">
                  {icons[key]}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-earth-900">
                  {tw(`${key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-earth-600">{tw(`${key}.desc`)}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
