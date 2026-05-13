import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { getTourBySlug, getTours } from "@/lib/queries";
import { TOURS } from "@/data/tours";
import { getTourBySlug as getLocalTour } from "@/data/tours";
import { BookingButtons } from "@/components/booking/BookingButtons";
import { FadeIn } from "@/components/ui/FadeIn";
import { GalleryLightbox } from "@/components/tours/GalleryLightbox";
import { TourJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

// Siempre revalidar — evita que Next.js cachee contenido de Sanity
export const revalidate = 0;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const base = "https://cuscomasccatour.com";

  let tour: any = await getTourBySlug(slug);
  if (!tour) tour = getLocalTour(slug);
  if (!tour) return {};

  const t = await getTranslations("tours");
  const name = tour.name ?? t(`items.${tour.slug}.name`);
  const descRaw =
    tour.descriptionEn && locale === "en"
      ? tour.descriptionEn
      : tour.description ?? t(`items.${tour.slug}.long`);

  // Descripción enriquecida para SEO: añade precio y duración si caben
  const priceSnippet = tour.priceUsd
    ? locale === "en"
      ? ` From $${tour.priceUsd} USD per person.`
      : ` Desde $${tour.priceUsd} USD por persona.`
    : "";
  const desc = `${descRaw?.slice(0, 140)}${priceSnippet}`.slice(0, 160);

  const image =
    tour.image ??
    "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1400&q=90";

  // Keywords específicas por tour
  const keywordsEs = [
    name,
    `${name} Cusco`,
    `tour ${name}`,
    "tours Cusco Perú",
    "agencia de viajes Cusco",
    "Mascca Tours",
    ...(tour.difficulty ? [`tour ${tour.difficulty.toLowerCase()} Cusco`] : []),
  ];
  const keywordsEn = [
    name,
    `${name} Cusco Peru`,
    `${name} tour`,
    "Cusco tours Peru",
    "travel agency Cusco",
    "Mascca Tours",
    ...(tour.difficulty ? [`${tour.difficulty.toLowerCase()} tour Cusco`] : []),
  ];

  return {
    title: `${name} | Mascca Tours Cusco`,
    description: desc,
    keywords: locale === "en" ? keywordsEn : keywordsEs,
    alternates: {
      canonical: `${base}/${locale}/tours/${slug}`,
      languages: {
        es: `${base}/es/tours/${slug}`,
        en: `${base}/en/tours/${slug}`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "es_PE",
      url: `${base}/${locale}/tours/${slug}`,
      siteName: "Mascca Tours Cusco",
      title: `${name} | Mascca Tours Cusco`,
      description: desc,
      images: [{ url: image, width: 1400, height: 700, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Mascca Tours Cusco`,
      description: desc,
      images: [image],
    },
  };
}

export async function generateStaticParams() {
  const tours = await getTours();
  const allTours = tours?.length > 0 ? tours : TOURS;
  return allTours.map((t: any) => ({ slug: t.slug }));
}

const difficultyConfig: Record<string, { label: string; labelEn: string; classes: string }> = {
  Facil:    { label: "Fácil",    labelEn: "Easy",     classes: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
  Moderado: { label: "Moderado", labelEn: "Moderate", classes: "bg-amber-100 text-amber-800 border border-amber-200" },
  Dificil:  { label: "Difícil",  labelEn: "Hard",     classes: "bg-red-100 text-red-800 border border-red-200" },
};

export default async function TourDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let tour: any = await getTourBySlug(slug);
  const fromSanity = !!tour;

  if (!tour) tour = getLocalTour(slug);
  if (!tour) notFound();

  const t = await getTranslations("tours");

  const name = fromSanity ? tour.name : t(`items.${tour.slug}.name`);

  const longDesc = fromSanity
    ? (locale === "en" ? tour.descriptionEn : tour.description) ?? ""
    : t(`items.${tour.slug}.long`);

  // Listas bilingues: usa la versión EN si existe, si no cae al ES
  const includesList: string[] = fromSanity
    ? (locale === "en"
        ? (tour.includesEn?.length ? tour.includesEn : tour.includes)
        : tour.includes) ?? []
    : t(`items.${tour.slug}.includes`).split(",").map((s: string) => s.trim());

  const notIncludesList: string[] = fromSanity
    ? (locale === "en"
        ? (tour.notIncludesEn?.length ? tour.notIncludesEn : tour.notIncludes)
        : tour.notIncludes) ?? []
    : [];

  const duration = fromSanity
    ? t("hours", { count: tour.durationHours ?? 0 })
    : tour.durationLabelKey === "fullDay"
    ? t("fullDay")
    : t("hours", { count: tour.durationHours ?? 0 });

  // queries.ts ya añade parámetros de optimización a las URLs de Sanity
  const imageUrl =
    tour.image ??
    "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1400&q=90";

  const gallery: string[] = fromSanity ? (tour.gallery ?? []) : [];

  const difficulty = tour.difficulty ?? null;
  const diffConf = difficulty ? difficultyConfig[difficulty] : null;
  const diffLabel = diffConf
    ? locale === "en" ? diffConf.labelEn : diffConf.label
    : null;

  const descParagraphs = longDesc
    .split("\n")
    .map((l: string) => l.trim())
    .filter((l: string) => l.length > 0);

  // Duración en formato ISO 8601 para Schema.org (ej: PT8H)
  const durationISO = tour.durationHours
    ? `PT${tour.durationHours}H`
    : "";

  return (
    <article className="bg-earth-50 min-h-screen">

      {/* ── Hero ── */}
      <FadeIn>
        <div className="relative w-full overflow-hidden" style={{ height: "clamp(380px, 58vh, 560px)" }}>
          {/*
            unoptimized para CDN de Sanity (ya viene con sus propios params de transformación).
            object-cover + object-center evita el crop distorsionado.
          */}
          {/*
            unoptimized siempre para URLs de Sanity CDN:
            queries.ts ya aplica ?w=1400&q=90&fit=max&auto=format.
            Si Next.js también optimiza, la URL se procesa dos veces → distorsión.
          */}
          <Image
            src={imageUrl}
            alt={name}
            fill
            priority
            unoptimized
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

          {/* Contenido en la parte inferior centrado — como el referente */}
          <div className="absolute bottom-0 left-0 right-0 pb-10 px-5 text-center">

            {/* Etiqueta pequeña encima del título */}
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
              Mascca Tours · Cusco
            </p>

            {/* Título: serif itálica mediana — igual que referente */}
            <h1
              className="font-display leading-tight text-white mx-auto"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                fontStyle: "italic",
                letterSpacing: "-0.01em",
                textShadow: "0 2px 20px rgba(0,0,0,0.6)",
                maxWidth: "820px",
              }}
            >
              {name}
            </h1>



          </div>
        </div>
      </FadeIn>

      {/* ── Layout: contenido + sidebar ── */}
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-10 lg:py-14">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

          {/* ── Columna principal ── */}
          <div className="flex-1 min-w-0">

            {/* Descripción con fuente serif legible */}
            {descParagraphs.length > 0 && (
              <FadeIn delay={0.05}>
                <section className="mb-10">
                  <div className="space-y-5">
                    {descParagraphs.map((line: string, i: number) => (
                      <p
                        key={i}
                        className="text-earth-800"
                        style={{
                          fontFamily: "'Georgia', 'Times New Roman', serif",
                          fontSize: "1.0625rem",
                          lineHeight: "1.9",
                        }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </section>
              </FadeIn>
            )}

            {/* Incluye */}
            {includesList.length > 0 && (
              <FadeIn delay={0.1}>
                <section className="mb-8">
                  <h2 className="font-display text-xl font-semibold text-jungle-800 mb-4 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-jungle-100 text-jungle-700">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </span>
                    {t("includes")}
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {includesList.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 rounded-xl bg-white border border-jungle-100 px-4 py-3">
                        <svg className="w-5 h-5 mt-0.5 shrink-0 text-jungle-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span className="text-sm text-earth-800 leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </FadeIn>
            )}

            {/* No incluye */}
            {notIncludesList.length > 0 && (
              <FadeIn delay={0.15}>
                <section className="mb-10">
                  <h2 className="font-display text-xl font-semibold text-jungle-800 mb-4 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100 text-red-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </span>
                    {locale === "en" ? "Not included" : "No incluye"}
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {notIncludesList.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 rounded-xl bg-white border border-red-100 px-4 py-3">
                        <svg className="w-5 h-5 mt-0.5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                        <span className="text-sm text-earth-700 leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </FadeIn>
            )}

            {/* Galería */}
            {gallery.length > 0 && (
              <FadeIn delay={0.2}>
                <section className="mb-10">
                  <h2 className="font-display text-xl font-semibold text-jungle-800 mb-4">
                    {locale === "en" ? "Gallery" : "Galería"}
                  </h2>
                  <GalleryLightbox images={gallery} tourName={name} />
                </section>
              </FadeIn>
            )}

          </div>

          {/* ── Sidebar ── */}
          <FadeIn delay={0.08}>
            <aside className="w-full lg:w-[300px] shrink-0">
              <div className="sticky top-24 rounded-2xl overflow-hidden shadow-2xl">

                {/* Cabecera premium */}
                <div
                  className="relative px-6 pt-7 pb-6 text-white overflow-hidden"
                  style={{ background: "linear-gradient(145deg, #0f2a1a 0%, #1a4a2e 50%, #2d6a47 100%)" }}
                >
                  {/* Círculo decorativo de fondo */}
                  <div
                    className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
                    style={{ background: "radial-gradient(circle, #d4a843 0%, transparent 70%)" }}
                  />

                  <p className="text-xs uppercase tracking-[0.18em] text-white/40 mb-3">
                    {locale === "en" ? "Price per person" : "Precio por persona"}
                  </p>

                  <div className="flex items-end gap-2 mb-1">
                    <span
                      className="font-bold leading-none"
                      style={{ fontSize: "3.25rem", color: "#d4a843", textShadow: "0 0 30px rgba(212,168,67,0.3)" }}
                    >
                      ${tour.priceUsd}
                    </span>
                    <span className="text-base text-white/35 mb-1.5">USD</span>
                  </div>
                  <p className="text-xs text-white/30">{t("pricePerPersonGroup")}</p>

                  {/* Separador con gradiente */}
                  <div className="mt-5 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)" }} />
                </div>

                {/* Info rápida */}
                <div className="bg-white px-5 py-5 space-y-1 border-b border-stone-100">

                  <div className="flex items-center gap-3 py-2.5 border-b border-stone-50">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
                      style={{ background: "linear-gradient(135deg, #f0faf4, #dcf5e7)" }}>
                      <svg className="w-4 h-4 text-jungle-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                      </svg>
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-earth-400">
                        {locale === "en" ? "Duration" : "Duración"}
                      </p>
                      <p className="text-sm font-bold text-earth-900 mt-0.5">{duration}</p>
                    </div>
                  </div>

                  {diffLabel && diffConf && (
                    <div className="flex items-center gap-3 py-2.5 border-b border-stone-50">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
                        style={{ background: "linear-gradient(135deg, #f0faf4, #dcf5e7)" }}>
                        <svg className="w-4 h-4 text-jungle-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      </span>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-earth-400">
                          {locale === "en" ? "Difficulty" : "Dificultad"}
                        </p>
                        <p className="text-sm font-bold text-earth-900 mt-0.5">{diffLabel}</p>
                      </div>
                    </div>
                  )}

                  {includesList.length > 0 && (
                    <div className="flex items-center gap-3 py-2.5">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
                        style={{ background: "linear-gradient(135deg, #f0faf4, #dcf5e7)" }}>
                        <svg className="w-4 h-4 text-jungle-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </span>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-earth-400">
                          {locale === "en" ? "Included" : "Incluido"}
                        </p>
                        <p className="text-sm font-bold text-earth-900 mt-0.5">
                          {includesList.length}{" "}
                          {locale === "en" ? "services" : "servicios"}
                        </p>
                      </div>
                    </div>
                  )}

                </div>

                {/* CTAs */}
                <div className="bg-white px-5 py-5">
                  <BookingButtons serviceLabel={name} />
                </div>

              </div>
            </aside>
          </FadeIn>

        </div>
      </div>

      {/* Schema.org por tour — ayuda a Google a mostrar rich results */}
      <TourJsonLd
        name={name}
        description={longDesc?.slice(0, 200) ?? ""}
        image={imageUrl}
        price={tour.priceUsd ?? 0}
        duration={durationISO}
        slug={slug}
        includes={includesList}
      />

    </article>
  );
}