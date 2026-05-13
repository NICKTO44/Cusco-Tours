// ─── Esquema global de la agencia (usado en layout raíz) ───────────────────
export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Mascca Tours Cusco",
    url: "https://cuscomasccatour.com",
    logo: {
      "@type": "ImageObject",
      url: "https://cuscomasccatour.com/logo.png",
      width: 200,
      height: 200,
    },
    image: "https://cuscomasccatour.com/og-image.jpg",
    description:
      "Agencia de tours y movilidad privada en Cusco, Perú. Tours a Machu Picchu, Montaña de Colores, Glaciar Quelccaya, Valle Sagrado y taxi VIP aeropuerto Cusco.",
    telephone: "+51927591622",
    email: "masccatourscusco@gmail.com",
    sameAs: [
      "https://www.facebook.com/movilidadprivadacusco",
      "https://wa.me/51927591622",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Cusco",
      addressLocality: "Cusco",
      addressRegion: "Cusco",
      addressCountry: "PE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -13.53251,
      longitude: -71.941713,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    priceRange: "$$",
    currenciesAccepted: "USD, PEN",
    paymentAccepted: "PayPal, WhatsApp, Efectivo",
    areaServed: [
      { "@type": "City", name: "Cusco" },
      { "@type": "Place", name: "Machu Picchu" },
      { "@type": "Place", name: "Valle Sagrado" },
      { "@type": "Country", name: "Perú" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Tours y Movilidad Privada en Cusco",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: "Machu Picchu Full Day desde Cusco",
            description: "Tour de día completo a Machu Picchu con transporte y guía bilingüe.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: "Montaña de Colores con Cuatrimotos",
            description: "Aventura en cuatrimotos hasta la Rainbow Mountain, 5,036 m.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: "Glaciar de Quelccaya",
            description: "Tour al glaciar tropical más grande del mundo cerca de Cusco.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: "Valle Sagrado de los Incas",
            description: "Recorrido por Pisac, Ollantaytambo y el Valle Sagrado.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Taxi VIP Aeropuerto Cusco",
            description: "Traslado privado desde/hacia el aeropuerto Velasco Astete de Cusco.",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Esquema individual por tour (usado en TourDetailPage) ─────────────────
type TourSchemaProps = {
  name: string;
  description: string;
  image: string;
  price: number;
  duration: string; // e.g. "PT8H"
  slug: string;
  includes?: string[];
};

export function TourJsonLd({
  name,
  description,
  image,
  price,
  duration,
  slug,
  includes = [],
}: TourSchemaProps) {
  const base = "https://cuscomasccatour.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name,
    description,
    image,
    url: `${base}/es/tours/${slug}`,
    touristType: ["Adventure", "Nature", "Cultural"],
    provider: {
      "@type": "TravelAgency",
      name: "Mascca Tours Cusco",
      url: base,
      telephone: "+51927591622",
    },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString().split("T")[0],
      url: `${base}/es/tours/${slug}`,
    },
    itinerary: {
      "@type": "ItemList",
      itemListElement: includes.slice(0, 5).map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item,
      })),
    },
    ...(duration && { duration }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}