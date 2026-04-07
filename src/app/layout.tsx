import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

/**
 * Next.js requires exactly one root layout with <html> and <body>.
 * Locale and `lang` are synced after hydration via <HtmlLang /> inside next-intl.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-earth-50 font-sans text-earth-900 antialiased">
        {children}
      </body>
    </html>
  );
}
