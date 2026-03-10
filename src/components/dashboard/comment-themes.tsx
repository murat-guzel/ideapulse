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
      <div className="space-y-3">
        {themes.map((theme, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-lg border border-gray-100 p-3"
          >
            <Badge variant={sentimentVariant(theme.sentiment)}>
              {theme.sentiment}
            </Badge>
            <div>
              <p className="text-sm font-medium text-gray-900">{theme.label}</p>
              <p className="text-xs text-gray-600">{theme.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
