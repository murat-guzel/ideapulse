"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { Idea } from "@/types/database";
import { getNextIdea } from "@/lib/actions/evaluate";
import { IdeaCard } from "./idea-card";
import { EvaluationForm } from "./evaluation-form";
import { ProgressTracker } from "./progress-tracker";
import { EmptyState } from "./empty-state";

interface EvaluateClientProps {
  initialIdea: Idea | null;
  initialProgress: number;
}

export function EvaluateClient({
  initialIdea,
  initialProgress,
}: EvaluateClientProps) {
  const t = useTranslations("evaluate");
  const [currentIdea, setCurrentIdea] = useState<Idea | null>(initialIdea);
  const [progress, setProgress] = useState(initialProgress);
  const [showThankYou, setShowThankYou] = useState(false);

  const loadNextIdea = useCallback(async () => {
    setShowThankYou(true);
    setProgress((p) => p + 1);

    // Brief delay to show success message
    setTimeout(async () => {
      setShowThankYou(false);
      const { idea } = await getNextIdea();
      setCurrentIdea(idea);
    }, 1000);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-gray-600">{t("subtitle")}</p>
      </div>

      <ProgressTracker completed={progress} />

      {showThankYou ? (
        <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
          <p className="text-lg font-medium text-green-700">{t("thankYou")}</p>
        </div>
      ) : currentIdea ? (
        <div className="space-y-6">
          <IdeaCard idea={currentIdea} />
          <EvaluationForm ideaId={currentIdea.id} onSuccess={loadNextIdea} />
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
