import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { GALLERY_IMAGES } from "@/data/gallery";
import { getGallery } from "@/lib/queries";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { FadeIn } from "@/components/ui/FadeIn";

type Props = { params: Promise<{ locale: string }> };

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("galleryPage");

  const sanityImages = await getGallery();
  const useSanity = sanityImages && sanityImages.length > 0;

  const images = useSanity
    ? sanityImages.map((img: any) => ({
        src: img.image,
        title: img.title,
        category: img.category,
      }))
    : GALLERY_IMAGES.map((img) => ({ src: img.src }));

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg,rgba(22, 13, 13, 0.98) 0%,rgba(181, 174, 144, 0.54) 100%)" }}>
    {/* Hero */}
<div className="relative bg-jungle-900 py-10 md:py-14 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative mx-auto max-w-6xl px-4">
          <FadeIn>
           
            <h1 className="font-display text-5xl font-bold md:text-7xl">{t("title")}</h1>
            <p className="mt-5 max-w-2xl text-earth-300 text-lg leading-relaxed">{t("subtitle")}</p>
            <div className="mt-6 flex items-center gap-2 text-earth-400 text-sm">
              <span className="w-8 h-px bg-gold-500"></span>
              <span>{images.length} fotos</span>
            </div>
          </FadeIn>
        </div>
      </div>

     {/* Grid */}
<div className="mx-auto max-w-6xl px-4 pt-6 pb-12">
        <GalleryGrid images={images} />
      </div>
    </div>
  );
}
