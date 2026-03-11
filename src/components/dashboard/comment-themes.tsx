"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { AiTheme } from "@/types/database";

interface CommentThemesProps {
  themes: AiTheme[] | null;
}

export function CommentThemes({ themes: rawThemes }: CommentThemesProps) {
  const t = useTranslations("dashboard");

  // Handle JSONB coming as string from Supabase
  let themes: AiTheme[] | null = null;
  if (rawThemes) {
    if (typeof rawThemes === "string") {
      try {
        themes = JSON.parse(rawThemes);
      } catch {
        themes = null;
      }
    } else if (Array.isArray(rawThemes)) {
      themes = rawThemes;
    }
  }

  if (!themes || themes.length === 0) return null;

  const sentimentVariant = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "success" as const;
      case "negative":
        return "danger" as const;
      default:
        return "default" as const;
    }
  };

  const sentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return (
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-green-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        );
      case "negative":
        return (
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-red-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        );
      default:
        return (
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
          </svg>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-950/[0.03]">
      <h3 className="mb-4 text-[15px] font-semibold tracking-tight text-gray-900">
        {t("commentThemes")}
      </h3>
      <div className="space-y-2.5">
        {themes.map((theme, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-gray-50 bg-warm-bg/50 p-4 transition-colors hover:bg-warm-bg"
          >
            <div className="mt-0.5 flex-shrink-0">
              {sentimentIcon(theme.sentiment)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-medium text-gray-900">{theme.label}</p>
                <Badge variant={sentimentVariant(theme.sentiment)}>
                  {theme.sentiment}
                </Badge>
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-gray-500">{theme.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
