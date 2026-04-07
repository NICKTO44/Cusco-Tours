import type { Tour } from "@/types";

export const TOURS: Tour[] = [
  {
    slug: "machu-picchu-full-day",
    priceUsd: 85,
    durationHours: 12,
    durationLabelKey: "hours",
    includesKey: "machuPicchu",
    image:
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&q=80",
    highlight: true,
  },
  {
    slug: "city-tour-cusco",
    priceUsd: 25,
    durationHours: 4,
    durationLabelKey: "hours",
    includesKey: "cityTour",
    image:
      "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=1200&q=80",
    highlight: true,
  },
  {
    slug: "montana-de-colores",
    priceUsd: 40,
    durationHours: 10,
    durationLabelKey: "hours",
    includesKey: "rainbow",
    image:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
    highlight: true,
  },
  {
    slug: "maras-moray-minas-de-sal",
    priceUsd: 40,
    durationHours: 8,
    durationLabelKey: "hours",
    includesKey: "marasMoray",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80",
    highlight: false,
  },
  {
    slug: "valle-sur",
    priceUsd: 30,
    durationHours: 8,
    durationLabelKey: "hours",
    includesKey: "valleSur",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
    highlight: false,
  },
  {
    slug: "valle-sagrado-vip",
    priceUsd: 40,
    durationHours: 10,
    durationLabelKey: "hours",
    includesKey: "valleSagradoVip",
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80",
    highlight: true,
  },
];

export function getTourBySlug(slug: string): Tour | undefined {
  return TOURS.find((t) => t.slug === slug);
}