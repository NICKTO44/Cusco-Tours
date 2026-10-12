export const SITE = {
  name: "Cusco Mascca Tours",
  whatsappE164: "51935220779",
  whatsappDisplay: "+51 935 220 779",
  email: "masccatourscusco@gmail.com",
  url: "https://cuscomasccatour.com",
} as const;

export function whatsappHref(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${SITE.whatsappE164}?text=${encoded}`;
}
