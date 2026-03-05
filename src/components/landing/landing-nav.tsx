"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function LandingNav() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("landing");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function switchLocale(newLocale: "en" | "tr") {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <nav
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 shadow-sm backdrop-blur-xl border-b border-gray-100"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span
            className={cn(
              "text-lg font-bold transition-colors",
              scrolled ? "text-gray-900" : "text-white"
            )}
          >
            IdeaPulse
          </span>
        </Link>

        {/* Desktop Right */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Locale Switcher */}
          <div
            className={cn(
              "flex items-center gap-0.5 rounded-full p-0.5 text-xs",
              scrolled
                ? "border border-gray-200 bg-gray-50"
                : "border border-white/20 bg-white/10"
            )}
          >
            <button
              onClick={() => switchLocale("en")}
              className={cn(
                "rounded-full px-2.5 py-1 font-medium transition-all",
                locale === "en"
                  ? "bg-brand-600 text-white"
                  : scrolled
                    ? "text-gray-500 hover:text-gray-900"
                    : "text-white/60 hover:text-white"
              )}
            >
              EN
            </button>
            <button
              onClick={() => switchLocale("tr")}
              className={cn(
                "rounded-full px-2.5 py-1 font-medium transition-all",
                locale === "tr"
                  ? "bg-brand-600 text-white"
                  : scrolled
                    ? "text-gray-500 hover:text-gray-900"
                    : "text-white/60 hover:text-white"
              )}
            >
              TR
            </button>
          </div>

          <Link
            href="/login"
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              scrolled
                ? "text-gray-700 hover:text-gray-900"
                : "text-white/80 hover:text-white"
            )}
          >
            {t("login")}
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-500 hover:shadow-md"
          >
            {t("signup")}
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg md:hidden",
            scrolled ? "text-gray-700" : "text-white"
          )}
        >
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-lg md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {t("login")}
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              {t("signup")}
            </Link>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => switchLocale("en")}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium",
                  locale === "en" ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600"
                )}
              >
                EN
              </button>
              <button
                onClick={() => switchLocale("tr")}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium",
                  locale === "tr" ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600"
                )}
              >
                TR
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
