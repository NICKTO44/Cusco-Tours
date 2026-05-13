import type { MetadataRoute } from "next";
import { getTours } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://cuscomasccatour.com";
  const locales = ["es", "en"];
  const now = new Date();

  // Páginas estáticas
  const staticRoutes = [
    { path: "",                    priority: 1.0, changeFreq: "weekly"  as const },
    { path: "/tours",              priority: 0.9, changeFreq: "weekly"  as const },
    { path: "/movilidad-privada",  priority: 0.9, changeFreq: "monthly" as const },
    { path: "/galeria",            priority: 0.6, changeFreq: "monthly" as const },
    { path: "/faq",                priority: 0.7, changeFreq: "monthly" as const },
    { path: "/contacto",           priority: 0.8, changeFreq: "monthly" as const },
    { path: "/reservas",           priority: 0.9, changeFreq: "monthly" as const },
  ];

  const staticEntries = locales.flatMap((locale) =>
    staticRoutes.map(({ path, priority, changeFreq }) => ({
      url: `${base}/${locale}${path}`,
      lastModified: now,
      changeFrequency: changeFreq,
      priority,
      alternates: {
        languages: {
          es: `${base}/es${path}`,
          en: `${base}/en${path}`,
        },
      },
    }))
  );

  // Páginas dinámicas de tours desde Sanity
  let tourEntries: MetadataRoute.Sitemap = [];
  try {
    const tours = await getTours();
    if (tours?.length) {
      tourEntries = locales.flatMap((locale) =>
        tours.map((tour: any) => ({
          url: `${base}/${locale}/tours/${tour.slug}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.85,
          alternates: {
            languages: {
              es: `${base}/es/tours/${tour.slug}`,
              en: `${base}/en/tours/${tour.slug}`,
            },
          },
        }))
      );
    }
  } catch (e) {
    console.error("Sitemap: error fetching tours from Sanity", e);
  }

  return [...staticEntries, ...tourEntries];
}