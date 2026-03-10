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
    <div className="flex items-center gap-0.5 rounded-full border border-gray-200 p-0.5 text-[11px]">
      <button
        onClick={() => switchTo("en")}
        className={cn(
          "rounded-full px-2 py-1 font-medium transition-all",
          locale === "en"
            ? "bg-brand-600 text-white"
            : "text-gray-500 hover:text-gray-900"
        )}
      >
        EN
      </button>
      <button
        onClick={() => switchTo("tr")}
        className={cn(
          "rounded-full px-2 py-1 font-medium transition-all",
          locale === "tr"
            ? "bg-brand-600 text-white"
            : "text-gray-500 hover:text-gray-900"
        )}
      >
        TR
      </button>
    </div>
  );
}
