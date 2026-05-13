"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { whatsappHref } from "@/data/site";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1920&q=80";

export function HeroSection() {
  const t = useTranslations("hero");
  const tw = useTranslations("whatsapp");
  const waUrl = whatsappHref(tw("welcome"));
  const [videoFailed, setVideoFailed] = useState(false);

  const onVideoError = useCallback(() => {
    setVideoFailed(true);
  }, []);

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      aria-label={t("ariaLabel")}
    >
      {!videoFailed && (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={FALLBACK_IMAGE}
          className="absolute inset-0 h-full w-full object-cover"
          onError={onVideoError}
          aria-hidden="true"
          title={t("videoTitle")}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      )}
      {videoFailed && (
        <Image
          src={FALLBACK_IMAGE}
          alt={t("imageAlt")}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">

        {/* Etiqueta pequeña sobre el h1 — señal semántica para Google */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          {t("eyebrow")}
        </p>

        <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl leading-tight">
          {t("title")}
        </h1>
        <p className="mb-2 max-w-2xl text-lg sm:text-xl text-white/90">
          {t("subtitle")}
        </p>
        <p className="mb-8 max-w-xl text-sm text-white/60">
          {t("slogan")}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/tours"
            className="rounded-full bg-yellow-500 px-8 py-3 font-bold text-black transition hover:bg-yellow-400"
            aria-label={t("ctaToursAria")}
          >
            {t("ctaTours")}
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-green-500 px-8 py-3 font-bold text-white transition hover:bg-green-400"
            aria-label={t("ctaWhatsappAria")}
          >
            {t("ctaWhatsapp")}
          </a>
        </div>
      </div>
    </section>
  );
}