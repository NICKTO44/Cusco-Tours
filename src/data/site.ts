export const SITE = {
  name: "Mascca Tours Cusco",
  whatsappE164: "51927591622",
  whatsappDisplay: "+51 927 591 622",
  email: "info@masccatourscusco.com",
  url: "https://masccatourscusco.com",
} as const;

export function whatsappHref(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${SITE.whatsappE164}?text=${encoded}`;
}
