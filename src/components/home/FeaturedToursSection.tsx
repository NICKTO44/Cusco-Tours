import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { TourCard } from "@/components/tours/TourCard";
import { FadeIn } from "@/components/ui/FadeIn";

export async function FeaturedToursSection({ tours }: { tours: any[] }) {
  const t = await getTranslations("sections");
  const featured = tours.filter((x) => x.highlight === true);

  return (
    <section className="bg-earth-100/60 pt-16 pb-4 md:pt-24 md:pb-6" id="tours">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <h2 className="font-display text-3xl font-bold text-jungle-800 md:text-4xl">
            {t("featuredTours")}
          </h2>
          <p className="mt-3 max-w-2xl text-earth-700">{t("featuredToursDesc")}</p>
        </FadeIn>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.length === 0 && (
            <p className="text-earth-500">No hay tours destacados aún.</p>
          )}
          {featured.map((tour, i) => (
            <FadeIn key={tour.slug} delay={i * 0.08}>
              <TourCard tour={tour} />
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.2} className="mt-12 text-center">
          <Link
            href="/tours"
            className="inline-flex rounded-full border-2 border-jungle-600 px-8 py-3 font-semibold text-jungle-700 transition hover:bg-jungle-600 hover:text-white"
          >
            {t("viewAllTours")}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
