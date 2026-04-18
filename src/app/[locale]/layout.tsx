import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";
import { MainOffset } from "@/components/layout/MainOffset";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { HtmlLang } from "@/components/layout/HtmlLang";
import { JsonLd } from "@/components/JsonLd";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../../messages/${locale}.json`)).default as {
    metadata: { title: string; description: string };
  };
  const base = "https://cuscomasccatour.com";
  return {
    title: {
      default: messages.metadata.title,
      template: `%s | Cusco Mascca Tours`,
    },
    description: messages.metadata.description,
    metadataBase: new URL(base),
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },
    keywords: locale === "es"
      ? ["tours en Cusco", "tours Cusco Perú", "Machu Picchu tour", "Montaña de Colores", "taxi aeropuerto Cusco", "movilidad privada Cusco", "agencia de viajes Cusco", "Valle Sagrado tour"]
      : ["Cusco tours", "Machu Picchu tour Peru", "Rainbow Mountain", "Cusco airport taxi", "private transfer Cusco", "travel agency Cusco Peru"],
    alternates: {
      canonical: base,
      languages: { es: `${base}/es`, en: `${base}/en` },
    },
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_PE" : "en_US",
      url: base,
      siteName: "Cusco Mascca Tours",
      title: messages.metadata.title,
      description: messages.metadata.description,
      images: [{ url: `${base}/og-image.jpg`, width: 1200, height: 630, alt: "Cusco Mascca Tours" }],
    },
    twitter: {
      card: "summary_large_image",
      title: messages.metadata.title,
      description: messages.metadata.description,
      images: [`${base}/og-image.jpg`],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "es")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <JsonLd />
      <HtmlLang />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <MainOffset>{children}</MainOffset>
        <Footer />
        <WhatsAppFloat />
      </div>
    </NextIntlClientProvider>
  );
}