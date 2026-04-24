"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/ui/FadeIn";

export function TestimonialsSection() {
  const t = useTranslations("sections");

  useEffect(() => {
    const scriptId = "elfsight-script";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;

      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">

        <FadeIn>
          <h2 className="text-center font-display text-3xl font-bold text-jungle-800 md:text-4xl">
            {t("testimonials")}
          </h2>
        </FadeIn>

        {/* WRAPPER MEJORADO (DISEÑO PRO) */}
        <div className="mt-12 flex justify-center">
          <FadeIn>
            <div className="w-full max-w-3xl rounded-2xl border border-earth-200 bg-white p-4 shadow-md md:p-6">
              
              {/* WIDGET */}
              <div
                className="elfsight-app-621c8c69-f073-433f-aba0-ced738669f41"
                data-elfsight-app-lazy
              />

            </div>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}