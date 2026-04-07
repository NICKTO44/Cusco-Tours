import { getMobilityPrice } from "@/data/mobility";
import { getTourBySlug } from "@/data/tours";

export function getTourTotalUsd(
  slug: string,
  adults: number,
  children: number,
  priceOverride?: number,
): number | null {
  const price = priceOverride ?? getTourBySlug(slug)?.priceUsd;
  if (!price) return null;
  const n = Math.max(0, adults) + Math.max(0, children);
  if (n < 1) return null;
  return price * n;
}

export function getUsdForService(serviceValue: string): number | null {
  if (serviceValue.startsWith("tour:")) {
    const slug = serviceValue.slice(5);
    return getTourBySlug(slug)?.priceUsd ?? null;
  }
  if (serviceValue.startsWith("mobility:")) {
    const [, routeId, vehicleId] = serviceValue.split(":");
    if (!routeId || !vehicleId) return null;
    return getMobilityPrice(routeId, vehicleId);
  }
  return null;
}
