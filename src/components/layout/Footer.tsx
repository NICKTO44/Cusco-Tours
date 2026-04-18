"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { SITE, whatsappHref } from "@/data/site";

const links = [
  { href: "/tours", key: "tours" as const },
  { href: "/movilidad-privada", key: "mobility" as const },
  { href: "/galeria", key: "gallery" as const },
  { href: "/machu-picchu-tips", key: "tips" as const },
  { href: "/preguntas-frecuentes", key: "faq" as const },
  { href: "/reservas", key: "reservations" as const },
  { href: "/contacto", key: "contact" as const },
];

const socials = [
  { href: "https://www.facebook.com/movilidadprivadacusco", label: "Facebook", icon: "f" },
  { href: "https://instagram.com", label: "Instagram", icon: "ig" },
  { href: "https://tripadvisor.com", label: "TripAdvisor", icon: "ta" },
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
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Mascca Tours Cusco"
              width={140}
              height={52}
              style={{ height: 'auto' }}
              className="brightness-200"
            />
          </Link>
          <p className="mt-4 text-sm text-earth-400 leading-relaxed max-w-xs">
            {tf("tagline")}
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-earth-700 flex items-center justify-center text-xs font-bold text-white hover:bg-jungle-600 transition">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-gold-400 mb-4">
            Navegación
          </p>
          <ul className="space-y-2.5 text-sm">
            {links.map(({ href, key }) => (
              <li key={href}>
                <Link href={href} className="text-earth-400 hover:text-white transition flex items-center gap-1.5">
                  <span className="text-gold-500">›</span> {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-gold-400 mb-4">
            Contacto
          </p>
          <ul className="space-y-3 text-sm text-earth-400">
            <li className="flex items-start gap-2">
              <span className="text-lg">📍</span>
              <span>Cusco, Perú</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg">📞</span>
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="text-gold-400 hover:text-gold-300 font-medium transition">
                {SITE.whatsappDisplay}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg">✉️</span>
              <a href={`mailto:${SITE.email}`} className="hover:text-white transition">
                {SITE.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg">🌐</span>
              <a href={SITE.url} target="_blank" rel="noopener noreferrer"
                className="hover:text-white transition">
                {SITE.url.replace(/^https?:\/\//, "")}
              </a>
            </li>
          </ul>
        </div>

        {/* Horario */}
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-gold-400 mb-4">
            Atención
          </p>
          <ul className="space-y-2.5 text-sm text-earth-400">
            <li className="flex justify-between gap-4">
              <span>Lunes — Viernes</span>
              <span className="text-white">6am — 10pm</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Sábado — Domingo</span>
              <span className="text-white">6am — 10pm</span>
            </li>
            <li className="mt-4 rounded-lg bg-jungle-900/50 border border-jungle-700 px-3 py-2 text-jungle-300 text-xs">
              🕐 Reservas disponibles 24/7 por WhatsApp
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-earth-800 py-5">
        <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-earth-600">
          <span>© {year} {SITE.name}. {tf("rights")}</span>
          
        </div>
      </div>
    </footer>
  );
}
