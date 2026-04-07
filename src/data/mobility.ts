import type { PrivateRoute, Vehicle } from "@/types";

/** Intro copy — source of truth per client brief (bilingual). */
export const MOBILITY_INTRO = {
  es: "Movilidad Privada Cusco Mascca Tours ofrece servicio de Taxi VIP, con traslado desde y hacia el aeropuerto de Cusco, el Valle Sagrado, entre otras ciudades de Cusco, hoteles, residencias privadas y estaciones de tren, terminal terrestre de Cusco, las 24 horas del día, los 7 días de la semana.",
  en: "Mascca Tours Cusco Private Mobility offers VIP taxi service with transfers to and from Cusco airport, the Sacred Valley, other destinations in the Cusco region, hotels, private residences, train stations, and the Cusco bus terminal — 24 hours a day, 7 days a week.",
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
