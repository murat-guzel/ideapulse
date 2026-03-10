"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./locale-switcher";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

interface HeaderProps {
  isAuthenticated: boolean;
}

export function Header({ isAuthenticated }: HeaderProps) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Logo size="sm" />
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <nav className="hidden items-center gap-5 text-[13px] sm:flex">
              <Link
                href="/evaluate"
                className="font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                {t("evaluate")}
              </Link>
              <Link
                href="/submit"
                className="font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                {t("submitIdea")}
              </Link>
              <Link
                href="/dashboard"
                className="font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                {t("dashboard")}
              </Link>
            </nav>
          )}
          <LocaleSwitcher />
          {isAuthenticated && (
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              {t("signOut")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
