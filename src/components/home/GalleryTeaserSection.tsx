import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { GALLERY_IMAGES } from "@/data/gallery";
import { getGalleryHighlights } from "@/lib/queries";
import { FadeIn } from "@/components/ui/FadeIn";

export async function GalleryTeaserSection() {
  const t = await getTranslations("sections");

  const sanityImages = await getGalleryHighlights();
  const useSanity = sanityImages && sanityImages.length > 0;
  const images = useSanity ? sanityImages : GALLERY_IMAGES.slice(0, 6);

  return (
    <section className="border-y border-earth-200 bg-white py-6 md:py-10">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <h2 className="font-display text-3xl font-bold text-jungle-800 md:text-4xl">{t("gallery")}</h2>
          <p className="mt-3 max-w-2xl text-earth-600">{t("galleryDesc")}</p>
        </FadeIn>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {useSanity
            ? images.map((img: any, i: number) => (
                <FadeIn key={img.image} delay={i * 0.05}>
                  <div className="relative aspect-square overflow-hidden rounded-xl">
                    <Image
                      src={img.image}
                      alt={img.title ?? "Mascca Tours Cusco"}
                      fill
                      className="object-cover transition duration-700 hover:scale-110"
                      sizes="(max-width:768px) 50vw, 33vw"
                    />
                  </div>
                </FadeIn>
              ))
            : (images as any[]).map((img: any, i: number) => (
                <FadeIn key={img.src} delay={i * 0.05}>
                  <div className="relative aspect-square overflow-hidden rounded-xl">
                    <Image
                      src={img.src}
                      alt="Mascca Tours Cusco"
                      fill
                      className="object-cover transition duration-700 hover:scale-110"
                      sizes="(max-width:768px) 50vw, 33vw"
                    />
                  </div>
                </FadeIn>
              ))}
        </div>
        <FadeIn className="mt-10 text-center" delay={0.15}>
          <Link
            href="/galeria"
            className="inline-flex rounded-full bg-jungle-600 px-8 py-3 font-semibold text-white transition hover:bg-jungle-700"
          >
            {t("viewGallery")}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}