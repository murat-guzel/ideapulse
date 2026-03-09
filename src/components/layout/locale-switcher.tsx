"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(newLocale: "en" | "tr") {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-0.5 text-xs">
      <button
        onClick={() => switchTo("en")}
        className={cn(
          "rounded-md px-2 py-1 transition-colors",
          locale === "en"
            ? "bg-emerald-600 text-white"
            : "text-gray-600 hover:text-gray-900"
        )}
      >
        EN
      </button>
      <button
        onClick={() => switchTo("tr")}
        className={cn(
          "rounded-md px-2 py-1 transition-colors",
          locale === "tr"
            ? "bg-emerald-600 text-white"
            : "text-gray-600 hover:text-gray-900"
        )}
      >
        TR
      </button>
    </div>
  );
}
