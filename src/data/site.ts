export const SITE = {
  name: "Cusco Mascca Tours",
  whatsappE164: "51927591622",
  whatsappDisplay: "+51 927 591 622",
  email: "info@masccatourscusco.com",
  url: "https://cuscomasccatour.com",
} as const;

export function whatsappHref(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${SITE.whatsappE164}?text=${encoded}`;
}
