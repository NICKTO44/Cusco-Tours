export type Locale = "en" | "es";

export type Tour = {
  slug: string;
  priceUsd: number;
  durationHours: number | null;
  durationLabelKey: "fullDay" | "hours";
  includesKey: string;
  image: string;
  highlight?: boolean;
};

export type Vehicle = {
  id: string;
  passengers: number;
  luggage: number;
  image: string;
};

export type PrivateRoute = {
  id: string;
  pricesUsd: Record<string, number>;
};

export type ReservationFormValues = {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  guests: number;
  message?: string;
};

export type WizardReservationValues = {
  serviceType: "tour" | "mobility" | "";
  fullName: string;
  email: string;
  phone: string;
  tourSlug: string;
  tourDate: string;
  adults: number;
  children: number;
  hotelPickup: string;
  pickupTimeApprox: string;
  tourNotes: string;
  routeId: string;
  vehicleId: string;
  mobilityDateTime: string;
  pickupPoint: string;
  destinationPoint: string;
  passengers: number;
  luggage: number;
  mobilityNotes: string;
};
