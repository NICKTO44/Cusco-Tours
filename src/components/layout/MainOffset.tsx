"use client";

import { usePathname } from "@/i18n/routing";

/**
 * Fixed navbar overlays the home hero; inner pages need top padding so content is not hidden.
 */
export function MainOffset({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main className={isHome ? "flex-1" : "flex-1 pt-[72px]"}>{children}</main>
  );
}
