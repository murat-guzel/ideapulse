"use client";

import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("commentThemes")}</CardTitle>
      </CardHeader>
      <div className="space-y-2">
        {themes.map((theme, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5"
          >
            <Badge variant={sentimentVariant(theme.sentiment)}>
              {theme.sentiment}
            </Badge>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-gray-900">{theme.label}</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-gray-500">{theme.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
