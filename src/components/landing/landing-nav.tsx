"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { LogoIcon } from "@/components/ui/logo";

export function LandingNav() {
  const t = useTranslations("landing");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <nav
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 shadow-sm shadow-gray-950/[0.03] backdrop-blur-xl border-b border-gray-100"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <LogoIcon />
          <span
            className={cn(
              "text-lg font-semibold tracking-tight transition-colors",
              scrolled ? "text-gray-900" : "text-white"
            )}
          >
            Idea<span className={scrolled ? "text-brand-600" : "text-brand-400"}>Pulse</span>
          </span>
        </Link>

        {/* Desktop Right */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#how-it-works"
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              scrolled
                ? "text-gray-500 hover:text-gray-900"
                : "text-white/70 hover:text-white"
            )}
          >
            How It Works
          </a>
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
            className="rounded-full bg-brand-600 px-5 py-2 text-sm font-medium text-white shadow-sm shadow-brand-600/20 transition-all hover:bg-brand-500 hover:shadow-md hover:shadow-brand-500/25"
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
            <a
              href="#how-it-works"
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileOpen(false)}
            >
              How It Works
            </a>
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
          </div>
        </div>
      )}
    </nav>
  );
}
