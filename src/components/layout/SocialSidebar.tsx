"use client";

import { motion } from "framer-motion";

const FACEBOOK_URL = "https://www.facebook.com/movilidadprivadacusco"; // TODO: reemplazar
const INSTAGRAM_URL = "https://www.facebook.com/movilidadprivadacusco"; // TODO: reemplazar
const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/Movilidad+Privada+Cusco+Mascca+Tours/@-13.5322723,-71.9416515,971m/data=!3m2!1e3!4b1!4m6!3m5!1s0x916e7f89de770ba3:0xfcaacd3a1bf614b7!8m2!3d-13.5322723!4d-71.9416515!16s%2Fg%2F11q1vsghpb?entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D";

const socialLinks = [
  {
    href: FACEBOOK_URL,
    label: "Facebook",
    bg: "bg-[#1877F2]",
    icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
      </svg>
    ),
  },
  {
    href: INSTAGRAM_URL,
    label: "Instagram",
    bg: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.02-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07c-4.35.2-6.78 2.62-6.98 6.98C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84ZM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4Zm6.41-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44Z" />
      </svg>
    ),
  },
  {
    href: GOOGLE_MAPS_URL,
    label: "Google Maps",
    bg: "bg-[#EA4335]",
    icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 7.05 11.34 7.35 11.6a1 1 0 0 0 1.3 0C12.95 21.34 20 15.25 20 10c0-4.42-3.58-8-8-8Zm0 10.75A2.75 2.75 0 1 1 14.75 10 2.75 2.75 0 0 1 12 12.75Z" />
      </svg>
    ),
  },
];

export function SocialSidebar() {
  return (
    <div className="fixed bottom-5 left-5 z-[60] flex flex-col gap-2 md:bottom-8 md:left-8">
      {socialLinks.map((social, i) => (
        <motion.a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className={`flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg shadow-black/20 ${social.bg}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1 * i,
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          {social.icon}
        </motion.a>
      ))}
    </div>
  );
}