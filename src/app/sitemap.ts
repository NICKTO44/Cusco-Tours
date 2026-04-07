import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://cuscomasccatour.com";
  const locales = ["es", "en"];
  const routes = [
    { path: "", priority: 1.0, changeFreq: "weekly" as const },
    { path: "/tours", priority: 0.9, changeFreq: "weekly" as const },
    { path: "/movilidad-privada", priority: 0.9, changeFreq: "monthly" as const },
    { path: "/galeria", priority: 0.6, changeFreq: "monthly" as const },
    { path: "/faq", priority: 0.7, changeFreq: "monthly" as const },
    { path: "/contacto", priority: 0.8, changeFreq: "monthly" as const },
    { path: "/reservas", priority: 0.9, changeFreq: "monthly" as const },
  ];

  return locales.flatMap((locale) =>
    routes.map(({ path, priority, changeFreq }) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: changeFreq,
      priority,
    }))
  );
}