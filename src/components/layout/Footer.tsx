"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { SITE, whatsappHref } from "@/data/site";

const navLinks = [
  { href: "/tours", key: "tours" as const },
  { href: "/movilidad-privada", key: "mobility" as const },
  { href: "/galeria", key: "gallery" as const },
  { href: "/machu-picchu-tips", key: "tips" as const },
  { href: "/preguntas-frecuentes", key: "faq" as const },
  { href: "/reservas", key: "reservations" as const },
  { href: "/contacto", key: "contact" as const },
];

// Tours principales — links directos para que Google los descubra desde el footer
const tourLinks = [
  { href: "/tours/city-tour-cusco",                     label: "City Tour Cusco" },
  { href: "/tours/montana-de-colores-con-cuatrimotos",  label: "Montaña de Colores" },
  { href: "/tours/glaciar-de-quelccaya",                label: "Glaciar de Quelccaya" },
  { href: "/tours/machupicchu-1-day",                   label: "Machu Picchu 1 Day" },
  { href: "/tours/valle-sur",                           label: "Valle Sur" },
  { href: "/tours/laguna-de-humantay",                  label: "Laguna Humantay" },
];

// ⚠️  Reemplaza los href con tus perfiles reales cuando los tengas
const socials = [
  {
    href: "https://www.facebook.com/movilidadprivadacusco",
    label: "Facebook — Mascca Tours Cusco",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
      </svg>
    ),
  },
  {
    href: "https://instagram.com/masccatours", // ← cambia por tu perfil real
    label: "Instagram — Mascca Tours Cusco",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
      </svg>
    ),
  },
  {
    href: "https://www.tripadvisor.com", // ← cambia por tu perfil real
    label: "TripAdvisor — Mascca Tours Cusco",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
      </svg>
    ),
  },
];

export function Footer() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");
  const year = new Date().getFullYear();
  const tw = useTranslations("whatsapp");
  const waUrl = whatsappHref(tw("welcome"));

  return (
    <footer className="bg-[#1a1a1a] text-earth-100">

      {/* Main Footer */}
      <div className="mx-auto max-w-6xl px-4 py-14 grid gap-10 md:grid-cols-4">

        {/* Logo y descripción */}
        <div className="md:col-span-1">
          <Link href="/" aria-label="Mascca Tours Cusco — Inicio">
            <Image
              src="/logo.png"
              alt="Mascca Tours Cusco — Agencia de tours y movilidad privada"
              width={140}
              height={52}
              style={{ height: "auto" }}
              className="brightness-200"
            />
          </Link>
          <p className="mt-4 text-sm text-earth-400 leading-relaxed max-w-xs">
            {tf("tagline")}
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 rounded-full bg-earth-700 flex items-center justify-center text-white hover:bg-jungle-600 transition"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Navegación */}
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-gold-400 mb-4">
            Navegación
          </p>
          <ul className="space-y-2.5 text-sm">
            {navLinks.map(({ href, key }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-earth-400 hover:text-white transition flex items-center gap-1.5"
                >
                  <span className="text-gold-500">›</span> {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Tours principales — links internos para SEO */}
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-gold-400 mb-4">
            Tours en Cusco
          </p>
          <ul className="space-y-2.5 text-sm">
            {tourLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-earth-400 hover:text-white transition flex items-center gap-1.5"
                >
                  <span className="text-gold-500">›</span> {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto + Horario */}
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-gold-400 mb-4">
            Contacto
          </p>
          <ul className="space-y-3 text-sm text-earth-400">
            <li className="flex items-start gap-2">
              <span className="text-lg" aria-hidden="true">📍</span>
              <span>Cusco, Perú</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg" aria-hidden="true">📞</span>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Contactar a Mascca Tours por WhatsApp: ${SITE.whatsappDisplay}`}
                className="text-gold-400 hover:text-gold-300 font-medium transition"
              >
                {SITE.whatsappDisplay}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg" aria-hidden="true">✉️</span>
              <a
                href={`mailto:${SITE.email}`}
                aria-label={`Enviar email a Mascca Tours: ${SITE.email}`}
                className="hover:text-white transition"
              >
                {SITE.email}
              </a>
            </li>
          </ul>

          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-gold-400 mb-3">
            Atención
          </p>
          <ul className="space-y-2 text-sm text-earth-400">
            <li className="flex justify-between gap-4">
              <span>Lun — Dom</span>
              <span className="text-white">6am — 10pm</span>
            </li>
            <li className="mt-3 rounded-lg bg-jungle-900/50 border border-jungle-700 px-3 py-2 text-jungle-300 text-xs">
              🕐 Reservas 24/7 por WhatsApp
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-earth-800 py-5">
        <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-earth-600">
          <span>© {year} {SITE.name}. {tf("rights")}</span>
          <span className="text-earth-700">Cusco, Perú · Tours &amp; Movilidad Privada</span>
        </div>
      </div>

    </footer>
  );
}