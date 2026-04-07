"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Link, usePathname } from "@/i18n/routing";
import { LocaleSwitcher } from "./LocaleSwitcher";

const navKeys = [
  { href: "/tours", key: "tours" as const },
  { href: "/movilidad-privada", key: "mobility" as const },
  { href: "/galeria", key: "gallery" as const },
  { href: "/preguntas-frecuentes", key: "faq" as const },
  { href: "/contacto", key: "contact" as const },
];

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    setScrolled(false);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const solid = scrolled || !isHome;
  const overDark = isHome && !scrolled;

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-earth-200/90 bg-earth-50/95 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto grid h-[72px] max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 lg:grid-cols-3 lg:gap-4">
        <Link
          href="/"
          className="relative z-10 flex shrink-0 items-center justify-self-start"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo.png"
            alt="Mascca Tours Cusco"
            width={160}
            height={60}
            className="h-[52px] w-auto max-w-[140px] object-contain object-left sm:h-[60px] sm:max-w-[160px]"
            priority
          />
        </Link>

        <nav
          className={`hidden items-center justify-center gap-8 justify-self-center lg:flex ${
            overDark ? "text-white" : "text-earth-700"
          }`}
        >
          {navKeys.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition ${
                overDark
                  ? "hover:text-white/80"
                  : "hover:text-jungle-600"
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2 justify-self-end sm:gap-3">
          <LocaleSwitcher overDark={overDark} />
          <Link
            href="/reservas"
            className={`hidden rounded-full px-4 py-2 text-sm font-bold shadow-md transition sm:inline-flex ${
              overDark
                ? "bg-yellow-500 text-black hover:bg-yellow-400"
                : "bg-gold-500 text-earth-900 hover:bg-gold-400"
            }`}
          >
            {t("book")}
          </Link>
          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border lg:hidden ${
              overDark
                ? "border-white/40 bg-black/20 text-white"
                : "border-earth-200 bg-white/90 text-earth-800"
            }`}
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1.5">
              <span
                className={`block h-0.5 w-5 transition ${
                  overDark ? "bg-white" : "bg-earth-800"
                } ${open ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 transition ${
                  overDark ? "bg-white" : "bg-earth-800"
                } ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 transition ${
                  overDark ? "bg-white" : "bg-earth-800"
                } ${open ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-earth-200 bg-earth-50 lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navKeys.map(({ href, key }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-earth-800 hover:bg-earth-100"
                >
                  {t(key)}
                </Link>
              ))}
              <Link
                href="/reservas"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-yellow-500 py-3 text-center text-sm font-bold text-black hover:bg-yellow-400"
              >
                {t("book")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
