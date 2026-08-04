import type { PrivateRoute, Vehicle } from "@/types";

/** Intro copy — source of truth per client brief (bilingual). */
export const MOBILITY_INTRO = {
  es: "Taxi Aeropuerto y Movilidad Privada en Cusco, le ofrece un servicio de transporte turístico seguro, puntual y cómodo con flota propia, viajes seguros,  conductores profesionales,  Realizamos traslados desde y hacia el Aeropuerto de Cusco, hoteles, estación de tren de Ollantaytambo, Hidroeléctrica, Valle Sagrado, Machu Picchu y todos los principales destinos turísticos. Viaje con total tranquilidad disfrutando de atención personalizada, vehículos modernos y tarifas competitivas para viajeros individuales, familias y grupos.",
  en: "Airport Taxi and Private Transport in Cusco, offers a secure, punctual, and comfortable tourist transport service with its own fleet, safe journeys, professional drivers, we carry out transfers from and to the Cusco Airport, hotels, Ollantaytambo train station, Hidroeléctrica, Sacred Valley, Machu Picchu and all the main tourist destinations. Travel with total peace of mind enjoying personalized attention, modern vehicles and competitive rates for individual travelers, families and groups.",
} as const;

export const VEHICLES: Vehicle[] = [
  {
    id: "geely-shaniao",
    passengers: 6,
    luggage: 6,
    image: "/auto1.jpg",
  },
  {
    id: "staria-sbc",
    passengers: 10,
    luggage: 10,
    image: "/auto2.jpg",
  },
  {
    id: "renault-master",
    passengers: 15,
    luggage: 10,
    image: "/auto3.jpg",
  },
  {
    id: "sprinter",
    passengers: 19,
    luggage: 15,
    image: "/auto4.webp",
  },
];

export const PRIVATE_ROUTES: PrivateRoute[] = [
  {
    id: "airport-hotel-cusco",
    pricesUsd: {
      "geely-shaniao": 10,
      "staria-sbc": 20,
      "renault-master": 40,
      sprinter: 50,
    },
  },
  {
    id: "airport-poroy",
    pricesUsd: {
      "geely-shaniao": 25,
      "staria-sbc": 40,
      "renault-master": 60,
      sprinter: 80,
    },
  },
  {
    id: "airport-ollantaytambo",
    pricesUsd: {
      "geely-shaniao": 80,
      "staria-sbc": 120,
      "renault-master": 150,
      sprinter: 180,
    },
  },
  {
    id: "city-tour-5h",
    pricesUsd: {
      "geely-shaniao": 80,
      "staria-sbc": 120,
      "renault-master": 150,
      sprinter: 180,
    },
  },
  {
    id: "city-tour-pisac-9h",
    pricesUsd: {
      "geely-shaniao": 120,
      "staria-sbc": 180,
      "renault-master": 200,
      sprinter: 250,
    },
  },
  {
    id: "laguna-humantay",
    pricesUsd: {
      "geely-shaniao": 180,
      "staria-sbc": 230,
      "renault-master": 250,
      sprinter: 280,
    },
  },
  {
    id: "puente-qeswachaka-4-lagos",
    pricesUsd: {
      "geely-shaniao": 180,
      "staria-sbc": 220,
      "renault-master": 250,
      sprinter: 280,
    },
  },
  {
    id: "maras-moray-ruta-movilidad",
    pricesUsd: {
      "geely-shaniao": 150,
      "staria-sbc": 180,
      "renault-master": 200,
      sprinter: 230,
    },
  },
];

export function getRouteById(id: string): PrivateRoute | undefined {
  return PRIVATE_ROUTES.find((r) => r.id === id);
}

export function getMobilityPrice(routeId: string, vehicleId: string): number | null {
  const route = getRouteById(routeId);
  if (!route) return null;
  const n = route.pricesUsd[vehicleId];
  return typeof n === "number" ? n : null;
}

export function getMinPriceForRoute(routeId: string): number | null {
  const route = getRouteById(routeId);
  if (!route) return null;
  const vals = Object.values(route.pricesUsd);
  if (!vals.length) return null;
  return Math.min(...vals);
}
