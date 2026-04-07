export function JsonLd() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      name: "Mascca Tours Cusco",
      url: "https://cuscomasccatour.com",
      logo: "https://cuscomasccatour.com/logo.png",
      image: "https://cuscomasccatour.com/og-image.jpg",
      description: "Agencia de tours y movilidad privada en Cusco, Perú. Tours a Machu Picchu, Montaña de Colores, Valle Sagrado y taxi VIP aeropuerto.",
      telephone: "+51927591622",
      email: "info@masccatourscusco.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cusco",
        addressCountry: "PE",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -13.53251,
        longitude: -71.941713,
      },
      openingHours: "Mo-Su 00:00-23:59",
      priceRange: "$$",
      currenciesAccepted: "USD, PEN",
      paymentAccepted: "PayPal, WhatsApp",
      areaServed: ["Cusco", "Machu Picchu", "Valle Sagrado", "Perú"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Tours y Movilidad",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "TouristTrip", name: "Machu Picchu Full Day" } },
          { "@type": "Offer", itemOffered: { "@type": "TouristTrip", name: "Montaña de Colores" } },
          { "@type": "Offer", itemOffered: { "@type": "TouristTrip", name: "Valle Sagrado VIP" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Taxi VIP Aeropuerto Cusco" } },
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